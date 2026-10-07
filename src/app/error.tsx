"use client";

import { useEffect } from "react";

/**
 * Route error boundary (prompt §56).
 *
 * The visitor gets a safe, brand-consistent message and a retry — never a stack
 * trace, a digest, or internal detail (prompt §44: safe error messages).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server-side logging captures the detail; the UI never exposes it.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] items-center">
      <div className="container-content">
        <h1 className="text-display text-ink">That didn&apos;t load.</h1>
        <p className="mt-6 max-w-md text-body-lg text-muted">
          An unexpected error interrupted this page. Trying again usually resolves it.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex items-center rounded-pill bg-ink px-7 py-3.5 text-action font-semibold text-paper transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-genra)] hover:bg-ink-soft active:scale-[0.98]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
