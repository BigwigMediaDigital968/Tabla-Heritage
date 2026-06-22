"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music4, Star, CalendarDays, ArrowUpRight, Phone } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  tag: string;
}

const servicesData: ServiceItem[] = [
  {
    id: "tabla-lessons",
    title: "Tabla Lessons",
    description:
      "Traditional compositions are taught to students as well as accompaniment for various genres of music and classical dance.",
    image: "/assets/tabla-lesson.png", // Replace with your image asset path
    icon: <Music4 className="w-5 h-5 text-primary" />,
    tag: "Classical Classical Training",
  },
  {
    id: "dholak-lessons",
    title: "Dholak Lessons",
    description:
      "Students are primarily taught accompaniment for various genres of North Indian, Bollywood, Chowki, and vibrant Folk music.",
    image: "/assets/dholak-lesson.png", // Replace with your image asset path
    icon: <Star className="w-5 h-5 text-primary" />,
    tag: "Folk & Bollywood Accompaniement",
  },
  {
    id: "events-programs",
    title: "Events & Programs",
    description:
      "Contact us to hire professional, seasoned Tabla and Dholak players for any of your events, including corporate and charitable programs.",
    image: "/assets/events.png", // Replace with your image asset path
    icon: <CalendarDays className="w-5 h-5 text-primary" />,
    tag: "Live Concerts & Charity",
  },
];

export default function Service() {
  return (
    <section className="py-10 sm:py-20 bg-secondary-light/30 dark:bg-[#161616] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==========================================
            SECTION HEADER
           ========================================== */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20 space-y-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-primary-light block">
            Our Offerings
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary font-serif">
            Nurturing Rhythm, Shaping Artistry
          </h2>
          <div className="h-1 w-16 bg-primary mx-auto rounded-full mt-2" />
        </div>

        {/* ==========================================
            UNIQUELY DESIGNED SERVICES GRID
           ========================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {servicesData.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
              className="group relative flex flex-col justify-between h-[400px] rounded-brand bg-white dark:bg-[#111111] overflow-hidden border border-primary/5 shadow-md hover:shadow-xl transition-all duration-500"
            >
              {/* Card Upper Half: Visual Asset Frame with Clip Path Effect */}
              <div className="relative w-full h-[220px] overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />

                {/* Visual Ambient Color Grading Vignettes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

                {/* Floating Architectural Badge */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xs px-3 py-1 rounded-full border border-primary/10 shadow-sm">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-primary-light block">
                    {service.tag}
                  </span>
                </div>

                {/* Corner Architectural Icon Hub */}
                <div className="absolute bottom-8 right-4 translate-y-1/2 w-10 h-10 rounded-full bg-secondary-dark border-4 border-white dark:border-[#111111] flex items-center justify-center shadow-sm transition-transform duration-500 group-hover:rotate-12">
                  {service.icon}
                </div>
              </div>

              {/* Card Lower Half: Meta Text Frame */}
              <div className="flex-grow p-6 flex flex-col justify-between items-start text-left bg-gradient-to-b from-transparent to-primary/2">
                <div className="space-y-3 w-full">
                  <h3 className="font-serif text-xl font-bold text-primary group-hover:text-primary-light transition-colors duration-300 flex items-center justify-between">
                    {service.title}
                    <ArrowUpRight
                      size={16}
                      className="text-primary/30 group-hover:text-primary-light group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                    />
                  </h3>

                  <p className="font-sans font-light text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-4">
                    {service.description}
                  </p>
                </div>

                {/* Subtle Micro-Accent Bar Anchor */}
                <div className="w-8 h-[2px] bg-primary/20 group-hover:w-full transition-all duration-500 ease-out mt-4" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* ==========================================
            BOTTOM GLOBAL CALL TO ACTION
           ========================================== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <motion.a
            href="/contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-primary text-white font-sans text-sm font-semibold rounded-brand shadow-brand hover:bg-primary-light transition-colors duration-300 group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Phone size={16} className="animate-pulse" />
            Connect With Our Instructors
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
