/**
 * Testimonial data — sample content.
 *
 * EDIT THIS FILE to replace sample testimonials with verified client feedback.
 * No code changes required — the component reads from here.
 *
 * Fields:
 *   id       — unique string, stable across edits
 *   quote    — the testimonial text (2–3 sentences, natural language)
 *   name     — neutral label, e.g. "Alex Morgan"
 *   role     — brief category, e.g. "Startup Founder"
 *
 * The component enforces a tasteful disclosure automatically; do not replicate it here.
 */

export interface Testimonial {
  readonly id: string;
  readonly quote: string;
  readonly name: string;
  readonly role: string;
}

/**
 * Sample testimonials — illustrative only.
 *
 * These are clearly non-identifying and explicitly NOT real verified client
 * feedback. The component renders a compact disclosure below the cards making
 * this explicit.
 *
 * Replace this array with real testimonials as they are collected.
 */
export const testimonials: readonly Testimonial[] = [
  {
    id: "sample-01",
    quote:
      "The team was easy to work with from the beginning. They understood what we were trying to achieve and kept the process clear and straightforward throughout.",
    name: "Alex Morgan",
    role: "Startup Founder",
  },
  {
    id: "sample-02",
    quote:
      "Communication was a real positive — everything was explained clearly and the project moved forward without unnecessary back and forth. We always knew where things stood.",
    name: "Jordan Patel",
    role: "Business Owner",
  },
  {
    id: "sample-03",
    quote:
      "We appreciated how structured the process was. The team took time to understand our requirements before moving into execution, which made the whole experience feel professional.",
    name: "Daniel Reed",
    role: "Product Lead",
  },
];
