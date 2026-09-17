import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { site, primaryNav, secondaryNav, legalNav } from "@/config/site";

/**
 * Global footer.
 *
 * Prompt Â§36 and Â§76: social links and contact details appear ONLY when they
 * are real. `site.social` is empty and `site.contact.*` are null because no
 * verified GENRA account, address or phone number exists in the repository
 * (DOC1 Â§50 Q22â€“23 were never answered). Those blocks are therefore omitted
 * rather than filled with plausible-looking placeholders.
 *
 * TODO(business-facts): populate site.social and site.contact, and these
 * sections render automatically. No markup change required.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const hasContact = Boolean(
    site.contact.email || site.contact.phone || site.contact.address,
  );

  return (
    <footer className="rule-dark bg-obsidian">
      <div className="container-wide py-20">
        <div className="flex flex-col gap-16 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo size={32} />
            <p className="mt-6 text-caption uppercase tracking-[0.18em] text-silver">
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
                <h2 className="text-eyebrow uppercase text-silver">Contact</h2>
                <ul className="mt-5 flex flex-col gap-3">
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
                    <li>
                      <a
                        href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}
                        className="text-body text-silver transition-colors hover:text-ivory"
                      >
                        {site.contact.phone}
                      </a>
                    </li>
                  )}
                  {site.contact.address && (
                    <li className="text-body text-silver">{site.contact.address}</li>
                  )}
                </ul>
              </div>
            )}

            {site.social.length > 0 && (
              <div>
                <h2 className="text-eyebrow uppercase text-silver">Follow</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {site.social.map((s) => (
                    <li key={s.href}>
                      <a
                        href={s.href}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="text-body text-silver transition-colors hover:text-ivory"
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

        <div className="rule-dark mt-20 flex flex-col gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-silver">
            {/* Brand attribution only â€” claims no corporate registration, because
                no legal entity name is on record. TODO(business-facts). */}
            Â© {year} {site.legalEntity ?? site.name}
          </p>
          <p className="text-eyebrow uppercase tracking-[0.18em] text-silver">
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
      <h2 className="text-eyebrow uppercase text-silver">{heading}</h2>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-body text-silver transition-colors hover:text-ivory"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
