import { z } from "zod";
import { projectTypeValues, OTHER_PROJECT_TYPE } from "@/content/services";

/**
 * Shared validation schemas.
 *
 * These are the SINGLE source of truth for both client and server. The client
 * uses them for inline errors; the server re-validates every request with the
 * same schema and never trusts what the browser sent (prompt §32; DOC5 §5.17:
 * "a malicious user can bypass browser validation").
 *
 * Field requirements come from DOC5 §5.8–§5.13 and the resolved owner decisions
 * in Reports/Implementation_Plan.md §9.
 */

/** DOC4 §4.31 — `leads.name VARCHAR(150) NOT NULL`. */
const name = z
  .string()
  .trim()
  .min(2, "Please enter your name.")
  .max(150, "That name is too long.");

/**
 * DOC4 §4.31 — `leads.email VARCHAR(320) NOT NULL`.
 * Required, per owner decision D1. The build prompt §29 marked recruiting email
 * optional, but the approved database architecture declares it NOT NULL and
 * sits higher in the §81 source-of-truth order.
 */
const email = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .max(320, "That email address is too long.")
  .email("Please enter a valid email address.");

/**
 * DOC4 §4.31 — `leads.phone VARCHAR(50)`, optional.
 * DOC5 §5.8 requires accepting international formats rather than assuming a US
 * number, so this checks shape loosely rather than enforcing a country pattern.
 */
const phone = z
  .string()
  .trim()
  .max(50, "That phone number is too long.")
  .regex(/^[+()\d\s.-]*$/, "Please enter a valid phone number.")
  .optional()
  .or(z.literal(""));

/** Optional free text, bounded so a single field cannot carry a payload. */
const optionalText = (max: number, label = "This") =>
  z
    .string()
    .trim()
    .max(max, `${label} is too long.`)
    .optional()
    .or(z.literal(""));

const linkedinUrl = z
  .string()
  .trim()
  .max(500)
  .url("Please enter a valid URL.")
  .optional()
  .or(z.literal(""));

/**
 * Consent (DOC5 §5.14). Must be explicitly true — `z.literal(true)` rejects
 * both `false` and a missing value, which is the point of a consent checkbox.
 */
const consent = z.literal(true, {
  errorMap: () => ({ message: "Please confirm before submitting." }),
});

/** Turnstile token. Presence only — validity is decided server-side (§43). */
const turnstileToken = z
  .string()
  .min(1, "Please complete the verification check.");

/**
 * Attribution (DOC5 §5.27). Never shown to the user and never trusted for
 * anything security-relevant — it only records where a lead came from.
 */
const attribution = {
  source: optionalText(100),
  utmSource: optionalText(100),
  utmMedium: optionalText(100),
  utmCampaign: optionalText(100),
  utmContent: optionalText(100),
  utmTerm: optionalText(100),
};

/* -------------------------------------------------------------------------
 * Recruiting
 * ---------------------------------------------------------------------- */

export const recruitingSchema = z.object({
  name,
  email,
  phone,
  education: optionalText(150, "That entry"),
  university: optionalText(250, "That university name"),
  /**
   * Bounded to something a person could plausibly enter. Kept as a number so a
   * non-numeric value fails before it reaches `graduation_year INTEGER`.
   */
  graduationYear: z
    .union([
      z.coerce
        .number()
        .int("Please enter a four-digit year.")
        .min(1950, "Please enter a four-digit year.")
        .max(2100, "Please enter a four-digit year."),
      z.literal(""),
    ])
    .optional(),
  visaStatus: optionalText(100, "That entry"),
  targetRole: optionalText(200, "That role"),
  preferredIndustry: optionalText(150, "That industry"),
  location: optionalText(200, "That location"),
  linkedinUrl,
  additionalInformation: optionalText(2000, "That message"),
  consent,
  turnstileToken,
  ...attribution,
});

export type RecruitingInput = z.infer<typeof recruitingSchema>;

/* -------------------------------------------------------------------------
 * Software project enquiry
 * ---------------------------------------------------------------------- */

/**
 * Project enquiry (prompt §31).
 *
 * The conditional "Other" field is enforced here rather than only in the UI:
 * choosing Other REQUIRES the description, and choosing anything else DISCARDS
 * whatever was typed into it. That second half matters — §67 requires that a
 * stale value from a deselected Other field is never submitted, and stripping it
 * in the schema means the client cannot submit one even by tampering.
 */
export const projectSchema = z
  .object({
    name,
    email,
    phone,
    company: optionalText(250, "That company name"),
    projectType: z.enum(projectTypeValues as [string, ...string[]], {
      errorMap: () => ({ message: "Please choose a project type." }),
    }),
    otherProjectType: optionalText(200, "That description"),
    projectDescription: z
      .string()
      .trim()
      .min(10, "Please tell us a little about the project.")
      .max(4000, "That description is too long."),
    additionalInformation: optionalText(2000, "That message"),
    consent,
    turnstileToken,
    ...attribution,
  })
  .superRefine((data, ctx) => {
    if (data.projectType === OTHER_PROJECT_TYPE && !data.otherProjectType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherProjectType"],
        message: "Please tell us what you have in mind.",
      });
    }
  })
  .transform((data) => ({
    ...data,
    // Drop a stale conditional value rather than persisting it (§67).
    otherProjectType:
      data.projectType === OTHER_PROJECT_TYPE ? data.otherProjectType : "",
  }));

export type ProjectInput = z.infer<typeof projectSchema>;

/* -------------------------------------------------------------------------
 * Contact
 * ---------------------------------------------------------------------- */

export const CONTACT_TOPICS = ["software", "recruiting"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

/**
 * Contact form (prompt §34) — the shared entry point that routes into one of
 * the two funnels. `topic` decides which set of fields applies and, server-side,
 * which `lead_type` the submission is recorded as.
 */
export const contactSchema = z.object({
  topic: z.enum(CONTACT_TOPICS, {
    errorMap: () => ({ message: "Please choose what this is about." }),
  }),
  name,
  email,
  phone,
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail.")
    .max(4000, "That message is too long."),
  consent,
  turnstileToken,
  ...attribution,
});

export type ContactInput = z.infer<typeof contactSchema>;

/* -------------------------------------------------------------------------
 * Resume upload
 * ---------------------------------------------------------------------- */

/**
 * Resume constraints.
 *
 * PDF ONLY, per owner decision D6 — tighter than DOC5 §5.11, which also permits
 * DOC and DOCX. Those formats carry a macro-borne malware vector and this stack
 * has no malware scanning, so they are rejected outright.
 *
 * The 10 MB limit is DOC5 §5.11. Both values are configuration: widening later
 * is a change here and nowhere else.
 */
export const RESUME_MAX_BYTES = 10 * 1024 * 1024;
export const RESUME_ACCEPTED_MIME = ["application/pdf"] as const;
export const RESUME_ACCEPTED_EXTENSIONS = [".pdf"] as const;

/** Leading bytes of every valid PDF. Checked server-side (see validateResume). */
export const PDF_MAGIC = "%PDF-";

export const resumeMetaSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(100),
  size: z
    .number()
    .int()
    .positive("That file appears to be empty.")
    .max(RESUME_MAX_BYTES, "Your resume exceeds the maximum allowed file size."),
});

/**
 * Sanitise an uploaded filename.
 *
 * Strips every directory component and anything that is not a safe character,
 * so a crafted name cannot escape its prefix or inject a path (prompt §41: "no
 * arbitrary path injection"). The result is only ever used as the LAST segment
 * of a server-constructed storage path.
 */
export function sanitiseFilename(input: string): string {
  const base = input.split(/[\\/]/).pop() ?? "resume.pdf";
  const cleaned = base
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .replace(/\s+/g, "-")
    // Collapse runs of dots so ".." can never survive.
    .replace(/\.{2,}/g, ".")
    .replace(/^[.\-]+/, "")
    .slice(0, 120);

  return cleaned.toLowerCase().endsWith(".pdf")
    ? cleaned
    : `${cleaned || "resume"}.pdf`;
}
