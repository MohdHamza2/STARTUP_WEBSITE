import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send GENRA a project enquiry or ask about career and recruiting support.",
  alternates: { canonical: "/contact" },
};

/**
 * /contact
 *
 * Remains fully functional even though Contact is not in the primary desktop
 * navigation (prompt §34) — it is reachable from the overlay menu, the footer,
 * and every CTA on the site.
 *
 * Only verified details appear (phone and Instagram from the owner,
 * 2026-10-07). No email, address or response-time commitment is on record, and
 * §34 forbids inventing them; each item renders only when `site` has it.
 * TODO(business-facts): email, address.
 */
export default function ContactPage() {
  const hasDetails = Boolean(
    site.contact.email || site.contact.phone || site.contact.address,
  );

  return (
    <div className="bg-paper">
      <div className="container-content pb-32 pt-40">
        <span aria-hidden="true" className="block h-px w-24 bg-mint" />
        <h1 className="text-display text-ink">Get in touch</h1>
        <p className="mt-10 max-w-xl text-body-lg text-muted">
          Tell us whether this is about something you want built or about your
          job search, and the right person will pick it up.
        </p>

        {hasDetails && (
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-3">
            {site.contact.email && (
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-body text-muted transition-colors hover:text-ink"
                >
                  {site.contact.email}
                </a>
              </li>
            )}
            {site.contact.phone && (
              <li>
                <a
                  href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}
                  className="text-body text-muted transition-colors hover:text-ink"
                >
                  {site.contact.phone}
                </a>
              </li>
            )}
            {site.social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-body text-muted transition-colors hover:text-ink"
                >
                  {s.label}
                </a>
              </li>
            ))}
            {site.contact.address && (
              <li className="text-body text-muted">{site.contact.address}</li>
            )}
          </ul>
        )}

        <div className="mt-20">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
