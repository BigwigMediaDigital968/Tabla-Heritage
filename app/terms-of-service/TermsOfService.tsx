"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Scale,
  FileEdit,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  Calendar,
} from "lucide-react";

export default function TermsOfService() {
  const currentYear = new Date().getFullYear();

  return (
    <section className="min-h-screen bg-white dark:bg-[#111111] text-neutral-900 dark:text-neutral-100 pt-36 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full">
        {/* ==========================================
            BACK BUTTON NAVIGATION
           ========================================== */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-neutral-500 hover:text-[#c5a880] transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Back to Home
          </a>
        </motion.div>

        {/* ==========================================
            HEADER STACK WITH ICON BRANDING
           ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="space-y-4 text-left border-b border-neutral-100 dark:border-neutral-800 pb-10 mb-12"
        >
          <div className="inline-flex p-3 rounded-2xl bg-[#c5a880]/10 text-[#c5a880]">
            <Scale size={28} />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="font-sans font-light text-xs sm:text-sm text-neutral-400">
            Last Updated: June 2026 • Rules governing your musical journey
          </p>
        </motion.div>

        {/* ==========================================
            TERMS OF SERVICE CORE ARTICLES
           ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="space-y-12 font-sans text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 font-light"
        >
          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <FileEdit size={18} className="text-[#c5a880]" />
              1. Acceptance of Frameworks
            </h2>
            <p>
              By accessing our website, filling out our interactive contact
              inquiries, or formalizing an enrollment structure within **Tabla
              Heritage**, you agree to be bound legally by these terms. If you
              do not consent to these pedagogical or administrative guidelines,
              please refrain from using our registration modules.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <Calendar size={18} className="text-[#c5a880]" />
              2. Tutoring, Scheduling & Cancellation Rules
            </h2>
            <p>
              To respect the time commitment of our instructors and ensure
              consistent progress in traditional learning modules (Riyaz), the
              following scheduling rules apply:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                **Lesson Rescheduling:** Any session adjustments require a
                minimum of 24 hours' notice before the scheduled class time.
              </li>
              <li>
                **No-Show Policy:** Missed lessons without proper prior
                communication cannot be refunded or carried forward to
                subsequent terms.
              </li>
              <li>
                **Instrument Upkeep:** Students are responsible for procuring
                and maintaining their own instruments (Tabla or Dholak sets) as
                recommended by the instructor for home practice.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <AlertCircle size={18} className="text-[#c5a880]" />
              3. Event Booking & Accompaniment Liabilities
            </h2>
            <p>
              For professional live accompaniments, including traditional Chowki
              events, devotional bhajan sessions, or corporate workshops:
            </p>
            <p>
              A formal retainer or deposit is required to secure specific
              calendar slots. Full logistical parameters—including sound
              systems, stage arrangements, and specific rhythmic math sets—must
              be finalized at least 2 weeks prior to the performance execution
              date.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <Scale size={18} className="text-[#c5a880]" />
              4. Intellectual Property Rights
            </h2>
            <p>
              All original pedagogical methodologies, customized notation
              charts, structural video clips displayed on our platforms, and
              rhythm sequence blueprints distributed during class cycles remain
              the exclusive intellectual property of Tabla Heritage and our
              master lineages.
            </p>
            <p>
              You may not redistribute, sell, commercially exploit, or digitally
              clone these instructional materials without explicit, written
              authorization from the academy directors.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <HelpCircle size={18} className="text-[#c5a880]" />
              5. Modifications to Terms
            </h2>
            <p>
              We reserve the absolute right to tweak, refine, or update these
              terms at any given point to adapt to structural pricing updates or
              operational changes. Your continued usage of our onboarding or
              scheduling services following any published changes signals your
              complete acceptance of the revised frameworks.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
