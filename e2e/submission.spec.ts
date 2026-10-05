import { test, expect, type Page } from "@playwright/test";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/db/types";

/**
 * Live submissions against the real Supabase project.
 *
 * Each test fills the real form, passes Turnstile (Cloudflare's test keys in
 * .env.local always pass), submits, and then reads the database with the
 * server key to prove the rows and the resume object really exist. Everything
 * created is deleted afterwards.
 *
 * Skipped unless SUPABASE_SERVICE_ROLE_KEY is set, and runs on the desktop
 * project only so one run writes one set of rows.
 */

loadEnvConfig(process.cwd());
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.SUPABASE_RESUME_BUCKET || "resumes";
const db =
  url && key
    ? createClient<Database>(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

const run = Date.now().toString(36);
const NAME = `E2E Test ${run}`;

async function passTurnstile(page: Page) {
  await expect(page.locator('input[name="turnstileToken"]')).not.toHaveValue("", {
    timeout: 30_000,
  });
}

test.describe("live submission", () => {
  test.skip(!db, "Needs SUPABASE_SERVICE_ROLE_KEY in .env.local");
  test.describe.configure({ mode: "serial" });

  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Writes real rows: desktop only");
  });

  test.afterAll(async () => {
    if (!db) return;
    const { data: leads } = await db.from("leads").select("id").like("name", `${NAME}%`);
    for (const { id } of leads ?? []) {
      const { data: files } = await db.storage.from(bucket).list(id);
      if (files?.length) {
        await db.storage.from(bucket).remove(files.map((f) => `${id}/${f.name}`));
      }
      await db.from("leads").delete().eq("id", id); // cascades to detail rows
    }
  });

  test("software enquiry with Other is stored, and a resubmit is not duplicated", async ({
    page,
  }) => {
    const email = `e2e+${run}@example.com`;

    for (let attempt = 0; attempt < 2; attempt++) {
      await page.goto("/software#start");
      await page.getByLabel("Name").fill(`${NAME} software`);
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Type of project").selectOption("OTHER");
      await page.getByLabel("Tell us what you have in mind").fill("Firmware for a kiosk");
      await page.getByLabel("Project details").fill("End-to-end test submission. Safe to delete.");
      await page.locator('input[name="consent"]').check();
      await passTurnstile(page);
      await page.getByRole("button", { name: "Start a Project" }).click();
      await expect(page.getByRole("heading", { name: "Received." })).toBeVisible({
        timeout: 30_000,
      });
    }

    const { data: leads } = await db!
      .from("leads")
      .select("id, lead_type, email, consent_status, software_leads(*), lead_events(event_type)")
      .eq("email", email);
    expect(leads).toHaveLength(1);
    const lead = leads![0];
    expect(lead).toMatchObject({ lead_type: "SOFTWARE", consent_status: "CONSENTED" });
    expect(lead.software_leads).toMatchObject({
      project_type: "OTHER",
      other_project_type: "Firmware for a kiosk",
    });
    expect(lead.lead_events.map((e) => e.event_type).sort()).toEqual([
      "DUPLICATE_SUBMISSION",
      "FORM_SUBMITTED",
    ]);
  });

  test("recruiting profile with phone only and a PDF resume is stored privately", async ({
    page,
  }) => {
    const phone = `+1 555 ${String(Date.now()).slice(-7)}`;

    await page.goto("/recruiting#apply");
    await page.getByLabel("Full name").fill(`${NAME} recruiting`);
    await page.getByLabel("Phone").fill(phone);
    await expect(async () => {
      await page.locator('input[type="file"][name="resume"]').setInputFiles({
        name: "e2e resume.pdf",
        mimeType: "application/pdf",
        buffer: Buffer.from("%PDF-1.4\n%e2e test file, safe to delete\n"),
      });
      await expect(page.getByText("e2e resume.pdf")).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 20_000 });
    await page.locator('input[name="consent"]').check();
    await passTurnstile(page);
    await page.getByRole("button", { name: "Submit profile" }).click();

    await expect(page.getByRole("heading", { name: "Received." })).toBeVisible({
      timeout: 30_000,
    });
    // Full success copy, not the "resume could not be uploaded" variant.
    await expect(page.getByText(/Your profile is with GENRA/)).toBeVisible();

    const { data: leads } = await db!
      .from("leads")
      .select("id, lead_type, email, phone, recruiting_leads(lead_id), resume_files(*)")
      .eq("phone", phone);
    expect(leads).toHaveLength(1);
    const lead = leads![0];
    expect(lead).toMatchObject({ lead_type: "RECRUITING", email: null });
    expect(lead.recruiting_leads).not.toBeNull();
    expect(lead.resume_files).toHaveLength(1);

    const file = lead.resume_files[0];
    expect(file.mime_type).toBe("application/pdf");
    expect(file.storage_path.startsWith(`${lead.id}/`)).toBe(true);

    // The object exists and holds the uploaded bytes...
    const { data: blob, error } = await db!.storage.from(bucket).download(file.storage_path);
    expect(error).toBeNull();
    expect((await blob!.text()).startsWith("%PDF-")).toBe(true);

    // ...and is not reachable without the server key.
    const publicUrl = `${url}/storage/v1/object/public/${bucket}/${file.storage_path}`;
    expect((await fetch(publicUrl)).ok).toBe(false);
    const direct = `${url}/storage/v1/object/${bucket}/${file.storage_path}`;
    expect((await fetch(direct)).ok).toBe(false);
  });
});
