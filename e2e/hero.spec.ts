import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";

/**
 * Homepage hero — the nine services as a scroll-driven Molten Ring.
 *
 * Scroll position IS the carousel position (each service owns 70svh of page
 * scroll), so these tests drive the real page scroll rather than a stub, and
 * assert on the caption the visitor reads and on where the page goes after
 * the last service.
 */

const SERVICES = [
  "MVP Development",
  "SaaS Development",
  "End-to-End Software Production",
  "Web Application",
  "Business Software",
  "Portfolio Websites",
  "AI-Powered Applications",
  "Automation Systems",
  "Career & Recruiting",
];

const caption = (page: Page) => page.locator("#services-hero [aria-live]");

/** Scroll so that service `index` (0-based, may be fractional) faces front. */
async function scrollToService(page: Page, index: number) {
  await page.evaluate((i) => {
    const section = document.getElementById("services-hero")!;
    const sticky = section.firstElementChild as HTMLElement;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + i * sticky.clientHeight * 0.7);
  }, index);
}

test.describe("service hero", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#services-hero")).toBeVisible();
  });

  test("lists exactly the nine services, in order, for assistive tech", async ({
    page,
  }) => {
    const items = page.locator("#services-hero ol.sr-only li");
    await expect(items).toHaveCount(9);
    for (const [i, title] of SERVICES.entries()) {
      await expect(items.nth(i)).toContainText(title);
    }
  });

  test("opens on service 01 and paints the ring without any scroll", async ({
    page,
  }) => {
    await expect(caption(page)).toContainText("01");
    await expect(caption(page)).toContainText("MVP Development");

    // Painted pixels, not element presence: the canvas existing proves nothing.
    // A WebGL buffer cannot be read back reliably, so this samples a real
    // screenshot of the stage and counts pixels that are not the Ivory page.
    const stage = page.locator("#services-hero canvas");
    await expect
      .poll(
        async () => {
          const png = await stage.screenshot();
          const { data, info } = await sharp(png)
            .raw()
            .toBuffer({ resolveWithObject: true });
          let painted = 0;
          for (let i = 0; i < data.length; i += info.channels * 3) {
            const off =
              Math.abs(data[i] - 0xf5) +
              Math.abs(data[i + 1] - 0xf4) +
              Math.abs(data[i + 2] - 0xef);
            // Photography on the cards is often near-white, so the bar is low.
            if (off > 18) painted++;
          }
          return painted;
        },
        {
          message: "the ring never painted",
          timeout: 20_000,
          intervals: [1_000],
        },
      )
      .toBeGreaterThan(500);
  });

  test("scrolling advances through every service in order", async ({ page }) => {
    for (const [i, title] of SERVICES.entries()) {
      await scrollToService(page, i);
      await expect(caption(page)).toContainText(title, { timeout: 10_000 });
      await expect(caption(page)).toContainText(String(i + 1).padStart(2, "0"));
    }
  });

  test("after service 09 the page releases into the next section, without looping", async ({
    page,
  }) => {
    await scrollToService(page, 8);
    await expect(caption(page)).toContainText("Career & Recruiting", {
      timeout: 10_000,
    });

    // Well past the last step: the hero must not snap back or wrap to 01.
    // The sequence spans 8 steps plus a short hold; 9.2 steps is just past
    // the release, where the next section has risen into view.
    await scrollToService(page, 9.2);
    await page.waitForTimeout(800);
    await expect(page.locator("#split-heading")).toBeInViewport();

    const stillHeld = await page.evaluate(() => {
      const r = document.getElementById("services-hero")!.getBoundingClientRect();
      return r.bottom > window.innerHeight;
    });
    expect(stillHeld).toBe(false);
  });

  test("next and previous buttons step one service at a time", async ({
    page,
  }) => {
    const previous = page.getByRole("button", { name: "Previous service" });
    const next = page.getByRole("button", { name: "Next service" });

    await expect(previous).toBeDisabled();
    await next.click();
    await expect(caption(page)).toContainText("SaaS Development", {
      timeout: 10_000,
    });
    await expect(previous).toBeEnabled();
    await previous.click();
    await expect(caption(page)).toContainText("MVP Development", {
      timeout: 10_000,
    });
  });

  test("the explore link follows the front service's destination", async ({
    page,
  }) => {
    const explore = page.locator("#services-hero a", { hasText: "Explore" });
    await expect(explore).toHaveAttribute("href", "/software");

    await scrollToService(page, 8);
    await expect(caption(page)).toContainText("Career & Recruiting", {
      timeout: 10_000,
    });
    await expect(explore).toHaveAttribute("href", "/recruiting");
  });

  test("the front card is a real link over the canvas", async ({ page }) => {
    const card = page.locator('#services-hero a[aria-hidden="true"]');
    await expect(card).toHaveAttribute("href", "/software");
    await expect
      .poll(async () => (await card.boundingBox())?.height ?? 0, {
        timeout: 15_000,
      })
      .toBeGreaterThan(100);
  });
});

test.describe("service hero, reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("shows all nine services as plain links instead of the ring", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("#services-hero")).toHaveCount(0);

    const links = page.locator("main ol").first().getByRole("link");
    await expect(links).toHaveCount(9);
    for (const [i, title] of SERVICES.entries()) {
      await expect(links.nth(i)).toContainText(title);
    }
    await expect(links.first()).toHaveAttribute("href", "/software");
    await expect(links.last()).toHaveAttribute("href", "/recruiting");
  });
});
