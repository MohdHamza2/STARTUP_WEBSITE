import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/content/projects";

/**
 * Testimonials.
 *
 * Renders ONLY published, verified client feedback, and renders nothing at all
 * until such feedback exists. Owner decision 2026-10-03: the illustrative
 * testimonials added in f8e1f65 were invented, which DOC1 §14, DOC2 §37,
 * DOC3.1 Risk 4 and brief §53 all forbid, so they were removed and the two
 * testimonial data sources were merged into `content/projects.ts`.
 *
 * To publish one: add it to `testimonials` in `content/projects.ts` with
 * `status: "published"` and `verified: true`. No markup change is needed.
 */
export function Testimonials() {
  const published = testimonials.filter(
    (t) => t.status === "published" && t.verified,
  );
  if (published.length === 0) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="bg-paper">
      <div className="container-wide section-y">
        <Reveal>
          <h2 id="testimonials-heading" className="max-w-2xl text-h2 text-ink">
            In their words.
          </h2>
        </Reveal>

        <ul className="mt-16 grid gap-x-16 gap-y-14 lg:grid-cols-2">
          {published.map((t, i) => (
            <Reveal as="li" key={t.name} delay={Math.min(i * 0.06, 0.18)}>
              <figure className="rule pt-8">
                <blockquote>
                  <p className="font-display text-h3 text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-6 text-caption text-muted">
                  <span className="font-medium text-ink">{t.name}</span>, {t.role}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
