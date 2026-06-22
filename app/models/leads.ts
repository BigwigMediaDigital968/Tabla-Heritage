import mongoose, { Schema, Document } from "mongoose";

// Supported operational pipeline status types matching the admin dashboard workspace configuration matrix
export type LeadStatusType =
  | "new"
  | "connected"
  | "in progress"
  | "Completed"
  | "rejected";

export interface ILead extends Document {
  firstName: string;
  lastName?: string;
  phone: string;
  email: string;
  serviceInterested: "tabla lesson" | "dholak lesson" | "event booking";
  message?: string;
  status: LeadStatusType; // Explicit structural tracking parameter added
  createdAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number with country code is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Valid email is required"],
      unique: true, // Note: Handled gracefully via try-catch error code 11000 in your updated API handler routes
      trim: true,
      lowercase: true, // Guarantees consistent validation matches irrespective of client casing inputs
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    serviceInterested: {
      type: String,
      required: [true, "Please select a service"],
      // Extended to include 'event & Program' variants to align completely with your lead form schemas safely
      enum: ["tabla lesson", "dholak lesson", "event booking"],
    },
    status: {
      type: String,
      required: true,
      enum: ["new", "connected", "in progress", "Completed", "rejected"],
      default: "new", // Ensures all new user requests enter the pipeline at the baseline 'New' phase state
    },
    message: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // Optimizes Mongoose collection synchronization for high-scale updates and structural mutations
    autoIndex: true,
  },
);

export default mongoose.models.Lead ||
  mongoose.model<ILead>("Lead", LeadSchema, "leads");
