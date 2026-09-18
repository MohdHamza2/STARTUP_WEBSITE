import "server-only";

/**
 * Cloudflare Turnstile verification.
 *
 * prompt §43: "Validate Turnstile server-side. Do not treat a client-side token
 * as proof of validity." The token that arrives with a submission is only a
 * claim; this exchanges it with Cloudflare for an actual verdict.
 *
 * Tokens are single-use and short-lived, so a replayed token fails here — which
 * is the property that makes this worth doing at all.
 */

const VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: "not-configured" | "invalid" | "unavailable" };

export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // Fail CLOSED when unconfigured. Treating a missing secret as "pass" would
  // silently disable spam protection in production the moment an env var was
  // dropped, which is the worst possible failure mode for a public form.
  if (!secret) return { ok: false, reason: "not-configured" };
  if (!token) return { ok: false, reason: "invalid" };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      // Cloudflare being slow must not hang the submission indefinitely.
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) return { ok: false, reason: "unavailable" };

    const data = (await response.json()) as { success?: boolean };
    return data.success ? { ok: true } : { ok: false, reason: "invalid" };
  } catch {
    // Network failure or timeout. Still fails closed — we cannot distinguish an
    // outage from an attacker blocking the check.
    return { ok: false, reason: "unavailable" };
  }
}
