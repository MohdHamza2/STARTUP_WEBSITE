# PROJECT PROGRESS

## Purpose

This file is the chronological working record for all development agents.

Every agent must update this file after meaningful work.

Never delete historical progress unless explicitly instructed.

---

# CURRENT PROJECT STATUS

## Current Phase

Major visual revision complete (light theme, Molten Ring hero, image-led page
heroes). Backend still blocked on owner input for end-to-end verification.

## Current Feature

None in progress. Revision of 2026-10-03 committed — see change-log entry (12) and
`Brain.md` §26.

## Current Agent

FRONTEND (lead) + BACKEND + DATABASE (coordinated recruiting-contact change)

## Current Status

COMPLETE (revision) / BLOCKED (backend verification — owner input)

## Last Commit

`3fb0d11` — the 2026-10-03 site revision (with `d9a59ad` skill setup / design records,
`19329a7` recruiting phone-required, and the docs commit that follows). See entry 12.

## Last Verified

2026-10-04 — typecheck and lint clean; production build clean; 34 unit tests; E2E
127 passed / 2 skipped (129); hero robot checked at 5 desktop sizes and on a
hardware GPU (60fps).

## Current Blocker

1. Migration `supabase/migrations/0001_init.sql` is not applied (`Brain.md` §18 A).
   Apply the CURRENT file — it now makes `leads.email` nullable with a contact CHECK.
2. `RESEND_FROM` is a gmail.com address, which Resend cannot send from (§18 B).
3. Business facts are still missing (§18 D).

## Next Action

The owner resolves 1–2; the agent then traces a real submission for all three forms
(including a phone-only recruiting lead and the duplicate path) and adds submit-path
E2E. Separately: check the hero on a real phone and tablet.

---

# ACTIVE WORK

## Frontend

Status: Complete. Light theme, Molten Ring hero, /software and /recruiting heroes.
Last completed: 2026-10-03 revision (entry 12).
Known gap: touch feel and low-end GPU frame rate untested on physical devices.

## Backend

Status: Code complete; never executed against real services.
Changed 2026-10-03: recruiting phone required / email optional; duplicate detection
by email or phone; confirmation email only when an email exists.
Known issues: `RESEND_FROM` unusable; the rate limiter is per-instance.

## Database

Status: Migration written, NOT applied. Amended 2026-10-03 (nullable email +
`leads_contact_check`).
Next task: apply it; verify the tables, the private bucket, and anon denial.

---

# CHANGE LOG

## 2026-10-04 (15)

### Agent

FRONTEND

### Task

Owner brief (with a monkey reference for the interaction and two robot
references for the silhouette): add a genuinely 3D robot to the centre of the
hero, body static and floating, head and eyes following the cursor subtly and
immediately; make the hero a balanced text | robot | carousel composition;
give the carousel cards subtly rounded corners and a shadow that moves with
the active card; desktop first, mobile unchanged.

### Changes

- New `src/components/hero/HeroRobot.tsx`: raymarched WebGL2 robot built from
  separate parts (body, arms, floating head, glass visor, mint eyes), studio
  lighting with soft shadows, AO and a contact shadow; critically damped head
  and eye tracking; float; adaptive render scale; software-renderer guard.
- `ServiceHero.tsx`: three equal zones from 1024px; the ring is measured into
  the right zone; robot mounted in the centre zone only at that width.
- `molten-ring-carousel.tsx`: ~10px card corners and a front-card shadow drawn
  in the shader that hands over between cards.
- E2E: robot test (position between caption and card; eyes follow the cursor,
  measured by the mint eye centroid; absent below 1024px); ring canvas
  selected with `:not([data-robot])`; resume tests retry the attach.
- DESIGN.md (three compositions, hero shadow/corner exceptions, The Robot),
  Brain.md §14, §20, §29.

### Verification

- [x] Typecheck, lint clean; unit 34 passed; production build clean
- [x] E2E 127 passed, 2 skipped (129), desktop + tablet + mobile
- [x] Visual: 1920x1080, 1440x900, 1366x768, 1280x720, 1024x768 balanced, no
      overlaps; 768x1024 and 390x844 unchanged (no robot)
- [x] Hardware GPU (AMD Radeon 740M, DPR 2): steady 60fps (median and p95
      16.7ms), robot at full sharpness
- [x] Impeccable detector: 0 findings on hero and ui components
- [ ] Physical touch devices; mobile robot interaction is a future task

### Bugs Found / Fixed

- Build failure from a stale Turbopack cache (`.next/cache/turbopack`), fixed
  by clearing it.
- Hero paint test matched two canvases once the robot existed; fixed selector.

### Commit

See the commit following this entry (`feat(hero): 3D cursor-aware robot and three-zone composition`).

## 2026-10-04 (14)

### Agent

FRONTEND

### Task

Owner refinement (with screenshots): make the hero carousel cards independent
with real space between them (no connecting shapes, no image-to-image fades),
keep the animation and composition; reduce the vertical gaps between homepage
sections moderately; add a very subtle tonal variation between sections; avoid
em dashes in copy; verify across devices.

### Changes

- `molten-ring-carousel.tsx`: new `liquid` prop (default true keeps the
  supplied behaviour). Off: no fusion, strands, cursor fusion, wobble or ripple;
  1px art edge instead of a crossfade; arrival starts 75% gathered (never
  stacked); cursor lean/swell damped to 35%; gap 7.5% of stage height (24 to
  72px) held on the inside of the curve.
- `ServiceHero.tsx`: `liquid={false}`, `glass={false}`, card height 0.54
  (side by side) / 0.56 (stacked), stacked stage 24px below the caption.
- `globals.css`: `--color-mist` (#EEEDE9, Ivory + 4% Graphite) and the
  `section-y` rhythm utility (72 to 112px).
- Sections: all post-hero sections (and /software, /recruiting, /about content
  sections, for one consistent rhythm) use `section-y`; BrandStatement lost its
  full-screen height; mist on Process + BrandStatement, RecruitingIntro +
  AboutPreview, /recruiting "how it works", and the footer.
- Copy: em dashes removed from WorkThatMoves, RecruitingIntro, AboutPreview and
  `site.description` (sections touched in this task only).
- DESIGN.md + `.impeccable/design.json`, Brain.md §12, §24, §28.

### Verification

- [x] Typecheck, lint clean; unit 34 passed
- [x] E2E 124 passed, 2 skipped (desktop, tablet, mobile), incl. axe contrast
- [x] Hero screenshots (headless, SwiftShader) at 1920x1080, 1440x900, 1366x768,
      1024x768, 768x1024, 390x844, 844x390: at rest and mid-transition the
      cards are separate with visible gaps, no bridges or fades; no horizontal
      overflow; progression reaches 09
- [x] Post-hero homepage 1440x900: content height ~5,800px (was ~8,200px);
      section tones read as two quiet zones plus the footer
- [x] Impeccable detector: 0 findings on components and CSS
- [ ] Physical devices (touch feel) still unverified

### Commit

See the commit following this entry (`feat(home): separate hero cards, tighten section rhythm, add mist tone`).

## 2026-10-04 (13)

### Agent

Tooling (no app code touched).

### Task

Owner asked for a full agent-skill set covering all agency work (MVP/SaaS, web apps,
business software, portfolios, AI apps, automation, design, animation, graphics).

### Work Completed

- Installed 69 skills at user level (`~/.claude/skills`) via `npx skills add -g`. The
  list and sources are in `Brain.md` §27.
- Wrote `~/.claude/CLAUDE.md`, a skill-routing table for each development step.
  Project docs override skills on conflict. `deploy-to-vercel` needs owner approval.
- Reviewed the bundled scripts: local brainstorm server, Playwright helpers, dependency
  auditor, and a Vercel deploy script that uploads code (gated as noted).

### Files Changed

- `Brain.md` §27 (user-level skills); this file. Global files are outside the repo.

### Verification

Every skill folder has a `SKILL.md`, and every skill named in the routing table
exists on disk or is built in.

### Next Action

Unchanged from the status block above.

## 2026-10-03 (12)

### Agent

FRONTEND (lead), with coordinated BACKEND and DATABASE changes.

### Task

Owner's major visual revision: replace the homepage hero with the supplied
MoltenRingCarousel as a nine-service scroll narrative; light theme site-wide;
distinct image-led /software and /recruiting heroes followed by CTA and form;
recruiting form with optional email. Then install and apply the Impeccable, Vercel
Agent Skills, Taste Skill and Emil Kowalski skill sets.

### Owner decisions (this session)

Recruiting: phone required, email optional (supersedes D1 for that form). Images:
Unsplash, downloaded, committed. Skills: not committed, `skills-lock.json` is.
Positioning "Build + careers, one team"; software-first homepage. Testimonials:
render nothing until real. Design: "The Working Drawing", sentence case, sharp
corners + pill buttons.

### Files Changed (summary)

- New: `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, `skills-lock.json`,
  `assets/images/SOURCES.md`, `public/images/{services,pages}/*.webp` (11),
  `src/components/ui/molten-ring-carousel.tsx`, `src/components/hero/ServiceHero.tsx`,
  `src/components/hero/ServiceHeroStatic.tsx`, `src/components/sections/SoftwareHero.tsx`,
  `src/components/sections/RecruitingHero.tsx`, `src/lib/scroll.ts`,
  `src/lib/utils.test.ts`, `e2e/hero.spec.ts` (rewritten).
- Removed: `src/components/hero/Hero.tsx`, `HeroStatic.tsx`, `src/lib/hero/*`,
  `scripts/build-hero-assets.mjs`, `src/content/testimonials.ts`,
  `src/components/sections/WhatWeBuild.tsx`; packages `gsap`, `motion`; the
  `prebuild` / `hero:build` scripts.
- Modified: `globals.css` (light role tokens, `side`/`short` variants, browser
  surfaces, `text-accent`, `text-action`, scroll padding), every page and section
  component (theme, sentence case, no eyebrows, 4px radii), `Header`, `Footer`,
  `Logo`, forms, `Reveal` (CSS fade, hydration-safe), `SmoothScroll` (Lenis autoRaf,
  registered for `scrollToY`), `FinalCTA` (props), `services.ts` (image data,
  `serviceHref`), `schemas.ts`, `submitLead.ts`, `notify.ts`, `0001_init.sql`,
  `content/recruiting.ts`, privacy copy, `lib/utils.ts`, `playwright.config.ts`
  (SwiftShader), `eslint.config.mjs`, `.gitignore`, `Brain.md`, this file.

### Verification

- [x] Typecheck clean · [x] Lint clean · [x] Production build clean
- [x] Unit: 34 passed
- [x] E2E: 124 passed, 2 skipped (126), desktop + tablet + mobile
- [x] Hero visually checked headless (SwiftShader) at 1920×1080, 1366×768,
      1024×768, 768×1024, 390×844, 844×390 — no horizontal overflow, correct
      progression, release after 09
- [x] Reduced-motion and WebGL-disabled fallbacks: all nine services, images and
      links; no console errors
- [x] /software and /recruiting at 1366×768 and 390×844: one h1, no broken images,
      no overflow
- [x] Impeccable detector: 0 errors; 19 advisories fixed (`text-action` token),
      8 accepted (email inline styles)
- [ ] Physical touch devices — not available to the agent
- [ ] Real submissions — blocked (§18 A, B)

### Bugs Found / Fixed

- `Reveal` hydration mismatch under reduced motion (pre-existing) — fixed.
- `cn()` dropped custom type tokens next to colour classes — fixed + unit test.
- Hero easing was frame-rate dependent (twice as fast at 120Hz, seconds behind at
  low fps) — time-normalised.

### Commits

`d9a59ad` chore(design): agent-skill setup, PRODUCT.md, DESIGN.md
`19329a7` feat(recruiting): require phone, make email optional
`3fb0d11` feat(site): light theme, Molten Ring hero, image-led page heroes
plus a docs commit for Brain.md and this file.

### Remaining Work

Owner: apply migration, usable sender, business facts. Agent: submit-path trace and
E2E; physical-device hero check. Future: the hero's right-side character (out of
scope this session).

## 2026-09-27 (11)

### Agent

FRONTEND + BACKEND (review, repair, handoff)

### Feature

Review of incoming work; encoding repair; full Brain.md rewrite for handoff

### Context

The owner merged `main` into `arsh` (PR #3), asked for a review of everything since
`24ec769`, then asked for Brain.md to be brought fully up to date so the work can
continue from a different account with no access to the chat.

### Work Completed

1. **Reviewed the 6 incoming commits.** Local `arsh` was 6 behind the remote even
   though the owner believed it had been pulled; fast-forwarded (clean tree).
   - `73dfc0e` B1 fix (MohdHamza2) — correct; it fixed a real bug from `21c6c8b`
     (`IDLE` exported from a `"use server"` module broke every Server Action).
   - `df73e65` D4 audit (other agent) — thorough, and honestly recorded as BLOCKED.
   - `f8e1f65` Testimonials (MohdHamza2) — publishes three invented people and quotes
     under "A selection of feedback from clients who have worked with us." Conflicts
     with brief §53, DOC1 §14, DOC2 §37 and DOC3.1 Risk 4. **Not changed** — flagged
     for the owner in `Brain.md` §18 C.
   - Baseline on the merged state: E2E 119 passed / 4 skipped, exit 0.

2. **Found and fixed bug 10 — encoding corruption shipped in `ffa4fc4`.**
   Expected: UTF-8 source with correct punctuation. Actual: 124 double-encoded
   sequences across 22 files (em dash, section sign, ellipsis, en dash, copyright,
   middle dot) plus a UTF-8 BOM on each file. Visible to users: About and Terms body
   copy, the `/recruiting` tab and Open Graph titles, the "Select…" and "Submitting…"
   placeholders, and the header's screen-reader label.
   Root cause: the 2026-09-18 Graphite→Silver bulk replace ran through Windows
   PowerShell 5.1 `Get-Content -Raw` (reads BOM-less UTF-8 as Windows-1252) and
   `Set-Content -Encoding utf8` (writes UTF-8 with a BOM). The 22 files are exactly
   the ones that replace touched.
   Fix: stripped the BOMs; inverted only non-ASCII runs whose Windows-1252 bytes
   decode as valid UTF-8, so correctly-encoded characters added later were left
   untouched; excluded the PNG that `git grep` matched. 124 repaired, equal to the
   enumerated total.
   Verification: zero sequences and zero BOMs remain; for files untouched since, the
   diff against pre-corruption `713e2ac` contains ONLY the intended Graphite→Silver
   change; a browser check on the production build shows correct characters in body
   copy, titles, placeholders and the aria-label.
   Regression guard: `src/lib/encoding.test.ts` (pure ASCII) fails on the corruption
   signatures and on BOMs; confirmed that it catches the committed corrupt files.

3. **Rewrote `Brain.md` completely.** The previous version contradicted itself: it
   listed finished work as pending, said "nothing tested" and "no code exists", called
   D1 unresolved, documented `/api` routes that were never built, and omitted the
   testimonials issue. New sections: §0 resume guide, §15 full bug history with
   lessons, §22 environment gotchas, §23 session history, §24 hero internals, and §25
   a summary of the owner's build brief — which previously existed only in the chat,
   leaving every "prompt §N" reference in the code unresolvable for a new session.

### Files Changed

- 22 source files under `src/app` and `src/components` (encoding only — no logic change)
- Added: `src/lib/encoding.test.ts`
- Commits: `ef53837` (encoding fix + guard), then a separate docs commit
- Rewritten: `Brain.md`
- Updated: `Reports/Progress.md` (status, this entry, handoff notes)

### Verification

- [x] Code reviewed — diff proven equal to the intended change for untouched files
- [x] Build passed
- [x] Tests passed — 33 unit; E2E 119 passed / 4 skipped (123), exit 0
- [x] Browser tested — `/about` and `/recruiting` on the production build
- [x] Responsive tested — via the three-viewport E2E run
- [ ] API tested — not possible (schema not applied)
- [ ] Database verified — not possible (schema not applied)
- [x] Regression tested — identical E2E result before and after the repair

### Bugs Found

- Bug 10 (above). My first draft of the guard test also had an invalid regex range
  (the euro sign is U+20AC, above U+00FF); it was rewritten with escapes.

### Bugs Fixed

- Bug 10.

### Remaining Work

See `Brain.md` §18 and §20.

---

## 2026-09-25 (10)

### Agent

BACKEND + DATABASE (audit pass)

### Feature

D4 staging verification — partial

### Context

Owner provisioned Supabase (URL + anon + service-role keys), Turnstile (site +
secret), Resend (API key), and `LEADS_NOTIFICATION_EMAIL` / `RESEND_FROM`
values. No direct DB connection string or Management API PAT was provided.
Audit pass was requested to verify each service against staging without
expanding scope.

### Work Completed

1. Verified Supabase project reachable. Confirmed service-role key length and
   anon key length, project URL host, that REST + Storage APIs respond.
2. Probed SQL-execution endpoints on the gateway (`/pg/query`,
   `/pg-meta/{default,v0,v1}/query`, `/database/v1/query`, `/_/query`,
   `/pg-meta/v0`, `/pg-meta/v1/{tables,columns}`, `/realtime/v1`,
   `/functions/v1`) — all returned 404 or 401. The gateway exposes no SQL
   execution endpoint, so the migration cannot be applied without owner action.
3. Confirmed tables `leads`, `recruiting_leads`, `software_leads`,
   `resume_files`, `lead_events`, `lead_notes`, `admin_users` do NOT exist in
   the staging database — every read returned `Could not find the table in
   the schema cache`.
4. Confirmed storage bucket `resumes` does NOT exist — `GET /storage/v1/bucket`
   returns `[]`.
5. Verified anon reads denied (schema-cache miss is the only signal without
   tables; RLS deny-by-default is structurally correct in the migration file).
6. Verified Resend API key is valid (`/domains` list responds, no error). Test
   send from `contactgenra@gmail.com` → `contactgenra@gmail.com` FAILED with
   `validation_error`: `The gmail.com domain is not verified`. This is the
   documented behaviour of Resend when the From address is not on a verified
   domain.
7. Verified Turnstile `siteverify` endpoint reachable. With the configured
   secret, malformed/empty tokens return the expected `invalid-input-response`
   / `missing-input-response` error codes (server correctly fails closed per
   prompt §43). End-to-end real-token verification requires a browser against
   the configured site key — not attempted in this audit pass because the
   submit flow is blocked at the DB layer.
8. Ran `npm run typecheck` (clean), `npm run lint` (clean), `npm test`
   (30/30 unit tests), `npm run build` (clean — 15/15 static routes, only the
   pre-existing metadataBase warning).
9. Ran the Playwright suite: desktop 41/41, tablet 41/41, mobile 37 pass + 4
   skipped (touch-only assertions not applicable without WebKit). The submit
   path was NOT exercised in E2E — it cannot succeed without schema.
10. Scanned `src/` and `e2e/` for hardcoded `re_`, `sb_publishable_`,
    `sb_secret_`, or `0x4A…` patterns — zero hits. `.env` is gitignored.
    `package-lock.json` shows an uncommitted peer-dependency lockfile diff
    generated by `npm install`; left untouched (out of D4 scope).

### Verification

- [x] Typecheck clean
- [x] Lint clean
- [x] 30/30 unit tests
- [x] 119 E2E tests across desktop, tablet, mobile (no submit flow exercised)
- [x] Build clean
- [x] Resend API key structurally valid; sender domain unverified → email disabled
- [x] Turnstile secret structurally valid, endpoint reachable, fail-closed
- [x] Storage + REST endpoints reachable on Supabase project
- [ ] Migration NOT applied — staging database is empty
- [ ] Storage bucket `resumes` NOT created
- [ ] Submit path E2E BLOCKED — cannot create lead rows against empty schema
- [ ] Real Resend email delivery BLOCKED — `gmail.com` sender not verified
- [ ] Real Turnstile widget flow BLOCKED — submit path blocked at DB layer

### D4 status

**BLOCKED.** Migration deployment requires owner action (DB connection string
or Supabase Management API PAT). Once the schema is applied, the same audit
can run the full lead-submission E2E. Until then, no claim of full D4
verification is made.

### Bugs Found

None new. All defects from previous entries remain as documented.

### Commit

No D4 commit. The audit produced no implementation change, only verification
evidence. A commit would be meaningless per Phase 16 guidance: "If there are
no tracked changes because the task only required environment configuration
and verification, DO NOT create a meaningless commit." The scratch `.verify/`
helper directory created for probe scripts is deleted after the audit.

### Remaining Work

- Owner: apply `supabase/migrations/0001_init.sql` to staging via SQL editor
  OR supply DB connection string / Management API PAT so this session can
  deploy.
- Owner: replace `RESEND_FROM=contactgenra@gmail.com` with a From address on a
  domain verified in the Resend dashboard, OR add and verify a chosen sender
  domain in Resend.
- Resume D4 from Phase 2 onward: schema verification, RLS verification,
  bucket creation verification, full E2E submission flow, duplicate detection,
  rate limiting, failure-path coverage.

---

## 2026-09-24 (9)

### Agent

FRONTEND + BACKEND

### Feature

B1 fix: shared form state moved out of the Server Action module

### Context

The static codebase audit classified B1 as confirmed broken: `src/lib/actions/submitLead.ts`
begins with `"use server"` yet exported the runtime value `IDLE`, violating Next.js
`invalid-use-server-value` (a `"use server"` file may only export async functions, plus
types). All three lead forms import `IDLE`, so every Server Action in the module failed at
runtime — a dev-server `POST /contact` returned 500 naming `IDLE` in the actions loader.

### Work Completed

1. **New module `src/lib/actions/formState.ts`** holding the exact existing `FormState`
   interface and `IDLE` value. No directive, zero imports — importable from both sides
   with no boundary or cycle risk.
2. **`submitLead.ts`** now imports `FormState` as a type and re-exports it as
   `export type` (type-erased, allowed). Its only runtime exports are
   `submitRecruiting`, `submitProject`, `submitContact`. `"use server"` intact.
3. **ContactForm, RecruitingForm, ProjectForm** import `IDLE` from `formState`;
   action imports unchanged. No validation, database, storage, email or Turnstile
   logic touched.

### Verification

- [x] `git diff --check` clean; diff is 4 modified files + 1 new file, all B1-scoped
- [x] `npm run typecheck` PASS
- [x] `npm run lint` PASS
- [x] `npm run build` PASS (15/15 static routes; only the pre-existing
      metadataBase warning, which needs the production domain)
- [x] `npm test` PASS (30/30 unit tests)
- [x] Regression: ContactForm → submitContact, RecruitingForm → submitRecruiting,
      ProjectForm → submitProject — imports resolve, signatures unchanged
- [x] Runtime: production server serves `/contact`, `/recruiting`, `/software`
      as 200 with forms rendered
- [ ] API / database — still NOT verified (no credentials, D4). No submission was
      posted; no live Supabase/Resend/Turnstile verification is claimed.

### Commit

`73dfc0e` — `fix(forms): move shared form state out of server action module`

### Remaining Work

D4 credentials, production domain, legal/business facts, P1 hardening — unchanged.

---

## 2026-09-18 (8)

### Agent

FRONTEND

### Feature

Two hero bugs found by actually running the site

### Context

Asked to run the website, I started it and looked — which surfaced two real
defects that 116 passing E2E tests had not. Both are cases where the tests
verified structure but never the thing a visitor sees first.

### Bugs Found

1. **The hero never painted until the visitor scrolled.** On a fresh load the
   canvas measured 300x150 — the HTML default — with zero painted pixels, so the
   page showed pure black beneath the header.

   Root cause: `render()` runs once on mount, before any frame has downloaded.
   `nearest()` returns null, nothing is drawn, and `drawCover` — which sizes the
   canvas — never executes. Its only other triggers are ScrollTrigger's
   `onUpdate` and window resize, so with no scroll the hero stayed blank
   indefinitely.

   Why the suite missed it: every existing hero test scrolls before asserting.
   They proved the sequence works once driven, never that it starts.

   Fix: `useFrameSequence` accepts an `onFrameLoad` callback and fires it as each
   frame arrives; `Hero` passes a referentially stable `repaint` backed by a ref,
   so newly-loaded frames trigger a paint without restarting the download.
   Added a regression test asserting painted PIXELS at `scrollY === 0` — element
   presence would have passed throughout, since the canvas existed all along.

2. **An aborted fetch could downgrade every visitor to the static hero.**
   The timeline effect aborted its request on cleanup, and the abort rejection
   landed in `.catch(() => setTimeline(null))` — overwriting the result of the
   run that had actually succeeded. React's double-invoked effects make that the
   normal path in development, and it is a genuine race anywhere the effect
   re-runs. Symptom: `prefers-reduced-motion: false` and `timeline.json`
   returning 200, yet `HeroStatic` rendering.

   Fix: both handlers now check `controller.signal.aborted` before touching
   state, so a superseded run can never clobber a live one.

### Also

- Added a `genra-prod` launch configuration. The dev server's HMR degrades badly
  after a long editing session — it was serving stale errors referencing code
  deleted hours earlier — so the production build is the reliable way to review
  the real site.

### Verification

- [x] Build, lint, typecheck clean
- [x] 30 unit tests
- [x] 116 E2E tests across desktop, tablet and mobile, plus the new regression
- [x] Browser tested against the production build: hero paints "Have an Idea?"
      on load with no scroll, panels scrub, correct hotspot activates
- [ ] API / database — still NOT verified (no credentials, D4)

### Commit

`<pending>`

---

## 2026-09-18 (7)

### Agent

FRONTEND + BACKEND

### Feature

Closing three gaps between the documentation and the implementation

### Context

Asked whether only credentials and business facts remained, I audited the code
against the docs instead of answering from memory. Three specified behaviours had
never been built — including one I had explicitly promised in my own plan.

### Work Completed

1. **Analytics events** (DOC5 §5.39 acceptance criteria; plan conflict C6).
   `lib/analytics/track.ts` is the thin adapter the plan committed to and never
   delivered. Call sites emit `*_form_started`, `*_form_submitted`,
   `resume_selected` and `form_submit_failed`; a provider attaches in Phase 4
   without touching any of them. Until then events log in development and go
   nowhere in production — no vendor SDK, no tracking cookie.
   Event properties carry no personal data: which form, which project type,
   resume size in KB. Never a name, email, phone or filename, since filenames
   routinely contain the candidate's name.
   Start events fire on first focus, so form STARTS are measurable separately
   from views and abandonment is visible (DOC1 §33).

2. **Lead attribution** (DOC5 §5.27; DOC2 §39). The schemas accepted `source`
   and five UTM fields but nothing populated them, so every lead would have
   recorded `source=WEBSITE` with no campaign.
   `components/forms/Attribution.tsx` captures them from the landing URL and
   submits them as hidden fields. Deliberately FIRST-touch, held in
   `sessionStorage`: a visitor who arrives from a campaign, browses to another
   page and submits there still carries the original attribution. Reading only
   `location.search` at submit time would attribute that lead to nothing, which
   is the usual way this gets built wrong — and is covered by a test.
   Falls back to the referrer hostname when no campaign tag is present.

3. **Duplicate detection** (DOC4 §4.26). Not implemented; every submission
   created a new lead. DOC4 is deliberate that `UNIQUE(email)` is NOT a database
   constraint, because one person may legitimately raise different enquiries, so
   detection belongs in business logic. A repeat of the same email AND lead type
   within 30 minutes now records a `DUPLICATE_SUBMISSION` event against the
   existing lead instead of creating a second one. The visitor still sees
   success, because from their side the enquiry did arrive. This complements the
   disabled submit button: that stops a double click, this stops a
   refresh-and-resubmit later.

### Verification

- [x] Build, lint, typecheck clean
- [x] 30 unit tests
- [x] E2E green, with two new attribution tests including the cross-page
      first-touch case
- [ ] API / database — still NOT verified (no credentials, D4). Duplicate
      detection in particular is written but has never run against a database.

### Bugs Found

1. **`useRef().current` read during render** in all three forms —
   `react-hooks/refs`. Replaced with a lazy `useState` initialiser, which gives
   a guaranteed-stable value that may be read during render.
2. **`setState` inside an effect** in `Attribution`. Rewritten to write straight
   to the uncontrolled inputs via a ref, which is the textbook use of an effect
   — synchronising the DOM — and avoids re-rendering the whole form for data
   nobody reads.

### Commit

`<pending>`

### Remaining Work

Nothing further that is not blocked on owner input.

---

## 2026-09-18 (6)

### Agent

FRONTEND

### Feature

Phase 16 — brand icons, PWA manifest, loading state, accessibility audit

### Work Completed

- `scripts/build-brand-icons.mjs` generates the favicon, apple icon, PWA icons
  (192/512) and the 1200x630 Open Graph card from the supplied brand mark, per
  brand kit §7. The default create-next-app `favicon.ico` has been removed — the
  site was still shipping it.
- `manifest.ts`, `loading.tsx` (CSS-only, so reduced motion is respected without
  JavaScript)
- `e2e/accessibility.spec.ts` — axe-core WCAG 2.0/2.1 A and AA audit across
  every route plus the 404, and a keyboard-reachability check on the recruiting
  form including the visually-hidden file input.

### Verification

- [x] Build, lint, typecheck clean
- [x] 30 unit tests
- [x] **110 E2E tests pass across desktop, tablet and mobile**, including the
      full accessibility audit
- [x] Browser tested
- [ ] API / database — still NOT verified (no credentials, D4)

### Bugs Found

1. **Graphite text failed WCAG contrast on every route — serious impact.**
   The audit flagged `color-contrast` violations on all seven routes plus the
   404. Root cause: `text-graphite` (`#374151`) on Obsidian (`#0B0B0B`) measures
   roughly **1.9:1 against a 4.5:1 requirement**. The brand kit lists Graphite
   for "secondary text", which holds on Ivory (~8.6:1) but not on a dark
   surface — the kit does not specify dark-mode text pairings, and I had applied
   it to every eyebrow, caption and footer label.

   Fix: all 43 instances of `text-graphite` across 22 files replaced with
   `text-silver` (~12.9:1). Graphite is retained for borders, dividers, icons
   and disabled backgrounds, none of which carry a contrast requirement.
   Hierarchy between body copy and labels now comes from size, casing and
   letter-spacing rather than from a colour that could not be read.

   The rule is recorded in `Brain.md` §12 so it does not regress. Re-audited:
   zero violations on every route. The eyebrow labels are also simply better
   design now — they were close to invisible before.

2. **Site was still serving the default Next.js favicon.** Replaced with the
   GENRA mark across the full icon set.

### Commit

`<pending>`

### Remaining Work

None that is not blocked. Outstanding items require owner input: service
credentials (D4) to verify the submit path, and the business facts under D2/D3.

---

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

None in progress. The 2026-10-03 visual revision is committed on `arsh`.

## What Has Been Completed

Every build phase, plus the fixes and reviews logged above. `Brain.md` is the
authoritative and fully current summary as of 2026-09-27.

## What Remains

Owner: apply the migration, provide a usable email sender and the `.env.local`
values, decide the Testimonials section, supply the business facts.
Agent: trace a real submission end to end once the owner items are done.

## Important Context

- Read `Brain.md` §0 first. §25 decodes the "prompt §N" references in the code.
- Branch `arsh` only. Another developer commits too — always fetch first.
- Review on the production build; E2E uses port 3100.
- Never rewrite source files with PowerShell 5.1 `Get-Content` / `Set-Content`.

## Exact Next Step

The owner applies the CURRENT `supabase/migrations/0001_init.sql` (nullable email +
contact CHECK) in the Supabase SQL editor. Agent skills: reinstall per `Brain.md` §27
before design work.
