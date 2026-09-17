import { test, expect } from "@playwright/test";

/**
 * Navigation and layout contract.
 *
 * Prompt §5 is prescriptive about what may appear in the desktop header, and
 * §37 about what belongs in the overlay menu. These assert the rules directly,
 * because "looks right" is not the requirement — the requirement is that
 * About, Contact and any sign-up action are NOT in the primary header.
 */

test.describe("header", () => {
  test("desktop primary nav contains only Software and Recruiting", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Primary nav collapses to the hamburger below md.");

    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });

    await expect(nav.getByRole("link")).toHaveCount(2);
    await expect(nav.getByRole("link", { name: "Software" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Recruiting" })).toBeVisible();

    // The rules that matter most: these must NOT be in the header.
    await expect(nav.getByRole("link", { name: "About" })).toHaveCount(0);
    await expect(nav.getByRole("link", { name: "Contact" })).toHaveCount(0);
    await expect(
      nav.getByRole("link", { name: /start a project/i }),
    ).toHaveCount(0);
    await expect(nav.getByRole("link", { name: /sign ?up/i })).toHaveCount(0);
  });

  test("overlay menu holds the secondary navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();

    const menu = page.getByRole("dialog", { name: "Site menu" });
    await expect(menu).toBeVisible();

    for (const label of ["Software", "Recruiting", "About", "Contact"]) {
      await expect(menu.getByRole("link", { name: label })).toBeVisible();
    }
  });

  test("menu closes on Escape and returns focus to the trigger", async ({
    page,
  }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Open menu" });
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(
      page.getByRole("dialog", { name: "Site menu" }),
    ).toBeHidden();
    await expect(trigger).toBeFocused();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});

test.describe("routes", () => {
  const routes = [
    ["/", /Build\. Automate\. Advance\./],
    ["/software", /Software Solutions/],
    ["/recruiting", /Career & Recruiting/],
    ["/about", /About/],
    ["/contact", /Contact/],
    ["/privacy", /Privacy/],
    ["/terms", /Terms/],
  ] as const;

  for (const [path, title] of routes) {
    test(`${path} renders with exactly one h1`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(title);
      await expect(page.locator("main h1")).toHaveCount(1);
    });
  }

  test("unknown route renders the branded 404", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /lost the path/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Return Home" })).toBeVisible();
  });
});

test("no page scrolls horizontally", async ({ page }) => {
  for (const path of ["/", "/software", "/recruiting", "/contact"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => {
      const el = document.documentElement;
      return el.scrollWidth - el.clientWidth;
    });
    expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
  }
});
