# GENRA WEBSITE — IMPLEMENTATION PLAN

Status: PLAN — awaiting owner decisions on 4 blocking items (Section 9)
Author: Frontend/Backend/Database agent session
Date: 2026-09-17
Branch: `arsh`

This document is the output of the mandatory AUDIT → PLAN phase required by
`.claude/Claude.md` §1, `.agents/Frontend Agent.md` §4, and `Documents/DOC6` §6.35 Rule 4.
No application code is written until this plan is verified.

---

# 1. AUDIT — VERIFIED CURRENT STATE

## 1.1 What exists in the repository

| Area | State |
|---|---|
| Application source tree | **Does not exist** |
| `package.json` | **Does not exist** |
| Environment configuration | **Does not exist** |
| Components | **None** |
| Database schema / migrations | **None applied.** Schema is *specified* in DOC4 §4.31 but never created |
| API routes / server actions | **None** |
| Animation code | **None**. Source frames supplied in `clips/` |
| Tests | **None** |
| `Brain.md` | Unfilled template — all fields are `[PLACEHOLDER]` |
| `Reports/Progress.md` | Unfilled template |
| Agent instructions | Present: `.claude/Claude.md`, `.agents/{Frontend,Backend,DataBase} Agent.md` |
| Product documentation | Present: DOC1–DOC8 |
| Brand assets | Present: `assets/brand/` — 8 logo PNGs, brand board PNG, brand kit DOCX |
| Hero animation assets | Present: `clips/clip1fr.zip`, `clip2fr.zip`, `clip3fr.zip` |

**Conclusion: this is a greenfield build.** There is no existing architecture to integrate
with or preserve. Every "do not rebuild what exists" rule is satisfied trivially, because
nothing is implemented. The constraint that *does* bind is that all implementation must
conform to the architecture already **specified** in DOC2/DOC3.1/DOC4.

## 1.2 Dead file

`Documents/DOC3 PRD-Application_Architecture.md` is **0 bytes**. The real architecture
document is `Documents/DOC3.1 AppLICATION_ARCHITECTURE.md`. No content is lost. DOC3 is
left untouched (preserve project history — Brain.md §21 rule 15).

## 1.3 Hero asset audit (DOC6 §6.9 / prompt §49 — inspect actual files)

All three archives contain `ezgif-frame-NNN.jpg`, 1920×1080, extracted via ezgif.
No missing frames, no duplicates, contiguous numbering.

| Archive | Frames | Bytes (zip) | Content |
|---|---|---|---|
| `clip1fr.zip` | 120 | 1,013,961 | "Have an Idea?" title card → card translates upward → workstation revealed |
| `clip2fr.zip` | 300 | 7,849,885 | Static workstation + six service panels in sequence |
| `clip3fr.zip` | 120 | 882,189 | "You name it." / "We build it." closing card |

### Verified panel timeline (clip2)

Sampled every 15th frame and confirmed against intermediate frames:

| # | Panel | Emerges | Fully settled | Retracting | Gone |
|---|---|---|---|---|---|
| 1 | MVP Development | ~10 | 16–31 | ~46 | ~52 |
| 2 | SaaS Development | ~55 | 61–76 | ~91 | ~97 |
| 3 | Web Applications | ~100 | 106–121 | ~136 | ~142 |
| 4 | AI-Powered Applications | ~145 | 151–166 | ~181 | ~187 |
| 5 | Automation Systems | ~190 | 196–211 | ~226 | ~232 |
| 6 | Career & Recruiting | ~235 | 241–256 | ~271 | ~277 |

Frames 277–300: empty workstation.

**Zero overlap is confirmed in the source material.** At every transition frame exactly one
panel is present and it is in its retract state; the next panel has not begun. This
satisfies prompt §10 without any compositing work on our side.

**Panel position is not static.** The panel's bounding box translates between frames
(e.g. SaaS at f61 sits further left than at f76). A single fixed hotspot rectangle per
panel would not track the visible panel. See §5.3 for the implementation consequence.

### Sequence gap — GENRA brand resolution

Prompt §12 requires, after panel 6 retracts: blank Obsidian → large `GENRA` +
`BUILD. AUTOMATE. ADVANCE.` → then the closing line.

**No frames for the GENRA brand resolution exist in the supplied archives.** clip2 ends on
an empty workstation and clip3 opens directly on "You name it."

Resolution: build the brand-resolution beat in DOM/CSS from `assets/brand/Genra_Logo2SVG.png`
(or the icon-only mark) plus live type. This is consistent with §12's own requirement that
the resolution "feel like the actual GENRA brand identity, not merely another animation
frame." **This is not a blocker.**

### clip3 deviates from the brand kit — flagged, not overridden

Two observations, recorded for the owner rather than silently "corrected":

1. The closing line is set in a **serif** typeface. The brand kit specifies Sora (display)
   and Inter (body/UI). No serif is part of the approved type system.
2. `We build it.` renders in a muted sage/grey. Prompt §12 specifies Ivory + **Mint**
   (`#34D399`).

Default decision: **preserve the supplied frames exactly as delivered** (prompt §7: "preserve
the supplied visual assets", §83: "do not replace it"). Owner may instead elect to render
this card in DOM so it uses Sora + Mint — see §9, decision D5.

---

# 2. RESOLVED CONFLICTS

Applying the source-of-truth order (prompt §81): security → repo architecture → `.claude`
→ agent files → database architecture → DOC1–DOC8 → brand assets → this prompt → judgment.

| # | Conflict | Resolution | Basis |
|---|---|---|---|
| C1 | Prompt says branch `main`; owner instructed branch `arsh` | **`arsh`** | Direct owner instruction in session; `arsh` is already ahead of `main` |
| C2 | Obsidian is `#080B0B` (brand DOCX) vs `#0B0B0B` (brand board PNG + prompt §2) | **`#0B0B0B`** | Two of three sources agree; prompt states it explicitly |
| C3 | Nine-service catalog (prompt §14/§15) vs older project-type lists (DOC1 §23, DOC3.1 §3.9, DOC4 §4.13) | **Nine-service catalog** | Prompt §15 explicitly supersedes. No schema conflict: DOC4 §4.13 already mandates project types live as application config, and `software_leads.project_type` is `VARCHAR(100)`, not an enum |
| C4 | Header nav: DOC1 §8 lists Recruiting/Software/About/Contact/[Get Started]; prompt §5 permits only Software + Recruiting | **Software + Recruiting only**, rest in hamburger | DOC1 §8 labels it "Potential navigation" and DOC1 is marked "Draft → Ready for clarification". Prompt §5 is a later, explicit owner decision on a deliberately open item |
| C5 | Sanity CMS approved in DOC2 §46 but absent from prompt §39 stack | **Deferred.** Content lives in typed TS modules under `src/content/` with a shape that maps 1:1 to Sanity documents | DOC2 §45 stages Sanity as *Phase 3*, explicitly after MVP. Not a removal — a phase boundary already in the approved doc. Prompt §79 also forbids a complex CMS unless the PRD requires it |
| C6 | PostHog approved in DOC2 §46; absent from prompt §39; DOC5 §5.39 makes analytics events part of acceptance | **Thin `trackEvent()` adapter, no vendor dependency in v1** | DOC2 §45 stages PostHog as *Phase 4*. Events are emitted through the adapter so acceptance criteria are met and a provider can be attached later without touching call sites |
| C7 | Prompt §38 raises sign-up/auth | **No public authentication** | Approved architecture has no public accounts. `admin_users` (DOC4 §4.20) is an internal table for a *future* dashboard; DOC1 §47 places dashboards out of MVP. Prompt §38 itself forbids inventing auth that the architecture does not require |
| C8 | DOC3.1 §"keep decisions" lists *"Fake testimonials/reviews for now"*; prompt §53 forbids fabricated content | **No testimonials rendered.** Type + content shape exists with a `status` field; nothing published | DOC1 §14, DOC2 §37 and DOC3.1 §3.26 Risk 4 all independently require that fabricated testimonials never publish as real. Security/trust outranks. Section omitted, not faked |
| C9 | "Ideas We've Brought to Life" (prompt §22) requires verified projects | **Structural section, no content** | No verified GENRA project exists in the repository. Prompt §22 explicitly permits an empty structural section. Nothing invented |
| C10 | Three.js/R3F approved in DOC2 §46 | **Not used in v1** | DOC2 §12 says 3D "should enhance the story, not become the story" and §45 stages it Phase 2. The hero's story is carried by the supplied frames; adding WebGL would contradict prompt §50 |

---

# 3. TECHNOLOGY BASELINE (no deviations)

Confirmed identical across DOC2 §46 and prompt §39 — implemented as specified:

Next.js (App Router) · React · TypeScript · Tailwind CSS · shadcn/ui · Motion · GSAP +
ScrollTrigger · Lenis · React Hook Form · Zod · Supabase PostgreSQL · Supabase Storage ·
Resend · Cloudflare Turnstile · Vercel · Vitest · Playwright · Lucide React

Explicitly excluded: **Docker** (Claude.md §7, Brain.md §21 rule 13, DOC4 §4.2).

Phase-deferred per DOC2 §45, not removed: Sanity, PostHog, Cloudinary, Three.js.

---

# 4. DATABASE PLAN

The schema is **already specified** in DOC4 §4.31 and is implemented verbatim. No column is
invented, renamed, or guessed.

Tables: `leads`, `recruiting_leads`, `software_leads`, `resume_files`, `lead_events`,
`lead_notes`, `admin_users`.

Indexes: exactly the thirteen in DOC4 §4.32.

Not implemented (DOC4 §4.4 explicitly defers): `outreach_contacts`, `outreach_campaigns`,
`outreach_messages`, `outreach_events`.

## 4.1 Security posture

- **RLS enabled on every table, with no public policy.** Browser never reaches Postgres.
  All access is server-side through the service-role key (DOC4 §4.29).
- Service-role key is server-only. Never imported into a Client Component, never prefixed
  `NEXT_PUBLIC_`.
- Resume bucket is **private**. No public URL. Access only via short-lived signed URLs
  generated server-side for authorised internal use (prompt §29, §41; DOC2 §19).

## 4.2 Open schema question

DOC4 §4.31 declares `leads.email VARCHAR(320) NOT NULL` and DOC4 §4.24 lists
"Email NOT NULL" as a hard constraint. DOC5 §5.8 marks Email **Required**.

Prompt §29 marks recruiting Email **OPTIONAL** and introduces a separate required
"Contact Information" field.

This is a genuine contradiction between the approved database architecture (priority 5) and
the prompt (priority 8), and it cannot be resolved by inference — it changes the schema,
duplicate detection (DOC4 §4.26 keys on email), and whether a candidate confirmation email
(DOC5 §5.24) is possible at all. **Escalated as decision D1 in §9.** No migration is written
until it is answered.

---

# 5. HERO IMPLEMENTATION PLAN

## 5.1 Asset pipeline

Source frames are preserved in `clips/` untouched. A build-time script derives optimised
delivery assets — re-encoding for delivery is **not** regenerating the animation.

```
clips/*.zip  ──► scripts/build-hero-assets.mjs ──► public/hero/
                                                    ├── seq-{1,2,3}/ AVIF + WebP ladders
                                                    │   (1920w, 1280w, 828w)
                                                    ├── poster-*.avif
                                                    └── timeline.json
```

Rationale: 540 JPEG frames total ≈ 9.5 MB raw. Delivered as a responsive AVIF ladder with
the mobile tier at 828w, decoded to canvas and driven by scroll progress. Video was
considered and rejected: frame-accurate scrubbing of `<video>` is unreliable across browsers
and iOS Safari refuses inline programmatic seeking under memory pressure.

## 5.2 Scroll binding

GSAP ScrollTrigger with `scrub`, pinning the hero for a bounded distance, Lenis underneath
for smoothing. Natural scrolling is preserved — the pin releases at sequence end and the
page never locks indefinitely (prompt §47).

`prefers-reduced-motion`: sequence collapses to static key frames (one per panel) in a plain
scrollable stack. All six panels remain reachable, clickable, and keyboard-navigable.
Content and navigation are never lost (prompt §46).

## 5.3 Clickable panels — deterministic hotspots

Because panel position drifts frame to frame (§1.3), hotspot geometry is **derived from the
frames themselves** at build time, not hardcoded and not OCR'd:

1. For each clip2 frame, threshold luminance against the near-black background.
2. Take the largest connected bright region excluding the fixed workstation rect.
3. Emit `{ frame, panel, box: [x,y,w,h], opacity }` into `timeline.json`.
4. At runtime one absolutely-positioned `<a>` per panel is placed from the interpolated box
   for the current frame. `pointer-events` is enabled **only** while that panel's opacity
   passes a visibility threshold.

This is the "HTML overlay hotspots synchronised with the animation timeline" approach
prompt §11 states as preferred. OCR is not used at all.

Interaction rules (prompt §11): **no hover animation whatsoever** — no scale, tilt, glow, or
movement. Only click/tap/Enter/Space navigates. Focus ring is visible. Touch targets are
expanded to a 44px minimum *without* creating oversized regions over unrelated screen area.

Routing: panels 1–5 → `/software`; panel 6 → `/recruiting`.

## 5.4 Mobile

The hero is re-composed rather than scaled. The workstation's lower-right composition and
large negative space do not survive a 375px viewport, so the mobile treatment crops to the
panel region and presents the six panels as a scroll-linked vertical sequence retaining the
same emerge/settle/retract rhythm and the same routing.

---

# 6. BUILD PHASES

Per DOC6 §6.2 and prompt §69 — one feature at a time, each through
PLAN → VERIFY → BUILD → VERIFY → TEST → BROWSER TEST → COMMIT → UPDATE PROGRESS → UPDATE BRAIN.
No phase begins while the previous has unresolved bugs (DOC6 §6.35 Rule 11).

| # | Phase | Gate |
|---|---|---|
| 0 | Scaffold: Next.js + TS + Tailwind + shadcn, design tokens from brand kit, fonts, lint/test config | `build` + `typecheck` clean |
| 1 | Layout shell: header (Software/Recruiting only), hamburger overlay (About/Contact), footer, 404, error, loading | Keyboard + SR pass, responsive pass |
| 2 | Hero asset pipeline + `timeline.json` | Timeline boxes verified against rendered frames |
| 3 | Hero sequence + brand resolution + closing card | Browser test; reduced-motion test |
| 4 | Hero hotspots + routing | E2E: 6 panel-click tests, hover-does-not-navigate, keyboard activation |
| 5 | Homepage sections 2–13 | Visual QA against §50/§70 |
| 6 | `/software` — nine-service editorial catalog | Visual QA, responsive |
| 7 | `/recruiting` | Copy truthfulness review against §25–§27 |
| 8 | `/about`, `/contact`, `/privacy`, `/terms` | Blocked on D2/D3 facts |
| 9 | Database: migrations, RLS, storage bucket + policies | Blocked on D1. Applied + verified against live Supabase |
| 10 | Backend: Zod schemas, server actions, Turnstile verify, rate limit, transactional writes | Server-side validation unit tests |
| 11 | Storage: resume upload, MIME/size/extension validation, filename sanitisation, signed URLs | Malicious-upload rejection tests |
| 12 | Email: Resend notification + optional confirmation, failure isolation | Submission survives email failure |
| 13 | Forms UI: project form (+ conditional "Other"), recruiting form, contact form | Full form E2E suite |
| 14 | SEO: metadata, OG, canonical, sitemap, robots | Blocked on D2 (domain) |
| 15 | Performance: code splitting, dynamic imports, image ladders, CWV | Lighthouse pass |
| 16 | Final visual QA + accessibility audit | §70 checklist |

---

# 7. TEST PLAN

**Vitest (unit/integration)** — Zod schema behaviour incl. every invalid-input branch; file
validation (type, size, extension, MIME mismatch, double-extension); Turnstile verification
including forged/absent/replayed token; rate limiter; content-catalog integrity (dropdown
options exactly equal the approved nine + Other); email-failure isolation; transaction
rollback on partial failure.

**Playwright (E2E)** — all routes render; header shows only Software + Recruiting; hamburger
contains About + Contact; six hero panel clicks route correctly (prompt §66); hover produces
no navigation and no transform; keyboard activation via Enter and Space; project-type
dropdown contains exactly the approved catalog (prompt §67); "Other" reveals the conditional
field and deselecting it does not submit a stale value; recruiting form — name required,
email per D1, PDF accepted, wrong type rejected, oversized rejected; success/error/retry
states; reduced-motion; mobile viewport; no horizontal overflow.

**Accessibility** — axe on every route; manual keyboard traversal; heading hierarchy;
contrast verified against the Obsidian/Ivory/Mint tokens.

**Browser testing is mandatory** (DOC6 §6.13) — compilation is explicitly not sufficient.
Every UI phase is exercised in a real browser at desktop, tablet, and mobile before commit.

---

# 8. CONTENT TRUTHFULNESS REGISTER

Nothing in the following categories is generated. Where a fact does not exist, the element is
omitted rather than filled (prompt §53, §76, §77; DOC1 §43).

Not present anywhere in the repository, therefore **not rendered**: client names, project
case studies, testimonials, metrics, counts, success rates, partner/award logos, team member
names, founder biography, company registration, physical address, phone number, pricing,
response-time commitments, social profile URLs, data-retention periods.

Recruiting copy states only what the system does: GENRA handles the application workflow from
information the candidate supplies. No employment, interview, placement, or outcome claim
appears anywhere (DOC1 §43, DOC5 §5.6, prompt §25). Per prompt §27 there is **no** dedicated
"What We Don't Promise" section — outcome boundaries are carried naturally inside the process
copy and terms.

---

# 9. BLOCKING DECISIONS REQUIRED FROM OWNER

Per prompt §83 — stop at the decision point and report rather than guess.

**D1 — Recruiting form: is email required?**
DOC4 §4.31 (`NOT NULL`) + DOC4 §4.24 + DOC5 §5.8 say required. Prompt §29 says optional.
Affects schema, duplicate detection, candidate confirmation email.

**D2 — Verified business facts.**
Needed: contact email, phone (if any), physical address (if any), social account URLs,
production domain, legal entity name. DOC1 §50 Q20–27 were never answered. Until supplied,
the footer ships without contact/social blocks, `/contact` without direct details, and SEO
canonical/sitemap cannot be generated.

**D3 — Data retention period** for resumes and lead records. DOC4 §4.30 explicitly defers
this and forbids inventing a period. `/privacy` cannot make an accurate retention statement
without it.

**D4 — Service accounts.** Supabase project, Resend domain/API key, Turnstile site+secret
keys. Backend can be written without them but cannot be verified end-to-end, and prompt §84
requires a tested, database-backed, email-enabled result.

**D5 — clip3 typography/colour** (see §1.3). Preserve the supplied serif + sage frames, or
render that card in DOM using Sora + Mint per prompt §12.

**D6 — Resume file formats.** DOC5 §5.11 explicitly supports PDF/DOC/DOCX at 10 MB. Prompt
§29 says "PDF only unless the existing PRD explicitly supports other formats" — which it
does. Confirm whether to honour the PRD (all three) or tighten to PDF-only; DOC/DOCX carry a
macro-borne malware vector that PDF-only avoids.

---

# 10. NEXT ACTION

On receipt of D1–D6: begin Phase 0. Phases 0–7 for everything not gated by D2/D3, and
Phase 9 onward once D1 and D4 are resolved.
