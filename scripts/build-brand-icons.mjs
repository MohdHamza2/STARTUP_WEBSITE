/**
 * Generate the favicon, app icons and Open Graph card from the supplied brand
 * mark.
 *
 * The brand kit §7 specifies a favicon at 16 and 32px, app/PWA icons at 180,
 * 192 and 512px, and a square icon-only mark for social. It also says to use the
 * icon-only mark whenever the wordmark would be too small to read — which is why
 * every icon here is the mark alone, and only the 1200x630 OG card carries the
 * wordmark.
 *
 * The mark is the supplied asset, never redrawn. Output is committed, because it
 * changes only when the brand does; rerun with `node scripts/build-brand-icons.mjs`.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Everything matches the light site: the header's black mark on paper
// (2026-10-05; previously the ivory mark on Obsidian from the dark theme).
const MARK = path.join(ROOT, "public", "brand", "mark-obsidian.png");
const APP = path.join(ROOT, "src", "app");
const PUBLIC = path.join(ROOT, "public");

const PAPER = { r: 245, g: 244, b: 239, alpha: 1 }; // #F5F4EF, the site background
const INK = "#0b0b0b";
const MUTED = "#374151";
const MINT = "#34d399";
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * Black mark centred on paper, with the clear space the brand kit asks for.
 * The source has wide transparent margins; trimming them first keeps the mark
 * legible at 32px instead of shrinking it to a few pixels.
 */
async function icon(size, outPath) {
  const inset = Math.round(size * 0.22);
  const mark = await sharp(MARK)
    .trim()
    .resize(size - inset * 2, size - inset * 2, { fit: "contain", background: CLEAR })
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: PAPER },
  })
    .composite([{ input: mark, top: inset, left: inset }])
    .png()
    .toFile(outPath);

  return outPath;
}

/**
 * Open Graph card, 1200x630.
 *
 * The header lockup (black mark, wordmark, mint rule) plus the tagline, on
 * paper. Everything is centred: WhatsApp and others crop the card to a centre
 * square for small previews, and a left-aligned lockup lost its first letters.
 *
 * The wordmark is SVG text with wide tracking rather than Sora, because the
 * rasteriser has no access to the web font; at this size a geometric fallback
 * is indistinguishable in a social preview. letter-spacing also trails the last
 * glyph, so each centred line is nudged right by half its spacing.
 */
async function ogImage(outPath) {
  const W = 1200;
  const H = 630;
  const MARK_BOX = 176;

  const mark = await sharp(MARK)
    .trim()
    .resize(MARK_BOX, MARK_BOX, { fit: "contain", background: CLEAR })
    .toBuffer();

  const font = `font-family="Helvetica, Arial, sans-serif" text-anchor="middle"`;
  const text = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <text x="${W / 2 + 9}" y="386" fill="${INK}" ${font} font-size="80"
            font-weight="600" letter-spacing="17.6">GENRA</text>
      <rect x="${W / 2 - 44}" y="410" width="88" height="4" fill="${MINT}"/>
      <text x="${W / 2 + 2}" y="472" fill="${INK}" ${font} font-size="32"
            font-weight="500" letter-spacing="4">Build. Automate. Advance.</text>
      <text x="${W / 2 + 1}" y="518" fill="${MUTED}" ${font} font-size="24"
            letter-spacing="2">You name it. We build it.</text>
    </svg>
  `);

  await sharp({
    create: { width: W, height: H, channels: 4, background: PAPER },
  })
    .composite([
      { input: mark, top: 106, left: (W - MARK_BOX) / 2 },
      { input: text, top: 0, left: 0 },
    ])
    .png()
    .toFile(outPath);

  return outPath;
}

async function main() {
  console.log("\nGENRA brand icons\n");

  const written = [];

  // Next.js App Router file conventions — these are picked up automatically.
  written.push(await icon(32, path.join(APP, "icon.png")));
  written.push(await icon(180, path.join(APP, "apple-icon.png")));
  written.push(await ogImage(path.join(APP, "opengraph-image.png")));

  // PWA icons referenced by the web manifest.
  await fs.mkdir(path.join(PUBLIC, "brand"), { recursive: true });
  written.push(await icon(192, path.join(PUBLIC, "brand", "icon-192.png")));
  written.push(await icon(512, path.join(PUBLIC, "brand", "icon-512.png")));

  for (const file of written) {
    const { size } = await fs.stat(file);
    console.log(`  ${path.relative(ROOT, file)}  ${(size / 1024).toFixed(1)} KB`);
  }
  console.log("\n  done.\n");
}

main().catch((err) => {
  console.error("\nbrand icon build failed:\n" + err.message + "\n");
  process.exitCode = 1;
});
