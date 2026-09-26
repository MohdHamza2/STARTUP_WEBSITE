import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

/**
 * Source-encoding guard.
 *
 * Regression test for a real defect (introduced 2026-09-18 in ffa4fc4, fixed
 * 2026-09-27). A bulk find-and-replace run through Windows PowerShell 5.1 read
 * UTF-8 files as Windows-1252 and wrote them back as UTF-8. Every non-ASCII
 * character was double-encoded - an em dash became three garbage characters, a
 * section sign became two - and a byte-order mark was prepended. 124 sequences
 * across 22 files, several of them in rendered copy: the About and Terms body
 * text, the /recruiting page title, form placeholders, and the header's
 * screen-reader label.
 *
 * Nothing else in the suite noticed, because no test reads raw copy. This one
 * does. It fails on the signature patterns of that corruption, and on a UTF-8
 * BOM, which PowerShell's `Set-Content -Encoding utf8` always adds.
 *
 * If this fails: do NOT hand-edit the characters. Re-read the file as UTF-8 and
 * edit with a tool that preserves encoding (node, sed, or an editor). Never use
 * PowerShell 5.1 Get-Content/Set-Content to rewrite source files.
 *
 * This file is deliberately pure ASCII so it cannot be mangled the same way.
 */

const ROOT = join(__dirname, "..");
const EXTENSIONS = new Set([".ts", ".tsx", ".css", ".mjs"]);

/**
 * Double-encoded UTF-8 as it appears after a Windows-1252 misread:
 *   \u00E2\u20AC        lead of every mangled 3-byte char (dashes, ellipsis, quotes)
 *   \u00C2 + symbol     mangled 2-byte symbols (section sign, copyright, middle dot)
 *   \u00C3 + 80..BF     mangled accented Latin letters
 */
const MOJIBAKE =
  /\u00E2\u20AC|\u00C2[\u00A7\u00A9\u00B7\u00AE\u00B0\u00B1\u00BB\u00AB]|\u00C3[\u0080-\u00BF]/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return EXTENSIONS.has(extname(name)) ? [path] : [];
  });
}

describe("source encoding", () => {
  const files = sourceFiles(ROOT);

  it("finds source files to check", () => {
    expect(files.length).toBeGreaterThan(40);
  });

  it("contains no double-encoded (mojibake) characters", () => {
    const offenders = files.flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .map((line, i) => ({ line, n: i + 1 }))
        .filter(({ line }) => MOJIBAKE.test(line))
        .map(({ n }) => `${file.slice(ROOT.length)}:${n}`),
    );
    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  it("contains no UTF-8 byte-order marks", () => {
    const withBom = files.filter((file) => {
      const head = readFileSync(file);
      return head[0] === 0xef && head[1] === 0xbb && head[2] === 0xbf;
    });
    expect(withBom.map((f) => f.slice(ROOT.length))).toEqual([]);
  });
});
