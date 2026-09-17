import { test, expect } from "@playwright/test";

/**
 * Form contracts (prompt §67, §68).
 *
 * These assert structure, the conditional-field behaviour and client-side file
 * rules. They deliberately do NOT assert a successful submission: that requires
 * Supabase, Resend and Turnstile credentials, which do not exist yet (owner
 * decision D4). Asserting success against an unconfigured stack would test
 * nothing and would report a green suite for an unproven integration.
 *
 * When credentials land, add the submit-path cases — the server actions already
 * return typed success and error states for them to assert against.
 */

test.describe("project form", () => {
  test("project type dropdown holds exactly the approved catalog", async ({
    page,
  }) => {
    await page.goto("/software#start");

    const select = page.getByLabel("Type of project");
    await expect(select).toBeVisible();

    const labels = await select.locator("option").allTextContents();

    expect(labels).toEqual([
      "Choose one…",
      "MVP Development",
      "SaaS Development",
      "End-to-End Software Production",
      "Web Application",
      "Business Software",
      "Portfolio Websites",
      "AI-Powered Applications",
      "Automation Systems",
      "Career & Recruiting",
      "Other",
    ]);
  });

  test("Other reveals the conditional field and deselecting removes it", async ({
    page,
  }) => {
    await page.goto("/software#start");
    const select = page.getByLabel("Type of project");
    const conditional = page.getByLabel("Tell us what you have in mind");

    await expect(conditional).toHaveCount(0);

    await select.selectOption("OTHER");
    await expect(conditional).toBeVisible();

    await conditional.fill("A hardware companion app");

    // Deselecting must remove the field entirely, not merely hide it — a hidden
    // input still submits, which is the stale value §67 forbids.
    await select.selectOption("SAAS_DEVELOPMENT");
    await expect(conditional).toHaveCount(0);

    const stale = await page.evaluate(() =>
      document.querySelector('[name="otherProjectType"]'),
    );
    expect(stale).toBeNull();
  });

  test("required fields are marked and consent is mandatory", async ({ page }) => {
    await page.goto("/software#start");

    await expect(page.getByLabel("Name", { exact: true })).toHaveAttribute(
      "required",
      "",
    );
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute(
      "required",
      "",
    );
    await expect(page.locator('input[name="consent"]')).toHaveAttribute(
      "required",
      "",
    );
    // Phone is optional and must say so, not rely on an asterisk convention.
    await expect(page.getByText("Phone").locator("..")).toContainText("Optional");
  });
});

test.describe("recruiting form", () => {
  test("only name and email are required", async ({ page }) => {
    await page.goto("/recruiting#apply");

    await expect(page.getByLabel("Full name")).toHaveAttribute("required", "");
    await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute(
      "required",
      "",
    );

    for (const label of [
      "Phone",
      "University",
      "Target role",
      "Preferred location",
      "LinkedIn profile",
    ]) {
      await expect(page.getByLabel(label)).not.toHaveAttribute("required", "");
    }
  });

  test("consent states that submission does not guarantee employment", async ({
    page,
  }) => {
    await page.goto("/recruiting#apply");
    await expect(
      page.getByText(/does not guarantee employment or placement/i),
    ).toBeVisible();
  });

  test("resume input accepts only PDF", async ({ page }) => {
    await page.goto("/recruiting#apply");
    const input = page.locator('input[type="file"][name="resume"]');
    await expect(input).toHaveAttribute("accept", ".pdf");
  });

  test("rejects a non-PDF file before it can be submitted", async ({ page }) => {
    await page.goto("/recruiting#apply");

    await page.locator('input[type="file"][name="resume"]').setInputFiles({
      name: "resume.docx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      buffer: Buffer.from("not a pdf"),
    });

    // Scoped to the form: Next.js renders its own role="alert" route announcer
    // on every page, so an unscoped getByRole("alert") is ambiguous.
    await expect(page.locator("form").getByRole("alert")).toContainText(
      /file type isn't supported/i,
    );
  });

  test("rejects a file over the size limit", async ({ page }) => {
    await page.goto("/recruiting#apply");

    await page.locator('input[type="file"][name="resume"]').setInputFiles({
      name: "huge.pdf",
      mimeType: "application/pdf",
      // 10 MB + 1 byte.
      buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
    });

    await expect(page.locator("form").getByRole("alert")).toContainText(
      /exceeds the maximum allowed file size/i,
    );
  });

  test("accepts a valid PDF and shows it as attached", async ({ page }) => {
    await page.goto("/recruiting#apply");

    await page.locator('input[type="file"][name="resume"]').setInputFiles({
      name: "alex-resume.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.7\nminimal"),
    });

    await expect(page.getByText("alex-resume.pdf")).toBeVisible();
    await expect(page.getByRole("button", { name: /remove/i })).toBeVisible();
  });
});

test.describe("lead attribution", () => {
  test("captures source and UTM parameters from the landing URL", async ({
    page,
  }) => {
    await page.goto(
      "/contact?source=linkedin&utm_source=li&utm_medium=social&utm_campaign=fall-2026",
    );
    await page.waitForTimeout(600);

    const values = await page.evaluate(() => {
      const form = document.querySelector("form")!;
      const read = (name: string) =>
        form.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value ?? "";
      return {
        source: read("source"),
        utmSource: read("utmSource"),
        utmMedium: read("utmMedium"),
        utmCampaign: read("utmCampaign"),
      };
    });

    expect(values).toEqual({
      source: "linkedin",
      utmSource: "li",
      utmMedium: "social",
      utmCampaign: "fall-2026",
    });
  });

  test("attribution survives navigating to another page before submitting", async ({
    page,
  }) => {
    // First touch carries the campaign; the visitor then browses elsewhere and
    // submits there. Reading only location.search at submit time would lose it.
    await page.goto("/?source=reddit&utm_campaign=spring");
    await page.waitForTimeout(500);

    await page.goto("/recruiting#apply");
    await page.waitForTimeout(700);

    const values = await page.evaluate(() => {
      const form = document.querySelector("form")!;
      const read = (name: string) =>
        form.querySelector<HTMLInputElement>(`input[name="${name}"]`)?.value ?? "";
      return { source: read("source"), utmCampaign: read("utmCampaign") };
    });

    expect(values).toEqual({ source: "reddit", utmCampaign: "spring" });
  });
});

test.describe("contact form", () => {
  test("topic selection changes the message field and consent text", async ({
    page,
  }) => {
    await page.goto("/contact");

    await expect(page.getByLabel("What do you want built?")).toBeVisible();

    // The radio is sr-only inside its label — the accessible pattern, where the
    // label is the click target. Clicking the label is what a real user does.
    await page.locator("label", { hasText: "Career support" }).click();
    await expect(
      page.getByRole("radio", { name: /career support/i }),
    ).toBeChecked();

    await expect(page.getByLabel("Tell us about your search")).toBeVisible();
    await expect(
      page.getByText(/does not guarantee employment or placement/i),
    ).toBeVisible();
  });

  test("every control has an accessible label", async ({ page }) => {
    await page.goto("/contact");

    const unlabelled = await page.evaluate(() => {
      const form = document.querySelector("form");
      if (!form) return -1;
      const controls = [
        ...form.querySelectorAll<HTMLElement>(
          "input:not([type=hidden]), textarea, select",
        ),
      ];
      return controls.filter((c) => {
        const id = c.getAttribute("id");
        const labelled = id && form.querySelector(`label[for="${id}"]`);
        return !labelled && !c.closest("label") && !c.getAttribute("aria-label");
      }).length;
    });

    expect(unlabelled).toBe(0);
  });
});
