"use client";

import React from "react";
import {
  FaXTwitter,
  FaLinkedinIn,
  FaFacebookF,
  FaThreads,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";
import TableTitle from "./TableTitle";

interface FooterLink {
  label: string;
  href: string;
}

const mainNavLinks: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Service", href: "/service" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Contact us", href: "/contact" },
  //   { label: "About", href: "/about" },
];

const policyLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <TableTitle />
      <footer className="w-full bg-[#f8f8f8] dark:bg-[#111111] text-neutral-600 dark:text-neutral-400 py-12 border-t border-neutral-200/60 dark:border-neutral-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          {/* ==========================================
            TOP ROW: Navigation Service Links
           ========================================== */}
          <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mb-8">
            {mainNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans text-md font-medium tracking-wide text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-light transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ==========================================
            MIDDLE ROW: High-fidelity Social Media Icons
           ========================================== */}
          <div className="flex items-center justify-center gap-6 sm:gap-7 mb-10">
            {/* <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
              aria-label="X (formerly Twitter)"
            >
              <FaXTwitter size={20} />
            </a> */}
            {/* <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={20} />
            </a> */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
              aria-label="Facebook"
            >
              <FaFacebookF size={25} />
            </a>
            {/* <a
              href="https://threads.net"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
              aria-label="Threads"
            >
              <FaThreads size={20} />
            </a> */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram size={25} />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors duration-200"
              aria-label="TikTok"
            >
              <FaWhatsapp size={25} />
            </a>
          </div>

          {/* ==========================================
            BOTTOM ROW: Full Width Copyright & Policies
           ========================================== */}
          <div className="w-full border-t border-neutral-200/50 dark:border-neutral-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-neutral-500 dark:text-neutral-400">
            {/* Leftside Copyright alignment */}
            <div className="text-center sm:text-left order-2 sm:order-1">
              <p>© {currentYear} Tabla Heritage. All rights reserved.</p>
            </div>

            {/* Rightside dynamic horizontal policy links array */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 order-1 sm:order-2">
              {policyLinks.map((policy) => (
                <a
                  key={policy.label}
                  href={policy.href}
                  className="hover:text-primary dark:hover:text-primary-light transition-colors duration-150"
                >
                  {policy.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
