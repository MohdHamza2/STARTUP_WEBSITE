import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
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
    { name: "tablet", use: { ...devices["iPad (gen 7)"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],

  webServer: {
    command: "npm run build && npm run start",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
