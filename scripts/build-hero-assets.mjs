/**
 * GENRA hero asset pipeline.
 *
 * Reads the owner-supplied frame archives in clips/ and derives web-delivery
 * assets plus a deterministic interaction timeline.
 *
 *   clips/clip{1,2,3}fr.zip  ──►  public/hero/
 *                                  ├── seq1/ seq2/ seq3/  frames, 3 width tiers
 *                                  └── timeline.json      panel geometry
 *
 * WHY THIS EXISTS (prompt §11, §49):
 * The six service panels must be clickable, and each hotspot must track the
 * panel actually on screen. Panel position and size change frame to frame, so a
 * fixed rectangle per panel does not work. Rather than guess coordinates or run
 * OCR, this script derives panel geometry FROM THE FRAMES THEMSELVES.
 *
 * This is re-encoding for delivery, not regenerating the animation. The source
 * archives in clips/ are never modified.
 *
 * ---------------------------------------------------------------------------
 * TWO MEASURED FACTS ABOUT THE SOURCE — both verified during the audit, both
 * load-bearing for the code below. See Reports/Implementation_Plan.md §1.3.
 *
 * 1. THE CAMERA IS NOT STATIC. It pushes in slowly across clip2: the workstation
 *    at frame 300 is measurably larger than at frame 1. An earlier version of
 *    this script shipped a single static "plate" plus per-frame panel crops,
 *    which would have drifted out of alignment. Frame differencing against a
 *    fixed reference is unusable for the same reason — the drifting workstation
 *    contaminates the mask. Detection therefore uses ABSOLUTE luminance with the
 *    workstation region excluded, which is invariant to the camera move.
 *
 * 2. PANELS DO NOT VANISH BETWEEN CYCLES. A retracting panel collapses to a thin
 *    bright streak (~15-20px tall at analysis scale) before the next one grows.
 *    Splitting runs on presence therefore yields 2 runs, not 6. Splitting on
 *    bounding-box HEIGHT yields exactly 6, because a settled panel measures
 *    ~127px and a collapsed one under 25px. That same measurement doubles as the
 *    clickability gate: a half-retracted panel is not a click target.
 * ---------------------------------------------------------------------------
 *
 * Run: npm run hero:build
 */

import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CLIPS = path.join(ROOT, "clips");
const OUT = path.join(ROOT, "public", "hero");

/* ---------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------- */

/**
 * Keep every Nth source frame. The sequences were extracted at a rate well above
 * what scroll scrubbing needs; halving is visually indistinguishable while
 * halving bytes and decode work.
 */
const DECIMATE = 2;

/** Responsive width tiers. Mobile loads `sm`; wider viewports upgrade. */
const TIERS = [
  { name: "sm", width: 828 },
  { name: "md", width: 1280 },
  { name: "lg", width: 1920 },
];

/** Analysis resolution. Geometry, not detail. */
const ANALYSIS_W = 480;
const ANALYSIS_H = 270;

/**
 * Luminance at or above which a pixel is "lit". Measured: the wall reads under
 * 20 and the panels read well above 28, so this separates cleanly. Verified by
 * probing frames 1 and 300 (no panel present) — at this threshold the only lit
 * region in those frames is the workstation itself.
 */
const LIT_THRESHOLD = 28;

/**
 * Workstation exclusion zone, in analysis pixels, as [minX, minY].
 * Everything at or beyond BOTH bounds is ignored. Measured from the two camera
 * extremes (frames 1 and 300): the workstation plus its glow occupies
 * x >= 276, y >= 158 at its largest. Padded to (268, 148).
 *
 * The panel's own bottom-right corner clips this zone by about four analysis
 * rows at peak extent; PAD below more than covers that.
 */
const EXCLUDE_X = 268;
const EXCLUDE_Y = 148;

/** Bbox height (analysis px) at or above which a panel counts as present. */
const PRESENT_HEIGHT = 30;

/**
 * Fraction of a run's peak height at or above which the panel is CLICKABLE.
 * Below this the panel is mid-emerge or mid-retract and pointer-events stay off,
 * so a visitor can never click a panel that is not clearly on screen (prompt §11).
 */
const CLICKABLE_RATIO = 0.8;

/** Fractional padding applied to every emitted hotspot box. */
const PAD = 0.012;

/**
 * The six panels, in the order they appear in clip2. Verified frame by frame
 * during the audit. The detected run count is asserted against this list — if
 * the owner re-exports the animation with a different sequence, the build fails
 * loudly rather than silently mis-routing a hotspot.
 */
const PANELS = [
  { id: "mvp", label: "MVP Development", href: "/software" },
  { id: "saas", label: "SaaS Development", href: "/software" },
  { id: "web", label: "Web Applications", href: "/software" },
  { id: "ai", label: "AI-Powered Applications", href: "/software" },
  { id: "automation", label: "Automation Systems", href: "/software" },
  { id: "recruiting", label: "Career & Recruiting", href: "/recruiting" },
];

/* ---------------------------------------------------------------------------
 * Minimal ZIP reader
 *
 * The archives are deflated, unencrypted and not zip64. Parsing the central
 * directory directly avoids adding a dependency for one build step.
 * ------------------------------------------------------------------------- */

const EOCD_SIG = 0x06054b50;
const CEN_SIG = 0x02014b50;

async function readZip(zipPath) {
  const buf = await fs.readFile(zipPath);

  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) {
      eocd = i;
      break;
    }
  }
  if (eocd < 0) throw new Error(`Not a zip file: ${zipPath}`);

  const count = buf.readUInt16LE(eocd + 10);
  let ptr = buf.readUInt32LE(eocd + 16);
  const entries = [];

  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(ptr) !== CEN_SIG) {
      throw new Error(`Corrupt central directory in ${zipPath}`);
    }
    const method = buf.readUInt16LE(ptr + 10);
    const compressedSize = buf.readUInt32LE(ptr + 20);
    const nameLen = buf.readUInt16LE(ptr + 28);
    const extraLen = buf.readUInt16LE(ptr + 30);
    const commentLen = buf.readUInt16LE(ptr + 32);
    const localOffset = buf.readUInt32LE(ptr + 42);
    const name = buf.toString("utf8", ptr + 46, ptr + 46 + nameLen);

    // The local header repeats name/extra with its own lengths — trust those.
    const lhNameLen = buf.readUInt16LE(localOffset + 26);
    const lhExtraLen = buf.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + lhNameLen + lhExtraLen;
    const raw = buf.subarray(dataStart, dataStart + compressedSize);

    entries.push({ name, data: method === 0 ? raw : zlib.inflateRawSync(raw) });
    ptr += 46 + nameLen + extraLen + commentLen;
  }

  // ezgif zero-pads frame numbers, so lexical order is frame order.
  return entries
    .filter((e) => /\.jpe?g$/i.test(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/* ---------------------------------------------------------------------------
 * Panel detection
 * ------------------------------------------------------------------------- */

async function analysisBuffer(jpeg) {
  return sharp(jpeg)
    .greyscale()
    .resize(ANALYSIS_W, ANALYSIS_H, { fit: "fill" })
    .raw()
    .toBuffer();
}

/**
 * Bounding box of lit pixels outside the workstation zone.
 * Invariant to the camera push-in, because it thresholds absolute luminance
 * rather than differencing against a reference frame.
 */
function litBox(buf) {
  let minX = ANALYSIS_W;
  let minY = ANALYSIS_H;
  let maxX = -1;
  let maxY = -1;
  let lit = 0;

  for (let y = 0; y < ANALYSIS_H; y++) {
    const row = y * ANALYSIS_W;
    const inExcludedRow = y >= EXCLUDE_Y;
    for (let x = 0; x < ANALYSIS_W; x++) {
      if (inExcludedRow && x >= EXCLUDE_X) continue;
      if (buf[row + x] < LIT_THRESHOLD) continue;
      lit++;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  if (maxX < 0) return null;
  return { minX, minY, maxX, maxY, lit, height: maxY - minY + 1 };
}

/**
 * Contiguous frames whose panel is present.
 *
 * Gap tolerance is deliberately ZERO. Measured: two of the five troughs between
 * panels are only a single frame below PRESENT_HEIGHT, so tolerating a
 * one-frame dropout merged two pairs of panels and yielded 4 runs instead of 6.
 * The humps never dip below the threshold internally — they sit at 90–130
 * against a 30 cutoff — so tolerance bought nothing and cost correctness.
 *
 * MIN_RUN rejects noise instead, which is the failure mode tolerance was
 * actually guarding against.
 */
const MIN_RUN = 10;

function groupRuns(boxes) {
  const runs = [];
  let current = null;

  for (let i = 0; i < boxes.length; i++) {
    const present = boxes[i] && boxes[i].height >= PRESENT_HEIGHT;
    if (present) {
      if (!current) current = { start: i, end: i };
      else current.end = i;
    } else if (current) {
      runs.push(current);
      current = null;
    }
  }
  if (current) runs.push(current);

  return runs.filter((r) => r.end - r.start + 1 >= MIN_RUN);
}

/* ---------------------------------------------------------------------------
 * Main
 * ------------------------------------------------------------------------- */

/**
 * Skip when the derived assets are already newer than every source archive.
 *
 * public/hero is gitignored (derived output), so this runs as `prebuild` on a
 * clean deploy. Encoding ~1600 images takes minutes; making it idempotent keeps
 * local builds and the Playwright web server fast after the first run.
 * Pass --force to rebuild regardless.
 */
async function isUpToDate() {
  if (process.argv.includes("--force")) return false;
  try {
    const built = (await fs.stat(path.join(OUT, "timeline.json"))).mtimeMs;
    for (const f of await fs.readdir(CLIPS)) {
      if (!f.endsWith(".zip")) continue;
      if ((await fs.stat(path.join(CLIPS, f))).mtimeMs > built) return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log("\nGENRA hero asset build\n");

  if (await isUpToDate()) {
    console.log("  public/hero is up to date — skipping. Use --force to rebuild.\n");
    return;
  }

  await fs.rm(OUT, { recursive: true, force: true });
  await fs.mkdir(OUT, { recursive: true });

  const clips = {
    seq1: await readZip(path.join(CLIPS, "clip1fr.zip")),
    seq2: await readZip(path.join(CLIPS, "clip2fr.zip")),
    seq3: await readZip(path.join(CLIPS, "clip3fr.zip")),
  };

  const meta = await sharp(clips.seq2[0].data).metadata();
  console.log(
    `  source ${meta.width}x${meta.height} — ` +
      `seq1 ${clips.seq1.length}f, seq2 ${clips.seq2.length}f, seq3 ${clips.seq3.length}f`,
  );

  /* --- Detect panels on clip2 -------------------------------------------- */

  console.log("\n  analysing clip2 panel geometry…");

  const boxes = [];
  for (const frame of clips.seq2) {
    boxes.push(litBox(await analysisBuffer(frame.data)));
  }

  const runs = groupRuns(boxes);
  if (runs.length !== PANELS.length) {
    // Print the evidence needed to diagnose, rather than just the failure.
    const profile = boxes
      .map((b, i) => `${i + 1}:${b?.height ?? 0}`)
      .reduce((rows, cell, i) => {
        const r = Math.floor(i / 12);
        (rows[r] ??= []).push(cell.padStart(7));
        return rows;
      }, [])
      .map((r) => "    " + r.join(""))
      .join("\n");

    throw new Error(
      `Expected ${PANELS.length} panel runs, detected ${runs.length}.\n` +
        `The supplied animation no longer matches the six-panel sequence this ` +
        `build assumes.\n\n  Detected runs: ` +
        runs.map((r) => `${r.start + 1}–${r.end + 1}`).join(", ") +
        `\n\n  Per-frame bbox height (threshold ${PRESENT_HEIGHT}):\n${profile}\n\n` +
        `  Re-audit clip2 and update PANELS — do not guess.`,
    );
  }
  console.log(`  detected ${runs.length} panel runs — matches expected sequence`);

  // Map each source frame index to its panel and clickability.
  const perFrame = new Array(clips.seq2.length).fill(null);
  runs.forEach((run, p) => {
    const peak = Math.max(
      ...boxes.slice(run.start, run.end + 1).map((b) => b?.height ?? 0),
    );
    for (let f = run.start; f <= run.end; f++) {
      const b = boxes[f];
      if (!b) continue;
      perFrame[f] = { panel: p, box: b, clickable: b.height >= peak * CLICKABLE_RATIO };
    }
    const clickableCount = perFrame
      .slice(run.start, run.end + 1)
      .filter((s) => s?.clickable).length;
    console.log(
      `    ${p + 1}. ${PANELS[p].label.padEnd(26)} ` +
        `frames ${String(run.start + 1).padStart(3)}–${String(run.end + 1).padStart(3)}  ` +
        `clickable in ${clickableCount}`,
    );
  });

  /* --- Encode -------------------------------------------------------------- */

  const timeline = {
    source: { width: meta.width, height: meta.height },
    decimate: DECIMATE,
    tiers: TIERS.map((t) => t.name),
    panels: PANELS,
    sequences: {},
  };

  for (const [key, frames] of Object.entries(clips)) {
    const dir = path.join(OUT, key);
    const kept = [];
    for (let i = 0; i < frames.length; i += DECIMATE) kept.push(i);

    for (const tier of TIERS) {
      await fs.mkdir(path.join(dir, tier.name), { recursive: true });
      for (let n = 0; n < kept.length; n++) {
        await sharp(frames[kept[n]].data)
          .resize({ width: tier.width, withoutEnlargement: true })
          .webp({ quality: 74, effort: 5 })
          .toFile(path.join(dir, tier.name, `${String(n).padStart(4, "0")}.webp`));
      }
    }

    const seq = { frames: kept.length };

    // Only clip2 carries interaction state.
    if (key === "seq2") {
      seq.states = kept.map((src) => {
        const s = perFrame[src];
        if (!s) return null;
        const b = s.box;
        const x = b.minX / ANALYSIS_W - PAD;
        const y = b.minY / ANALYSIS_H - PAD;
        const w = (b.maxX - b.minX + 1) / ANALYSIS_W + PAD * 2;
        const h = (b.maxY - b.minY + 1) / ANALYSIS_H + PAD * 2;
        return {
          p: s.panel,
          // Normalised 0..1, clamped. The runtime scales these to the rendered
          // element, so hotspots stay aligned at every viewport width.
          box: [
            +Math.max(0, x).toFixed(4),
            +Math.max(0, y).toFixed(4),
            +Math.min(1 - Math.max(0, x), w).toFixed(4),
            +Math.min(1 - Math.max(0, y), h).toFixed(4),
          ],
          c: s.clickable ? 1 : 0,
        };
      });
    }

    timeline.sequences[key] = seq;
    console.log(`  ${key}: ${kept.length} frames x ${TIERS.length} tiers encoded`);
  }

  await fs.writeFile(
    path.join(OUT, "timeline.json"),
    JSON.stringify(timeline, null, 2),
  );

  // Report delivered weight per tier so regressions are visible at build time.
  for (const tier of TIERS) {
    let bytes = 0;
    for (const key of Object.keys(clips)) {
      const dir = path.join(OUT, key, tier.name);
      for (const f of await fs.readdir(dir)) {
        bytes += (await fs.stat(path.join(dir, f))).size;
      }
    }
    console.log(`  tier ${tier.name}: ${(bytes / 1024 / 1024).toFixed(1)} MB total`);
  }

  console.log(`\n  wrote public/hero/timeline.json`);
  console.log("  done.\n");
}

main().catch((err) => {
  console.error("\nhero asset build failed:\n" + err.message + "\n");
  process.exitCode = 1;
});
