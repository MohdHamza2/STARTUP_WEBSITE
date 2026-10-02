import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "One company. Two directions." (prompt §13)
 *
 * Explicitly NOT a two-card grid. The two paths are expressed as a full-bleed
 * editorial split divided by a single hairline: typography, negative space and
 * a numbered index carry the structure instead of cards, icons or badges.
 *
 * The divider is horizontal on mobile and vertical from md up, so the "two
 * directions" idea survives the breakpoint rather than collapsing into a stack
 * of unrelated blocks.
 */
export function SplitSection() {
  return (
    <section aria-labelledby="split-heading" className="bg-paper">
      <div className="container-wide py-32 sm:py-40">
        <Reveal>
          <h2
            id="split-heading"
            className="max-w-2xl text-h2 text-ink"
          >
            Two directions
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-px bg-line md:grid-cols-2">
          <Direction
            index="01"
            eyebrow="Software"
            lines={[
              "Build products.",
              "Automate systems.",
              "Turn ideas into working software.",
            ]}
            cta="Explore Software"
            href="/software"
            delay={0}
          />
          <Direction
            index="02"
            eyebrow="Career & Recruiting"
            lines={[
              "Find opportunities.",
              "Let GENRA handle the application workflow.",
            ]}
            cta="Explore Recruiting"
            href="/recruiting"
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}

function Direction({
  index,
  eyebrow,
  lines,
  cta,
  href,
  delay,
}: {
  index: string;
  eyebrow: string;
  lines: string[];
  cta: string;
  href: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="bg-paper">
      <div className="flex h-full flex-col justify-between gap-16 px-0 py-12 md:px-12 md:py-16">
        <div>
          <div className="flex items-baseline gap-5">
            <span className="font-display text-caption text-muted">{index}</span>
            <p className="text-caption font-medium text-ink">{eyebrow}</p>
          </div>

          <div className="mt-10 space-y-2">
            {lines.map((line, i) => (
              <p
                key={line}
                className={
                  i === 0
                    ? "font-display text-h3 text-ink"
                    : "font-display text-h3 text-muted"
                }
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        <Link
          href={href}
          className="group inline-flex w-fit items-center gap-4 text-action font-medium text-ink transition-colors duration-[var(--duration-fast)] hover:text-muted"
        >
          {cta}
          <span
            aria-hidden="true"
            className="block h-px w-16 origin-left scale-x-[0.625] bg-mint transition-transform duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:scale-x-100"
          />
        </Link>
      </div>
    </Reveal>
  );
}
