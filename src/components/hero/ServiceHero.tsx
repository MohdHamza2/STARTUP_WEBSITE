"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp } from "lucide-react";
import { MoltenRingCarousel } from "@/components/ui/molten-ring-carousel";
import { ServiceHeroStatic } from "./ServiceHeroStatic";
import { HeroRobot } from "./HeroRobot";
import { services, serviceHref } from "@/content/services";
import { site } from "@/config/site";
import { scrollToY } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * Homepage hero — the nine GENRA services as a scroll-driven Molten Ring.
 *
 * HOW SCROLL DRIVES IT
 * The section is tall and its stage is sticky. Each service owns STEP svh of
 * page scroll, so scroll position IS the carousel position: wheel, trackpad,
 * touch, keyboard, scrollbar and assistive tech all just scroll the page, and
 * the ring follows. Nothing is captured and nothing is locked — the page is
 * scrolling the whole time, and after service 09 (plus a short DWELL so it
 * can be read) the sticky stage releases into the next section. The ring
 * does not loop.
 *
 * After the page comes to rest between two services it is eased onto one
 * (direction-aware, so a single wheel notch advances rather than springing
 * back). Past the last service there is no snapping at all.
 *
 * LAYOUT
 * Side by side (laptops up, and phones in landscape): service caption left,
 * ring centre-right, the right margin left clear on purpose. Stacked
 * (phones, portrait tablets): caption on top, ring below at full width.
 *
 * Reduced motion, missing WebGL2 and no JavaScript all get ServiceHeroStatic:
 * the same nine services, in order, as plain links.
 */

/** svh of page scroll per service. */
const STEP = 70;
/** svh held on the last service before the page moves on. */
const DWELL = 35;
/** Mirrors the `side` custom variant in globals.css. */
const SIDE_QUERY =
  "(min-width: 64rem), (orientation: landscape) and (max-height: 37.5rem) and (min-width: 40rem)";
/** Three-zone composition (text | robot | carousel) from this width up. */
const WIDE_QUERY = "(min-width: 64rem)";
/** How far into a step a gesture must travel to count as "next". */
const COMMIT = 0.12;

const items = services.map((service) => ({
  image: service.image,
  title: service.title,
  href: serviceHref(service),
}));

export function ServiceHero() {
  const count = services.length;
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"ring" | "static">("ring");
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  const [ring, setRing] = useState({ focusX: 0.5, cardHeight: 0.56 });

  // Reduced motion → the still presentation, live if the preference changes.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => {
      if (query.matches) setMode("static");
    };
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  // Where the front card sits and how tall it is, per composition. From 1024px
  // up the hero is three equal zones (text | robot | carousel) and the ring is
  // measured into the right-hand zone, so the composition holds at any width
  // instead of being tuned to one screen. Below that, the two-zone layout.
  useEffect(() => {
    const side = window.matchMedia(SIDE_QUERY);
    const large = window.matchMedia(WIDE_QUERY);
    const read = () => {
      setWide(large.matches);
      let next = {
        focusX: !side.matches ? 0.5 : 0.68,
        cardHeight: side.matches ? 0.54 : 0.56,
      };
      const zone = zoneRef.current?.getBoundingClientRect();
      const stage = stageRef.current?.getBoundingClientRect();
      if (large.matches && zone?.width && stage?.width && stage.height) {
        next = {
          focusX: (zone.left + zone.width / 2 - stage.left) / stage.width,
          // The card (3:4) fills 92% of its zone's width at most.
          cardHeight: Math.min(0.54, (zone.width * 0.92) / 0.75 / stage.height),
        };
      }
      setRing((prev) =>
        Math.abs(prev.focusX - next.focusX) < 0.001 &&
        Math.abs(prev.cardHeight - next.cardHeight) < 0.001
          ? prev
          : next,
      );
    };
    read();
    const sizer = new ResizeObserver(read);
    if (stickyRef.current) sizer.observe(stickyRef.current);
    side.addEventListener("change", read);
    large.addEventListener("change", read);
    return () => {
      sizer.disconnect();
      side.removeEventListener("change", read);
      large.removeEventListener("change", read);
    };
  }, [mode]);

  const stepPx = useCallback(
    () => ((stickyRef.current?.clientHeight ?? window.innerHeight) * STEP) / 100,
    [],
  );

  /** Fractional service index for the current scroll position. */
  const position = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return 0;
    return -section.getBoundingClientRect().top / stepPx();
  }, [stepPx]);

  const sectionTop = () =>
    (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY;

  const goTo = useCallback(
    (index: number) => {
      const i = Math.min(count - 1, Math.max(0, index));
      scrollToY(sectionTop() + i * stepPx());
    },
    [count, stepPx],
  );

  /** Past the hero entirely: the first pixel of the next section. */
  const leave = () => {
    const section = sectionRef.current;
    if (!section) return;
    scrollToY(sectionTop() + section.offsetHeight - window.innerHeight + 1);
  };

  // Settle onto a service once scrolling stops inside the sequence.
  useEffect(() => {
    if (mode !== "ring") return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let lastY = window.scrollY;
    let direction = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = Math.sign(y - lastY);
      lastY = y;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const p = position();
        if (p <= 0 || p >= count - 1) return;
        const base = Math.floor(p);
        const frac = p - base;
        if (frac < 0.01 || frac > 0.99) return;
        const next =
          direction > 0
            ? frac > COMMIT
              ? base + 1
              : base
            : frac < 1 - COMMIT
              ? base
              : base + 1;
        goTo(next);
      }, 160);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mode, count, position, goTo]);

  const onDrag = useCallback(
    (dy: number) => {
      scrollToY(window.scrollY + dy * 0.007 * stepPx(), { immediate: true });
    },
    [stepPx],
  );

  const onUnsupported = useCallback(() => setMode("static"), []);

  if (mode === "static") return <ServiceHeroStatic />;

  const service = services[active];
  const last = active === count - 1;

  return (
    <>
      <section
        ref={sectionRef}
        id="services-hero"
        aria-labelledby="hero-heading"
        aria-roledescription="carousel"
        className="relative"
        style={{ height: `calc(100svh + ${(count - 1) * STEP + DWELL}svh)` }}
      >
        <div
          ref={stickyRef}
          className="sticky top-0 flex h-svh flex-col overflow-hidden side:block"
        >
          {/* Caption. Above the ring when stacked, over its left side when
              side by side — pointer-transparent there so the ring still
              takes the cursor everywhere except the controls themselves. */}
          <div className="relative z-10 shrink-0 side:pointer-events-none side:absolute side:inset-0">
            <div className="container-wide pt-24 side:flex side:h-full side:items-center side:pt-20 lg:gap-x-[clamp(2rem,4vw,4.5rem)]">
              <div className="side:pointer-events-auto side:max-lg:w-[min(30rem,40%)] lg:min-w-0 lg:flex-1">
                {/* The page's heading. Visually the service caption leads; the
                    proposition is carried by the logo, the ring and the copy. */}
                <h1 id="hero-heading" className="sr-only">
                  {site.name}: {site.proposition.lead} {site.proposition.follow}
                </h1>

                <div aria-live="polite" aria-atomic="true">
                  <p className="flex items-center gap-3 font-display text-caption tabular-nums text-muted">
                    <span className="text-ink">{service.number}</span>
                    <span aria-hidden="true" className="h-px w-8 bg-mint" />
                    <span>
                      {service.line === "recruiting"
                        ? "Career & Recruiting"
                        : "Software"}
                    </span>
                    <span className="sr-only">
                      , service {active + 1} of {count}
                    </span>
                  </p>
                  <p
                    key={service.value}
                    className="hero-swap mt-3 font-display text-[clamp(1.875rem,1.2rem+3vw,2.5rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-ink side:mt-5 side:text-[clamp(1.75rem,min(3.7vw,7.4svh),4.25rem)] short:mt-2"
                  >
                    {service.title}
                  </p>
                  <p
                    key={`${service.value}-d`}
                    className="hero-swap mt-3 line-clamp-2 max-w-sm text-body text-muted side:mt-5 side:line-clamp-3 short:mt-2 short:line-clamp-2"
                  >
                    {service.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-6 side:mt-9 short:mt-4">
                  <Link
                    href={serviceHref(service)}
                    className="group inline-flex items-center gap-3 whitespace-nowrap text-action font-medium text-ink"
                  >
                    Explore{" "}
                    {service.line === "recruiting" ? "Recruiting" : "Software"}
                    <span className="sr-only">: {service.title}</span>
                    <span
                      aria-hidden="true"
                      className="block h-px w-12 origin-left scale-x-[0.667] bg-mint transition-transform duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:scale-x-100"
                    />
                  </Link>

                  <div className="ml-auto flex items-center gap-2 side:ml-0">
                    <button
                      type="button"
                      onClick={() => goTo(active - 1)}
                      disabled={active === 0}
                      aria-label="Previous service"
                      className="grid size-11 place-items-center rounded-full border border-line text-ink transition-[border-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-genra)] hover:border-ink active:scale-[0.96] disabled:cursor-default disabled:opacity-35 disabled:hover:border-line disabled:active:scale-100"
                    >
                      <ArrowUp className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => (last ? leave() : goTo(active + 1))}
                      aria-label={last ? "Continue past the services" : "Next service"}
                      className="grid size-11 place-items-center rounded-full border border-line text-ink transition-[border-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-genra)] hover:border-ink active:scale-[0.96]"
                    >
                      <ArrowDown className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <ol aria-hidden="true" className="mt-6 flex gap-1.5 side:mt-8 short:hidden">
                  {services.map((s, i) => (
                    <li
                      key={s.value}
                      className={cn(
                        "h-0.5 w-5 transition-colors duration-[var(--duration-normal)]",
                        i === active ? "bg-mint" : i < active ? "bg-muted/40" : "bg-line",
                      )}
                    />
                  ))}
                </ol>
              </div>

              {/* Centre zone: the robot. Right zone: empty here, measured to
                  place the ring, which is drawn on the full-width stage. */}
              <div className="hidden lg:flex lg:min-w-0 lg:flex-1 lg:items-center lg:justify-center">
                {wide && (
                  <HeroRobot className="aspect-[2/3] h-auto w-full max-w-[calc(70svh*2/3)]" />
                )}
              </div>
              <div
                ref={zoneRef}
                aria-hidden="true"
                className="hidden lg:block lg:min-w-0 lg:flex-1 lg:self-stretch"
              />
            </div>
          </div>

          {/* Stage. Starts below the header (side by side) or a clear step
              below the caption (stacked), so a neighbouring card cropped at
              its top edge never crowds the navigation or the progress ticks. */}
          <div
            ref={stageRef}
            className="relative mt-6 min-h-0 flex-1 side:absolute side:inset-x-0 side:top-20 side:bottom-0 side:mt-0"
          >
            <MoltenRingCarousel
              items={items}
              getTarget={position}
              focusX={ring.focusX}
              cardHeight={ring.cardHeight}
              // Separate cards with real space between them (owner,
              // 2026-10-04): no fusion, strands or crossfade, and no glass
              // band bending the neighbours' edges at the stage borders.
              liquid={false}
              glass={false}
              onActiveChange={setActive}
              onCardSelect={goTo}
              onDrag={onDrag}
              onUnsupported={onUnsupported}
            />
          </div>

          {/* Everything above is painted or abbreviated; this is the whole
              sequence in text, for assistive technology. */}
          <ol className="sr-only">
            {services.map((s) => (
              <li key={s.value}>
                {s.number}. {s.title}. {s.description}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Without JavaScript nothing turns the ring, so the scroll section is
          dropped and the still presentation is shown instead. */}
      <noscript>
        <style>{"#services-hero{display:none}"}</style>
        <ServiceHeroStatic />
      </noscript>
    </>
  );
}
