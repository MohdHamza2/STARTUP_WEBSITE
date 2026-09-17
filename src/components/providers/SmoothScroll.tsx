"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Lenis smooth scrolling, driving GSAP's ticker so ScrollTrigger reads the same
 * scroll position Lenis is animating (DOC3.1 §3.5 Layer 3).
 *
 * Disabled entirely under `prefers-reduced-motion` — smoothing IS motion, and
 * DOC2 §11 requires that keyboard navigation and accessibility survive it.
 * Native scrolling is left completely untouched in that case.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.05,
      // Never hijack: wheel and touch keep their natural direction and the page
      // is always scrollable by keyboard (prompt §47).
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
