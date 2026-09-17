/**
 * Verified GENRA project work.
 *
 * INTENTIONALLY EMPTY.
 *
 * Prompt §22 and §54: only verified projects may appear, and unrelated
 * historical work must not be presented as GENRA client work. Nothing in this
 * repository establishes a verified GENRA project, client, metric or outcome, so
 * nothing is listed here.
 *
 * The "Ideas We've Brought to Life" section reads this array and renders NOTHING
 * while it is empty — an empty-but-visible section would read as broken, and a
 * populated one would be fabricated. Add a verified entry and the section
 * appears on its own; no markup change is needed.
 *
 * Do not add an entry without the owner's explicit confirmation that the work is
 * GENRA's and may be shown publicly.
 */

export interface Project {
  readonly slug: string;
  readonly title: string;
  /** What was built. No metrics, no outcome claims, unless verified. */
  readonly summary: string;
  /** Path under /public. Must be real project imagery, never a stock stand-in. */
  readonly image?: string;
  readonly year?: string;
}

export const projects: readonly Project[] = [];

/**
 * Testimonials — also intentionally empty.
 *
 * DOC1 §14, DOC2 §37 and DOC3.1 Risk 4 all independently require that fabricated
 * testimonials never publish as real, even though DOC3.1's summary line once
 * listed placeholder reviews as acceptable. The `status` field exists so genuine
 * ones can be staged as drafts before publication.
 */
export interface Testimonial {
  readonly name: string;
  readonly role: string;
  readonly quote: string;
  readonly status: "draft" | "published";
  readonly verified: boolean;
}

export const testimonials: readonly Testimonial[] = [];
