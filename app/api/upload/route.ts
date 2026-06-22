import { NextResponse } from "next/server";
import cloudinary from "../../lib/cloudinary";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No target file asset detected within payload." },
        { status: 400 },
      );
    }

    // Convert the standard browser Web File into a Node.js compatible buffer segment
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Promise wrapper to stream raw buffer bytes directly up to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "tabla_heritage_blog", // Organizes assets neatly inside a specific folder
            resource_type: "auto", // Handles images, webp layouts, videos etc automatically
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    // Return the clean, definitive secure static absolute image URL destination
    return NextResponse.json(
      {
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Cloudinary connection stream routine failure:", error);
    return NextResponse.json(
      {
        error:
          "Internal Server Error. File distribution upload routines failed.",
      },
      { status: 500 },
    );
  }
}
