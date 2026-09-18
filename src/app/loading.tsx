/**
 * Route loading state (prompt §56: "Do not leave users staring at a blank
 * page").
 *
 * Deliberately minimal — a single mint rule that breathes. A spinner would
 * fight the brand's restraint, and a skeleton would imply a layout the next
 * route may not have.
 *
 * The animation is CSS-only, so it respects the global `prefers-reduced-motion`
 * rule in globals.css without any JavaScript.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-obsidian">
      <div role="status" aria-live="polite" className="text-center">
        <span
          aria-hidden="true"
          className="mx-auto block h-px w-24 animate-pulse bg-mint"
        />
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
