import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectForm } from "@/components/forms/ProjectForm";

/**
 * Project conversion section: a short call to action with the project form
 * beside it (prompt §30). One component, one form, used in two places:
 *
 *   - the end of the homepage, as the closing "Let's build something."
 *   - directly under the /software hero, so the form is the second thing a
 *     software visitor sees rather than the last (owner revision 2026-10-03).
 *
 * Software CTA wording only. Recruiting has its own path and never shares
 * "Start a Project" (§75). `#start` is the anchor every "Start a Project"
 * link targets.
 */
export function FinalCTA({
  heading = (
    <>
      Let&apos;s build <span className="text-accent">something.</span>
    </>
  ),
  lead = "Tell us what you have in mind. If it can be built, it probably can be automated too.",
  placement = "closing",
}: {
  heading?: ReactNode;
  lead?: string;
  /** "closing" ends a page with a rule above it; "lead" follows a hero. */
  placement?: "closing" | "lead";
}) {
  return (
    <section
      id="start"
      aria-labelledby="final-cta-heading"
      className={placement === "closing" ? "rule bg-paper" : "bg-paper"}
    >
      <div
        className={
          placement === "closing"
            ? "container-wide section-y"
            : "container-wide pb-32 pt-20 sm:pb-40 sm:pt-24"
        }
      >
        <div className="grid gap-16 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-28">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <h2 id="final-cta-heading" className="text-h2 text-ink sm:text-display">
                {heading}
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-8 max-w-md text-body-lg text-muted">{lead}</p>

              <Link
                href="/recruiting"
                className="group mt-10 inline-flex items-center gap-4 text-action font-medium text-muted transition-colors duration-[var(--duration-fast)] hover:text-ink"
              >
                Looking for career support instead?
                <span
                  aria-hidden="true"
                  className="block h-px w-12 origin-left scale-x-[0.667] bg-line transition-[transform,background-color] duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:scale-x-100 group-hover:bg-mint"
                />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <ProjectForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
