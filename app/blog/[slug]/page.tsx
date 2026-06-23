import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import BlogDetail from "../component/BlogDetail";
import Navbar from "@/app/component/website/Navbar";
import Footer from "@/app/component/website/Footer";

type Props = {
  params: Promise<{ slug: string }>;
};

// ── Shared Cached Server Data Access ─────────────────────────────────────
export const getBlogBySlug = cache(async (slug: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/${slug}`,
      {
        next: { revalidate: 300 },
      }
    );

    const data = await res.json();

    return {
      status: res.status,
      ...data,
    };
  } catch (error) {
    console.error("Failed to fetch blog:", error);

    return {
      success: false,
      notFound: true,
    };
  }
});

// ── Next.js Dynamic SEO Generation ───────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);
  const blog = result.data;

  if (!blog) {
    return { title: "Article not found" };
  }

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.shortDescription,
    keywords: blog.metaKeywords,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.shortDescription,
      type: "article",
      publishedTime: new Date(blog.createdAt).toISOString(),
      modifiedTime: new Date(blog.updatedAt).toISOString(),
      images: blog.bannerImage
        ? [{ url: blog.bannerImage, alt: blog.bannerAltText || blog.title }]
        : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getBlogBySlug(slug);

  // Handle 404
  if (!result?.success || result.notFound) {
    notFound();
  }

  // Handle old slug redirect
  if (result.redirected) {
    redirect(`/blog/${result.redirectTo}`);
  }

  const blog = result.data;

  // Generate structured SEO objects on the server
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.metaDescription || blog.shortDescription,
    image: blog.bannerImage ? [blog.bannerImage] : undefined,
    datePublished: new Date(blog.createdAt).toISOString(),
    dateModified: new Date(blog.updatedAt).toISOString(),
    keywords: blog.metaKeywords?.join(", "),
  };

  const faqJsonLd =
    blog.faqs?.length > 0
      ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: blog.faqs.map((faq: any) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
      : null;

  return (
    <>
      <Navbar />

      <article>
        {/* Structural JSON-LD injection fields */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        {faqJsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
          />
        )}

        {/* Render Interface view components safely on Client runtime layers */}
        <BlogDetail blog={blog} />
      </article>
      <Footer />

    </>

  );
}