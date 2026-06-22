import mongoose, { Schema, Document } from "mongoose";

export interface IFAQ {
  question: string;
  answer: string;
}

// Explicit structural tracking parameter for the blog lifecycle status
export type BlogStatusType = "published" | "draft";

export interface IBlog extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  content: string; // Accepts HTML markup from WYSIWYG text editors
  bannerImage: string; // URL string path
  bannerAltText: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[]; // Sanitized array derived from comma-separated input
  likes: number;
  views: number; // Metric tracking analytical parameter
  faqs: IFAQ[];
  status: BlogStatusType; // Explicit blog workflow state management variable
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug identifier string is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    slugHistory: [
      {
        oldSlug: { type: String, required: true },
        redirectedAt: { type: Date, default: Date.now },
      },
    ],
    shortDescription: {
      type: String,
      required: [true, "Short operational snippet summary is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Core content footprint is required"], // Stores raw HTML markup seamlessly
    },
    bannerImage: {
      type: String,
      required: [true, "Banner visual asset destination path is required"],
    },
    bannerAltText: {
      type: String,
      required: [
        true,
        "Alt descriptive metadata is vital for accessibility compliance",
      ],
      trim: true,
    },
    metaTitle: {
      type: String,
      required: [true, "SEO Structural header string is required"],
      trim: true,
    },
    metaDescription: {
      type: String,
      required: [true, "SEO Index snippets are required"],
      trim: true,
    },
    metaKeywords: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0, // Baseline count initialization for analytical updates
    },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["published", "draft"],
      default: "draft", // Ensures all newly compiled records default safely into a draft workflow phase
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  },
);

export default mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema, "blogs");
