import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What information GENRA collects when you submit an enquiry, why it is collected, how it is stored and how to request deletion.",
  alternates: { canonical: "/privacy" },
};

/**
 * /privacy
 *
 * ACCURACY CONSTRAINT (prompt §77; DOC4 §4.30; DOC1 §38):
 * Privacy language must reflect what the system actually does. Specifically:
 *
 *  - No retention PERIOD is stated. DOC4 §4.30 explicitly defers setting one and
 *    forbids inventing arbitrary periods. The basis for retention IS stated,
 *    because that part is defined. When the owner sets a period, replace the
 *    marked paragraph. TODO(business-facts).
 *  - No "we never store your data" or similar claim appears — it would be false.
 *  - No data controller identity, postal address or DPO contact is given,
 *    because no legal entity is on record. TODO(business-facts).
 *
 * This page describes the implementation honestly. It is not legal advice and
 * should be reviewed before production launch (DOC1 §38, DOC5 §5.30).
 */
export default function PrivacyPage() {
  return (
    <div className="bg-obsidian">
      <div className="container-content pb-32 pt-40">
        <p className="text-eyebrow uppercase text-graphite">Legal</p>
        <h1 className="mt-6 text-display text-ivory">Privacy</h1>

        <div className="mt-16 space-y-14">
          <Section title="What this covers">
            <p>
              This explains what happens to the information you send GENRA
              through an enquiry or recruiting form on this website.
            </p>
          </Section>

          <Section title="What we collect">
            <p>Only what you enter into a form. Depending on the form, that is:</p>
            <ul className="mt-5 space-y-2">
              {[
                "Your name and email address.",
                "Your phone number, if you provide one.",
                "For recruiting enquiries: education, university, graduation year, work authorisation status, target role, preferred industry and location, and a LinkedIn URL — all optional.",
                "For project enquiries: company, project type and a description of what you need.",
                "A resume file, if you choose to upload one.",
                "Anything you write in a free-text field.",
              ].map((item) => (
                <li key={item} className="flex gap-4 text-body text-silver">
                  <span aria-hidden="true" className="mt-3 h-px w-4 shrink-0 bg-mint" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5">
              Work authorisation is optional and includes a &ldquo;prefer not to
              say&rdquo; option. It is asked only because it affects which
              opportunities are relevant.
            </p>
          </Section>

          <Section title="Why we collect it">
            <p>
              To respond to your enquiry and, for recruiting submissions, to
              review your profile and carry out the application workflow you
              asked for. It is not sold, and it is not used for advertising.
            </p>
          </Section>

          <Section title="How it is stored">
            <p>
              Form submissions are stored in a PostgreSQL database hosted on
              Supabase. Resume files are stored separately in a private storage
              bucket — they are not public, and there is no public URL that
              exposes them. Access happens server-side; your browser never talks
              to the database directly.
            </p>
            <p className="mt-5">
              Submissions also trigger a notification email to the GENRA team,
              sent through Resend.
            </p>
          </Section>

          <Section title="Who can access it">
            <p>
              The GENRA team, and the infrastructure providers named above in
              their capacity as processors. It is not shared with anyone else.
            </p>
          </Section>

          <Section title="How long we keep it">
            {/* TODO(business-facts): no retention PERIOD is stated here because
                none has been set. DOC4 §4.30 defers this and forbids inventing
                one. Replace this paragraph once the owner defines a period. */}
            <p>
              Enquiry records are kept for as long as they are needed for
              recruiting and business operations, and resume files only for as
              long as there is an operational reason to hold them. A specific
              retention period has not yet been set. Until one is published, you
              can ask us to delete your information at any time and we will.
            </p>
          </Section>

          <Section title="Asking for your data or its deletion">
            <p>
              You can ask what GENRA holds about you, ask for it to be corrected,
              or ask for it to be deleted.
            </p>
            {site.contact.email ? (
              <p className="mt-5">
                Email{" "}
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-mint underline underline-offset-4"
                >
                  {site.contact.email}
                </a>
                .
              </p>
            ) : (
              /* TODO(business-facts): no verified contact address exists yet, so
                 this points at the contact form rather than inventing one. */
              <p className="mt-5">
                Send the request through the{" "}
                <Link
                  href="/contact"
                  className="text-mint underline underline-offset-4"
                >
                  contact form
                </Link>{" "}
                and the team will action it.
              </p>
            )}
          </Section>

          <Section title="Spam protection">
            <p>
              Public forms are protected by Cloudflare Turnstile, which checks
              that a submission comes from a person rather than an automated
              script. Cloudflare processes a token for that check.
            </p>
          </Section>

          <Section title="Changes">
            <p>
              If this changes, the updated version appears on this page.
            </p>
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
