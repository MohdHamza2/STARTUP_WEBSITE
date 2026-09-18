import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "One company. Two directions." (prompt Â§13)
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
    <section aria-labelledby="split-heading" className="bg-obsidian">
      <div className="container-wide py-32 sm:py-40">
        <Reveal>
          <p className="text-eyebrow uppercase text-silver">One company</p>
          <h2
            id="split-heading"
            className="mt-5 max-w-2xl text-h2 uppercase text-ivory"
          >
            Two directions
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-px bg-line-dark md:grid-cols-2">
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
    <Reveal delay={delay} className="bg-obsidian">
      <div className="flex h-full flex-col justify-between gap-16 px-0 py-12 md:px-12 md:py-16">
        <div>
          <div className="flex items-baseline gap-5">
            <span className="font-display text-caption text-mint">{index}</span>
            <p className="text-eyebrow uppercase text-silver">{eyebrow}</p>
          </div>

          <div className="mt-10 space-y-2">
            {lines.map((line, i) => (
              <p
                key={line}
                className={
                  i === 0
                    ? "font-display text-h3 text-ivory"
                    : "font-display text-h3 text-silver"
                }
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        <Link
          href={href}
          className="group inline-flex w-fit items-center gap-4 text-[0.9375rem] font-medium text-ivory transition-colors duration-[var(--duration-fast)] hover:text-mint"
        >
          {cta}
          <span
            aria-hidden="true"
            className="block h-px w-10 bg-mint transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:w-16"
          />
        </Link>
      </div>
    </Reveal>
  );
}
