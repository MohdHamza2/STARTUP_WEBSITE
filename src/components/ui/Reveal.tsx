"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Scroll reveal.
 *
 * Deliberately restrained: a short rise and a fade, once. The brand kit asks for
 * interfaces that feel "spacious, precise and quiet", so there is no stagger
 * bounce, no scale, no blur.
 *
 * WHY THIS USES A POSITION CHECK RATHER THAN IntersectionObserver:
 * IntersectionObserver — and therefore Motion's `whileInView` — only fires when
 * the intersection STATE changes. A visitor who jumps past a section (scroll
 * restoration on reload, a back navigation, an anchor link) moves it from below
 * the viewport to above it between two frames. Both of those states are
 * "not intersecting", so no callback fires at all and the section stays at
 * opacity 0 permanently.
 *
 * This was reproduced twice in testing: first with `whileInView`, then again
 * with a hand-rolled observer that checked position only in its callback — which
 * never ran a second time. The condition below is evaluated on scroll instead,
 * so it cannot be skipped regardless of how the visitor arrived.
 *
 * Content that is invisible because an animation never fired is a correctness
 * bug, not a visual one (DOC5 §5.34).
 *
 * Under `prefers-reduced-motion` the content renders immediately with no
 * transform — never hidden, never delayed (prompt §46).
 */
export function Reveal({
  children,
  delay = 0,
  as = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let done = false;

    // True once the element's top has entered the lower edge of the viewport —
    // and it stays true after it scrolls past, which is what makes a jump
    // impossible to miss.
    const reached = () =>
      el.getBoundingClientRect().top < window.innerHeight * 0.92;

    const cleanup = () => {
      done = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };

    const check = () => {
      if (done) return;
      if (reached()) {
        setVisible(true);
        cleanup();
      }
    };

    // rAF-throttled: one measurement per frame at most, and only while this
    // element is still hidden. Revealed elements detach immediately.
    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    }

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return cleanup;
  }, []);

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const Component = motion[as];

  return (
    <Component
      // Lets the <noscript> rule in the layout force these visible when
      // JavaScript is unavailable, so content never depends on the animation.
      data-reveal=""
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
