import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";
import Blog from "@/app/models/blog";
import cloudinary from "@/app/lib/cloudinary";

// ==========================================
// Shared helper: upload a banner File to Cloudinary
// ==========================================
async function uploadBannerToCloudinary(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "tabla_heritage_blog", // same folder convention as /api/upload
          resource_type: "auto",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      )
      .end(buffer);
  });

  return uploadResult.secure_url as string;
}

// Pulls and JSON.parses a field that the client sent as a stringified
// array (metaKeywords, faqs) inside multipart/form-data, since FormData
// can only carry strings and files, not nested arrays/objects directly.
function parseJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// ==========================================
// 1. GET: Fetch Blogs (Public Client / Admin)
// ==========================================
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
 
    const isAdmin = searchParams.get("admin") === "true";
 
    // status: defaults to "published" no matter who's asking (admin or
    // public) unless the caller explicitly passes one. status=all drops
    // the filter entirely so admin can browse everything in one call.
    const statusParam = searchParams.get("status");
    const queryFilter: Record<string, any> = {};
 
    if (statusParam === "all") {
      // no status constraint
    } else if (statusParam === "published" || statusParam === "draft") {
      queryFilter.status = statusParam;
    } else {
      queryFilter.status = "published";
    }
 
    // slug: exact lookup, used by post detail pages. Short-circuits the
    // other filters since a slug request wants exactly one document.
    const slug = searchParams.get("slug");
    if (slug) {
      queryFilter.slug = slug.toLowerCase().trim();
    }
 
    // search: case-insensitive partial match against title or shortDescription
    const search = searchParams.get("search")?.trim();
    if (search) {
      const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      queryFilter.$or = [{ title: pattern }, { shortDescription: pattern }];
    }
 
    // tag / keyword: match against metaKeywords array. Accepts either
    // param name and supports comma-separated multiple values (OR match).
    const tagParam = searchParams.get("tag") || searchParams.get("keyword");
    if (tagParam) {
      const tags = tagParam.split(",").map((t) => t.trim()).filter(Boolean);
      if (tags.length) queryFilter.metaKeywords = { $in: tags };
    }
 
    // sort: defaults to newest first, same as before. Accepts
    // sort=oldest to flip direction without inventing new field names.
    const sortParam = searchParams.get("sort");
    const sortOption: Record<string, 1 | -1> =
      sortParam === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
 
    // pagination: optional. Omit page/limit to get the full matching set,
    // preserving the original no-pagination behavior for existing callers.
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.max(1, parseInt(limitParam, 10) || 0) : null;
 
    let queryBuilder = Blog.find(queryFilter).sort(sortOption);
    if (limit) {
      queryBuilder = queryBuilder.skip((page - 1) * limit).limit(limit);
    }
 
    const [blogEntries, total] = await Promise.all([
      queryBuilder,
      limit ? Blog.countDocuments(queryFilter) : Promise.resolve(null),
    ]);
 
    return NextResponse.json(
      {
        success: true,
        data: blogEntries,
        ...(limit !== null && {
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil((total ?? 0) / limit),
          },
        }),
      },
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
    // multipart/form-data because the banner travels as a raw File
    // alongside the rest of the blog fields as plain strings.
    const formData = await request.formData();

    const title = formData.get("title") as string | null;
    const slug = formData.get("slug") as string | null;
    const shortDescription = formData.get("shortDescription") as string | null;
    const content = formData.get("content") as string | null;
    const bannerAltText = formData.get("bannerAltText") as string | null;
    const metaTitle = formData.get("metaTitle") as string | null;
    const metaDescription = formData.get("metaDescription") as string | null;
    const status = formData.get("status") as string | null;
    const metaKeywords = parseJsonField<string[]>(formData, "metaKeywords", []);
    const faqs = parseJsonField<{ question: string; answer: string }[]>(
      formData,
      "faqs",
      [],
    );

    // Banner arrives as either a fresh File (new upload) or a plain
    // "bannerImageUrl" string (kept from an existing post). POST always
    // expects a new file since there's no existing post to fall back to.
    const bannerFile = formData.get("bannerImage");
    const bannerImageUrlField = formData.get("bannerImageUrl") as string | null;

    let bannerImage: string | null = null;
    if (bannerFile instanceof File && bannerFile.size > 0) {
      bannerImage = await uploadBannerToCloudinary(bannerFile);
    } else if (bannerImageUrlField) {
      bannerImage = bannerImageUrlField;
    }

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
    const formData = await request.formData();

    const id = formData.get("id") as string | null;

    if (!id) {
      return NextResponse.json(
        { error: "Document ID parameter parameter is required." },
        { status: 400 },
      );
    }

    // Build the update fields from whatever string fields were sent.
    // Only fields actually present in the FormData are included, so a
    // partial PATCH behaves the same way it would have with JSON.
    const updateFields: Record<string, any> = {};
    const stringFields = [
      "title",
      "slug",
      "shortDescription",
      "content",
      "bannerAltText",
      "metaTitle",
      "metaDescription",
      "status",
    ];
    for (const key of stringFields) {
      const value = formData.get(key);
      if (typeof value === "string") updateFields[key] = value;
    }

    if (formData.has("metaKeywords")) {
      updateFields.metaKeywords = parseJsonField<string[]>(formData, "metaKeywords", []);
    }
    if (formData.has("faqs")) {
      updateFields.faqs = parseJsonField<{ question: string; answer: string }[]>(
        formData,
        "faqs",
        [],
      );
    }

    // Banner: a fresh File means the user picked a new image and it needs
    // uploading; a "bannerImageUrl" string means keep the existing banner
    // as-is (the server still writes it back so model validators relying
    // on bannerImage being present on every save still pass).
    const bannerFile = formData.get("bannerImage");
    const bannerImageUrlField = formData.get("bannerImageUrl") as string | null;

    if (bannerFile instanceof File && bannerFile.size > 0) {
      updateFields.bannerImage = await uploadBannerToCloudinary(bannerFile);
    } else if (bannerImageUrlField) {
      updateFields.bannerImage = bannerImageUrlField;
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
          error.message || "Internal Server Error. Failed to balance updated document payload values.",
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