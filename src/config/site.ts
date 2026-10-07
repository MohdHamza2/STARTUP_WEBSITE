/**
 * GENRA site configuration.
 *
 * Single source of truth for brand-level facts, navigation and messaging.
 *
 * TRUTHFULNESS RULE (prompt §53, §76, §77; DOC1 §43):
 * Nothing in this file may be invented. Where a verified business fact does not
 * exist yet, the value is `null` and every consumer omits the corresponding UI
 * rather than rendering a placeholder that reads as real. Search for
 * `TODO(business-facts)` to find every value still outstanding.
 */

export const site = {
  name: "GENRA",
  /** Brand kit §9 — primary working line. */
  tagline: "Build. Automate. Advance.",
  /** Brand board lockup line, used under the footer wordmark. */
  descriptor: "Ideas. Systems. Outcomes.",
  /** Prompt §3 — primary hero proposition. */
  proposition: {
    lead: "You name it.",
    follow: "We build it.",
  },

  description:
    "GENRA builds digital products, software systems and automation, and helps candidates handle the job-application workflow.",

  /**
   * Production domain (owner, 2026-10-05: genra.tech). The apex redirects to
   * www, so www is canonical. Drives metadataBase, the sitemap and robots.txt.
   */
  url: "https://www.genra.tech" as string | null,

  /**
   * Verified contact details. Phone from the owner, 2026-10-07.
   * TODO(business-facts): email and address still unanswered (DOC1 §50 Q22).
   * The footer contact block and the /contact detail list render only when a
   * value here is non-null. Do not fill these with examples.
   */
  contact: {
    email: null as string | null,
    phone: "+91 83400 90834" as string | null,
    address: null as string | null,
  },

  /**
   * Verified social accounts (owner, 2026-10-07: Instagram genra.tech).
   * Prompt §76 — an account that does not exist must not be linked.
   * Add entries only for profiles that are real and owned by GENRA.
   */
  social: [
    { label: "Instagram", href: "https://www.instagram.com/genra.tech/" },
  ] as ReadonlyArray<{ label: string; href: string }>,

  /**
   * TODO(business-facts): legal entity name. DOC1 §50 Q24 unanswered.
   * Falls back to the brand name in the copyright line, which is accurate
   * as a brand attribution and claims no corporate registration.
   */
  legalEntity: null as string | null,

  /**
   * TODO(business-facts): data retention period. DOC4 §4.30 explicitly defers
   * this and forbids inventing a period. While null, /privacy describes what is
   * collected and how to request deletion but makes NO retention claim.
   */
  dataRetention: null as string | null,
} as const;

/**
 * Primary desktop navigation.
 *
 * Prompt §5: Software and Recruiting ONLY. About, Contact and any secondary
 * action live in the hamburger overlay. No "Start a Project" and no sign-up in
 * the header. This supersedes the "Potential navigation" sketch in DOC1 §8,
 * which that document explicitly marked as draft — recorded as C4 in
 * Reports/Implementation_Plan.md §2.
 */
export const primaryNav = [
  { label: "Software", href: "/software" },
  { label: "Recruiting", href: "/recruiting" },
] as const;

/** Secondary navigation — hamburger overlay only (prompt §37). */
export const secondaryNav = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** Legal routes, linked from the footer. */
export const legalNav = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

/**
 * Call-to-action wording (prompt §75).
 * Software enquiries and recruiting enquiries never share a CTA.
 */
export const cta = {
  software: "Start a Project",
  recruiting: "Get Started",
  general: "Get in Touch",
} as const;
