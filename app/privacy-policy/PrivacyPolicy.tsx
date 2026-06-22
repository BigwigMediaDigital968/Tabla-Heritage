"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";

export default function PolicyPage() {
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
            <Shield size={28} />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="font-sans font-light text-xs sm:text-sm text-neutral-400">
            Last Updated: June 2026 • Effective Immediately
          </p>
        </motion.div>

        {/* ==========================================
            PRIVACY POLICY CORE ARTICLES
           ========================================== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
          className="space-y-12 font-sans text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 font-light"
        >
          {/* Article 1 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <FileText size={18} className="text-[#c5a880]" />
              1. Information We Collect
            </h2>
            <p>
              At Tabla Heritage, we value your privacy and are committed to
              protecting your personal data. When you interact with our
              platform—specifically when submitting an inquiry or enrolling
              through our onboarding channels—we collect data directly provided
              by you. This includes:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-[#faf8f5] dark:bg-[#161513] p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800/40 text-neutral-800 dark:text-neutral-200 font-medium text-xs sm:text-sm">
              <li className="flex items-center gap-2">
                • First Name & Last Name
              </li>
              <li className="flex items-center gap-2">• Email Address</li>
              <li className="flex items-center gap-2">
                • Phone / Contact Number
              </li>
              <li className="flex items-center gap-2">
                • Services Required (e.g., Tabla Tutoring, Dholak Lessons)
              </li>
              <li className="flex items-center gap-2 sm:col-span-2">
                • Custom Personal Message Context
              </li>
            </ul>
          </div>

          {/* Article 2 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <Eye size={18} className="text-[#c5a880]" />
              2. How We Use Your Data
            </h2>
            <p>
              The technical and personal data captured during form interaction
              layers is explicitly processed to optimize your educational
              experience. We do not engage in automated cross-profiling or ad
              tracking. Your fields are accessed solely to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Process course registration request queries for rhythmic
                training programs.
              </li>
              <li>
                Coordinate schedules, event details, and logistical updates
                regarding live accompaniment.
              </li>
              <li>
                Respond directly to custom messages and specific requests left
                within your submission box.
              </li>
              <li>
                Distribute important operational updates about academy terms,
                emergency cancellations, or schedule configurations.
              </li>
            </ul>
          </div>

          {/* Article 3 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <Lock size={18} className="text-[#c5a880]" />
              3. Data Protection & Security
            </h2>
            <p>
              Your contact info is strictly confidential. We implement
              enterprise-grade Secure Socket Layer (SSL/TLS) encryption
              mechanisms across all communication pathways to guard against data
              leaks, unauthorized access, or breach vulnerabilities.
            </p>
            <p>
              Access to your submitted metrics is limited exclusively to
              authorized administrative staff and training directors under
              strict internal confidentiality frameworks.
            </p>
          </div>

          {/* Article 4 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <Shield size={18} className="text-[#c5a880]" />
              4. Third-Party Sharing Policies
            </h2>
            <p>
              Tabla Heritage **never** sells, rents, trades, or commercially
              shares your phone numbers, emails, or name records with external
              corporate entities or marketing aggregators. Information is shared
              with third-party cloud data services exclusively when required to
              execute basic core services (such as processing operational email
              pipelines or text reminders).
            </p>
          </div>

          {/* Article 5 */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
              <FileText size={18} className="text-[#c5a880]" />
              5. Your Legal Rights
            </h2>
            <p>
              You maintain full ownership of your data parameters. At any stage
              of your training lifecycle, you hold the legal right to request
              complete data extraction, data corrections, or permanent deletion
              of your file structures from our storage servers. To exercise
              these privileges, simply connect via our primary support email
              channel.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
