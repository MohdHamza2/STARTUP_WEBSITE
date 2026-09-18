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
      className="relative flex min-h-screen items-center bg-obsidian"
    >
      <div className="container-wide py-32">
        {/* h2, not h1 — the hero owns the page's single h1. */}
        <h2
          id="brand-statement"
          className="max-w-4xl text-display uppercase text-ivory"
        >
          Build.{" "}
          <span className="block sm:inline">Automate.</span>{" "}
          <span className="text-mint">Advance.</span>
        </h2>

        <div className="mt-16 max-w-xl rule-dark pt-10">
          <p className="text-h3 font-display text-ivory">
            You bring the idea.
            <br />
            We build what comes next.
          </p>
          <p className="mt-6 text-body-lg text-silver">{site.description}</p>
        </div>
      </div>
    </section>
  );
}
