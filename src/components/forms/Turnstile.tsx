"use client";

import Script from "next/script";
import { useEffect, useId, useRef, useState } from "react";

/**
 * Cloudflare Turnstile widget.
 *
 * Implemented directly against Cloudflare's script rather than pulling in a
 * React wrapper — it is a render call and a callback, and the Frontend Agent
 * rules forbid unnecessary dependencies.
 *
 * The token this produces is only a claim. It proves nothing until the server
 * exchanges it with Cloudflare (prompt §43), which `verifyTurnstile` does.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      remove: (id: string) => void;
    };
  }
}

export function Turnstile({ onToken }: { onToken?: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [ready, setReady] = useState(false);
  const fieldId = useId();

  useEffect(() => {
    if (!ready || !siteKey || !containerRef.current || widgetId.current) return;
    if (!window.turnstile) return;

    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "dark",
      callback: (value) => {
        setToken(value);
        onToken?.(value);
      },
      // Tokens are short-lived and single-use. Clearing on expiry means a stale
      // token is never submitted — the visitor simply re-verifies.
      "expired-callback": () => {
        setToken("");
        onToken?.("");
      },
      "error-callback": () => {
        setToken("");
        onToken?.("");
      },
    });

    const id = widgetId.current;
    return () => {
      if (id) window.turnstile?.remove(id);
      widgetId.current = null;
    };
  }, [ready, siteKey, onToken]);

  if (!siteKey) {
    /**
     * No site key configured (owner decision D4 — credentials not yet supplied).
     * Say so plainly instead of rendering a form that will fail on submit: the
     * server fails closed without a secret, so a submission cannot succeed.
     */
    return (
      <p
        role="status"
        className="rounded-md border border-line-dark bg-card-dark px-5 py-4 text-caption text-silver"
      >
        Spam protection is not configured, so this form cannot accept
        submissions yet. Set <code className="text-mint">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code>{" "}
        and <code className="text-mint">TURNSTILE_SECRET_KEY</code> to enable it.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onReady={() => setReady(true)}
      />
      <div ref={containerRef} id={fieldId} />
      <input type="hidden" name="turnstileToken" value={token} />
    </>
  );
}
