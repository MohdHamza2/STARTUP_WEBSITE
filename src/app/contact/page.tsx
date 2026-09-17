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
 * navigation (prompt Â§34) â€” it is reachable from the overlay menu, the footer,
 * and every CTA on the site.
 *
 * NO address, phone number or response-time commitment appears here. None is on
 * record, and Â§34 forbids inventing them. The block below renders only if
 * `site.contact` is populated. TODO(business-facts).
 */
export default function ContactPage() {
  const hasDetails = Boolean(
    site.contact.email || site.contact.phone || site.contact.address,
  );

  return (
    <div className="bg-obsidian">
      <div className="container-content pb-32 pt-40">
        <span aria-hidden="true" className="block h-px w-24 bg-mint" />
        <p className="mt-10 text-eyebrow uppercase text-silver">Contact</p>
        <h1 className="mt-6 text-display uppercase text-ivory">Get in touch</h1>
        <p className="mt-10 max-w-xl text-body-lg text-silver">
          Tell us whether this is about something you want built or about your
          job search, and the right person will pick it up.
        </p>

        {hasDetails && (
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-3">
            {site.contact.email && (
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-body text-silver transition-colors hover:text-ivory"
                >
                  {site.contact.email}
                </a>
              </li>
            )}
            {site.contact.phone && (
              <li className="text-body text-silver">{site.contact.phone}</li>
            )}
            {site.contact.address && (
              <li className="text-body text-silver">{site.contact.address}</li>
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
