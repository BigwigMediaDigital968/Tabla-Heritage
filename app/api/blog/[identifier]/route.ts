import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/app/lib/db";
import Blog from "@/app/models/blog";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  try {
    await connectToDatabase();

    const { identifier } = await params;

    let blog = null;

    // If valid MongoDB ObjectId, try finding by _id
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      blog = await Blog.findById(identifier);
    }

    // If not found, try slug
    if (!blog) {
      blog = await Blog.findOne({ slug: identifier });
    }

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}