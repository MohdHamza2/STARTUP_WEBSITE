import Image from "next/image";
import Link from "next/link";
import { cta } from "@/config/site";

/**
 * /software hero.
 *
 * Its own composition, not the homepage ring with different words: copy on
 * the left, one large photograph on the right. The photograph (a product team
 * working over interface sketches) is about building software with people,
 * not a stock laptop or a screen of code. Credited in assets/images/SOURCES.md.
 *
 * Two actions with different intents: the primary goes to the project form,
 * which sits directly below this hero; the text link goes to the catalog.
 */
export function SoftwareHero() {
  return (
    <section className="bg-paper">
      <div className="container-wide grid items-end gap-12 pb-4 pt-28 sm:pt-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16 lg:pt-36">
        <div className="lg:pb-4">
          <h1 className="text-[clamp(2.5rem,1rem+3vw,3.5rem)] leading-[1.04] tracking-[-0.03em] text-ink">
            You have the idea.{" "}
            <span className="text-accent">We build the system.</span>
          </h1>
          <p className="mt-8 max-w-md text-body-lg text-muted">
            MVPs, SaaS, web applications, business software and AI-powered
            systems, designed and built end to end.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <Link
              href="#start"
              className="inline-flex items-center rounded-pill bg-ink px-8 py-4 text-action font-semibold text-paper transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-genra)] hover:bg-ink-soft active:scale-[0.98]"
            >
              {cta.software}
            </Link>
            <Link
              href="#services"
              className="group inline-flex items-center gap-3 text-action font-medium text-ink"
            >
              See what we build
              <span
                aria-hidden="true"
                className="block h-px w-12 origin-left scale-x-[0.667] bg-mint transition-transform duration-[var(--duration-normal)] ease-[var(--ease-genra)] group-hover:scale-x-100"
              />
            </Link>
          </div>
        </div>

        <Image
          src="/images/pages/software.webp"
          alt="A product team reviewing interface sketches together around a table"
          width={2400}
          height={1350}
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="aspect-[4/3] w-full rounded-sm object-cover lg:aspect-[5/4]"
        />
      </div>
    </section>
  );
}
