"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Images } from "lucide-react";

export default function GalleryHero() {
  return (
    <section className="relative w-full h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-40 pb-16">
      {/* ==========================================
          BACKGROUND VISUAL CANVAS WITH VINYETTE OVERLAY
         ========================================== */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/gallary-hero.png"
          alt="Tabla Heritage Performance & Masterclass Archives"
          className="w-full h-full object-cover object-center scale-102"
        />
        {/* Balanced multi-layered cinematic vignette for text contrast protection */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40" />
        <div className="absolute inset-0 bg-[#111111]/20 backdrop-blur-[1px]" />
      </div>

      {/* ==========================================
          CENTER ALIGNED TEXT COMPOSITION HUB
         ========================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-2xl space-y-4 sm:space-y-5"
        >
          {/* Subtle Dynamic Icon Tag */}
          <div className="flex items-center justify-center gap-2 text-[#c5a880]">
            <Images size={14} className="animate-pulse" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em]">
              Visual Chronicles
            </span>
          </div>

          {/* Main Display Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
            Moments in{" "}
            <span className="text-[#c5a880] font-light italic">Rhythm</span>
          </h1>

          {/* Elegant Divider line */}
          <div className="h-[2px] w-12 bg-[#c5a880] mx-auto rounded-full my-2" />

          {/* Narrative Core Description */}
          <p className="font-sans font-light text-sm sm:text-base text-neutral-200 max-w-lg mx-auto leading-relaxed drop-shadow-xs">
            Explore a curated look behind the scenes of our classical
            masterclasses, vibrant folk rhythm assemblies, devotional concert
            accompaniment, and student legacy recitals.
          </p>

          {/* Call-to-action button redirecting straight to /contact */}
          <div className="pt-4 flex justify-center">
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c5a880] hover:bg-[#b3956d] text-white font-sans text-xs sm:text-sm font-semibold rounded-md shadow-lg transition-colors duration-200 group"
            >
              Book an Event Collaboration
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
