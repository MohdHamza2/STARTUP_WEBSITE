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
      <div className="container-wide section-y">
        {/* h2, not h1 — the hero owns the page's single h1. */}
        <h2
          id="brand-statement"
          className="max-w-4xl text-display text-ink"
        >
          Build.{" "}
          <span className="block sm:inline">Automate.</span>{" "}
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
    </section>
  );
}
