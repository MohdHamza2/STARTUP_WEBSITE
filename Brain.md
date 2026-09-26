# PROJECT BRAIN

## PURPOSE

This file is the long-term memory of the entire project. Any new AI agent — or a
person picking this up from a different account — must read this file before making
changes. It is written so that someone with **no access to the original chat** can
continue immediately.

**Last fully rewritten: 2026-09-27**, against commit history up to and including the
encoding fix recorded in §15. Every number in this file was re-measured on that date,
not copied from an earlier version.

---

# 0. START HERE — RESUMING IN A NEW SESSION

1. Read this file end to end. Then `Reports/Progress.md` (chronological log) and
   `.claude/CLAUDE.md` (the operating rules — they override default agent behaviour).
2. Branch is **`arsh`**. Never commit or push to `main`. `main` receives work only via
   pull requests merged by the owner.
3. Pull first: `git fetch origin && git status -sb`. Another developer (GitHub user
   `MohdHamza2`) also works on this repo and merges `main` into `arsh`. On 2026-09-27
   the local clone was **6 commits behind** even though the owner believed it had been
   pulled — always check, never assume.
4. `npm install`, then `npm run build` (the first build regenerates the hero assets —
   several minutes, see §24), then serve with `npm run start`. **Review the site on the
   production build, not `npm run dev`** — see §22.
5. Verify the gate before touching anything: `npm run typecheck && npm run lint &&
   npm test && npm run e2e`. Expected results are in §14.
6. `.env.local` is NOT in git and NOT in this clone. The owner holds the real values.
   Copy `.env.example` to `.env.local` and ask the owner for them. Never commit secrets.
7. The owner's original build brief is NOT in the repo except as summarised in §25.
   Code comments cite it as "prompt §N" — §25 is the key to those references.
8. Owner preference: **brief answers.** Lead with the result, not the process.

---

# 1. PROJECT IDENTITY

## Project Name

GENRA — tagline **Build. Automate. Advance.**

## Purpose

GENRA is a technology company with two service lines:

1. **Software** — MVPs, SaaS, web applications, business software, portfolio
   websites, AI-powered applications, automation systems, end-to-end production.
2. **Career & Recruiting** — handles the job-application workflow for international
   students, recent graduates and early-career professionals targeting US
   employment, using information the candidate supplies.

The website is the public **lead-acquisition layer** for both lines. Its job is to
convert visitors into qualified leads in a shared database that a future CRM/outreach
system can consume — not to be a brochure.

## Primary Users

- Candidates targeting US employment (recruiting funnel)
- Founders, businesses and individuals who need software built (software funnel)

## Repository

`https://github.com/MohdHamza2/STARTUP_WEBSITE` — a **public** repository. Working
branch `arsh`. Nothing personal or secret may ever be written into tracked files.

---

# 2. PRODUCT STRUCTURE

## Routes (all built, all static-prerendered)

| Route | Contents |
|---|---|
| `/` | Hero sequence + 11 sections, in the order the brief specifies (§25, prompt §6) |
| `/software` | Page hero, nine-service catalog, process, capabilities, project form |
| `/recruiting` | Page hero, who it's for, 4-step process, what we ask for, recruiting form at `#apply` |
| `/about` | Concise; no invented history, team or founder |
| `/contact` | Contact form with a software/recruiting topic switch |
| `/privacy`, `/terms` | State only what the implementation actually does |
| 404, error, loading | Branded; safe messaging; CSS-only loading state |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, icons, OG image | SEO + PWA |

## Homepage section order (`src/app/page.tsx`)

Hero (includes the GENRA brand resolution) → SplitSection ("One company / Two
directions") → WhatWeBuild (9-service index) → Process → BrandStatement
("Build. Automate. Advance.") → Capabilities → SelectedWork (renders nothing while
empty) → WorkThatMoves → **Testimonials (added by another developer — OPEN ISSUE,
see §18 C)** → RecruitingIntro → AboutPreview → FinalCTA (contains the project form).

## Official service catalog — `src/content/services.ts`

01 MVP Development · 02 SaaS Development · 03 End-to-End Software Production ·
04 Web Application · 05 Business Software · 06 Portfolio Websites ·
07 AI-Powered Applications · 08 Automation Systems · 09 Career & Recruiting

This supersedes the older lists in DOC1 §23 / DOC3.1 §3.9 / DOC4 §4.13 (owner
instruction). Career & Recruiting is a **separate service line**, not a software
category: it routes to `/recruiting`, and choosing it in the project form records a
RECRUITING lead, not a SOFTWARE lead.

## Out of scope (deliberately)

No blog, newsletter, pricing, chatbot, admin dashboard, CRM, client portal, payments,
booking, CMS, or **public user accounts**.

---

# 3. CURRENT DEVELOPMENT STATUS

**Phase:** Build feature-complete. Blocked on owner input for end-to-end verification.

| Area | State |
|---|---|
| Frontend (all routes, hero, forms, a11y, SEO) | Done and verified |
| Backend code (server actions, validation, Turnstile, rate limit, email, storage) | Written, typechecked, unit-tested — **never executed against real services** |
| Database | Migration written — **NOT applied**; staging tables do not exist |
| Email | API key valid — **sender address unusable** (gmail.com, see §18 B) |
| Business facts (domain, contact, socials, legal entity, retention) | **Not supplied** — omitted, never invented |
| Testimonials section | **Contains fabricated testimonials — owner decision pending** (§18 C) |

**Verified on 2026-09-27:** typecheck clean · lint clean · production build clean ·
**33 unit tests pass** · **E2E: 119 passed, 4 skipped (123 total), exit 0** across
desktop, tablet and mobile.

**The submit path has never run end to end.** Do not describe the forms as "working"
until a real submission has been traced: form → `leads` row → detail row → resume in
the private bucket → `lead_events` row → notification email.

---

# 4. TECHNOLOGY STACK (exact)

| Layer | Choice |
|---|---|
| Framework | Next.js **16.3.5** (App Router, Turbopack), React **19.2.8**, TypeScript |
| Styling | Tailwind CSS **v4** — tokens via `@theme` in `src/app/globals.css` (there is no tailwind.config) |
| Animation | Motion 12 (UI), GSAP 3 + ScrollTrigger (hero), Lenis 1 (smooth scroll) |
| Forms / validation | `useActionState` + Server Actions; Zod 3 schemas shared by client and server. React Hook Form is installed but NOT used |
| Database | Supabase Postgres via `@supabase/supabase-js` (service role, server-only) |
| Storage | Supabase Storage, private bucket `resumes` |
| Email | Resend |
| Spam protection | Cloudflare Turnstile (explicit render; no wrapper library) |
| Icons | Lucide React (used sparingly) |
| Tests | Vitest 2 (unit, jsdom) · Playwright (E2E) · `@axe-core/playwright` (a11y) |
| Image tooling | `sharp` (hero and brand-icon generation scripts) |
| Hosting (planned) | Vercel + Cloudflare. **Docker is forbidden** (CLAUDE.md §7) |
| Node | v24.19.0 on the development machine |

Phase-deferred per DOC2 §45 (approved, not removed): Sanity CMS (content modules are
shaped 1:1 for it), PostHog (analytics adapter is ready), Cloudinary, Three.js.
shadcn/ui is approved, but no shadcn component turned out to be needed.

---

# 5. ARCHITECTURE

```
Visitor -> (Cloudflare) -> Vercel / Next.js
                              |  Server Actions only - no /api routes exist
            +-----------------+-----------------+------------------+
            v                 v                 v                  v
     Supabase Postgres   Supabase Storage     Resend        Cloudflare Turnstile
     (leads, events)     (private resumes)    (team email)  (server-side verify)
```

Hard boundaries:

- The browser **never** reaches Postgres. RLS is on with **no policy**; all access is
  server-side through the service-role key.
- `src/lib/db/client.ts` imports `server-only`, so importing it into a client
  component **fails the build** rather than shipping the key to the browser.
- Content never depends on animation: reduced motion, a failed timeline fetch, or no
  JavaScript all still give a complete, navigable site (DOC5 §5.34).

---

# 6. FRONTEND ARCHITECTURE

```
src/
  app/                 routes, layout, globals.css (tokens), sitemap, robots,
                       manifest, icon / apple-icon / opengraph-image PNGs
  components/
    brand/Logo.tsx     supplied mark (never redrawn) + Sora wordmark + mint rule
    navigation/        Header (primary nav = Software + Recruiting ONLY; overlay
                       menu = Software, Recruiting, About, Contact), Footer
    hero/              Hero.tsx (scroll-driven canvas), HeroStatic.tsx (fallback)
    sections/          one file per homepage / interior section
    forms/             ContactForm, ProjectForm, RecruitingForm, ResumeUpload,
                       Field (primitives), Turnstile, Attribution
    providers/         SmoothScroll (Lenis + GSAP, dynamically imported)
    ui/Reveal.tsx      scroll reveal
  config/site.ts       brand facts; null = omitted (TODO(business-facts))
  content/             services.ts, recruiting.ts, projects.ts, testimonials.ts
  lib/
    actions/           submitLead.ts ("use server": the 3 async actions ONLY),
                       formState.ts (FormState type + IDLE — must NOT live in the
                       "use server" file, see §15 B1)
    analytics/track.ts trackEvent() adapter — no vendor attached yet
    db/ email/ security/ validation/ hero/
    encoding.test.ts   guard against source-file encoding corruption (§15 bug 10)
```

Key behaviours:

- **Header**: transparent over the hero, gains a surface on scroll. Below `md` the
  primary nav is hidden and the hamburger is the only navigation. Focus trap, Escape
  closes, focus returns to the trigger, body scroll lock.
- **Reveal**: uses an rAF-throttled *position check*, not IntersectionObserver — see
  §15 bug 6. A `<noscript>` rule in the layout forces reveals visible without JS.
- **Forms**: inline at the conversion points — project form inside FinalCTA (`#start`)
  on `/` and `/software`; recruiting form at `/recruiting#apply`; contact form on
  `/contact`. The conditional "Other" field is **unmounted** when not selected (a
  hidden input would still submit a stale value).
- **Attribution**: first-touch `source` + 5 UTM parameters captured into
  `sessionStorage` and submitted as hidden inputs, so a campaign visitor who browses
  before submitting keeps the original attribution.
- **Analytics**: `*_form_started` (on first focus), `*_form_submitted`,
  `resume_selected`, `form_submit_failed`. No personal data in any payload, not even
  filenames (they usually contain the candidate's name).

Hero details are in §24.

---

# 7. BACKEND ARCHITECTURE

All in `src/lib/actions/submitLead.ts` — three Server Actions:
`submitRecruiting`, `submitProject`, `submitContact`.

Per-submission sequence (DOC5 §5.19):

1. Zod re-validation with the **same schema** the client used (the client is never trusted)
2. Rate limit — 5 per minute per IP per form (in-memory, per instance — see §16)
3. Turnstile — token exchanged server-side with Cloudflare; **fails closed** if the
   secret is missing or Cloudflare is unreachable
4. Duplicate check — same email + same lead type within **30 minutes** → a
   `DUPLICATE_SUBMISSION` event is recorded on the existing lead, success is returned,
   nothing new is created (DOC4 §4.26 puts this in business logic, deliberately not a
   `UNIQUE(email)` constraint)
5. Insert the `leads` row, then the detail row (`recruiting_leads` / `software_leads`).
   supabase-js has no transactions, so a failed detail insert triggers a
   **compensating delete** of the parent lead
6. Resume (recruiting only, optional): MIME + size + **`%PDF-` magic bytes**,
   sanitised filename, storage path `<leadId>/<timestamp>-<name>.pdf` built
   server-side, private bucket; the object is removed if the metadata insert fails.
   A failed optional upload does NOT fail the submission — the user is told plainly
7. `lead_events` row (`FORM_SUBMITTED`)
8. Team notification email, plus an optional confirmation (`SEND_CONFIRMATION_EMAIL`).
   Email failure is logged and **never loses the lead**

User-facing errors are generic; no database detail or IDs ever reach the visitor.

---

# 8. DATABASE ARCHITECTURE

File: `supabase/migrations/0001_init.sql` — implements DOC4 §4.31 / §4.32 verbatim.

- Tables: `leads` (central), `recruiting_leads`, `software_leads`, `resume_files`,
  `lead_events`, `lead_notes`, `admin_users`
- UUID keys; CHECK constraints on `lead_type`, `status`, `consent_status`;
  13 indexes; `updated_at` trigger
- `leads.email` is **NOT NULL** (decision D1)
- RLS enabled on every table with **no policy**, plus `revoke all` from `anon` and
  `authenticated` as a second layer. **Do not add a permissive policy** — it would
  expose resumes, visa status and contact details to anyone holding the anon key
- Creates the private bucket `resumes`: 10 MB limit, `application/pdf` only
- Deliberately NOT created (DOC4 §4.4): the `outreach_*` tables

**STATUS: NOT APPLIED.** Verified 2026-09-25: all seven tables and the bucket are
missing from the staging project. See §18 A for how to apply it.

---

# 9. FEATURES

## Completed

- [x] Repository and hero-asset audit, implementation plan (`Reports/Implementation_Plan.md`)
- [x] Scaffold, design tokens, fonts, layout shell, 404 / error / loading
- [x] Hero asset pipeline (panel geometry derived from the frames) and hero sequence
- [x] Six clickable hero panels (no hover effect, keyboard accessible)
- [x] All homepage sections; `/software`, `/recruiting`, `/about`, `/contact`,
      `/privacy`, `/terms`
- [x] Database migration (written), server actions, storage, email, Turnstile,
      rate limiting, duplicate detection
- [x] All three forms, with loading / success / error / retry states
- [x] SEO: metadata, canonical, OG image, sitemap, robots, manifest, favicon set
- [x] Analytics adapter and lead attribution
- [x] WCAG A/AA audit clean on every route
- [x] Performance: GSAP/Lenis dynamically imported; hero assets as tiered WebP
- [x] B1 fix — `FormState`/`IDLE` moved out of the `"use server"` module (other developer)
- [x] D4 staging audit — services reachable; schema and email blocked (other developer's agent)
- [x] Encoding repair — 124 corrupted characters in 22 files, plus a regression test

## Blocked / pending

- [ ] Apply the migration to staging (owner) — §18 A
- [ ] A usable Resend sender (owner — depends on having a domain) — §18 B
- [ ] Trace a real submission end to end, including the duplicate path (agent, once
      A and B are done)
- [ ] Business facts (owner) — §18 D
- [ ] Decide the Testimonials section (owner) — §18 C

---

# 10. API CONTRACTS (Server Actions)

All three take `(prevState: FormState, formData: FormData)` and return `FormState`:

```ts
// src/lib/actions/formState.ts
interface FormState {
  status: "idle" | "success" | "error";
  message?: string;                 // safe to display
  errors?: Record<string, string>;  // field name -> message
  retryable?: boolean;
}
```

Fields (schemas in `src/lib/validation/schemas.ts`, covered by 30 unit tests):

- **Recruiting** — required: `name`, `email`, `consent`, `turnstileToken`. Optional:
  `phone`, `education`, `university`, `graduationYear`, `visaStatus`, `targetRole`,
  `preferredIndustry`, `location`, `linkedinUrl`, `additionalInformation`, `resume`
  (file, PDF, max 10 MB).
- **Project** — required: `name`, `email`, `projectType` (one of the 9 services or
  `OTHER`), `projectDescription` (at least 10 chars), `consent`, `turnstileToken`.
  Optional: `phone`, `company`, `additionalInformation`. `otherProjectType` is
  required only when `OTHER` is chosen, and **stripped by the schema** otherwise.
- **Contact** — required: `topic` (`software` | `recruiting`), `name`, `email`,
  `message`, `consent`, `turnstileToken`. Optional: `phone`.
- All three accept hidden attribution fields: `source`, `utmSource`, `utmMedium`,
  `utmCampaign`, `utmContent`, `utmTerm`.

---

# 11. IMPORTANT DECISIONS

Owner decisions D1–D6 were escalated and answered on 2026-09-18
(full reasoning in `Reports/Implementation_Plan.md` §9).

| # | Question | Outcome |
|---|---|---|
| D1 | Is recruiting email required? (DOC4 said NOT NULL; the brief said optional) | **Required.** Schema unchanged |
| D2 | Business facts (contact, socials, domain, legal entity) | **Not available — omit, never invent** |
| D3 | Data-retention period | **Not set — privacy page states the basis, not a period** |
| D4 | Service credentials | Build first, verify later. **Partially supplied since — see §18** |
| D5 | clip3 uses a serif and a sage "We build it." (off-brand) | **Preserve the supplied frames** |
| D6 | Resume formats | **PDF only** (tighter than DOC5; there is no malware scanning) |

Other decisions:

1. **Nine-service catalog** supersedes the older lists (owner instruction).
2. **Obsidian = `#0B0B0B`** — the brand board and the brief agree; the DOCX's
   `#080B0B` is the outlier.
3. **No public authentication** — the architecture defines no accounts.
4. **Sanity and PostHog deferred**, not removed — seams exist for both.
5. **Flat logo marks**, not the mint-gradient variants — the brief forbids glow and
   gradient on the dark logo. The wordmark is live Sora 600 text, which is how the
   brand kit defines it.
6. **No fabricated testimonials or case studies.** DOC1 §14, DOC2 §37, DOC3.1 Risk 4
   and brief §53 all forbid it. `content/projects.ts` keeps empty, principled
   `projects` and `testimonials` arrays with `status` / `verified` fields.
   **This decision was overridden on 2026-09-26 (`f8e1f65`) by another developer —
   see §18 C. The owner has not yet ruled.**
7. **Server Actions, not `/api` routes.** Earlier drafts of this file listed
   `/api/leads/*` endpoints; they were never built and should not be.
8. **Graphite is never a text colour on dark surfaces** — see §12.
9. **Derived hero assets are not committed** — `prebuild` regenerates them from the
   committed `clips/*.zip`.

---

# 12. DESIGN SYSTEM

Sources: `assets/brand/GENRA_Brand_Kit_DOC.docx`, `assets/brand/brand_kit_img_main.png`.
Tokens live only in `src/app/globals.css` (`@theme`). Never hardcode colours.

| Token | Hex | Use |
|---|---|---|
| Obsidian | `#0B0B0B` | Primary background (the site is dark-first) |
| Ivory | `#F5F4EF` | Primary text on dark |
| Mint | `#34D399` | Signal accent — CTAs, rules, active states. Never a wash |
| Deep Mint | `#10B981` | Hover |
| Graphite | `#374151` | **Borders, dividers, icons, disabled backgrounds ONLY** |
| Silver | `#D1D5DB` | Secondary and tertiary **text** on dark |
| Card dark / line dark | `#111615` / `#1F2926` | Surfaces, hairlines |

**Graphite on Obsidian is about 1.9:1 against a 4.5:1 requirement.** An axe audit
flagged it on every route. All text that used it now uses Silver (about 12.9:1).

Typography: Sora 600 for display and headings, Inter for body and UI (via `next/font`).
Scale tokens: `text-display`, `text-h2`, `text-h3`, `text-body-lg`, `text-body`,
`text-caption`, `text-eyebrow`.

Visual rules from the brief: dark, minimal, editorial, lots of negative space, thin
dividers, restrained mint. **Forbidden:** purple/blue gradients, neon, glow, robots,
glowing brains, circuit boards, neural-net imagery, an icon per paragraph, repetitive
card grids, stock people, fake dashboards, logo walls.

---

# 13. SECURITY RULES

- Server-side Zod on every action; client validation is UX only
- Turnstile verified server-side, failing closed; a client token is never proof
- Rate limiting on every public action
- Resume: extension + MIME + size + magic bytes; sanitised filename; server-built
  path; private bucket; never logged; never emailed
- RLS on with no policy; the service-role key is server-only behind `server-only`
- Secrets only in `.env.local` (gitignored; `.env.example` is the committed template)
- Attribution/UTM values are recorded for reporting only — never trusted for anything
- Generic user-facing errors; no IDs or database detail

**Never write a secret, key, token, password, connection string or personal email
address into this file or any tracked file.** The repository is public.

---

# 14. TESTING STATUS

| Suite | Command | Result 2026-09-27 |
|---|---|---|
| Typecheck | `npm run typecheck` | clean |
| Lint | `npm run lint` | clean |
| Unit (Vitest) | `npm test` | **33 pass** — 30 validation + 3 encoding guard |
| E2E (Playwright) | `npm run e2e` | **119 passed, 4 skipped (123 total), exit 0** |

E2E runs on **desktop, tablet (Chromium at an iPad viewport) and mobile (Pixel 7)**, and
builds and serves production on **port 3100** (never 3000 — see §22). Specs:

- `navigation.spec.ts` — the header-contents rule, overlay menu, Escape and focus
  return, every route returns 200 with exactly one `h1`, branded 404, no horizontal
  overflow
- `hero.spec.ts` — the opening frame paints with **no scroll** (checked in pixels), six
  panels with correct routing, exactly one active at a time, click navigates, hover is
  inert, Enter activates, reduced motion gets the static hero
- `forms.spec.ts` — exact dropdown catalog, Other field appears and its value is
  removed on deselect, required vs optional fields, PDF-only, oversize rejected,
  attribution captured and surviving cross-page navigation, contact topic switch, labels
- `accessibility.spec.ts` — axe WCAG 2.0/2.1 A+AA on every route and the 404, plus
  keyboard reachability of the recruiting form

The 4 skips are desktop-only interactions (hover, keyboard) correctly skipped on mobile.

**What is NOT tested, and why:** any successful submission, database write, upload or
email. There is no schema and no usable sender, so such a test would either fail or
be faked. Add submit-path E2E once §18 A and B are unblocked — the actions already
return typed states to assert against.

---

# 15. KNOWN BUGS — history (all fixed) and lessons

Recorded so the same mistakes are not repeated.

| # | Bug | Root cause | Fix |
|---|---|---|---|
| 1 | Hero pipeline assumed a static camera | The camera **pushes in** during clip2 | Full frames; luminance detection with the workstation excluded |
| 2 | Panel detection found 4 runs, not 6 | Panels collapse to a thin streak; 1-frame troughs were absorbed by gap tolerance | Split runs on bbox **height**, zero gap tolerance |
| 3 | Header nav overlapped the logo at 375px | Too wide | Primary nav hidden below `md` |
| 4 | Overlay menu clipped on short screens | No overflow handling | Scrollable panel |
| 5 | Process line invisible, and invalid HTML | Negative z-index; a `<span>` directly inside `<ol>` | Line moved to a wrapper |
| 6 | **Scroll reveals left content permanently invisible** | IntersectionObserver never fires for elements jumped past (reload, back, anchor link) | rAF position check + `<noscript>` fallback |
| 7 | Graphite text failed WCAG on every route | Brand-kit colour unreadable on dark | Silver for text |
| 8 | **Hero stayed black until the first scroll** | First paint ran before any frame loaded, with no repaint trigger | `onFrameLoad` → stable `repaint` |
| 9 | An aborted fetch downgraded everyone to the static hero | The abort rejection ran `setTimeline(null)` over the good result | Check `signal.aborted` |
| B1 | **Every Server Action broke at runtime** | `IDLE` (an object) exported from a `"use server"` file — Next forbids non-async exports there | Moved to `formState.ts` (fixed by the other developer, 2026-09-24) |
| 10 | **124 corrupted characters in 22 files, visible on the live site** (em dash, section sign, ellipsis, copyright and middle dot all double-encoded; a BOM prepended) | A bulk edit via Windows PowerShell 5.1 read UTF-8 as Windows-1252, then wrote it back as UTF-8 | Exact byte-level inversion, verified as zero unexplained diff against the pre-corruption commit; `src/lib/encoding.test.ts` guard added (2026-09-27) |

Bug 10 was introduced in `ffa4fc4` (2026-09-18) and was visible in the About and Terms
body copy, the `/recruiting` browser-tab and Open Graph titles, form placeholders
("Select…", "Submitting…") and the header's screen-reader label.

Lessons that generalise:

- **Tests that scroll first cannot catch "it never starts" bugs** (8). Assert on what
  the visitor sees first — in pixels if necessary.
- **Tests with no submit path cannot catch Server Action runtime errors** (B1).
- **No test read the raw copy**, so corrupted text shipped (10). The encoding guard
  now does.
- Check the viewport width before trusting an overflow reading — the preview pane
  sometimes reports 0 and produces false positives.

---

# 16. KNOWN LIMITATIONS

- The rate limiter is **in-memory, per serverless instance** — a speed bump, not a
  guarantee. Move it to a shared store or Cloudflare rate limiting before relying on it.
- No malware scanning of uploads — mitigated by PDF-only plus the magic-byte check.
- `Documents/DOC3 PRD-Application_Architecture.md` is 0 bytes; DOC3.1 is the real document.
- No GENRA brand-resolution frames were supplied; that beat is built in DOM.
- clip3's closing card is serif and sage, off-brand — preserved per D5.
- Tablet E2E runs on Chromium, not WebKit (`npx playwright install webkit` adds Safari).
- At near-square viewports `object-fit: cover` crops the hero noticeably — intended.

---

# 17. COMMIT HISTORY (branch `arsh`)

| Commit | Date | Author | Summary |
|---|---|---|---|
| `9797745`…`cadf25d` | 09-13 to 09-15 | owner / MohdHamza2 | Initial repo, docs, agent rules, brand kit assets |
| `3198c77`, `f88f07b` | 09-17 | owner | Hero clip archives; PR #1 |
| `671c937` | 09-18 | agent | Audit + implementation plan |
| `b1729dc` | 09-18 | agent | Scaffold, tokens, layout shell, hero asset pipeline |
| `cb9ac71` | 09-18 | agent | Scroll-driven hero, clickable panels |
| `7578bb2` | 09-18 | agent | Homepage sections |
| `680980b` | 09-18 | agent | Interior + legal pages, validation schemas |
| `21c6c8b` | 09-18 | agent | DB schema, server actions, storage, email, Turnstile |
| `d5c3980` | 09-18 | agent | Sitemap, robots |
| `14dddca` | 09-18 | agent | Recruiting + project forms, E2E suite |
| `713e2ac` | 09-18 | agent | Dynamic GSAP/Lenis, E2E on port 3100, README |
| `ffa4fc4` | 09-18 | agent | WCAG contrast fix, brand icons, a11y audit — **also introduced bug 10** |
| `54869f7` | 09-18 | agent | Analytics, attribution, duplicate detection |
| `24ec769` | 09-18 | agent | Hero paints on load; abort race fixed |
| `ec112cb` | 09-18 | MohdHamza2 | PR #2 (arsh → main) |
| `73dfc0e`, `a190e48` | 09-24 | MohdHamza2 | **B1** form-state fix and its record |
| `df73e65` | 09-25 | other agent | **D4 staging audit — BLOCKED** |
| `f8e1f65` | 09-26 | MohdHamza2 | **Testimonials section (fabricated content)** |
| `41e9cce` | 09-27 | owner | PR #3 (main → arsh) |
| `ef53837` | 09-27 | agent | **Bug 10** encoding repair + `encoding.test.ts` guard |
| (docs commit after `ef53837`) | 09-27 | agent | This complete Brain.md rewrite + Progress.md update |

---

# 18. CURRENT BLOCKERS AND OPEN ISSUES

## A. Migration not applied — BLOCKS all backend verification

Supabase's REST gateway cannot execute SQL (nine endpoints were probed, all 404/401).
The owner must do ONE of:

1. Supabase dashboard → SQL Editor → paste the whole of
   `supabase/migrations/0001_init.sql` → Run. (Simplest.)
2. Give the agent a Postgres connection string so it can run the file with `psql`.
3. Install the Supabase CLI, `supabase link`, then `supabase db push`.

Then verify: seven tables exist, bucket `resumes` exists and is private, anon reads
are denied.

## B. Email sender unusable

`RESEND_FROM` is set to a gmail.com address. Resend only sends from domains verified
in the account, and gmail.com cannot be verified, so sends fail with
`validation_error` (leads are still saved — the code handles this). Options:

- Verify a domain GENRA owns in Resend and set `RESEND_FROM` to an address on it.
  This needs the domain, which is itself a missing business fact (§18 D).
- For **staging only**, Resend's shared onboarding sender can typically send to the
  Resend account owner's own address. Check the current Resend docs before relying on it.

## C. Testimonials section contains fabricated testimonials — OWNER DECISION NEEDED

Added in `f8e1f65`. Three invented people ("Alex Morgan", "Jordan Patel",
"Daniel Reed") with invented quotes, live on the homepage under the subheading
*"A selection of feedback from clients who have worked with us."* GENRA has no
clients on record. The only disclosure is a small caption below the cards.

This conflicts with brief §53, DOC1 §14, DOC2 §37 and DOC3.1 Risk 4, which all forbid
publishing invented reviews as real, and it duplicates the empty `testimonials` array
in `src/content/projects.ts` (two `Testimonial` types now exist).

It passes the a11y audit and every test — the problem is truthfulness, not code.
**The agent has not changed it**; it is the owner's call. Recommendation: remove the
section, or keep the component and empty the array so it appears only once real,
verified feedback exists — and merge the two testimonial systems into one.

## D. Business facts missing (D2/D3)

Production domain, contact email/phone/address, social URLs, legal entity name,
data-retention period. Every insertion point is marked `TODO(business-facts)`
(`grep -rn "TODO(business-facts)" src .env.example`). Most live in
`src/config/site.ts`; filling a value there makes the UI appear automatically.

## E. Credentials are not in this clone

The D4 audit ran where the owner had a populated `.env.local`. This clone has none.
The required variables are listed in `.env.example`.

---

# 19. AGENT OWNERSHIP

- **Frontend** — pages, components, forms UI, a11y, animation, hero, browser testing.
- **Backend** — server actions, validation, Turnstile, rate limiting, storage handling, email.
- **Database** — schema, migrations, RLS, storage policies.

Follow `.agents/*.md`. Cross-boundary changes must be documented, not silently absorbed.
Other contributors also commit to this repo — check `git log` before assuming state.

---

# 20. CURRENT HANDOFF

## Last completed (2026-09-27)

1. Reviewed the 6 commits from the other developer (B1 fix, D4 audit, testimonials,
   two merges) and fast-forwarded local `arsh`, which was behind.
2. Found and repaired bug 10 (encoding corruption) across 22 files, added a
   regression test, and verified the fix in the browser on the production build.
3. Rewrote this file completely and updated `Reports/Progress.md`.

## Exact next actions

1. **Owner:** apply the migration (§18 A).
2. **Owner:** decide the Testimonials section (§18 C).
3. **Owner:** provide the `.env.local` values and a usable email sender (§18 B, E).
4. **Agent, once 1 and 3 are done:** submit each form for real and trace every row,
   object and email; submit twice to exercise duplicate detection; add submit-path
   E2E; record the results here.
5. **Owner, any time:** business facts (§18 D) → fill in `src/config/site.ts`.

## Warnings

- Do not claim the submit path works until step 4 is done.
- Never invent contact details, clients, testimonials, metrics or legal facts.
- Never edit source files with PowerShell 5.1 `Get-Content` / `Set-Content` (§22).

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
10. Update `Reports/Progress.md`.
11. Update `Brain.md`.
12. Never expose secrets.
13. Do not use Docker.
14. PostgreSQL is the preferred database.
15. Preserve project history.
16. Never push to `main`.
17. Never fabricate content.

---

# 22. ENVIRONMENT AND TOOLING GOTCHAS (Windows development machine)

- **Git was not on PATH** in agent PowerShell sessions. Prefix commands with
  `$env:Path = "C:\Program Files\Git\cmd;" + $env:Path`, or use a Bash shell.
- **Pushing:** `git push origin arsh` works when `GIT_TERMINAL_PROMPT=1` is set, so Git
  Credential Manager can use its cached credentials. Without it the push fails with
  "terminal prompts disabled" — that is not a permissions problem.
- **Windows PowerShell 5.1 corrupts UTF-8** when rewriting files with
  `Get-Content` / `Set-Content`: it reads them as Windows-1252 and adds a BOM. This
  caused bug 10. Use node, sed, a Bash shell, or an editor.
- **PowerShell here-strings** break on embedded double quotes in `git commit -m`; write
  the message to a file and use `git commit -F`.
- **Very long shell commands** fail with `ENAMETOOLONG`; write large files with an
  editor or file-writing tool instead of a giant heredoc.
- **The dev server's HMR degrades** over a long editing session; it served errors for
  code deleted hours earlier. Review with `npm run build && npm run start`
  (launch configuration `genra-prod` in `.claude/launch.json`).
- **E2E must not share port 3000** with a dev server — Playwright would reuse it, and
  on-demand compilation causes spurious hydration failures. The config uses 3100.
- The Playwright device `iPad (gen 7)` defaults to WebKit, which is not installed.
- `vite-tsconfig-paths` is ESM-only and breaks the Vitest config loader — a plain
  `resolve.alias` is used instead.
- npm prints `allow-scripts` warnings for sharp / esbuild / unrs-resolver; installs still work.
- Commit identity is set in the clone's local git config, not globally — set
  `user.name` / `user.email` in a fresh clone before committing.

---

# 23. SESSION HISTORY (how the project got here)

- **09-13 to 09-17** — The owner and MohdHamza2 created the repo: DOC1–DOC8 (PRD,
  stack, architecture, database, feature spec, implementation / testing / debugging
  protocols), the `.agents/` role files, `.claude/CLAUDE.md`, the brand kit, and three
  hero frame archives.
- **09-17** — An agent audited the repo (empty source tree), mapped the hero frames,
  resolved 10 documentation conflicts, escalated D1–D6, and wrote the implementation plan.
- **09-18** — The owner answered D1–D6. The agent built all 17 phases in sequence with
  browser verification at each step, found and fixed bugs 1–9, wrote the unit / E2E /
  a11y suites, and pushed everything to `arsh`. The owner merged `arsh` → `main` (PR #2).
- **09-24** — MohdHamza2 found and fixed B1 (Server Actions broken at runtime).
- **09-25** — The owner supplied credentials; another agent audited D4: services
  reachable, migration not applicable through REST, email sender unusable. Recorded
  honestly as BLOCKED.
- **09-26** — MohdHamza2 added the Testimonials section with fabricated content.
- **09-27** — The owner merged `main` → `arsh` (PR #3). The agent reviewed all incoming
  work, fixed bug 10, and rewrote this file for handoff to a new account.

---

# 24. HERO — HOW IT WORKS

Source: `clips/clip1fr.zip` (120 frames), `clip2fr.zip` (300), `clip3fr.zip` (120) —
1920x1080 JPEG sequences supplied by the owner. **Never modify these.**

`scripts/build-hero-assets.mjs` (runs as `prebuild`, idempotent; `--force` to rebuild):

- Keeps every 2nd frame → seq1 60, seq2 150, seq3 60 frames
- WebP at three widths: `sm` 828 / `md` 1280 / `lg` 1920 → about 1.6 / 3.1 / 5.3 MB
- Output: `public/hero/` (gitignored) + `timeline.json`
- Derives panel geometry **from the pixels**: luminance at least 28, the workstation
  region (x ≥ 268, y ≥ 148 at 480x270 analysis scale) excluded, runs split where the
  bbox height drops below 30, runs shorter than 10 frames discarded, clickable only at
  80% or more of peak height. **The build fails loudly** if it does not find exactly
  six panels.

Verified panel order (clip2 source frames): 1 MVP 10–46 · 2 SaaS 50–90 ·
3 Web Applications 92–135 · 4 AI-Powered 137–181 · 5 Automation 184–223 ·
6 Career & Recruiting 226–273. Panels 1–5 → `/software`; 6 → `/recruiting`.

Two measured facts the code depends on: **the camera pushes in** during clip2 (so
there is no static background plate), and **panels collapse to a thin streak between
cycles** rather than vanishing (so runs split on height, not presence).

Runtime (`src/components/hero/Hero.tsx`): a 600vh sticky container; ScrollTrigger only
reports progress (CSS sticky does the pinning). Progress bands: seq1 0–0.14 · seq2
0.14–0.62 · lift to brand 0.62–0.70 · GENRA brand beat 0.70–0.80 (built in DOM — no
frames were supplied) · lift 0.80–0.86 · seq3 closing card 0.86–1.0. Frames load
coarse-to-fine and each arrival triggers a repaint. Hotspots are `<Link>`s positioned
against the canvas's cover rect, with `pointer-events` and `tabIndex` enabled only
while a panel is settled. Reduced motion, or a failed timeline fetch → `HeroStatic`.

---

# 25. OWNER'S BUILD BRIEF — SUMMARY (the "prompt §N" references in code)

The brief was given in chat and is not otherwise in the repo. Key rules, by section:

- **§0 / §81** Inspect the repo docs first. Source-of-truth order: security → repo
  architecture → CLAUDE.md → agent files → DB docs → DOC1–8 → brand assets → the brief
  → judgement.
- **§1** Two service lines. Never invent guarantees, statistics, clients,
  testimonials, logos, team members, addresses, phone numbers, pricing, response
  times or privacy promises.
- **§2** Brand: GENRA; Obsidian / Ivory / Mint / Graphite / Silver; Sora; dark-first,
  minimal, premium, cinematic. Don't redesign the logo; the dark logo is flat, no glow.
- **§3** Messaging: "Build. Automate. Advance." · "You name it. We build it." ·
  "You focus. We execute." · "Automate what matters." · "You find the opportunity.
  We handle the applications."
- **§4** Routes `/`, `/software`, `/recruiting`, `/about`, `/contact`, plus the
  necessary system pages.
- **§5** Header: logo + **Software and Recruiting only**. No About, Contact, Start a
  Project or sign-up in the header. **§37**: secondary items go in the hamburger overlay.
- **§6** Homepage section order (see §2 of this file).
- **§7–§12** Hero from the owner's frames: "Have an Idea?" → upward page-like scroll
  (no zoom, fade or particles) → workstation (small, lower-right, static) → six panels
  with zero overlap → blank Obsidian → GENRA + BUILD. AUTOMATE. ADVANCE. →
  "You name it." (Ivory) "We build it." (Mint).
- **§11** Panels clickable, **no hover animation at all**, deterministic hotspots
  (no OCR), keyboard Enter/Space, visible focus, adequate touch targets.
- **§13** The Software/Recruiting split must be editorial, not two cards.
- **§14–§17** Nine-service catalog, presented editorially rather than as nine
  identical cards.
- **§18 / §51 / §52** Few strong visuals; no fake UI text; icons used sparingly.
- **§19** Process: Understand · Design · Build · Launch · Advance — no icon cards.
- **§21** "Built with modern technology." — no logo wall.
- **§22 / §54** "Ideas we've brought to life" — verified projects only, otherwise omit.
- **§24–§28** Recruiting: truthful; no job, interview or placement promises;
  **no "What We Don't Promise" section**; CTA "Get Started", never "Start a Project".
- **§29** Recruiting form (resolved by D1 / D6: email required, PDF only).
- **§30 / §31** Final CTA "Let's build something." containing the project form; the
  project-type dropdown is the 9 services + Other; Other reveals "Tell us what you have
  in mind"; a Career & Recruiting selection goes through the recruiting workflow.
- **§32 / §33** Form UX states; success says "Received." with no response-time promise.
- **§34–§36** Contact page functional without inventing details; About concise;
  footer shows verified links only.
- **§38** No auth unless the architecture requires it (it doesn't).
- **§39** Stack: Next.js, Tailwind, shadcn/ui, Motion, GSAP, Lenis, Supabase, Resend,
  Turnstile, Vercel, Vitest, Playwright.
- **§40–§44** Database per DOC4; private resume storage; Resend with graceful failure;
  server-side Turnstile; the full security list.
- **§45–§48** Responsive, accessible, reduced motion, a scroll-tied hero that doesn't
  hijack scrolling, performance.
- **§53** **Never generate fake content of any kind** — the rule §18 C concerns.
- **§55–§58** SEO; loading / error / retry states; branded 404 "Lost the path?";
  centralised design tokens.
- **§63–§65** Keep Brain.md and Progress.md current; test with Vitest + Playwright.
- **§66–§68** Required E2E coverage (all implemented — see §14).
- **§69** Build incrementally: audit → plan → foundation → hero → pages → backend →
  test → QA.
- **§79** No unrequested features (blog, chatbot, CRM, payments, and so on).
