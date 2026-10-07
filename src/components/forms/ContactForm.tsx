"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { submitContact } from "@/lib/actions/submitLead";
import { IDLE } from "@/lib/actions/formState";
import { CONTACT_TOPICS, type ContactTopic } from "@/lib/validation/schemas";
import { TextField, TextArea, Checkbox } from "./Field";
import { Turnstile } from "./Turnstile";
import { Attribution } from "./Attribution";
import { createStartTracker, trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";
import { useRevealOnSuccess } from "@/lib/scroll";

const TOPIC_LABELS: Record<ContactTopic, { title: string; blurb: string }> = {
  software: {
    title: "A project",
    blurb: "Software, an MVP, automation — something you want built.",
  },
  recruiting: {
    title: "Career support",
    blurb: "Help with the job-application workload.",
  },
};

/**
 * Contact form (prompt §34).
 *
 * One form, two paths. The topic selection drives which fields apply and, on
 * the server, which funnel the lead is recorded into.
 *
 * States covered per §32 and §56: loading, disabled-while-submitting, success,
 * error, retry, and field-level validation. The submit button is disabled while
 * the request is in flight, which is what prevents the duplicate submission
 * DOC5 §5.36 describes.
 */
export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, IDLE);
  const successRef = useRevealOnSuccess(state.status);
  const [topic, setTopic] = useState<ContactTopic>("software");

  // Fires once, on first interaction — so form STARTS are measurable separately
  // from form views and abandonment is visible (DOC1 §33).
  const [trackStart] = useState(() =>
    createStartTracker("contact_form_started"),
  );

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("contact_form_submitted", { topic });
    } else if (state.status === "error") {
      // The reason only — never the field values.
      trackEvent("form_submit_failed", { form: "contact", topic });
    }
  }, [state.status, topic]);

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="outline-none border border-line bg-surface px-8 py-14 text-center sm:px-14"
      >
        <span aria-hidden="true" className="mx-auto block h-px w-16 bg-mint" />
        <h3 className="mt-10 font-display text-h2 text-ink">Received.</h3>
        {/* No response-time commitment — none is defined (prompt §33). */}
        <p className="mx-auto mt-5 max-w-sm text-body text-muted">
          {state.message && state.message !== "Received."
            ? state.message
            : "Your details are on their way to GENRA."}
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-4 text-action font-medium text-ink transition-colors hover:text-muted"
        >
          Back to home
          <span aria-hidden="true" className="block h-px w-8 bg-mint" />
        </Link>
      </div>
    );
  }

  return (
    <form
      action={action}
      onFocus={trackStart}
      noValidate
      className="space-y-10"
    >
      <Attribution />

      {/* Topic selection — radios, so it works without JS and is keyboard
          navigable as a group. */}
      <fieldset>
        <legend className="text-caption font-medium text-muted">
          What is this about?
        </legend>
        <div className="mt-4 grid gap-px bg-line sm:grid-cols-2">
          {CONTACT_TOPICS.map((value) => {
            const selected = topic === value;
            return (
              <label
                key={value}
                className={cn(
                  "cursor-pointer bg-paper px-6 py-6 transition-colors duration-[var(--duration-fast)]",
                  selected ? "bg-surface" : "hover:bg-surface/70",
                )}
              >
                <input
                  type="radio"
                  name="topic"
                  value={value}
                  checked={selected}
                  onChange={() => setTopic(value)}
                  className="sr-only"
                />
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block size-2 rounded-full",
                      selected ? "bg-mint" : "bg-silver",
                    )}
                  />
                  <span className="font-display text-h3 text-ink">
                    {TOPIC_LABELS[value].title}
                  </span>
                </span>
                <span className="mt-2 block text-body text-muted">
                  {TOPIC_LABELS[value].blurb}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-8 sm:grid-cols-2">
        <TextField
          name="name"
          label="Name"
          autoComplete="name"
          error={state.errors?.name}
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={state.errors?.email}
        />
      </div>

      <TextField
        name="phone"
        label="Phone"
        type="tel"
        optional
        autoComplete="tel"
        hint="Include your country code if you're outside the US."
        error={state.errors?.phone}
      />

      <TextArea
        name="message"
        label={topic === "software" ? "What do you want built?" : "Tell us about your search"}
        placeholder={
          topic === "software"
            ? "What the product needs to do, and roughly where you are with it."
            : "The roles you're targeting and where you are in your studies or career."
        }
        error={state.errors?.message}
      />

      <Checkbox
        name="consent"
        error={state.errors?.consent}
        label={
          <>
            I agree to be contacted about this enquiry, and I&apos;ve read the{" "}
            <Link href="/privacy" className="text-ink underline decoration-mint decoration-2 underline-offset-4">
              privacy notice
            </Link>
            .{" "}
            {topic === "recruiting" && (
              <>Submitting this does not guarantee employment or placement.</>
            )}
          </>
        }
      />

      <Turnstile />

      {state.status === "error" && state.message && (
        <p
          role="alert"
          aria-live="assertive"
          className="border border-red-700/30 bg-red-50 px-5 py-4 text-caption text-red-800"
        >
          {state.message}
          {state.retryable && " You can try again."}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex items-center rounded-pill px-8 py-4 text-action font-semibold",
          "transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-genra)]",
          pending
            ? "cursor-not-allowed bg-silver text-graphite"
            : "bg-ink text-paper hover:bg-graphite active:scale-[0.98]",
        )}
      >
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
