# PROJECT PROGRESS

## Purpose

This file is the chronological working record for all development agents.

Every agent must update this file after meaningful work.

Never delete historical progress unless explicitly instructed.

---

# CURRENT PROJECT STATUS

## Current Phase

PLAN — audit complete, implementation plan produced, awaiting owner decisions

## Current Feature

None in progress

## Current Agent

Planning/audit session

## Current Status

BLOCKED

## Last Commit

(pending — this entry's commit)

## Last Verified

2026-09-17

## Current Blocker

Six owner decisions D1–D6, recorded in `Reports/Implementation_Plan.md` §9 and
`Brain.md` §18. D1 (recruiting email nullability) and D4 (service credentials) gate the
backend. D2 (verified business facts) and D3 (retention period) gate `/contact`,
`/privacy` and SEO canonical/sitemap.

## Next Action

Obtain D1–D6. Then Phase 0 — Next.js scaffold, Tailwind, shadcn/ui, design tokens derived
from the brand kit.

---

# ACTIVE WORK

## Frontend

Status: Not started
Owner: Frontend Agent
Current task: —
Last completed: Hero asset audit (panel timeline mapped from `clip2fr.zip`)
Next task: Phase 0 scaffold + design tokens
Known issues: `clips/clip3fr.zip` deviates from the brand type/colour system (decision D5)

## Backend

Status: Not started
Owner: Backend Agent
Current task: —
Last completed: —
Next task: Phase 10, after D1 and D4
Known issues: —

## Database

Status: Not started — schema specified in DOC4 §4.31 but not applied
Owner: Database Agent
Current task: —
Last completed: —
Next task: Phase 9, after D1
Known issues: `leads.email` nullability unresolved (D1)

---

# CHANGE LOG

## 2026-09-18 (2)

### Agent

FRONTEND

### Feature

Phases 3–4 — hero sequence, brand resolution, clickable service panels

### Work Completed

- `Hero` renders the full story from the owner-supplied frames: "Have an Idea?"
  holds, the card lifts away like a page to reveal the workstation, six service
  panels emerge and retract, the GENRA brand resolves, the closing card lands.
- Scroll position drives the frame index directly, so the visitor controls the
  sequence in both directions. ScrollTrigger reports progress; pinning is CSS
  `position: sticky` rather than ScrollTrigger's `pin`, which re-parents the
  pinned node and fights React's ownership of the DOM.
- Stage transitions translate upward like a page scroll — no zoom, no fade to
  black, no particles (prompt §8).
- GENRA brand resolution built in DOM from the real mark, because the owner
  supplied no frames for that beat and §12 asks for the brand identity rather
  than another animation frame.
- Six hotspots positioned per frame from the generated timeline, against the
  canvas's cover rect rather than its box, so they stay aligned at any aspect
  ratio. `pointer-events` and `tabIndex` are enabled only while a panel is
  settled — a half-retracted panel is visible but inert.
- `HeroStatic` serves reduced-motion visitors and doubles as the failure mode if
  the timeline cannot load: same six services, same routing, no scrubbing.
- `SmoothScroll` adds Lenis driving GSAP's ticker, disabled entirely under
  reduced motion.
- Progressive frame loading in coarse-to-fine order, so the hero is scrubbable
  before every frame has downloaded and sharpens as it fills in.

### Files Changed

- Added: `src/components/hero/{Hero,HeroStatic}.tsx`
- Added: `src/lib/hero/{timeline,useFrameSequence}.ts`
- Added: `src/components/providers/SmoothScroll.tsx`
- Modified: `src/app/{page,layout}.tsx`

### Verification

- [x] Code reviewed
- [x] Build passed — `npm run build` clean, lint and typecheck clean
- [ ] Tests passed — automated specs land in Phase 13; this phase verified in-browser
- [x] Browser tested
- [x] Responsive tested — no horizontal overflow (`scrollWidth === clientWidth`)
- [ ] API tested — N/A
- [ ] Database verified — N/A
- [x] Regression tested — header, menu and footer re-checked after hero mount

Browser verification performed:
- Opening frame renders full-screen Obsidian with "Have an Idea?"
- Scrubbing verified at multiple scroll positions; panels, brand beat and closing
  card each render at the expected progress
- All six hotspots present with correct routing: five → `/software`,
  one → `/recruiting`
- Exactly ONE hotspot active at any scroll position — zero overlap confirmed at
  runtime, not just in the source material
- Settled panels report `pointer-events: auto` and `tabIndex 0`; emerging and
  retracting panels report `none` and `-1`
- Hover asserted inert per §11: no transform, no box-shadow, no filter, no
  navigation
- `elementFromPoint` at a panel's visual centre returns that panel's anchor,
  confirming the clickable region matches the visible panel

### Bugs Found

1. **ESLint `react-hooks/set-state-in-effect` in the frame loader.** Root cause:
   `ready`/`progress` state was reset synchronously at effect start — and nothing
   consumed either value. Fix: removed the state entirely and kept frames in a
   ref. Loading 150 images would otherwise have triggered 150 re-renders of a
   component that paints imperatively and never reads them during render.

### Bugs Fixed

The above. No defect was found in the hero's scroll or hotspot behaviour — an
apparent pacing fault during verification turned out to be an error in the
measurement probe, which divided by the document's scroll range instead of the
pinned container's. The component was correct.

### Commit

`<pending>`

### Commit Message

`feat(hero): scroll-driven hero sequence with clickable service panels`

### Remaining Work

Phases 5–16 per `Reports/Implementation_Plan.md` §6.

---

## 2026-09-18

### Agent

FRONTEND

### Feature

Phases 0–2 — scaffold, design system, layout shell, hero asset pipeline

### Work Completed

**Phase 0 — scaffold and design system**
- Next.js 16.3.5 (App Router) + React 19.2.8 + TypeScript + Tailwind v4, src/ layout
- Full approved dependency set installed: Motion, GSAP, Lenis, React Hook Form, Zod,
  Supabase, Resend, Lucide, Vitest, Playwright
- Design tokens in `src/app/globals.css` under Tailwind v4 `@theme` — brand palette,
  type scale, radius, motion durations and easings, container widths. No raw values
  outside that block.
- Sora + Inter wired via `next/font`, matching brand kit §4
- `prefers-reduced-motion` handling, brand-consistent `:focus-visible`, skip link
- `.env.example` documenting every variable; `.gitignore` corrected so `.env.example`
  is committed while all real env files stay ignored
- Vitest + Playwright configured (Playwright covers desktop/tablet/mobile projects)

**Phase 1 — layout shell**
- `Header`: logo, primary nav restricted to Software + Recruiting per prompt §5,
  overlay menu holding About + Contact per §37. Transparent over hero, gains a surface
  on scroll. Focus trap, Escape to close, focus restoration, body scroll lock.
- `Footer`: omits contact and social blocks entirely because no verified values exist
- `Logo`: supplied brand mark (never redrawn) + Sora wordmark per brand kit §4
- Branded 404 (`Lost the path?`) and error boundary with safe messaging
- `site.ts` and `services.ts` content modules, shaped for a later Sanity migration

**Phase 2 — hero asset pipeline**
- `scripts/build-hero-assets.mjs` derives delivery assets and the interaction timeline
  from `clips/*.zip`. Source archives are never modified.
- Panel geometry is derived FROM THE FRAMES, not hardcoded and not OCR'd
- Output: 270 frames x 3 width tiers, plus `timeline.json`
- Idempotent; runs as `prebuild`; derived output gitignored

### Files Changed

- Added: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`,
  `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`,
  `.env.example`, `.claude/launch.json`
- Added: `src/app/{layout,page,not-found,error}.tsx`, `src/app/globals.css`
- Added: `src/components/{brand/Logo,navigation/Header,navigation/Footer,sections/BrandStatement}.tsx`
- Added: `src/config/site.ts`, `src/content/services.ts`, `src/lib/utils.ts`
- Added: `scripts/build-hero-assets.mjs`, `public/brand/*`
- Modified: `.gitignore`, `Brain.md`, `Reports/Implementation_Plan.md`

### Verification

- [x] Code reviewed — `git diff` reviewed, no secrets, no unrelated changes
- [x] Build passed — `npm run build` clean
- [x] Tests passed — N/A, no test specs written yet (Phase 13+)
- [x] Browser tested — see below
- [x] Responsive tested — desktop and 375x812 mobile
- [ ] API tested — N/A this phase
- [ ] Database verified — N/A this phase
- [ ] Regression tested — N/A, first feature

Browser verification performed (DOC6 §6.13):
- Homepage renders; typography, palette and spacing match the brand kit
- Header shows ONLY Software + Recruiting, as §5 requires
- Overlay menu opens, lists Software/Recruiting/About/Contact
- Escape closes it; asserted in-browser that the menu hides, `aria-expanded`
  returns to false, focus returns to the trigger, and the body scroll lock releases
- No horizontal overflow at 375px (`scrollWidth === clientWidth`)

### Bugs Found

1. **Overlay menu clipped its own secondary row on short viewports.** At 455px
   height the legal/contact row below the divider was unreachable.
   Root cause: the panel was a fixed-height flex column with no overflow handling.
   Fix: `overflow-y-auto overscroll-contain` on the panel, reduced vertical padding.

2. **Header nav overlapped the logo at 375px.** "Software" rendered on top of the
   GENRA wordmark. Root cause: logo, two nav items and the menu trigger cannot fit
   in 375px. Fix: primary nav is `hidden md:block`; below that navigation is the
   hamburger, per prompt §45. Nothing is lost — the overlay already lists both.

3. **Hero pipeline: static-camera assumption was wrong.** First implementation
   shipped one static workstation "plate" plus per-frame panel crops. A build-time
   assertion caught that clip2 does not return to its reference composition.
   Root cause: the camera slowly pushes in across clip2; the workstation at frame
   300 is measurably larger than at frame 1. Verified by rendering frame 1 against
   frame 300 side by side. Fix: dropped plate-plus-crop, ship full frames, and
   replaced reference-differencing (which the drift contaminates) with absolute
   luminance thresholding plus a workstation exclusion zone, which is invariant to
   the camera move.

4. **Panel run detection returned 4 runs instead of 6.** Root cause: retracting
   panels collapse to a thin bright streak rather than disappearing, and two of the
   five troughs are only ONE frame below threshold — which the one-frame gap
   tolerance absorbed, merging two pairs of panels. Fix: gap tolerance reduced to
   zero and runs split on bounding-box height; humps sit at 90–130 against a
   threshold of 30, so they never split internally. A minimum run length rejects
   noise, which is what the tolerance was actually guarding against.

5. **ESLint `react-hooks/set-state-in-effect`** on the menu's close-on-navigation
   effect. Fix: replaced with React's documented adjust-state-during-render pattern,
   which also covers browser back/forward that the effect handled.

### Bugs Fixed

All five above, each verified after the fix.

### Commit

`<pending>`

### Commit Message

`feat: scaffold GENRA site, design system, layout shell and hero asset pipeline`

### Remaining Work

Phases 3–16 per `Reports/Implementation_Plan.md` §6.

---

## 2026-09-17

### Agent

OTHER (planning/audit)

### Feature

Repository audit and implementation plan — no application code

### Work Completed

- Read `.claude/Claude.md` and all three `.agents/` role files
- Read `Documents/DOC1 IDEA-PRD.md` and `DOC2 PRD-TechStack.md` in full
- Read `DOC3.1 AppLICATION_ARCHITECTURE.md`, `DOC4 DataBase_Design.md`,
  `DOC5 Feauture_specification.md` in full; reviewed DOC6–DOC8 implementation,
  testing and debugging protocols
- Read `Brain.md` and `Reports/Progress.md` (both unfilled templates)
- Inspected the brand kit DOCX, the brand board PNG and all eight logo/icon assets
- Inspected all three hero archives in `clips/`: extracted and examined frames, confirmed
  1920×1080 JPEG sequences with contiguous numbering, no gaps, no duplicates
- Mapped the clip2 six-panel timeline frame by frame (emerge / settle / retract / gone)
  and confirmed zero panel overlap in the source material
- Confirmed the source tree is empty: no `package.json`, no components, no schema applied,
  no API, no tests
- Resolved ten documentation conflicts against the source-of-truth hierarchy
- Produced `Reports/Implementation_Plan.md`
- Filled `Brain.md` with verified current state

### Files Changed

- `Brain.md` (template filled with verified state)
- `Reports/Progress.md` (this entry)
- `Reports/Implementation_Plan.md` (new)

### Verification

- [x] Code reviewed — N/A, no code written
- [x] Build passed — N/A, no build exists
- [x] Tests passed — N/A, no tests exist
- [ ] Browser tested — N/A this phase
- [ ] Responsive tested — N/A this phase
- [ ] API tested — N/A this phase
- [ ] Database verified — N/A this phase
- [ ] Regression tested — N/A this phase

Documentation-only change. No executable code was produced, so no build, test or browser
verification applies. This is recorded honestly rather than ticked off as passed.

### Bugs Found

- `Documents/DOC3 PRD-Application_Architecture.md` is 0 bytes. Superseded by DOC3.1.
  Left in place to preserve project history.

### Bugs Fixed

- None

### Commit

`<pending>`

### Commit Message

`docs: add repository audit and implementation plan, fill project brain`

### Remaining Work

Everything. Seventeen build phases are enumerated in `Reports/Implementation_Plan.md` §6.

---

# HANDOFF NOTES

## Current Task

Awaiting owner decisions D1–D6.

## What Has Been Completed

The mandatory audit and plan phase required by `.claude/Claude.md` §1 and DOC6 §6.35
Rule 4. Nothing else.

## What Remains

The entire application: scaffold, design system, layout shell, hero sequence and clickable
panels, homepage, `/software`, `/recruiting`, `/about`, `/contact`, legal pages, database,
backend, storage, email, forms, SEO, performance, testing and final visual QA.

## Important Context

- This is a greenfield build. No existing architecture had to be preserved or integrated
  with, because none was implemented — but all work must conform to the architecture
  already *specified* in DOC2, DOC3.1 and DOC4.
- The hero animation is supplied as JPEG frame sequences, not video. Panel bounding boxes
  drift between frames, so hotspot geometry must be derived from the frames at build time
  rather than hardcoded. OCR is not required and will not be used.
- No GENRA brand-resolution frames were supplied; that beat must be built in DOM.
- Nothing in the repository establishes any verified client, project, testimonial, metric,
  contact detail or social account. None may be invented.

## Exact Next Step

On receipt of D1–D6, begin Phase 0: `create-next-app` with TypeScript and Tailwind,
configure shadcn/ui, define design tokens from the brand kit values recorded in
`Brain.md` §12, wire Vitest and Playwright. Gate: clean `build` and `typecheck`.
