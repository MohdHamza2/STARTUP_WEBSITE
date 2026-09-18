"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { submitProject, IDLE } from "@/lib/actions/submitLead";
import { projectTypeOptions, OTHER_PROJECT_TYPE } from "@/content/services";
import { TextField, TextArea, SelectField, Checkbox } from "./Field";
import { Turnstile } from "./Turnstile";
import { Attribution } from "./Attribution";
import { createStartTracker, trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

/**
 * Software project enquiry form (prompt §31).
 *
 * "Type of Project" is a dropdown carrying exactly the approved nine-service
 * catalog plus Other, sourced from `content/services.ts` so the form can never
 * drift from the catalog shown elsewhere on the site.
 *
 * THE CONDITIONAL FIELD (§31, §67):
 * Choosing Other reveals "Tell us what you have in mind", which is then
 * required. Choosing anything else hides it — and the input is UNMOUNTED rather
 * than hidden with CSS, so a stale value cannot ride along in the FormData.
 * The schema strips it server-side too, so tampering does not help either.
 */
export function ProjectForm() {
  const [state, action, pending] = useActionState(submitProject, IDLE);
  const [projectType, setProjectType] = useState("");

  const [trackStart] = useState(() =>
    createStartTracker("software_form_started"),
  );

  useEffect(() => {
    if (state.status === "success") {
      // The chosen service is a useful signal and is not personal data.
      trackEvent("software_form_submitted", { projectType });
    } else if (state.status === "error") {
      trackEvent("form_submit_failed", { form: "project" });
    }
  }, [state.status, projectType]);

  const isOther = projectType === OTHER_PROJECT_TYPE;

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-line-dark bg-card-dark px-8 py-14 text-center sm:px-14"
      >
        <span aria-hidden="true" className="mx-auto block h-px w-16 bg-mint" />
        <h3 className="mt-10 font-display text-h2 text-ivory">Received.</h3>
        <p className="mx-auto mt-5 max-w-sm text-body text-silver">
          Your details are on their way to GENRA.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-4 text-[0.9375rem] font-medium text-ivory transition-colors hover:text-mint"
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

      <div className="grid gap-8 sm:grid-cols-2">
        <TextField
          name="phone"
          label="Phone"
          type="tel"
          optional
          autoComplete="tel"
          error={state.errors?.phone}
        />
        <TextField
          name="company"
          label="Company"
          optional
          autoComplete="organization"
          error={state.errors?.company}
        />
      </div>

      <SelectField
        name="projectType"
        label="Type of project"
        options={projectTypeOptions}
        value={projectType}
        onChange={setProjectType}
        placeholder="Choose one…"
        error={state.errors?.projectType}
      />

      {/*
        Unmounted when Other is not selected, not merely hidden — a display:none
        input still submits its value, which is exactly the stale-value case
        §67 requires be impossible.
      */}
      {isOther && (
        <TextField
          name="otherProjectType"
          label="Tell us what you have in mind"
          placeholder="Describe the kind of work you need."
          error={state.errors?.otherProjectType}
        />
      )}

      <TextArea
        name="projectDescription"
        label="Project details"
        rows={6}
        placeholder="What the product needs to do, who it's for, and roughly where you are with it."
        error={state.errors?.projectDescription}
      />

      <TextArea
        name="additionalInformation"
        label="Anything else"
        optional
        rows={3}
        error={state.errors?.additionalInformation}
      />

      <Checkbox
        name="consent"
        error={state.errors?.consent}
        label={
          <>
            I agree to be contacted about this enquiry and I&apos;ve read the{" "}
            <Link href="/privacy" className="text-mint underline underline-offset-4">
              privacy notice
            </Link>
            .
          </>
        }
      />

      <Turnstile />

      {state.status === "error" && state.message && (
        <p
          role="alert"
          aria-live="assertive"
          className="border border-red-500/40 bg-red-500/5 px-5 py-4 text-caption text-red-300"
        >
          {state.message}
          {state.retryable && " You can try again."}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex items-center rounded-pill px-8 py-4 text-[0.9375rem] font-semibold",
          "transition-colors duration-[var(--duration-fast)]",
          pending
            ? "cursor-not-allowed bg-graphite text-silver"
            : "bg-mint text-obsidian hover:bg-mint-deep",
        )}
      >
        {pending ? "Sending…" : "Start a Project"}
      </button>
    </form>
  );
}
