"use client";

import { motion } from "framer-motion";
import { PhoneCall } from "lucide-react";

export default function CTA() {
  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden py-10 md:py20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex justify-center items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1.0] }}
          className="w-full max-w-4xl text-center p-8 sm:p-12 md:p-16 rounded-brand border border-white/20 dark:border-white/10 bg-white/10 dark:bg-black/10 backdrop-blur-md shadow-lg"
          style={{
            boxShadow: "0 8px 32px 0 rgba(109, 59, 1, 0.15)",
          }}
        >
          {/* Subtitle Accent */}
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.1em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block font-sans text-xs font-bold uppercase text-black tracking-[0.25em] mb-4 drop-shadow-xs"
          >
            Welcome to the World of Rhythm
          </motion.span>

          {/* H1 Main Heading Title above the image background */}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#6d3b01] tracking-wide leading-[1.15] drop-shadow-sm mb-4">
            Master the Ancient Art <br />
            of Tabla & Dholak
          </h2>

          {/* Core Short Description Paragraph */}
          <p className="font-sans font-light text-sm sm:text-base md:text-lg text-black max-w-xl mx-auto leading-relaxed mb-8 drop-shadow-xs">
            Join the premier institution dedicated to premium traditional Indian
            percussion lessons. Catering to all ages and skill levels across the
            Greater Toronto Area.
          </p>

          {/* Interactive Contact Us Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white font-sans text-sm font-semibold rounded-brand shadow-brand hover:bg-primary-light transition-colors duration-300 group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <PhoneCall size={16} />
              Explore Now
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
