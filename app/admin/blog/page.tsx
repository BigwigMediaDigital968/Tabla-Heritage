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

  useEffect(() => {
    fetchBlogsLedger();
  }, []);

  const fetchBlogsLedger = async () => {
    try {
      const res = await fetch("/api/blog?admin=true");
      const resData = await res.json();
      if (resData.success) setBlogs(resData.data);
    } catch (err) {
      console.error("Could not load tracking logs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (blog: Blog) => {
    const toggledStatus = blog.status === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: blog._id, status: toggledStatus }),
      });
      if (res.ok) fetchBlogsLedger();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to permanently purge this blog?"))
      return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchBlogsLedger();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#0c0c0b] text-white p-6 font-sans antialiased text-left">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
              Articles & Blog Posts
            </h1>
            <p className="text-xs text-neutral-400">
              Manage organic search indexing parameters, raw HTML layouts, and
              content logs
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/blog/new")}
            className="px-4 py-2.5 bg-[#c5a880] hover:bg-[#b3956d] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus size={14} /> Add Blog Post
          </button>
        </div>

        {/* Filters Matrix */}
        <div className="w-full bg-[#141312] border border-neutral-800/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full md:max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Filter articles by title mapping parameters or slug queries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1a1917] border border-neutral-800 focus:border-[#c5a880] rounded-xl text-xs text-white focus:outline-none transition-colors"
            />
          </div>
          <div className="text-xs text-neutral-400 font-medium select-none">
            Total Ledger Size: <b>{filteredBlogs.length} items</b>
          </div>
        </div>

        {/* Primary Data Grid Matrix */}
        <div className="bg-[#141312] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1a1917] border-b border-neutral-800 text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                  <th className="p-4">Article details</th>
                  <th className="p-4">Route slug</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Performance Metrics</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-xs">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-neutral-500"
                    >
                      Processing collection ledger logs...
                    </td>
                  </tr>
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-8 text-center text-neutral-500"
                    >
                      No blog documents match the current criteria parameters.
                    </td>
                  </tr>
                ) : (
                  filteredBlogs.map((blog) => (
                    <tr
                      key={blog._id}
                      className="hover:bg-[#1a1917]/40 transition-colors"
                    >
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={blog.bannerImage}
                          alt={blog.bannerAltText}
                          className="w-14 h-10 object-cover rounded-lg border border-neutral-800 bg-[#141312]"
                        />
                        <div className="space-y-0.5">
                          <span className="font-semibold text-white line-clamp-1 block">
                            {blog.title}
                          </span>
                          <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-emerald-400 max-w-[180px] truncate">
                        /{blog.slug}
                        {blog.slugHistory && blog.slugHistory.length > 0 && (
                          <span className="block text-[9px] text-amber-500 font-sans mt-0.5">
                            +{blog.slugHistory.length} historic routes recorded
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleStatusToggle(blog)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer border transition-colors ${
                            blog.status === "published"
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-neutral-800 border-neutral-700 text-neutral-400"
                          }`}
                        >
                          {blog.status}
                        </button>
                      </td>
                      <td className="p-4 text-neutral-300 font-medium">
                        <div className="flex items-center gap-3 text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Eye size={12} className="text-blue-400" />
                            {blog.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} className="text-rose-400" />
                            {blog.likes}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() =>
                              router.push(`/admin/blogs/edit/${blog._id}`)
                            }
                            className="p-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="Edit Fields"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(blog._id)}
                            className="p-1.5 bg-neutral-900 border border-neutral-800 text-neutral-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={14} />
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
    </div>
  );
}
