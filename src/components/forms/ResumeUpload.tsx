"use client";

import { useId, useRef, useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import {
  RESUME_MAX_BYTES,
  RESUME_ACCEPTED_EXTENSIONS,
} from "@/lib/validation/schemas";
import { trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/utils";

/**
 * Resume upload (DOC5 Â§5.12).
 *
 * PDF only, 10 MB, per owner decision D6.
 *
 * The checks here are for the visitor's benefit â€” immediate feedback instead of
 * a round trip. They are NOT security. The server re-validates type, size and
 * the actual leading bytes of the file, because everything below can be
 * bypassed (prompt Â§32, Â§41).
 *
 * Drag-and-drop is an enhancement layered over a real `<input type="file">`, so
 * keyboard and assistive-technology users get the native picker unchanged.
 */
export function ResumeUpload({ error }: { error?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const id = useId();

  const accept = RESUME_ACCEPTED_EXTENSIONS.join(",");
  const shownError = localError ?? error;

  function validate(candidate: File): string | null {
    if (!candidate.name.toLowerCase().endsWith(".pdf")) {
      return "This file type isn't supported. Please upload a PDF.";
    }
    if (candidate.type && candidate.type !== "application/pdf") {
      return "This file type isn't supported. Please upload a PDF.";
    }
    if (candidate.size > RESUME_MAX_BYTES) {
      return "Your resume exceeds the maximum allowed file size of 10 MB.";
    }
    if (candidate.size === 0) return "That file appears to be empty.";
    return null;
  }

  function accept_(candidate: File | undefined) {
    if (!candidate) return;
    const problem = validate(candidate);
    if (problem) {
      setLocalError(problem);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setLocalError(null);
    setFile(candidate);
    // Size only — never the filename, which often contains the candidate's name.
    trackEvent("resume_selected", { sizeKb: Math.round(candidate.size / 1024) });
  }

  function clear() {
    setFile(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <label htmlFor={id} className="block text-caption font-medium text-silver">
        Resume
        <span className="ml-2 font-normal text-silver">Optional</span>
      </label>
      <p id={`${id}-hint`} className="mt-1.5 text-caption text-silver">
        PDF, up to 10 MB. Stored privately â€” never made public.
      </p>

      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            accept_(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "mt-3 rounded-md border border-dashed px-6 py-10 text-center transition-colors",
            "duration-[var(--duration-fast)]",
            dragging
              ? "border-mint bg-card-dark"
              : "border-line-dark bg-card-dark/40 hover:border-graphite",
          )}
        >
          <Upload
            aria-hidden="true"
            className="mx-auto size-5 text-silver"
          />
          <p className="mt-4 text-body text-silver">
            Drop your resume here, or{" "}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-mint underline underline-offset-4"
            >
              browse files
            </button>
          </p>
          <p className="mt-2 text-caption text-silver">PDF Â· Max 10 MB</p>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-4 rounded-md border border-line-dark bg-card-dark px-5 py-4">
          <span className="flex min-w-0 items-center gap-3">
            <FileText aria-hidden="true" className="size-4 shrink-0 text-mint" />
            <span className="min-w-0">
              <span className="block truncate text-body text-ivory">
                {file.name}
              </span>
              <span className="block text-caption text-silver">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
            </span>
          </span>
          <button
            type="button"
            onClick={clear}
            className="flex shrink-0 items-center gap-1.5 text-caption text-silver transition-colors hover:text-ivory"
          >
            Remove
            <X aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      )}

      {/*
        The real control. Kept in the DOM at all times so the form submits the
        file normally and the native picker stays available; visually hidden
        rather than removed, so it remains reachable.
      */}
      <input
        ref={inputRef}
        id={id}
        name="resume"
        type="file"
        accept={accept}
        aria-describedby={cn(
          `${id}-hint`,
          shownError && `${id}-error`,
        )}
        aria-invalid={shownError ? true : undefined}
        onChange={(e) => accept_(e.target.files?.[0])}
        className="sr-only"
      />

      {shownError && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-caption text-red-400">
          {shownError}
        </p>
      )}
    </div>
  );
}
