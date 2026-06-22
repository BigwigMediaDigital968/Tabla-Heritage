"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Music } from "lucide-react";
import Navbar from "./component/website/Navbar";
import Footer from "./component/website/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-white dark:bg-[#111111] flex items-center justify-center pt-28 pb-16 px-4 overflow-hidden relative">
        {/* ==========================================
          AMBIENT WATERMARK BACKGROUND ACCENTS
         ========================================== */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] dark:opacity-[0.01] pointer-events-none select-none z-0">
          <span className="font-serif font-bold text-[35vw] leading-none tracking-tighter text-primary">
            404
          </span>
        </div>

        <div className="max-w-xl w-full text-center space-y-8 relative z-10">
          {/* Animated Rhythmic Graphic Symbol */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto">
            {/* Pulsing Ripple Rings */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[#c5a880]/20"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute inset-2 rounded-full border border-[#c5a880]/30"
            />

            {/* Center Icon Hub */}
            <div className="w-16 h-16 rounded-full bg-[#c5a880] flex items-center justify-center text-white shadow-md">
              <Music
                size={24}
                className="animate-bounce"
                style={{ animationDuration: "2s" }}
              />
            </div>
          </div>

          {/* Textual Message Stack */}
          <div className="space-y-3">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#c5a880] block"
            >
              Khali Taal / Rhythm Missed
            </motion.span>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Off Beat! Page Not Found
            </h1>

            <div className="h-[2px] w-12 bg-[#c5a880] mx-auto my-4 rounded-full" />

            <p className="font-sans font-light text-neutral-500 dark:text-neutral-400 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
              The cyclical composition has taken an unexpected turn. The beat or
              link you are seeking has slipped outside our structural time
              cycle.
            </p>
          </div>

          {/* ==========================================
            INTERACTIVE RETRIEVAL CALL TO ACTIONS
           ========================================== */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Primary CTA Button: Return Home */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-[#c5a880] hover:bg-[#b3956d] text-white font-sans text-xs sm:text-sm font-semibold rounded-md shadow-md transition-colors duration-200"
            >
              <Home size={15} />
              Back to Home Cycle
            </motion.a>

            {/* Secondary CTA Button: Safe Native History Pop */}
            <motion.button
              onClick={() => window.history.back()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-transparent border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 font-sans text-xs sm:text-sm font-semibold rounded-md transition-colors duration-200"
            >
              <ArrowLeft size={15} />
              Return to Last Beat
            </motion.button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
