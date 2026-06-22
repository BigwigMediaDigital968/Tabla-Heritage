"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Music, Heart, Sparkles } from "lucide-react";

export default function AboutTeacher() {
  return (
    <section className="py-10 sm:py-20 bg-white dark:bg-[#111111] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ==========================================
              LEFT SIDE: CREATIVE PORTRAIT HUB
             ========================================== */}
          <div className="col-span-1 lg:col-span-5 relative flex justify-center items-center w-full">
            {/* Artistic Geometric Background Glow Ring */}
            <div className="absolute w-[110%] aspect-square bg-gradient-to-tr from-secondary/40 via-transparent to-primary/5 rounded-full blur-3xl opacity-70 -z-10 pointer-events-none" />

            <div className="relative w-full max-w-sm lg:max-w-full aspect-[4/5] rounded-brand p-3 bg-gradient-to-br from-secondary-dark via-primary/10 to-primary border border-primary/10 shadow-xl group">
              {/* Core Image Canvas */}
              <div className="relative w-full h-full overflow-hidden rounded-[calc(var(--radius)-4px)] bg-neutral-100">
                <img
                  src="/assets/musical-event.png" // Replace with actual path to Dinesh Hansraj's portrait image
                  alt="Dinesh Hansraj - Founder & Tabla Instructor"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-104"
                />

                {/* Elegant overlay shade mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Professional Stat Overlay Box */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute -bottom-6 -left-4 sm:-left-6 bg-white dark:bg-[#161616] border border-primary/10 p-4 rounded-brand shadow-lg flex items-center gap-3.5 max-w-[240px]"
              >
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                  <Award size={20} />
                </div>
                <div className="text-left">
                  <p className="font-serif text-lg font-bold text-primary leading-none">
                    19+ Years
                  </p>
                  <p className="font-sans font-light text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Musical Dedication & Stage Legacy
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* ==========================================
              RIGHT SIDE: COMPREHENSIVE TEXT TIMELINE
             ========================================== */}
          <div className="col-span-1 lg:col-span-7 space-y-8 text-left">
            {/* Section Badging Titles */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary-light">
                <Sparkles size={14} className="animate-spin-slow" />
                <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] block">
                  The Teacher & Founder
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary font-serif">
                Dinesh Hansraj
              </h2>
              <div className="h-[3px] w-16 bg-primary rounded-full mt-2" />
            </div>

            {/* Core Narrative Paragraph Content with custom structural accents */}
            <div className="font-sans text-neutral-700 dark:text-neutral-300 space-y-6 text-base leading-relaxed font-light">
              {/* Highlight Paragraph 1 */}
              <div className="relative pl-6 border-l-2 border-secondary-dark">
                <p>
                  <strong className="font-semibold text-primary">
                    Dinesh Hansraj
                  </strong>{" "}
                  is a dedicated tabla player and student with over 19 years of
                  deep experience, nurtured by a rich musical upbringing. He
                  proudly initiated his classical foundation training under{" "}
                  <span className="font-medium text-neutral-900 dark:text-white">
                    Shrimati Rachna Mehra of the Benaras Gharana
                  </span>
                  , and continues to expand his structural study under the
                  highly respected tabla maestro{" "}
                  <span className="font-medium text-neutral-900 dark:text-white">
                    Pandit Nishikant Barodekar
                  </span>
                  a senior disciple of the legendary Ustad Allah Rakha.
                </p>
              </div>

              {/* Paragraph 2 */}
              <div className="flex gap-4 items-start pt-1">
                <Music
                  size={18}
                  className="text-primary-light flex-shrink-0 mt-1"
                />
                <p>
                  Throughout the years, Dinesh has had the ultimate privilege of
                  performing across a diverse spectrum of settings ranging from
                  prestigious classical concerts and traditional cultural
                  heritage festivals to impactful, charitable, and
                  community-driven events. His dynamic playing beautifully
                  reflects both an absolute respect for ancient tradition and a
                  clean openness to modern collaborative exploration, having
                  worked fluidly alongside vocalists, instrumentalists, and
                  graceful dancers across varied artistic genres.
                </p>
              </div>

              {/* Paragraph 3 */}
              <div className="flex gap-4 items-start">
                <Heart
                  size={18}
                  className="text-primary-light flex-shrink-0 mt-1"
                />
                <p>
                  In addition to active performance, Dinesh is deeply passionate
                  about pedagogy and sharing the pure joy of rhythm with others.
                  He extends specialized lessons to students of all ages and
                  backgrounds, aiming to seamlessly pass down the core
                  foundational pillars of structural discipline, musical
                  creativity, and cultural appreciation through tailored musical
                  training.
                </p>
              </div>

              {/* Paragraph 4 Summary Statement */}
              <p className="bg-secondary-light/30 dark:bg-neutral-900/40 p-4 sm:p-5 rounded-brand border-l-4 border-primary text-neutral-600 dark:text-neutral-300 italic text-sm sm:text-base">
                "Outside of the classroom and stage, Dinesh remains actively
                involved in community arts initiatives that leverage music as a
                powerful tool for connection and human dialogue. His central
                focus stays anchored on continued lifelong learning, active
                service to the art form, and ensuring that the timeless beauty
                of Indian classical music continues to inspire future
                generations."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
