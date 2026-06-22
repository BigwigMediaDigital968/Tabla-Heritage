"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Calendar, Clock, Loader2, BookOpen } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogArticle {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  bannerImage: string;
  bannerAltText: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  faqs: FAQItem[];
  status: "published" | "draft";
  createdAt: string;
  readingTime?: string; // e.g., "5 min read"
}

// Public Facing Dynamic Mock Data Matrix
const dummyBlogs: BlogArticle[] = [
  {
    _id: "blog-1",
    title: "Mastering the Tintal Rhythmic Cycle",
    slug: "mastering-tintal-rhythmic-cycle",
    shortDescription:
      "An in-depth structural breakdown of the foundational 16-beat matrix, standard subdivisions, and composition frameworks for classical performance tracking.",
    content: "<p>Tintal is the king of rhythm tracking cycles...</p>",
    bannerImage:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60",
    bannerAltText: "Classical percussion performance masterclass",
    metaTitle: "Tintal Rhythmic Solo Masterclass",
    metaDescription: "Learn to track and perform intricate Tintal variations.",
    metaKeywords: ["tabla", "tintal", "rhythm"],
    faqs: [],
    status: "published",
    createdAt: "2026-06-15",
    readingTime: "6 min read",
  },
  {
    _id: "blog-2",
    title: "The Evolution of Benares Gharana Compositions",
    slug: "evolution-benares-gharana",
    shortDescription:
      "Exploring historical timeline mutations across prominent performance lineages, specific aesthetic markers, and traditional rhythmic signatures.",
    content:
      "<p>The Benares Gharana introduces unique energetic attributes...</p>",
    bannerImage:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=60",
    bannerAltText: "Acoustic calibration layout instruments",
    metaTitle: "Benares Gharana Evolution Analysis",
    metaDescription:
      "Historical tracking frameworks of traditional North Indian percussion.",
    metaKeywords: ["benares", "gharana", "history"],
    faqs: [],
    status: "published", // Set to published for public consumption
    createdAt: "2026-06-19",
    readingTime: "8 min read",
  },
  {
    _id: "blog-3",
    title: "Calibrating Low-Frequency Bass Resonance",
    slug: "calibrating-low-frequency-bass",
    shortDescription:
      "A practical acoustic guide covering skin alignment mechanics, multi-layer paste balancing, and fine-tuning deep clear tonal resonance.",
    content:
      "<p>Proper calibration prevents muddiness in the tracking matrix...</p>",
    bannerImage:
      "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&auto=format&fit=crop&q=60",
    bannerAltText: "Close-up profile of instrument calibration workspace",
    metaTitle: "Bass Resonance Calibration Guide",
    metaDescription: "How to tune skin structures for pristine projection.",
    metaKeywords: ["tuning", "bass", "acoustics"],
    faqs: [],
    status: "published",
    createdAt: "2026-06-21",
    readingTime: "4 min read",
  },
];

export default function BlogGrid() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPublishedBlogs() {
      try {
        const res = await fetch("/api/blog/list");
        const data = await res.json();

        if (res.ok && data.success && data.blogs?.length > 0) {
          // Filter out drafts automatically on the client fallback layer for protection
          const publicArticles = data.blogs.filter(
            (b: BlogArticle) => b.status === "published",
          );
          setBlogs(publicArticles.length > 0 ? publicArticles : dummyBlogs);
        } else {
          setBlogs(dummyBlogs);
        }
      } catch (err) {
        setBlogs(dummyBlogs);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPublishedBlogs();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-neutral-500 dark:text-neutral-400">
        <Loader2 size={28} className="animate-spin text-[#c5a880]" />
        <p className="text-xs uppercase tracking-widest font-medium">
          Loading Publications...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      {/* Structural Filter Empty Fallback State */}
      {blogs.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <BookOpen
            className="mx-auto text-neutral-300 dark:text-neutral-700"
            size={40}
          />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
            No articles published yet
          </h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto">
            Check back shortly as we continuously update our training modules
            and insights.
          </p>
        </div>
      ) : (
        /* Responsive Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
          {blogs.map((blog) => (
            <article
              key={blog._id}
              onClick={() => router.push(`/blog/${blog.slug}`)}
              className="group flex flex-col bg-white dark:bg-[#151514] overflow-hidden border border-neutral-100 dark:border-neutral-800/70 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {/* Media Asset Window */}
              <div className="relative aspect-[16/10] w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                <img
                  src={blog.bannerImage}
                  alt={blog.bannerAltText || blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-104 select-none"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Text Meta Container */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Inline Metadata Row */}
                  <div className="flex items-center gap-4 text-[11px] font-sans font-medium text-neutral-400 dark:text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(blog.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {blog.readingTime || "5 min read"}
                    </span>
                  </div>

                  {/* Title Header Link */}
                  <h3 className="font-serif text-xl font-bold tracking-wide text-neutral-900 dark:text-white leading-snug group-hover:text-[#c5a880] transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Teaser Paragraph Block */}
                  <p className="font-sans text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                    {blog.shortDescription}
                  </p>
                </div>

                {/* Bottom Interactive Call to Action Layout */}
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between group/btn">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 group-hover:text-[#c5a880] transition-colors">
                    Read Article
                  </span>
                  <div className="p-2 rounded-full bg-neutral-50 dark:bg-[#1e1d1c] text-neutral-700 dark:text-neutral-300 group-hover/btn:bg-[#c5a880] group-hover/btn:text-white transition-all duration-300">
                    <ArrowUpRight
                      size={14}
                      className="transform group-hover/btn:rotate-45 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
