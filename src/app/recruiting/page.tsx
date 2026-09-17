import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import {
  recruitingAudience,
  recruitingProcess,
  recruitingInputs,
} from "@/content/recruiting";
import { cta } from "@/config/site";

export const metadata: Metadata = {
  title: "Career & Recruiting",
  description:
    "GENRA handles the job-application workflow for international students, recent graduates and early-career professionals targeting US employment.",
  alternates: { canonical: "/recruiting" },
  openGraph: {
    title: "GENRA — Career & Recruiting",
    description:
      "You find the opportunity. GENRA handles the applications.",
    url: "/recruiting",
  },
};

/**
 * /recruiting
 *
 * Its own identity within the GENRA system, not a duplicate of the software
 * hero (prompt §25).
 *
 * TRUTHFULNESS: no promise of a job, interview, offer, placement or outcome
 * appears anywhere, and there are no statistics (§25; DOC1 §43). Per §27 there
 * is no "What We Don't Promise" section — step 04 of the process states who owns
 * hiring decisions, which carries the same information without the defensive
 * framing.
 *
 * The CTA is "Get Started", never "Start a Project" (§28).
 */
export default function RecruitingPage() {
  return (
    <>
      <PageHero
        eyebrow="For candidates"
        title="Career & Recruiting"
        lead={{
          first: "Spend less time applying.",
          second: "Focus more on the opportunity.",
        }}
        body="You tell us the roles you want and share your profile. GENRA works through the applications from the information you provide."
        cta={{ label: cta.recruiting, href: "/contact" }}
      />

      {/* Who it's for */}
      <section aria-labelledby="audience-heading" className="bg-obsidian">
        <div className="container-wide py-32 sm:py-40">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-24">
            <Reveal>
              <p className="text-eyebrow uppercase text-graphite">Who it&apos;s for</p>
              <h2 id="audience-heading" className="mt-5 text-h2 text-ivory">
                Built around one problem.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-2xl text-body-lg text-silver">
                Searching and applying is repetitive work that scales badly. It
                takes the hours that would otherwise go into preparing for the
                roles you actually want.
              </p>

              <ul className="mt-12 grid gap-px bg-line-dark sm:grid-cols-2">
                {recruitingAudience.map((item) => (
                  <li
                    key={item}
                    className="bg-obsidian px-0 py-5 font-display text-h3 text-ivory sm:px-6"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="bg-obsidian">
        <div className="container-wide py-32 sm:py-40">
          <Reveal>
            <p className="text-eyebrow uppercase text-graphite">How it works</p>
            <h2 id="how-heading" className="mt-5 max-w-2xl text-h2 text-ivory">
              Four steps, stated plainly.
            </h2>
          </Reveal>

          <ol className="mt-20">
            {recruitingProcess.map((step, i) => (
              <Reveal
                as="li"
                key={step.number}
                delay={Math.min(i * 0.06, 0.24)}
                className="rule-dark last:border-b last:border-line-dark"
              >
                <div className="grid gap-3 py-10 lg:grid-cols-[minmax(0,6rem)_minmax(0,20rem)_1fr] lg:gap-12">
                  <span className="font-display text-caption text-mint">
                    {step.number}
                  </span>
                  <h3 className="font-display text-h3 text-ivory">
                    {step.title}
                  </h3>
                  <p className="max-w-xl text-body text-silver">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* What information is needed */}
      <section aria-labelledby="inputs-heading" className="bg-obsidian">
        <div className="container-wide py-32 sm:py-40">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-24">
            <Reveal>
              <p className="text-eyebrow uppercase text-graphite">
                What we ask for
              </p>
              <h2 id="inputs-heading" className="mt-5 text-h2 text-ivory">
                Only what the work needs.
              </h2>
              <p className="mt-6 text-body text-silver">
                Most of it is optional. Your resume is stored privately and is
                never made public.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="grid gap-px bg-line-dark">
                {recruitingInputs.map((input) => (
                  <div
                    key={input.title}
                    className="grid gap-2 bg-obsidian py-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10 sm:px-6"
                  >
                    <dt className="font-display text-h3 text-ivory">
                      {input.title}
                    </dt>
                    <dd className="text-body text-silver">{input.description}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        aria-labelledby="recruiting-cta-heading"
        className="rule-dark bg-obsidian"
      >
        <div className="container-wide py-40 sm:py-52">
          <Reveal>
            <h2
              id="recruiting-cta-heading"
              className="max-w-3xl text-display uppercase text-ivory"
            >
              Start with your <span className="text-mint">profile.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 max-w-lg text-body-lg text-silver">
              Share what you have. The team reviews every profile that comes in.
            </p>
            <Link
              href="/contact"
              className="mt-14 inline-flex items-center rounded-pill bg-mint px-8 py-4 text-[0.9375rem] font-semibold text-obsidian transition-colors duration-[var(--duration-fast)] hover:bg-mint-deep"
            >
              {cta.recruiting}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
