"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FAQItem, tablaFaqData } from "@/app/faqData";

interface FAQsProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
}

export default function FAQs({
  items = tablaFaqData,
  title = "Frequently Asked Questions",
  subtitle = "Rhythmic Wisdom",
}: FAQsProps) {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-10 sm:py-20 bg-white dark:bg-[#111111] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* ==========================================
            SECTION HEADER TITLE
           ========================================== */}
        <div className="text-center mb-16 sm:mb-20 space-y-3">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#c5a880] block">
            {subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-serif">
            {title}
          </h2>
          <div className="h-1 w-16 bg-[#c5a880] mx-auto rounded-full mt-2" />
        </div>

        {/* ==========================================
            ACCORDION TRACK MATRIX
           ========================================== */}
        <div className="w-full space-y-4">
          {items.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`w-full rounded-[14px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-[#faf8f5] dark:bg-[#161513] border-[#c5a880]/30 shadow-xs"
                    : "bg-white dark:bg-[#141414] border-neutral-100 dark:border-neutral-800/80 hover:border-neutral-200 dark:hover:border-neutral-700"
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full px-6 sm:px-8 py-5 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <HelpCircle
                      size={18}
                      className={`flex-shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? "text-[#c5a880]"
                          : "text-neutral-400 dark:text-neutral-600"
                      }`}
                    />
                    <span className="font-sans text-base font-semibold text-neutral-800 dark:text-neutral-200 tracking-tight leading-snug">
                      {item.question}
                    </span>
                  </div>

                  {/* Animated Chevron Indicator Icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`p-1 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isOpen
                        ? "bg-[#c5a880]/10 text-[#c5a880]"
                        : "text-neutral-400"
                    }`}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                {/* ==========================================
                    EXPANDABLE CONTENT BOX (HEIGHT ANIMATION)
                   ========================================== */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <div className="px-6 sm:px-8 pb-6 pt-1 ml-7 sm:ml-8 border-t border-neutral-100/50 dark:border-neutral-800/30">
                        <p className="font-sans font-light text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed text-left">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
