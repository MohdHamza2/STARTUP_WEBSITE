import Image from "next/image";
import { site } from "@/config/site";

/**
 * "Build. Automate. Advance." — the homepage's major brand statement
 * (prompt §20).
 *
 * Large typography, negative space, one mint accent. Deliberately unpopulated:
 * no cards, no icons, no imagery. The restraint is the design.
 */
export function BrandStatement() {
  return (
    <section
      aria-labelledby="brand-statement"
      className="bg-mist"
    >
      <div className="container-wide section-y grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-20">
        <div>
          {/* h2, not h1 — the hero owns the page's single h1. */}
          <h2
            id="brand-statement"
            className="max-w-4xl text-display text-ink"
          >
            Build.{" "}
            <span className="block sm:inline lg:block">Automate.</span>{" "}
            <span className="text-accent">Advance.</span>
          </h2>

          <div className="mt-16 max-w-xl rule pt-10">
            <p className="text-h3 font-display text-ink">
              You bring the idea.
              <br />
              We build what comes next.
            </p>
            <p className="mt-6 text-body-lg text-muted">{site.description}</p>
          </div>
        </div>

        {/* The idea-to-product moment, carried 3.5rem over the section edge:
            the one deliberate overlap on the page. Bottom-aligned, then moved
            down by exactly the section's bottom padding (section-y) plus the
            overlap, so the overlap is the same at every width. Translate, not
            margin, so the section's height is unchanged. The next section's
            top padding (>= 4.5rem) keeps its content clear. */}
        <Image
          src="/images/sections/planning.webp"
          alt="A team mapping out an app on paper: wireframes, sticky notes and a laptop on a shared table"
          width={1800}
          height={1200}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="photo-raised relative z-10 aspect-[4/3] w-full object-cover lg:self-end lg:translate-y-[calc(clamp(4.5rem,3rem+4vw,7rem)+3.5rem)]"
        />
      </div>
    </section>
  );
}
