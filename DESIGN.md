---
name: GENRA
description: Build. Automate. Advance. A light, technical software studio.
colors:
  paper: "#f5f4ef"
  surface: "#ffffff"
  ink: "#0b0b0b"
  muted: "#374151"
  line: "#d1d5db"
  mint: "#34d399"
  mint-deep: "#10b981"
  error: "#b91c1c"
typography:
  display:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.6rem + 5.2vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.4rem + 2.6vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Sora, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 1.25rem + 1vw, 1.875rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  action:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0.04em"
rounded:
  sharp: "4px"
  pill: "9999px"
spacing:
  gutter: "24px"
  section: "160px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sharp}"
    padding: "14px 16px"
---

# Design System: GENRA

## Overview

**Creative North Star: "The Working Drawing"**

GENRA's pages read like an engineer's annotated drawing: ivory paper, black
ink, precise hairlines, numbered parts and a single mint mark where attention
belongs. Everything is set out plainly and exactly, because the product is
building things that work. Light theme only; the page never inverts mid-scroll.

The one place the drawing comes alive is the homepage hero, the Molten Ring:
nine service cards on a liquid arc that the visitor turns by scrolling. It is
the signature moment and carries the site's colour (photography). Everything
around it is calm: typography, rules and white space do the work that cards,
icons and gradients do on generic sites.

Real photography (credited Unsplash, art-directed per service) is used
selectively: the hero ring, and one image-led hero each on `/software` and
`/recruiting`. Never decorative stock, never generated "AI" imagery.

**Key Characteristics:**
- Ivory paper, Obsidian ink, Silver hairlines, Mint as a mark, never a fill.
- Sora 600 display in sentence case; Inter for reading.
- Structure from numbered rows and 1px rules, not from boxes.
- One signature motion (the ring); everywhere else motion only confirms.

## Colors

A monochrome working palette with one green signal.

### Primary
- **Drafting Mint** (#34d399): the mark. Hairline rules under links and
  headings, the active progress tick, the logo underline, selected-state dots.
  Never text, never a background fill, never a button.

### Neutral
- **Ivory Paper** (#f5f4ef): every page background.
- **Sheet White** (#ffffff): inputs and the rare raised surface (form success
  panel).
- **Obsidian Ink** (#0b0b0b): headings, body text, primary buttons, focus ring.
- **Graphite** (#374151): secondary text and button hover; about 9.4:1 on paper.
- **Silver Rule** (#d1d5db): hairlines, dividers, input borders, inactive
  progress ticks.
- **Error Red** (#b91c1c): form errors only.

### Named Rules
**The Mark Rule.** Mint covers well under 5% of any screen and is never used
for text: on Ivory it is about 1.7:1. Emphasis in text is Ink with a low mint
bar beneath it (the `text-accent` utility).

**The One Paper Rule.** Every section sits on Ivory. Depth comes from rules and
spacing, not from alternating section colours or dark bands.

## Typography

**Display Font:** Sora (with ui-sans-serif, system-ui)
**Body Font:** Inter (with ui-sans-serif, system-ui)

**Character:** Sora's geometric construction gives headings an engineered,
slightly technical presence; Inter keeps long reading quiet. Both are brand-kit
mandated (brand kit §4).

### Hierarchy
- **Display** (600, clamp 44 to 72px, 1.04, -0.03em): page H1s and the final
  call to action. Sentence case.
- **Headline** (600, clamp 32 to 44px, 1.1): section headings, max about 8 words.
- **Title** (600, clamp 24 to 30px, 1.2): list-row titles, form headings.
- **Body** (400, 16 to 18px, 1.6 to 1.65): paragraphs capped at about 65ch.
- **Action** (500 to 600, 15px, 1.4): buttons, text links and navigation
  (`text-action`).
- **Label** (500, 13px, +0.04em): form labels, captions, row numbers (tabular
  figures).

Transactional email HTML (`src/lib/email/notify.ts`) is a separate surface
with inline styles that cannot reference CSS tokens; its literal greys and
sizes are an accepted exception.

### Named Rules
**The Sentence Case Rule.** Headings are sentence case. Uppercase is reserved
for the small eyebrow label, and eyebrows are rationed: at most one per three
sections.

**The Numbered Part Rule.** Ordered content (services, process steps) carries
two-digit numbers (`01`) in tabular figures, like part callouts on a drawing.

## Layout

A single 84rem (1344px) wide container with 24px gutters; a 68rem container
for reading pages. Sections breathe: 128 to 208px vertical padding on desktop.
Composition is asymmetric: left-aligned headings with content offset into a
wider right column (`minmax(0,24rem) 1fr`), collapsing to one column below
1024px. The header is 80px and fixed.

The homepage hero has two compositions: **side by side** (laptops up, and
phones held landscape) with the caption left, the ring centre-right and the
right margin deliberately empty; and **stacked** (phones, portrait tablets)
with the caption on top and the ring below.

## Elevation & Depth

Flat. There are no shadows in the system. Depth is drawn: 1px Silver rules,
numbered rows, and white space. The only optical depth is inside the hero
ring's WebGL shader (the glass band at the stage edges).

### Named Rules
**The No-Shadow Rule.** If something needs to stand forward, give it a rule
above it and more space around it; do not add a shadow.

## Shapes

**The Sharp-Plus-Pill Rule.** Containers, inputs, images and panels are near
square (4px). Buttons, and only buttons, are full pills. Icon buttons in the
hero are circles. No other radius appears.

## Components

### Buttons
- **Shape:** full pill (9999px).
- **Primary:** Obsidian fill, Ivory label, 16px 32px, Inter 600 15px. One
  primary per view.
- **Hover / Focus:** fill shifts to Graphite over 150ms; 2px Ink focus ring,
  3px offset.
- **Pending:** Silver fill, Graphite label, not-allowed cursor.
- **Text link (secondary action):** Ink label followed by an 32px mint rule
  that extends to 48px on hover.

### Inputs / Fields
- **Style:** Sheet White fill, 1px Silver border, 4px corners, 14px 16px.
- **Focus:** border turns Ink; no glow.
- **Error:** Error Red border and an inline message below, linked by
  aria-describedby. Labels sit above fields; optional fields say "Optional".

### Navigation
- Logo left (black mark, Sora wordmark, mint underline). Primary nav is only
  Software and Recruiting, Inter 500 15px, Graphite to Ink on hover with a mint
  underline drawn in. Everything else lives in the full-screen overlay menu.
  The header gains an Ivory/80 blurred surface and a Silver rule after 24px of
  scroll.

### The Molten Ring (signature)
- Nine 3:4 photographic cards on a large arc, rendered as one WebGL2 signed
  distance field so neighbours fuse and leave strands as they part. Scroll
  position turns it; it never loops and releases the page after service 09.
- Caption: number, mint rule, service line, Sora title, one-line description,
  an "Explore" text link, and up/down circle buttons with a nine-tick progress
  rule (active tick mint).
- Falls back to a static, linked list of the same nine services under reduced
  motion, without WebGL2, or without JavaScript.

## Do's and Don'ts

### Do:
- **Do** keep every section on Ivory Paper (#f5f4ef) with Obsidian Ink text.
- **Do** use mint only as a 1 to 2px rule, a dot, or the text-accent bar.
- **Do** separate content with 1px Silver rules and numbered rows.
- **Do** use credited, art-directed photography where an image carries meaning.
- **Do** keep headings sentence case and at most two lines.

### Don't:
- **Don't** add shadows, gradients, glassmorphism or glow.
- **Don't** use mint for text, buttons or fills.
- **Don't** introduce purple, blue or neon accents, robots, glowing brains or
  circuit imagery.
- **Don't** put an eyebrow above every section heading.
- **Don't** build card grids where a ruled list would do.
- **Don't** invent clients, testimonials, metrics, logos or contact details.
