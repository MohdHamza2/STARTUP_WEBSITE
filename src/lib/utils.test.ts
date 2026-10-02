import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("keeps a type token alongside a colour", () => {
    expect(cn("text-action", "text-ink")).toBe("text-action text-ink");
    expect(cn("text-caption text-muted", "text-ink")).toBe("text-caption text-ink");
  });

  it("still resolves genuine conflicts last-wins", () => {
    expect(cn("text-body", "text-action")).toBe("text-action");
    expect(cn("text-muted", "text-ink")).toBe("text-ink");
  });
});
