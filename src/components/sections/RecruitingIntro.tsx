import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Career & Recruiting introduction (prompt §24).
 *
 * TRUTHFULNESS (§25, §78; DOC1 §43; DOC5 §5.6):
 * Every claim here describes only what GENRA does — handle the application
 * workflow from information the candidate supplies. There is no promise of a
 * job, an interview, an offer, placement, or any outcome, and no statistic.
 *
 * Per §28 the CTA is "Explore Recruiting", never "Start a Project" — that
 * belongs to software enquiries.
 */
export function RecruitingIntro() {
  return (
    <section aria-labelledby="recruiting-heading" className="bg-mist">
      <div className="container-wide section-y">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-24">
          <Reveal>
            <h2
              id="recruiting-heading"
              className="font-display text-h2 text-ink"
            >
              You find the opportunity.
              <br />
              <span className="text-accent">We handle the applications.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-body-lg text-muted">
              GENRA works with international students, recent graduates and
              early-career professionals targeting employment in the US.
            </p>
            <p className="mt-6 text-body text-muted">
              You tell us the roles you want and share your profile. We take on
              the repetitive part: working through applications from the
              information you provide, so your time goes into preparing for the
              opportunities rather than filling in the same forms.
            </p>

            <Link
              href="/recruiting"
              className="group mt-12 inline-flex items-center gap-4 text-action font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:text-muted"
            >
              Explore Recruiting
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
