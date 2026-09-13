DOCUMENT 2 — PRD → TECH STACK
1. Project Overview
Project
Startup Recruiting + Software Solutions Platform
Primary objective
Build a modern, highly polished web platform that:
1.	Presents the company as a professional recruiting/job-support platform.
2.	Attracts primarily:
o	Recent bachelor's graduates
o	International students
o	Master's students
o	Students/recent graduates seeking employment in the US
o	Candidates who want assistance with job discovery/application/recruiting
3.	Captures candidate leads through a recruiting form.
4.	Presents a second business offering:
o	Software development
o	MVP development
o	SaaS products
o	End-to-end applications
o	Websites
o	Portfolios
o	Industry-specific software
5.	Captures software-development/business leads.
6.	Provides a visually modern experience using:
o	Scroll animations
o	Interactive transitions
o	Parallax
o	Video backgrounds/effects
o	Micro-interactions
o	Animated typography
o	Interactive cards
o	Modern navigation
7.	Allows non-developers to update important content later.
8.	Provides a foundation for future recruiting automation and lead-management systems.
________________________________________
2. Recommended Technology Stack
Final Recommended Stack
Layer	Technology
Frontend	Next.js + React + TypeScript
Framework architecture	Next.js App Router
Styling	Tailwind CSS
UI components	shadcn/ui
Component inspiration	21st.dev
Primary animation	Motion for React
Advanced scroll animation	GSAP + ScrollTrigger
Smooth scrolling	Lenis
3D/advanced visuals	Three.js / React Three Fiber — only where justified
Icons	Lucide React
Forms	React Hook Form
Validation	Zod
Database / leads	Supabase PostgreSQL
File storage	Supabase Storage
Content management	Sanity
Email	Resend
Spam protection	Cloudflare Turnstile
Video/media	Cloudinary or optimized local assets
Analytics	PostHog + optional Google Analytics
Hosting	Vercel
DNS/CDN/security	Cloudflare
Domain	Custom company domain
Source control	GitHub
CI/CD	GitHub + Vercel
Testing	Vitest + Playwright
SEO	Next.js Metadata + structured data
Accessibility	WCAG-oriented implementation
Monitoring	Sentry — optional but recommended for production
________________________________________
3. Frontend Framework
Next.js + React + TypeScript
Decision
Use Next.js with the App Router and TypeScript.
Next.js is currently positioned as a React framework for full-stack applications and supports the App Router, server components, routing, rendering, metadata and other production capabilities. Next.js
Why?
This project is more than a static landing page.
We will eventually have:
/
├── Recruiting
├── Software
├── About
├── Contact
├── Apply
├── Services
├── Privacy
├── Terms
└── potentially /admin or /studio
And eventually:
Visitor
   ↓
Landing Page
   ↓
Recruiting / Software
   ↓
Lead Form
   ↓
Database
   ↓
Email Notification
   ↓
Internal Team
   ↓
Future CRM / Outreach Automation
Next.js gives us a good foundation for that evolution.
________________________________________
4. Language
TypeScript
Decision
Use TypeScript throughout the project.
Reasons:
•	Better maintainability
•	Safer forms
•	Typed database models
•	Typed API responses
•	Easier team collaboration
•	Easier future automation integration
•	Fewer runtime mistakes
Example architecture:
TypeScript
    ↓
React components
    ↓
Server Actions / API
    ↓
Supabase
________________________________________
5. Styling
Tailwind CSS
Decision
Use:
Tailwind CSS
instead of writing a large traditional CSS architecture.
This is particularly suitable because the website will contain many reusable visual patterns:
Hero
Cards
Buttons
Forms
Testimonials
Navigation
Marquees
Sections
Gradients
Glass effects
Responsive layouts
Animated containers
It will also make the visual design system easier to maintain.
________________________________________
6. UI Component System
shadcn/ui
Decision
Use shadcn/ui as the foundation for functional UI components.
However:
We should NOT make the website look like a default shadcn website.
Instead:
shadcn/ui
      ↓
our design system
      ↓
custom styling
      ↓
Motion animations
      ↓
21st.dev-inspired components
This gives us reliable components while allowing a completely custom brand.
________________________________________
7. 21st.dev
The user specifically requested modern component sources such as 21st.dev.
That is a good choice for design inspiration and reusable component patterns.
21st.dev currently provides a large community component library containing categories such as:
•	Heroes
•	Navigation
•	Testimonials
•	Forms
•	Footers
•	Marquees
•	Scroll areas
•	Videos
•	Timelines
•	Bento grids
•	Backgrounds
•	CTAs
•	Cards
•	File uploads
•	Text animations 21st
Important implementation rule
We should not blindly copy components.
Instead:
21st.dev
   ↓
Find suitable interaction
   ↓
Evaluate license/code
   ↓
Adapt to our design system
   ↓
Integrate into our architecture
________________________________________
8. Animation Architecture
This is one of the most important parts of the project.
The website should feel:
alive
but not:
slow / gimmicky / overwhelming
Therefore we should use multiple animation levels.
________________________________________
8.1 Primary animation library
Motion for React
Use:
Motion for React
for normal UI animations.
It supports:
•	Enter/exit animations
•	Hover
•	Tap
•	Layout animation
•	Scroll-triggered animation
•	Scroll-linked animation
•	Parallax
•	Gesture interactions Motion
Example conceptual usage:
Section enters viewport
        ↓
Fade + translate
        ↓
Cards stagger
        ↓
Images reveal
        ↓
Text animation
________________________________________
9. Advanced Scroll Animation
GSAP + ScrollTrigger
For the more cinematic portions:
GSAP + ScrollTrigger
GSAP's ScrollTrigger supports:
•	Scroll-based animation
•	Scrubbing
•	Pinning
•	Snapping
•	Timeline-based effects
•	Trigger-based animations GSAP
Use GSAP only where necessary.
For example:
Recruiting page
Candidate journey

Discover
   ↓
Profile
   ↓
Opportunities
   ↓
Application
   ↓
Interview
   ↓
Career
As the user scrolls, the timeline could progressively animate.
________________________________________
10. Motion vs GSAP
We should NOT use both for everything.
Rule
Requirement	Tool
Button hover	Motion
Card hover	Motion
Fade-in	Motion
Page transition	Motion
Staggered cards	Motion
Simple parallax	Motion
Scroll progress	Motion
Complex pinned section	GSAP
Cinematic scroll sequence	GSAP
Complex timeline	GSAP
Scroll scrubbing	GSAP
Advanced storytelling	GSAP
This prevents unnecessary complexity.
Motion itself supports scroll-linked animations using useScroll, including parallax and progress effects. Motion
________________________________________
11. Smooth Scrolling
Lenis
A smooth-scroll layer can be added to improve the cinematic feel.
Architecture:
Browser Scroll
      ↓
Lenis
      ↓
Motion / GSAP
      ↓
Visual effects
However, this should be implemented carefully so that:
•	keyboard navigation works
•	accessibility is preserved
•	mobile performance remains good
•	reduced-motion preferences are respected
________________________________________
12. 3D / WebGL
Three.js / React Three Fiber
We can use 3D.
But I do not recommend turning the entire website into a 3D experience.
Instead:
Use it for one or two hero experiences.
For example:
Hero
 └── floating abstract 3D network
       ↓
       particles
       ↓
       glowing nodes
       ↓
       subtle mouse interaction
Or on the software page:
Software architecture
        ↓
interactive nodes
        ↓
frontend
backend
database
cloud
AI
Rule
3D should enhance the story, not become the story.
________________________________________
13. Video
The PRD specifically calls for video effects.
We can support:
Background video
Hero
 └── muted looping video
       +
      gradient overlay
       +
      text
Scroll-controlled video
User scroll
     ↓
Video frame progression
     ↓
Storytelling effect
Product demonstration
Software page:
Problem
 ↓
Interface
 ↓
Architecture
 ↓
Product
 ↓
Result
________________________________________
14. Video Infrastructure
Recommended: Cloudinary
For production video-heavy pages, Cloudinary is a strong option because it supports:
•	Video transformation
•	Format optimization
•	Resizing
•	Cropping
•	Streaming
•	Adaptive bitrate
•	CDN delivery Cloudinary
This is preferable to throwing huge .mp4 files directly into the website.
________________________________________
15. Content Management
This is particularly important because you specifically requested:
"make it flexible like we can edit later"
Recommended: Sanity
Use:
Sanity CMS
for editable marketing content.
Sanity currently provides Next.js integration, real-time content, visual editing and draft/live workflows. Sanity.io
This means later we can change things like:
Hero headline
Hero description
CTA
Services
Testimonials
FAQ
Team
Contact information
Social links
Recruiting content
Software services
Case studies
without changing application code.
________________________________________
16. Content Architecture
Instead of hardcoding everything:
<h1>We help students...</h1>
we can eventually have:
Sanity CMS
     ↓
Content
     ↓
Next.js
     ↓
Website
Example:
Site Settings
├── Logo
├── Brand
├── Contact
├── Social links
└── Footer

Homepage
├── Hero
├── Recruiting CTA
├── Software CTA
├── Testimonials
└── Final CTA

Recruiting Page
├── Hero
├── Benefits
├── Process
├── Testimonials
├── FAQ
└── Application CTA

Software Page
├── Hero
├── Services
├── Industries
├── Process
├── Portfolio
└── Contact CTA
________________________________________
17. Database
Supabase PostgreSQL
Use Supabase for actual lead/application data.
Supabase provides PostgreSQL, authentication, storage and other backend services. Its current Next.js quickstart supports TypeScript, Tailwind and cookie-based authentication. Supabase
Recruiting leads
candidate_leads
Potential fields:
id
name
email
phone
visa_status
education
location
resume_url
source
created_at
status
notes
________________________________________
Software leads
software_leads
Potential fields:
id
name
email
phone
company
project_type
industry
budget_range
timeline
description
source
created_at
status
________________________________________
18. Resume Upload
Resume uploads should NOT be stored directly inside PostgreSQL.
Use:
Supabase Storage
Supabase Storage is specifically designed for storing and serving files, with buckets and access controls. Supabase
Architecture:
Candidate
   ↓
Upload Resume
   ↓
Validation
   ↓
Supabase Storage
   ↓
resume_url
   ↓
Database
________________________________________
19. Resume Security
We should implement:
•	PDF/DOC/DOCX restrictions
•	Maximum file size
•	MIME validation
•	Filename sanitization
•	Private storage
•	Signed URLs where appropriate
•	Virus/malware scanning strategy
•	Rate limiting
•	CAPTCHA/bot protection
Never make uploaded resumes publicly accessible by default.
________________________________________
20. Forms
React Hook Form + Zod
Recommended architecture:
React Hook Form
       ↓
Zod validation
       ↓
Server-side validation
       ↓
Turnstile verification
       ↓
Supabase
       ↓
Email notification
This gives us both client-side UX and server-side security.
________________________________________
21. Spam Protection
Cloudflare Turnstile
Because the website will have public forms, spam submissions are a serious concern.
Cloudflare Turnstile is designed specifically to protect forms from automated abuse and uses server-side token verification. Cloudflare Docs
Use it on:
Recruiting form
Software inquiry
Contact form
________________________________________
22. Email
Resend
Use Resend for transactional emails.
Example:
Candidate submits form
        ↓
Supabase
        ↓
Resend
        ↓
Recruiting Team
The candidate can also receive:
Thank you for contacting us.

Our team has received your information
and will review it.
Resend provides direct Next.js integration and React-based email templates. Resend
________________________________________
23. Analytics
PostHog
We should measure:
Visitors
    ↓
Recruiting page
    ↓
Application form
    ↓
Form started
    ↓
Form completed
And separately:
Visitors
    ↓
Software page
    ↓
Service
    ↓
Contact form
    ↓
Lead
Important events:
hero_cta_clicked
recruiting_page_viewed
software_page_viewed
application_started
application_submitted
resume_uploaded
software_inquiry_started
software_inquiry_submitted
contact_clicked
linkedin_clicked
This will eventually help us determine which audience and channels actually produce leads.
________________________________________
24. SEO
Use Next.js metadata and structured data.
Every major page should have:
Title
Meta description
Canonical URL
Open Graph image
Twitter/X metadata
Structured data
Sitemap
Robots.txt
Potential SEO pages:
/recruiting
/software-development
/mvp-development
/saas-development
/web-development
But we should not create hundreds of low-quality SEO pages simply for traffic.
________________________________________
25. Domain
Use a professional custom domain.
Architecture:
yourdomain.com
Primary:
yourdomain.com
Recruiting:
yourdomain.com/recruiting
Software:
yourdomain.com/software
Contact:
yourdomain.com/contact
Apply:
yourdomain.com/apply
________________________________________
26. Hosting
Vercel
Recommended deployment architecture:
GitHub
   ↓
Vercel
   ↓
Next.js
Every push can trigger a deployment.
Development:
feature branch
      ↓
preview deployment
      ↓
testing
      ↓
production
________________________________________
27. DNS / Security
Cloudflare
Use Cloudflare for:
•	DNS
•	SSL/TLS
•	DNS security
•	CDN
•	basic protection
•	Turnstile
•	future rate limiting/security controls
Architecture:
User
 ↓
Cloudflare
 ↓
Vercel
 ↓
Next.js
________________________________________
28. GitHub Architecture
Repository:
startup-website
Recommended branches:
main
develop
feature/homepage
feature/recruiting
feature/software
feature/forms
feature/animations
Workflow:
Developer
   ↓
feature branch
   ↓
Pull Request
   ↓
Review
   ↓
develop
   ↓
Production
________________________________________
29. Testing
Unit tests
Use:
Vitest
For:
validation
utility functions
data processing
End-to-end tests
Use:
Playwright
Test:
Homepage
 ↓
Recruiting
 ↓
Form
 ↓
Validation
 ↓
Submission
and:
Homepage
 ↓
Software
 ↓
Inquiry form
 ↓
Submission
________________________________________
30. Accessibility
This should be a requirement, not an afterthought.
The animation system must support:
prefers-reduced-motion
Users who don't want animation should still get the complete experience.
Also:
•	Keyboard navigation
•	Visible focus
•	Proper labels
•	Alt text
•	Accessible forms
•	Semantic HTML
•	Good contrast
•	Screen-reader compatibility
________________________________________
31. Responsive Design
Must support:
Mobile
Tablet
Laptop
Desktop
Large desktop
Priority should actually be:
Mobile
   ↓
Tablet
   ↓
Desktop
because a significant percentage of the target audience will likely discover the platform through mobile/social channels.
________________________________________
32. Design System
Before building individual pages, establish:
Colors
Primary
Secondary
Background
Surface
Text
Muted
Accent
Success
Error
Typography
Display
Heading
Body
Caption
Spacing
4
8
12
16
24
32
48
64
96
128
Radius
sm
md
lg
xl
pill
Animation
fast
normal
slow
cinematic
The exact values will be derived from the brand kit once you provide it.
________________________________________
33. Component Architecture
Recommended structure:
src/
│
├── app/
│   ├── page.tsx
│   ├── recruiting/
│   ├── software/
│   ├── about/
│   ├── contact/
│   ├── apply/
│   └── api/
│
├── components/
│   ├── ui/
│   ├── navigation/
│   ├── hero/
│   ├── sections/
│   ├── forms/
│   ├── testimonials/
│   ├── animations/
│   ├── video/
│   └── footer/
│
├── lib/
│   ├── supabase/
│   ├── sanity/
│   ├── resend/
│   ├── analytics/
│   └── validation/
│
├── content/
│
├── hooks/
│
├── types/
│
└── styles/
________________________________________
34. Page Architecture
Homepage
Navigation
      ↓
Hero
      ↓
"Two ways we help"
      ↓
Recruiting
      ↓
Software
      ↓
Industries
      ↓
Why us
      ↓
Testimonials
      ↓
CTA
      ↓
Footer
________________________________________
35. Recruiting Page
Hero
 ↓
Who we help
 ↓
How it works
 ↓
What we provide
 ↓
Candidate journey
 ↓
Benefits
 ↓
Testimonials
 ↓
FAQ
 ↓
Application form
 ↓
Final CTA
 ↓
Footer
________________________________________
36. Software Page
Hero
 ↓
What we build
 ↓
MVP
 ↓
SaaS
 ↓
Websites
 ↓
Portfolios
 ↓
Enterprise/E2E systems
 ↓
Industry solutions
 ↓
Process
 ↓
Portfolio/case studies
 ↓
Inquiry form
 ↓
Footer
________________________________________
37. Testimonials
Important correction from the previous PRD
You said you want fake reviews for now.
Technically we can build placeholder testimonials.
However, they should be represented in the code/CMS as:
DEMO TESTIMONIAL
PLACEHOLDER
until genuine testimonials exist.
We should not publish invented testimonials as if they were real customers, because that would create a trust/legal/reputation problem.
Architecture:
testimonial
├── name
├── role
├── company
├── quote
├── image
├── status
│     ├── draft
│     ├── placeholder
│     └── published
└── verified
Therefore the UI can be built now without locking us into fabricated claims.
________________________________________
38. Future Recruiting Automation Compatibility
This is extremely important given the larger project you described earlier.
The website should not be built as an isolated marketing website.
It should prepare for:
Website
   ↓
Lead
   ↓
Database
   ↓
Lead qualification
   ↓
Recruiting CRM
   ↓
Outreach automation
   ↓
Follow-up
   ↓
Interested
   ↓
Human recruiting team
Therefore every lead should have:
source
campaign
status
created_at
last_contacted_at
next_followup_at
assigned_to
Eventually:
NEW
 ↓
CONTACTED
 ↓
RESPONDED
 ↓
INTERESTED
 ↓
QUALIFIED
 ↓
HANDED_TO_TEAM
 ↓
CLOSED
That will make the website compatible with the larger outreach automation system we're planning.
________________________________________
39. Future Lead Sources
The architecture should allow us to record:
source = linkedin
source = reddit
source = instagram
source = website
source = referral
source = google
source = campaign
source = other
And:
campaign_id
utm_source
utm_medium
utm_campaign
utm_content
This is extremely useful later.
For example:
LinkedIn campaign
       ↓
Landing page
       ↓
Candidate form
       ↓
Lead
       ↓
campaign = linkedin-september-2026
Now we can determine whether the campaign actually produced candidates.
________________________________________
40. Environment Architecture
We should separate:
.env.local
.env.production
Never commit:
API keys
database passwords
service-role keys
private credentials
into GitHub.
________________________________________
41. Deployment Architecture
Final architecture:
                       ┌───────────────┐
                       │    GitHub     │
                       └───────┬───────┘
                               │
                               ↓
                         ┌───────────┐
                         │  Vercel   │
                         └─────┬─────┘
                               │
                         Next.js App
                               │
            ┌──────────────────┼──────────────────┐
            ↓                  ↓                  ↓
       Sanity CMS          Supabase            Resend
       Content             Leads/DB             Email
            │                  │
            │                  ↓
            │             File Storage
            │
            ↓
        Marketing
         Content

User
  ↓
Cloudflare
  ↓
Vercel
________________________________________
42. Recommended Animation Architecture
The final visual stack:
                    Website
                       │
             ┌─────────┴─────────┐
             │                   │
         Motion               GSAP
             │                   │
      UI animations       Cinematic scroll
             │                   │
             └─────────┬─────────┘
                       │
                     Lenis
                       │
                   Scroll layer
                       │
              ┌────────┴────────┐
              │                 │
          Video             Three.js
But we should only activate the expensive layers where they provide actual value.
________________________________________
43. Performance Rules
This is a critical requirement.
The website must look extremely advanced without becoming extremely slow.
Therefore:
We will NOT:
•	Put huge videos everywhere
•	Animate every DOM element
•	Use 3D unnecessarily
•	Load every animation library on every page
•	Load massive images
•	Block page rendering with unnecessary JavaScript
We WILL:
•	Lazy-load videos
•	Optimize images
•	Use responsive image sizes
•	Lazy-load 3D
•	Respect reduced-motion
•	Use GPU-friendly properties
•	Split heavy components
•	Lazy-load below-the-fold sections
•	Optimize fonts
•	Monitor Core Web Vitals
________________________________________
44. Why This Stack
The overall reasoning is:
Next.js
Application framework.
TypeScript
Reliability.
Tailwind
Design system.
shadcn
Functional UI foundation.
21st.dev
Modern component inspiration.
Motion
Normal UI animation.
GSAP
Advanced cinematic animation.
Lenis
Smooth scrolling.
Three.js
Selective 3D.
Sanity
Editable marketing content.
Supabase
Database + storage.
Resend
Email.
Turnstile
Spam protection.
Cloudinary
Video/media optimization.
PostHog
Analytics.
Vercel
Deployment.
Cloudflare
DNS/security.
________________________________________
45. MVP Stack vs Full Stack
We should not necessarily implement every technology on day one.
Phase 1 — Website MVP
Next.js
TypeScript
Tailwind
shadcn/ui
Motion
Supabase
Resend
Turnstile
Vercel
GitHub
Phase 2 — Advanced visual experience
GSAP
Lenis
Cloudinary
Three.js
Phase 3 — Editable content
Sanity
Phase 4 — Business intelligence
PostHog
Phase 5 — Recruiting automation
CRM
Lead qualification
Outreach system
Follow-up engine
Team handoff
This staged approach prevents us from spending weeks building infrastructure that isn't needed for the first launch.
________________________________________
46. Final Technology Decision
APPROVED BASELINE
Frontend
──────────────
Next.js
React
TypeScript
Tailwind CSS
shadcn/ui

Animation
──────────────
Motion
GSAP
Lenis
Three.js / R3F (selective)

Backend
──────────────
Next.js Server
Supabase PostgreSQL

Storage
──────────────
Supabase Storage

CMS
──────────────
Sanity

Forms
──────────────
React Hook Form
Zod
Cloudflare Turnstile

Email
──────────────
Resend

Media
──────────────
Cloudinary

Analytics
──────────────
PostHog

Deployment
──────────────
Vercel
Cloudflare

Source Control
──────────────
GitHub

Testing
──────────────
Vitest
Playwright
________________________________________
47. Important Architectural Decision
The most important decision from this document is this:
We are not building merely a pretty landing page.
We're building the public-facing acquisition layer of a future recruiting + software business platform.
So the architecture needs to support:
                WEBSITE
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
   RECRUITING             SOFTWARE
        │                     │
        ↓                     ↓
 Candidate Lead          Business Lead
        │                     │
        └──────────┬──────────┘
                   ↓
                 CRM
                   ↓
            Qualification
                   ↓
              Automation
                   ↓
             Human Team
That is what will allow us later to connect the website to the outreach/follow-up automation project you originally wanted, rather than having to rebuild the website's backend.
________________________________________
Sources used for the technology decisions
•	Next.js documentation — framework and App Router.
•	Motion for React — UI, gesture and scroll animation.
•	GSAP ScrollTrigger — advanced scroll-driven animation.
•	21st.dev component library — modern UI/component patterns.
•	Supabase + Next.js — database/backend integration.
•	Sanity + Next.js — editable content architecture.
•	Cloudflare Turnstile — form protection.
•	Resend + Next.js — transactional email.
•	Cloudinary Video documentation — optimized video delivery.

