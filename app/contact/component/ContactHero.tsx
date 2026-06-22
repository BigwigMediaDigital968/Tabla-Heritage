"use client";

import React from "react";
import { motion } from "framer-motion";
import { PhoneCall, Headphones } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-10 md:pt-36">
      {/* ==========================================
          BACKGROUND VISUAL CANVAS WITH OVERLAY VEIL
         ========================================== */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/assets/contact-hero.png" // Replace with your high-res environmental studio or branding graphic asset
          alt="Connect with Tabla Heritage Classical Studio"
          className="w-full h-full object-cover object-bottom scale-102"
        />
        {/* Multi-layered cinematic overlay to isolate white text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/40" />
        <div className="absolute inset-0 bg-[#111111]/15 backdrop-blur-[0.5px]" />
      </div>

      {/* ==========================================
          CENTER ALIGNED TEXT COMPOSITION MATRIX
         ========================================== */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className="max-w-2xl space-y-4 sm:space-y-5"
        >
          {/* Subtle Accent Branding Pill Tag */}
          <div className="flex items-center justify-center gap-2 text-[#c5a880]">
            <Headphones size={14} className="animate-pulse" />
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em]">
              Direct Communication Channel
            </span>
          </div>

          {/* Main Structural Display Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-wide leading-tight drop-shadow-md">
            Connect With{" "}
            <span className="text-[#c5a880] font-light italic">
              Our Lineage
            </span>
          </h1>

          {/* Elegant Layout Center Divider */}
          <div className="h-[2px] w-12 bg-[#c5a880] mx-auto rounded-full my-2" />

          {/* Narrative Supporting Description Content */}
          <p className="font-sans font-light text-sm sm:text-base text-neutral-200 max-w-lg mx-auto leading-relaxed drop-shadow-xs">
            Have questions about class timings, physical instrument choices, or
            booking live percussion accompaniment for your next event? Drop us a
            line below and let's craft something memorable.
          </p>

          {/* Micro Visual Status Anchor */}
          <div className="pt-2 flex items-center justify-center gap-1.5 text-neutral-400 text-xs font-sans tracking-wide">
            <PhoneCall size={12} className="text-[#c5a880]" />
            <span>Response metric: Typically under 24 hours</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
