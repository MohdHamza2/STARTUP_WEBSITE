# GENRA — Website

Build. Automate. Advance.

The public acquisition layer for GENRA's two service lines: software solutions,
and career & recruiting support.

---

## Before you change anything

This project has documented rules that take precedence over general preference.
Read them first:

1. `.claude/Claude.md` — the operating workflow
2. `.agents/{Frontend,Backend,DataBase} Agent.md` — role boundaries
3. `Brain.md` — current verified state, decisions, blockers
4. `Reports/Progress.md` — chronological log
5. `Reports/Implementation_Plan.md` — audit, resolved conflicts, build order
6. `Documents/DOC1`–`DOC8` — PRD, stack, architecture, database, features

Every feature follows PLAN → VERIFY → BUILD → TEST → BROWSER TEST → COMMIT →
UPDATE PROGRESS → UPDATE BRAIN. Browser testing is mandatory; a passing build is
explicitly not sufficient (DOC6 §6.13).

---

## Running it

```bash
npm install
npm run dev
```

The first `npm run build` generates the hero assets automatically. To force a
rebuild of them:

```bash
npm run hero:build -- --force
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build (runs `hero:build` first) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |
| `npm run e2e` | Playwright, across desktop/tablet/mobile |
| `npm run hero:build` | Regenerate hero assets from `clips/*.zip` |

E2E always builds and serves production on port **3100**, so it never collides
with a dev server on 3000. That is deliberate: when the two shared a port,
Playwright reused the dev server, and on-demand route compilation ate the
hydration budget under parallel workers — producing failures that had nothing to
do with the code.

---

## Configuration

Copy `.env.example` to `.env.local` and fill it in. Nothing in `.env*` is ever
committed except the example itself.

Until Supabase, Resend and Turnstile keys are set, **forms cannot accept
submissions**. Turnstile fails closed by design, and the UI says so plainly
rather than appearing functional and failing on submit.

Apply the database schema once a Supabase project exists:

```
supabase/migrations/0001_init.sql
```

---

## The hero

`clips/*.zip` holds the owner-supplied animation as JPEG frame sequences. They
are the visual source of truth and are never modified.

`scripts/build-hero-assets.mjs` derives the delivery assets and, critically, the
**panel interaction timeline** — hotspot geometry is measured from the frames
themselves rather than hardcoded or OCR'd. Two measured facts drive that code and
are documented in the script: the camera is not static, and panels collapse to a
thin streak between cycles rather than disappearing.

If the animation is ever re-exported with a different sequence, the build fails
loudly with a frame-by-frame height profile instead of silently mis-routing a
hotspot.

---

## Content and truthfulness

This is a hard constraint, not a style preference (prompt §53; DOC1 §43).

Nothing is invented. No client names, case studies, testimonials, metrics, team
members, addresses, phone numbers, social accounts or pricing appear anywhere,
because none are on record. Recruiting copy never promises a job, interview,
offer or placement.

- `src/config/site.ts` — brand facts. Null values render nothing.
- `src/content/services.ts` — the approved nine-service catalog.
- `src/content/projects.ts` — intentionally empty.

Search `TODO(business-facts)` for every place a real value belongs. Supplying it
is a one-file change; the UI appears on its own.

---

## Architecture

Next.js App Router · React · TypeScript · Tailwind v4 · Motion · GSAP +
ScrollTrigger · Lenis · Supabase (Postgres + Storage) · Resend · Cloudflare
Turnstile · Vitest · Playwright.

Docker is explicitly excluded.

```
src/
  app/          routes, metadata, sitemap, robots
  components/   brand, navigation, hero, sections, forms, ui, providers
  config/       site facts
  content/      services, recruiting, projects
  lib/          actions, db, email, security, validation, hero
scripts/        hero asset pipeline
supabase/       migrations
e2e/            Playwright specs
```

**Security invariants.** The browser never reaches Postgres — RLS is on with no
policy and all access is server-side. The service-role key sits behind a
`server-only` import so a stray client import fails the build. Every endpoint
re-validates with the same Zod schema the client used. Turnstile is verified
server-side. Resumes are validated by magic bytes, stored in a private bucket,
never logged and never emailed.
