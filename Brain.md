# PROJECT BRAIN

## PURPOSE

This file is the long-term memory of the entire project. Any new AI agent — or a
person picking this up from a different account — must read this file before making
changes. It is written so that someone with **no access to the original chat** can
continue immediately.

**Last fully rewritten: 2026-09-27**, against commit history up to and including the
encoding fix recorded in §15. **Updated 2026-10-03** for the major visual revision
(light theme, Molten Ring hero, image-led /software and /recruiting, recruiting
phone-required) and the agent-skill setup — see §26 for the full record of that
session; sections below were edited in place where the facts changed.

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
4. `npm install`, then `npm run build`, then serve with `npm run start`. **Review the
   site on the production build, not `npm run dev`** — see §22. (The old frame-hero
   `prebuild` step is gone; builds no longer regenerate anything.)
4a. Agent skills (§27) are NOT in git. Reinstall them in the project before design
   work: `npx skills experimental_install` (restores the six skills pinned in
   `skills-lock.json`) and `npx impeccable install --providers=claude --scope=project`.
   Then read `PRODUCT.md` and `DESIGN.md` at the repo root.
5. Verify the gate before touching anything: `npm run typecheck && npm run lint &&
   npm test && npm run e2e`. Expected results are in §14.
6. `.env.local` is NOT in git. Since 2026-10-05 this clone has one with the non-secret
   values; the owner pastes the secret key in themselves (§18 E). In a fresh clone,
   copy `.env.example` to `.env.local`. Never commit secrets, never ask for them in chat.
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
| `/` | Molten Ring service hero (§24) + the sections below |
| `/software` | Image-led hero → project form (`#start`) → nine-service catalog (`#services`) → process → capabilities |
| `/recruiting` | Image-led hero → recruiting form (`#apply`) → who it's for → 4-step process → what we ask for |
| `/about` | Concise; no invented history, team or founder |
| `/contact` | Contact form with a software/recruiting topic switch |
| `/privacy`, `/terms` | State only what the implementation actually does |
| 404, error, loading | Branded; safe messaging; CSS-only loading state |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, icons, OG image | SEO + PWA |

## Homepage section order (`src/app/page.tsx`)

ServiceHero (the nine services as a scroll-driven Molten Ring, §24) → SplitSection
("Two directions") → Process → BrandStatement ("Build. Automate. Advance.") →
Capabilities → SelectedWork (renders nothing while empty) → WorkThatMoves →
Testimonials (renders nothing until verified feedback exists, §18 C) →
RecruitingIntro → AboutPreview → FinalCTA (contains the project form).
WhatWeBuild was retired 2026-10-03: the hero is now the nine-service index.

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
| Frontend (all routes, light theme, Molten Ring hero, forms, a11y, SEO) | Done and verified (2026-10-03) |
| Backend code (server actions, validation, Turnstile, rate limit, email, storage) | **Verified live 2026-10-05**: both forms save real rows, the duplicate path works, PDFs land in the private bucket (§30). Email not yet (no sender) |
| Database | **Applied and verified 2026-10-05** (migrations 0001 to 0003, RLS deny-all, private `resumes` bucket). See §8, §30 |
| Email | API key valid — **sender address unusable** (gmail.com, see §18 B) |
| Business facts (domain, contact, socials, legal entity, retention) | **Not supplied** — omitted, never invented |
| Testimonials section | Fabricated entries removed; renders nothing until verified (owner, 2026-10-03) |

**Verified on 2026-10-03:** typecheck clean · lint clean · production build clean ·
**34 unit tests pass** · **E2E: see §14 for the latest full-suite result** across
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
| Animation | Lenis 1 (smooth scroll), a hand-written WebGL2 shader for the hero (no library), CSS transitions elsewhere. **GSAP and Motion were removed 2026-10-03** — their only consumers (the frame hero, the Reveal component) were replaced |
| Forms / validation | `useActionState` + Server Actions; Zod 3 schemas shared by client and server. React Hook Form is installed but NOT used |
| Database | Supabase Postgres via `@supabase/supabase-js` (service role, server-only) |
| Storage | Supabase Storage, private bucket `resumes` |
| Email | Resend |
| Spam protection | Cloudflare Turnstile (explicit render; no wrapper library) |
| Icons | Lucide React (used sparingly) |
| Tests | Vitest 2 (unit, jsdom) · Playwright (E2E) · `@axe-core/playwright` (a11y) |
| Image tooling | `sharp` (brand-icon script; also used by the hero E2E pixel check) |
| Photography | Unsplash (Unsplash License), WebP in `public/images/`, credited in `assets/images/SOURCES.md` |
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

Files: `supabase/migrations/0001_init.sql` (DOC4 §4.31 / §4.32 verbatim),
`0002_server_access_and_other_type.sql`, `0003_resume_files_lead_index.sql`.
Generated types: `src/lib/db/types.ts` (the server client is `SupabaseClient<Database>`;
regenerate after any schema change).

- Tables: `leads` (central), `recruiting_leads`, `software_leads`, `resume_files`,
  `lead_events`, `lead_notes`, `admin_users`
- UUID keys; CHECK constraints on `lead_type`, `status`, `consent_status`;
  13 indexes; `updated_at` trigger
- `leads.email` is **nullable** since 2026-10-03 (recruiting may give phone only), with
  `leads_contact_check: email is not null or phone is not null`. 0001 was amended in
  place, but the live project already had the older NOT NULL copy, so 0002 repeats
  the change. Project and contact enquiries still require email in the app schemas.
- 0002 also: `software_leads.other_project_type varchar(200)` with a CHECK that it is
  present exactly when `project_type = 'OTHER'`; explicit `service_role` grants;
  `touch_updated_at` pinned `search_path = ''` and not executable by anon.
- 0003: index on `resume_files.lead_id` (Supabase advisor).
- RLS enabled on every table with **no policy**, plus `revoke all` from `anon` and
  `authenticated` as a second layer. **Do not add a permissive policy** — it would
  expose resumes, visa status and contact details to anyone holding the anon key
- Creates the private bucket `resumes`: 10 MB limit, `application/pdf` only
- Deliberately NOT created (DOC4 §4.4): the `outreach_*` tables

**STATUS: APPLIED 2026-10-05** to Supabase project `epfqcoeyfqzuzvtprjhj` (the only
project; it had been paused and was restored). Migration history lists 0001, 0002,
0003. Verified: anon/authenticated hold zero table grants, RLS on everywhere with no
policy, no storage policies, bucket private / 10 MB / PDF only, security advisor
shows only the intended "RLS enabled, no policy" notices.

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

- [x] Apply the migration (agent, 2026-10-05 via Supabase MCP) — §8
- [x] Server secret key in `.env.local` (owner, 2026-10-05). Still needed in Vercel — §18 E
- [x] Live submission verified: `e2e/submission.spec.ts` 2/2 passed (2026-10-05)
- [ ] A usable Resend sender (owner — depends on having a domain) — §18 B
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

- **Recruiting** — required: `name`, `phone` (at least 7 digits), `consent`,
  `turnstileToken`. Optional: `email`, `education`, `university`, `graduationYear`, `visaStatus`, `targetRole`,
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
| D1 | Is recruiting email required? (DOC4 said NOT NULL; the brief said optional) | **Required** (2026-09-18). **Superseded 2026-10-03 for the recruiting form only: phone required, email optional** (owner) |
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

**Since 2026-10-03 the site is LIGHT-ONLY** (owner revision). The authoritative,
detailed system is **`DESIGN.md`** at the repo root (North Star "The Working
Drawing"), with product truth in **`PRODUCT.md`**. Summary:

Sources: `assets/brand/GENRA_Brand_Kit_DOC.docx`, `assets/brand/brand_kit_img_main.png`.
Tokens live only in `src/app/globals.css` (`@theme`). Components use the semantic
role tokens, never raw hex.

| Role token | Value | Use |
|---|---|---|
| `paper` | Ivory `#F5F4EF` | Every page background |
| `surface` | `#FFFFFF` | Inputs, the form success panel |
| `ink` | Obsidian `#0B0B0B` | Text, primary buttons (Ivory label), focus ring |
| `muted` | Graphite `#374151` | Secondary text (~9.4:1 on paper), button hover |
| `line` | Silver `#D1D5DB` | Hairlines, dividers, input borders |
| `mint` | `#34D399` | Rules, dots, the `text-accent` underline bar, active tick. **Never text** (~1.7:1 on Ivory) |

Since 2026-10-04: a second paper tone **`mist` `#EEEDE9`** (Ivory + 4% Graphite)
in grouped zones (homepage Process + BrandStatement, RecruitingIntro + AboutPreview;
/recruiting "how it works"; the footer), never alternating stripes; and one section
rhythm, the **`section-y`** utility (72px phone → 112px desktop padding), replacing
128–224px paddings and BrandStatement's full-screen height.

Rules: sentence-case headings; no eyebrow labels above headings; 4px corners on
everything except pill buttons; no shadows; mint is a mark, never a fill;
`text-action` (15px) for buttons/links. `cn()` (lib/utils) is taught the custom
type tokens so tailwind-merge does not drop them as "colours".

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

| Suite | Command | Result 2026-10-03 |
|---|---|---|
| Typecheck | `npm run typecheck` | clean |
| Lint | `npm run lint` | clean |
| Unit (Vitest) | `npm test` | **49 pass** (2026-10-05) — 29 validation + 15 server actions + 3 encoding guard + 2 `cn()` merge |
| E2E (Playwright) | `npm run e2e` | **127 passed, 8 skipped (135 total), exit 0** (2026-10-05, before the key). With the key, `submission.spec.ts` runs on desktop: **2/2 passed** (2026-10-05); it still skips on tablet/mobile by design |
| Build | `npm run build` | clean (run by the E2E web server) |

E2E runs on **desktop, tablet (Chromium at an iPad viewport) and mobile (Pixel 7)**, and
builds and serves production on **port 3100** (never 3000 — see §22). Specs:

- `navigation.spec.ts` — the header-contents rule, overlay menu, Escape and focus
  return, every route returns 200 with exactly one `h1`, branded 404, no horizontal
  overflow
- `hero.spec.ts` (rewritten 2026-10-03) — nine services in order, the ring paints
  with **no scroll** (screenshot pixels via sharp), scrolling advances 01→09, the page
  releases into the next section after 09 without looping, prev/next buttons, Explore
  link follows the service, the front-card link exists over the canvas, reduced
  motion gets nine plain links. Chromium runs SwiftShader so WebGL2 is real.
- `forms.spec.ts` — exact dropdown catalog, Other field appears and its value is
  removed on deselect, required vs optional fields, PDF-only, oversize rejected,
  attribution captured and surviving cross-page navigation, contact topic switch, labels
- `accessibility.spec.ts` — axe WCAG 2.0/2.1 A+AA on every route and the 404, plus
  keyboard reachability of the recruiting form

The 2 skips are desktop-only interactions correctly skipped on mobile.

- `submission.spec.ts` (2026-10-05) — LIVE: software enquiry with Other (+ resubmit →
  one lead and a DUPLICATE_SUBMISSION event), recruiting phone-only with a PDF
  (row, resume_files, object bytes, no public or keyless access). Desktop only;
  skips without `SUPABASE_SERVICE_ROLE_KEY`; deletes everything it created.
- `src/lib/actions/submitLead.test.ts` (Vitest, node env) — guards before writes
  (validation, missing/invalid token, Turnstile unconfigured, rate limit), never a
  false success (no DB, lead insert fails, detail insert fails → compensating
  delete), typed rows (null email, Other column, duplicate), resume (private path,
  upsert off, fake PDF, oversize, orphan object removed).

**What is NOT tested yet:** email sending (no usable sender, §18 B).

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
| `d9a59ad` | 10-03 | agent | Agent-skill setup (not committed: skills); PRODUCT.md, DESIGN.md |
| `19329a7` | 10-03 | agent | Recruiting: phone required, email optional (schema, action, migration) |
| `3fb0d11` | 10-03 | agent | Light theme, Molten Ring hero, image-led /software and /recruiting |
| (docs commit after `3fb0d11`) | 10-03 | agent | Brain.md §24/§26/§27 + Progress.md entry 12 |
| `24195ea` | 10-05 | agent | **Supabase integration**: migrations 0002/0003 applied, typed client, action tests, live spec |
| (docs commit after `24195ea`) | 10-05 | agent | Brain.md §30 and status sections + Progress.md entry 16 |

---

# 18. CURRENT BLOCKERS AND OPEN ISSUES

## A. Migration not applied — RESOLVED 2026-10-05

Applied through the Supabase MCP (`apply_migration`), so it is now in the project's
migration history. Future schema changes: new numbered file in
`supabase/migrations/`, apply it the same way, run the advisors, regenerate
`src/lib/db/types.ts`. See §8 and §30.

## B. Email sender unusable

`RESEND_FROM` is set to a gmail.com address. Resend only sends from domains verified
in the account, and gmail.com cannot be verified, so sends fail with
`validation_error` (leads are still saved — the code handles this). Options:

- Verify a domain GENRA owns in Resend and set `RESEND_FROM` to an address on it.
  This needs the domain, which is itself a missing business fact (§18 D).
- For **staging only**, Resend's shared onboarding sender can typically send to the
  Resend account owner's own address. Check the current Resend docs before relying on it.

## C. Testimonials — RESOLVED 2026-10-03

Owner decision: render nothing until real, verified feedback exists. The invented
entries and `content/testimonials.ts` were deleted; the component now reads the
single `testimonials` array in `content/projects.ts` and shows only
`status: "published"` + `verified: true` entries. History of the issue follows.

### (history) Testimonials section contained fabricated testimonials

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

## E. Server secret key — RESOLVED locally 2026-10-05, still needed in Vercel

This clone's `.env.local` (gitignored) holds the project URL, bucket name,
Cloudflare's always-pass Turnstile TEST keys and, since 2026-10-05, the owner's
`sb_secret_…` key (pasted by the owner; never read through the MCP or chat). Where the
key is missing, every submission shows an error (never a false success) and the
server logs `[submit] Supabase is not configured; lead not saved`.

Production (Vercel) needs: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`SUPABASE_RESUME_BUCKET=resumes`, the REAL Turnstile site key + secret (the test keys
accept a dummy token and must never reach production), and Resend values (§18 B).

---

# 19. AGENT OWNERSHIP

- **Frontend** — pages, components, forms UI, a11y, animation, hero, browser testing.
- **Backend** — server actions, validation, Turnstile, rate limiting, storage handling, email.
- **Database** — schema, migrations, RLS, storage policies.

Follow `.agents/*.md`. Cross-boundary changes must be documented, not silently absorbed.
Other contributors also commit to this repo — check `git log` before assuming state.

---

# 20. CURRENT HANDOFF

## Last completed (2026-10-05) — Supabase backend integration, see §30

Migrations 0001 to 0003 applied and verified on the live project; generated DB types;
typed inserts; "Other" project type stored in its own column; anon access proven
denied; 15 server-action unit tests; live submission E2E written (skips until the key
exists); `.env.local` created without the secret.

## Exact next actions

1. ~~Owner: server key in `.env.local`~~ done. ~~Agent: live spec~~ done, 2/2 passed.
2. **Owner, before launch:** real Turnstile keys, a Resend sender on a verified
   domain + team inbox (§18 B), and all env values in Vercel (§18 E).
3. **Agent, after 2:** submit once on the deployed site and confirm the row and the
   notification email; then run `submission.spec.ts` again.
4. **Owner/agent:** test the hero on a real phone and tablet (touch scroll, frame
   rate) — headless emulation cannot prove gesture feel.
5. **Owner, any time:** business facts (§18 D) → fill in `src/config/site.ts`.
6. Future task: a mobile/touch version of the robot interaction (owner asked for
   desktop first; on touch and below 1024px the robot is not shown).

## Warnings

- Do not claim email works until a real notification has arrived.
- Never invent contact details, clients, testimonials, metrics or legal facts.
- Never edit source files with PowerShell 5.1 `Get-Content` / `Set-Content` (§22).

---

# 30. SESSION 2026-10-05 — SUPABASE BACKEND INTEGRATION (record)

Owner brief: connect the software and recruiting forms to the EXISTING Supabase
project end to end (no new project, no secrets in chat, RLS on, private resumes,
server-side Turnstile, honest success/error states, generated types, tests).

Found on inspection:
- One project, `epfqcoeyfqzuzvtprjhj`, PAUSED. Restored it (no data existed).
- The schema and bucket were already there from a manual run of an OLDER 0001:
  `leads.email` NOT NULL and no `leads_contact_check`, so a phone-only recruiting
  lead would have failed. Migration history was empty.
- anon/authenticated already had no grants; service_role had grants; no policies.
- `touch_updated_at` had a mutable search_path and was executable by anon.
- The app never uses the anon/publishable key (all access is server-side).

Done:
- 0001 re-applied through `apply_migration` (idempotent) to record history; 0002
  (nullable email + contact check, `other_project_type` + check, explicit
  service_role grants, hardened function); 0003 (`resume_files.lead_id` index).
  The "Other" text used to be merged into `additional_information`; it now has its
  own column.
- Verified in SQL: valid app-shaped rows insert; no-contact, OTHER-without-detail
  and bad lead_type are rejected; delete cascades (run in a rolled-back block).
- Public-key probe (REST + Storage, 16 calls): every read, insert, update, delete,
  RPC, upload, list, public URL and bucket lookup refused.
- `src/lib/db/types.ts` generated; client is `SupabaseClient<Database>`; detail rows
  typed per table (`LeadDetail` union); event metadata typed as `Json`.
- `createLead` now logs `[submit] Supabase is not configured; lead not saved`.
- Client bundle scan: only the public Turnstile site key; no secret, no server code.
- Real headless browser on the production build: Turnstile test widget issues a
  token, the server verifies it with Cloudflare, the form then shows the honest
  error (no key yet); a stripped token and an invalid phone are refused.
- `vitest.setup.ts`: browser shims guarded so node-environment tests can share it.

Live verification (after the owner added the key, same day):
- `submission.spec.ts` on desktop: **2/2 passed** — software Other + resubmit (one
  lead, FORM_SUBMITTED + DUPLICATE_SUBMISSION), recruiting phone-only + PDF (row,
  resume_files, object bytes read back, public and keyless URLs refused). Its
  cleanup ran (0 rows, 0 objects after).
- First run failed on a TEST bug: a second `goto` to the same `#hash` URL only
  scrolls, so the success screen stayed. Fixed with a reload.
- Manual browser submissions of both forms, then rows read in SQL: recruiting
  email null + phone + CONSENTED + detail row + event; software OTHER with
  `other_project_type` and description. Deleted afterwards. No server errors.
- Client bundle re-scanned with the key present: no secret.

Decisions:
- Keep the service-role, server-only architecture. Anon insert policies were
  rejected: they would let anyone write leads while skipping Turnstile.
- No signed-URL code: nothing reads resumes yet. Generate signed URLs server-side
  when the internal dashboard exists.
- Cloudflare test keys in `.env.local` only. They accept a dummy token: production
  must use real keys.

Gotchas:
- A hidden Browser pane never loads `lazyOnload` scripts (Turnstile) — use headless
  Playwright for form checks, as with the WebGL hero.
- `next build` while `next start` serves the same `.next` breaks the running
  server: stop the preview before building.

---

# 26. SESSION 2026-10-03 — MAJOR VISUAL REVISION (record)

Owner brief: replace the homepage hero with the supplied MoltenRingCarousel as a
nine-service scroll narrative; switch the site to a light theme; give /software and
/recruiting distinct image-led heroes followed immediately by a CTA and the form;
no robot yet; no placeholder images; no invented facts. Then: install and use the
Impeccable, Vercel, Taste and Emil Kowalski agent skills.

Owner decisions taken this session (via structured questions):
- Recruiting form: **phone required, email optional** (supersedes D1 for that form).
- Images: **Unsplash, downloaded and committed** as optimised WebP (11 files).
- Skills: **not committed** to git; `skills-lock.json` is (§27).
- Positioning: **"Build + careers, one team"**; homepage priority **software first**.
- Testimonials: **render nothing until real**.
- Design: North Star **"The Working Drawing"**, **sentence-case** headings,
  **sharp corners + pill buttons**.

What changed, by area:
- **Theme:** semantic role tokens (§12), every component converted, black logo
  default, light `themeColor`/manifest, themed selection/caret/scrollbar, 4px radii,
  eyebrow labels removed site-wide (Impeccable craft floor bans them), uppercase
  display headings → sentence case, `text-action` token.
- **Hero:** §24. **Pages:** `SoftwareHero`, `RecruitingHero` (new), `FinalCTA` now
  takes `heading`/`lead`/`placement` so the same form section serves the homepage
  close and the /software lead; `PageHero` remains for /about only.
- **Motion (Emil review):** `Reveal` is now a CSS opacity fade only (no rise; the hero
  is the one authored motion moment) and no longer branches on reduced motion in
  render — that branch caused a **hydration mismatch** under reduced motion
  (pre-existing bug, fixed). Width-based hover animations converted to transforms;
  press feedback (`active:scale-[0.98]`) on primary buttons; caption swap 280ms.
- **Dependencies:** removed `gsap` and `motion` (no remaining consumers).
- **Backend/DB (coordinated cross-boundary change):** `recruitingSchema` (phone
  required, ≥7 digits; email optional), `submitRecruiting` (null email, duplicate
  detection by email or else phone, confirmation only when an email exists),
  `notify.ts` (nullable email, conditional reply-to), migration (nullable email +
  CHECK). Project and contact forms unchanged.
- **Bug found:** `cn()` (tailwind-merge) treated custom type tokens (`text-caption`,
  `text-action`, …) as colours and could silently drop them next to a colour class.
  Fixed with `extendTailwindMerge`; covered by `src/lib/utils.test.ts`.
- **Tests:** `e2e/hero.spec.ts` rewritten for the ring (order, painted pixels,
  progression, release after 09, buttons, links, reduced-motion fallback);
  recruiting required-fields test updated; Playwright Chromium runs SwiftShader so
  WebGL2 is exercised.

# 29. SESSION 2026-10-04 (2) — HERO ROBOT + THREE-ZONE COMPOSITION (record)

Owner brief with three references (a monkey hero for the "head follows the
cursor" behaviour only; two robot images for the general silhouette only):
add a genuinely 3D robot in the centre of the hero, body static and floating,
head and eyes following the cursor subtly and immediately; make the hero a
balanced text | robot | carousel composition; give the carousel cards subtle
rounded corners and a shadow that travels with the active card; desktop first.

Built:
- `src/components/hero/HeroRobot.tsx` — raw WebGL2 raymarcher (no 3D engine).
  Separate SDF parts: body (inverted egg, flat rounded top, mint seam), two
  detached arms, a floating head (ellipsoid) with a protruding glass visor and
  mint eyes painted in head space. Studio lighting: wrap diffuse, soft shadows,
  AO, warm floor bounce, a reflected softbox, ACES. Silhouette anti-aliasing by
  closest approach. Floor contact shadow lighter and wider as it floats up.
  Head: yaw ±7°, pitch ±4.5°, roll 18% of yaw; eyes ±0.045/0.03 on the visor.
  Smoothing: 1 − e^(−dt·26) (eyes 34), return 4. One passive window
  pointermove listener (mouse + fine pointer only); no React state per frame.
  Loop pauses off screen / hidden tab. Pixel budget 1M device px, adaptive
  render scale (drops 20% per step below ~45fps, floor 0.55, climbs back).
  Software renderer (SwiftShader/llvmpipe…) → no float, redraw only while the
  head moves. Canvas carries `data-robot` (and `data-ready` after frame 1).
- `ServiceHero.tsx` — at ≥1024px the caption container is a 3-column flex
  (gap clamp(2rem,4vw,4.5rem)); centre column mounts the robot (aspect 2:3,
  max-width 70svh·⅔); right column is an empty measured zone; the ring's
  focusX and cardHeight are computed from it (card ≤ 92% of the zone width).
- Ring: corner 2.4% of card height (~10px), front-card shadow in the shader
  (`uShadow`, `uLift[]`): drop 3%, blur 7.5%, opacity 15%, handed over by
  slot distance.

Verified: 1920×1080, 1440×900, 1366×768, 1280×720, 1024×768 — caption, robot,
card in order, no overlaps, balanced gaps; 768×1024 and 390×844 unchanged (no
robot). On the owner's AMD Radeon 740M at DPR 2: median and p95 frame 16.7ms
(steady 60fps) with the robot at 788×1180 px. E2E 127/2 skipped.

Gotchas: `next build` failed with "next/font/google queries have exactly one
entry" — root cause a stale Turbopack persistent cache; fixed by deleting
`.next/cache/turbopack` (regenerated). Hero tests must pick the ring canvas
with `canvas:not([data-robot])`. Parallel E2E on SwiftShader is slow:
heavy tests poll and use `test.slow()`; resume-upload tests retry the attach
(the first change event can land before hydration).

# 28. SESSION 2026-10-04 — HERO CARD SEPARATION, SPACING, TONE (record)

Owner refinement with two screenshots (current hero; a reference showing a
single independent card with empty space around it). Asked: separate the
carousel cards (no connecting shapes, no image-to-image fades, real gaps),
keep the animation and composition; tighten the post-hero section spacing
moderately; add very subtle tonal variation between sections; avoid em dashes
in copy; verify across devices. Not touched: backend, forms, database.

Done: §24 (liquid off, gaps), §12 (mist, `section-y`), em dashes removed from
the copy of the sections touched (WorkThatMoves, RecruitingIntro, AboutPreview,
`site.description`). DESIGN.md + sidecar updated (Two Papers Rule, gap rule,
em-dash Do). The em-dash preference is also saved in the owner's global
master prompt.

Gotcha: the dev server on port 3000 may belong to another Claude session in
this folder; `next dev` refuses a second instance (even on another port). Its
HMR serves your edits, so headless Playwright screenshots against :3000 work.
Programmatic `window.scrollTo` during a Lenis snap animation is overridden by
Lenis (real wheel and touch input are not); pause after a snap in scripts.

# 27. AGENT SKILLS (installed 2026-10-03, project scope, NOT in git)

| Source | Skills | Used for |
|---|---|---|
| pbakaus/impeccable (Apache-2.0) | `impeccable` (+4 helper agents, hooks in `.claude/settings.local.json`) | init → PRODUCT.md, document → DESIGN.md, craft floor, detector (`.claude/skills/impeccable/scripts/impeccable detect src`), audit/polish |
| vercel-labs/agent-skills (no licence published) | `vercel-react-best-practices`, `web-design-guidelines` | performance and interface-guideline review |
| Leonxlnx/taste-skill (MIT) | `design-taste-frontend`, `redesign-existing-projects` | anti-template audit before visual changes |
| emilkowalski/skills (MIT) | `emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `apple-design` | motion decisions and review |

Restore: `npx skills experimental_install` (reads `skills-lock.json`) and
`npx impeccable install --providers=claude --scope=project`. `.claude/skills/`,
`.claude/agents/impeccable-*.md`, `.claude/settings.local.json` and the 17MB
Impeccable engine binary are gitignored; ESLint ignores `.claude/` and `.impeccable/`.

**User-level skills (added 2026-10-04, outside this repo).** 69 skills were installed
to `~/.claude/skills` with `npx skills add <repo> -g -a claude-code -y -s <names>`, so they
apply to every project on this machine, not only GENRA. They include global copies of the
Vercel, Taste and Emil sets above, plus obra/superpowers (brainstorming, writing-plans,
executing-plans, systematic-debugging, test-driven-development,
verification-before-completion, code review, worktrees, parallel agents),
anthropics/skills (frontend-design, webapp-testing, mcp-builder, canvas-design,
algorithmic-art, theme-factory, web-artifacts-builder), vercel/ai `ai-sdk`, `shadcn`,
`tailwind-design-system`, GSAP (6), Three.js (3), `remotion-best-practices`, Supabase/Postgres
(2), Prisma (3), Better Auth (2), `stripe-best-practices`, n8n (6), `playwright-best-practices`,
Trail of Bits `supply-chain-risk-auditor` and `differential-review`, and coreyhaines31
marketing (seo-audit, ai-seo, schema, site-architecture, copywriting, copy-editing, cro).
`~/.claude/CLAUDE.md` maps each development step to its skills. Project docs override a
skill on conflict. `deploy-to-vercel` can upload project code, so it needs owner approval
every time. These skills are not pinned in `skills-lock.json`. On a new machine, rerun the
installs (`npx skills ls -g` shows the current set).

Skill conflicts resolved in favour of the brand/repo: Taste discourages Inter
(brand kit mandates Inter body — kept); Taste prefers Motion for scroll values (the
hero reads scroll once per frame without React state — same principle, no library);
Taste mandates dark mode (owner brief is light-only — kept light). Detector advisories
on `notify.ts` (inline email styles) are an accepted exception (documented in
DESIGN.md).

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
- **Agent Bash heredocs collapse `\\` to `\`.** A regex written through a heredoc
  lost its backslashes (`\d` became `d`) and broke silently. Write files with an
  editor/Write tool, or avoid backslashes in shell-generated code.
- **Git Bash rewrites `/path` arguments** to `C:/Program Files/Git/path` when
  calling Windows programs; use `MSYS_NO_PATHCONV=1` and Windows-style script paths.
- **The desktop app's Browser pane pauses `requestAnimationFrame` while hidden.**
  The hero then looks frozen. For visual checks use headless Playwright with
  `--use-angle=swiftshader --enable-unsafe-swiftshader` (as the E2E config does).
- `src/lib/actions/submitLead.ts` and some other files use CRLF line endings;
  scripted find/replace must normalise line endings first.

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

**Since 2026-10-03 the homepage hero is the Molten Ring** (owner-supplied
MoltenRingCarousel, crafterui, adapted). The old frame-sequence hero (clips,
`scripts/build-hero-assets.mjs`, `components/hero/Hero.tsx`, `lib/hero/*`, GSAP) was
removed entirely. `clips/*.zip` stay in the repo untouched as owner source assets.

Files:
- `src/components/ui/molten-ring-carousel.tsx` — the WebGL2 renderer. Shader and
  physics are the original's (rounded-box SDF cards fused by a smooth minimum,
  strands, cursor influence, glass band at the stage edges). Adapted: the ring is
  driven by `getTarget()` (read every frame) instead of its own wheel handler; it
  does **not wrap**; geometry is sized from stage height (radius max(1.5H, 3.2
  cards)); easing is time-normalised (`ease(rate)`, dt capped at 0.25s); the arrival
  runs on wall-clock time (2.2s); the loop stops when idle, off screen or in a hidden
  tab; backing store capped at 4.2M device px; atlas cell sized to the device and
  to MAX_TEXTURE_SIZE (3 columns). A real `<Link>` is positioned over the front card
  every frame (pointer hit target, `aria-hidden`, `tabIndex -1`). Mouse-only cursor
  effects and drag; touch is left to native page scroll (`touch-action: pan-y`).
  **Since 2026-10-04 the hero runs with `liquid={false}` and `glass={false}`**
  (owner: cards must be independent, with clear space between them). Liquid off
  means: no smooth-minimum fusion, no strands, no cursor fusion, no edge
  wobble or cursor ripple, a 1px art edge instead of a crossfade, the arrival
  starts 75% gathered instead of stacked (no card is ever drawn over another),
  and cursor lean/swell are damped to 35% so a hovered pair cannot close the
  gap. Spacing: gap = 7.5% of stage height, clamped 24–72px, and the
  centre-to-centre step is `(cardH + gap) / (1 − cardW / 2R)` so the gap holds
  on the INSIDE of the curve, where tilted cards come closest. Card height is
  0.54 of the stage side by side, 0.56 stacked; stacked stage sits 24px below
  the caption. The liquid path is still in the component (prop default true)
  in case the owner wants it back.
- `src/components/hero/ServiceHero.tsx` — the page integration. The section is
  `100svh + 8 × 70svh + 35svh` tall with a sticky stage; **each service owns 70svh of
  page scroll** and the last holds 35svh before release. After scroll stops inside the
  sequence it eases (Lenis, 0.6s) onto a service, direction-aware (12% commit), so one
  wheel notch advances. Past service 09 nothing snaps and the page continues into
  SplitSection. Caption (number, mint rule, line, title, description, Explore link,
  up/down buttons, nine ticks) is `aria-live`; an sr-only `<ol>` lists all nine.
  Layouts: **side by side** at ≥1024px or landscape phones (`side` variant), stacked
  otherwise; `short` variant tightens landscape phones.
- `src/components/hero/ServiceHeroStatic.tsx` — reduced motion, no WebGL2 (via
  `onUnsupported`) and no-JS (`<noscript>`) all get this: h1 "You name it. We build
  it." and the nine services as linked rows with images.
- `src/lib/scroll.ts` — `scrollToY()` goes through the registered Lenis instance
  (SmoothScroll registers it), falling back to native smooth scroll.
- Data: the nine entries in `src/content/services.ts` (now with `image`, `imageAlt`;
  `serviceHref()` → `/software` or `/recruiting`). Images: `public/images/services/*.webp`
  (768×1024, 3:4), credited in `assets/images/SOURCES.md`.

Verified 2026-10-03 (headless Chromium + SwiftShader, Playwright): 1920×1080,
1366×768, 1280×720-class, 1024×768, 768×1024, 390×844, 844×390 — no horizontal
overflow, correct caption at every step, release into the next section after 09,
static fallback under reduced motion and with WebGL disabled (all nine links and
images, no errors). **Not verified:** real touch gestures on a physical phone/tablet,
and frame rate on a real low-end GPU — do this on devices before launch.

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
