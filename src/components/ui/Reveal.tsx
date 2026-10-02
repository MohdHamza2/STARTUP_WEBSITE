"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll reveal.
 *
 * Quiet on purpose: a short opacity fade, once, and nothing else. The homepage
 * hero is the site's one authored motion moment; every other section should
 * simply arrive, so there is no rise, scale, blur or stagger bounce (DESIGN.md
 * "The Working Drawing"; motion review 2026-10-03).
 *
 * A CSS transition rather than an animation library: it is the cheapest tool
 * that does the job, runs off the main thread, and needs no reduced-motion
 * branch in render — the global `prefers-reduced-motion` rule in globals.css
 * collapses the transition, so the content is simply shown. (Branching on the
 * preference during render made the server and client HTML disagree.)
 *
 * WHY THIS USES A POSITION CHECK RATHER THAN IntersectionObserver:
 * IntersectionObserver only fires when the intersection STATE changes. A
 * visitor who jumps past a section (scroll restoration on reload, a back
 * navigation, an anchor link) moves it from below the viewport to above it
 * between two frames. Both of those states are "not intersecting", so no
 * callback fires and the section would stay invisible permanently. The
 * condition below is evaluated on scroll instead, so it cannot be skipped.
 *
 * Content that is invisible because an animation never fired is a correctness
 * bug, not a visual one (DOC5 §5.34). Without JavaScript a <noscript> rule in
 * the root layout forces every [data-reveal] visible.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "section";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let frame = 0;
    let done = false;

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

    function schedule() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(check);
    }

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return cleanup;
  }, []);

  return (
    <Tag
      data-reveal=""
      ref={ref as never}
      className={cn(
        "transition-opacity duration-[480ms] ease-[var(--ease-genra)]",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
      style={delay ? { transitionDelay: `${Math.round(delay * 1000)}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
