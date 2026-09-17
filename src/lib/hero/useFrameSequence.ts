"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Progressive frame-sequence loader.
 *
 * Loads a numbered WebP sequence and exposes a `draw(index)` that paints the
 * nearest ALREADY-LOADED frame to a canvas. That matters: the hero must be
 * scrubbable the moment it is visible, not after every frame has downloaded.
 *
 * Frames arrive in a coarse-to-fine order — a spread across the whole sequence
 * first, then the gaps — so early scrubbing is smooth-but-steppy rather than
 * blank, and sharpens as loading completes.
 */
export function useFrameSequence(
  basePath: string | null,
  count: number,
  {
    priority = false,
    onFrameLoad,
  }: {
    priority?: boolean;
    /**
     * Called after each frame finishes loading.
     *
     * Load-bearing: the consumer paints imperatively, so without this the first
     * paint happens before any frame exists, draws nothing, and never runs
     * again until a scroll or resize event. On a fresh page load that leaves
     * the hero black until the visitor happens to scroll.
     *
     * Must be referentially stable — it is an effect dependency, and a new
     * identity each render would restart the whole download.
     */
    onFrameLoad?: () => void;
  } = {},
) {
  // Frames live in a ref, never in state. Loading 150 images would otherwise
  // trigger 150 re-renders of a component that paints to a canvas imperatively
  // and does not read them during render.
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    if (!basePath || count <= 0) return;

    framesRef.current = new Array(count).fill(null);

    let cancelled = false;

    // Coarse-to-fine ordering: stride 8, then 4, then 2, then every frame.
    const order: number[] = [];
    const seen = new Set<number>();
    for (const stride of [8, 4, 2, 1]) {
      for (let i = 0; i < count; i += stride) {
        if (!seen.has(i)) {
          seen.add(i);
          order.push(i);
        }
      }
    }

    const CONCURRENCY = priority ? 8 : 4;
    let cursor = 0;

    const loadNext = (): void => {
      if (cancelled || cursor >= order.length) return;
      const index = order[cursor++];
      const img = new Image();
      img.decoding = "async";
      img.src = `${basePath}/${String(index).padStart(4, "0")}.webp`;

      img.onload = () => {
        if (cancelled) return;
        framesRef.current[index] = img;
        onFrameLoad?.();
        loadNext();
      };
      // A single missing frame must not stall the sequence — `nearest()` falls
      // back to the closest neighbour that did load.
      img.onerror = () => {
        if (!cancelled) loadNext();
      };
    };

    for (let i = 0; i < CONCURRENCY; i++) loadNext();

    return () => {
      cancelled = true;
    };
  }, [basePath, count, priority, onFrameLoad]);

  /** Nearest loaded frame to `index`, or null if nothing has loaded yet. */
  const nearest = useCallback(
    (index: number): HTMLImageElement | null => {
      const frames = framesRef.current;
      const clamped = Math.max(0, Math.min(count - 1, Math.round(index)));
      if (frames[clamped]) return frames[clamped];
      for (let offset = 1; offset < count; offset++) {
        if (frames[clamped - offset]) return frames[clamped - offset];
        if (frames[clamped + offset]) return frames[clamped + offset];
      }
      return null;
    },
    [count],
  );

  return { nearest, count };
}

/**
 * Paint an image into a canvas using object-fit: cover semantics.
 * The hero is full-bleed, so the source is cropped rather than letterboxed.
 */
export function drawCover(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  if (cssW === 0 || cssH === 0) return;

  if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
  }

  const scale = Math.max(cssW / img.width, cssH / img.height);
  const w = img.width * scale;
  const h = img.height * scale;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  ctx.drawImage(img, (cssW - w) / 2, (cssH - h) / 2, w, h);
}

/**
 * Rect of the drawn image inside the canvas, in CSS pixels.
 *
 * Hotspots are positioned against THIS rect, not the canvas box. With cover
 * cropping the two differ, and using the canvas box would drift the hotspots
 * away from the panels at viewport ratios other than 16:9.
 */
export function coverRect(
  canvas: HTMLCanvasElement,
  sourceW: number,
  sourceH: number,
) {
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  const scale = Math.max(cssW / sourceW, cssH / sourceH);
  const w = sourceW * scale;
  const h = sourceH * scale;
  return { left: (cssW - w) / 2, top: (cssH - h) / 2, width: w, height: h };
}
