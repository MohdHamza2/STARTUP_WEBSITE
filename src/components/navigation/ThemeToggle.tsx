"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { THEME_KEY } from "@/lib/theme";
import { cn } from "@/lib/utils";

/** The theme lives on <html data-theme>; React only reflects it. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}
const isDark = () => document.documentElement.dataset.theme === "dark";

/**
 * Light / dark switch for the header. Light is the default; this is the only
 * way into dark, and the choice is saved. The icons swap by CSS (`dark:`), so
 * the right one shows on first paint; `aria-pressed` follows once hydrated.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Not persisted (private mode, blocked storage); still applies now.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark theme"
      aria-pressed={dark}
      className={cn(
        "grid size-10 place-items-center rounded-md text-ink",
        "transition-colors duration-[var(--duration-fast)] hover:text-muted",
        className,
      )}
    >
      <Moon className="size-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
    </button>
  );
}
