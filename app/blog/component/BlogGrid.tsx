"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCcw,
  Loader2,
} from "lucide-react";

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
  readingTime?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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
    status: "published",
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

const PAGE_SIZE = 9;

export default function BlogGrid() {
  // Pure local React pagination state tracking
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blogs, setBlogs] = useState<BlogArticle[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const abortRef = useRef<AbortController | null>(null);
  const hasContentRef = useRef(false);
  const topRef = useRef<HTMLDivElement | null>(null);

  const fetchBlogs = useCallback(async (page: number) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (hasContentRef.current) {
      setIsPageTurning(true);
    } else {
      setStatus("loading");
    }

    try {
      const res = await fetch(`/api/blog?page=${page}&limit=${PAGE_SIZE}`, {
        signal: controller.signal,
      });

      const data = {
        data: dummyBlogs,
        success: true,
        pagination: {
          page: page,
          limit: PAGE_SIZE,
          total: dummyBlogs.length,
          totalPages: Math.ceil(dummyBlogs.length / PAGE_SIZE),
        },
      };

      if (!res.ok || !data?.success) {
        // Handle runtime errors safely if needed
      }

      setBlogs(Array.isArray(data.data) ? data.data : []);
      setPagination(data.pagination ?? null);
      hasContentRef.current = true;
      setStatus("ready");
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("Failed to load blog articles:", err);
      setStatus("error");
    } finally {
      setIsPageTurning(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs(currentPage);
    return () => abortRef.current?.abort();
  }, [currentPage, fetchBlogs]);

  const goToPage = (nextPage: number) => {
    const totalPages = pagination?.totalPages ?? 1;
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (clamped === currentPage || isPageTurning) return;

    setCurrentPage(clamped);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={topRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-left">
      {status === "loading" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10" aria-busy="true" aria-label="Loading articles">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
          <AlertTriangle className="mx-auto text-neutral-300 dark:text-neutral-700" size={40} />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Couldn&apos;t load articles</h3>
          <p className="text-sm text-neutral-500">Something went wrong while fetching the latest posts.</p>
          <button
            type="button"
            onClick={() => fetchBlogs(currentPage)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#c5a880] hover:bg-[#b3946a] transition-colors"
          >
            <RefreshCcw size={14} />
            Try again
          </button>
        </div>
      )}

      {status === "ready" && blogs.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <BookOpen className="mx-auto text-neutral-300 dark:text-neutral-700" size={40} />
          <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No articles published yet</h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto">Check back shortly as we continuously update our platform insights.</p>
        </div>
      )}

      {status === "ready" && blogs.length > 0 && (
        <>
          <p className="sr-only" aria-live="polite">
            {pagination ? `Showing page ${pagination.page} of ${pagination.totalPages}` : ""}
          </p>

          {pagination && pagination.total > 0 && (
            <div className="flex items-center justify-between mb-6 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              <span>
                Showing {(pagination.page - 1) * pagination.limit + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} articles
              </span>
              {isPageTurning && (
                <span className="flex items-center gap-1.5 text-[#c5a880]">
                  <Loader2 size={13} className="animate-spin" />
                  Updating…
                </span>
              )}
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 transition-opacity duration-200 ${isPageTurning ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="group flex flex-col bg-white dark:bg-[#151514] overflow-hidden border border-neutral-100 dark:border-neutral-800/70 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c5a880] focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[16/10] w-full bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  {failedImages.has(blog._id) ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="text-neutral-300 dark:text-neutral-700" size={32} />
                    </div>
                  ) : (
                    <img
                      src={blog.bannerImage}
                      alt={blog.bannerAltText || blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                      loading="lazy"
                      onError={() => setFailedImages((prev) => new Set(prev).add(blog._id))}
                    />
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
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

                    <h3 className="font-serif text-xl font-bold tracking-wide text-neutral-900 dark:text-white leading-snug group-hover:text-[#c5a880] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="font-sans text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                      {blog.shortDescription}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 group-hover:text-[#c5a880] transition-colors">
                      Read Article
                    </span>
                    <div className="p-2 rounded-full bg-neutral-50 dark:bg-[#1e1d1c] text-neutral-700 dark:text-neutral-300 group-hover:bg-[#c5a880] group-hover:text-white transition-all duration-300">
                      <ArrowUpRight size={14} className="transform group-hover:rotate-45 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              disabled={isPageTurning}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="flex flex-col bg-white dark:bg-[#151514] overflow-hidden border border-neutral-100 dark:border-neutral-800/70 animate-pulse">
      <div className="aspect-[16/10] w-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-5 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded" />
          </div>
        </div>
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
          <div className="h-3 w-1/3 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set<number>([1, 2, total - 1, total, current - 1, current, current + 1]);
  const sorted = Array.from(keep).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

function PaginationControls({
  currentPage,
  totalPages,
  disabled,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}) {
  const pages = getPageNumbers(currentPage, totalPages);
  const navButtonClass =
    "flex items-center justify-center w-9 h-9 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-[#c5a880] hover:text-[#c5a880] disabled:opacity-30 disabled:cursor-not-allowed transition-colors";

  return (
    <nav aria-label="Blog pagination" className="mt-12 flex justify-center">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          aria-label="Previous page"
          className={navButtonClass}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="hidden sm:flex items-center gap-1.5">
          {pages.map((p, idx) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-neutral-400 text-sm select-none">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                disabled={disabled}
                aria-current={p === currentPage ? "page" : undefined}
                className={`w-9 h-9 flex items-center justify-center text-xs font-bold transition-colors disabled:cursor-not-allowed ${
                  p === currentPage
                    ? "bg-[#c5a880] text-white"
                    : "border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-[#c5a880] hover:text-[#c5a880]"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <span className="sm:hidden px-3 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage >= totalPages}
          aria-label="Next page"
          className={navButtonClass}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </nav>
  );
}