import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { site, primaryNav, secondaryNav, legalNav } from "@/config/site";

/**
 * Global footer.
 *
 * Prompt §36 and §76: social links and contact details appear ONLY when they
 * are real. Phone and Instagram are verified (owner, 2026-10-07); email and
 * address are still null, so those items are omitted rather than filled with
 * plausible-looking placeholders. Each renders automatically once set in
 * `site`. TODO(business-facts): email, address.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const hasContact = Boolean(
    site.contact.email || site.contact.phone || site.contact.address,
  );

  return (
    <footer className="rule bg-mist">
      <div className="container-wide py-20">
        <div className="flex flex-col gap-16 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo size={32} />
            <p className="mt-6 text-caption uppercase tracking-[0.18em] text-muted">
              {site.descriptor}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-3">
            <FooterColumn
              heading="Services"
              links={[...primaryNav]}
            />
            <FooterColumn heading="Company" links={[...secondaryNav]} />
            <FooterColumn heading="Legal" links={[...legalNav]} />

            {hasContact && (
              <div>
                <h2 className="text-eyebrow uppercase text-muted">Contact</h2>
                <ul className="mt-5 flex flex-col gap-3">
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
                  {site.contact.address && (
                    <li className="text-body text-muted">{site.contact.address}</li>
                  )}
                </ul>
              </div>
            )}

            {site.social.length > 0 && (
              <div>
                <h2 className="text-eyebrow uppercase text-muted">Follow</h2>
                <ul className="mt-5 flex flex-col gap-3">
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
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="rule mt-20 flex flex-col gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-muted">
            {/* Brand attribution only — claims no corporate registration, because
                no legal entity name is on record. TODO(business-facts). */}
            © {year} {site.legalEntity ?? site.name}
          </p>
          <p className="text-eyebrow uppercase tracking-[0.18em] text-muted">
            {site.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-eyebrow uppercase text-muted">{heading}</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
