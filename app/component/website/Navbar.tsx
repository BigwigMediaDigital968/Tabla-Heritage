"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/service" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Use a ref to store the previous scroll position without triggering re-renders
  const lastScrollY = useRef<number>(0);

  // Handle scroll effects (both background change and hide/reveal) Safely
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Handle background style threshold
      setScrolled(currentScrollY > 20);

      // 2. Handle scroll direction (Hide on down, Show on up)
      // Always show navbar when near the very top of the page
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* ==========================================
          MAIN NAVBAR WRAPPER (Now Animated on Scroll)
          ========================================== */}
      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={isVisible ? "visible" : "hidden"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        // className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        //   scrolled
        //     ? "bg-var(--background) dark:bg-[#111111]/90 backdrop-blur-md shadow-sm border-neutral-100 dark:border-neutral-800 py-3"
        //     : "bg-transparent border-transparent py-5"
        // }`}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b bg-white ${
          scrolled
            ? "dark:bg-[#111111]/90 backdrop-blur-md shadow-sm border-neutral-100 dark:border-neutral-800 py-1"
            : "border-transparent py-2"
        }`}
      >
        <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-10 grid grid-cols-3 items-center w-full">
          {/* LEFT: Social Media Icons */}
          <div className="flex items-center gap-5 justify-start">
            <motion.a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary-light transition-colors duration-200 hidden sm:block"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Facebook"
            >
              <FaFacebookF size={25} />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary-light transition-colors duration-200"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Instagram"
            >
              <FaInstagram size={25} />
            </motion.a>
            <motion.a
              href="https://wa.me/yourlink"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary-light transition-colors duration-200"
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="WhatsApp"
            >
              <FaWhatsapp size={25} />
            </motion.a>
          </div>

          {/* CENTER: Logo Image Integration */}
          <div className="flex justify-center items-center">
            <a href="/" className="group block focus:outline-none">
              <img
                src="/logo-tabla-heritage.jpeg"
                alt="Tabla Heritage Logo"
                width={150}
                height={50}
                className="h-15 sm:h-25 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              />
            </a>
          </div>

          {/* RIGHT: Hamburger Button */}
          <div className="flex justify-end items-center">
            <motion.button
              onClick={() => setIsOpen(true)}
              className="p-1.5 text-primary hover:text-primary-light transition-colors focus:outline-none cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Open Menu"
            >
              <Menu size={30} />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ==========================================
          ANIMATED SIDE DRAWER MENUS
          ========================================== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-[60]"
            />

            {/* Sidebar Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[350px] bg-secondary-light dark:bg-[#111111] z-[70] shadow-2xl border-l border-primary/10 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
            >
              {/* DRAWER TOP: Logo Image & Close Button */}
              <div className="flex items-center justify-between border-b border-primary/10 pb-5">
                <div className="text-left">
                  <img
                    src="/logo-tabla-heritage-transparent.png"
                    alt="Tabla Heritage Logo"
                    width={120}
                    height={40}
                    className="h-25 w-auto object-contain"
                  />
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-primary hover:text-primary-light rounded-full bg-white/60 dark:bg-neutral-900 border border-primary/10 focus:outline-none cursor-pointer"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close Menu"
                >
                  <X size={25} />
                </motion.button>
              </div>

              {/* DRAWER MIDDLE: Navigation Links Perfectly Centered */}
              <nav className="flex flex-col items-center justify-center flex-grow py-10 space-y-5">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, ease: "easeOut" }}
                    className="w-full"
                  >
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="inline-block font-serif text-xl sm:text-2xl text-primary font-bold hover:text-primary-light transition-all duration-300 relative group py-1.5"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary-light transition-all duration-300 group-hover:w-1/2 group-hover:left-0" />
                    </a>
                  </motion.div>
                ))}
              </nav>

              {/* DRAWER FOOTER: Contact Details */}
              <div className="border-t border-primary/10 pt-5 text-left">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-primary mb-3.5">
                  Connect With Us
                </h4>
                <div className="space-y-2.5 font-sans text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="flex items-center gap-3">
                    <Mail
                      size={15}
                      className="text-primary-light flex-shrink-0"
                    />
                    <a
                      href="mailto:info@tablaheritage.com"
                      className="hover:underline hover:text-primary transition"
                    >
                      info@tablaheritage.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone
                      size={15}
                      className="text-primary-light flex-shrink-0"
                    />
                    <a
                      href="tel:+919876543210"
                      className="hover:underline hover:text-primary transition"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={15}
                      className="text-primary-light flex-shrink-0 mt-0.5"
                    />
                    <span className="leading-tight">
                      Varanasi Gharana Music Academy, Uttar Pradesh, India
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
