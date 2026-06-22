"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with smooth momentum settings
    const lenis = new Lenis({
      duration: 1.2, // Speed of the scroll cycle in seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium ease-out curve
      orientation: "vertical", // vertical scrolling
      gestureOrientation: "vertical",
      smoothWheel: true, // Smooth mouse wheel movements
      wheelMultiplier: 1.0, // Scaled scroll sensitivity
      touchMultiplier: 1.5, // Scaled touch swipe responsiveness
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect the Lenis animation frame handle to the native requestAnimationFrame hook
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Synchronize Lenis with your global scrolling events so elements handle recalculations safely
    const handleScroll = () => {
      // Dispatch standard global scroll hooks if you have sticky layout navbar state shifts
      window.dispatchEvent(new Event("scroll"));
    };

    lenis.on("scroll", handleScroll);

    // Dynamic Window Resize Observer to recalculate page metrics during layout shifts
    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    // Comprehensive memory leak prevention on component unmount
    return () => {
      lenis.destroy();
      resizeObserver.disconnect();
    };
  }, []);

  return <>{children}</>;
}
