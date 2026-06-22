"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Music,
  Disc,
  Layers,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  Users,
} from "lucide-react";

interface ServiceFeature {
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  tag: string;
}

const trainingServices: ServiceFeature[] = [
  {
    tag: "Classical Lineage",
    title: "Professional Tabla Tutoring",
    description:
      "Immerse yourself in the authentic rhythms of North Indian classical music. Our structured academy curriculum covers traditional compositions, rhythmic math, and time-tested hand techniques across legendary Gharana styles.",
    icon: Music,
    imageSrc: "/assets/tabla-training.png",
    features: [
      "Varanasi & Benaras Gharana compositions",
      "Comprehensive balance & clear syllable execution (Nikash)",
      "Advanced mastery over dynamic time cycles (Taal)",
      "Solo presentation & live structural improvisations",
    ],
  },
  {
    tag: "Vibrant Rhythms",
    title: "Dholak Lessons & Accompaniment",
    description:
      "Unlock the heartbeat of celebratory and folk musical traditions. Students are primarily taught accompaniment frameworks across various genres of North Indian, Bollywood, Chowki, and Folk music.",
    icon: Disc,
    imageSrc: "/assets/dholak-training.png",

    features: [
      "Bollywood rhythm patterns & modern phrasing",
      "Chowki, Bhajan, and devotional event accompaniment",
      "Traditional North Indian folk groove systems",
      "Hand placement velocity & stage presence confidence",
    ],
  },
];

const eventServices: ServiceFeature[] = [
  {
    tag: "Live Performance",
    title: "Traditional Chowki & Bhajan Events",
    description:
      "Elevate your devotional celebrations with experienced, high-velocity percussion accompaniment. We provide professional live backing designed to follow spiritual vocal tracking flawlessly, blending classical discipline with celebratory energy.",
    icon: CalendarDays,
    imageSrc: "/assets/event.png",
    features: [
      "Dynamic real-time tempo modulation",
      "Authentic semi-classical and devotional structures",
      "Coordination with professional acoustic instrumentalists",
      "Custom sonic profiles suited for intimate and grand spaces",
    ],
  },
  {
    tag: "Cultural Programs",
    title: "Corporate & Community Rhythm Programs",
    description:
      "Harness the collaborative power of rhythm. Our interactive group programs and team-building workshops use accessible percussion structures to break down communication barriers, reduce stress, and build unity.",
    icon: Users,
    imageSrc: "/assets/event-1.png",
    features: [
      "Interactive group drum circles and call-and-response drills",
      "Accessible breakdown of rhythmic math for absolute beginners",
      "Cross-cultural correlation to modern workplace collaboration",
      "All instruments provided for scalable group sizes",
    ],
  },
];

// Explicitly typed animation profiles to satisfy TypeScript compiler standards
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function TablaService() {
  return (
    <section className="py-10 sm:py-20 bg-[#fafafa] dark:bg-[#0e0e0e] text-neutral-900 dark:text-neutral-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
        {/* ==========================================
            SECTION 1: INSTRUCTIONAL TUTORING & LESSONS
           ========================================== */}
        <div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-4"
          >
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#c5a880] block">
              Our Educational Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight">
              Traditional Percussion Frameworks
            </h2>
            <div className="h-1 w-16 bg-[#c5a880] mx-auto rounded-full mt-2" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-24"
          >
            {trainingServices.map((service, index) => {
              const IconComponent = service.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="w-full lg:w-1/2 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-[32px] overflow-hidden group shadow-lg">
                    <img
                      src={service.imageSrc}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 bg-white/95 dark:bg-[#111111]/95 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full border border-neutral-200/20 text-[#c5a880]">
                      {service.tag}
                    </span>
                  </div>

                  <div className="w-full lg:w-1/2 space-y-6 text-left">
                    <div className="inline-flex p-3 rounded-2xl bg-[#c5a880]/10 text-[#c5a880] mb-2">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="font-sans font-light text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {service.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-neutral-700 dark:text-neutral-300"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-[#c5a880] flex-shrink-0 mt-0.5"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ==========================================
            SECTION 2: EVENTS & CULTURAL PROGRAMS
           ========================================== */}
        <div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-4"
          >
            <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#c5a880] block">
              Performance & Engagement
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight">
              Events & Cultural Programs
            </h2>
            <div className="h-1 w-16 bg-[#c5a880] mx-auto rounded-full mt-2" />
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-24"
          >
            {eventServices.map((service, index) => {
              const IconComponent = service.icon;
              // Keeps the alternating layout rhythm uniform across different sections
              const isEven = index % 2 !== 0;

              return (
                <motion.div
                  key={service.title}
                  variants={fadeInUp}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="w-full lg:w-1/2 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-[32px] overflow-hidden group shadow-lg">
                    <img
                      src={service.imageSrc}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-4 left-4 bg-white/95 dark:bg-[#111111]/95 text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full border border-neutral-200/20 text-[#c5a880]">
                      {service.tag}
                    </span>
                  </div>

                  <div className="w-full lg:w-1/2 space-y-6 text-left">
                    <div className="inline-flex p-3 rounded-2xl bg-[#c5a880]/10 text-[#c5a880] mb-2">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                      {service.title}
                    </h3>
                    <p className="font-sans font-light text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                      {service.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-neutral-700 dark:text-neutral-300"
                        >
                          <CheckCircle2
                            size={16}
                            className="text-[#c5a880] flex-shrink-0 mt-0.5"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* ==========================================
            PREMIUM CALL TO ACTION PANEL
           ========================================== */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-gradient-to-br from-[#8a4d09] to-[#9e8a6f] rounded-[32px] p-8 sm:p-12 lg:p-16 relative overflow-hidden text-center shadow-xl border border-[#c5a880]/20"
        >
          <div className="absolute top-6 right-8 text-[#c5a880]/15 animate-pulse">
            <Sparkles size={40} />
          </div>
          <div className="absolute bottom-6 left-8 text-[#c5a880]/10">
            <Layers size={60} />
          </div>

          <div className="max-w-2xl mx-auto space-y-5 sm:space-y-6 relative z-10">
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
              Ready to Align with the Rhythm?
            </h3>
            <p className="font-sans font-light text-sm sm:text-base text-neutral-300 leading-relaxed max-w-lg mx-auto">
              Whether you are looking for structured beginner lessons,
              organizing corporate team-building events, or planning live
              traditional accompaniment, let's connect.
            </p>
            <div className="pt-4">
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#c5a880] hover:bg-[#b3956d] text-white font-sans text-xs sm:text-sm font-semibold rounded-md shadow-lg transition-colors duration-200 group"
              >
                Begin Your Musical Journey
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
