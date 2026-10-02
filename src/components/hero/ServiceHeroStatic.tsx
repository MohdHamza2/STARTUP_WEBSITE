import Image from "next/image";
import Link from "next/link";
import { services, serviceHref } from "@/content/services";
import { site } from "@/config/site";

/**
 * The homepage hero without the ring.
 *
 * Used when motion is reduced, when WebGL2 is unavailable, and (inside a
 * <noscript>) when JavaScript is off. Same nine services, same order, same
 * images and destinations — only the presentation is still. Every service is
 * an ordinary link, so the whole journey is reachable by keyboard and by
 * scrolling, with nothing animated.
 */
export function ServiceHeroStatic() {
  return (
    <section aria-labelledby="hero-heading" className="bg-paper">
      <div className="container-wide pb-24 pt-32 sm:pt-40">
        <h1 id="hero-heading" className="font-display text-display text-ink">
          {site.proposition.lead}{" "}
          <span className="text-accent">{site.proposition.follow}</span>
        </h1>

        <ol className="mt-16 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.value} className="bg-paper">
              <Link
                href={serviceHref(service)}
                className="group flex gap-5 py-6 sm:p-6"
              >
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  width={192}
                  height={256}
                  sizes="96px"
                  className="aspect-[3/4] w-24 shrink-0 rounded-sm object-cover"
                />
                <span className="min-w-0">
                  <span className="font-display text-caption tabular-nums text-muted">
                    {service.number}
                  </span>
                  <h2 className="mt-2 font-display text-h3 text-ink group-hover:underline group-hover:decoration-mint group-hover:decoration-2 group-hover:underline-offset-4">
                    {service.title}
                  </h2>
                  <span className="mt-2 block text-body text-muted">
                    {service.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
