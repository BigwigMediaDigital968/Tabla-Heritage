"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface GalleryImage {
  id: string;
  title: string;
  src: string;
}

const initialImages: GalleryImage[] = [
  {
    id: "gallery-1",
    title: "Vocal Accompaniment Class",
    src: "/assets/event.png",
  },
  {
    id: "gallery-2",
    title: "Traditional Chowki Event",
    src: "/assets/event.png",
  },
  {
    id: "gallery-3",
    title: "Classical Solo Performance",
    src: "/assets/event.png",
  },
  {
    id: "gallery-4",
    title: "Bollywood & Folk Rhythms",
    src: "/assets/event.png",
  },
  {
    id: "gallery-5",
    title: "Kathak Dance Accompaniment",
    src: "/assets/event.png",
  },
];

export default function Gallery() {
  const [activeImageId, setActiveImageId] = useState<string | null>(
    "gallery-3",
  );

  return (
    <section className="py-10 sm:py-20 bg-white dark:bg-[#111111] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* ==========================================
            SECTION HEADER TITLE
           ========================================== */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-primary-light block">
            A Musical Journey
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary font-serif">
            Heritage in Motion
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-2" />
        </div>

        {/* ==========================================
            MOBILE CAROUSEL VIEW (< md)
           ========================================== */}
        <div className="flex md:hidden w-full gap-5 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-none px-4 -mx-4">
          {initialImages.map((image) => (
            <div
              key={`mobile-${image.id}`}
              className="relative flex-shrink-0 w-[82vw] aspect-[4/5] rounded-[10px] overflow-hidden border-2 border-primary/20 shadow-md snap-center"
            >
              {/* Image Canvas */}
              <img
                src={image.src}
                alt={image.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Dark Shading overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Centered Mobile text Badge */}
              <div className="absolute inset-x-0 bottom-6 flex justify-center px-4 z-10">
                <div className="bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md py-2.5 px-5 border border-primary/10 shadow-md rounded-full text-center max-w-[90%]">
                  <p className="font-sans text-xs font-semibold tracking-wide text-primary leading-tight">
                    {image.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ==========================================
            DESKTOP ACCORDION VIEW (≥ md)
           ========================================== */}
        <div className="hidden md:flex w-full gap-4 h-[400px]">
          {initialImages.map((image) => {
            const isActive = activeImageId === image.id;

            return (
              <motion.div
                key={`desktop-${image.id}`}
                onMouseEnter={() => setActiveImageId(image.id)}
                animate={{
                  flexGrow: isActive ? 5 : 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 1, 0.5, 1], // Custom ultra-smooth ease-out
                }}
                className={`relative h-full overflow-hidden rounded-[10px] cursor-pointer transition-all duration-300 border-2 ${
                  isActive
                    ? "border-primary shadow-lg"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
                style={{ flexBasis: "0%" }}
              >
                {/* Image Asset Canvas with subtle reverse scale on expansion */}
                <motion.img
                  src={image.src}
                  alt={image.title}
                  className="absolute inset-0 w-full h-full object-cover origin-center select-none"
                  animate={{
                    scale: isActive ? 1.02 : 1.12,
                  }}
                  transition={{ duration: 0.6 }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                {/* Label Badges - Centered and scaled nicely */}
                <div className="absolute inset-x-0 bottom-6 flex justify-center items-center px-4 z-10 pointer-events-none">
                  <motion.div
                    animate={{
                      maxWidth: isActive ? "90%" : "80px",
                      borderRadius: isActive ? "20px" : "12px",
                      paddingLeft: isActive ? "16px" : "8px",
                      paddingRight: isActive ? "16px" : "8px",
                    }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/95 dark:bg-[#111111]/95 backdrop-blur-md py-2 border border-primary/10 shadow-md overflow-hidden text-center"
                  >
                    <p
                      className={`font-sans text-[10px] sm:text-xs font-semibold tracking-wide text-primary leading-tight transition-all duration-300 ${
                        isActive
                          ? "whitespace-nowrap opacity-100"
                          : "line-clamp-2 text-ellipsis text-[9px] opacity-70"
                      }`}
                    >
                      {image.title}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
