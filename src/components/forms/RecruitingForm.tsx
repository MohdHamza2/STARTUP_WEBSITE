"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { submitRecruiting } from "@/lib/actions/submitLead";
import { IDLE } from "@/lib/actions/formState";
import { visaStatusOptions, educationOptions } from "@/content/recruiting";
import { TextField, TextArea, SelectField, Checkbox } from "./Field";
import { ResumeUpload } from "./ResumeUpload";
import { Turnstile } from "./Turnstile";
import { Attribution } from "./Attribution";
import { createStartTracker, trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value, label: value }));

/**
 * Recruiting enquiry form (prompt §29; DOC5 §5.8–§5.15).
 *
 * Required: name and phone (owner decision 2026-10-03, superseding D1 for this
 * form). Everything else — email, resume, education, university, graduation
 * year, work authorisation, target role, industry, location, LinkedIn — is
 * optional.
 *
 * Grouped into sections rather than split across steps, which is what DOC5 §5.7
 * asks for: "a single logical form with sections rather than overcomplicating
 * it with multiple pages".
 *
 * The consent line states plainly that submitting does not guarantee employment
 * or placement (DOC5 §5.14), which is also where §27's outcome boundary lands
 * instead of a defensive marketing section.
 */
export function RecruitingForm() {
  const [state, action, pending] = useActionState(submitRecruiting, IDLE);

  // Lazy state initialiser rather than a ref: the tracker must be created once
  // and is read during render to attach as a handler, which a ref forbids.
  const [trackStart] = useState(() =>
    createStartTracker("recruiting_form_started"),
  );

  useEffect(() => {
    if (state.status === "success") {
      trackEvent("recruiting_form_submitted");
    } else if (state.status === "error") {
      trackEvent("form_submit_failed", { form: "recruiting" });
    }
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-line bg-surface px-8 py-14 text-center sm:px-14"
      >
        <span aria-hidden="true" className="mx-auto block h-px w-16 bg-mint" />
        <h3 className="mt-10 font-display text-h2 text-ink">Received.</h3>
        <p className="mx-auto mt-5 max-w-md text-body text-muted">
          {state.message && state.message !== "Received."
            ? state.message
            : "Your profile is with GENRA. The team reviews every profile that comes in."}
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
      className="space-y-14"
    >
      <Attribution />

      {/* The essentials first: everything required, plus the resume, sits
          above the fold of the form. The sections after it are all optional. */}
      <Section title="About you">
        <TextField
          name="name"
          label="Full name"
          autoComplete="name"
          error={state.errors?.name}
        />
        <div className="grid gap-8 sm:grid-cols-2">
          <TextField
            name="phone"
            label="Phone"
            type="tel"
            autoComplete="tel"
            hint="Include your country code if you're outside the US."
            error={state.errors?.phone}
          />
          <TextField
            name="email"
            label="Email"
            type="email"
            optional
            autoComplete="email"
            error={state.errors?.email}
          />
        </div>
        <ResumeUpload error={state.errors?.resume} />
      </Section>

      <Section title="Education">
        <div className="grid gap-8 sm:grid-cols-2">
          <SelectField
            name="education"
            label="Current level"
            optional
            options={toOptions(educationOptions)}
            error={state.errors?.education}
          />
          <TextField
            name="graduationYear"
            label="Graduation year"
            type="number"
            optional
            placeholder="2027"
            error={state.errors?.graduationYear}
          />
        </div>
        <TextField
          name="university"
          label="University"
          optional
          error={state.errors?.university}
        />
      </Section>

      <Section title="What you're looking for">
        <div className="grid gap-8 sm:grid-cols-2">
          <TextField
            name="targetRole"
            label="Target role"
            optional
            placeholder="Software Engineer"
            error={state.errors?.targetRole}
          />
          <TextField
            name="preferredIndustry"
            label="Preferred industry"
            optional
            error={state.errors?.preferredIndustry}
          />
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <TextField
            name="location"
            label="Preferred location"
            optional
            error={state.errors?.location}
          />
          <SelectField
            name="visaStatus"
            label="Work authorisation"
            optional
            hint="Helps identify which opportunities are relevant."
            options={toOptions(visaStatusOptions)}
            error={state.errors?.visaStatus}
          />
        </div>
        <TextField
          name="linkedinUrl"
          label="LinkedIn profile"
          type="url"
          optional
          placeholder="https://linkedin.com/in/…"
          error={state.errors?.linkedinUrl}
        />
      </Section>

      <Section title="Anything else">
        <TextArea
          name="additionalInformation"
          label="Anything else"
          optional
          rows={4}
          placeholder="Anything else you'd like the team to know."
          error={state.errors?.additionalInformation}
        />
      </Section>

      <div className="space-y-8">
        <Checkbox
          name="consent"
          error={state.errors?.consent}
          label={
            <>
              I agree to be contacted about my enquiry and I&apos;ve read the{" "}
              <Link
                href="/privacy"
                className="text-ink underline decoration-mint decoration-2 underline-offset-4"
              >
                privacy notice
              </Link>
              . I understand that submitting this form does not guarantee
              employment or placement.
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
          {pending ? "Submitting…" : "Submit profile"}
        </button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rule pt-10">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden="true" className="text-eyebrow uppercase text-muted">
        {title}
      </p>
      <div className="mt-8 space-y-8">{children}</div>
    </fieldset>
  );
}
