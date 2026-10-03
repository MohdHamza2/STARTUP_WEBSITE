import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * About, on the homepage (prompt §6, item 11).
 *
 * Short by design — the full page is at /about, and §35 asks for that to stay
 * concise too. Nothing here claims a company history, a team, a founder or a
 * registration, because none of those are on record (prompt §35, §53).
 */
export function AboutPreview() {
  return (
    <section aria-labelledby="about-heading" className="bg-mist">
      <div className="container-wide section-y">
        <div className="rule grid gap-12 pt-16 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-24">
          <Reveal>
            <h2 id="about-heading" className="font-display text-h3 text-ink">
              We build what moves ideas forward.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="max-w-2xl text-body-lg text-muted">
              GENRA is a technology company working across two lines: building
              software for people who have an idea but not an engineering team,
              and taking the application workload off candidates pursuing work in
              the US.
            </p>
            <p className="mt-6 max-w-2xl text-body text-muted">
              Both come down to the same thing: doing the work that stands
              between an intention and a result.
            </p>

            <Link
              href="/about"
              className="group mt-10 inline-flex items-center gap-4 text-action font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:text-muted"
            >
              About GENRA
              <span
                aria-hidden="true"
                className="block h-px w-16 origin-left scale-x-[0.625] bg-mint transition-transform duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:scale-x-100"
              />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
