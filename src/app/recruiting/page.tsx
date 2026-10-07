import type { Metadata } from "next";
import { RecruitingHero } from "@/components/sections/RecruitingHero";
import { Reveal } from "@/components/ui/Reveal";
import { RecruitingForm } from "@/components/forms/RecruitingForm";
import {
  recruitingAudience,
  recruitingProcess,
  recruitingInputs,
} from "@/content/recruiting";

export const metadata: Metadata = {
  title: "Career & Recruiting",
  description:
    "GENRA handles the job-application workflow for international students, recent graduates and early-career professionals targeting US employment.",
  alternates: { canonical: "/recruiting" },
  openGraph: {
    title: "GENRA | Career & Recruiting",
    description:
      "You find the opportunity. GENRA handles the applications.",
    url: "/recruiting",
    // A page-level openGraph replaces the root one, image included.
    images: "/opengraph-image.png",
  },
};

/**
 * /recruiting
 *
 * Its own identity within the GENRA system, not a duplicate of the software
 * hero (prompt §25). Order per the owner revision of 2026-10-03: hero, then
 * the recruiting form (#apply), then who it is for, how it works and what is
 * asked for.
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
      <RecruitingHero />

      {/* The form, second on the page: the hero sends "Get Started" here. The
          heading holds still beside a long form on wide screens. */}
      <section id="apply" aria-labelledby="recruiting-cta-heading" className="bg-paper">
        <div className="container-wide pb-32 pt-20 sm:pb-40 sm:pt-24">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-28">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <h2
                  id="recruiting-cta-heading"
                  className="text-h2 text-ink sm:text-display"
                >
                  Start with your <span className="text-accent">profile.</span>
                </h2>
                <p className="mt-8 max-w-md text-body-lg text-muted">
                  Your name and a phone number are all that&apos;s required.
                  Everything else helps, but you can leave it out.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.08}>
              <div className="max-w-3xl">
                <RecruitingForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section aria-labelledby="audience-heading" className="rule bg-paper">
        <div className="container-wide section-y">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-24">
            <Reveal>
              <h2 id="audience-heading" className="text-h2 text-ink">
                Built around one problem.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="max-w-2xl text-body-lg text-muted">
                Searching and applying is repetitive work that scales badly. It
                takes the hours that would otherwise go into preparing for the
                roles you actually want.
              </p>

              <ul className="mt-12 grid gap-px bg-line sm:grid-cols-2">
                {recruitingAudience.map((item) => (
                  <li
                    key={item}
                    className="bg-paper px-0 py-5 font-display text-h3 text-ink sm:px-6"
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
      <section aria-labelledby="how-heading" className="bg-mist">
        <div className="container-wide section-y">
          <Reveal>
            <h2 id="how-heading" className="max-w-2xl text-h2 text-ink">
              Four steps, stated plainly.
            </h2>
          </Reveal>

          <ol className="mt-20">
            {recruitingProcess.map((step, i) => (
              <Reveal
                as="li"
                key={step.number}
                delay={Math.min(i * 0.06, 0.24)}
                className="rule last:border-b last:border-line"
              >
                <div className="grid gap-3 py-10 lg:grid-cols-[minmax(0,6rem)_minmax(0,20rem)_1fr] lg:gap-12">
                  <span className="font-display text-caption text-muted">
                    {step.number}
                  </span>
                  <h3 className="font-display text-h3 text-ink">
                    {step.title}
                  </h3>
                  <p className="max-w-xl text-body text-muted">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* What information is needed */}
      <section aria-labelledby="inputs-heading" className="bg-paper">
        <div className="container-wide section-y">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-24">
            <Reveal>
              <h2 id="inputs-heading" className="text-h2 text-ink">
                Only what the work needs.
              </h2>
              <p className="mt-6 text-body text-muted">
                Most of it is optional. Your resume is stored privately and is
                never made public.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="grid gap-px bg-line">
                {recruitingInputs.map((input) => (
                  <div
                    key={input.title}
                    className="grid gap-2 bg-paper py-6 sm:grid-cols-[minmax(0,16rem)_1fr] sm:gap-10 sm:px-6"
                  >
                    <dt className="font-display text-h3 text-ink">
                      {input.title}
                    </dt>
                    <dd className="text-body text-muted">{input.description}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

    </>
  );
}
