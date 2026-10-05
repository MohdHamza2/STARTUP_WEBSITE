"use client";

// A carousel whose cards behave like drops of liquid held on glass.
//
// Adapted for GENRA from the supplied MoltenRingCarousel (crafterui). The
// shader and the physics are the original's; what changed is who turns the
// ring. Here the ring is a pure function of an external position - the page's
// scroll offset, read once per frame through `getTarget` - instead of owning
// its own wheel handler. That is what lets the homepage hero be part of the
// page's scroll narrative: wheel, trackpad, touch, keyboard and scrollbar all
// move the page, the page moves the ring, and nothing is ever captured.
// The ring therefore also no longer wraps: it runs from the first card to the
// last and stops, so the page can carry on past it.
//
// The circle is far larger than the frame and its centre sits well off to the
// left, so only a sliver of it ever crosses the viewport - which reads as a
// tall arc of cards sweeping past with one squared up to the viewer.
//
// There is no mesh here and there are no image elements. Each card is a
// rounded-box distance field and the frame is one fullscreen pass taking a
// smooth minimum over the lot. That single operator buys the physics: two cards
// approaching never overlap, their fields fuse; two separating leave a strand
// behind, because the strand is one more term in the same field and narrows,
// hangs and finally parts of its own accord as the distance grows.
//
// The cursor is never painted. It widens the fusion radius beneath itself, tips
// nearby cards toward it, elbows their neighbours aside, and draws strands out
// between them. Mouse only - on touch the finger is scrolling the page.
//
// All of that liquid behaviour sits behind the `liquid` prop. With it off (as
// GENRA uses it since 2026-10-04) the same field and the same motion render
// separate, hard-edged cards: no fusion, no strands, no ripple, no crossfade,
// and a real gap between neighbours that stays open across the curve.
import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface MoltenRingItem {
  /** Cover art. Same-origin, or cross-origin with CORS headers. */
  image: string;
  /** Accessible name of the card's link. */
  title: string;
  /** Where activating the front card goes. */
  href: string;
}

export interface MoltenRingCarouselProps {
  items: MoltenRingItem[];
  /**
   * Called every frame: the slot that should face the viewer, as a float
   * (0 = first card). Values outside the item range are clamped.
   */
  getTarget: () => number;
  /** Horizontal position of the front card, as a fraction of the stage. @default 0.5 */
  focusX?: number;
  /** Card width / card height. Art is cover-fitted into it. @default 0.75 */
  cardRatio?: number;
  /** Card height as a fraction of the stage height. @default 0.56 */
  cardHeight?: number;
  /**
   * The supplied component's liquid look: cards fuse, strands form between
   * them, edges ripple and neighbouring art crossfades. Off renders separate
   * cards with clear space between them; the motion is the same.
   * @default true
   */
  liquid?: boolean;
  /** Fusion radius between neighbours, in card widths (liquid only). @default 0.087 */
  fuse?: number;
  /** String threads between cards as they pull apart (liquid only). @default true */
  threads?: boolean;
  /** Optical band that bends the image at the upper and lower borders. @default true */
  glass?: boolean;
  /** The front card changed (rounded from the eased position). */
  onActiveChange?: (index: number) => void;
  /** A card other than the front one was clicked. */
  onCardSelect?: (index: number) => void;
  /** Mouse dragged vertically by this many CSS px (positive = upward). */
  onDrag?: (dy: number) => void;
  /** WebGL2 is unavailable or the shader failed - render a fallback. */
  onUnsupported?: () => void;
  className?: string;
}

/** Each uniform-array element occupies a vec4 register; WebGL2 guarantees only
    224. Two dozen already exceeds what the visible arc can hold. */
const MAX_CARDS = 24;
const MAX_STRANDS = 24;

/* Figures below are multiples of the card's width ("long" in the original)
   or height ("short"), so proportions survive any viewport. */
const FUSE = 0.087; // resting blend between neighbours
const CORNER = 0.015;
const CROSSFADE = 0.035; // over which neighbouring art crossfades inside the goo
const SPACING = 1.12; // centre to centre along the arc, in card heights (liquid)
const VISIBLE_SLOTS = 3.5; // cards further than this from the front are skipped

/* Separate cards (liquid off). The gap is the clear space between neighbours,
   measured on the INSIDE of the curve, where tilted cards come closest; it
   scales with the stage so a phone gets a smaller but still obvious gap. */
const GAP = 0.075; // fraction of the stage height
const GAP_MIN = 24; // px
const GAP_MAX = 72; // px
/** Cursor lean and swell are damped so a hovered pair can never close the
    gap; the hovered card's neighbours still step aside. */
const SOLID_TOUCH = 0.35;
/** Arrival without fusion: the deck starts slightly gathered, never stacked,
    so no card is ever drawn over another. */
const SOLID_GATHER = 0.75;
/** Solid cards are a little softer at the corner (about 10px on a laptop)
    and sit on a restrained shadow that belongs to the front card. All as
    fractions of the card height. */
const SOLID_CORNER = 0.024;
const SHADOW_DROP = 0.03;
const SHADOW_BLUR = 0.075;
const SHADOW_OPACITY = 0.15;

/* Cursor. It contributes nothing to the picture; it only alters how the field
   responds nearby. Take-up and let-go run at different rates on purpose - a
   card tips toward the cursor briskly and returns at half the speed. */
const CURSOR_FUSE = 0.085; // blend added to the field at the cursor
const CURSOR_REACH = 0.65;
const PULL = 0.065; // how far a card leans toward the cursor
const SWELL = 0.09;
const REACH = 1.7; // radius of cursor influence, in card widths
const GRAB = 0.14;
const RELEASE = 0.06;
const NEIGHBOUR_PUSH = 0.042; // how far the hovered card's neighbours get out of the way
const NEIGHBOUR_SCALE = 0.035;
const NEIGHBOUR_DIM = 0.15;
const NEIGHBOUR_REACH = 2.4;
const WAVE = 0.01; // capillary wake off a moving cursor
const WAVE_FREQ = 20;
const WAVE_SPEED = 7;

/* Strands. Thickest where one leaves a card, waisted at the midpoint, and
   hanging lower the further it is drawn out. */
const STRAND = 0.2; // end thickness, relative to the edge it grows from
const STRAND_SNAP = 1.15; // gaps wider than this, in card heights, have snapped
const WAIST = 0.35;
const SAG = 0.015;
const WELD = 0.035;
/** While the ring turns, neighbours stay joined by a strand whose weight
    follows the speed of the turn - the molten pull between scroll steps. */
const MOTION_STRAND = 4;
/** And at rest a fine thread remains, so the ring reads as one body. */
const REST_STRAND = 0.32;

/* Optical band running across the upper and lower borders. */
const BAND = 0.08; // fraction of the stage height
const REFRACT = 0.15;
const SQUEEZE = 0.05;
const RIPPLE = 0.0125;
const RIPPLE_FREQ = 8;
const FRINGE = 0.004;
const SHEEN = 0.05;

const WOBBLE = 0.0075; // surface tension noise while the ring is moving

/* Turn. The ring eases after the page; the page itself is already smoothed
   by Lenis, so this is quicker than the original's free-spinning ease. */
const EASE = 0.14;
const CLICK_SLOP = 6;

/* Arrival. The deck begins fused into a single mass at the front and the
   circle draws it apart into slots, which is what produces the strands. */
const ENTRY_MS = 2200;

const THEME_EVERY = 20;
/** Device pixels the fragment pass may cover. Above this the backing store
    is scaled down - a fullscreen shader on a 4K, DPR-2 display is 33M px. */
const PIXEL_BUDGET = 4_200_000;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));
const inOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const QUAD_VERT = /* glsl */ `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos;
  gl_Position = vec4(aPos * 2.0 - 1.0, 0.0, 1.0);
}`;

const RING_FRAG = /* glsl */ `#version 300 es
precision highp float;

#define MAX_CARDS ${MAX_CARDS}
#define MAX_STRANDS ${MAX_STRANDS}

in vec2 vUv;
out vec4 fragColor;

uniform vec2  uResolution;   // px
uniform vec2  uSize;         // resting card size in px - width, height
uniform float uCorner;

uniform float uCount;
uniform vec2  uCentre[MAX_CARDS];   // centre in px, origin at the stage centre
uniform float uAngle[MAX_CARDS];   // radians
// xy = per-axis scale, z = brightness, w = atlas cell index. Packed together
// because a uniform-array slot is a full vec4 register regardless of the
// declared type, so zw are free once xy are spent.
uniform vec4  uCardState[MAX_CARDS];

uniform float uStrandCount;
uniform vec2  uStrandA[MAX_STRANDS];
uniform vec2  uStrandB[MAX_STRANDS];
uniform vec4  uStrandPar[MAX_STRANDS];  // end thickness, waist, hang, weld width

uniform float uFuse;            // blend strength, px
uniform float uJitter;
uniform float uTime;
uniform vec3  uColor;        // untextured fallback, and the loading silhouette

uniform sampler2D uAtlas;    // one sheet; sampler arrays need a constant index
uniform vec2  uGrid;         // cells across, down
uniform float uCrossfade;        // px over which neighbouring art crossfades
uniform float uHasArt;

uniform vec4  uCursor;        // xy in px, z = engaged 0..1, w = added fusion
uniform vec4  uWake;         // radius px, amplitude px, spatial freq, rate

uniform float uLipDepth;         // glass lip depth, px - 0 turns it off
uniform vec4  uLip;        // refract px, squeeze, ripple px, ripple frequency
uniform float uFringe;
uniform float uSheen;

// Soft drop shadow under the cards (solid mode): x = drop below the card,
// y = blur, z = opacity, all px. uLift is each card's share of it, 1 at the
// front and fading to 0 a slot away, so the shadow travels with its card.
uniform vec4  uShadow;
uniform float uLift[MAX_CARDS];

// Integer cell maths. With floats, idx / cols can land a hair under a whole
// number on some GPUs (3.0 / 3.0 = 0.9999999 on AMD/D3D11), so floor() and
// mod() put cards 3 and 6 one column past the sheet, where CLAMP_TO_EDGE
// smeared the sheet's last pixel column across them as horizontal streaks.
vec2 atlasUV(vec2 uv, float idx) {
  int i = int(idx + 0.5);
  int cols = int(uGrid.x + 0.5);
  return (vec2(float(i % cols), float(i / cols)) + uv) / uGrid;
}

/* Bilinear value noise. The perturbation is small and rides on a surface
   already in motion, so a simplex implementation would cost twenty more lines
   for a difference nobody could pick out. */
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  ) * 2.0 - 1.0;
}

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

/* One strand spanning two cards: a slab laid centre to centre, as thick at
   each end as the edge it grows from, waisted at the midpoint and hanging under
   its own weight.

   Swept as a box, not a capsule. A capsule's circular cross-section would
   balloon past the cards' own flat faces once they fused; a box tucks inside
   them, so a merged pair keeps the outline of a single card. */
float sdStrand(vec2 p, vec2 a, vec2 b, float rEnd, float rMid, float sag) {
  vec2 ba = b - a;
  float len = length(ba);
  if (len < 0.001) return 1e6;

  vec2 dir = ba / len;
  vec2 nrm = vec2(-dir.y, dir.x);
  vec2 q = p - (a + b) * 0.5;
  float along = dot(q, dir);
  float across = dot(q, nrm);

  float h = clamp(along / len + 0.5, 0.0, 1.0);
  float bell = sin(3.14159265 * h);        // peaks mid-span, vanishes at both ends
  across += sag * bell * nrm.y;            // hang, projected onto the perpendicular
  float r = mix(rMid, rEnd, pow(1.0 - bell, 1.7));

  // Square ends, which finish inside the cards and are never on screen.
  return max(abs(along) - len * 0.5, abs(across) - r);
}

/* Smooth minimum - the one operator the whole look rests on. Against the 1e6
   sentinel it degrades cleanly to an ordinary min(). */
float smin(float a, float b, float k) {
  if (k <= 0.0001) return min(a, b);
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

/* The upper and lower margins behave like the ground edge of a thick pane.
   Since the whole scene is evaluated from p, displacing p at this point bends
   cards and strands together in one pass - no extra target, no second warp. */
float lipWarp(inout vec2 p) {
  if (uLipDepth <= 0.5) return 0.0;
  float dy = abs(p.y) - (uResolution.y * 0.5 - uLipDepth);
  if (dy <= 0.0) return 0.0;

  float t = clamp(dy / uLipDepth, 0.0, 1.0);
  // A circular falloff: almost flat where the band begins and dropping away
  // steeply at the boundary, which is what sells depth over a plain gradient.
  float bend = 1.0 - sqrt(max(0.0, 1.0 - t * t));

  // Sampling from deeper inside displaces detail toward the margin, so the
  // image elongates into the band and grows as it nears the boundary.
  p.y -= sign(p.y) * bend * (uLip.x + sin(p.x * uLip.w) * uLip.z);
  p.x *= 1.0 - bend * uLip.y;
  return bend;
}

void main() {
  vec2 p = (vUv - 0.5) * uResolution;
  float bend = lipWarp(p);

  // Measured after the displacement so the cursor lives in the same warped
  // space the cards do.
  float toCursor = length(p - uCursor.xy);

  // Fusion radius rises within a pool centred on the pointer, slackening the
  // field just where contact occurs while it stays taut elsewhere.
  float k = uFuse;
  if (uCursor.z > 0.001) {
    float t = 1.0 - smoothstep(0.0, max(uWake.x, 1.0), toCursor);
    k += uCursor.w * uCursor.z * t * t;
  }

  float d = 1e6;

  // The nearest two cards, carried alongside the distance so colour resolves in
  // the same loop rather than a second one. Where the field bridges a pair both
  // register as close, which is precisely where the crossfade should sit.
  float d0 = 1e6, d1 = 1e6;
  vec2 uv0 = vec2(0.5), uv1 = vec2(0.5);
  float im0 = 0.0, im1 = 0.0;
  float dm0 = 1.0, dm1 = 1.0;

  float halfSpan = length(uSize) * 0.5;
  float shadow = 0.0;

  for (int i = 0; i < MAX_CARDS; i++) {
    if (float(i) >= uCount) break;

    vec4 st = uCardState[i];
    float grown = max(st.x, st.y);
    if (grown <= 0.0001) continue;

    vec2 q = p - uCentre[i];
    // Beyond this radius a card cannot reach the surface, so it is rejected
    // before any transcendentals run.
    float cull = halfSpan * grown + k + uJitter + 8.0 + uShadow.x + uShadow.y;
    if (dot(q, q) > cull * cull) continue;

    float ca = cos(uAngle[i]), sa = sin(uAngle[i]);
    q = vec2(q.x * ca + q.y * sa, -q.x * sa + q.y * ca);

    vec2 halfSize = max(uSize * 0.5 * st.xy, vec2(0.0001));
    // Opens as a lozenge and settles into the rounded rectangle as it grows, so
    // arrival reads as a droplet finding its form, not a box being scaled.
    float rMax = min(halfSize.x, halfSize.y);
    float r = min(rMax, mix(rMax, uCorner, smoothstep(0.30, 1.0, min(st.x, st.y))));

    float di = sdRoundBox(q, halfSize, r);
    d = smin(d, di, k);

    if (uShadow.z > 0.0 && uLift[i] > 0.001) {
      // The drop is straight down on screen; rotated into card space here.
      vec2 qs = q + uShadow.x * vec2(sa, ca);
      float ds = sdRoundBox(qs, halfSize * 0.96, r);
      shadow = max(shadow, uLift[i] * (1.0 - smoothstep(-0.5 * uShadow.y, uShadow.y, ds)));
    }

    // Clamped so that fused area beyond a card's own bounds takes that card's
    // edge pixels instead of tiling or spilling into the adjacent atlas cell.
    vec2 luv = clamp(q / (2.0 * halfSize) + 0.5, 0.004, 0.996);
    luv.y = 1.0 - luv.y;

    if (di < d0) {
      d1 = d0; uv1 = uv0; im1 = im0; dm1 = dm0;
      d0 = di; uv0 = luv; im0 = st.w; dm0 = st.z;
    } else if (di < d1) {
      d1 = di; uv1 = luv; im1 = st.w; dm1 = st.z;
    }
  }

  for (int i = 0; i < MAX_STRANDS; i++) {
    if (float(i) >= uStrandCount) break;
    vec4 par = uStrandPar[i];
    if (par.x <= -3.0) continue;
    vec2 a = uStrandA[i], b = uStrandB[i];
    vec2 mid = (a + b) * 0.5;
    float span = length(b - a) * 0.5 + par.x + par.w + 8.0;
    if (dot(p - mid, p - mid) > span * span) continue;
    d = smin(d, sdStrand(p, a, b, par.x, par.y, par.z), par.w);
  }

  // Surface tension, scaled to nothing at rest so a settled ring is perfectly
  // smooth.
  if (uJitter > 0.001) {
    d += noise(p * 0.012 + vec2(uTime * 0.22, uTime * -0.17)) * uJitter;
  }

  // A wake trailing the cursor, expanding outward and decaying over the same
  // radius the slackening uses.
  if (uWake.y > 0.001) {
    d += sin(toCursor * uWake.z - uTime * uWake.w)
       * uWake.y * exp(-toCursor / max(uWake.x, 1.0));
  }

  // Bounded at both ends: the rejection test above puts a discontinuity in the
  // field, and an unbounded fwidth across it would trace a translucent seam.
  float aa = clamp(fwidth(d), 0.5, 2.0);
  float alpha = 1.0 - smoothstep(-aa, aa, d);
  float shade = shadow * uShadow.z * (1.0 - alpha);
  if (alpha <= 0.001 && shade <= 0.002) discard;

  float nearest = smoothstep(-uCrossfade, uCrossfade, d1 - d0);

  vec3 col = uColor;
  if (uHasArt > 0.5) {
    vec2 fr = vec2(uFringe * bend, 0.0);
    vec3 c0 = vec3(
      texture(uAtlas, atlasUV(uv0 + fr, im0)).r,
      texture(uAtlas, atlasUV(uv0, im0)).g,
      texture(uAtlas, atlasUV(uv0 - fr, im0)).b
    );
    vec3 c1 = vec3(
      texture(uAtlas, atlasUV(uv1 + fr, im1)).r,
      texture(uAtlas, atlasUV(uv1, im1)).g,
      texture(uAtlas, atlasUV(uv1 - fr, im1)).b
    );
    col = mix(c1, c0, nearest);
  }

  col *= mix(dm1, dm0, nearest);

  // A little brightening where the band is steepest, so it reads as a surface
  // taking light and not purely as a distortion.
  col += bend * uSheen;

  // Card over its shadow. The shadow is black, so only alpha changes; the
  // colour is scaled so the unpremultiplied result composites correctly.
  float outA = alpha + shade;
  fragColor = vec4(col * (alpha / max(outA, 0.0001)), outA);
}`;

function build(gl: WebGL2RenderingContext, vert: string, frag: string) {
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, vert],
    [gl.FRAGMENT_SHADER, frag],
  ] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.bindAttribLocation(program, 0, "aPos");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

/** Cached uniform handles. getUniformLocation performs a string lookup on every
    call, and this sits inside the per-frame path. */
function uniforms(gl: WebGL2RenderingContext, program: WebGLProgram) {
  const cache = new Map<string, WebGLUniformLocation | null>();
  return (name: string) => {
    let loc = cache.get(name);
    if (loc === undefined) {
      loc = gl.getUniformLocation(program, name);
      cache.set(name, loc);
    }
    return loc;
  };
}

/** Resolves any CSS colour to 0-1 RGB by asking the browser instead of parsing
    it, so a theme token in any colour syntax reads correctly. */
function colorReader() {
  const probe = document.createElement("canvas");
  probe.width = probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  return (css: string): [number, number, number] => {
    if (!ctx) return [0, 0, 0];
    ctx.fillStyle = "#000";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r / 255, g / 255, b / 255];
  };
}

/** A single sheet, each cell cover-fitted. ESSL forbids indexing a sampler
    array with a non-constant expression, ruling out one texture per card. */
function packAtlas(
  images: HTMLImageElement[],
  cols: number,
  cell: number,
  ratio: number,
) {
  const rows = Math.ceil(images.length / cols);
  const cellH = Math.round(cell / ratio);
  const sheet = document.createElement("canvas");
  sheet.width = cols * cell;
  sheet.height = rows * cellH;
  const ctx = sheet.getContext("2d");
  if (!ctx) return sheet;
  images.forEach((image, i) => {
    // A card that never decoded has no natural size; scaling by it yields
    // Infinity and drawImage throws, taking every later cell with it.
    if (!image.naturalWidth || !image.naturalHeight) return;
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * cellH;
    const scale = Math.max(
      cell / image.naturalWidth,
      cellH / image.naturalHeight,
    );
    const w = image.naturalWidth * scale;
    const h = image.naturalHeight * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, cell, cellH);
    ctx.clip();
    ctx.drawImage(image, x + (cell - w) / 2, y + (cellH - h) / 2, w, h);
    ctx.restore();
  });
  return sheet;
}

export function MoltenRingCarousel({
  items,
  getTarget,
  focusX = 0.5,
  cardRatio = 0.75,
  cardHeight = 0.56,
  liquid = true,
  fuse = FUSE,
  threads = true,
  glass = true,
  onActiveChange,
  onCardSelect,
  onDrag,
  onUnsupported,
  className,
}: MoltenRingCarouselProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  const [active, setActive] = React.useState(0);

  // Everything the frame loop reads lives in a ref, so changing a prop or a
  // callback never tears down the GL context.
  const live = React.useRef({
    getTarget,
    focusX,
    cardRatio,
    cardHeight,
    liquid,
    fuse,
    threads,
    glass,
    onActiveChange,
    onCardSelect,
    onDrag,
    onUnsupported,
  });
  React.useEffect(() => {
    live.current = {
      getTarget,
      focusX,
      cardRatio,
      cardHeight,
      liquid,
      fuse,
      threads,
      glass,
      onActiveChange,
      onCardSelect,
      onDrag,
      onUnsupported,
    };
  });

  const count = Math.min(items.length, MAX_CARDS);
  const sources = items.map((item) => item.image).join(" ");

  React.useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas || !count) return;
    // Unpremultiplied alpha, so whatever the ring does not cover is simply the
    // page underneath - the shader stays theme-agnostic.
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      live.current.onUnsupported?.();
      return;
    }

    const program = build(gl, QUAD_VERT, RING_FRAG);
    if (!program) {
      live.current.onUnsupported?.();
      return;
    }
    const readColor = colorReader();
    const u = uniforms(gl, program);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const quad = gl.createVertexArray();
    gl.bindVertexArray(quad);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // --- art --------------------------------------------------------------
    // Three across keeps nine cards in a square sheet. The cell is sized to
    // what the card actually occupies on this device (no 1024px textures on a
    // phone) and capped so the sheet fits the GPU - WebGL2 promises only 2048.
    const COLS = Math.min(3, count);
    const ROWS = Math.ceil(count / COLS);
    const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    const ratio = live.current.cardRatio;
    const wanted =
      canvas.clientHeight *
      live.current.cardHeight *
      ratio *
      Math.min(window.devicePixelRatio || 1, 2);
    const CELL = Math.max(
      256,
      Math.min(
        768,
        Math.ceil(wanted / 64) * 64,
        Math.floor(maxTexture / COLS),
        Math.floor((maxTexture / ROWS) * ratio),
      ),
    );
    let atlas: WebGLTexture | null = null;
    let loaded = 0;
    let disposed = false;
    const images = items.slice(0, count).map((item) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.decoding = "async";
      // Settled, not loaded. The sheet is all-or-nothing, so one URL that
      // fails would otherwise hold every card untextured forever.
      const settle = () => {
        if (disposed || ++loaded < count) return;
        atlas = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, atlas);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          packAtlas(images, COLS, CELL, ratio),
        );
        // Mipmaps are skipped - lower levels would average across cell borders,
        // and cards occupy enough pixels that minification never applies.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        wake();
      };
      image.onload = settle;
      image.onerror = () => {
        console.warn(`molten-ring-carousel: ${item.image} failed to load`);
        settle();
      };
      image.src = item.image;
      return image;
    });

    // --- state ------------------------------------------------------------
    let width = 0;
    let height = 0;
    let progress = clamp(live.current.getTarget(), 0, count - 1);
    let lastGoal = progress;
    let goalSpeed = 0;
    let hovered = -1;
    let pointerX = -1;
    let pointerY = -1;
    let pointerSpeed = 0;
    let entry = 0;
    let entryStart = 0;
    let clock = 0;
    let previous = 0;
    let ticks = 0;
    let frame = 0;
    let idleFrames = 0;
    let visible = true;
    let shownActive = -1;
    let ink: [number, number, number] = [0, 0, 0];

    const leanX = new Float32Array(count);
    const leanY = new Float32Array(count);
    const swell = new Float32Array(count);
    const dim = new Float32Array(count);

    const pos = new Float32Array(MAX_CARDS * 2);
    const rot = new Float32Array(MAX_CARDS);
    const scale = new Float32Array(MAX_CARDS * 4);
    const lift = new Float32Array(MAX_CARDS);
    const strandA = new Float32Array(MAX_STRANDS * 2);
    const strandB = new Float32Array(MAX_STRANDS * 2);
    const strandPar = new Float32Array(MAX_STRANDS * 4);

    /** Per-frame screen placement for every card, used by hit-testing, the
        link overlay and the strand solver. */
    const at = Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      angle: 0,
      scale: 1,
      slot: 0,
    }));

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w * h * dpr * dpr > PIXEL_BUDGET)
        dpr = Math.max(1, Math.sqrt(PIXEL_BUDGET / (w * h)));
      width = w;
      height = h;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      wake();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // Nothing is drawn while the stage is off screen.
    const seen = new IntersectionObserver(([record]) => {
      visible = record?.isIntersecting ?? true;
      if (visible) wake();
    });
    seen.observe(stage);

    // --- input ------------------------------------------------------------
    // Pointer influence is a mouse affair; a finger on the stage is scrolling
    // the page, and must be left to do so (touch-action: pan-y).
    let dragFrom: number | null = null;
    let dragTravel = 0;
    let dragging = false;
    let pointerId = -1;
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragFrom = event.clientY;
      dragTravel = 0;
      dragging = false;
      pointerId = event.pointerId;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = canvas.getBoundingClientRect();
      const nx = event.clientX - box.left;
      const ny = event.clientY - box.top;
      pointerSpeed = Math.hypot(nx - pointerX, ny - pointerY);
      pointerX = nx;
      pointerY = ny;
      wake();
      if (dragFrom !== null) {
        const travel = dragFrom - event.clientY;
        dragTravel += Math.abs(travel);
        dragFrom = event.clientY;
        if (!dragging && dragTravel > CLICK_SLOP) {
          dragging = true;
          // Captured only once it is a drag, so a plain click still lands on
          // the front card's link.
          stage.setPointerCapture(pointerId);
        }
        if (dragging) live.current.onDrag?.(travel);
      }
    };
    const onUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const wasClick = dragFrom !== null && !dragging;
      dragFrom = null;
      if (stage.hasPointerCapture(pointerId))
        stage.releasePointerCapture(pointerId);
      if (!wasClick || hovered < 0 || hovered === shownActive) return;
      live.current.onCardSelect?.(hovered);
    };
    const onLeave = () => {
      pointerX = -1;
      pointerY = -1;
      hovered = -1;
    };
    // A drag that ends over the link must not also follow it.
    const onClickCapture = (event: MouseEvent) => {
      if (!dragging) return;
      dragging = false;
      event.preventDefault();
      event.stopPropagation();
    };

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("click", onClickCapture, true);

    // --- frame ------------------------------------------------------------
    // One loop, which stops itself when the stage is hidden or fully at rest
    // and is restarted by anything that could change the picture.
    let running = false;
    function wake() {
      idleFrames = 0;
      if (running || disposed) return;
      running = true;
      previous = 0;
      frame = requestAnimationFrame(draw);
    }
    const onScroll = () => wake();
    window.addEventListener("scroll", onScroll, { passive: true });

    const draw = (now: number) => {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(draw);
      if (!width || !height) return;
      // Capped at a quarter second so a backgrounded tab does not jump, but
      // not lower: the easing is time-normalised, and a tight cap made a slow
      // GPU (few frames per second) lag the page by seconds.
      const dt = previous ? Math.min((now - previous) / 1000, 0.25) : 0;
      previous = now;
      clock += dt;
      const config = live.current;
      // Per-frame rates below were tuned at 60fps; this keeps them the same
      // speed on 120Hz displays and through dropped frames.
      const ease = (rate: number) => 1 - Math.pow(1 - rate, dt * 60);

      if (ticks++ % THEME_EVERY === 0)
        ink = readColor(getComputedStyle(canvas).color);

      // Wall-clock, not frame-summed: a slow GPU must not stretch the arrival.
      if (atlas) {
        if (!entryStart) entryStart = now;
        entry = reduced ? 1 : Math.min(1, (now - entryStart) / ENTRY_MS);
      }
      const spread = inOutCubic(entry);
      const liquid = config.liquid;
      // Liquid: the deck starts fused at the front and is drawn apart.
      // Solid: it starts only slightly gathered, so cards never overlap.
      const gather = liquid
        ? spread
        : SOLID_GATHER + (1 - SOLID_GATHER) * spread;

      // --- turn -----------------------------------------------------------
      const goal = clamp(config.getTarget(), 0, count - 1);
      const goalStep = dt > 0 ? Math.abs(goal - lastGoal) / (dt * 60) : 0;
      goalSpeed += (goalStep - goalSpeed) * ease(0.2);
      lastGoal = goal;
      progress += (goal - progress) * (reduced ? 1 : ease(EASE));
      const speed = Math.abs(goal - progress);
      const motion = clamp((speed + goalSpeed * 4) * MOTION_STRAND, 0, 1);

      const front = clamp(Math.round(progress), 0, count - 1);
      if (front !== shownActive) {
        shownActive = front;
        setActive(front);
        config.onActiveChange?.(front);
      }

      // --- geometry --------------------------------------------------------
      // Sized from the stage height first, so a wide monitor gets a taller
      // card rather than a bigger one, then capped by width for narrow stages.
      const short = Math.min(
        height * config.cardHeight,
        (width * 0.7) / config.cardRatio,
        720,
      );
      const long = short * config.cardRatio;
      const radius = Math.max(height * 1.5, short * 3.2);
      let centreStep = short * SPACING;
      if (!liquid) {
        // Tilted along the arc, neighbours come closest on the inside of the
        // curve, where the arc is shorter by half a card width. Spacing them
        // for that edge keeps the gap open everywhere, wider on the outside.
        const gap = clamp(height * GAP, GAP_MIN, GAP_MAX);
        centreStep = (short + gap) / (1 - long / (2 * radius));
      }
      const angleStep = centreStep / radius;
      const shiftX = (config.focusX - 0.5) * width;
      const centreX = shiftX - radius; // the ring's near point is the focus

      for (let i = 0; i < count; i++) {
        const slot = i - progress;
        // The deck begins collapsed at the front slot and spreads outward into
        // position, which is the motion that pulls the strands. Later cards
        // wait below, so scrolling down lifts the next one into place.
        const angle = -slot * angleStep * gather;
        at[i].slot = slot;
        at[i].angle = angle;
        at[i].x = centreX + Math.cos(angle) * radius;
        at[i].y = Math.sin(angle) * radius;
      }

      // --- pointer ---------------------------------------------------------
      const mx = pointerX >= 0 ? pointerX - width / 2 : 0;
      const my = pointerY >= 0 ? height / 2 - pointerY : 0;
      const present = pointerX >= 0 ? 1 : 0;

      if (present && pointerSpeed < 24) {
        hovered = -1;
        let best = Infinity;
        for (let i = 0; i < count; i++) {
          if (Math.abs(at[i].slot) > VISIBLE_SLOTS) continue;
          const dx = Math.abs(mx - at[i].x);
          const dy = Math.abs(my - at[i].y);
          if (dx > long / 2 || dy > short / 2) continue;
          const distance = dx + dy;
          if (distance < best) {
            best = distance;
            hovered = i;
          }
        }
      }
      pointerSpeed *= Math.pow(0.85, dt * 60);
      stage.style.cursor =
        hovered >= 0 && hovered !== front ? "pointer" : "";

      let settling = 0;
      for (let i = 0; i < count; i++) {
        const dx = mx - at[i].x;
        const dy = my - at[i].y;
        const pull = present
          ? Math.max(0, 1 - Math.hypot(dx, dy) / (long * REACH))
          : 0;
        const isHovered = i === hovered ? 1 : 0;

        // Tipping toward the cursor is quick and returning is slow; that
        // asymmetry is what gives the surface a sense of mass.
        const touch = liquid ? 1 : SOLID_TOUCH;
        const towardX = dx * (pull * pull) * PULL * touch * long * 0.02;
        const towardY = dy * (pull * pull) * PULL * touch * long * 0.02;
        leanX[i] += (towardX - leanX[i]) * ease(pull > 0 ? GRAB : RELEASE);
        leanY[i] += (towardY - leanY[i]) * ease(pull > 0 ? GRAB : RELEASE);

        let push = 0;
        let dimTarget = 0;
        if (hovered >= 0 && i !== hovered) {
          const gap = Math.abs(i - hovered);
          const off = Math.max(0, 1 - gap / NEIGHBOUR_REACH);
          push =
            Math.sign(at[i].y - at[hovered].y || 1) *
            off *
            NEIGHBOUR_PUSH *
            long;
          dimTarget = off * NEIGHBOUR_DIM;
        }
        dim[i] += (dimTarget - dim[i]) * ease(dimTarget > dim[i] ? GRAB : RELEASE);

        const wantSwell =
          pull * pull * SWELL * touch +
          isHovered * NEIGHBOUR_SCALE -
          dimTarget * (NEIGHBOUR_SCALE / NEIGHBOUR_DIM);
        swell[i] +=
          (wantSwell - swell[i]) * ease(wantSwell > swell[i] ? GRAB : RELEASE);
        settling = Math.max(
          settling,
          Math.abs(towardX - leanX[i]),
          Math.abs(towardY - leanY[i]),
          Math.abs(dimTarget - dim[i]) * 100,
          Math.abs(wantSwell - swell[i]) * 100,
        );

        at[i].x += leanX[i];
        at[i].y += leanY[i] + push;
        at[i].scale =
          Math.abs(at[i].slot) > VISIBLE_SLOTS
            ? 0
            : (0.18 + 0.82 * spread) * (1 + swell[i]);

        pos[i * 2] = at[i].x;
        pos[i * 2 + 1] = at[i].y;
        rot[i] = at[i].angle;
        scale[i * 4] = at[i].scale;
        scale[i * 4 + 1] = at[i].scale;
        scale[i * 4 + 2] = 1 - dim[i];
        scale[i * 4 + 3] = i;
        // Front card carries the shadow; it hands over smoothly as the ring
        // turns, so the shadow leaves with one card and arrives with the next.
        const front01 = clamp(1 - Math.abs(at[i].slot) * 1.25, 0, 1);
        lift[i] = front01 * front01 * (3 - 2 * front01) * spread;
      }

      // The front card's link follows the card, so the hit target is a real
      // element over the real picture, not a canvas pixel.
      const link = linkRef.current;
      if (link) {
        const card = at[front];
        const w = long * card.scale;
        const h = short * card.scale;
        link.style.width = `${w}px`;
        link.style.height = `${h}px`;
        link.style.transform = `translate(${width / 2 + card.x - w / 2}px, ${
          height / 2 - card.y - h / 2
        }px) rotate(${-card.angle}rad)`;
      }

      // --- strands ----------------------------------------------------------
      let strands = 0;
      if (liquid && config.threads) {
        for (let i = 0; i < count - 1 && strands < MAX_STRANDS; i++) {
          const j = i + 1;
          if (at[i].scale <= 0 || at[j].scale <= 0) continue;
          const gap = Math.hypot(at[j].x - at[i].x, at[j].y - at[i].y);
          const opening = (gap - short) / (short * STRAND_SNAP);
          if (opening > 1 || opening < -1) continue;
          const strength = Math.max(
            1 - spread,
            hovered === i || hovered === j ? 1 : 0,
            motion,
            REST_STRAND,
          );
          if (strength < 0.02) continue;
          const rEnd =
            short * 0.5 * STRAND * strength * (1 - clamp(opening, 0, 1));
          if (rEnd <= 0.5) continue;
          strandA[strands * 2] = at[i].x;
          strandA[strands * 2 + 1] = at[i].y;
          strandB[strands * 2] = at[j].x;
          strandB[strands * 2 + 1] = at[j].y;
          strandPar[strands * 4] = rEnd;
          strandPar[strands * 4 + 1] = rEnd * WAIST;
          strandPar[strands * 4 + 2] = SAG * long * clamp(opening, 0, 1);
          strandPar[strands * 4 + 3] = WELD * long;
          strands++;
        }
      }

      // --- rest -------------------------------------------------------------
      // Once the ring has settled, the cursor is gone and the arrival has
      // played, every further frame would be identical - so stop drawing.
      const still =
        entry >= 1 &&
        speed < 0.0005 &&
        goalSpeed < 0.0005 &&
        !present &&
        settling < 0.05;
      idleFrames = still ? idleFrames + 1 : 0;
      if (idleFrames > 3) {
        cancelAnimationFrame(frame);
        running = false;
        return;
      }

      // --- draw -------------------------------------------------------------
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindVertexArray(quad);

      gl.uniform2f(u("uResolution"), width, height);
      gl.uniform2f(u("uSize"), long, short);
      gl.uniform1f(u("uCorner"), liquid ? CORNER * long : SOLID_CORNER * short);
      gl.uniform1f(u("uCount"), count);
      gl.uniform2fv(u("uCentre"), pos);
      gl.uniform1fv(u("uAngle"), rot);
      gl.uniform4fv(u("uCardState"), scale);
      gl.uniform1f(u("uStrandCount"), strands);
      gl.uniform2fv(u("uStrandA"), strandA);
      gl.uniform2fv(u("uStrandB"), strandB);
      gl.uniform4fv(u("uStrandPar"), strandPar);
      gl.uniform1f(u("uFuse"), liquid ? config.fuse * long : 0);
      gl.uniform1f(
        u("uJitter"),
        reduced || !liquid
          ? 0
          : WOBBLE * long * clamp(speed * 2 + (1 - spread), 0, 1),
      );
      gl.uniform1f(u("uTime"), reduced ? 0 : clock);
      gl.uniform3fv(u("uColor"), ink);
      // Solid cards never share pixels, so the art switch is a 1px
      // anti-aliased edge rather than a crossfade.
      gl.uniform1f(u("uCrossfade"), liquid ? CROSSFADE * long : 0.75);
      gl.uniform1f(u("uHasArt"), atlas ? 1 : 0);
      gl.uniform2f(u("uGrid"), COLS, ROWS);
      gl.uniform4f(
        u("uCursor"),
        mx,
        my,
        present,
        liquid ? CURSOR_FUSE * long : 0,
      );
      gl.uniform4f(
        u("uWake"),
        CURSOR_REACH * long,
        reduced || !liquid ? 0 : WAVE * long * clamp(pointerSpeed / 40, 0, 1),
        WAVE_FREQ / long,
        WAVE_SPEED,
      );
      gl.uniform1f(u("uLipDepth"), config.glass ? BAND * height : 0);
      gl.uniform4f(
        u("uLip"),
        REFRACT * long,
        SQUEEZE,
        RIPPLE * long,
        RIPPLE_FREQ / long,
      );
      gl.uniform1f(u("uFringe"), FRINGE);
      gl.uniform1f(u("uSheen"), SHEEN);
      gl.uniform4f(
        u("uShadow"),
        liquid ? 0 : SHADOW_DROP * short,
        liquid ? 0 : SHADOW_BLUR * short,
        liquid ? 0 : SHADOW_OPACITY,
        0,
      );
      gl.uniform1fv(u("uLift"), lift);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, atlas);
      gl.uniform1i(u("uAtlas"), 0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
    const onVisibility = () => {
      if (!document.hidden) wake();
    };
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    wake();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      running = false;
      observer.disconnect();
      seen.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("click", onClickCapture, true);
      stage.style.cursor = "";
      for (const image of images) {
        image.onload = null;
        image.onerror = null;
      }
      if (atlas) gl.deleteTexture(atlas);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(quad);
      gl.deleteProgram(program);
    };
    // `sources` stands in for `items`: the loop owns the atlas, so it must
    // rebuild when the pictures change and must not when a label does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources, count]);

  const item = items[active];

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative h-full w-full touch-pan-y touch-pinch-zoom select-none overflow-hidden",
        className,
      )}
    >
      {/* Painted, so hidden from assistive technology; the link below and the
          surrounding hero carry the meaning. Silver is the loading silhouette. */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-silver"
      />
      {item ? (
        <Link
          ref={linkRef}
          href={item.href}
          draggable={false}
          // Pointer hit target only. The host renders the accessible link (the
          // visible "Explore" link), so this one stays out of the tab order.
          tabIndex={-1}
          aria-hidden="true"
          aria-label={`${item.title} — explore`}
          className="absolute left-0 top-0 origin-center rounded-sm"
          style={{ width: 0, height: 0 }}
        />
      ) : null}
    </div>
  );
}

export default MoltenRingCarousel;
