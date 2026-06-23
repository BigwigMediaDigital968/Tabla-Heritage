"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, Eye, Heart, ArrowLeft, Plus, ChevronDown } from "lucide-react";
import { editorStyles } from "@/app/editor-style";

// Custom theme style overrides
const blogDetailOverrides = `
.blog-detail-content { color: inherit; }
.blog-detail-content a { color: #c5a880; }
.blog-detail-content blockquote {
  border-left: 3px solid #c5a880;
  background: rgba(197, 168, 128, 0.07);
  color: inherit;
}
.blog-detail-content code:not(pre code) {
  background: rgba(197, 168, 128, 0.12);
  color: #946c43;
}
.blog-detail-content mark { background: rgba(197, 168, 128, 0.35); }
.blog-detail-content > p:first-of-type::first-letter {
  font-family: ui-serif, Georgia, serif;
  font-weight: 700;
  font-size: 3.4rem;
  line-height: 0.8;
  float: left;
  padding: 0.05em 0.15em 0 0;
  color: #c5a880;
}
@media (prefers-color-scheme: dark) {
  .blog-detail-content { color: #e5e5e5; }
}
.dark .blog-detail-content h1,
.dark .blog-detail-content h2,
.dark .blog-detail-content h3,
.dark .blog-detail-content h4,
.dark .blog-detail-content h5 { color: #f5f5f5; }
.dark .blog-detail-content blockquote { color: #d4d4d4; }
.dark .blog-detail-content pre { background: #0a0a0a; }
`;

const dummyRelatedBlogs = [
  {
    _id: "dummy-1",
    slug: "curating-the-modern-sanctuary",
    title: "Curating the Modern Sanctuary: Minimalist Objects with Soul",
    shortDescription: "An exploration into why intentional spaces require less noise and more texture, focusing on handcrafted materials that tell a physical story over generations.",
    bannerImage: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600",
    bannerAltText: "A minimal, warm-toned ceramic vase placed on a raw concrete ledge under soft morning light.",
    createdAt: "2026-06-15T09:00:00.000Z"
  },
  {
    _id: "dummy-2",
    slug: "architecture-of-silence-brutalist-retreats",
    title: "The Architecture of Silence: Brutalist Retreats in Nordic Landscapes",
    shortDescription: "Studying the stark, beautiful contrast between geometric concrete monolithic designs and the wild, organic coastlines of Northern Europe.",
    bannerImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600",
    bannerAltText: "A stark geometric concrete structure overlooking a misty, dark volcanic beach skyline.",
    createdAt: "2026-05-28T14:30:00.000Z"
  },
  {
    _id: "dummy-3",
    slug: "quiet-luxury-and-the-art-of-slow-craft",
    title: "Quiet Luxury and the Subversive Return to Slow Textile Craft",
    shortDescription: "Why modern designers are discarding hyper-speed machine processes to embrace small-batch indigo dye treatments and manually woven fibers.",
    bannerImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600",
    bannerAltText: "Close up of heavily textured raw linen fabrics folded neatly in an open-air artist atelier.",
    createdAt: "2026-04-12T11:15:00.000Z"
  }
];


function estimateReadingTime(html: string): string {
  const words = html
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogDetail({ blog }: { blog: any }) {
  const [related, setRelated] = useState<any[]>([]);

  // Client-Side Fetch for Related Articles
  useEffect(() => {
    async function fetchRelated() {
      try {
        const limit = 3;
        const keywords = blog.metaKeywords?.join(",") || "";
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

        const res = await fetch(
          `${baseUrl}/api/blog?keyword=${encodeURIComponent(keywords)}&limit=${limit}`
        );
        if (!res.ok) return;
        const data = await res.json();
        console.log(data)

        let relatedItems = (data.data || []).filter(
          (item: any) => item._id !== blog._id
        );

        // Fallback backfill check
        if (relatedItems.length < limit) {
          const fallbackRes = await fetch(`${baseUrl}/api/blogs?limit=${limit * 2}`);
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            const fallback = (fallbackData.data || []).filter(
              (item: any) =>
                item._id !== blog._id &&
                !relatedItems.some((r: any) => r._id === item._id)
            );
            relatedItems = [...relatedItems, ...fallback];
          }
        }
        setRelated(relatedItems.slice(0, limit));
      } catch (error) {
        console.error("Failed to fetch related blogs on client:", error);
      }
    }

    if (blog?._id) {
      fetchRelated();
    }
  }, [blog]);

  return (
    <>
      {/* ── Styles Injection ── */}
      <style dangerouslySetInnerHTML={{ __html: editorStyles + blogDetailOverrides }} />

      <article className="min-h-screen bg-white dark:bg-[#0a0a0a] selection:bg-[#c5a880]/30 antialiased ">
        {/* ── Minimalist Premium Header Hero ── */}
        <div className="relative w-full h-[95vh] min-h-[380px] max-h-[580px] overflow-hidden bg-neutral-950 flex items-end">
          <img
            src={blog.bannerImage}
            alt={blog.bannerAltText || blog.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-12 z-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c5a880] mb-6 hover:text-white transition-colors duration-300 w-fit group"
            >
              <ArrowLeft size={12} className="transform group-hover:-translate-x-1 transition-transform" />
              Back to Journal
            </Link>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light leading-[1.2] tracking-wide text-white max-w-4xl balance-text">
              {blog.title}
            </h1>

            {/* Metadata Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-y-2 gap-x-6 text-[10px] uppercase tracking-widest font-medium text-neutral-400 border-t border-white/10 pt-5">
              <span className="flex items-center gap-2">
                <Calendar size={12} className="text-[#c5a880]" />
                {formatDate(blog.createdAt)}
              </span>
              <span className="w-1 h-1 bg-neutral-600 rounded-full" />
              <span className="flex items-center gap-2">
                <Clock size={12} className="text-[#c5a880]" />
                {estimateReadingTime(blog.content)} Read
              </span>
              <span className="w-1 h-1 bg-neutral-600 rounded-full hidden sm:block" />
              <span className="flex items-center gap-2">
                <Eye size={12} className="text-[#c5a880]" />
                {blog.views?.toLocaleString()} Views
              </span>
              <span className="w-1 h-1 bg-neutral-600 rounded-full hidden sm:block" />
              <span className="flex items-center gap-2">
                <Heart size={12} className="text-[#c5a880]" />
                {blog.likes?.toLocaleString()} Likes
              </span>
            </div>
          </div>
        </div>

        {/* ── 2-Column Main Workspace ── */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* LEFT COLUMN: Main Blog Content (8/12 Cols) */}
            <div className="lg:col-span-8 space-y-16">
              <p className="text-lg font-light text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-3xl border-b border-neutral-100 dark:border-neutral-900 pb-8 italic">
                {blog.shortDescription}
              </p>

              {/* Core HTML Body Wrapper */}
              <div
                className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-normal text-neutral-800 dark:text-neutral-200"
                style={{ fontSize: '1.05rem', lineHeight: '1.9' }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags Container */}
              {blog.metaKeywords?.length > 0 && (
                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 flex flex-wrap gap-2">
                  {blog.metaKeywords.map((kw: any) => (
                    <span
                      key={kw}
                      className="px-3.5 py-1 text-[10px] font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}

              {/* Accordion FAQs */}
              {blog.faqs?.length > 0 && (
                <section aria-labelledby="faq-heading" className="pt-8 border-t border-neutral-100 dark:border-neutral-900">
                  <h2 id="faq-heading" className="font-serif text-2xl font-light text-neutral-900 dark:text-white mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {blog.faqs.map((faq: any, i: number) => (
                      <details
                        key={i}
                        className="group bg-neutral-50 dark:bg-[#111110] border border-neutral-100 dark:border-neutral-900 rounded-lg open:bg-white dark:open:bg-[#0f0f0e] transition-colors"
                      >
                        <summary className="flex items-center justify-between gap-4 p-4 cursor-pointer list-none font-medium text-sm text-neutral-900 dark:text-white [&::-webkit-details-marker]:hidden">
                          <span>{faq.question}</span>
                          <div className="p-1 rounded-full text-[#c5a880] transition-transform duration-300 group-open:rotate-180 shrink-0">
                            <ChevronDown size={14} />
                          </div>
                        </summary>
                        <div className="px-4 pb-4 pt-1 text-xs font-light text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100/50 dark:border-neutral-900/50">
                          <p>{faq.answer}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* RIGHT COLUMN: Sticky Sidebar Related Articles (4/12 Cols) */}
            {dummyRelatedBlogs.length > 0 && (
              <aside className="lg:col-span-4 space-y-8 border-t lg:border-t-0 lg:border-l border-neutral-100 dark:border-neutral-900 pt-12 lg:pt-0 lg:pl-8">
                <div className="flex items-center gap-3">
                  <span className="h-[1px] w-6 bg-[#c5a880]" />
                  <h3 className="font-serif text-xl font-light tracking-wide text-neutral-900 dark:text-white">
                    Related Journal Entries
                  </h3>
                </div>

                <div className="flex flex-col gap-8">
                  {dummyRelatedBlogs.map((item: any) => (
                    <Link
                      key={item._id}
                      href={`/blog/${item.slug}`}
                      className="group flex flex-col sm:flex-row lg:flex-col gap-4 focus-visible:outline-none"
                    >
                      {/* Compact Image Window */}
                      <div className="relative aspect-[16/10] sm:w-48 lg:w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden rounded-md shrink-0">
                        <img
                          src={item.bannerImage}
                          alt={item.bannerAltText || item.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        />
                      </div>

                      {/* Metadata Content stack */}
                      <div className="space-y-1.5 flex-1">
                        <span className="block text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                          {formatDate(item.createdAt)}
                        </span>
                        <h4 className="font-serif text-base font-normal text-neutral-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#c5a880] transition-colors duration-200">
                          {item.title}
                        </h4>
                        <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
                          {item.shortDescription}
                        </p>
                        <div className="text-[9px] font-bold uppercase tracking-widest text-[#c5a880] pt-2 flex items-center gap-1 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Read Entry <span>→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </aside>
            )}

          </div>
        </div>
      </article>
    </>
  );
}
