import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client.
 *
 * The `server-only` import at the top is load-bearing: it makes the build FAIL
 * if this module is ever imported into a Client Component. Without it, a stray
 * import would ship the service-role key to the browser, which bypasses RLS and
 * exposes every candidate resume, visa status and contact detail
 * (prompt §44; DOC5 §5.29).
 *
 * Uses the service role because RLS denies the anon role everything by design —
 * see the RLS block in supabase/migrations/0001_init.sql.
 */

export interface ServiceConfig {
  url: string;
  serviceRoleKey: string;
  resumeBucket: string;
}

/**
 * Read configuration, or return null when it is absent.
 *
 * Returning null rather than throwing at module load is deliberate: the site
 * must build and render without credentials (owner decision D4), and a missing
 * configuration is an operational state to report, not a crash.
 */
export function getServiceConfig(): ServiceConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;

  return {
    url,
    serviceRoleKey,
    resumeBucket: process.env.SUPABASE_RESUME_BUCKET || "resumes",
  };
}

let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  const config = getServiceConfig();
  if (!config) return null;

  cached ??= createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
