"use client";

import { motion } from "framer-motion";

export default function TableTitle() {
  return (
    <section className="w-full h-[30vh] min-h-[220px] max-h-[240px] bg-[#b95939] flex flex-col items-center justify-center relative overflow-hidden px-4 select-none">
      <div className="w-full max-w-5xl flex flex-col items-center justify-center relative">
        {/* Primary Heritage Header Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
          className="font-serif text-6xl sm:text-7xl md:text-9xl font-normal text-white tracking-[0.02em] leading-none text-center"
        >
          Tabla Heritage
        </motion.h2>

        {/* Right-Shifted Cursive Subtext Tagline */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="w-full max-w-xs sm:max-w-md md:max-w-5xl flex justify-end mt-2 sm:mt-3 pr-2 sm:pr-6 md:pr-12"
        >
          <span className="font-serif italic font-light text-base sm:text-lg md:text-xl text-amber-100/90 tracking-wide text-right">
            School Of Rhythms
          </span>
        </motion.div>
      </div>
    </section>
  );
}
