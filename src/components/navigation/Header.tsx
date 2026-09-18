"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { primaryNav, secondaryNav, legalNav, cta } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Global header.
 *
 * Prompt Â§5 is explicit about what may appear here:
 *   - Left: the GENRA logo
 *   - Primary nav: Software and Recruiting, and NOTHING else
 *   - No About, no Contact, no "Start a Project", no sign-up button
 * Everything else lives in the overlay menu (prompt Â§37).
 *
 * The header is transparent over the hero and gains a surface once the visitor
 * scrolls, so it never competes with the opening sequence.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on route change, so a client-side navigation never strands the overlay.
  // Adjusting state during render is React's documented pattern for deriving
  // state from a changed input â€” an effect here would cause a cascading render
  // and leave the overlay visible for a frame after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    // Move focus into the panel so a keyboard user lands inside the dialog.
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      // Trap focus: the overlay is modal, so Tab must not reach the page behind.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter]",
          "duration-[var(--duration-normal)] ease-[var(--ease-genra)]",
          scrolled
            ? "border-b border-line-dark bg-obsidian/80 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="container-wide flex h-20 items-center justify-between">
          <Link href="/" aria-label="GENRA â€” home" className="relative z-10">
            <Logo />
          </Link>

          <div className="flex items-center gap-8">
            {/* Below md the logo, two nav items and the trigger collide at 375px.
                Navigation becomes the hamburger there (prompt Â§45) â€” nothing is
                lost, because the overlay already lists Software and Recruiting. */}
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-8">
                {primaryNav.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative text-[0.9375rem] font-medium transition-colors",
                          "duration-[var(--duration-fast)]",
                          "after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-mint",
                          "after:transition-[width] after:duration-[var(--duration-normal)]",
                          "after:ease-[var(--ease-genra)]",
                          active
                            ? "text-ivory after:w-full"
                            : "text-silver hover:text-ivory after:w-0 hover:after:w-full",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              aria-label="Open menu"
              className={cn(
                "-mr-2 grid size-10 place-items-center rounded-md text-ivory",
                "transition-colors duration-[var(--duration-fast)] hover:text-mint",
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay menu â€” prompt Â§37: premium and simple, never a mega-menu. */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!menuOpen}
        className="fixed inset-0 z-[60]"
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 w-full cursor-default bg-obsidian/95 backdrop-blur-lg",
            "transition-opacity duration-[var(--duration-normal)]",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Scrollable: on short viewports (landscape phones) the menu is taller
            than the screen, and the legal/contact row below the divider must
            stay reachable rather than being clipped. */}
        <div
          ref={panelRef}
          className="container-wide relative flex h-full flex-col overflow-y-auto overscroll-contain"
        >
          <div className="flex h-20 items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className={cn(
                "-mr-2 grid size-10 place-items-center rounded-md text-ivory",
                "transition-colors duration-[var(--duration-fast)] hover:text-mint",
              )}
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label="Secondary"
            className="flex flex-1 shrink-0 flex-col justify-center py-10"
          >
            <ul className="flex flex-col gap-2">
              {[...primaryNav, ...secondaryNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-baseline gap-5 py-2 text-ivory",
                      "transition-colors duration-[var(--duration-fast)] hover:text-mint",
                    )}
                  >
                    <span className="font-display text-h2">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 rule-dark pt-8">
              <Link
                href="/contact"
                className="text-body text-silver transition-colors hover:text-ivory"
              >
                {cta.general}
              </Link>
              {legalNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-caption text-silver transition-colors hover:text-silver"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
