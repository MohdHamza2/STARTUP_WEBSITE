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
        <p className="text-eyebrow uppercase text-graphite">404</p>
        <h1 className="mt-6 text-display text-ivory">Lost the path?</h1>
        <p className="mt-6 max-w-md text-body-lg text-silver">
          This page doesn&apos;t exist. Everything else is still where you left it.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center rounded-pill bg-mint px-7 py-3.5 text-[0.9375rem] font-semibold text-obsidian transition-colors duration-[var(--duration-fast)] hover:bg-mint-deep"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
