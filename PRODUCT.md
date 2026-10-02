# Product

<!-- impeccable:product-schema 1 -->

Written 2026-10-03 by `/impeccable init`. Brain.md remains the project's
authoritative memory; this file records product truth for design work and must
agree with it.

## Platform

web

## Users

- **Primary — software clients.** Founders, small businesses and individuals
  who have an idea or an operational problem and need software built: MVPs,
  SaaS, web applications, business software, portfolio websites, AI-powered
  applications, automation. They arrive evaluating whether GENRA can be trusted
  to build the real thing, and their job on the site is to decide and send a
  project enquiry.
- **Secondary — candidates.** International students, recent graduates and
  early-career professionals targeting US employment, who want the repetitive
  job-application workload handled using information they supply. Their job on
  the site is to understand exactly what GENRA does and does not do, then submit
  a profile (and optionally a PDF resume).

When the two compete for attention on shared surfaces (the homepage), software
comes first; recruiting always keeps a clear, separate path (service 09 and
`/recruiting`).

## Product Purpose

The website is GENRA's public lead-acquisition layer for both service lines. It
converts visitors into qualified leads (project, recruiting and contact
enquiries) in a shared database a future CRM can consume. It is not a brochure:
success is a submitted, legitimate enquiry.

## Positioning

One team, two directions: the same studio that designs and builds software
also runs the job-application workflow for early-career candidates. GENRA
builds systems and handles execution — for founders who need a product shipped
and for candidates who need applications handled. Tagline: **Build. Automate.
Advance.** Core line: **You name it. We build it.**

## Operating Context

- Visitors browse on desktop monitors, laptops, tablets and phones, often
  arriving from campaign links (first-touch source and UTM parameters are
  captured).
- Conversion happens inline: the project form on `/` and `/software`, the
  recruiting form on `/recruiting`, the contact form on `/contact`.
- Submissions are validated server-side, spam-checked (Cloudflare Turnstile),
  stored in Supabase Postgres (resumes in a private bucket), and notified by
  email (Resend).

## Capabilities and Constraints

- Nine services, fixed order: 01 MVP Development, 02 SaaS Development, 03
  End-to-End Software Production, 04 Web Application, 05 Business Software, 06
  Portfolio Websites, 07 AI-Powered Applications, 08 Automation Systems, 09
  Career & Recruiting. Single source: `src/content/services.ts`.
- Routes: `/`, `/software`, `/recruiting`, `/about`, `/contact`, `/privacy`,
  `/terms`. No per-service pages, no blog, pricing, accounts, chatbot, CMS.
- Stack is fixed (Next.js App Router, React, TypeScript, Tailwind v4, Supabase,
  Resend, Turnstile). No Docker.
- Recruiting: no promise of jobs, interviews, offers or placement anywhere.
  Hiring decisions belong to employers. CTA is "Get Started", never "Start a
  Project".
- Undecided / not supplied (never invent): production domain, contact email,
  phone, address, social accounts, legal entity, data-retention period.
- The submit path has not yet been traced end to end against live services.

## Brand Commitments

- Name GENRA; existing mark in `public/brand/` (never redrawn); wordmark is
  Sora 600 text with a mint rule.
- Brand kit palette: Obsidian, Ivory, Mint, Graphite, Silver. Sora for display,
  Inter for body/UI (brand kit §4 — binding).
- Voice: concise, confident, factual. Lines in use: "Build. Automate.
  Advance.", "You name it. We build it.", "You focus. We execute.", "Automate
  what matters.", "You find the opportunity. We handle the applications."

## Evidence on Hand

- No verified clients, projects, case studies, testimonials, metrics, logos,
  awards or partnerships exist. None may be fabricated or implied.
- The homepage Testimonials section currently holds invented testimonials;
  owner decision (2026-10-03): render nothing until real, verified feedback
  exists.
- Photography: licensed Unsplash images, credited in
  `assets/images/SOURCES.md`.

## Product Principles

1. Truth over persuasion: every claim is something GENRA actually does.
2. Conversion is inline and low-friction; never bury a form.
3. Two lines, one company: software leads, recruiting is distinct but equal in
   clarity.
4. Content never depends on animation, JavaScript or a GPU.

## Accessibility & Inclusion

WCAG 2.1 AA on every route (axe-audited in E2E); full keyboard operation;
`prefers-reduced-motion` honoured with a complete static presentation; forms
labelled with linked, announced errors.
