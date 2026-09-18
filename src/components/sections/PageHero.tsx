import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Interior-page hero.
 *
 * Related to the homepage hero but deliberately not a copy of it (prompt Â§16,
 * Â§25): no frame sequence, no workstation. Depth comes from a wide mint
 * hairline, a large type block and a lot of empty field â€” the brand board's own
 * device â€” rather than from generated imagery, which Â§18 and Â§50 warn against.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  body,
  cta,
}: {
  eyebrow: string;
  /** Rendered as the page's h1. */
  title: string;
  /** Two-line proposition beneath the title. The second line takes the accent. */
  lead?: { first: string; second: string };
  body?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="relative flex min-h-[85vh] items-center bg-obsidian">
      <div className="container-wide pb-24 pt-40">
        <Reveal>
          <span aria-hidden="true" className="block h-px w-24 bg-mint" />
          <p className="mt-10 text-eyebrow uppercase text-silver">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl text-display uppercase text-ivory">
            {title}
          </h1>
        </Reveal>

        {lead && (
          <Reveal delay={0.1}>
            <p className="mt-12 font-display text-h2 text-ivory">
              {lead.first}
              <br />
              <span className="text-mint">{lead.second}</span>
            </p>
          </Reveal>
        )}

        <Reveal delay={0.16}>
          {body && (
            <p className="mt-10 max-w-xl text-body-lg text-silver">{body}</p>
          )}

          {cta && (
            <Link
              href={cta.href}
              className="mt-12 inline-flex items-center rounded-pill bg-mint px-8 py-4 text-[0.9375rem] font-semibold text-obsidian transition-colors duration-[var(--duration-fast)] hover:bg-mint-deep"
            >
              {cta.label}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
