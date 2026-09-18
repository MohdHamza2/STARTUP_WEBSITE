import { defineConfig, devices } from "@playwright/test";

/**
 * Deliberately NOT 3000.
 *
 * With the dev server on 3000, `reuseExistingServer` silently pointed the suite
 * at it instead of building production. Next compiles routes on demand, so under
 * parallel workers hydration had not finished before assertions ran and tests
 * failed for reasons that had nothing to do with the code. It happened twice.
 *
 * A dedicated port means `npm run e2e` always tests a production build, whether
 * or not a dev server is running.
 */
const PORT = 3100;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  /**
   * DOC6 §6.13 and prompt §45 require desktop, tablet and mobile verification.
   * The hero is re-composed rather than scaled below 768px, so the mobile
   * project is not a redundant duplicate of desktop.
   */
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      /**
       * Tablet viewport on Chromium rather than the built-in iPad device, which
       * defaults to WebKit and would require a second browser download for what
       * is a LAYOUT breakpoint check. Touch is emulated so touch-target rules
       * are still exercised.
       *
       * If real Safari coverage is wanted later, run
       * `npx playwright install webkit` and swap in devices["iPad (gen 7)"].
       */
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 820, height: 1180 },
        hasTouch: true,
      },
    },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
