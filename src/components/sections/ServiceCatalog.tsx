import Link from "next/link";
import { softwareServices, services } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The nine-service catalog for /software (prompt §15, §17).
 *
 * §17 rules out nine identical cards and asks for an editorial system with
 * variation. The structure here is deliberately uneven:
 *
 *   01  a single large featured service, given a full band of its own
 *   02–08  alternating editorial rows, the number set large and the alignment
 *          flipping side to side so the eye travels down the page
 *   09  a distinct cross-link band, because Career & Recruiting is a separate
 *       service line and must not be presented as software development (§15)
 *
 * No service gets an icon (§52). The numbering carries the hierarchy.
 */
export function ServiceCatalog() {
  const [featured, ...rest] = softwareServices;
  const recruiting = services.find((s) => s.line === "recruiting")!;

  return (
    <section aria-labelledby="catalog-heading" className="bg-obsidian">
      <div className="container-wide py-32 sm:py-40">
        <Reveal>
          <p className="text-eyebrow uppercase text-graphite">What we build</p>
          <h2 id="catalog-heading" className="mt-5 max-w-2xl text-h2 text-ivory">
            Nine ways an idea becomes a system.
          </h2>
        </Reveal>

        {/* 01 — featured */}
        <Reveal delay={0.08}>
          <article className="rule-dark mt-24 grid gap-8 pt-14 lg:grid-cols-[minmax(0,10rem)_1fr] lg:gap-16">
            <p className="font-display text-[clamp(3rem,7vw,5rem)] leading-none text-mint">
              {featured.number}
            </p>
            <div>
              <h3 className="font-display text-h2 text-ivory">
                {featured.title}
              </h3>
              <p className="mt-6 max-w-xl text-body-lg text-silver">
                {featured.description}
              </p>
            </div>
          </article>
        </Reveal>

        {/* 02–08 — alternating rows */}
        <div className="mt-8">
          {rest.map((service, i) => {
            const flipped = i % 2 === 1;
            return (
              <Reveal key={service.value} delay={Math.min(i * 0.05, 0.25)}>
                <article
                  className={[
                    "rule-dark grid gap-4 py-12 lg:gap-16",
                    flipped
                      ? "lg:grid-cols-[1fr_minmax(0,28rem)]"
                      : "lg:grid-cols-[minmax(0,28rem)_1fr]",
                  ].join(" ")}
                >
                  <div className={flipped ? "lg:order-2" : undefined}>
                    <div className="flex items-baseline gap-5">
                      <span className="font-display text-caption text-graphite">
                        {service.number}
                      </span>
                      <h3 className="font-display text-h3 text-ivory">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <p
                    className={[
                      "max-w-xl text-body text-silver",
                      flipped ? "lg:order-1 lg:text-right" : "",
                    ].join(" ")}
                  >
                    {service.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* 09 — separate service line, deliberately set apart */}
        <Reveal delay={0.1}>
          <article className="mt-20 border border-line-dark bg-card-dark px-8 py-12 sm:px-12">
            <div className="flex items-baseline gap-5">
              <span className="font-display text-caption text-mint">
                {recruiting.number}
              </span>
              <p className="text-eyebrow uppercase text-graphite">
                A separate service line
              </p>
            </div>

            <h3 className="mt-8 font-display text-h2 text-ivory">
              {recruiting.title}
            </h3>
            <p className="mt-6 max-w-xl text-body-lg text-silver">
              {recruiting.description} This is career support, not software
              development — it has its own page and its own process.
            </p>

            <Link
              href="/recruiting"
              className="group mt-10 inline-flex items-center gap-4 text-[0.9375rem] font-medium text-ivory transition-colors duration-[var(--duration-fast)] hover:text-mint"
            >
              Explore Recruiting
              <span
                aria-hidden="true"
                className="block h-px w-10 bg-mint transition-[width] duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:w-16"
              />
            </Link>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
