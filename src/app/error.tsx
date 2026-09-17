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
        <p className="text-eyebrow uppercase text-graphite">Something went wrong</p>
        <h1 className="mt-6 text-display text-ivory">That didn&apos;t load.</h1>
        <p className="mt-6 max-w-md text-body-lg text-silver">
          An unexpected error interrupted this page. Trying again usually resolves it.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex items-center rounded-pill bg-mint px-7 py-3.5 text-[0.9375rem] font-semibold text-obsidian transition-colors duration-[var(--duration-fast)] hover:bg-mint-deep"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
