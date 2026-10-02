import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Interior-page hero for typographic pages (currently /about). /software and
 * /recruiting have their own image-led heroes since the 2026-10-03 revision. Depth comes from a wide mint
 * hairline, a large type block and a lot of empty field — the brand board's own
 * device — rather than from generated imagery, which §18 and §50 warn against.
 */
export function PageHero({
  title,
  lead,
  body,
  cta,
}: {
  /** Rendered as the page's h1. */
  title: string;
  /** Two-line proposition beneath the title. The second line takes the accent. */
  lead?: { first: string; second: string };
  body?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="relative flex min-h-[85vh] items-center bg-paper">
      <div className="container-wide pb-24 pt-32">
        <Reveal>
          <span aria-hidden="true" className="block h-px w-24 bg-mint" />
          <h1 className="max-w-4xl text-display text-ink">
            {title}
          </h1>
        </Reveal>

        {lead && (
          <Reveal delay={0.1}>
            <p className="mt-12 font-display text-h2 text-ink">
              {lead.first}
              <br />
              <span className="text-accent">{lead.second}</span>
            </p>
          </Reveal>
        )}

        <Reveal delay={0.16}>
          {body && (
            <p className="mt-10 max-w-xl text-body-lg text-muted">{body}</p>
          )}

          {cta && (
            <Link
              href={cta.href}
              className="mt-12 inline-flex items-center rounded-pill bg-ink px-8 py-4 text-action font-semibold text-paper transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-genra)] hover:bg-graphite active:scale-[0.98]"
            >
              {cta.label}
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}
