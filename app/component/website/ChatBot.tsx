"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

interface ChatForm {
  firstName: string;
  email: string;
  phone: string;
  query: string;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"initialQuery" | "contactForm" | "success">(
    "initialQuery",
  );

  const [chatForm, setChatForm] = useState<ChatForm>({
    firstName: "",
    email: "",
    phone: "",
    query: "",
  });

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside the widget window during step changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [step]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setChatForm({ ...chatForm, [e.target.name]: e.target.value });
  };

  // Step 1: Moves user from simple query input to the detail capture state
  const handleInitialQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatForm.query.trim()) return;
    setStep("contactForm");
  };

  // Step 2: Final submission directly to your MongoDB endpoint routing
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatForm.firstName || !chatForm.email || !chatForm.phone) return;
    setLoading(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: chatForm.firstName,
          email: chatForm.email,
          phone: chatForm.phone,
          message: chatForm.query,
          serviceInterested: "tabla lesson", // Default fallback bucket for database matching rule schema
        }),
      });

      if (!response.ok) throw new Error("Transmission failed");

      setStep("success");
    } catch (err) {
      console.error("Chat submission error:", err);
      alert("Something went wrong saving your inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setChatForm({ firstName: "", email: "", phone: "", query: "" });
    setStep("initialQuery");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-left">
      <AnimatePresence mode="wait">
        {/* ==========================================
            1. FLOATING CHAT TRIGGER BUTTON
           ========================================== */}
        {!isOpen && (
          <motion.button
            key="chat-trigger"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-3 px-6 py-3.5 bg-[#6d3b01] hover:bg-[#4c2800] text-white font-medium rounded-full shadow-lg cursor-pointer group transition-colors duration-200"
          >
            {/* White speech bubble indicator icon mimicking design blueprint */}
            <div className="text-white flex items-center justify-center">
              <MessageSquare
                size={25}
                fill="currentColor"
                className="stroke-[1.5]"
              />
            </div>
            <span className="text-base font-normal tracking-wide text-white drop-shadow-xs">
              Let's Chat!
            </span>
          </motion.button>
        )}

        {/* ==========================================
            2. INTERACTIVE CHATBOX CONSOLE WINDOW
           ========================================== */}
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[92vw] sm:w-[380px] h-[500px] bg-white dark:bg-[#161513] rounded-[24px] shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden flex flex-col"
          >
            {/* Header branding ribbon */}
            <div className="bg-gradient-to-r from-[#1c1b19] to-[#262422] p-4 flex items-center justify-between border-b border-neutral-800/20">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-wide">
                    Taal Sadhana Bot
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-light">
                    Online • Ready to assist
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Main scrollable body dialogue section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {/* Bot Welcoming Line */}
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-light leading-relaxed">
                  Namaste! 🙏 Welcome to Taal Sadhana School of Tabla. What
                  query can I help you clear up today?
                </div>
              </div>

              {/* ==========================================
                  STEP 2 FLOW: CONTACT SUB-FORM INJECTOR
                 ========================================== */}
              {step !== "initialQuery" && (
                <>
                  {/* Visual echo block displaying the user's first query line */}
                  <div className="flex items-end justify-end gap-2.5 ml-auto max-w-[85%]">
                    <div className="bg-[#fcae5b] text-white p-3 rounded-2xl rounded-tr-xs text-xs sm:text-sm font-normal leading-relaxed">
                      {chatForm.query}
                    </div>
                  </div>

                  {/* Bot prompts for identity verification validation */}
                  <div className="flex items-start gap-2.5 max-w-[85%]">
                    <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-xs text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 font-light leading-relaxed">
                      Got it! Let me secure that sequence parameters for our
                      team. Please quickly drop your info details so we can
                      trace back your answer:
                    </div>
                  </div>
                </>
              )}

              {/* ==========================================
                  STEP 3 FLOW: SUCCESS CONFIRMATION SPLASH
                 ========================================== */}
              {step === "success" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-6 text-center space-y-3"
                >
                  <CheckCircle2 size={44} className="text-emerald-500" />
                  <div className="space-y-1">
                    <h5 className="text-sm font-bold text-neutral-900 dark:text-white">
                      Submission Complete!
                    </h5>
                    <p className="text-xs font-light text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-relaxed">
                      Your rhythm credentials have been recorded. We will
                      connect with you very soon!
                    </p>
                  </div>
                  <button
                    onClick={resetChat}
                    className="text-[16px] font-semibold text-[#fcae5b] hover:underline pt-2 cursor-pointer"
                  >
                    Start a New Conversation
                  </button>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ==========================================
                DYNAMIC CONTROL FOOTER FOR DATA ENTRIES
               ========================================== */}
            <div className="p-3 bg-neutral-50 dark:bg-[#1a1917] border-t border-neutral-100 dark:border-neutral-800/60">
              {/* Render 1: Baseline single query input field */}
              {step === "initialQuery" && (
                <form
                  onSubmit={handleInitialQuerySubmit}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    name="query"
                    required
                    value={chatForm.query}
                    onChange={handleInputChange}
                    placeholder="Type your question here..."
                    className="flex-1 bg-white dark:bg-[#22211f] px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm focus:border-[#fcae5b] dark:focus:border-[#fcae5b] focus:outline-none text-neutral-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={!chatForm.query.trim()}
                    className="bg-[#fcae5b] text-white p-2.5 rounded-xl hover:bg-[#efa14d] transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40"
                  >
                    <Send size={14} />
                  </button>
                </form>
              )}

              {/* Render 2: Mini integrated form overlay inline layout stack */}
              {step === "contactForm" && (
                <form onSubmit={handleFinalSubmit} className="space-y-2.5">
                  <div className="relative flex items-center">
                    <User
                      size={12}
                      className="absolute left-3 text-neutral-400"
                    />
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={chatForm.firstName}
                      onChange={handleInputChange}
                      placeholder="Full Name*"
                      className="w-full bg-white dark:bg-[#22211f] pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs focus:border-[#fcae5b] dark:focus:border-[#fcae5b] focus:outline-none text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <Mail
                      size={12}
                      className="absolute left-3 text-neutral-400"
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={chatForm.email}
                      onChange={handleInputChange}
                      placeholder="Email Address *"
                      className="w-full bg-white dark:bg-[#22211f] pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs focus:border-[#fcae5b] dark:focus:border-[#fcae5b] focus:outline-none text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div className="relative flex items-center">
                    <Phone
                      size={12}
                      className="absolute left-3 text-neutral-400"
                    />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={chatForm.phone}
                      onChange={handleInputChange}
                      placeholder="Phone with country code *"
                      className="w-full bg-white dark:bg-[#22211f] pl-8 pr-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs focus:border-[#fcae5b] dark:focus:border-[#fcae5b] focus:outline-none text-neutral-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      !chatForm.firstName ||
                      !chatForm.email ||
                      !chatForm.phone
                    }
                    className="w-full py-2 bg-[#fcae5b] hover:bg-[#efa14d] text-white font-medium text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Transmitting..." : "Send Query Details"}
                    <Send size={12} />
                  </button>
                </form>
              )}

              {/* Render 3: Static completion note bar */}
              {step === "success" && (
                <div className="text-center py-1 text-[10px] text-neutral-400 font-light tracking-wide">
                  Channel secured via cloud architecture encryptions.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
