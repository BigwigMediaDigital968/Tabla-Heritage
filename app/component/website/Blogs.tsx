"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Calendar, User, ArrowRight } from "lucide-react";
import { formatDate } from "@/app/lib/date";

interface BlogPost {
  id: string;
  title: string;
  bannerImage: string;
  views: string;
  publishedDate: string;
  author: string;
  slug: string;
}

const staticBlogs: BlogPost[] = [
  {
    id: "blog-1",
    title: "The Evolution of Benaras Gharana: Rhythms that Shaped History",
    bannerImage: "/assets/events.png",
    views: "1.2k",
    publishedDate: "June 15, 2026",
    author: "Dinesh Hansraj",
    slug: "evolution-of-benaras-gharana",
  },
  {
    id: "blog-2",
    title: "Understanding Teental: A Beginner's Structural Guide to 16 Beats",
    bannerImage: "/assets/events.png",
    views: "945",
    publishedDate: "May 28, 2026",
    author: "Dinesh Hansraj",
    slug: "understanding-teental-guide",
  },
  {
    id: "blog-3",
    title: "The Art of Riyaz: Core Practice Strategies for Aspiring Players",
    bannerImage: "/assets/events.png",
    views: "2.1k",
    publishedDate: "May 10, 2026",
    author: "Admin",
    slug: "art-of-riyaz-practice-strategies",
  },
  {
    id: "blog-4",
    title:
      "Tabla Accompaniment in Classical Indian Vocal & Kathak Performances",
    bannerImage: "/assets/events.png",
    views: "812",
    publishedDate: "April 18, 2026",
    author: "Dinesh Hansraj",
    slug: "tabla-accompaniment-classical-vocal",
  },
];

export default function Blogs() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
  return (
    <section className="py-10 sm:py-20 dark:bg-[#111111] bg-[#ffe3ba] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==========================================
            SECTION TITLE HEADER
           ========================================== */}
        <div className="text-left mb-12 sm:mb-16 space-y-2">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-primary-light block">
            Insights & Knowledge
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary font-serif">
            From the Tabla Heritage Journals
          </h2>
          <div className="h-1 w-16 bg-primary rounded-full mt-2" />
        </div>

        {/* ==========================================
            ADAPTIVE GRID / SWIPABLE MOBILE CAROUSEL
           ========================================== */}
        {/* Mobile: flex layout, horizontal scroll snap tracking, hiding scrollbars.
          Desktop (lg): transitions cleanly into an explicit 4-column structural grid.
        */}
        <div className="flex lg:grid lg:grid-cols-4 gap-6 sm:gap-8 overflow-x-auto lg:overflow-x-visible snap-x snap-mandatory scrollbar-none pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {[...(staticBlogs)].map((blog, idx) => (
            <motion.a
              key={blog.id}
              href={`/blogs/${blog.slug}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex-shrink-0 w-[290px] sm:w-[340px] lg:w-auto snap-center flex flex-col justify-between bg-white dark:bg-[#161616] border border-neutral-100 dark:border-neutral-800/60 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <div>
                {/* 1. Blog Banner Image */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={blog.bannerImage}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-104"
                  />
                  {/* Subtle Dark Vignette Shade Layer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>

                {/* Card Context Body Container */}
                <div className="p-5 space-y-4">
                  {/* Metadata Indicators Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-sans text-xs text-muted-fg font-light border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                    {/* <div className="flex items-center gap-1">
                      <User size={13} className="text-primary-light/70" />
                      <span>{blog.author}</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <Calendar size={13} className="text-primary-light/70" />
                      {/* <span>{formatDate(blog.updatedAt)}</span> */}
                    </div>
                    <div className="flex items-center gap-1 ml-auto lg:ml-0">
                      <Eye size={13} className="text-primary-light/70" />
                      <span>{blog.views} views</span>
                    </div>
                  </div>

                  {/* 2. Blog Main Title Accentuation */}
                  <h3 className="font-serif text-lg font-bold text-primary group-hover:text-primary-light transition-colors duration-300 line-clamp-3 leading-snug">
                    {blog.title}
                  </h3>
                </div>
              </div>

              {/* 3. Footer Section with Interactive Action Button */}
              <div className="px-5 pb-5 pt-2">
                <div className="inline-flex items-center gap-2 font-sans text-xs font-semibold text-primary-light group-hover:text-primary transition-colors duration-200">
                  <span>Read Article</span>
                  <ArrowRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
