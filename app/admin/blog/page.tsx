"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Eye,
  ThumbsUp,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface FAQItem {
  question: string;
  answer: string;
}
interface Blog {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  bannerImage: string;
  bannerAltText: string;
  likes: number;
  views: number;
  faqs: FAQItem[];
  status: "published" | "draft";
  slugHistory?: { oldSlug: string; redirectedAt: string }[];
  createdAt: string;
}

export default function BlogsDashboardPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusChangeTarget, setStatusChangeTarget] = useState<{ blog: any; nextStatus: string } | null>(null);
  const [deleteChangeTarget, setDeleteChangeTarget] = useState<{ id: string; title: string } | null>(null);
  useEffect(() => {
    fetchBlogsLedger();
  }, []);

  const fetchBlogsLedger = async () => {
    try {
      const res = await fetch("/api/blog?admin=true&status=all");
      const resData = await res.json();
      if (resData.success) setBlogs(resData.data);
    } catch (err) {
      console.error("Could not load tracking logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (blog: Blog, status: string) => {
    try {
      const formData = new FormData();

      // Pass the incoming targeted drop-down value explicitly
      formData.append("id", blog._id);
      formData.append("status", status);

      const res = await fetch("/api/blog", {
        method: "PATCH",
        body: formData,
      });

      if (res.ok) {
        // Refresh the local tracking cache ledger matrix state
        toast.success("Status has been changed!")
        fetchBlogsLedger();
      }
    } catch (err) {
      console.error("Failed to commit ledger status change update:", err);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    // if (!confirm("Are you sure you want to permanently purge this blog?"))
    //   return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog has been deleted!")
        fetchBlogsLedger();
      }
    } catch (err) {
      toast.error("Something went wrong!")
      console.error(err);
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-6 text-left animate-fadeIn">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-[var(--primary)]">
              Articles & Blog Posts
            </h1>
            <p className="text-xs text-muted-fg font-light mt-0.5">
              Manage search visibility settings, content entries, and view engagement logs.
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/blog/new")}
            className="px-4 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus size={14} /> Add Blog Post
          </button>
        </div>

        {/* Filters Area */}
        <div className="w-full bg-white border border-border/80 rounded-brand p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-fg"
              size={14}
            />
            <input
              type="text"
              placeholder="Search articles by title or URL slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-bg-main border border-border focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] rounded-xl text-sm text-fg-main focus:outline-none transition-all placeholder:text-neutral-300"
            />
          </div>
          <div className="text-xs text-muted-fg font-medium select-none">
            Total Records: <span className="font-bold text-fg-main">{filteredBlogs.length} items</span>
          </div>
        </div>

        {/* Primary Data Grid Matrix */}
        <div className="bg-white border border-border/80 rounded-brand overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-muted-main border-b border-border text-[11px] uppercase tracking-wider text-muted-fg font-semibold">
                  <th className="p-4">Article Details</th>
                  <th className="p-4">Route Slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Performance Metrics</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm text-fg-main font-light">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-fg">
                      Fetching blog collection collection records...
                    </td>
                  </tr>
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-muted-fg">
                      No articles match your current search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog: any) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-muted-main/40 transition-colors"
                    >
                      {/* Article Info */}
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={blog.bannerImage}
                          alt={blog.bannerAltText || "Article banner"}
                          className="w-14 h-10 object-cover rounded-lg border border-border bg-muted-main shrink-0"
                        />
                        <div className="space-y-0.5 min-w-0">
                          <span className="font-semibold text-fg-main line-clamp-1 block text-sm">
                            {blog.title}
                          </span>
                          <span className="text-[11px] text-muted-fg flex items-center gap-1 font-mono">
                            <Calendar size={11} className="text-neutral-400" />
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Route Slug */}
                      <td className="p-4 font-mono text-xs text-emerald-700 max-w-[180px] truncate">
                        /{blog.slug}
                        {blog.slugHistory && blog.slugHistory.length > 0 && (
                          <span className="block text-[10px] text-amber-600 font-sans mt-0.5">
                            +{blog.slugHistory.length} historic redirect routes
                          </span>
                        )}
                      </td>

                      {/* Status Badge */}
                      <td className="p-4">
                        <div className="relative inline-block">
                          <select
                            value={blog.status}
                            onChange={(e) => {
                              const nextStatus = e.target.value;
                              if (nextStatus !== blog.status) {
                                // Intercept status alteration to invoke verification overlay
                                setStatusChangeTarget({ blog, nextStatus });
                              }
                            }}
                            className={`appearance-none pl-3 pr-8 py-1 rounded-full text-[11px] font-semibold capitalize tracking-wide border cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--primary)] shadow-2xs ${blog.status === "published"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-neutral-100 border-neutral-200 text-neutral-600"
                              }`}
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>

                          {/* Micro Dropdown Arrow Indicator icon overlay */}
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                          </span>
                        </div>
                      </td>

                      {/* Metrics Counters */}
                      <td className="p-4">
                        <div className="flex items-center gap-4 text-xs font-medium text-neutral-500">
                          <span className="flex items-center gap-1 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100 shadow-2xs">
                            <Eye size={13} className="text-blue-500" />
                            {blog.views}
                          </span>
                          <span className="flex items-center gap-1 bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100 shadow-2xs">
                            <ThumbsUp size={12} className="text-rose-500" />
                            {blog.likes}
                          </span>
                        </div>
                      </td>

                      {/* Action Panel Buttons */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/blog/edit/${blog._id}`}
                            className="p-1.5 bg-white border border-border text-muted-fg hover:text-[var(--primary)] hover:bg-muted-main rounded-lg transition-colors cursor-pointer shadow-2xs"
                            title="Edit Article fields"
                          >
                            <Edit3 size={13} />
                          </Link>
                          <button
                            onClick={() => setDeleteChangeTarget({ id: blog._id, title: blog.title })}
                            className="p-1.5 bg-white border border-border text-neutral-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-lg transition-colors cursor-pointer shadow-2xs"
                            title="Delete Permanent Entry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {statusChangeTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-border p-6 rounded-brand space-y-5 text-center shadow-lg">
            <div className="mx-auto w-10 h-10 bg-blue-50 border border-blue-200 text-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-fg-main uppercase tracking-wider">
                Change Article Status?
              </h4>
              <p className="text-xs text-muted-fg font-light leading-relaxed">
                Are you sure you want to change the status of
                <span className="font-semibold text-fg-main block my-1">"{statusChangeTarget.blog.title}"</span>
                from <span className="capitalize font-medium">{statusChangeTarget.blog.status}</span> to{" "}
                <span className="capitalize font-medium text-[var(--primary)]">{statusChangeTarget.nextStatus}</span>?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setStatusChangeTarget(null)}
                className="py-2 text-xs font-semibold bg-muted-main hover:bg-neutral-200 rounded-xl cursor-pointer transition-colors text-fg-main border border-border"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Invoke actual background function execution logic passed from parent props
                  await handleStatusToggle(statusChangeTarget.blog, statusChangeTarget.nextStatus);
                  setStatusChangeTarget(null);
                }}
                className="py-2 text-xs font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-light)] rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
      {deleteChangeTarget && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="w-full max-w-sm bg-white border border-border p-6 rounded-brand space-y-5 text-center shadow-lg">
            {/* Red Alert Icon Block */}
            <div className="mx-auto w-10 h-10 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-bold text-fg-main uppercase tracking-wider">
                Permanently Delete Article?
              </h4>
              <p className="text-xs text-muted-fg font-light leading-relaxed">
                Are you completely sure you want to delete
                <span className="font-semibold text-fg-main block my-1">"{deleteChangeTarget.title}"</span>
                This action will drop the ledger record indexes permanently and cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setDeleteChangeTarget(null)}
                className="py-2 text-xs font-semibold bg-muted-main hover:bg-neutral-200 rounded-xl cursor-pointer transition-colors text-fg-main border border-border"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  // Fires your handler backend call from props using target configuration ID mapping
                  await handleDeleteRecord(deleteChangeTarget.id);
                  setDeleteChangeTarget(null);
                }}
                className="py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl cursor-pointer transition-colors shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
