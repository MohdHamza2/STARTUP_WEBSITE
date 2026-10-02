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
