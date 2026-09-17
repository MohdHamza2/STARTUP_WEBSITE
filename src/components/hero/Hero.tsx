"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BANDS,
  HERO_SCROLL_VH,
  bandProgress,
  loadTimeline,
  tierFor,
  type HeroTimeline,
} from "@/lib/hero/timeline";
import {
  useFrameSequence,
  drawCover,
  coverRect,
} from "@/lib/hero/useFrameSequence";
import { HeroStatic } from "./HeroStatic";
import { site } from "@/config/site";

/**
 * GENRA hero.
 *
 * The visitor scrolls through a story rather than watching a background video
 * (prompt §7). Scroll position drives the frame index directly, so the sequence
 * is genuinely under the visitor's control, forward and backward.
 *
 * Pinning uses CSS `position: sticky` rather than ScrollTrigger's `pin`, which
 * clones and re-parents the pinned element — that fights React's ownership of
 * the DOM and breaks canvas refs on re-render. ScrollTrigger still drives the
 * timeline; it just reports progress instead of managing layout.
 *
 * Under `prefers-reduced-motion` this renders <HeroStatic> instead: the same
 * six services, the same routing, no scrubbing (prompt §46).
 */
export function Hero() {
  const [timeline, setTimeline] = useState<HeroTimeline | null>(null);
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [tier, setTier] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const mainCanvas = useRef<HTMLCanvasElement>(null);
  const closingCanvas = useRef<HTMLCanvasElement>(null);
  const hotspotRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const progressRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);

    const onResize = () => setTier(tierFor(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      query.removeEventListener("change", sync);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return;
    const controller = new AbortController();
    loadTimeline(controller.signal)
      .then(setTimeline)
      // A failed timeline must not take the page down — the static hero is a
      // complete experience on its own (DOC5 §5.34: content never depends on
      // the animation system).
      .catch(() => setTimeline(null));
    return () => controller.abort();
  }, [reducedMotion]);

  const seq1 = useFrameSequence(
    tier && timeline ? `/hero/seq1/${tier}` : null,
    timeline?.sequences.seq1.frames ?? 0,
    { priority: true },
  );
  const seq2 = useFrameSequence(
    tier && timeline ? `/hero/seq2/${tier}` : null,
    timeline?.sequences.seq2.frames ?? 0,
  );
  const seq3 = useFrameSequence(
    tier && timeline ? `/hero/seq3/${tier}` : null,
    timeline?.sequences.seq3.frames ?? 0,
  );

  /* --- Scroll-driven render ---------------------------------------------- */
  useEffect(() => {
    if (!timeline || reducedMotion !== false) return;
    const container = containerRef.current;
    const stage = stageRef.current;
    const brand = brandRef.current;
    if (!container || !stage || !brand) return;

    gsap.registerPlugin(ScrollTrigger);

    const render = () => {
      const p = progressRef.current;
      const canvas = mainCanvas.current;
      const closing = closingCanvas.current;

      // --- Main canvas: seq1 then seq2, continuous footage.
      if (canvas) {
        let img: HTMLImageElement | null = null;
        if (p < BANDS.seq2[0]) {
          img = seq1.nearest(
            bandProgress(p, BANDS.seq1) * (timeline.sequences.seq1.frames - 1),
          );
        } else {
          img = seq2.nearest(
            bandProgress(p, BANDS.seq2) * (timeline.sequences.seq2.frames - 1),
          );
        }
        if (img) drawCover(canvas, img);
      }

      // --- Stage lifts. Content moves up like a page, never zooms or fades
      //     (prompt §8).
      const liftStage = bandProgress(p, BANDS.liftToBrand) * -100;
      stage.style.transform = `translate3d(0, ${liftStage}%, 0)`;

      const liftBrand = bandProgress(p, BANDS.liftToClosing) * -100;
      brand.style.transform = `translate3d(0, ${liftBrand}%, 0)`;

      // --- Closing card.
      if (closing && p >= BANDS.liftToClosing[0]) {
        const img = seq3.nearest(
          bandProgress(p, BANDS.seq3) * (timeline.sequences.seq3.frames - 1),
        );
        if (img) drawCover(closing, img);
      }

      // --- Hotspots: position and enablement come from the generated timeline,
      //     so they track the panel that is actually on screen.
      const inPanels = p >= BANDS.seq2[0] && p < BANDS.liftToBrand[0];
      const frame = Math.round(
        bandProgress(p, BANDS.seq2) * (timeline.sequences.seq2.frames - 1),
      );
      const state = inPanels ? timeline.sequences.seq2.states[frame] : null;

      timeline.panels.forEach((_, index) => {
        const el = hotspotRefs.current[index];
        if (!el) return;
        const active = state?.p === index;

        if (!active || !canvas) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          el.setAttribute("aria-hidden", "true");
          el.tabIndex = -1;
          return;
        }

        const rect = coverRect(canvas, timeline.source.width, timeline.source.height);
        const [bx, by, bw, bh] = state!.box;
        el.style.left = `${rect.left + bx * rect.width}px`;
        el.style.top = `${rect.top + by * rect.height}px`;
        el.style.width = `${bw * rect.width}px`;
        el.style.height = `${bh * rect.height}px`;
        el.style.opacity = "1";

        // Only a settled panel is a click target. A half-emerged or retracting
        // one is visible but inert (prompt §11).
        const clickable = state!.c === 1;
        el.style.pointerEvents = clickable ? "auto" : "none";
        el.setAttribute("aria-hidden", clickable ? "false" : "true");
        el.tabIndex = clickable ? 0 : -1;
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
        render();
      },
    });

    render();
    window.addEventListener("resize", render);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", render);
    };
  }, [timeline, reducedMotion, seq1, seq2, seq3]);

  // Until the motion preference is known, render nothing rather than flashing
  // the wrong hero and swapping it.
  if (reducedMotion === null) {
    return <div className="h-screen bg-obsidian" aria-hidden="true" />;
  }

  if (reducedMotion || !timeline) {
    return <HeroStatic panels={timeline?.panels} />;
  }

  return (
    <div
      ref={containerRef}
      style={{ height: `${HERO_SCROLL_VH}vh` }}
      className="relative bg-obsidian"
    >
      <div className="sticky top-0 h-screen overflow-hidden bg-obsidian">
        {/*
          The hero's content is painted to a canvas, which carries no semantics.
          This is the page's single h1 — without it the document would open on an
          h2 and a screen-reader user would get no statement of what GENRA is.
        */}
        <h1 className="sr-only">
          GENRA — {site.tagline} {site.proposition.lead}{" "}
          {site.proposition.follow}
        </h1>

        {/* Closing card — bottom layer, revealed when the brand beat lifts. */}
        <div className="absolute inset-0 z-10 bg-obsidian">
          <canvas ref={closingCanvas} className="size-full" aria-hidden="true" />
          <p className="sr-only">
            {site.proposition.lead} {site.proposition.follow}
          </p>
        </div>

        {/* Brand resolution — built in DOM, not from frames (prompt §12). */}
        <div
          ref={brandRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-obsidian will-change-transform"
        >
          <Image
            src="/brand/mark-ivory.png"
            alt=""
            width={96}
            height={96}
            aria-hidden="true"
            className="size-16 sm:size-24"
          />
          <h2 className="mt-8 font-display text-[clamp(3rem,12vw,9rem)] font-semibold leading-none tracking-[0.18em] text-ivory">
            GENRA
          </h2>
          <span aria-hidden="true" className="mt-6 block h-px w-24 bg-mint" />
          <p className="mt-6 text-eyebrow uppercase tracking-[0.3em] text-silver sm:text-caption">
            {site.tagline}
          </p>
        </div>

        {/* Main stage — seq1 and seq2, plus the panel hotspots. */}
        <div
          ref={stageRef}
          className="absolute inset-0 z-30 bg-obsidian will-change-transform"
        >
          <canvas ref={mainCanvas} className="size-full" aria-hidden="true" />

          {timeline.panels.map((panel, index) => (
            <Link
              key={panel.id}
              href={panel.href}
              ref={(el) => {
                hotspotRefs.current[index] = el;
              }}
              aria-hidden="true"
              tabIndex={-1}
              // No hover treatment of any kind — prompt §11 is explicit that the
              // panel must not scale, tilt, glow or move on hover. Only the
              // focus ring appears, and only for keyboard users.
              className="absolute rounded-xl opacity-0 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint"
              style={{ transition: "opacity var(--duration-fast) linear" }}
            >
              <span className="sr-only">{panel.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
