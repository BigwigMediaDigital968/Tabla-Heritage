"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ServiceHero() {
  return (
    <section className="w-full bg-white dark:bg-[#111111] mt-14 md:mt-10 py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full relative aspect-[16/10] md:aspect-[21/9] min-h-[460px] rounded-[32px] overflow-hidden shadow-xl group">
        {/* ==========================================
            BACKGROUND CANVAS IMAGE (STRIKING CONTRAST)
           ========================================== */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src="/assets/service-hero.png" // Replace with your contextual premium asset path
            alt="Tabla Heritage Luxury Classical Music Performance Space"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-103"
          />
          {/* Gentle cinematic overlay matching the studio aesthetic */}
          <div className="absolute inset-0 bg-black/15 dark:bg-black/25 pointer-events-none" />
        </div>

        {/* ==========================================
            MAIN CONTENT COMPOSITION MATRIX
           ========================================== */}
        <div className="absolute inset-0 z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-between items-start md:flex-row md:items-end md:justify-between gap-6">
          {/* LEFT CONTENT PORTAL: Premium Frosted Glass Panel Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="w-full max-w-md bg-black/35 dark:bg-[#111111]/45 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-[24px] p-6 sm:p-8 flex flex-col justify-center text-left shadow-lg"
          >
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-wide leading-tight mb-4">
              Crafted with Passion, <br />
              <span className="text-[#c5a880] font-light italic font-serif">
                Made for You!!
              </span>
            </h2>

            <p className="font-sans font-light text-xs sm:text-sm text-white/90 leading-relaxed">
              Have a unique rhythmic vision or a special traditional performance
              project in mind? TABLA HERITAGE is excited to collaborate with you
              on custom lesson tracks, masterclass workshops, and live
              accompaniment design. Contact us today to embark on a traditional
              musical journey that transcends ordinary performance spaces.
            </p>
          </motion.div>

          {/* RIGHT CONTENT PORTAL: Floating CTA Indicator Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="self-end md:self-auto flex justify-end w-full md:w-auto"
          >
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/95 text-neutral-900 hover:bg-white font-sans text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors duration-200 group-hover:shadow-lg"
            >
              Explore
              <ArrowUpRight
                size={15}
                className="text-neutral-500 group-hover:text-neutral-900 transition-colors"
              />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
