import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Career & Recruiting introduction (prompt Â§24).
 *
 * TRUTHFULNESS (Â§25, Â§78; DOC1 Â§43; DOC5 Â§5.6):
 * Every claim here describes only what GENRA does â€” handle the application
 * workflow from information the candidate supplies. There is no promise of a
 * job, an interview, an offer, placement, or any outcome, and no statistic.
 *
 * Per Â§28 the CTA is "Explore Recruiting", never "Start a Project" â€” that
 * belongs to software enquiries.
 */
export function RecruitingIntro() {
  return (
    <section aria-labelledby="recruiting-heading" className="bg-obsidian">
      <div className="container-wide py-32 sm:py-40">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,32rem)_1fr] lg:gap-24">
          <Reveal>
            <p className="text-eyebrow uppercase text-silver">
              Career &amp; Recruiting
            </p>
            <h2
              id="recruiting-heading"
              className="mt-5 font-display text-h2 text-ivory"
            >
              You find the opportunity.
              <br />
              <span className="text-mint">We handle the applications.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-body-lg text-silver">
              GENRA works with international students, recent graduates and
              early-career professionals targeting employment in the US.
            </p>
            <p className="mt-6 text-body text-silver">
              You tell us the roles you want and share your profile. We take on
              the repetitive part â€” working through applications from the
              information you provide, so your time goes into preparing for the
              opportunities rather than filling in the same forms.
            </p>

            <Link
              href="/recruiting"
              className="group mt-12 inline-flex items-center gap-4 text-[0.9375rem] font-medium text-ivory transition-colors duration-[var(--duration-fast)] hover:text-mint"
            >
              Explore Recruiting
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
