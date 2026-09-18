import { describe, it, expect } from "vitest";
import {
  recruitingSchema,
  projectSchema,
  contactSchema,
  resumeMetaSchema,
  sanitiseFilename,
  RESUME_MAX_BYTES,
} from "./schemas";
import {
  projectTypeOptions,
  services,
  OTHER_PROJECT_TYPE,
} from "@/content/services";

const validRecruiting = {
  name: "Alex Chen",
  email: "alex@example.com",
  consent: true as const,
  turnstileToken: "token",
};

const validProject = {
  name: "Alex Chen",
  email: "alex@example.com",
  projectType: "MVP_DEVELOPMENT",
  projectDescription: "We need a first version of an internal tool.",
  consent: true as const,
  turnstileToken: "token",
};

describe("recruiting schema", () => {
  it("accepts the minimum valid submission", () => {
    expect(recruitingSchema.safeParse(validRecruiting).success).toBe(true);
  });

  it("requires a name", () => {
    const r = recruitingSchema.safeParse({ ...validRecruiting, name: "" });
    expect(r.success).toBe(false);
  });

  // Owner decision D1: email is REQUIRED, resolving the conflict between
  // DOC4 §4.31 (NOT NULL) and build prompt §29 (optional).
  it("requires an email address", () => {
    const r = recruitingSchema.safeParse({ ...validRecruiting, email: "" });
    expect(r.success).toBe(false);
  });

  it("rejects a malformed email address", () => {
    const r = recruitingSchema.safeParse({
      ...validRecruiting,
      email: "alex@",
    });
    expect(r.success).toBe(false);
  });

  it("treats phone as optional but validates its shape", () => {
    expect(
      recruitingSchema.safeParse({ ...validRecruiting, phone: "" }).success,
    ).toBe(true);
    // International formats must pass — DOC5 §5.8.
    expect(
      recruitingSchema.safeParse({ ...validRecruiting, phone: "+44 20 7946 0958" })
        .success,
    ).toBe(true);
    expect(
      recruitingSchema.safeParse({ ...validRecruiting, phone: "drop table" })
        .success,
    ).toBe(false);
  });

  it("requires consent to be explicitly given", () => {
    for (const consent of [false, undefined]) {
      const r = recruitingSchema.safeParse({ ...validRecruiting, consent });
      expect(r.success).toBe(false);
    }
  });

  it("requires a turnstile token to be present", () => {
    const r = recruitingSchema.safeParse({
      ...validRecruiting,
      turnstileToken: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects an implausible graduation year", () => {
    expect(
      recruitingSchema.safeParse({ ...validRecruiting, graduationYear: 1800 })
        .success,
    ).toBe(false);
    expect(
      recruitingSchema.safeParse({ ...validRecruiting, graduationYear: 2027 })
        .success,
    ).toBe(true);
  });

  it("rejects a malformed LinkedIn URL", () => {
    expect(
      recruitingSchema.safeParse({ ...validRecruiting, linkedinUrl: "not a url" })
        .success,
    ).toBe(false);
  });

  it("bounds free text so one field cannot carry a payload", () => {
    const r = recruitingSchema.safeParse({
      ...validRecruiting,
      additionalInformation: "x".repeat(2001),
    });
    expect(r.success).toBe(false);
  });
});

describe("project schema", () => {
  it("accepts the minimum valid submission", () => {
    expect(projectSchema.safeParse(validProject).success).toBe(true);
  });

  // Prompt §67: the dropdown must contain exactly the approved catalog.
  it("offers exactly the nine approved services plus Other", () => {
    expect(projectTypeOptions).toHaveLength(10);
    expect(projectTypeOptions.map((o) => o.label)).toEqual([
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

  it("accepts every value the dropdown can produce", () => {
    for (const option of projectTypeOptions) {
      const input = {
        ...validProject,
        projectType: option.value,
        otherProjectType:
          option.value === OTHER_PROJECT_TYPE ? "A hardware companion app" : "",
      };
      expect(projectSchema.safeParse(input).success).toBe(true);
    }
  });

  it("rejects a project type outside the catalog", () => {
    const r = projectSchema.safeParse({
      ...validProject,
      projectType: "CRYPTO_MINING_RIG",
    });
    expect(r.success).toBe(false);
  });

  it("requires the conditional field when Other is selected", () => {
    const r = projectSchema.safeParse({
      ...validProject,
      projectType: OTHER_PROJECT_TYPE,
      otherProjectType: "",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0].path).toEqual(["otherProjectType"]);
    }
  });

  // Prompt §67: a stale value from a deselected Other must never be submitted.
  // Enforced in the schema, so a tampered client cannot smuggle one through.
  it("discards a stale conditional value when Other is not selected", () => {
    const r = projectSchema.safeParse({
      ...validProject,
      projectType: "SAAS_DEVELOPMENT",
      otherProjectType: "left over from an earlier selection",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.otherProjectType).toBe("");
  });

  it("requires a project description of substance", () => {
    expect(
      projectSchema.safeParse({ ...validProject, projectDescription: "hi" })
        .success,
    ).toBe(false);
  });

  it("keeps Career & Recruiting in the catalog as a distinct service line", () => {
    const recruiting = services.find((s) => s.line === "recruiting");
    expect(recruiting?.title).toBe("Career & Recruiting");
    expect(services.filter((s) => s.line === "recruiting")).toHaveLength(1);
    expect(services).toHaveLength(9);
  });
});

describe("contact schema", () => {
  const valid = {
    topic: "software" as const,
    name: "Alex Chen",
    email: "alex@example.com",
    message: "I would like to talk about building an internal tool.",
    consent: true as const,
    turnstileToken: "token",
  };

  it("accepts both topics", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(
      contactSchema.safeParse({ ...valid, topic: "recruiting" }).success,
    ).toBe(true);
  });

  it("rejects an unknown topic", () => {
    expect(contactSchema.safeParse({ ...valid, topic: "billing" }).success).toBe(
      false,
    );
  });

  it("requires a message of substance", () => {
    expect(contactSchema.safeParse({ ...valid, message: "hi" }).success).toBe(
      false,
    );
  });
});

describe("resume metadata", () => {
  const valid = {
    filename: "alex-chen-resume.pdf",
    mimeType: "application/pdf",
    size: 1_800_000,
  };

  it("accepts a normal PDF", () => {
    expect(resumeMetaSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a file over the size limit", () => {
    const r = resumeMetaSchema.safeParse({
      ...valid,
      size: RESUME_MAX_BYTES + 1,
    });
    expect(r.success).toBe(false);
  });

  it("rejects an empty file", () => {
    expect(resumeMetaSchema.safeParse({ ...valid, size: 0 }).success).toBe(false);
  });
});

describe("filename sanitisation", () => {
  it("strips directory components", () => {
    expect(sanitiseFilename("../../etc/passwd.pdf")).toBe("passwd.pdf");
    expect(sanitiseFilename("C:\\Users\\alex\\resume.pdf")).toBe("resume.pdf");
  });

  it("cannot produce a traversal sequence", () => {
    for (const input of ["....//....//x.pdf", "..%2f..%2fx.pdf", "../../../x"]) {
      const out = sanitiseFilename(input);
      expect(out).not.toContain("..");
      expect(out).not.toContain("/");
      expect(out).not.toContain("\\");
    }
  });

  it("removes characters that are not filename-safe", () => {
    expect(sanitiseFilename("re<s>u:m|e?.pdf")).toBe("resume.pdf");
  });

  it("always produces a .pdf name", () => {
    expect(sanitiseFilename("resume")).toBe("resume.pdf");
    expect(sanitiseFilename("resume.docx")).toBe("resume.docx.pdf");
  });

  it("survives a hostile empty result", () => {
    expect(sanitiseFilename("///")).toBe("resume.pdf");
    expect(sanitiseFilename("***")).toBe("resume.pdf");
  });

  it("bounds the length", () => {
    expect(sanitiseFilename(`${"a".repeat(400)}.pdf`).length).toBeLessThan(140);
  });
});
