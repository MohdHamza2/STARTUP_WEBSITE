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
const MARK = path.join(ROOT, "public", "brand", "mark-ivory.png");
const APP = path.join(ROOT, "src", "app");
const PUBLIC = path.join(ROOT, "public");

const OBSIDIAN = { r: 11, g: 11, b: 11, alpha: 1 };
const IVORY = "#f5f4ef";
const MINT = "#34d399";

/** Mark centred on Obsidian, with the clear space the brand kit asks for. */
async function icon(size, outPath) {
  const inset = Math.round(size * 0.22);
  const mark = await sharp(MARK)
    .resize(size - inset * 2, size - inset * 2, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: OBSIDIAN },
  })
    .composite([{ input: mark, top: inset, left: inset }])
    .png()
    .toFile(outPath);

  return outPath;
}

/**
 * Open Graph card, 1200x630.
 *
 * Mark, wordmark and tagline on Obsidian with the mint rule — the brand board's
 * dark lockup. The wordmark is drawn as SVG text with wide tracking rather than
 * loading Sora, because the rasteriser has no access to the web font; at this
 * size a geometric fallback is indistinguishable in a social preview.
 */
async function ogImage(outPath) {
  const W = 1200;
  const H = 630;

  const mark = await sharp(MARK).resize(96, 96, { fit: "contain" }).toBuffer();

  const text = Buffer.from(`
    <svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <text x="96" y="372" fill="${IVORY}"
            font-family="Helvetica, Arial, sans-serif" font-size="108"
            font-weight="600" letter-spacing="24">GENRA</text>
      <rect x="100" y="410" width="120" height="4" fill="${MINT}"/>
      <text x="96" y="486" fill="${IVORY}"
            font-family="Helvetica, Arial, sans-serif" font-size="34"
            font-weight="500" letter-spacing="6">Build. Automate. Advance.</text>
      <text x="96" y="540" fill="#6b7280"
            font-family="Helvetica, Arial, sans-serif" font-size="26"
            letter-spacing="3">You name it. We build it.</text>
    </svg>
  `);

  await sharp({
    create: { width: W, height: H, channels: 4, background: OBSIDIAN },
  })
    .composite([
      { input: mark, top: 96, left: 96 },
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
