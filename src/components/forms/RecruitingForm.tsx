"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitRecruiting, IDLE } from "@/lib/actions/submitLead";
import { visaStatusOptions, educationOptions } from "@/content/recruiting";
import { TextField, TextArea, SelectField, Checkbox } from "./Field";
import { ResumeUpload } from "./ResumeUpload";
import { Turnstile } from "./Turnstile";
import { cn } from "@/lib/utils";

const toOptions = (values: readonly string[]) =>
  values.map((value) => ({ value, label: value }));

/**
 * Recruiting enquiry form (prompt Â§29; DOC5 Â§5.8â€“Â§5.15).
 *
 * Required: name and email. Everything else â€” phone, education, university,
 * graduation year, work authorisation, target role, industry, location,
 * LinkedIn, resume â€” is optional, per DOC5 and owner decision D1.
 *
 * Grouped into sections rather than split across steps, which is what DOC5 Â§5.7
 * asks for: "a single logical form with sections rather than overcomplicating
 * it with multiple pages".
 *
 * The consent line states plainly that submitting does not guarantee employment
 * or placement (DOC5 Â§5.14), which is also where Â§27's outcome boundary lands
 * instead of a defensive marketing section.
 */
export function RecruitingForm() {
  const [state, action, pending] = useActionState(submitRecruiting, IDLE);

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-line-dark bg-card-dark px-8 py-14 text-center sm:px-14"
      >
        <span aria-hidden="true" className="mx-auto block h-px w-16 bg-mint" />
        <h3 className="mt-10 font-display text-h2 text-ivory">Received.</h3>
        <p className="mx-auto mt-5 max-w-md text-body text-silver">
          {state.message && state.message !== "Received."
            ? state.message
            : "Your profile is with GENRA. The team reviews every profile that comes in."}
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
    <form action={action} noValidate className="space-y-14">
      <Section title="About you">
        <div className="grid gap-8 sm:grid-cols-2">
          <TextField
            name="name"
            label="Full name"
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
          placeholder="https://linkedin.com/in/â€¦"
          error={state.errors?.linkedinUrl}
        />
      </Section>

      <Section title="Your resume">
        <ResumeUpload error={state.errors?.resume} />
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
                className="text-mint underline underline-offset-4"
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
          {pending ? "Submittingâ€¦" : "Submit profile"}
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
    <fieldset className="rule-dark pt-10">
      <legend className="sr-only">{title}</legend>
      <p aria-hidden="true" className="text-eyebrow uppercase text-silver">
        {title}
      </p>
      <div className="mt-8 space-y-8">{children}</div>
    </fieldset>
  );
}
