DOCUMENT 3 — APPLICATION ARCHITECTURE
This document will translate the PRD + approved technology stack into the actual structure of the website/application before we write any code.
I’ll keep your important decisions from the previous documents:
•	Two primary offerings: Recruiting / Career Assistance and Software / Product Development
•	Separate detailed pages for each offering
•	Main landing page acts as the common brand/company entry point
•	Lead-generation forms on both sides
•	Recruiting form includes optional resume upload, phone, US visa status/type, education, etc.
•	Software form captures business/project requirements
•	Fake testimonials/reviews for now, clearly structured so they can later be replaced with real ones
•	Strong modern animations, scroll effects, transitions, video effects, etc.
•	Editable content
•	PostgreSQL-based backend
•	No Docker
•	Free/low-cost services wherever practical
________________________________________
3. APPLICATION ARCHITECTURE
Architecture Design Document
3.1 Architecture Objective
The application will be designed as a modern, responsive, high-performance company website with two primary business funnels:
                         VISITOR
                            │
                            ▼
                    ┌───────────────┐
                    │   HOME PAGE   │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       ┌───────────────┐           ┌────────────────┐
       │  RECRUITING   │           │    SOFTWARE    │
       │    SERVICE    │           │    SERVICES    │
       └───────┬───────┘           └───────┬────────┘
               │                           │
               ▼                           ▼
       Recruiting Lead              Software Lead
           Form                         Form
               │                           │
               └─────────────┬─────────────┘
                             ▼
                       Lead Database
                             │
                             ▼
                     Admin / Team Review
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
                Interested        Not Interested
                    │
                    ▼
              Team Follow-up
The public website should therefore be treated not merely as an informational website, but as a lead-generation platform.
________________________________________
3.2 High-Level System Architecture
┌──────────────────────────────────────────────────────┐
│                    USER / VISITOR                    │
│                                                      │
│ Desktop │ Mobile │ Tablet │ Social / Search Traffic │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                    CLOUDFLARE                        │
│                                                      │
│ DNS │ SSL │ CDN │ Security │ Bot Protection          │
└───────────────────────┬──────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────────┐
│                     VERCEL                           │
│                                                      │
│                 Next.js Application                  │
│                                                      │
│ ┌──────────────┐ ┌──────────────┐ ┌───────────────┐ │
│ │    Pages     │ │ Components   │ │ API Routes    │ │
│ └──────────────┘ └──────────────┘ └───────────────┘ │
│                                                      │
│ Animation / UI / Forms / SEO / Business Logic        │
└───────────────┬───────────────────────┬──────────────┘
                │                       │
        ┌───────┴────────┐       ┌──────┴─────────┐
        ▼                ▼       ▼                ▼
┌──────────────┐ ┌────────────┐ ┌─────────────┐ ┌───────────┐
│  Supabase    │ │  Supabase  │ │   Resend    │ │  Sanity   │
│ PostgreSQL   │ │  Storage   │ │   Email      │ │   CMS     │
└──────────────┘ └────────────┘ └─────────────┘ └───────────┘
        │                │              │              │
        ▼                ▼              ▼              ▼
      Leads          Resumes       Notifications   Editable
      Data           / Files       / Emails        Content
________________________________________
3.3 Project Structure
The application should use a modular Next.js architecture.
project/
│
├── public/
│   ├── images/
│   ├── videos/
│   ├── icons/
│   └── fonts/
│
├── src/
│   │
│   ├── app/
│   │   ├── page.tsx
│   │   │
│   │   ├── recruiting/
│   │   │   └── page.tsx
│   │   │
│   │   ├── software/
│   │   │   └── page.tsx
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx
│   │   │
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   │
│   │   ├── privacy/
│   │   │   └── page.tsx
│   │   │
│   │   ├── terms/
│   │   │   └── page.tsx
│   │   │
│   │   └── api/
│   │       ├── leads/
│   │       ├── upload/
│   │       └── contact/
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── hero/
│   │   ├── sections/
│   │   ├── forms/
│   │   ├── testimonials/
│   │   ├── animations/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── email/
│   │   ├── validation/
│   │   ├── analytics/
│   │   └── security/
│   │
│   ├── hooks/
│   │
│   ├── types/
│   │
│   └── config/
│
├── .env.local
├── package.json
└── README.md
The purpose of this structure is to prevent the website from becoming one giant page/component.
________________________________________
3.4 Frontend Architecture
Core
Next.js + React + TypeScript
Next.js will handle:
•	Website pages
•	Routing
•	SEO
•	Server-side functionality
•	API endpoints
•	Form processing
•	Metadata
•	Performance optimization
Styling
Tailwind CSS + shadcn/ui
Used for:
•	Responsive layout
•	Buttons
•	Forms
•	Cards
•	Navigation
•	Dialogs
•	Inputs
•	Design system
________________________________________
3.5 Animation Architecture
Animation is a major requirement of this project.
Instead of randomly adding animations everywhere, animation will be divided into layers.
Layer 1 — Basic UI animation
Use Motion for:
•	Fade-ins
•	Slide-ins
•	Hover effects
•	Button interactions
•	Card transitions
•	Modal animations
•	Page transitions
Layer 2 — Scroll animation
Use GSAP + ScrollTrigger for:
•	Parallax
•	Scroll-driven sections
•	Text reveals
•	Horizontal scrolling sections
•	Image transformations
•	Timeline animations
•	Pinned sections
Layer 3 — Smooth scrolling
Use Lenis.
Architecture:
User Scroll
     │
     ▼
   Lenis
     │
     ▼
Smooth Scroll Position
     │
     ▼
GSAP / ScrollTrigger
     │
     ▼
Animated Components
Layer 4 — Advanced visual effects
Use Three.js / React Three Fiber selectively.
This should not be used for every section.
Possible applications:
•	Interactive hero background
•	3D abstract objects
•	Technology visualization
•	Interactive service visualization
The goal is:
Premium visual experience without sacrificing performance.
________________________________________
3.6 Main Page Architecture
The homepage should remain relatively concise.
HOME
 │
 ├── Navbar
 │
 ├── Hero
 │
 ├── Brand / Company Introduction
 │
 ├── Two Core Services
 │      │
 │      ├── Recruiting
 │      └── Software Development
 │
 ├── Why Choose Us
 │
 ├── Visual / Video Section
 │
 ├── Industries
 │
 ├── Selected Social Proof
 │
 ├── CTA
 │
 └── Footer
The homepage should sell the idea, not contain every piece of information.
Users then enter one of the two dedicated funnels.
________________________________________
3.7 Recruiting Architecture
/recruiting
      │
      ├── Hero
      │
      ├── Who We Help
      │
      ├── Recruiting / Career Assistance Process
      │
      ├── What We Help With
      │
      ├── Candidate Benefits
      │
      ├── Application / Interest CTA
      │
      ├── Testimonials
      │
      ├── FAQ
      │
      └── Lead Form
Recruiting Lead Form
Initial fields:
Full Name *
Email *
Phone Number
Resume Upload
US Visa Type / Status
Current Education
University
Graduation Year
Target Job / Role
Preferred Industry
Location
LinkedIn Profile
Additional Information
Not every field needs to be mandatory.
The form should minimize friction while still collecting enough information for the recruiting team.
________________________________________
3.8 Software Services Architecture
/software
      │
      ├── Hero
      │
      ├── What We Build
      │
      ├── MVP Development
      │
      ├── SaaS Products
      │
      ├── End-to-End Applications
      │
      ├── Websites
      │
      ├── Portfolios
      │
      ├── Custom Business Software
      │
      ├── Industries
      │      ├── Healthcare
      │      ├── Finance
      │      ├── Agriculture
      │      └── Industry-specific
      │
      ├── Development Process
      │
      ├── Projects / Examples
      │
      ├── FAQ
      │
      └── Project Inquiry Form
________________________________________
3.9 Software Lead Form
Suggested structure:
Name *
Email *
Phone
Company
Project Type
Business / Personal
Industry
What do you need?
Current Website
Budget Range
Expected Timeline
Project Description
Additional Information
Project Type could include:
MVP
SaaS
Web Application
Website
Portfolio
E-commerce
Internal Business Software
API / Backend
AI Product
Industry-specific Software
Other
________________________________________
3.10 Database Architecture
The primary database will be:
Supabase PostgreSQL
Initial conceptual schema:
users
 └── administrative users

leads
 ├── id
 ├── lead_type
 ├── name
 ├── email
 ├── phone
 ├── status
 ├── source
 ├── created_at
 └── updated_at

recruiting_leads
 ├── lead_id
 ├── visa_status
 ├── education
 ├── university
 ├── graduation_year
 ├── target_role
 ├── industry
 ├── linkedin_url
 └── resume_url

software_leads
 ├── lead_id
 ├── company
 ├── project_type
 ├── industry
 ├── budget
 ├── timeline
 ├── project_description
 └── website

lead_notes
 ├── id
 ├── lead_id
 ├── note
 ├── created_by
 └── created_at

lead_events
 ├── id
 ├── lead_id
 ├── event_type
 ├── metadata
 └── created_at
This allows both business funnels to share a common leads table while keeping their specialized information separate.
________________________________________
3.11 Lead Lifecycle
This is particularly important because the ultimate purpose is lead generation.
NEW
 │
 ▼
CONTACTED
 │
 ▼
RESPONDED
 │
 ├───────────────┐
 ▼               ▼
INTERESTED     NOT INTERESTED
 │
 ▼
QUALIFIED
 │
 ▼
HANDED OVER
 │
 ▼
TEAM FOLLOW-UP
 │
 ▼
CONVERTED
Potential additional states:
INVALID
UNSUBSCRIBED
DO_NOT_CONTACT
CLOSED
This becomes important later when integrating outreach automation.
________________________________________
3.12 Resume Upload Architecture
Recruiting users may upload a resume.
Flow:
Candidate
    │
    ▼
Recruiting Form
    │
    ▼
Client Validation
    │
    ▼
Secure Upload
    │
    ▼
Supabase Storage
    │
    ▼
Resume URL / Reference
    │
    ▼
Recruiting Lead Record
Important:
Do not store large resume files directly inside PostgreSQL.
PostgreSQL stores the reference/metadata while Supabase Storage stores the actual file.
________________________________________
3.13 Form Processing
Architecture:
React Form
     │
     ▼
React Hook Form
     │
     ▼
Zod Validation
     │
     ▼
Next.js API
     │
     ├──────────────┐
     ▼              ▼
Supabase        Resend
Database        Email
     │              │
     ▼              ▼
Lead Created   Team Notification
This gives us both:
1.	Persistent lead storage
2.	Immediate team notification
________________________________________
3.14 Security Architecture
The public website must assume that anyone can submit forms.
Therefore:
Visitor
  │
  ▼
Cloudflare
  │
  ▼
Turnstile / Bot Protection
  │
  ▼
Server-side Validation
  │
  ▼
Rate Limiting
  │
  ▼
API
  │
  ▼
Database
Security requirements include:
•	Server-side validation
•	Zod validation
•	CAPTCHA/bot protection
•	Rate limiting
•	File type validation
•	File size restrictions
•	Secure file storage
•	Environment variables for secrets
•	No API keys exposed to browser
•	Database access policies
•	HTTPS
•	Input sanitization
•	Spam protection
________________________________________
3.15 Email Architecture
Resend will handle transactional email.
Example:
User submits recruiting form
            │
            ▼
       Lead created
            │
            ▼
        Resend API
            │
       ┌────┴────┐
       ▼         ▼
Recruiting     User
Team Email   Confirmation
For software inquiries:
Software Form
      │
      ▼
Database
      │
      ▼
Software Team Notification
      │
      ▼
User Confirmation
________________________________________
3.16 Content Architecture
The website should not require developers to edit every piece of text.
Sanity CMS will provide editable content where appropriate.
Potential editable content:
Hero headings
Hero descriptions
Service descriptions
FAQs
Testimonials
Industries
CTA text
Company information
Contact information
Social links
Images
Selected projects
This gives the structure:
Sanity CMS
     │
     ▼
Next.js
     │
     ▼
Website
So later:
Change content → publish → website updates
without modifying application code.
________________________________________
3.17 Analytics Architecture
PostHog will track user behavior.
Important events:
page_view
recruiting_page_view
software_page_view

recruiting_cta_clicked
software_cta_clicked

recruiting_form_started
recruiting_form_completed

software_form_started
software_form_completed

resume_upload_started
resume_uploaded

contact_clicked
email_clicked
linkedin_clicked
This allows us to answer:
Where are users dropping off?
and
Which service is generating the most leads?
________________________________________
3.18 SEO Architecture
Every important page should have:
Title
Meta Description
Canonical URL
Open Graph Image
Structured Metadata
Semantic HTML
Sitemap
Robots.txt
Core pages:
/
 /recruiting
 /software
 /about
 /contact
Potential search positioning:
Recruiting assistance
Career assistance
Job search assistance
Software development
MVP development
SaaS development
Web development
Custom software development
SEO claims must remain truthful and should not promise guaranteed employment.
________________________________________
3.19 Deployment Architecture
The project deliberately will not use Docker.
Deployment:
GitHub
   │
   ▼
Vercel
   │
   ▼
Next.js Application
   │
   ├──────► Supabase PostgreSQL
   │
   ├──────► Supabase Storage
   │
   ├──────► Resend
   │
   ├──────► Sanity
   │
   ├──────► PostHog
   │
   └──────► Cloudflare
This keeps deployment relatively simple and avoids maintaining a Docker environment.
________________________________________
3.20 Domain Architecture
Example:
yourdomain.com
      │
      ├── /recruiting
      │
      ├── /software
      │
      ├── /about
      │
      └── /contact
No need to create separate domains for each service initially.
The single domain strengthens the company brand.
________________________________________
3.21 Future Outreach Architecture
This is important because the website is ultimately intended to feed the recruiting operation.
The architecture should leave room for a future outreach system:
                    LEAD SOURCES
                         │
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
    Website           LinkedIn          Other Sources
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                  Lead Processing
                         │
                         ▼
                    Lead Database
                         │
                         ▼
                  Qualification
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
          Interested             Not Interested
             │
             ▼
        Human Team
             │
             ▼
          Follow-up
However, the website architecture should not assume that LinkedIn or other platforms permit unrestricted automated messaging. The future outreach layer must use each platform's permitted APIs/automation mechanisms and respect anti-spam, consent, and platform rules.
The website itself should therefore be built so that an outreach/CRM system can later consume its lead data through a controlled API.
________________________________________
3.22 Future CRM/API Boundary
Eventually:
Website
   │
   ▼
Lead API
   │
   ▼
PostgreSQL
   │
   ▼
CRM / Outreach System
   │
   ├── Qualification
   ├── Follow-up
   ├── Status
   ├── Communication history
   └── Team handoff
This means we don't have to rebuild the website when the outreach system is introduced.
________________________________________
3.23 Performance Architecture
Because the website will contain heavy animation and video, performance must be treated as an architectural requirement.
Rules:
Images
•	WebP/AVIF where appropriate
•	Responsive image sizes
•	Lazy loading
Video
•	Do not autoplay huge videos unnecessarily
•	Compress videos
•	Use poster images
•	Lazy-load below-the-fold video
•	Respect reduced-motion/accessibility preferences
JavaScript
•	Avoid unnecessary client components
•	Keep heavy animation libraries isolated
•	Use server components where appropriate
3D
Three.js should only load where needed.
Normal page
   │
   ├── Lightweight
   │
   └── 3D section
          │
          ▼
     Load Three.js
Not:
Every page → Load Three.js
________________________________________
3.24 Accessibility Architecture
The animations should never prevent normal website usage.
Support:
•	Keyboard navigation
•	Screen readers
•	Focus states
•	Semantic HTML
•	Accessible forms
•	Proper labels
•	Error messages
•	Reduced-motion preference
For users who enable:
prefers-reduced-motion
animations should be reduced or disabled.
________________________________________
3.25 Error Handling
Every major operation needs:
Loading
Success
Error
Retry
For example:
Submit Form
    │
    ├── Loading
    │
    ├── Success → Confirmation
    │
    └── Error → Explain + Retry
Never leave the user wondering whether their application was submitted.
________________________________________
3.26 Architecture Risks
Risk 1 — Too many animations
Problem: Beautiful but slow.
Solution: Use animation selectively and prioritize performance.
________________________________________
Risk 2 — Resume upload abuse
Problem: Malicious or oversized files.
Solution:
•	File type restrictions
•	File size limits
•	Secure storage
•	Validation
•	Server-side checks
________________________________________
Risk 3 — Form spam
Problem: Bots generating thousands of leads.
Solution:
•	Cloudflare Turnstile
•	Rate limiting
•	Validation
•	Spam detection
________________________________________
Risk 4 — Fake testimonials
The current requirement is to use fake reviews temporarily.
Architecture should therefore make testimonials CMS-managed so they can later be replaced.
The production version should clearly transition to genuine testimonials rather than presenting fabricated experiences as verified customer/candidate results.
________________________________________
Risk 5 — Outreach platform restrictions
Different platforms have different rules.
Therefore the future outreach engine should be modular:
Outreach Engine
      │
      ├── Channel Adapter A
      ├── Channel Adapter B
      ├── Email
      └── Other permitted channels
Instead of hard-coding the entire system around one platform.
________________________________________
3.27 Final Architecture
The final conceptual architecture is:
                         ┌──────────────┐
                         │   VISITORS   │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │  CLOUDFLARE  │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │    VERCEL    │
                         │   NEXT.JS    │
                         └──────┬───────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
        Recruiting          Software           CMS
          Funnel             Funnel           Sanity
             │                  │
             └────────┬─────────┘
                      ▼
                Form Validation
                      │
                      ▼
                 Security Layer
                      │
                      ▼
              ┌───────────────┐
              │   SUPABASE    │
              │  PostgreSQL   │
              └───────┬───────┘
                      │
              ┌───────┴────────┐
              ▼                ▼
        Lead Management    File Storage
                               │
                               ▼
                           Resumes
                     

External Services:
────────────────────────────────────
Resend       → Email
PostHog      → Analytics
Cloudflare   → DNS / Security
Sanity       → Editable Content
Supabase     → Database / Storage
Vercel       → Hosting
GitHub       → Source Control
Architecture decision
The application will be a Next.js full-stack web application, deployed directly through Vercel, using Supabase PostgreSQL + Storage as the backend data layer, Sanity for editable content, Resend for transactional email, Cloudflare for DNS/security, and PostHog for analytics. Docker is explicitly excluded.

