// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Server-action behaviour with every external service replaced, so each
 * failure can be forced. The rule under test: the visitor only ever sees
 * success when the lead row really was written, and nothing reaches the
 * database before validation and Turnstile have passed.
 */

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7" }),
}));
vi.mock("@/lib/db/client", () => ({
  getServiceClient: vi.fn(),
  getServiceConfig: vi.fn(),
}));
vi.mock("@/lib/security/turnstile", () => ({ verifyTurnstile: vi.fn() }));
vi.mock("@/lib/security/rateLimit", () => ({
  rateLimit: vi.fn(() => ({ ok: true })),
  clientKey: () => "test",
}));
vi.mock("@/lib/email/notify", () => ({
  sendTeamNotification: vi.fn(),
  sendConfirmation: vi.fn(),
}));

import { getServiceClient, getServiceConfig } from "@/lib/db/client";
import { verifyTurnstile } from "@/lib/security/turnstile";
import { rateLimit } from "@/lib/security/rateLimit";
import { submitProject, submitRecruiting } from "./submitLead";

type Call = { table: string; op: string; args: unknown[] };

/** Just enough of the supabase-js surface that submitLead.ts uses. */
function fakeDb(opts: { fail?: string; duplicate?: string; uploadFails?: boolean } = {}) {
  const calls: Call[] = [];
  const outcome = (table: string) => ({
    error: opts.fail === table ? { message: "boom" } : null,
  });

  const db = {
    from(table: string) {
      return {
        insert(row: unknown) {
          calls.push({ table, op: "insert", args: [row] });
          const res = outcome(table);
          return {
            select: () => ({
              single: async () =>
                res.error ? { data: null, ...res } : { data: { id: "lead-1" }, error: null },
            }),
            then: (resolve: (v: unknown) => void) => resolve(res),
          };
        },
        select() {
          const chain = {
            eq: () => chain,
            gte: () => chain,
            limit: () => chain,
            maybeSingle: async () => ({
              data: opts.duplicate ? { id: opts.duplicate } : null,
              error: null,
            }),
          };
          return chain;
        },
        delete() {
          return {
            eq: async (column: string, value: unknown) => {
              calls.push({ table, op: "delete", args: [column, value] });
              return { error: null };
            },
          };
        },
      };
    },
    storage: {
      from(bucket: string) {
        return {
          upload: async (path: string, _bytes: unknown, options: unknown) => {
            calls.push({ table: bucket, op: "upload", args: [path, options] });
            return { error: opts.uploadFails ? { message: "x" } : null };
          },
          remove: async (paths: string[]) => {
            calls.push({ table: bucket, op: "remove", args: [paths] });
            return { error: null };
          },
        };
      },
    },
  };
  return { db, calls };
}

function useDb(opts?: Parameters<typeof fakeDb>[0]) {
  const fake = fakeDb(opts);
  vi.mocked(getServiceClient).mockReturnValue(fake.db as never);
  vi.mocked(getServiceConfig).mockReturnValue({
    url: "https://example.supabase.co",
    serviceRoleKey: "test",
    resumeBucket: "resumes",
  });
  return fake.calls;
}

const inserts = (calls: Call[], table: string) =>
  calls.filter((c) => c.table === table && c.op === "insert").map((c) => c.args[0]);

function form(fields: Record<string, string>, resume?: File): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  if (resume) fd.set("resume", resume);
  return fd;
}

const recruiting = { name: "Ada Lovelace", phone: "+1 555 0100", consent: "on", turnstileToken: "tok" };
const project = {
  name: "Grace Hopper",
  email: "grace@example.com",
  projectType: "AI_POWERED_APPLICATIONS",
  projectDescription: "A support assistant for our team.",
  consent: "on",
  turnstileToken: "tok",
};
const idle = { status: "idle" as const };
const pdf = (body = "%PDF-1.4\n%test\n") => new File([body], "My CV (final).pdf", { type: "application/pdf" });

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(rateLimit).mockReturnValue({ ok: true } as never);
  vi.mocked(verifyTurnstile).mockResolvedValue({ ok: true });
});

describe("guards run before any write", () => {
  it("invalid input is rejected without calling Turnstile or the database", async () => {
    const calls = useDb();
    const res = await submitRecruiting(idle, form({ ...recruiting, phone: "" }));
    expect(res.status).toBe("error");
    expect(res.errors?.phone).toBeTruthy();
    expect(verifyTurnstile).not.toHaveBeenCalled();
    expect(calls).toHaveLength(0);
  });

  it("a missing Turnstile token is a validation error", async () => {
    const calls = useDb();
    const res = await submitProject(idle, form({ ...project, turnstileToken: "" }));
    expect(res.errors?.turnstileToken).toBeTruthy();
    expect(calls).toHaveLength(0);
  });

  it("a token Cloudflare rejects never reaches the database", async () => {
    const calls = useDb();
    vi.mocked(verifyTurnstile).mockResolvedValue({ ok: false, reason: "invalid" });
    const res = await submitProject(idle, form(project));
    expect(res.status).toBe("error");
    expect(res.errors?.turnstileToken).toBeTruthy();
    expect(calls).toHaveLength(0);
  });

  it("missing Turnstile configuration fails closed", async () => {
    const calls = useDb();
    vi.mocked(verifyTurnstile).mockResolvedValue({ ok: false, reason: "not-configured" });
    const res = await submitRecruiting(idle, form(recruiting));
    expect(res.status).toBe("error");
    expect(calls).toHaveLength(0);
  });

  it("rate limiting stops the request before Turnstile", async () => {
    useDb();
    vi.mocked(rateLimit).mockReturnValue({ ok: false } as never);
    const res = await submitProject(idle, form(project));
    expect(res.status).toBe("error");
    expect(verifyTurnstile).not.toHaveBeenCalled();
  });
});

describe("never reports success when the database did not save", () => {
  it("no database configured: error, not success", async () => {
    vi.mocked(getServiceClient).mockReturnValue(null);
    vi.mocked(getServiceConfig).mockReturnValue(null);
    const res = await submitRecruiting(idle, form(recruiting));
    expect(res.status).toBe("error");
  });

  it("lead insert fails: error", async () => {
    useDb({ fail: "leads" });
    const res = await submitProject(idle, form(project));
    expect(res.status).toBe("error");
    expect(res.retryable).toBe(true);
  });

  it("detail insert fails: the half-written lead is deleted and the visitor sees an error", async () => {
    const calls = useDb({ fail: "software_leads" });
    const res = await submitProject(idle, form(project));
    expect(res.status).toBe("error");
    expect(calls).toContainEqual({ table: "leads", op: "delete", args: ["id", "lead-1"] });
  });
});

describe("successful writes", () => {
  it("recruiting with phone only stores a null email", async () => {
    const calls = useDb();
    const res = await submitRecruiting(idle, form(recruiting));
    expect(res).toEqual({ status: "success", message: "Received." });
    expect(inserts(calls, "leads")[0]).toMatchObject({
      lead_type: "RECRUITING",
      email: null,
      phone: "+1 555 0100",
      consent_status: "CONSENTED",
    });
    expect(inserts(calls, "recruiting_leads")[0]).toMatchObject({ lead_id: "lead-1" });
    expect(inserts(calls, "lead_events")[0]).toMatchObject({ event_type: "FORM_SUBMITTED" });
  });

  it("project type Other is stored in its own column", async () => {
    const calls = useDb();
    await submitProject(
      idle,
      form({ ...project, projectType: "OTHER", otherProjectType: "Kiosk firmware" }),
    );
    expect(inserts(calls, "software_leads")[0]).toMatchObject({
      lead_id: "lead-1",
      project_type: "OTHER",
      other_project_type: "Kiosk firmware",
    });
  });

  it("a recent duplicate is logged against the original and not inserted again", async () => {
    const calls = useDb({ duplicate: "lead-0" });
    const res = await submitProject(idle, form(project));
    expect(res.status).toBe("success");
    expect(inserts(calls, "leads")).toHaveLength(0);
    expect(inserts(calls, "lead_events")[0]).toMatchObject({
      lead_id: "lead-0",
      event_type: "DUPLICATE_SUBMISSION",
    });
  });
});

describe("resume upload", () => {
  it("a real PDF goes to a private path under the lead id, never overwriting", async () => {
    const calls = useDb();
    const res = await submitRecruiting(idle, form(recruiting, pdf()));
    expect(res.message).toBe("Received.");
    const upload = calls.find((c) => c.op === "upload");
    expect(upload?.table).toBe("resumes");
    expect(upload?.args[0]).toMatch(/^lead-1\/\d+-[\w.-]+\.pdf$/);
    expect(upload?.args[1]).toMatchObject({ upsert: false, contentType: "application/pdf" });
    expect(inserts(calls, "resume_files")[0]).toMatchObject({
      lead_id: "lead-1",
      mime_type: "application/pdf",
    });
  });

  it("a file that only claims to be a PDF is refused, the lead is kept and the visitor is told", async () => {
    const calls = useDb();
    const res = await submitRecruiting(idle, form(recruiting, pdf("MZ\x90\x00not a pdf")));
    expect(res.status).toBe("success");
    expect(res.message).toMatch(/resume could not be uploaded/);
    expect(calls.some((c) => c.op === "upload")).toBe(false);
    expect(inserts(calls, "leads")).toHaveLength(1);
  });

  it("an oversized file is refused before upload", async () => {
    const calls = useDb();
    const big = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "cv.pdf", { type: "application/pdf" });
    const res = await submitRecruiting(idle, form(recruiting, big));
    expect(res.message).toMatch(/resume could not be uploaded/);
    expect(calls.some((c) => c.op === "upload")).toBe(false);
  });

  it("metadata insert fails: the stored object is removed again", async () => {
    const calls = useDb({ fail: "resume_files" });
    const res = await submitRecruiting(idle, form(recruiting, pdf()));
    expect(res.message).toMatch(/resume could not be uploaded/);
    const uploaded = calls.find((c) => c.op === "upload")?.args[0];
    expect(calls).toContainEqual({ table: "resumes", op: "remove", args: [[uploaded]] });
  });
});
