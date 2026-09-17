import { processSteps } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";

/**
 * GENRA process (prompt Â§19).
 *
 * "Do not turn this into five giant icon cards. Use typography, movement and
 * whitespace. The process should feel like a journey."
 *
 * So: a single continuous rule with the five steps marked along it â€” horizontal
 * on desktop, vertical on mobile. The line IS the journey; the steps sit on it.
 * No cards, no icons, no boxes.
 */
export function Process() {
  return (
    <section aria-labelledby="process-heading" className="bg-obsidian">
      <div className="container-wide py-32 sm:py-40">
        <Reveal>
          <p className="text-eyebrow uppercase text-silver">Process</p>
          <h2 id="process-heading" className="mt-5 max-w-2xl text-h2 text-ivory">
            How the work moves.
          </h2>
        </Reveal>

      {/*
        The journey line lives on a wrapper, not inside the <ol>. Two reasons:
        an <ol> may only contain <li>, and a negative z-index here slipped the
        line behind the section's own background, because `relative` alone does
        not create a stacking context. The <ol> is positioned and comes later in
        DOM order, so the steps paint above the line without any z-index.
      */}
      <div className="relative mt-24">
        <span
          aria-hidden="true"
          className="absolute left-[3px] top-2 h-full w-px bg-line-dark lg:left-0 lg:top-[3px] lg:h-px lg:w-full"
        />

        <ol className="relative grid gap-14 lg:grid-cols-5 lg:gap-8">
          {processSteps.map((step, i) => (
            <Reveal
              as="li"
              key={step.number}
              delay={Math.min(i * 0.08, 0.4)}
              className="relative pl-10 lg:pl-0 lg:pt-10"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 block size-[7px] rounded-full bg-mint lg:top-0"
              />
              <p className="font-display text-caption text-silver">
                {step.number}
              </p>
              <h3 className="mt-3 font-display text-h3 uppercase text-ivory">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs text-body text-silver">
                {step.description}
              </p>
            </Reveal>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
