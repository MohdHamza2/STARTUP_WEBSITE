import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms covering use of the GENRA website and the enquiry and recruiting forms.",
  alternates: { canonical: "/terms" },
};

/**
 * /terms
 *
 * ACCURACY CONSTRAINT (prompt §53, §77; DOC1 §43):
 * No legal entity name, jurisdiction, governing law or company registration is
 * stated, because none is on record (DOC1 §50 Q24 unanswered).
 * TODO(business-facts) — add those once the owner supplies them.
 *
 * Per prompt §27 the recruiting outcome boundary lives here and in the
 * recruiting process copy, rather than in a defensive "What We Don't Promise"
 * section on the marketing page.
 *
 * Not legal advice; should be reviewed before production launch (DOC1 §38).
 */
export default function TermsPage() {
  return (
    <div className="bg-obsidian">
      <div className="container-content pb-32 pt-40">
        <p className="text-eyebrow uppercase text-graphite">Legal</p>
        <h1 className="mt-6 text-display text-ivory">Terms</h1>

        <div className="mt-16 space-y-14">
          <Section title="Using this site">
            <p>
              This website describes what GENRA does and lets you send an
              enquiry. Submitting a form starts a conversation — it does not
              create a contract, and no work begins until it is agreed
              separately in writing.
            </p>
          </Section>

          <Section title="What you send us">
            <p>
              Please submit only your own information, and keep it accurate. Do
              not upload files you do not have the right to share. GENRA may
              decline or remove a submission that appears fraudulent, abusive or
              automated.
            </p>
          </Section>

          <Section title="Career and recruiting services">
            <p>
              GENRA handles the job-application workflow using the information
              you provide. That is the whole of the service.
            </p>
            <p className="mt-5">
              GENRA is not an employer and does not represent employers. Applying
              on your behalf does not produce a job, an interview, an offer or
              any hiring outcome, and none is promised. Employer communication,
              interviews, hiring decisions and employment outcomes remain yours
              and the employer&apos;s.
            </p>
            <p className="mt-5">
              You are responsible for the accuracy of what you give us. Anything
              submitted on your behalf reflects the information you provided.
            </p>
          </Section>

          <Section title="Software services">
            <p>
              Scope, timeline, deliverables and cost for any software work are
              agreed in a separate written agreement. Nothing on this website is
              a quote or an offer.
            </p>
          </Section>

          <Section title="Your content and ours">
            <p>
              You keep ownership of what you submit, and grant GENRA permission
              to use it to carry out the service you asked for. The GENRA name,
              logo and the contents of this site belong to GENRA.
            </p>
          </Section>

          <Section title="Availability">
            <p>
              This site is provided as-is. It may be unavailable during
              maintenance or for reasons outside our control.
            </p>
          </Section>

          <Section title="Privacy">
            <p>
              How your information is handled is set out in the{" "}
              <Link
                href="/privacy"
                className="text-mint underline underline-offset-4"
              >
                privacy notice
              </Link>
              .
            </p>
          </Section>

          <Section title="Changes">
            <p>If these terms change, the updated version appears here.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rule-dark pt-10">
      <h2 className="font-display text-h3 text-ivory">{title}</h2>
      <div className="mt-5 max-w-2xl text-body text-silver">{children}</div>
    </section>
  );
}
