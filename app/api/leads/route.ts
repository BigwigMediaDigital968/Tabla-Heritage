import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import leads from "@/app/models/leads";

// ==========================================
// 1. POST: Create a New Lead (Public/Client)
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, serviceInterested, message } =
      body;

    // Server-Side Strict Validation Check
    if (!firstName || !phone || !email || !serviceInterested) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: First Name, Phone, Email, and Service Choice.",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Write to DB with default status explicitly enforced
    const newLead = await leads.create({
      firstName,
      lastName,
      phone,
      email,
      serviceInterested,
      message,
      status: "new", // Explicitly matches your updated schema default setup
    });

    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (error: any) {
    // Catch MongoDB E11000 Duplicate Key Error Code
    if (error.code === 11000) {
      return NextResponse.json(
        {
          error:
            "This email address has already been submitted. Our team will contact you shortly!",
        },
        { status: 409 }, // 409 Conflict is standard for duplicate data entries
      );
    }

    console.error("Database lead submission crash:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 },
    );
  }
}

// ==========================================
// 2. GET: Fetch All Leads (Admin Console)
// ==========================================
export async function GET() {
  try {
    await connectToDatabase();

    // Fetch and sort entries by most recent first
    const dataList = await leads.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: dataList },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Failed to query records:", error);
    return NextResponse.json(
      { error: "Could not fetch entries from cluster ledger." },
      { status: 500 },
    );
  }
}

// ==========================================
// 3. PATCH: Update Status (Single or Bulk)
// ==========================================
export async function PATCH(request: Request) {
  try {
    const { ids, status } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0 || !status) {
      return NextResponse.json(
        {
          error:
            "Missing parameters: Valid target IDs array and Status value are required.",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Updates single or multiple matching documents uniformly
    const updateResult = await leads.updateMany(
      { _id: { $in: ids } },
      { $set: { status } },
    );

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${updateResult.modifiedCount} records to status: ${status}`,
    });
  } catch (error: any) {
    console.error("Failed to update status parameters:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Failed to modify record properties." },
      { status: 500 },
    );
  }
}

// ==========================================
// 4. DELETE: Drop Leads (Single or Bulk)
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        {
          error:
            "Missing parameters: Array of operational payload IDs is required.",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Drops single or multiple matching documents cleanly
    const deleteResult = await leads.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: `Successfully dropped ${deleteResult.deletedCount} records from the collection ledger.`,
    });
  } catch (error: any) {
    console.error("Failed to execute deletion:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Failed to drop selected nodes." },
      { status: 500 },
    );
  }
}
