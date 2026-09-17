import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * About, on the homepage (prompt Â§6, item 11).
 *
 * Short by design â€” the full page is at /about, and Â§35 asks for that to stay
 * concise too. Nothing here claims a company history, a team, a founder or a
 * registration, because none of those are on record (prompt Â§35, Â§53).
 */
export function AboutPreview() {
  return (
    <section aria-labelledby="about-heading" className="bg-obsidian">
      <div className="container-wide py-32 sm:py-40">
        <div className="rule-dark grid gap-12 pt-16 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-24">
          <Reveal>
            <p className="text-eyebrow uppercase text-silver">About</p>
            <h2 id="about-heading" className="mt-5 font-display text-h3 text-ivory">
              We build what moves ideas forward.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-2xl text-body-lg text-silver">
              GENRA is a technology company working across two lines: building
              software for people who have an idea but not an engineering team,
              and taking the application workload off candidates pursuing work in
              the US.
            </p>
            <p className="mt-6 max-w-2xl text-body text-silver">
              Both come down to the same thing â€” doing the work that stands
              between an intention and a result.
            </p>

            <Link
              href="/about"
              className="group mt-10 inline-flex items-center gap-4 text-[0.9375rem] font-medium text-ivory transition-colors duration-[var(--duration-fast)] hover:text-mint"
            >
              About GENRA
              <span
                aria-hidden="true"
                className="block h-px w-10 bg-mint transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:w-16"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
