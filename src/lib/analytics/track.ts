"use client";

/**
 * Analytics adapter.
 *
 * DOC5 §5.39 makes form_started, form_submitted and resume_uploaded part of the
 * feature's acceptance criteria, but DOC2 §45 stages PostHog as Phase 4 — after
 * MVP. This is the seam between those two facts: call sites emit events now,
 * and a provider is attached later without touching any of them.
 *
 * Until a provider is registered, events go nowhere in production and to the
 * console in development, so the wiring is verifiable without shipping a vendor
 * SDK or setting a tracking cookie.
 *
 * NO PERSONAL DATA. Event properties describe the interaction — which form,
 * which project type, whether a resume was attached — never the name, email,
 * phone, resume contents or anything else the visitor typed. DOC1 §33 requires
 * privacy to be respected in analytics, and a leaked email in an event payload
 * is exactly the kind of thing that is hard to walk back.
 */

export type AnalyticsEvent =
  | "recruiting_form_started"
  | "recruiting_form_submitted"
  | "software_form_started"
  | "software_form_submitted"
  | "contact_form_started"
  | "contact_form_submitted"
  | "resume_selected"
  | "form_submit_failed";

export type EventProps = Record<string, string | number | boolean | undefined>;

type Provider = (event: AnalyticsEvent, props?: EventProps) => void;

let provider: Provider | null = null;

/**
 * Register the analytics provider. Called once, from a client boundary, when
 * PostHog (or whatever replaces it) is introduced in Phase 4.
 */
export function setAnalyticsProvider(next: Provider): void {
  provider = next;
}

export function trackEvent(event: AnalyticsEvent, props?: EventProps): void {
  if (provider) {
    try {
      provider(event, props);
    } catch {
      // Analytics must never break a form submission.
    }
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[analytics]", event, props ?? {});
  }
}

/**
 * Fire a "started" event the first time a visitor interacts with a form.
 *
 * Returns a handler for the form's `onFocus`. Using focus rather than a page
 * view is what makes the funnel meaningful: DOC1 §33 wants form STARTS measured
 * separately from form views, so abandonment is visible.
 */
export function createStartTracker(event: AnalyticsEvent) {
  let fired = false;
  return () => {
    if (fired) return;
    fired = true;
    trackEvent(event);
  };
}
