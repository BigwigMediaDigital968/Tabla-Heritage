"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Sample local image array — Replace these with your actual image paths
const carouselImages: string[] = [
  "/assets/girl-playing-tabla.png",
  "/assets/boy-playing-dholak.png",
  "/assets/musical-event.png",
];

export default function About() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Auto-swipe mechanism: changes image every 4 seconds smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-10 sm:py-20 bg-white dark:bg-[#111111] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ==========================================
              LEFT SIDE: Stylish Automated Image Carousel
             ========================================== */}
          <div className="col-span-1 lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center items-center w-full">
            <div className="relative w-full aspect-[4/5] sm:max-w-md lg:max-w-full rounded-brand overflow-hidden shadow-brand border border-secondary/20 bg-muted-main">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={currentIndex}
                  src={carouselImages[currentIndex]}
                  alt="Tabla Heritage Lessons"
                  initial={{ opacity: 0, scale: 1.08, filter: "blur(4px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Sophisticated Dark Gradient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 via-transparent to-transparent pointer-events-none" />

              {/* Progress Indicator Dots */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1.5 transition-all duration-300 rounded-full focus:outline-none ${
                      idx === currentIndex
                        ? "w-6 bg-secondary"
                        : "w-1.5 bg-white/40 hover:bg-white/60"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ==========================================
              RIGHT SIDE: Brand Story Copywriting
             ========================================== */}
          <div className="col-span-1 lg:col-span-7 order-1 lg:order-2 space-y-6 text-left">
            <div className="space-y-2">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-primary-light block">
                Preserving Musical Legacies
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
                Our Rhythm, Our Heritage
              </h2>
              <div className="h-1 w-20 bg-primary rounded-full mt-2" />
            </div>

            <div className="font-sans text-neutral-700 dark:text-neutral-300 space-y-4 text-base leading-relaxed font-light">
              <p>
                <strong className="font-semibold text-primary">
                  TABLA HERITAGE
                </strong>
                , formerly known as <em>The Tabla Dhyaan</em>, is a premier
                institution dedicated to the sublime art of tabla and dholak
                lessons within the Greater Toronto Area. We cater to students of
                all ages and skill levels, offering comprehensive training and
                education in these traditional Indian percussion instruments.
              </p>
              <p>
                Our school specializes in the intensive study, training, and
                deep research of tabla, fostering a profound understanding and
                structural appreciation for this rich cultural heritage. Over
                the years, our students have actively contributed to numerous
                charitable events and vibrant cultural programs, showcasing
                their talents and beautifully enriching the community.
              </p>
              <p>
                Taal Sadhana remains deeply committed to promoting and nurturing
                exceptionally skilled stage performers who selflessly share
                their artistry at Mandir events, cultural shows, weddings,
                birthdays, and other soulful sangeet celebrations.
              </p>
            </div>

            {/* Interactive Call to Action button */}
            <div className="pt-2">
              <motion.a
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-sans text-sm font-semibold rounded-brand shadow-brand hover:bg-primary-light transition-colors duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Explore Our Programs
                <ChevronRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
