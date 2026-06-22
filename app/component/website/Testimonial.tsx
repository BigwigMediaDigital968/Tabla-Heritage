"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  timeAgo: string;
  rating: number;
  content: string;
}

const testimonialData: TestimonialItem[] = [
  {
    id: "review-1",
    name: "Karan",
    role: "Adult Tabla Student",
    timeAgo: "1 week ago",
    rating: 5,
    content:
      "My learning experience here has been incredible. The structured approach to traditional compositions makes it accessible for adults picking up the instrument. Highly professional training environment.",
  },
  {
    id: "review-2",
    name: "Catherine",
    role: "Parent of Student",
    timeAgo: "10 days ago",
    rating: 5,
    content:
      "I love the classes and the instructor's patience is excellent. They respond in a timely manner with detailed information regarding practice routines, metrics, and rhythmic structures.",
  },
  {
    id: "review-3",
    name: "Peter",
    role: "Dholak Student",
    timeAgo: "2 weeks ago",
    rating: 5,
    content:
      "Enrolled for Bollywood and folk accompaniment lessons. The curriculum is perfectly paced, prioritizing hand techniques, balance, and live stage presentation confidence.",
  },
  {
    id: "review-4",
    name: "Rajesh K.",
    role: "Classical Music Enthusiast",
    timeAgo: "3 weeks ago",
    rating: 5,
    content:
      "The deeper historical insight shared into the Benaras and Punjab Gharana structures during practical training sessions makes this school a true center for research.",
  },
];

export default function Testimonial() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Monitor real-time horizontal scroll movement to animate the progress indicator line
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      if (totalScrollable > 0) {
        setScrollProgress((scrollLeft / totalScrollable) * 100);
      }
    }
  };

  // Click handler actions for layout directional buttons
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const offset =
        direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-10 sm:py-20 bg-[#fbfbfb] dark:bg-[#131313] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==========================================
            TOP META SECTION (Trustpilot Identity Match)
           ========================================== */}
        <div className="text-center w-full mb-16 sm:mb-24 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-sans tracking-tight text-[#6d3b01] dark:text-white">
            Read reviews, play with confidence.
          </h2>
          <div className="flex items-center justify-center gap-2 font-sans text-sm text-neutral-500 dark:text-neutral-400 pt-1">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              4.9 / 5
            </span>
            <div className="flex items-center text-[#00b67a]">
              <Star size={16} fill="currentColor" />
              <span className="font-bold ml-1 text-neutral-900 dark:text-white tracking-tight">
                Trustpilot
              </span>
            </div>
            <span>Based on student feedback and community reviews</span>
          </div>
        </div>

        {/* ==========================================
            SPLIT LAYOUT CONTENT MATRIX
           ========================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start w-full">
          {/* LEFT COLUMN: Quote Title Block & Dynamic Progress Bar Indicator */}
          <div className="col-span-1 lg:col-span-4 flex flex-col justify-between h-full space-y-8 lg:sticky lg:top-32 text-left">
            <div className="space-y-4">
              {/* Double Quotation Architectural Accent */}
              <span className="text-neutral-300 dark:text-neutral-800 font-serif text-7xl md:text-8xl block leading-none select-none h-10">
                “
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-neutral-900 dark:text-white leading-tight">
                What our <br />
                customers are <br />
                saying
              </h3>
            </div>

            {/* Slider Controls Bar Layout Row */}
            <div className="flex items-center gap-6 pt-4 lg:pt-12">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900 hover:text-primary transition shadow-xs focus:outline-none cursor-pointer"
                aria-label="Previous Review"
              >
                <ArrowLeft size={16} />
              </button>

              {/* Dynamic Line Progress Indicator Tracker */}
              <div className="w-24 sm:w-32 h-[2px] bg-neutral-200 dark:bg-neutral-800 relative rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-neutral-800 dark:bg-neutral-200"
                  animate={{ width: `${scrollProgress}%` }}
                  transition={{ type: "spring", damping: 30, stiffness: 200 }}
                />
              </div>

              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-neutral-900 hover:text-primary transition shadow-xs focus:outline-none cursor-pointer"
                aria-label="Next Review"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Horizontal Smooth Swipe Container Card Grid */}
          <div className="col-span-1 lg:col-span-8 w-full">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-none px-2 -mx-2 select-none"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {testimonialData.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-[290px] sm:w-[360px] snap-start bg-white dark:bg-[#191919] p-6 sm:p-8 rounded-[24px] border border-neutral-100 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between space-y-6 relative"
                >
                  {/* Card Speech Bubble Tail Flourish */}
                  <div className="absolute bottom-16 -left-2 w-4 h-4 bg-white dark:bg-[#191919] border-l border-b border-neutral-100 dark:border-neutral-800/80 rotate-45 hidden sm:block" />

                  {/* Core Content Body Text */}
                  <p className="font-sans font-light text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed text-left flex-grow">
                    {item.content}
                  </p>

                  {/* Footer metadata segment block */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/50">
                    {/* Star Rating Scale Row */}
                    <div className="flex items-center gap-0.5 text-[#00b67a]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                    </div>

                    <div className="flex items-center justify-between font-sans text-xs text-left">
                      <div>
                        <h4 className="font-semibold text-neutral-900 dark:text-white text-sm">
                          {item.name}
                        </h4>
                        <p className="text-neutral-400 dark:text-neutral-500 font-light mt-0.5">
                          {item.role}
                        </p>
                      </div>
                      <span className="text-neutral-400 dark:text-neutral-500 font-light">
                        {item.timeAgo}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
