"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Music,
  Disc,
  CalendarDays,
} from "lucide-react";

type ServiceType = "tabla lesson" | "dholak lesson" | "event booking";

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
  serviceInterested: ServiceType | "";
}

export default function LeadForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
    serviceInterested: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioSelect = (value: ServiceType) => {
    setFormData({ ...formData, serviceInterested: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Something went wrong.");
      }

      setStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
        serviceInterested: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit request.");
    }
  };

  return (
    <section className="py-10 sm:py-20 bg-secondary-light/30 dark:bg-[#161616] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto bg-white dark:bg-[#161513] rounded-none md:rounded-[32px] overflow-hidden border border-neutral-100 dark:border-neutral-800/80 shadow-xl grid grid-cols-1 lg:grid-cols-12">
        {/* ==========================================
          LEFT SECTION: LOGO & BRAND CONNECT
         ========================================== */}
        <div className="lg:col-span-5 bg-[#ffe3ba] p-8 sm:p-12 flex flex-col justify-between text-left relative overflow-hidden border-b lg:border-b-0 lg:border-r border-neutral-200/20">
          {/* Subtle background ambient graphic */}
          <div className="absolute -right-16 -bottom-16 text-neutral-800/10 pointer-events-none select-none">
            <Music size={240} />
          </div>

          <div className="space-y-8 relative z-10">
            {/* Brand Logo Header Block */}
            <div className="w-32 sm:w-40 h-auto">
              <img
                src="/logo-tabla-heritage-transparent.png" // Maps to your uploaded brand asset file paths
                alt="Tabla Heritage Logo"
                className="w-full h-auto object-contain brightness-100 dark:brightness-100"
              />
            </div>

            {/* Narrative Content */}
            <div className="space-y-4">
              <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#c5a880] block">
                Join the Academy
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#8a4d09] leading-tight">
                Let's Align with the Rhythm
              </h3>
              <p className="font-sans font-light text-neutral-800 text-md leading-relaxed">
                TABLA HERITAGE, formerly known as The Tabla Dhyaan, is a premier
                institution dedicated to the sublime art of tabla and dholak
                lessons within the Greater Toronto Area. We cater to students of
                all ages and skill levels, offering comprehensive training and
                education in these traditional Indian percussion instruments.
              </p>
              <p className="font-sans font-light text-neutral-800 text-md leading-relaxed">
                Whether you are looking to master classical solo structures,
                build vibrant folk dholak patterns, or schedule professional
                live event accompaniment your journey begins with a
                conversation.
              </p>
            </div>
          </div>

          {/* Informational baseline footer notes */}
          <div className="mt-5 relative z-10 hidden lg:block border-t border-neutral-800/60">
            <p className="font-sans text-xs text-neutral-500 font-light leading-relaxed">
              Upon submitting your configuration parameters, an administrative
              coordinator will review our calendar tracks and connect with you
              within 24 business hours.
            </p>
          </div>
        </div>

        {/* ==========================================
          RIGHT SECTION: FORM INTERFACE HUB
         ========================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {/* First & Last Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold font-sans uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g., Rohan"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#1c1b19] border border-neutral-200 dark:border-neutral-800 focus:border-[#c5a880] dark:focus:border-[#c5a880] focus:outline-none transition-colors text-sm text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold font-sans uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g., Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#1c1b19] border border-neutral-200 dark:border-neutral-800 focus:border-[#c5a880] dark:focus:border-[#c5a880] focus:outline-none transition-colors text-sm text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            {/* Phone & Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold font-sans uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Phone (With Country Code) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#1c1b19] border border-neutral-200 dark:border-neutral-800 focus:border-[#c5a880] dark:focus:border-[#c5a880] focus:outline-none transition-colors text-sm text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold font-sans uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#1c1b19] border border-neutral-200 dark:border-neutral-800 focus:border-[#c5a880] dark:focus:border-[#c5a880] focus:outline-none transition-colors text-sm text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            {/* Radio custom card matrices */}
            <div className="space-y-2.5">
              <label className="text-sm font-semibold font-sans uppercase tracking-wider text-neutral-700 dark:text-neutral-300 block">
                What services are you interested in? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    value: "tabla lesson",
                    label: "Tabla Lessons",
                    icon: Music,
                  },
                  {
                    value: "dholak lesson",
                    label: "Dholak Lessons",
                    icon: Disc,
                  },
                  {
                    value: "event booking",
                    label: "Event Booking",
                    icon: CalendarDays,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.serviceInterested === item.value;
                  return (
                    <div
                      key={item.value}
                      onClick={() =>
                        handleRadioSelect(item.value as ServiceType)
                      }
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border cursor-pointer transition-all select-none gap-2 text-center ${
                        isSelected
                          ? "bg-[#c5a880]/10 border-[#c5a880] text-[#c5a880] shadow-xs"
                          : "bg-neutral-50 dark:bg-[#1c1b19] border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      <Icon
                        size={16}
                        className={
                          isSelected ? "text-[#c5a880]" : "text-neutral-400"
                        }
                      />
                      <span className="text-[14px] sm:text-xs font-semibold tracking-tight font-sans">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Message Textarea */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold font-sans uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Short Message
              </label>
              <textarea
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your background or custom timeline parameters..."
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 dark:bg-[#1c1b19] border border-neutral-200 dark:border-neutral-800 focus:border-[#c5a880] dark:focus:border-[#c5a880] focus:outline-none transition-colors text-sm resize-none text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === "loading" || !formData.serviceInterested}
              className="w-full py-3.5 rounded-xl bg-[#c5a880] hover:bg-[#b3956d] text-white font-sans text-sm font-semibold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading"
                ? "Processing Transmission..."
                : "Submit Registration Inquiries"}
              <Send size={14} />
            </button>

            {/* Feedback Toasts */}
            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 flex items-center gap-2.5 text-xs font-medium border border-emerald-200/40"
                >
                  <CheckCircle2
                    size={16}
                    className="text-emerald-500 flex-shrink-0"
                  />
                  <span>
                    Composition recorded! Our operational directors will follow
                    up on your track cycle within 24 hours.
                  </span>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-400 flex items-center gap-2.5 text-xs font-medium border border-rose-200/40"
                >
                  <AlertCircle
                    size={16}
                    className="text-rose-500 flex-shrink-0"
                  />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </section>
  );
}
