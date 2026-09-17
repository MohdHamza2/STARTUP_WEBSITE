"use client";

import { useEffect, useRef } from "react";

/**
 * Lead attribution (DOC5 §5.27; DOC2 §39).
 *
 * Captures `source` and the five UTM parameters from the landing URL and
 * submits them as hidden fields, so the team can tell which channel actually
 * produced a lead — `/recruiting?source=linkedin` arriving as
 * `source = linkedin` on the record.
 *
 * FIRST-TOUCH, not last-touch. The values are stored in `sessionStorage` on the
 * first page of the visit, so a visitor who lands from a campaign, browses to
 * another page and submits there still carries the original attribution.
 * Reading only `location.search` at submit time would attribute that lead to
 * nothing, which is the common way this gets built wrong.
 *
 * Session-scoped rather than persistent: it expires when the tab closes, is not
 * a tracking cookie, and never identifies anybody.
 *
 * These values are recorded for reporting only. They are attacker-controllable
 * by definition, so nothing authorises off them (prompt §44).
 */

const KEYS = [
  "source",
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "utmContent",
  "utmTerm",
] as const;

const PARAM_FOR: Record<(typeof KEYS)[number], string> = {
  source: "source",
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmContent: "utm_content",
  utmTerm: "utm_term",
};

const STORAGE_KEY = "genra:attribution";

type Attribution = Partial<Record<(typeof KEYS)[number], string>>;

function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  // A stored value wins: it is the first touch of this session.
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as Attribution;
  } catch {
    // Private mode or blocked storage — fall through to the URL.
  }

  const params = new URLSearchParams(window.location.search);
  const found: Attribution = {};

  for (const key of KEYS) {
    const value = params.get(PARAM_FOR[key]);
    // Bounded, matching the schema, so a crafted URL cannot inflate the payload.
    if (value) found[key] = value.slice(0, 100);
  }

  // Fall back to the referrer host when there is no explicit campaign tag.
  if (!found.source && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) found.source = host.slice(0, 100);
    } catch {
      // Malformed referrer — ignore.
    }
  }

  if (Object.keys(found).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    } catch {
      // Storage unavailable; the fields still submit for this page.
    }
  }

  return found;
}

export function Attribution() {
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Values are written straight to the inputs rather than held in state.
   *
   * Reading `location.search` during render would desync hydration, and putting
   * the result in state would re-render the whole form for data no one looks at.
   * Writing to uncontrolled inputs is the textbook effect: synchronising an
   * external system — the DOM — with something React does not own.
   */
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const values = readAttribution();
    for (const key of KEYS) {
      const input = root.querySelector<HTMLInputElement>(`input[name="${key}"]`);
      if (input) input.value = values[key] ?? "";
    }
  }, []);

  return (
    <div ref={ref} hidden>
      {KEYS.map((key) => (
        <input key={key} type="hidden" name={key} defaultValue="" />
      ))}
    </div>
  );
}
