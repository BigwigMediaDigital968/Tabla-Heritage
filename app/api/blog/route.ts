import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import Blog from "@/app/models/blog";

// ==========================================
// 1. GET: Fetch Blogs (Public Client / Admin)
// ==========================================
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);

    // Admin request can look for drafts, public client only gets 'published' matching tracks
    const isAdmin = searchParams.get("admin") === "true";
    const queryFilter = isAdmin ? {} : { status: "published" };

    const blogEntries = await Blog.find(queryFilter).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: blogEntries },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Failed to query blog records:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Could not fetch blog entries." },
      { status: 500 },
    );
  }
}

// ==========================================
// 2. POST: Create a New Blog Entry (Admin Only)
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      shortDescription,
      content,
      bannerImage,
      bannerAltText,
      metaTitle,
      metaDescription,
      metaKeywords,
      faqs,
      status,
    } = body;

    // Direct Validation Guard Check
    if (!title || !slug || !content || !bannerImage) {
      return NextResponse.json(
        {
          error:
            "Missing core required parameters: Title, Slug, Content, and Banner Image.",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // Enforce URL path uniqueness constraints manually before write execution
    const slugConflict = await Blog.findOne({
      slug: slug.toLowerCase().trim(),
    });
    if (slugConflict) {
      return NextResponse.json(
        {
          error:
            "This canonical slug is already assigned to an active document instance.",
        },
        { status: 409 },
      );
    }

    const brandNewBlog = await Blog.create({
      title,
      slug: slug.toLowerCase().trim(),
      shortDescription,
      content, // Cloudinary URLs embedded natively within WYSIWYG markup
      bannerImage, // Primary Cloudinary structural URL asset string path
      bannerAltText,
      metaTitle,
      metaDescription,
      metaKeywords: Array.isArray(metaKeywords) ? metaKeywords : [],
      faqs: Array.isArray(faqs) ? faqs : [],
      status: status || "draft",
      slugHistory: [], // Starts empty out of the box
    });

    return NextResponse.json(
      { success: true, data: brandNewBlog },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Blog publication write-operation failure:", error);
    return NextResponse.json(
      {
        error:
          "Internal Server Error. Failed to compile structural registry entry.",
      },
      { status: 500 },
    );
  }
}

// ==========================================
// 3. PATCH/PUT: Edit/Update Fields & Record Slug Redirections
// ==========================================
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Document ID parameter parameter is required." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    // 1. Locate current existing layout properties
    const activeDoc = await Blog.findById(id);
    if (!activeDoc) {
      return NextResponse.json(
        { error: "Target operational blog registry node not found." },
        { status: 404 },
      );
    }

    // 2. Validate clean URL redirection layers if a slug mutates
    if (
      updateFields.slug &&
      updateFields.slug.toLowerCase().trim() !== activeDoc.slug
    ) {
      const prospectiveSlug = updateFields.slug.toLowerCase().trim();

      // Check if prospective path conflicts across other operational items
      const conflictCheck = await Blog.findOne({
        _id: { $ne: id },
        slug: prospectiveSlug,
      });
      if (conflictCheck) {
        return NextResponse.json(
          {
            error:
              "The newly specified slug parameters conflict with an alternating active asset path.",
          },
          { status: 409 },
        );
      }

      // Append old track directly inside structural history with validation timestamp benchmarks
      const redirectionHistoryPayload = {
        oldSlug: activeDoc.slug,
        redirectedAt: new Date(),
      };

      // Set atomic configuration variables
      updateFields.slug = prospectiveSlug;

      // Use Mongo atomic structural updates safely to preserve internal histories
      await Blog.findByIdAndUpdate(id, {
        $push: { slugHistory: redirectionHistoryPayload },
      });
    }

    // 3. Run localized inline collection mutation parameters uniformly
    const fullyUpdatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    return NextResponse.json(
      { success: true, data: fullyUpdatedBlog },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Operational ledger structural mutation failure:", error);
    return NextResponse.json(
      {
        error:
          "Internal Server Error. Failed to balance updated document payload values.",
      },
      { status: 500 },
    );
  }
}

// ==========================================
// 4. DELETE: Drop Blog Record Completely
// ==========================================
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          error:
            "Missing targeted deletion parameter: Unique context payload ID.",
        },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const dropResult = await Blog.findByIdAndDelete(id);

    if (!dropResult) {
      return NextResponse.json(
        { error: "Target data instance could not be found to drop safely." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully removed blog entry from live ledger clusters.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Purge routine crash failure exceptions:", error);
    return NextResponse.json(
      {
        error:
          "Internal Server Error. Processing core deletion parameters crashed.",
      },
      { status: 500 },
    );
  }
}
