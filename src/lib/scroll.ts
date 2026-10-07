import { useEffect, useRef } from "react";
import type Lenis from "lenis";

/**
 * The page's smooth scroller, when there is one.
 *
 * SmoothScroll registers its Lenis instance here so other components can move
 * the page through it. Calling window.scrollTo while Lenis is animating would
 * fight its interpolation; going through Lenis keeps a single source of truth.
 * Under reduced motion there is no Lenis, and native scrolling is used.
 */
let scroller: Lenis | null = null;

export function registerScroller(instance: Lenis) {
  scroller = instance;
  return () => {
    if (scroller === instance) scroller = null;
  };
}

/** Scroll the page to an absolute Y offset. */
export function scrollToY(y: number, { immediate = false } = {}) {
  if (scroller) {
    scroller.scrollTo(y, immediate ? { immediate: true } : { duration: 0.6 });
    return;
  }
  window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}

/**
 * Cancel a glide in progress, leaving the page exactly where it is.
 *
 * Lenis keeps animating toward its target after a wheel gesture. If a link is
 * followed mid-glide, that target belongs to the OLD page, and Lenis carried
 * the new page to it: mid-page, or the very end when the new page is shorter
 * (reproduced 2026-10-07). stop() + start() resets the target to the current
 * position (Lenis 1.3 `reset()`), so Next.js's scroll-to-top then sticks.
 */
export function haltScroll() {
  scroller?.stop();
  scroller?.start();
}

/**
 * Move focus to a form's success panel and bring it into view.
 *
 * The panel replaces a much taller form. The visitor is scrolled down to the
 * submit button, so without this the page shrinks under them and the panel
 * lands above the viewport (reproduced: ~670px shorter, panel at -340px):
 * it looks as if the page jumped down. Focus also lands on the panel instead
 * of falling back to <body>.
 */
export function useRevealOnSuccess(status: string) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (status !== "success" || !el) return;
    el.focus({ preventScroll: true });
    const offset =
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const top = el.getBoundingClientRect().top;
    if (top < offset || top > window.innerHeight * 0.5) {
      scrollToY(window.scrollY + top - offset);
    }
  }, [status]);

  return ref;
}
