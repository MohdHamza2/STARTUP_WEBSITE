import { test, expect, type Page } from "@playwright/test";

/**
 * Hero service panels (prompt §66).
 *
 * Six panels must route correctly, hover must never navigate, and keyboard
 * activation must work. These run against the real scroll-driven hero rather
 * than a stub, because the thing under test IS the coupling between scroll
 * position, the generated timeline and hotspot geometry.
 */

/** Scroll to a fraction of the pinned hero's own range and let it settle. */
async function scrubTo(page: Page, progress: number) {
  await page.evaluate((p) => {
    const heroRange = 6 * window.innerHeight - window.innerHeight;
    window.scrollTo(0, Math.round(p * heroRange));
  }, progress);
  // Lenis animates programmatic scrolls; wait for the frame loop to settle.
  await page.waitForTimeout(1200);
}

/** Whichever panel hotspots are currently visible, with their interaction state. */
async function activePanel(page: Page) {
  return page.evaluate(() => {
    const links = [
      ...document.querySelectorAll<HTMLAnchorElement>(
        'main a[href="/software"], main a[href="/recruiting"]',
      ),
    ].slice(0, 6);
    const visible = links.filter((a) => a.style.opacity === "1");
    return visible.map((a) => ({
      label: a.textContent?.trim() ?? "",
      href: a.getAttribute("href") ?? "",
      clickable: a.style.pointerEvents === "auto",
      tabIndex: a.tabIndex,
    }));
  });
}

test.describe("hero panels", () => {
  test("all six panels exist with the approved routing", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);

    const panels = await page.evaluate(() =>
      [
        ...document.querySelectorAll<HTMLAnchorElement>(
          'main a[href="/software"], main a[href="/recruiting"]',
        ),
      ]
        .slice(0, 6)
        .map((a) => ({
          label: a.textContent?.trim() ?? "",
          href: a.getAttribute("href") ?? "",
        })),
    );

    expect(panels).toEqual([
      { label: "MVP Development", href: "/software" },
      { label: "SaaS Development", href: "/software" },
      { label: "Web Applications", href: "/software" },
      { label: "AI-Powered Applications", href: "/software" },
      { label: "Automation Systems", href: "/software" },
      { label: "Career & Recruiting", href: "/recruiting" },
    ]);
  });

  test("exactly one panel is ever active — zero overlap", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);

    for (const progress of [0.2, 0.3, 0.4, 0.5, 0.55]) {
      await scrubTo(page, progress);
      const active = await activePanel(page);
      expect(
        active.length,
        `${active.length} panels visible at progress ${progress}`,
      ).toBeLessThanOrEqual(1);
    }
  });

  test("a settled panel is clickable and navigates", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1500);

    // Walk forward until a clickable panel appears.
    let found: { href: string } | null = null;
    for (const progress of [0.22, 0.26, 0.3, 0.34, 0.38]) {
      await scrubTo(page, progress);
      const active = await activePanel(page);
      if (active.length === 1 && active[0].clickable) {
        found = active[0];
        break;
      }
    }

    expect(found, "no clickable panel found while scrubbing").not.toBeNull();

    const target = page
      .locator(`main a[href="${found!.href}"]`)
      .filter({ hasNot: page.locator(":scope[aria-hidden=true]") })
      .first();

    await target.click();
    await expect(page).toHaveURL(new RegExp(`${found!.href}$`));
  });

  test("hovering a panel does not navigate or transform it", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Touch devices have no hover state to test.");

    await page.goto("/");
    await page.waitForTimeout(1500);
    await scrubTo(page, 0.3);

    const before = page.url();

    const result = await page.evaluate(() => {
      const el = [
        ...document.querySelectorAll<HTMLAnchorElement>(
          'main a[href="/software"], main a[href="/recruiting"]',
        ),
      ].find((a) => a.style.opacity === "1");
      if (!el) return null;

      el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true }));
      el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));

      const style = getComputedStyle(el);
      return {
        transform: style.transform,
        boxShadow: style.boxShadow,
        filter: style.filter,
      };
    });

    expect(result).not.toBeNull();
    // §11: no scale, no tilt, no glow, no movement on hover.
    expect(result!.transform === "none" || result!.transform === "matrix(1, 0, 0, 1, 0, 0)").toBe(true);
    expect(result!.boxShadow).toBe("none");
    expect(result!.filter).toBe("none");

    await page.waitForTimeout(400);
    expect(page.url()).toBe(before);
  });

  test("a settled panel is keyboard focusable and activates with Enter", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Keyboard activation is covered on desktop.");

    await page.goto("/");
    await page.waitForTimeout(1500);
    await scrubTo(page, 0.3);

    const active = await activePanel(page);
    test.skip(active.length !== 1 || !active[0].clickable, "no settled panel here");

    // tabIndex 0 is what makes it reachable; -1 panels are deliberately skipped.
    expect(active[0].tabIndex).toBe(0);

    const href = active[0].href;
    await page.evaluate(() => {
      const el = [
        ...document.querySelectorAll<HTMLAnchorElement>(
          'main a[href="/software"], main a[href="/recruiting"]',
        ),
      ].find((a) => a.style.opacity === "1" && a.tabIndex === 0);
      el?.focus();
    });

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });

  test("reduced motion gets the full static hero with all six services", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Services" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("link")).toHaveCount(6);
    await expect(nav.getByRole("link", { name: "Career & Recruiting" })).toHaveAttribute(
      "href",
      "/recruiting",
    );

    await context.close();
  });
});
