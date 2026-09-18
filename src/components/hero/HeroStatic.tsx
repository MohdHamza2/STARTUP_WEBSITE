import Link from "next/link";
import Image from "next/image";
import { site } from "@/config/site";
import type { PanelDef } from "@/lib/hero/timeline";

/** Fallback panel list, used when the generated timeline is unavailable. */
const FALLBACK: PanelDef[] = [
  { id: "mvp", label: "MVP Development", href: "/software" },
  { id: "saas", label: "SaaS Development", href: "/software" },
  { id: "web", label: "Web Applications", href: "/software" },
  { id: "ai", label: "AI-Powered Applications", href: "/software" },
  { id: "automation", label: "Automation Systems", href: "/software" },
  { id: "recruiting", label: "Career & Recruiting", href: "/recruiting" },
];

/**
 * Reduced-motion hero.
 *
 * Serves two cases: the visitor prefers reduced motion, or the generated hero
 * timeline failed to load. Either way the content is complete â€” the same
 * opening line, the same six services with the same routing, the same brand
 * resolution and closing proposition. Nothing is lost, only the scrubbing
 * (prompt Â§46; DOC5 Â§5.34).
 */
export function HeroStatic({ panels }: { panels?: PanelDef[] }) {
  const items = panels?.length ? panels : FALLBACK;

  return (
    <section aria-labelledby="hero-heading" className="bg-obsidian">
      <div className="container-wide flex min-h-screen flex-col justify-center py-32">
        <h1 id="hero-heading" className="text-display text-ivory">
          Have an Idea<span className="text-mint">?</span>
        </h1>

        <p className="mt-8 max-w-xl text-body-lg text-silver">
          {site.description}
        </p>

        <nav aria-label="Services" className="mt-16">
          <ul className="grid gap-px overflow-hidden rounded-xl bg-line-dark sm:grid-cols-2">
            {items.map((panel) => (
              <li key={panel.id}>
                <Link
                  href={panel.href}
                  className="flex h-full items-center justify-between gap-6 bg-card-dark px-6 py-7 text-ivory transition-colors duration-[var(--duration-fast)] hover:bg-obsidian"
                >
                  <span className="font-display text-h3">{panel.label}</span>
                  <span aria-hidden="true" className="h-px w-8 shrink-0 bg-mint" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-24 rule-dark pt-12">
          <Image
            src="/brand/mark-ivory.png"
            alt=""
            width={56}
            height={56}
            aria-hidden="true"
            className="size-12"
          />
          <p className="mt-8 font-display text-h2 text-ivory">
            {site.proposition.lead}{" "}
            <span className="text-mint">{site.proposition.follow}</span>
          </p>
          <p className="mt-4 text-eyebrow uppercase tracking-[0.3em] text-silver">
            {site.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
