# PROJECT BRAIN

## PURPOSE

This file is the long-term memory of the entire project.

Any new AI agent must read this file before making development changes.

It must always represent the current known state of the project.

---

# 1. PROJECT IDENTITY

## Project Name

GENRA

## Purpose

GENRA is a technology company with two service lines. It builds software (MVPs, SaaS,
web applications, business software, portfolio sites, AI-powered applications, automation
systems) and it provides career/recruiting assistance, handling the job-application
workflow for candidates based on information those candidates supply.

The website is the public acquisition layer for both lines. Its job is to convert visitors
into qualified leads — not to be a brochure.

## Primary Users

- International students, recent graduates and early-career professionals targeting US
  employment (recruiting funnel)
- Founders, businesses and individuals needing software built (software funnel)

## Primary Business Goal

Generate qualified leads into a shared lead database that a future CRM/outreach system can
consume through a controlled API.

---

# 2. PRODUCT STRUCTURE

## Main Website

Routes: `/`, `/software`, `/recruiting`, `/about`, `/contact`, `/privacy`, `/terms`, plus
404 and error states. Homepage is the brand entry point and splits into the two funnels.

## Recruiting Platform

`/recruiting` — service explanation, four-step process, recruiting enquiry form with
optional resume upload. No employment, interview, placement or outcome claims are made
anywhere. Not a job board, not an ATS, no candidate accounts.

## Software Services

`/software` — the approved nine-service catalog presented as an editorial service book,
process, capabilities, and the project enquiry form.

Official catalog (supersedes older lists in DOC1/DOC3.1/DOC4 per prompt §15):
01 MVP Development · 02 SaaS Development · 03 End-to-End Software Production ·
04 Web Application · 05 Business Software · 06 Portfolio Websites ·
07 AI-Powered Applications · 08 Automation Systems · 09 Career & Recruiting

Career & Recruiting is a separate service line, not a software development category.

## Other Services

None. Scope is deliberately limited — no blog, newsletter, pricing calculator, chatbot,
admin dashboard, CRM, client portal, payments, booking or CMS in this version.

---

# 3. CURRENT DEVELOPMENT STATUS

Current phase: BUILD COMPLETE — all 17 phases implemented

Current feature: none in progress

Current sprint: awaiting credentials for end-to-end verification

Overall completion: the build is feature-complete. The only outstanding
implementation work is whatever the owner decides after reviewing it.

Done: scaffold and design system; layout shell; hero asset pipeline; hero sequence with
clickable panels; all homepage sections; every route including legal pages; database
migration; server actions; storage; email; Turnstile; rate limiting; all three forms;
SEO; performance pass; 30 unit tests and 84 E2E tests across desktop, tablet and mobile.

**Not verified: the submit path.** No Supabase, Resend or Turnstile credentials exist, so
the migration has never been applied and no submission has been written, uploaded or
emailed. Treat that integration as unproven until a real submission is traced end to end.

All six owner decisions D1–D6 are resolved — see `Reports/Implementation_Plan.md` §9.

---

# 4. TECHNOLOGY STACK

## Frontend

Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Lucide React

## Backend

Next.js server actions / route handlers. No separate backend service.

## Database

PostgreSQL

Hosted via Supabase. Schema is specified in DOC4 §4.31 and is to be implemented verbatim.

## Authentication

**None.** The approved architecture has no public user accounts. `admin_users` exists in
the schema for a future internal dashboard only; that dashboard is out of MVP scope
(DOC1 §47).

## Storage

Supabase Storage — private bucket for resumes. No public URLs; signed URLs only.

## Hosting

Vercel, with Cloudflare for DNS/SSL/CDN. Docker is explicitly excluded.

## Testing

Vitest (unit/integration) + Playwright (E2E)

## Animation

Motion (UI-level), GSAP + ScrollTrigger (cinematic scroll), Lenis (smooth scroll)

## Deferred by phase (approved in DOC2 §45, not yet implemented)

Sanity CMS (Phase 3), PostHog (Phase 4), Cloudinary, Three.js/R3F

---

# 5. ARCHITECTURE

```
Visitor → Cloudflare → Vercel (Next.js)
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Supabase          Supabase            Resend
   PostgreSQL         Storage             Email
   (leads)           (resumes)        (notifications)
```

Important boundaries:

- The browser never reaches PostgreSQL. All database access is server-side.
- The Supabase service-role key is server-only and must never be prefixed `NEXT_PUBLIC_`.
- Form functionality must never depend on the animation system (DOC5 §5.34). If GSAP,
  video or animation fails, forms still work.

---

# 6. FRONTEND ARCHITECTURE

To be documented as built. Planned shape:

- Pages: the routes in §2
- Header: minimal. Desktop primary nav is **Software and Recruiting only**. About and
  Contact live in the hamburger overlay. No "Start a Project" and no sign-up in the header.
- Hero: scroll-linked frame sequence driven by the owner-supplied clips, with DOM hotspot
  overlays for the six clickable service panels
- State: React Hook Form for forms; no global state library
- Styling: Tailwind with centralised design tokens — no hardcoded colour or spacing values
- Animation: layered per DOC3.1 §3.5 (Motion → GSAP → Lenis)

---

# 7. BACKEND ARCHITECTURE

To be documented as built. Planned shape:

- `POST /api/leads/recruiting`, `POST /api/leads/software`, `POST /api/contact`
- Every endpoint: Zod server validation → Turnstile server verification → rate limit →
  transactional write → event record → email notification
- Client-submitted data is never trusted. Client-side validation is UX only.
- Email failure must not lose a submission.

---

# 8. DATABASE ARCHITECTURE

Specified in DOC4 §4.31. **Not yet applied.**

Tables: `leads` (central) → `recruiting_leads`, `software_leads`, `resume_files`,
`lead_events`, `lead_notes`; plus `admin_users`.

All primary keys are UUID. Thirteen indexes per DOC4 §4.32. RLS enabled on every table
with no public policy.

Deliberately NOT implemented yet (DOC4 §4.4): `outreach_contacts`, `outreach_campaigns`,
`outreach_messages`, `outreach_events`.

**Open:** whether `leads.email` stays `NOT NULL`. DOC4/DOC5 require it; the owner's build
prompt §29 marks recruiting email optional. Unresolved — decision D1.

---

# 9. FEATURES

## Completed

- [x] Repository audit
- [x] Hero asset audit and panel-timeline mapping
- [x] Implementation plan (`Reports/Implementation_Plan.md`)
- [x] Phase 0 scaffold and design tokens
- [x] Layout shell, header, hamburger, footer, error pages
- [x] Hero asset pipeline and timeline generation
- [x] Hero sequence, brand resolution, clickable panels
- [x] B1 fix (2026-09-24): `FormState`/`IDLE` moved to `src/lib/actions/formState.ts`;
  `submitLead.ts` exports only async Server Actions again

## In Progress

- [ ] None

## Pending

- [ ] Homepage sections
- [ ] `/software`, `/recruiting`, `/about`, `/contact`, `/privacy`, `/terms`
- [ ] Database migrations, RLS, storage policies
- [ ] Backend endpoints, validation, Turnstile, rate limiting
- [ ] Resume upload and secure storage
- [ ] Email notifications
- [ ] All three forms
- [ ] SEO, performance, accessibility, final visual QA

---

# 10. API CONTRACTS

None implemented yet. Contracts will be recorded here as each endpoint is built, per the
shape proposed in DOC5 §5.18.

---

# 11. IMPORTANT DECISIONS

## Decision 1 — Nine-service catalog supersedes older lists

Date: 2026-09-17

Decision: The public service catalog is the nine services in §2.

Reason: Owner instruction explicitly supersedes the older six-category and eleven-item
project-type lists in DOC1 §23, DOC3.1 §3.9 and DOC4 §4.13.

Impact: No schema change — DOC4 §4.13 already requires project types to be application
config rather than a database enum, and `software_leads.project_type` is `VARCHAR(100)`.

## Decision 2 — Obsidian is #0B0B0B

Date: 2026-09-17

Decision: Use `#0B0B0B`.

Reason: The brand kit DOCX says `#080B0B`; the brand board PNG and the owner's build
prompt both say `#0B0B0B`. Two of three sources agree.

Impact: Single token value. Recorded so the discrepancy is not silently re-litigated.

## Decision 3 — No public authentication

Date: 2026-09-17

Decision: No sign-up, login, sessions or protected routes.

Reason: The approved architecture defines no public accounts. Introducing auth would be
inventing a system the PRD does not require.

Impact: Hamburger menu contains About and Contact only.

## Decision 4 — Sanity and PostHog deferred, not removed

Date: 2026-09-17

Decision: Content lives in typed TypeScript modules shaped 1:1 to future Sanity documents.
Analytics events are emitted through a thin `trackEvent()` adapter with no vendor SDK.

Reason: DOC2 §45 already stages Sanity as Phase 3 and PostHog as Phase 4, after MVP.

Impact: Both can be attached later without touching call sites.

## Decision 5 — Recruiting email required; resume upload is PDF-only

Date: 2026-09-18

Decision: `leads.email` stays `NOT NULL`. Resume upload accepts PDF only.

Reason: Owner resolved the DOC4/DOC5-vs-prompt contradiction in favour of the approved
database architecture, so no schema deviation is needed. PDF-only is tighter than
DOC5 §5.11 permits, chosen because DOC/DOCX carry a macro-borne malware vector and this
stack has no malware scanning.

Impact: Duplicate detection can key on email (DOC4 §4.26). Candidate confirmation email is
possible for every submission. Accepted file types are configuration, so widening later is
a one-line change.

## Decision 6 — No testimonials, no case studies rendered

Date: 2026-09-17

Decision: Types and content shapes exist; nothing is published.

Reason: DOC1 §14, DOC2 §37 and DOC3.1 Risk 4 all independently forbid publishing fabricated
testimonials as real. No verified GENRA project exists in the repository.

Impact: "Ideas We've Brought to Life" ships as an empty structural section.

---

# 12. DESIGN SYSTEM

Source of truth: `assets/brand/GENRA_Brand_Kit_DOC.docx` and
`assets/brand/brand_kit_img_main.png`.

## Brand colors

| Token | Hex | Role |
|---|---|---|
| Obsidian | `#0B0B0B` | Primary dark background |
| Ivory | `#F5F4EF` | Primary light background |
| GENRA Mint | `#34D399` | Signature accent — buttons, links, active states |
| Deep Mint | `#10B981` | Hover, gradient depth |
| Graphite | `#374151` | Secondary text, icons, borders |
| Silver | `#D1D5DB` | Fine borders, disabled, metadata |
| Dark card | `#111615` | |
| Dark border | `#1F2926` | |
| Light card | `#FFFFFF` | |
| Light border | `#E5E7E5` | |

Balance ratio: ~50% Obsidian · 35% Ivory · 10% Graphite/Silver · 5% Mint.
Mint behaves as a signal, never a wash.

## Graphite is NOT a text colour on dark surfaces

The brand kit lists Graphite for "secondary text, UI, icons, borders". That holds
on Ivory, where `#374151` reaches about 8.6:1. On Obsidian it measures roughly
**1.9:1 against a 4.5:1 requirement** — an automated WCAG audit flagged it as a
serious violation on every single route.

Rule: on dark surfaces, secondary and tertiary TEXT uses **Silver** (`#D1D5DB`,
about 12.9:1). Graphite is reserved for borders, dividers, icons and disabled
backgrounds, none of which carry a text-contrast requirement.

Hierarchy between body copy and eyebrow labels comes from size, casing and
letter-spacing rather than from a colour that cannot be read.

## Typography

Sora for display and headings (SemiBold 600). Inter for body (400), UI/nav (500),
buttons (600), captions (500).

H1 48–72px · H2 32–44px · H3 24–30px · Body 16–18px at 1.5–1.65 line height.

## Animation conventions

Motion for UI, GSAP+ScrollTrigger for cinematic scroll, Lenis for smoothing. Animation must
enhance, never block. `prefers-reduced-motion` collapses cinematic motion while preserving
all content and navigation.

## Prohibited

Purple/blue gradients, neon, glowing brains, robots, circuit boards, neural-net backgrounds,
excessive glassmorphism, floating-card clutter, icon-per-paragraph, generic dashboard
collages, stock-looking people. The site must not read as an AI-generated template.

---

# 13. SECURITY RULES

- Server-side Zod validation on every endpoint. Client validation is UX only.
- Cloudflare Turnstile verified **server-side** on every public form. A client token is
  never treated as proof.
- Rate limiting on all public submission endpoints.
- Resume uploads: extension + MIME + size validation, filename sanitisation, no path
  injection, private bucket, signed URLs only.
- RLS enabled on all tables, no public policy. Browser never touches Postgres.
- Service-role key, Resend key and Turnstile secret are server-only.
- No secrets in source. No secrets in logs. No resume contents in logs.
- Safe error messages — never expose database IDs or internal detail to users.

Never store actual secrets in this file.

---

# 14. TESTING STATUS

Nothing implemented, therefore nothing tested. Test plan is recorded in
`Reports/Implementation_Plan.md` §7.

Browser testing is mandatory for every UI feature (DOC6 §6.13) — a passing build is
explicitly not sufficient evidence.

---

# 15. KNOWN BUGS

None recorded. No code exists yet.

---

# 16. KNOWN LIMITATIONS

- `Documents/DOC3 PRD-Application_Architecture.md` is 0 bytes. The real architecture
  document is `DOC3.1 AppLICATION_ARCHITECTURE.md`. DOC3 is left in place to preserve
  project history.
- No GENRA brand-resolution frames were supplied. That beat (prompt §12) will be built in
  DOM/CSS from the logo assets.
- `clips/clip3fr.zip` sets the closing line in a serif typeface and renders "We build it."
  in muted sage rather than Mint — both deviate from the approved brand kit. Flagged to the
  owner as decision D5; supplied frames preserved by default.
- No verified contact details, social accounts, domain, legal entity or data-retention
  period exist. Dependent UI ships omitted rather than invented.

---

# 17. RECENT COMMITS

| Date | Agent | Commit | Description |
|------|-------|--------|-------------|
| 2026-09-24 | FRONTEND+BACKEND | 73dfc0e | fix(forms): move shared form state out of server action module (B1) |
| 2026-09-17 | PLANNING | (pending) | docs: add repository audit and implementation plan |

---

# 18. CURRENT BLOCKERS

All six owner decisions resolved 2026-09-18. Full reasoning in
`Reports/Implementation_Plan.md` §9. Summary:

- **D1** — Recruiting email is **REQUIRED**. DOC4 schema stands unchanged, no deviation.
- **D2/D3** — No verified contact details, domain, legal entity or retention period exist.
  **Omitted, never invented.** `TODO(business-facts)` anchors mark every insertion point.
- **D4** — No service credentials yet. Backend is built against documented contracts with
  `.env.example`; **end-to-end integration remains unverified** until keys are supplied.
- **D5** — clip3 supplied frames **preserved** as delivered, serif and sage included.
- **D6** — Resume upload is **PDF only** (MIME + extension + `%PDF-` magic bytes, 10 MB).

## Remaining blocker

**Service credentials (D4).** Phases 9–12 can be written and unit-tested but cannot be
verified against live Supabase, Storage, Resend or Turnstile. Any completion claim for
those phases must state this explicitly rather than report a passing integration.

## Repository access

Pushes to `origin/arsh` require the owner's GitHub sign-in; Git Credential Manager cannot
prompt from the agent session. Commits are made locally and the owner runs
`git push origin arsh`. **Never push to `main`.**

---

# 19. AGENT OWNERSHIP

## Frontend Agent

Owns: pages, components, layouts, navigation, forms UI, client validation, loading/error/
success states, responsive behaviour, accessibility, animation, hero sequence and hotspots,
frontend API integration, browser testing.

## Backend Agent

Owns: route handlers and server actions, server-side Zod validation, Turnstile verification,
rate limiting, transactional writes, storage upload handling, Resend integration, error
handling and logging.

## Database Agent

Owns: schema, migrations, constraints, indexes, RLS policies, storage bucket policies,
query patterns.

Shared files must be coordinated, not silently claimed.

---

# 20. CURRENT HANDOFF

## Last Agent

BACKEND + DATABASE + FRONTEND

## Last Completed Task

Phases 5–12 plus SEO: all homepage sections, every route, the database migration, server
actions, storage, email, Turnstile, rate limiting, validation with 30 passing unit tests,
sitemap and robots. Eight commits on `arsh`.

## Current State

Build, lint and typecheck are clean across ten routes. 30 unit tests pass. Every page
renders and every internal link resolves.

**The submit path has never been executed.** No Supabase, Resend or Turnstile credentials
exist, so the migration has not been applied and no submission has been written, uploaded
or emailed. The code is written and typechecked; the integration is unproven. Do not
describe it as working until a real submission is traced end to end.

Because Turnstile fails closed, `/contact` currently tells the visitor plainly that it
cannot accept submissions, rather than appearing functional and failing on submit.

## Exact Next Action

1. Create the Supabase project and apply `supabase/migrations/0001_init.sql`.
2. Fill `.env.local` from `.env.example` — Supabase, Resend, Turnstile.
3. Trace one real submission end to end: form → `leads` row → detail row → resume in the
   private bucket → `lead_events` row → team notification email. Only then may the submit
   path be described as working.
4. Supply the business facts under D2/D3 so the footer, `/contact`, `/privacy` and the
   sitemap can render them. Search `TODO(business-facts)`.
5. Optional: `npx playwright install webkit` and switch the tablet project back to
   `devices["iPad (gen 7)"]` if real Safari coverage is wanted.

## Important Warning

- Phases 9–12 can be written but **cannot be verified end-to-end** until service credentials
  exist (D4). Do not report those phases as passing integration.
- Never invent a contact detail, social account, domain, legal entity or retention period.
  Those are tracked as `TODO(business-facts)` and must stay omitted until supplied.
- Pushes require the owner's GitHub sign-in; commit locally and let them push. Never `main`.

---

# 21. CRITICAL RULES

1. Do not violate documented architecture.
2. Do not guess requirements.
3. Build one feature at a time.
4. Verify before and after implementation.
5. Test every feature.
6. Browser-test website functionality.
7. Debug by root cause.
8. Do not randomly rewrite code.
9. Do not commit unverified code.
10. Update progress.md.
11. Update brain.md.
12. Never expose secrets.
13. Do not use Docker.
14. PostgreSQL is the preferred database.
15. Preserve project history.
