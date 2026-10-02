import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * Branded 404 (prompt §57).
 * "Lost the path?" plays on the GENRA Path mark. Deliberately not overdesigned —
 * one line, one action, generous negative space.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center">
      <div className="container-content">
        <h1 className="text-display text-ink">Lost the path?</h1>
        <p className="mt-6 max-w-md text-body-lg text-muted">
          This page doesn&apos;t exist. Everything else is still where you left it.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center rounded-pill bg-ink px-7 py-3.5 text-action font-semibold text-paper transition-[background-color,transform] duration-[var(--duration-fast)] ease-[var(--ease-genra)] hover:bg-graphite active:scale-[0.98]"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
