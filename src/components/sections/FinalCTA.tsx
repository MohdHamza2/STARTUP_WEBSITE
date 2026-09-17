import Link from "next/link";
import { cta } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Final conversion section (prompt §30).
 *
 * The strongest project conversion point on the site, sitting immediately before
 * the footer. Software CTA wording only — recruiting has its own path and never
 * shares "Start a Project" (§75).
 *
 * PHASE NOTE: §30 allows either the project form inline here, or a prominent CTA
 * leading to it. The form itself is Phase 13; this currently routes to /contact,
 * which hosts the software/recruiting enquiry flow. When the form component
 * exists it mounts inside this section and the link becomes a submit path.
 */
export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="rule-dark bg-obsidian"
    >
      <div className="container-wide py-40 sm:py-52">
        <Reveal>
          <h2
            id="final-cta-heading"
            className="max-w-4xl text-display uppercase text-ivory"
          >
            Let&apos;s build <span className="text-mint">something.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-lg text-body-lg text-silver">
            Tell us what you have in mind. If it can be built, it probably can be
            automated too.
          </p>

          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5">
            <Link
              href="/contact"
              className="inline-flex items-center rounded-pill bg-mint px-8 py-4 text-[0.9375rem] font-semibold text-obsidian transition-colors duration-[var(--duration-fast)] hover:bg-mint-deep"
            >
              {cta.software}
            </Link>

            <Link
              href="/recruiting"
              className="group inline-flex items-center gap-4 text-[0.9375rem] font-medium text-silver transition-colors duration-[var(--duration-fast)] hover:text-ivory"
            >
              Looking for career support instead?
              <span
                aria-hidden="true"
                className="block h-px w-8 bg-graphite transition-[width,background-color] duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:w-12 group-hover:bg-mint"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
