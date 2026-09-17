import "server-only";

/**
 * In-process rate limiter for public submission endpoints (prompt §44;
 * DOC5 §5.28).
 *
 * SCOPE AND LIMITS — stated plainly rather than implied:
 * This is a fixed-window counter held in module memory. On a single long-lived
 * server it works. On serverless it is PER INSTANCE, so the effective limit
 * across a scaled deployment is higher than the number configured here, and a
 * cold start resets it.
 *
 * It is therefore a speed bump against casual abuse, not a guarantee. Turnstile
 * is the primary bot defence; this exists so a token-holding client cannot
 * hammer the endpoint. Before relying on it for real abuse resistance, move the
 * counter to a shared store (Upstash, or Postgres with a TTL index) or put
 * Cloudflare rate limiting in front — DOC2 §27 already anticipates the latter.
 */

interface Window {
  count: number;
  resetAt: number;
}

const windows = new Map<string, Window>();

/** Keeps the map from growing without bound on a long-lived process. */
function sweep(now: number) {
  if (windows.size < 5000) return;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the window resets. Only meaningful when ok is false. */
  retryAfter: number;
}

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      ok: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client identifier from proxy headers.
 *
 * These headers are client-controllable in principle, so this is only ever used
 * for rate-limit bucketing — never for authorisation, and never persisted as a
 * trusted fact (prompt §44: no trust of client-controlled state).
 */
export function clientKey(headers: Headers, scope: string): string {
  const forwarded = headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown";
  return `${scope}:${ip}`;
}
