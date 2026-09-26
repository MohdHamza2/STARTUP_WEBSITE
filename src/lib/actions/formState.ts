/**
 * Shared form submission state.
 *
 * Lives in its own module — WITHOUT a `"use server"` directive — because a
 * `"use server"` module may only export async functions (plus types). The
 * previous location of `IDLE` inside `submitLead.ts` violated that rule and
 * broke every Server Action in the module at runtime
 * (Next `invalid-use-server-value`: "A `use server` file can only export
 * async functions, found object").
 *
 * Both sides import from here: the Server Action module (for its signatures
 * and initial-state contract) and the client forms (for `useActionState`).
 * This file imports nothing, so it can never introduce a server/client
 * boundary violation or a circular dependency.
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
