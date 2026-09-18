import "server-only";
import { Resend } from "resend";

/**
 * Transactional email via Resend (DOC3.1 §3.15).
 *
 * THE CONTRACT THAT MATTERS: email failure must never lose a submission
 * (prompt §42). Every function here returns a result instead of throwing, and
 * the caller records the lead first and notifies second. A lead that is stored
 * but not emailed is recoverable; an email that is sent for a lead that was
 * never stored is not.
 *
 * Resume CONTENTS are never emailed (prompt §42) — the notification says only
 * whether one was attached.
 */

export type EmailResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "failed" };

function getClient(): { resend: Resend; from: string } | null {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from) return null;
  return { resend: new Resend(key), from };
}

/** Escape values before interpolating them into the notification HTML. */
function esc(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface LeadNotification {
  leadType: "RECRUITING" | "SOFTWARE";
  name: string;
  email: string;
  phone?: string;
  /** Field label → value. Rendered as a table. Never include resume contents. */
  details: Record<string, string | number | null | undefined>;
  resumeAttached: boolean;
  source?: string;
}

export async function sendTeamNotification(
  lead: LeadNotification,
): Promise<EmailResult> {
  const client = getClient();
  const to = process.env.LEADS_NOTIFICATION_EMAIL;
  if (!client || !to) return { ok: false, reason: "not-configured" };

  const rows = Object.entries(lead.details)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0;color:#6b7280;">${esc(label)}</td>` +
        `<td style="padding:6px 0;color:#111615;">${esc(value)}</td></tr>`,
    )
    .join("");

  const title =
    lead.leadType === "RECRUITING"
      ? "New recruiting lead"
      : "New project enquiry";

  try {
    const { error } = await client.resend.emails.send({
      from: client.from,
      to,
      replyTo: lead.email,
      subject: `${title} — ${lead.name}`,
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:640px;">
          <h1 style="font-size:18px;margin:0 0 20px;">${title}</h1>
          <table style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 16px 6px 0;color:#6b7280;">Name</td><td style="padding:6px 0;">${esc(lead.name)}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;">${esc(lead.email)}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;">${esc(lead.phone)}</td></tr>
            ${rows}
            <tr><td style="padding:6px 16px 6px 0;color:#6b7280;">Resume</td><td style="padding:6px 0;">${lead.resumeAttached ? "Uploaded" : "None"}</td></tr>
            <tr><td style="padding:6px 16px 6px 0;color:#6b7280;">Source</td><td style="padding:6px 0;">${esc(lead.source)}</td></tr>
          </table>
        </div>
      `,
    });

    return error ? { ok: false, reason: "failed" } : { ok: true };
  } catch {
    return { ok: false, reason: "failed" };
  }
}

/**
 * Confirmation to the person who submitted (DOC5 §5.24).
 *
 * Off unless SEND_CONFIRMATION_EMAIL is enabled, because it needs a verified
 * sender domain. The copy confirms receipt and nothing else — no response-time
 * commitment, and for recruiting no suggestion of an outcome (prompt §33, §53).
 */
export async function sendConfirmation(
  to: string,
  name: string,
  leadType: "RECRUITING" | "SOFTWARE",
): Promise<EmailResult> {
  if (process.env.SEND_CONFIRMATION_EMAIL !== "true") {
    return { ok: false, reason: "not-configured" };
  }

  const client = getClient();
  if (!client) return { ok: false, reason: "not-configured" };

  const body =
    leadType === "RECRUITING"
      ? "We've received your profile. The team will review it and be in touch if there's a relevant next step."
      : "We've received your project enquiry. The team will review it and get back to you.";

  try {
    const { error } = await client.resend.emails.send({
      from: client.from,
      to,
      subject: "We've received your details — GENRA",
      html: `
        <div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:560px;font-size:15px;line-height:1.6;">
          <p>Hi ${esc(name)},</p>
          <p>${body}</p>
          <p style="color:#6b7280;">GENRA — Build. Automate. Advance.</p>
        </div>
      `,
    });

    return error ? { ok: false, reason: "failed" } : { ok: true };
  } catch {
    return { ok: false, reason: "failed" };
  }
}
