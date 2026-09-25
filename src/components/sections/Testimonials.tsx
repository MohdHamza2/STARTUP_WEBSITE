/**
 * Testimonials — sample content.
 *
 * The live site has no verified client feedback yet. This section ships with
 * clearly marked illustrative content. The disclosure below is visible and
 * accessible — it is NOT hidden in comments, tooltips, hover states, metadata
 * or aria-hidden elements.
 *
 * To replace with real testimonials: edit the `testimonials` array in
 * `src/content/testimonials.ts`. Each entry maps directly to a card.
 * No code change required.
 */

import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/content/testimonials";

/** Decorative left-quote mark — purely visual, aria-hidden. */
function QuoteIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      fill="none"
      className="size-5 text-mint opacity-60"
    >
      <path
        d="M0 16V9.6C0 7.04 0.64 4.90667 1.92 3.2C3.25333 1.44 5.28 0.426667 8 0.16L9.12 2.24C7.44 2.77333 6.18667 3.68 5.36 4.96C4.53333 6.18667 4.16 7.54667 4.24 9.04H8V16H0ZM13 16V9.6C13 7.04 13.64 4.90667 14.92 3.2C16.2533 1.44 18.28 0.426667 21 0.16L22.12 2.24C20.44 2.77333 19.1867 3.68 18.36 4.96C17.5333 6.18667 17.16 7.54667 17.24 9.04H21V16H13Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Testimonials() {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="bg-obsidian"
    >
      <div className="container-wide py-32 sm:py-40">
        {/* Header */}
        <Reveal>
          <p className="text-eyebrow uppercase text-silver">Testimonials</p>
          <h2
            id="testimonials-heading"
            className="mt-5 max-w-2xl text-h2 uppercase text-ivory"
          >
            What people say about GENRA.
          </h2>
          <p className="mt-6 max-w-xl text-body-lg text-silver">
            A selection of feedback from clients who have worked with us.
          </p>
        </Reveal>

        {/* Cards grid */}
        {testimonials.length > 0 && (
          <ul
            className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label="Sample client testimonials"
          >
            {testimonials.map((t, i) => (
              <Reveal
                as="li"
                key={t.id}
                delay={Math.min(i * 0.07, 0.21)}
              >
                <article className="flex h-full flex-col rounded-xl border border-line-dark bg-card-dark p-8">
                  {/* Quote mark */}
                  <QuoteIcon />

                  {/* Quote text */}
                  <blockquote className="mt-4 flex-1">
                    <p className="text-body text-silver">{t.quote}</p>
                  </blockquote>

                  {/* Attribution */}
                  <footer className="mt-8 flex items-center gap-4">
                    <div
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-line-dark font-display text-caption text-silver"
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-display text-caption font-medium text-ivory">
                        {t.name}
                      </p>
                      <p className="text-caption text-silver">{t.role}</p>
                    </div>
                  </footer>
                </article>
              </Reveal>
            ))}
          </ul>
        )}

        {/* Disclosure — visible, accessible, not hidden */}
        <Reveal delay={0.18}>
          <div
            role="note"
            className="mt-14 rounded-md border border-line-dark bg-card-dark px-5 py-4"
          >
            <p className="text-caption text-silver">
              <span className="font-medium text-ivory">Illustrative client feedback.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
