"use client";

import { useEffect, useRef } from "react";

/**
 * The hero's robot: a small floating figurine whose head and eyes follow the
 * cursor while its body stays still.
 *
 * It is genuinely 3D, not an illustration: one fragment shader raymarches a
 * signed distance field of separate parts (a satin ceramic body, two detached
 * arms, a floating head with a dark glass visor and mint eyes), lit by a soft
 * studio key with real soft shadows, ambient occlusion and a reflected
 * softbox, and casting a contact shadow on an invisible floor. Raw WebGL2, the
 * same approach as the service ring, so no 3D engine is shipped for one object.
 *
 * Parts move independently because they are separate terms in the field:
 *   body + arms  -> only the float offset (a slow vertical drift)
 *   head         -> float + its own rotation (yaw, pitch, a hint of roll)
 *   eyes         -> painted in head space, plus their own offset on the visor
 *
 * Cursor tracking: one passive window listener stores the pointer and maps it
 * to a target look direction relative to the robot's head; the frame loop
 * approaches it with critically damped first-order smoothing (~38ms), so it
 * is immediate, never jitters and never overshoots. Nothing here touches React
 * state after mount. Fine pointers only; on touch the robot simply floats.
 *
 * The loop renders only while the robot is on screen and the tab is visible.
 * The hero never mounts this under reduced motion (it shows the static list).
 */

/** Max head rotation, radians (owner brief: about ±7° across, ±4.5° up/down). */
const YAW = (7 * Math.PI) / 180;
const PITCH = (4.5 * Math.PI) / 180;
const ROLL = 0.18; // fraction of yaw the head tilts into a turn
/** Max eye travel on the visor, in head units (the visor is 0.9 wide). */
const EYE_X = 0.045;
const EYE_Y = 0.03;
/** Smoothing rates (1/s). Tracking is near-instant; returning home is gentle. */
const FOLLOW = 26;
const EYE_FOLLOW = 34;
const RETURN = 4;
/** Float: a slow drift of ~6px. */
const FLOAT = 0.032;
const FLOAT_PERIOD = 4.6;
/** Device pixels the raymarch may cover per frame: enough for a full-DPR
    robot on a retina laptop. Slower GPUs are scaled down at runtime. */
const PIXEL_BUDGET = 1_000_000;
/** Adaptive resolution: if frames average slower than this the render scale
    drops by a step (never below MIN_SCALE); with headroom it climbs back. */
const SLOW_FRAME = 1 / 45;
const FAST_FRAME = 1 / 57;
const MIN_SCALE = 0.55;

const VERT = /* glsl */ `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos * 2.0 - 1.0, 0.0, 1.0); }`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
out vec4 fragColor;

uniform vec2  uResolution;  // device px
uniform float uFloat;       // body lift, world units
uniform mat3  uHead;        // world -> head-space rotation
uniform vec2  uEye;         // eye offset on the visor, head units

const vec3  PIVOT  = vec3(0.0, 0.80, 0.0); // head centre, also its pivot
const float GROUND = -1.50;
const float FOCAL  = 2.2;   // uv spans 1.0 vertically: ~26 degree field of view

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

// Round cone along +y: radius r1 at y = 0, r2 at y = h.
float sdRoundCone(vec3 p, float r1, float r2, float h) {
  float b = (r1 - r2) / h;
  float a = sqrt(1.0 - b * b);
  vec2 q = vec2(length(p.xz), p.y);
  float k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - r1;
  if (k > a * h) return length(q - vec2(0.0, h)) - r2;
  return dot(q, vec2(a, b)) - r1;
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
float smax(float a, float b, float k) { return -smin(-a, -b, k); }

// Body: an inverted egg, slightly flattened front to back, with a flat,
// softly rounded top for the head to hover over and a fine waist seam.
float body(vec3 p) {
  vec3 q = vec3(p.x, 0.05 - p.y, p.z / 0.86);
  float d = sdRoundCone(q, 0.64, 0.17, 1.0) * 0.86;
  d = smax(d, p.y - 0.30, 0.10);
  d = smax(d, -(length(p - vec3(0.0, 1.36, 0.0)) - 1.07), 0.04);
  d += 0.0035 * (1.0 - smoothstep(0.0, 0.014, abs(p.y + 0.16)));
  return d;
}

float arm(vec3 p, float side) {
  vec3 q = p - vec3(side * 0.77, -0.30, 0.02);
  float a = side * 0.16;
  q.xy = mat2(cos(a), sin(a), -sin(a), cos(a)) * q.xy;
  return sdEllipsoid(q, vec3(0.10, 0.40, 0.14));
}

// x: distance, y: material (1 body, 2 visor, 3 arm or head shell),
// z: visor - head (for the rim)
vec3 head(vec3 p) {
  vec3 q = uHead * (p - PIVOT);
  float h = sdEllipsoid(q, vec3(0.56, 0.42, 0.50));
  // The visor is a glass face plate standing slightly proud of the shell.
  float v = sdEllipsoid(q - vec3(0.0, -0.02, 0.15), vec3(0.47, 0.29, 0.40));
  return vec3(smin(h, v, 0.012), v < h ? 2.0 : 3.0, v - h);
}

vec3 map(vec3 p) {
  p.y -= uFloat;
  vec3 res = vec3(body(p), 1.0, 1.0);
  float a = min(arm(p, 1.0), arm(p, -1.0));
  if (a < res.x) res = vec3(a, 3.0, 1.0);
  vec3 h = head(p);
  if (h.x < res.x) res = h;
  return res;
}

vec3 normalAt(vec3 p) {
  const vec2 e = vec2(0.0007, -0.0007);
  return normalize(
    e.xyy * map(p + e.xyy).x + e.yyx * map(p + e.yyx).x +
    e.yxy * map(p + e.yxy).x + e.xxx * map(p + e.xxx).x);
}

float softShadow(vec3 ro, vec3 rd) {
  float res = 1.0, t = 0.02;
  for (int i = 0; i < 28; i++) {
    float h = map(ro + rd * t).x;
    res = min(res, 10.0 * h / t);
    t += clamp(h, 0.015, 0.18);
    if (res < 0.003 || t > 2.5) break;
  }
  return clamp(res, 0.0, 1.0);
}

float occlusion(vec3 p, vec3 n) {
  float occ = 0.0, sca = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.012 + 0.06 * float(i);
    occ += (h - map(p + n * h).x) * sca;
    sca *= 0.9;
  }
  return clamp(1.0 - 2.2 * occ, 0.0, 1.0);
}

// A quiet photo studio: bright ceiling, warm floor bounce, one large
// softbox up and to the left, a thin strip light behind on the right.
vec3 studio(vec3 r) {
  vec3 col = mix(vec3(0.60, 0.59, 0.56), vec3(0.97, 0.97, 0.96), smoothstep(-0.3, 0.6, r.y));
  col += 1.5 * smoothstep(0.86, 0.96, dot(r, normalize(vec3(-0.55, 0.65, 0.55))));
  col += 0.5 * smoothstep(0.93, 0.99, dot(r, normalize(vec3(0.85, 0.2, -0.3))));
  return col;
}

vec3 shade(vec3 pos, vec3 n, vec3 rd, vec3 m) {
  vec3 v = -rd;
  vec3 l = normalize(vec3(-0.5, 0.85, 0.55));
  vec3 hv = normalize(l + v);
  float sh = softShadow(pos + n * 0.004, l);
  float ao = occlusion(pos, n);
  float wrap = clamp((dot(n, l) + 0.3) / 1.3, 0.0, 1.0);
  float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 5.0);
  vec3 env = studio(reflect(rd, n));
  vec3 col;

  if (abs(m.y - 2.0) > 0.5) {
    // Satin ceramic shell. A warm bounce from the floor keeps undersides
    // (the chin, the base of the body) from going black.
    vec3 albedo = vec3(0.86, 0.855, 0.84);
    vec3 sky = mix(vec3(0.80, 0.79, 0.76), vec3(0.95, 0.97, 1.0), 0.5 + 0.5 * n.y);
    vec3 bounce = vec3(0.95, 0.92, 0.86) * clamp(-n.y, 0.0, 1.0);
    col = albedo * (1.2 * wrap * mix(0.4, 1.0, sh) * vec3(1.0, 0.98, 0.95)
        + 0.5 * mix(0.45, 1.0, ao) * sky + 0.24 * bounce);
    col += 0.18 * pow(clamp(dot(n, hv), 0.0, 1.0), 60.0) * sh;
    col += env * (0.04 + 0.30 * fres) * ao;
    // The waist seam, a fine mint line (the only colour on the shell).
    float seam = 1.0 - smoothstep(0.004, 0.009, abs(pos.y - uFloat + 0.16));
    seam *= step(m.y, 1.5);
    col = mix(col, vec3(0.034, 0.62, 0.30) * (0.55 + 0.45 * wrap), seam * 0.9);
    // Edges read against the ivory page, and the visor rim reads as a seam.
    col *= mix(1.0, 0.9, fres);
    col *= mix(0.86, 1.0, smoothstep(0.0, 0.012, abs(m.z)));
  } else {
    // Dark glass visor with the eyes behind it.
    col = vec3(0.006, 0.007, 0.009);
    vec3 q = uHead * (pos - vec3(0.0, uFloat, 0.0) - PIVOT);
    vec2 e = q.xy - vec2(0.0, -0.01) - uEye;
    float d1 = length((e - vec2(-0.165, 0.0)) / vec2(0.068, 0.085));
    float d2 = length((e - vec2( 0.165, 0.0)) / vec2(0.068, 0.085));
    float dd = min(d1, d2);
    vec3 mint = vec3(0.034, 0.651, 0.319);
    float eye = 1.0 - smoothstep(0.86, 1.0, dd);
    col = mix(col, mint * 1.15 + vec3(0.06, 0.12, 0.09) * (1.0 - dd), eye);
    col += mint * 0.08 * (1.0 - smoothstep(1.0, 2.4, dd));
    float fv = 0.04 + 0.96 * fres;
    col += env * fv * 0.55;
    col += 0.9 * pow(clamp(dot(n, hv), 0.0, 1.0), 220.0) * sh;
  }
  return col;
}

vec3 aces(vec3 x) {
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}

// Ray against the box that bounds the robot at any float height.
vec2 bounds(vec3 ro, vec3 rd) {
  vec3 lo = vec3(-1.0, -1.25 + uFloat, -0.75);
  vec3 hi = vec3( 1.0,  1.30 + uFloat,  0.75);
  vec3 inv = 1.0 / rd;
  vec3 t0 = (lo - ro) * inv, t1 = (hi - ro) * inv;
  vec3 tmin = min(t0, t1), tmax = max(t0, t1);
  return vec2(max(max(tmin.x, tmin.y), tmin.z), min(min(tmax.x, tmax.y), tmax.z));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  vec3 ro = vec3(0.0, 0.55, 7.0);
  vec3 ta = vec3(0.0, -0.22, 0.0);
  vec3 fw = normalize(ta - ro);
  vec3 rt = normalize(cross(fw, vec3(0.0, 1.0, 0.0)));
  vec3 up = cross(rt, fw);
  vec3 rd = normalize(uv.x * rt + uv.y * up + FOCAL * fw);
  float pxa = 1.0 / (FOCAL * uResolution.y * 0.5) * 0.5; // world size of a pixel per unit distance

  // Contact shadow on the floor: wider and lighter the higher the body floats.
  float floorShadow = 0.0;
  if (rd.y < 0.0) {
    vec3 g = ro + rd * ((GROUND - ro.y) / rd.y);
    float lift = (-1.12 + uFloat) - GROUND;
    float radius = 0.40 + lift * 0.55;
    float strength = 0.16 * clamp(0.38 / lift, 0.6, 1.4);
    floorShadow = strength * exp(-2.6 * dot(g.xz, g.xz) / (radius * radius));
  }

  vec2 tb = bounds(ro, rd);
  float coverage = 0.0;
  vec3 col = vec3(0.0);
  if (tb.x < tb.y && tb.y > 0.0) {
    float t = max(tb.x, 0.0);
    float best = 1e9, tBest = t;
    bool hit = false;
    vec3 m = vec3(0.0);
    for (int i = 0; i < 96; i++) {
      m = map(ro + rd * t);
      float px = m.x / (t * pxa);
      if (px < best) { best = px; tBest = t; }
      if (px < 0.35) { hit = true; break; }
      t += m.x * 0.92;
      if (t > tb.y) break;
    }
    // Silhouette anti-aliasing: a ray that passes within a pixel of the
    // surface still covers part of it, shaded at its closest approach.
    coverage = hit ? 1.0 : 1.0 - smoothstep(0.35, 1.0, best);
    if (coverage > 0.0) {
      vec3 pos = ro + rd * (hit ? t : tBest);
      vec3 mm = map(pos);
      col = shade(pos, normalAt(pos), rd, mm);
      col = pow(aces(col * 1.05), vec3(1.0 / 2.2));
    }
  }

  float shadowA = floorShadow * (1.0 - coverage);
  float a = coverage + shadowA;
  if (a <= 0.001) discard;
  fragColor = vec4(col * (coverage / a), a);
}`;

function build(gl: WebGL2RenderingContext) {
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERT],
    [gl.FRAGMENT_SHADER, FRAG],
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

/** World -> head-space rotation (the inverse of the head's own rotation),
    column-major for uniformMatrix3fv. */
function headMatrix(yaw: number, pitch: number, roll: number, out: Float32Array) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const cr = Math.cos(roll), sr = Math.sin(roll);
  // Head rotation R = Ry(yaw) * Rx(-pitch) * Rz(roll): +yaw turns the face
  // toward +x (screen right), +pitch lifts it toward +y (up).
  const ry = [cy, 0, -sy, 0, 1, 0, sy, 0, cy]; // columns of Ry
  const rx = [1, 0, 0, 0, cp, -sp, 0, sp, cp]; // columns of Rx(-pitch)
  const rz = [cr, sr, 0, -sr, cr, 0, 0, 0, 1]; // columns of Rz(roll)
  const mul = (a: number[], b: number[]) => {
    const o = new Array<number>(9);
    for (let c = 0; c < 3; c++)
      for (let r = 0; r < 3; r++)
        o[c * 3 + r] =
          a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2];
    return o;
  };
  const R = mul(mul(ry, rx), rz);
  // Inverse of a rotation is its transpose.
  for (let c = 0; c < 3; c++)
    for (let r = 0; r < 3; r++) out[c * 3 + r] = R[r * 3 + c];
}

export function HeroRobot({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;
    const program = build(gl);
    if (!program) return;

    // ponytail: renderer-string sniff. Without graphics hardware (a software
    // rasteriser) a continuous raymarch would load the CPU, so the robot holds
    // still and redraws only while its head is moving.
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    const software = /swiftshader|llvmpipe|software|basic render/i.test(renderer);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);
    const uRes = gl.getUniformLocation(program, "uResolution");
    const uFloat = gl.getUniformLocation(program, "uFloat");
    const uHead = gl.getUniformLocation(program, "uHead");
    const uEye = gl.getUniformLocation(program, "uEye");

    // --- size -------------------------------------------------------------
    let quality = 1; // render scale, lowered at runtime on slow GPUs
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w * h * dpr * dpr > PIXEL_BUDGET) dpr = Math.sqrt(PIXEL_BUDGET / (w * h));
      dpr *= quality;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    const sizer = new ResizeObserver(resize);
    sizer.observe(canvas);

    // --- pointer ----------------------------------------------------------
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    let pointerX = 0;
    let pointerY = 0;
    let tracking = false;
    let targetX = 0; // -1..1, + is right
    let targetY = 0; // -1..1, + is up

    const aim = () => {
      if (!tracking) return;
      // Relative to the robot's head, scaled by the viewport so the head
      // reaches its limit about halfway to the screen edge.
      const box = canvas.getBoundingClientRect();
      const hx = box.left + box.width / 2;
      const hy = box.top + box.height * 0.3;
      targetX = Math.tanh(((pointerX - hx) / (window.innerWidth * 0.42)) * 1.2);
      targetY = Math.tanh(((hy - pointerY) / (window.innerHeight * 0.45)) * 1.2);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !fine.matches) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      tracking = true;
      aim();
      wake();
    };
    const onLeave = () => {
      tracking = false;
      targetX = 0;
      targetY = 0;
      wake();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", aim, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    // --- loop -------------------------------------------------------------
    const head = new Float32Array(9);
    let lookX = 0;
    let lookY = 0;
    let eyeX = 0;
    let eyeY = 0;
    let frame = 0;
    let previous = 0;
    let start = 0;
    let visible = true;
    let running = false;
    let shown = false;
    let sampleTime = 0;
    let sampleFrames = 0;

    const draw = (now: number) => {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      frame = requestAnimationFrame(draw);
      if (!start) start = now;
      const dt = previous ? Math.min((now - previous) / 1000, 0.1) : 0;
      previous = now;

      // ponytail: frame interval as a GPU-load proxy; a real GPU timer query
      // (EXT_disjoint_timer_query_webgl2) if this proves too coarse.
      if (dt > 0) {
        sampleTime += dt;
        if (++sampleFrames === 60) {
          const avg = sampleTime / sampleFrames;
          const next =
            avg > SLOW_FRAME
              ? Math.max(MIN_SCALE, quality * 0.8)
              : avg < FAST_FRAME
                ? Math.min(1, quality * 1.1)
                : quality;
          if (Math.abs(next - quality) > 0.01) {
            quality = next;
            resize();
          }
          sampleTime = 0;
          sampleFrames = 0;
        }
      }

      // Critically damped first-order approach: no overshoot, ~38ms time constant
      // while tracking, a calmer return when the cursor leaves.
      const rate = tracking ? FOLLOW : RETURN;
      const k = 1 - Math.exp(-dt * rate);
      const ke = 1 - Math.exp(-dt * (tracking ? EYE_FOLLOW : RETURN));
      lookX += (targetX - lookX) * k;
      lookY += (targetY - lookY) * k;
      eyeX += (targetX - eyeX) * ke;
      eyeY += (targetY - eyeY) * ke;

      const t = (now - start) / 1000;
      const lift = software
        ? 0
        : FLOAT * Math.sin((t / FLOAT_PERIOD) * Math.PI * 2) +
          FLOAT * 0.18 * Math.sin((t / (FLOAT_PERIOD * 0.47)) * Math.PI * 2 + 1.3);

      headMatrix(lookX * YAW, lookY * PITCH, -lookX * YAW * ROLL, head);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uFloat, lift);
      gl.uniformMatrix3fv(uHead, false, head);
      gl.uniform2f(uEye, eyeX * EYE_X, eyeY * EYE_Y);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!shown) {
        shown = true;
        canvas.dataset.ready = "";
      }

      const settling =
        Math.abs(targetX - lookX) + Math.abs(targetY - lookY) +
        Math.abs(targetX - eyeX) + Math.abs(targetY - eyeY);
      if (software && settling < 0.002) {
        cancelAnimationFrame(frame);
        running = false;
      }
    };
    const wake = () => {
      if (running || !visible || document.hidden) return;
      running = true;
      previous = 0;
      frame = requestAnimationFrame(draw);
    };
    const seen = new IntersectionObserver(([record]) => {
      visible = record?.isIntersecting ?? true;
      wake();
    });
    seen.observe(canvas);
    const onVisibility = () => wake();
    document.addEventListener("visibilitychange", onVisibility);
    wake();

    return () => {
      cancelAnimationFrame(frame);
      running = false;
      sizer.disconnect();
      seen.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", aim);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-robot=""
      className={
        "pointer-events-none opacity-0 transition-opacity duration-500 ease-[var(--ease-genra)] data-[ready]:opacity-100 " +
        (className ?? "")
      }
    />
  );
}
