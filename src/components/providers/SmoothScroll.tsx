"use client";

import { useEffect } from "react";

/**
 * Lenis smooth scrolling, driving GSAP's ticker so ScrollTrigger reads the same
 * scroll position Lenis is animating (DOC3.1 §3.5 Layer 3).
 *
 * Disabled entirely under `prefers-reduced-motion` — smoothing IS motion, and
 * DOC2 §11 requires that keyboard navigation and accessibility survive it.
 * Native scrolling is left completely untouched in that case.
 *
 * GSAP and Lenis are imported DYNAMICALLY, inside the effect and after the
 * reduced-motion check. This component sits in the root layout, so a static
 * import would put both libraries in the initial bundle of every route —
 * including /privacy and /terms, which have nothing to animate — and would ship
 * them even to visitors who have asked for no motion at all. DOC2 §43 is
 * explicit: do not load every animation library on every page.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      // The component may have unmounted while the chunks were in flight.
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.05,
        // Never hijack: wheel and touch keep their natural direction and the
        // page is always scrollable by keyboard (prompt §47).
        smoothWheel: true,
        touchMultiplier: 1.6,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
