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

## 2026-09-18 (5)

### Agent

FRONTEND

### Feature

Phase 13 — recruiting and project forms, plus the Playwright E2E suite

### Work Completed

- `ResumeUpload` — drag-and-drop layered over a real `<input type="file">`, so
  keyboard and assistive-technology users keep the native picker. PDF only,
  10 MB. Client checks are for feedback; the server re-validates.
- `RecruitingForm` — sections per DOC5 §5.7, name and email required, everything
  else optional. Consent states plainly that submitting does not guarantee
  employment or placement.
- `ProjectForm` — dropdown sourced from `content/services.ts` so it cannot drift
  from the catalog. The conditional "Other" field is UNMOUNTED when not
  selected, not hidden, because a hidden input still submits.
- Forms mounted inline at their conversion points: the project form in the
  homepage and `/software` final CTA (§30 asks for "Start a Project → project
  form" with no extra click), the recruiting form at `/recruiting#apply`.
- E2E suite: `navigation.spec.ts`, `hero.spec.ts`, `forms.spec.ts`.

### Verification

- [x] Code reviewed
- [x] Build passed — build, lint, typecheck clean
- [x] Tests passed — **30 unit + 84 E2E across desktop, tablet and mobile**
- [x] Browser tested
- [x] Responsive tested — all three viewports in CI, no horizontal overflow
- [ ] API tested — still NOT verified end to end (no credentials, D4)
- [ ] Database verified — still NOT verified
- [x] Regression tested — full suite green after every fix

E2E now covers the §66–§68 requirements directly: all six hero panels route
correctly, exactly one panel is ever active, a settled panel clicks through,
hover produces no transform/glow/navigation, Enter activates a focused panel,
reduced motion yields the full static hero, the dropdown holds exactly the
approved catalog, Other appears and its stale value is removed, and the resume
input rejects non-PDF and oversized files.

### Bugs Found

1. **E2E ran against the dev server, not a production build.** 12 of 29 tests
   failed with `main h1` = 0 and a non-interactive menu — hydration had not
   completed because Next was compiling routes on demand under three parallel
   workers. Root cause: `reuseExistingServer` picked up the dev server already
   on port 3000. Stopping it dropped failures from 12 to 3. Not an app defect.

2. **Two test bugs, not app bugs.** `getByRole("alert")` matched both the form
   error and Next's route announcer, and the contact radio is `sr-only` inside
   its label so Playwright could not click the input directly. Fixed by scoping
   the alert query to the form and clicking the label, which is what a real user
   does. The app behaviour was correct in both cases.

3. **Tablet project could not run at all.** `devices["iPad (gen 7)"]` defaults to
   WebKit, which was not installed — it reported as failures rather than a
   missing browser. Since the requirement is viewport coverage, tablet now runs
   on Chromium at an iPad viewport with touch emulated, with a note on how to
   add real WebKit later.

### Commit

`<pending>`

### Remaining Work

Performance pass and final visual QA. Then end-to-end verification of the submit
path, which remains blocked on credentials.

---

## 2026-09-18 (4)

### Agent

BACKEND + DATABASE + FRONTEND

### Feature

Phases 9–13 — database, backend, storage, email, spam protection, contact form

### Work Completed

**Database** — `supabase/migrations/0001_init.sql` implements DOC4 §4.31 and
§4.32 verbatim: seven tables, thirteen indexes, UUID keys, CHECK constraints on
`lead_type`, `status` and `consent_status`, and an `updated_at` trigger. The four
outreach tables DOC4 §4.4 defers are deliberately not created.

RLS is enabled on every table with **no policy**, which denies anon and
authenticated everything — correct here because the app has no public accounts
and all access is server-side. Default grants are also revoked as a second layer.
The resume bucket is created private with a 10 MB limit and `application/pdf` as
the only permitted MIME type.

**Backend**
- `lib/db/client.ts` — service-role client behind a `server-only` import, so a
  stray import into a Client Component fails the build rather than shipping the
  key to the browser.
- `lib/security/turnstile.ts` — server-side token exchange with Cloudflare.
  Fails closed when unconfigured.
- `lib/security/rateLimit.ts` — fixed-window limiter, with its per-instance
  limitation documented rather than implied.
- `lib/email/notify.ts` — Resend notification and optional confirmation. Both
  return results instead of throwing, so email failure cannot lose a lead.
- `lib/actions/submitLead.ts` — three server actions following DOC5 §5.19.

**Forms**
- `Turnstile` implemented directly against Cloudflare's script, no wrapper dep
- `Field` primitives with labels, `aria-describedby`, `aria-invalid`, `role=alert`
- `ContactForm` with topic selection driving dynamic fields
- `/contact` page

### Verification

- [x] Code reviewed
- [x] Build passed — build, lint, typecheck clean; all 8 routes compile
- [x] Tests passed — 30 unit tests
- [x] Browser tested — form renders, 0 unlabelled controls, topic switch
      verified to change both the message label and the consent text
- [x] Responsive tested
- [ ] **API tested — NOT VERIFIED END-TO-END**
- [ ] **Database verified — NOT VERIFIED**
- [ ] Regression tested — pending for the submit path

**This is the honest state:** no Supabase, Resend or Turnstile credentials exist
(owner decision D4), so the migration has never been applied and no submission
has ever been written, uploaded or emailed. The code is complete and typechecked
but the integration is unproven. It must not be reported as working until keys
are supplied and a real submission is traced end to end.

Because Turnstile fails closed, the form currently states plainly that it cannot
accept submissions rather than appearing functional and failing on submit.

### Security notes

- Server re-validates with the same Zod schema; nothing from the client trusted
- Turnstile verified server-side; a token is never treated as proof
- Resume validated by MIME, size, extension AND leading `%PDF-` bytes, since a
  declared content type is attacker-controlled
- Filename sanitised; storage path built server-side from the lead id so a
  crafted name cannot escape its prefix
- No transaction available in supabase-js, so a failed detail insert triggers a
  compensating delete of the parent lead, avoiding the partial state DOC5 §5.20
  warns about
- Resume contents never emailed and never logged
- Error messages are generic; no database detail or ids reach the visitor

### Commit

`<pending>`

### Remaining Work

Phase 13 (recruiting and project forms as dedicated components), 14 (SEO:
sitemap, robots), 15 (performance), 16 (final visual QA), plus the Playwright E2E
suite. Then end-to-end verification once credentials exist.

---

## 2026-09-18 (3)

### Agent

FRONTEND

### Feature

Phase 5 — homepage sections 3–12

### Work Completed

Built the remaining homepage sections in exactly the order prompt §6 specifies.
Every one is typography-led: no card grids, no icon rows, no statistics, no
stock imagery, per §6, §50 and §52.

- `SplitSection` (§13) — "One company / Two directions" as a full-bleed editorial
  split divided by a single hairline. Not a two-card grid. The divider is
  horizontal on mobile and vertical from md up, so the idea survives the
  breakpoint.
- `WhatWeBuild` (§14) — the nine-service catalog as a refined index: number,
  title, supporting line per row. The number column carries the rhythm icons
  would otherwise have to. Service 09 routes to `/recruiting`, not `/software`.
- `Process` (§19) — five steps marked along one continuous journey line,
  horizontal on desktop and vertical on mobile. No icon cards.
- `Capabilities` (§21) — six capability categories as text on a hairline grid.
  No technology logo wall. No framework is named.
- `SelectedWork` (§22) — wired to `content/projects.ts` and renders NOTHING
  while that array is empty, which it is. See Bugs/Notes below.
- `WorkThatMoves` (§23) — brand statement, typography-led, one mint hairline.
- `RecruitingIntro` (§24) — CTA is "Explore Recruiting", never "Start a Project".
- `AboutPreview` (§6 item 11) — no history, team or founder claims.
- `FinalCTA` (§30) — "Let's build something." with the Start a Project CTA.
- `Reveal` — shared scroll-reveal primitive.

### Files Changed

- Added: `src/components/ui/Reveal.tsx`
- Added: `src/components/sections/{SplitSection,WhatWeBuild,Process,Capabilities,SelectedWork,WorkThatMoves,RecruitingIntro,AboutPreview,FinalCTA}.tsx`
- Added: `src/content/projects.ts`
- Modified: `src/app/page.tsx`, `src/app/layout.tsx`, `src/components/sections/BrandStatement.tsx`

### Verification

- [x] Code reviewed
- [x] Build passed — build, lint and typecheck clean
- [ ] Tests passed — automated specs are Phase 13
- [x] Browser tested
- [x] Responsive tested — desktop and 375x812, no horizontal overflow
- [ ] API tested — N/A
- [ ] Database verified — N/A
- [x] Regression tested — hero, header, menu re-checked after sections mounted

Browser verification:
- Heading hierarchy asserted: exactly one `h1`, section `h2`s, nested `h3`s
- All nine sections render in §6 order
- Reveal state asserted per section at several scroll positions

### Bugs Found

1. **Scroll reveals could leave content permanently invisible.** A section the
   visitor jumped past — scroll restoration on reload, back navigation, an
   anchor link — stayed at `opacity: 0` with no way to recover. Reproduced by
   jumping to 7x viewport height: "Two directions" measured `opacity: 0` while
   sitting above the viewport.
   Root cause: IntersectionObserver, and therefore Motion's `whileInView`, only
   fires when the intersection STATE changes. A jump moves an element from below
   the viewport to above it between two frames; both states are "not
   intersecting", so no callback fires at all.
   First fix attempt was insufficient — a hand-rolled observer that checked
   position inside its callback, which for this case never ran a second time.
   Re-tested, still hidden. Final fix: an rAF-throttled position check on scroll
   and resize, which cannot be skipped regardless of how the visitor arrived.
   Verified: the jumped-past section now reveals, and sections still below the
   fold correctly stay hidden.
   Also added a `<noscript>` rule forcing `[data-reveal]` visible, so content
   never depends on the animation system at all (DOC5 §5.34).

2. **Process journey line was invisible and the markup was invalid.** The line
   sat at `z-index: -10` inside an `<ol>` whose `relative` does not create a
   stacking context, so it painted behind the section background. The same
   element was a `<span>` as a direct child of `<ol>`, which is invalid — only
   `<li>` is permitted, and the list reported 6 children for 5 steps.
   Fix: moved the line onto a wrapper around the `<ol>` and dropped the negative
   z-index; the `<ol>` is positioned and later in DOM order, so steps paint above
   it without any z-index. Verified: 5 children, all `<li>`, line visible.

3. **Second `h1` on the page.** `BrandStatement` carried an `h1` alongside the
   hero's. Fix: demoted to `h2` and gave the scrubbing hero an `sr-only` `h1` —
   its content is painted to a canvas, which carries no semantics, so without it
   the document opened on an `h2`.

### Notes

`SelectedWork` renders nothing rather than showing an empty section. §22 permits
either omitting it or shipping an empty structural section; an empty-but-visible
section reads as broken to a visitor, and a populated one would be fabricated.
The component and layout exist and are wired to `projects`, so adding one
verified entry makes the section appear with no markup change.

### Commit

`<pending>`

### Commit Message

`feat(home): add homepage sections per prompt section 6`

### Remaining Work

Phases 6–16 per `Reports/Implementation_Plan.md` §6. Next: `/software`.

---

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
