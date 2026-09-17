"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Form field primitives.
 *
 * Accessibility contract, applied consistently (prompt Â§32, Â§46; DOC5 Â§5.31):
 *  - every control has a real <label>, associated by id
 *  - errors are linked with aria-describedby and announced via role="alert"
 *  - aria-invalid marks the control itself, so a screen reader announces the
 *    error state on focus rather than only when the message is read
 *  - optional fields say "Optional" in the label, so the requirement is
 *    apparent without relying on an asterisk convention
 */

const controlClass =
  "w-full rounded-md border border-line-dark bg-card-dark px-4 py-3.5 text-body " +
  "text-ivory placeholder:text-silver transition-colors duration-[var(--duration-fast)] " +
  "hover:border-graphite focus:border-mint focus:outline-none " +
  "aria-[invalid=true]:border-red-500/70";

function Shell({
  id,
  label,
  optional,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-caption font-medium text-silver">
        {label}
        {optional && (
          <span className="ml-2 font-normal text-silver">Optional</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-caption text-silver">
          {hint}
        </p>
      )}
      <div className="mt-2.5">{children}</div>
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-caption text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return (
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined
  );
}

export function TextField({
  name,
  label,
  type = "text",
  optional,
  hint,
  error,
  placeholder,
  autoComplete,
  defaultValue,
}: {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "url" | "number";
  optional?: boolean;
  hint?: string;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  defaultValue?: string;
}) {
  const id = useId();
  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error}>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass)}
      />
    </Shell>
  );
}

export function TextArea({
  name,
  label,
  optional,
  hint,
  error,
  placeholder,
  rows = 5,
}: {
  name: string;
  label: string;
  optional?: boolean;
  hint?: string;
  error?: string;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, "resize-y")}
      />
    </Shell>
  );
}

export function SelectField({
  name,
  label,
  options,
  optional,
  hint,
  error,
  placeholder = "Selectâ€¦",
  value,
  onChange,
}: {
  name: string;
  label: string;
  options: readonly { value: string; label: string }[];
  optional?: boolean;
  hint?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const id = useId();
  return (
    <Shell id={id} label={label} optional={optional} hint={hint} error={error}>
      <select
        id={id}
        name={name}
        required={!optional}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(controlClass, "appearance-none")}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}

export function Checkbox({
  name,
  label,
  error,
}: {
  name: string;
  label: ReactNode;
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-4 shrink-0 accent-[var(--color-mint)]"
        />
        <label htmlFor={id} className="text-caption text-silver">
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-caption text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
