import Link from "next/link";
import { services } from "@/content/services";
import { Reveal } from "@/components/ui/Reveal";

/**
 * "What we build" (prompt §14).
 *
 * A refined index, not nine repetitive cards and not a giant icon grid — §14
 * and §52 both rule those out. Each service is one row: number, title,
 * supporting line. The number column carries the rhythm that icons would
 * otherwise have to.
 *
 * Career & Recruiting is included because it is service 09 in the approved
 * catalog, but it routes to /recruiting rather than /software, because it is a
 * separate service line and not a software development category.
 */
export function WhatWeBuild() {
  return (
    <section aria-labelledby="what-we-build" className="bg-obsidian">
      <div className="container-wide py-32 sm:py-40">
        <Reveal>
          <p className="text-eyebrow uppercase text-graphite">What we build</p>
          <h2 id="what-we-build" className="mt-5 max-w-2xl text-h2 text-ivory">
            Ideas into useful systems.
          </h2>
        </Reveal>

        <ul className="mt-20">
          {services.map((service, i) => (
            <Reveal
              as="li"
              key={service.value}
              delay={Math.min(i * 0.04, 0.24)}
              className="rule-dark last:border-b last:border-line-dark"
            >
              <Link
                href={service.line === "recruiting" ? "/recruiting" : "/software"}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 py-7 sm:grid-cols-[auto_minmax(0,22rem)_1fr] sm:gap-x-10"
              >
                <span className="font-display text-caption text-graphite transition-colors duration-[var(--duration-fast)] group-hover:text-mint">
                  {service.number}
                </span>
                <span className="font-display text-h3 text-ivory">
                  {service.title}
                </span>
                <span className="col-start-2 text-body text-silver sm:col-start-3">
                  {service.description}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
