import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Automated accessibility audit (prompt §46; DOC2 §30).
 *
 * Scoped to WCAG 2.0/2.1 A and AA, which is the standard the project targets.
 *
 * Automated checks catch roughly a third of real accessibility problems, so this
 * complements rather than replaces the manual verification recorded in
 * Reports/Progress.md — keyboard traversal, focus restoration, and the
 * reduced-motion path are all exercised by the other specs.
 */

const ROUTES = [
  "/",
  "/software",
  "/recruiting",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
] as const;

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

for (const [route, scheme] of ROUTES.flatMap((r) => [
  [r, "light"],
  [r, "dark"],
] as const)) {
  // Dark theme (2026-10-07) is audited too: contrast must hold in both.
  // Dark is opt-in, so it is set the way the header toggle saves it.
  test(`${route} has no WCAG A/AA violations (${scheme})`, async ({ page }) => {
    if (scheme === "dark") {
      await page.addInitScript(() => localStorage.setItem("genra-theme", "dark"));
    }
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", scheme);
    // Let the hero resolve its motion preference and the reveals settle, so the
    // audit runs against what a visitor actually sees.
    await page.waitForTimeout(1500);

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    // Report every violation with its selector, rather than just a count.
    const summary = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target.join(" ")),
    }));

    expect(summary, JSON.stringify(summary, null, 2)).toEqual([]);
  });
}

// Owner, 2026-10-07: light first for every visitor; dark only by choice.
test("light by default even when the system prefers dark; the toggle switches and remembers", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "light");

  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "dark");

  await page.getByRole("button", { name: "Dark theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("404 page has no WCAG A/AA violations", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  await page.waitForTimeout(500);

  const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("the recruiting form is fully keyboard reachable", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Keyboard traversal is verified on desktop.");

  await page.goto("/recruiting#apply");
  await page.waitForTimeout(800);

  // Every control must be reachable without a pointer — including the file
  // input, which is visually hidden behind the drag-and-drop affordance.
  const reachable = await page.evaluate(() => {
    const form = document.querySelector("form");
    if (!form) return { total: 0, unreachable: ["no form"] };

    const controls = [
      ...form.querySelectorAll<HTMLElement>(
        "input:not([type=hidden]), textarea, select, button",
      ),
    ];

    const unreachable = controls
      .filter((c) => c.tabIndex < 0 || (c as HTMLInputElement).disabled)
      .map((c) => c.getAttribute("name") || c.tagName);

    return { total: controls.length, unreachable };
  });

  expect(reachable.unreachable).toEqual([]);
  expect(reachable.total).toBeGreaterThan(10);
});
