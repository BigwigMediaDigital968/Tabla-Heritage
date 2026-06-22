"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Music } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-[95vh] flex items-end overflow-hidden pt-10 md:pt-64 pb-16 sm:pb-20 lg:pb-24">
      {/* ==========================================
          BACKGROUND IMAGE CANVAS WITH OVERLAY
         ========================================== */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/hero-banner.png" // Replace with your high-resolution background asset path
          alt="Tabla Heritage Classical Lesson Background"
          className="w-full h-full object-cover object-center scale-102"
        />
        {/* Soft, rich vignette gradient layer to ensure crisp readability for the gold/white text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ==========================================
          RESPONSIVE CONTENT ALIGNMENT HUB
         ========================================== */}
      {/* Mobile: Centered stack | Tablet/Desktop: Pushed cleanly to the bottom-right corner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center md:items-end justify-end">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-2xl text-center md:text-right space-y-4 sm:space-y-5"
        >
          {/* Subtle Classical Accent Tag */}
          <div className="flex items-center justify-center md:justify-end gap-2 text-white">
            <Music size={14} className="animate-pulse" />
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em]">
              Varanasi & Benaras Gharana Lineage
            </span>
          </div>

          {/* Core Project Main Heading Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-wide leading-[1.15] drop-shadow-md">
            Nurturing Rhythm, <br />
            <span className="text-[#c5a880] font-light italic font-serif">
              Shaping Indian Artistry
            </span>
          </h1>

          {/* Project Content Description */}
          <p className="font-sans font-light text-sm sm:text-base md:text-lg text-white/90 max-w-lg mx-auto md:mr-0 leading-relaxed drop-shadow-xs">
            Discover traditional compositions, classical dance accompaniment,
            and vibrant folk rhythms under the expert guidance of seasoned
            maestro lineage.
          </p>

          {/* Interactive Action Button linking directly to /contact */}
          <div className="pt-3 flex justify-center md:justify-end">
            <motion.a
              href="/contact"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#c5a880] hover:bg-[#b3956d] text-white font-sans text-xs sm:text-sm font-semibold rounded-md shadow-lg transition-colors duration-200 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore All Services
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
