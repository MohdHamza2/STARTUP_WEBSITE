import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectForm } from "@/components/forms/ProjectForm";

/**
 * Final conversion section (prompt §30).
 *
 * The strongest project conversion point on the site, sitting immediately before
 * the footer. Software CTA wording only — recruiting has its own path and never
 * shares "Start a Project" (§75).
 *
 * §30 allows either a prominent CTA leading to the form, or the form itself
 * inline. The owner asked specifically for "Start a Project → project form", so
 * the form is here — the strongest conversion point carries no extra click.
 */
export function FinalCTA() {
  return (
    <section
      id="start"
      aria-labelledby="final-cta-heading"
      className="rule-dark bg-obsidian"
    >
      <div className="container-wide py-40 sm:py-52">
        <div className="grid gap-20 lg:grid-cols-[minmax(0,28rem)_1fr] lg:gap-28">
          <div>
            <Reveal>
              <h2
                id="final-cta-heading"
                className="text-display uppercase text-ivory"
              >
                Let&apos;s build <span className="text-mint">something.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-10 max-w-md text-body-lg text-silver">
                Tell us what you have in mind. If it can be built, it probably
                can be automated too.
              </p>

              <Link
                href="/recruiting"
                className="group mt-12 inline-flex items-center gap-4 text-[0.9375rem] font-medium text-silver transition-colors duration-[var(--duration-fast)] hover:text-ivory"
              >
                Looking for career support instead?
                <span
                  aria-hidden="true"
                  className="block h-px w-8 bg-graphite transition-[width,background-color] duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:w-12 group-hover:bg-mint"
                />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.16}>
            <ProjectForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
