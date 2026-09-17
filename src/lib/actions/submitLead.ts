"use server";

import { headers } from "next/headers";
import { getServiceClient, getServiceConfig } from "@/lib/db/client";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { rateLimit, clientKey } from "@/lib/security/rateLimit";
import { sendTeamNotification, sendConfirmation } from "@/lib/email/notify";
import {
  recruitingSchema,
  projectSchema,
  contactSchema,
  RESUME_MAX_BYTES,
  RESUME_ACCEPTED_MIME,
  PDF_MAGIC,
  sanitiseFilename,
} from "@/lib/validation/schemas";

/**
 * Submission handling for all three public forms.
 *
 * Sequence follows DOC5 §5.19:
 *   rate limit → validate → verify Turnstile → persist → resume → event → notify
 *
 * Every step happens server-side. Nothing the browser sends is trusted:
 * the payload is re-validated with the same Zod schema the client used, the
 * Turnstile token is exchanged with Cloudflare rather than believed, and the
 * uploaded file is checked by magic bytes rather than by its declared type.
 */

export interface FormState {
  status: "idle" | "success" | "error";
  /** Safe to display. Never contains database detail or internal identifiers. */
  message?: string;
  /** Field-level errors, keyed by field name. */
  errors?: Record<string, string>;
  /** True when the failure is worth retrying (network, upstream outage). */
  retryable?: boolean;
}

export const IDLE: FormState = { status: "idle" };

/** Generic messages — prompt §33/§44: never leak internals to the visitor. */
const MESSAGES = {
  validation: "Please correct the highlighted fields.",
  turnstile: "Please complete the verification check and try again.",
  rateLimited: "Too many submissions. Please wait a moment and try again.",
  unavailable:
    "We couldn't process your request right now. Please try again later.",
  success: "Received.",
} as const;

function fieldErrors(error: {
  issues: { path: (string | number)[]; message: string }[];
}): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    out[key] ??= issue.message;
  }
  return out;
}

/** Turn FormData into a plain object, coercing the consent checkbox. */
function toObject(formData: FormData): Record<string, unknown> {
  const raw: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    raw[key] = value;
  }
  raw.consent = formData.get("consent") === "on" || formData.get("consent") === "true";
  return raw;
}

/**
 * Shared preamble: rate limit, then Turnstile.
 *
 * Rate limiting runs FIRST so that a flood cannot be used to hammer
 * Cloudflare's verify endpoint on our behalf.
 */
async function guard(scope: string, token: string): Promise<FormState | null> {
  const headerList = await headers();

  const limited = rateLimit(clientKey(headerList, scope));
  if (!limited.ok) {
    return { status: "error", message: MESSAGES.rateLimited, retryable: true };
  }

  const forwarded = headerList.get("x-forwarded-for")?.split(",")[0]?.trim();
  const turnstile = await verifyTurnstile(token, forwarded);

  if (!turnstile.ok) {
    if (turnstile.reason === "not-configured") {
      // Fails closed. A public form without working spam protection is not
      // something to quietly allow through (prompt §43).
      console.error("[submit] Turnstile is not configured; rejecting submission");
      return {
        status: "error",
        message: MESSAGES.unavailable,
        retryable: false,
      };
    }
    return {
      status: "error",
      message: MESSAGES.turnstile,
      errors: { turnstileToken: MESSAGES.turnstile },
      retryable: true,
    };
  }

  return null;
}

interface LeadCore {
  leadType: "RECRUITING" | "SOFTWARE";
  name: string;
  email: string;
  phone?: string;
  source?: string;
  consent: boolean;
}

/**
 * Create the `leads` row plus its detail row.
 *
 * DOC5 §5.20 asks for these to be one logical operation. The Supabase JS client
 * cannot open a transaction, so this compensates instead: if the detail insert
 * fails, the parent lead is deleted. That avoids the exact state DOC5 §5.20
 * warns about — a lead row whose associated data was only partially created.
 *
 * Returns the lead id, or null when persistence failed.
 */
async function createLead(
  core: LeadCore,
  detailTable: "recruiting_leads" | "software_leads",
  detail: Record<string, unknown>,
): Promise<string | null> {
  const db = getServiceClient();
  if (!db) return null;

  const { data, error } = await db
    .from("leads")
    .insert({
      lead_type: core.leadType,
      name: core.name,
      email: core.email,
      phone: core.phone || null,
      source: core.source || "WEBSITE",
      status: "NEW",
      consent_status: core.consent ? "CONSENTED" : "NOT_PROVIDED",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[submit] lead insert failed:", error?.message);
    return null;
  }

  const leadId = data.id as string;

  const { error: detailError } = await db
    .from(detailTable)
    .insert({ lead_id: leadId, ...detail });

  if (detailError) {
    console.error("[submit] detail insert failed:", detailError.message);
    // Compensating delete. Cascades remove anything already attached.
    await db.from("leads").delete().eq("id", leadId);
    return null;
  }

  return leadId;
}

async function recordEvent(
  leadId: string,
  eventType: string,
  metadata: Record<string, unknown>,
): Promise<void> {
  const db = getServiceClient();
  if (!db) return;
  const { error } = await db
    .from("lead_events")
    .insert({ lead_id: leadId, event_type: eventType, metadata });
  // An audit row failing must not fail the submission the visitor already made.
  if (error) console.error("[submit] event insert failed:", error.message);
}

/**
 * Validate and store an uploaded resume.
 *
 * Checks, in order: declared MIME, size, and the actual leading bytes of the
 * file. The magic-byte check is the one that matters — a declared content type
 * is attacker-controlled, so a `.pdf` name and `application/pdf` header prove
 * nothing on their own (prompt §41).
 *
 * The storage path is built server-side from the lead id; only the final
 * segment comes from the user, and it is sanitised. There is no way for a
 * crafted filename to escape its prefix (prompt §41: no path injection).
 *
 * Returns true when a resume was stored. A failure here does NOT fail the
 * submission — resume upload is optional, and DOC5 §5.21 is explicit that a
 * failed optional upload must not destroy the lead.
 */
async function storeResume(leadId: string, file: File): Promise<boolean> {
  const db = getServiceClient();
  const config = getServiceConfig();
  if (!db || !config) return false;

  if (!RESUME_ACCEPTED_MIME.includes(file.type as "application/pdf")) return false;
  if (file.size <= 0 || file.size > RESUME_MAX_BYTES) return false;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const header = new TextDecoder().decode(bytes.subarray(0, PDF_MAGIC.length));
  if (header !== PDF_MAGIC) {
    console.error("[submit] resume rejected: content is not a PDF");
    return false;
  }

  const filename = sanitiseFilename(file.name);
  const path = `${leadId}/${Date.now()}-${filename}`;

  const { error } = await db.storage
    .from(config.resumeBucket)
    .upload(path, bytes, { contentType: "application/pdf", upsert: false });

  if (error) {
    console.error("[submit] resume upload failed:", error.message);
    return false;
  }

  const { error: metaError } = await db.from("resume_files").insert({
    lead_id: leadId,
    storage_path: path,
    original_filename: filename,
    mime_type: "application/pdf",
    file_size: file.size,
  });

  if (metaError) {
    console.error("[submit] resume metadata insert failed:", metaError.message);
    // Remove the orphaned object so storage does not drift from the database.
    await db.storage.from(config.resumeBucket).remove([path]);
    return false;
  }

  return true;
}

/* -------------------------------------------------------------------------
 * Recruiting
 * ---------------------------------------------------------------------- */

export async function submitRecruiting(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = recruitingSchema.safeParse(toObject(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: MESSAGES.validation,
      errors: fieldErrors(parsed.error),
    };
  }

  const blocked = await guard("recruiting", parsed.data.turnstileToken);
  if (blocked) return blocked;

  const d = parsed.data;
  const leadId = await createLead(
    {
      leadType: "RECRUITING",
      name: d.name,
      email: d.email,
      phone: d.phone,
      source: d.source,
      consent: d.consent,
    },
    "recruiting_leads",
    {
      visa_status: d.visaStatus || null,
      education: d.education || null,
      university: d.university || null,
      graduation_year:
        typeof d.graduationYear === "number" ? d.graduationYear : null,
      target_role: d.targetRole || null,
      preferred_industry: d.preferredIndustry || null,
      location: d.location || null,
      linkedin_url: d.linkedinUrl || null,
      additional_information: d.additionalInformation || null,
    },
  );

  if (!leadId) {
    return { status: "error", message: MESSAGES.unavailable, retryable: true };
  }

  const resume = formData.get("resume");
  const resumeStored =
    resume instanceof File && resume.size > 0
      ? await storeResume(leadId, resume)
      : false;

  await recordEvent(leadId, "FORM_SUBMITTED", {
    lead_type: "RECRUITING",
    resume_uploaded: resumeStored,
    source: d.source || "WEBSITE",
  });

  // Notification is last, and its failure is logged rather than surfaced — the
  // lead is already safely stored (prompt §42).
  await sendTeamNotification({
    leadType: "RECRUITING",
    name: d.name,
    email: d.email,
    phone: d.phone,
    details: {
      Education: d.education,
      University: d.university,
      "Graduation year": d.graduationYear,
      "Work authorisation": d.visaStatus,
      "Target role": d.targetRole,
      Industry: d.preferredIndustry,
      Location: d.location,
      LinkedIn: d.linkedinUrl,
      Notes: d.additionalInformation,
    },
    resumeAttached: resumeStored,
    source: d.source,
  });
  await sendConfirmation(d.email, d.name, "RECRUITING");

  // Partial success is reported honestly rather than as a clean success.
  if (resume instanceof File && resume.size > 0 && !resumeStored) {
    return {
      status: "success",
      message:
        "Your profile was submitted, but your resume could not be uploaded. You can send it to us separately.",
    };
  }

  return { status: "success", message: MESSAGES.success };
}

/* -------------------------------------------------------------------------
 * Software project enquiry
 * ---------------------------------------------------------------------- */

export async function submitProject(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = projectSchema.safeParse(toObject(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: MESSAGES.validation,
      errors: fieldErrors(parsed.error),
    };
  }

  const blocked = await guard("project", parsed.data.turnstileToken);
  if (blocked) return blocked;

  const d = parsed.data;

  /**
   * Prompt §31: a Career & Recruiting selection is processed through the
   * recruiting workflow rather than as a software project — but it stays in the
   * same central lead system, per DOC4's shared `leads` table.
   */
  const isRecruiting = d.projectType === "CAREER_AND_RECRUITING";

  const leadId = isRecruiting
    ? await createLead(
        {
          leadType: "RECRUITING",
          name: d.name,
          email: d.email,
          phone: d.phone,
          source: d.source,
          consent: d.consent,
        },
        "recruiting_leads",
        { additional_information: d.projectDescription },
      )
    : await createLead(
        {
          leadType: "SOFTWARE",
          name: d.name,
          email: d.email,
          phone: d.phone,
          source: d.source,
          consent: d.consent,
        },
        "software_leads",
        {
          company: d.company || null,
          project_type: d.projectType,
          project_description: d.projectDescription,
          additional_information:
            [d.otherProjectType, d.additionalInformation]
              .filter(Boolean)
              .join("\n\n") || null,
        },
      );

  if (!leadId) {
    return { status: "error", message: MESSAGES.unavailable, retryable: true };
  }

  const leadType = isRecruiting ? "RECRUITING" : "SOFTWARE";

  await recordEvent(leadId, "FORM_SUBMITTED", {
    lead_type: leadType,
    project_type: d.projectType,
    source: d.source || "WEBSITE",
  });

  await sendTeamNotification({
    leadType,
    name: d.name,
    email: d.email,
    phone: d.phone,
    details: {
      Company: d.company,
      "Project type": d.projectType,
      "Other detail": d.otherProjectType,
      Description: d.projectDescription,
      Notes: d.additionalInformation,
    },
    resumeAttached: false,
    source: d.source,
  });
  await sendConfirmation(d.email, d.name, leadType);

  return { status: "success", message: MESSAGES.success };
}

/* -------------------------------------------------------------------------
 * Contact
 * ---------------------------------------------------------------------- */

export async function submitContact(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = contactSchema.safeParse(toObject(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: MESSAGES.validation,
      errors: fieldErrors(parsed.error),
    };
  }

  const blocked = await guard("contact", parsed.data.turnstileToken);
  if (blocked) return blocked;

  const d = parsed.data;
  const isRecruiting = d.topic === "recruiting";
  const leadType = isRecruiting ? "RECRUITING" : "SOFTWARE";

  const leadId = await createLead(
    {
      leadType,
      name: d.name,
      email: d.email,
      phone: d.phone,
      source: d.source,
      consent: d.consent,
    },
    isRecruiting ? "recruiting_leads" : "software_leads",
    isRecruiting
      ? { additional_information: d.message }
      : { project_description: d.message },
  );

  if (!leadId) {
    return { status: "error", message: MESSAGES.unavailable, retryable: true };
  }

  await recordEvent(leadId, "FORM_SUBMITTED", {
    lead_type: leadType,
    origin: "CONTACT_FORM",
    source: d.source || "WEBSITE",
  });

  await sendTeamNotification({
    leadType,
    name: d.name,
    email: d.email,
    phone: d.phone,
    details: { Topic: d.topic, Message: d.message },
    resumeAttached: false,
    source: d.source,
  });
  await sendConfirmation(d.email, d.name, leadType);

  return { status: "success", message: MESSAGES.success };
}
