import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { processSteps } from "@/content/services";

export const metadata: Metadata = {
  title: "About",
  description:
    "GENRA is a technology company building software for people with an idea, and handling the application workload for candidates pursuing work in the US.",
  alternates: { canonical: "/about" },
};

/**
 * /about
 *
 * Kept concise per prompt §35.
 *
 * Nothing here claims a corporate history, a team, a founder, a registration, a
 * headquarters or a founding date, because none of those are on record in the
 * repository (§35, §53; DOC1 §50 Q24 unanswered). The page explains what GENRA
 * is and why it exists, which is what §35 actually asks for.
 */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About GENRA"
        lead={{
          first: "We build what moves",
          second: "ideas forward.",
        }}
        body="GENRA is a technology company working across two lines: software, and career support."
      />

      <section aria-labelledby="what-heading" className="bg-obsidian">
        <div className="container-wide py-32 sm:py-40">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-24">
            <Reveal>
              <p className="text-eyebrow uppercase text-graphite">Why we exist</p>
              <h2 id="what-heading" className="mt-5 text-h2 text-ivory">
                Two problems, one shape.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="max-w-2xl space-y-6 text-body-lg text-silver">
                <p>
                  A founder with an idea and no engineering team, and a graduate
                  with a target role and a hundred applications to file, are
                  stuck on the same thing: the distance between intending
                  something and it actually being done.
                </p>
                <p>
                  GENRA builds software for the first, and takes on the
                  application workload for the second. In both cases the work is
                  the same in kind — doing the part that stands between an
                  intention and a result.
                </p>
                <p>
                  Where that work can be automated, it gets automated. Where it
                  needs judgement, it gets judgement.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="how-we-work" className="bg-obsidian">
        <div className="container-wide py-32 sm:py-40">
          <Reveal>
            <p className="text-eyebrow uppercase text-graphite">How we work</p>
            <h2 id="how-we-work" className="mt-5 max-w-2xl text-h2 uppercase text-ivory">
              Build. Automate. <span className="text-mint">Advance.</span>
            </h2>
          </Reveal>

          <ul className="mt-20 grid gap-px bg-line-dark sm:grid-cols-2 lg:grid-cols-5">
            {processSteps.map((step, i) => (
              <Reveal
                as="li"
                key={step.number}
                delay={Math.min(i * 0.06, 0.3)}
                className="bg-obsidian"
              >
                <div className="h-full px-0 py-7 sm:px-6">
                  <p className="font-display text-caption text-graphite">
                    {step.number}
                  </p>
                  <h3 className="mt-3 font-display text-h3 uppercase text-ivory">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-body text-silver">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
