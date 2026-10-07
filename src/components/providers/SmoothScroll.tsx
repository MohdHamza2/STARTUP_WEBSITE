"use client";

import { useEffect } from "react";
import { haltScroll, registerScroller } from "@/lib/scroll";

/**
 * Lenis smooth scrolling.
 *
 * Disabled entirely under `prefers-reduced-motion` — smoothing IS motion, and
 * DOC2 §11 requires that keyboard navigation and accessibility survive it.
 * Native scrolling is left completely untouched in that case.
 *
 * Lenis drives its own frame loop (`autoRaf`). GSAP's ticker used to drive it
 * so ScrollTrigger could read the same position, but ScrollTrigger's only
 * consumer was the frame-sequence hero, which has been replaced; the homepage
 * hero now reads the scroll position directly.
 *
 * Lenis is imported DYNAMICALLY, inside the effect and after the reduced-motion
 * check. This component sits in the root layout, so a static import would put
 * it in the initial bundle of every route and ship it even to visitors who
 * have asked for no motion at all (DOC2 §43).
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import("lenis");

      // The component may have unmounted while the chunk was in flight.
      if (cancelled) return;

      const lenis = new Lenis({
        duration: 1.05,
        // Never hijack: wheel and touch keep their natural direction and the
        // page is always scrollable by keyboard (prompt §47).
        smoothWheel: true,
        touchMultiplier: 1.6,
        autoRaf: true,
      });
      const unregister = registerScroller(lenis);

      // Stop any glide the instant the visitor follows an internal link or
      // goes back/forward, before the next page renders (see haltScroll).
      // Capture phase, so it runs before Next.js handles the click.
      const onClick = (event: MouseEvent) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[href]");
        if (!link || link.target === "_blank" || link.origin !== window.location.origin) return;
        haltScroll();
      };
      document.addEventListener("click", onClick, true);
      window.addEventListener("popstate", haltScroll);

      cleanup = () => {
        document.removeEventListener("click", onClick, true);
        window.removeEventListener("popstate", haltScroll);
        unregister();
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
