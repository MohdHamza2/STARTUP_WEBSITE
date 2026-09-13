DOCUMENT 6 — FEATURE-BY-FEATURE IMPLEMENTATION, VERIFICATION & TESTING PROTOCOL
Document: 06 — Build Features One at a Time
Purpose: Development and implementation rules for the complete website
Status: Implementation Standard
Applies To: Every feature, page, section, component, integration and functional module
________________________________________
6.1 Purpose of This Document
This document defines how the website must actually be built.
The project must not be developed by asking an AI/developer to generate the entire website in one operation.
Instead:
Build one feature at a time.
After one feature is completely implemented, verified, tested and committed, only then should development proceed to the next feature.
This rule applies throughout the entire project.
________________________________________
6.2 Core Development Principle
The project follows this rule:
ONE FEATURE
     ↓
PLAN
     ↓
VERIFY EXISTING CODE
     ↓
BUILD
     ↓
VERIFY IMPLEMENTATION
     ↓
TEST IN BROWSER
     ↓
VALIDATE
     ↓
IDENTIFY BUGS / ERRORS
     ↓
FIX
     ↓
VERIFY FIX
     ↓
RE-TEST
     ↓
COMMIT
     ↓
NEXT FEATURE
Then the exact same cycle starts again.
Feature 1
   ↓
Complete Cycle
   ↓
Feature 2
   ↓
Complete Cycle
   ↓
Feature 3
   ↓
Complete Cycle
   ↓
Feature 4
   ↓
...
________________________________________
6.3 Non-Negotiable Rule
❌ Do NOT do this
"Build the entire website."

        ↓

Generate 30 files

        ↓

Run it

        ↓

500 errors

        ↓

Try to fix everything
This makes debugging extremely difficult because it becomes unclear:
•	Which change caused the problem?
•	Which component introduced the bug?
•	Which dependency caused the failure?
•	Which API is broken?
•	Which CSS caused the layout issue?
•	Which database operation failed?
________________________________________
6.4 Required Approach
Instead:
Build Navbar
    ↓
Verify
    ↓
Commit

Build Hero
    ↓
Verify
    ↓
Commit

Build Services Section
    ↓
Verify
    ↓
Commit

Build Recruiting Page
    ↓
Verify
    ↓
Commit

Build Recruiting Form
    ↓
Verify
    ↓
Commit

...
This creates small, understandable development steps.
________________________________________
6.5 What Counts as a Feature?
For this project, a "feature" can mean:
Page
Homepage
Recruiting Page
Software Services Page
About Page
Contact Page
Section
Hero
Services
How It Works
Testimonials
FAQ
CTA
Footer
Functional component
Recruiting Form
Software Inquiry Form
Resume Upload
Contact Form
Backend functionality
Lead creation
Email notification
Database operation
File upload
Analytics
Integration
Supabase
Resend
Analytics
Cloudflare
Future CRM
Therefore, one feature at a time does not mean one entire webpage must always be built before anything else.
A large page can itself be broken into smaller independently verifiable features.
________________________________________
6.6 Feature Development Cycle
Every feature MUST follow the following lifecycle.
________________________________________
PHASE 1 — PLAN
Before writing code:
1. Understand the feature
Clearly define:
What is being built?
Why is it needed?
Who uses it?
What should happen?
What should NOT happen?
________________________________________
2. Define scope
Example:
Feature:
Recruiting Form

Included:
- Name
- Email
- Phone
- Education
- Visa status
- Resume upload
- Submit
- Validation

Not included:
- Automated LinkedIn outreach
- CRM
- AI candidate scoring
This prevents scope creep.
________________________________________
3. Define acceptance criteria
Example:
Feature is complete when:

✓ Form renders
✓ Inputs work
✓ Validation works
✓ Resume upload works
✓ API receives data
✓ Database stores data
✓ Success state works
✓ Error state works
✓ Mobile layout works
________________________________________
6.7 PHASE 2 — VERIFY BEFORE BUILDING
Before modifying anything, inspect the existing project.
The developer/AI must determine:
Existing architecture
Existing components
Existing styles
Existing dependencies
Existing routes
Existing database structure
Existing utilities
Existing API patterns
Rule
Never create a new architecture when an appropriate existing architecture already exists.
For example, if the project already contains:
components/Button.tsx
do not unnecessarily create:
components/NewButton.tsx
just because you are implementing a new feature.
________________________________________
6.8 Existing-Code Verification
Before implementation, check:
package.json
src/
components/
app/
lib/
database/
configuration
environment variables
and understand how the project currently works.
The developer must identify:
Reusable code
Components
Hooks
Utilities
Validation schemas
API helpers
Database helpers
Existing conventions
Naming
Folder structure
Styling
Error handling
API patterns
________________________________________
6.9 PHASE 3 — IMPLEMENT ONLY THAT FEATURE
Now build only the planned feature.
Do not simultaneously implement unrelated functionality.
For example, if building:
Recruiting Hero
do not also start:
•	Admin dashboard
•	Software form
•	Authentication
•	CRM
•	LinkedIn integration
unless they are genuinely required dependencies of the feature being built.
________________________________________
6.10 Implementation Rule
The implementation should follow:
Existing Architecture
        +
New Feature
        =
Minimal Required Changes
Avoid unnecessary rewrites.
________________________________________
6.11 PHASE 4 — FIRST VERIFICATION
After implementation, stop and inspect the changes.
Check:
Files changed
Files created
Dependencies added
Imports
Types
Routes
API calls
Database calls
Environment variables
The developer must verify that the implementation actually matches the feature plan.
________________________________________
6.12 PHASE 5 — RUN THE APPLICATION
Start the application using the project's defined development workflow.
Example:
Development Server
        ↓
localhost
        ↓
Browser
The exact command depends on the finalized project configuration.
________________________________________
6.13 PHASE 6 — TEST IN THE BROWSER
This is a mandatory requirement for this website.
Code compilation alone is not sufficient.
The feature must be tested in an actual browser.
Example:
Open Page
   ↓
Interact with Feature
   ↓
Observe Result
For visual features, verify:
•	Desktop
•	Tablet
•	Mobile
•	Different viewport sizes
•	Scrolling
•	Animations
•	Hover states
•	Focus states
•	Loading states
•	Error states
________________________________________
6.14 Browser Testing for Animation
Because this website intentionally uses modern animation, every animated feature must be tested for:
Page load
Scroll
Enter viewport
Exit viewport
Resize
Mobile scrolling
Reduced-motion behavior
Slow network
Animation must never make the website unusable.
________________________________________
6.15 PHASE 7 — FUNCTIONAL VALIDATION
After visual testing, verify actual behavior.
For example, for the recruiting form:
Valid input
    ↓
Submit
    ↓
Database
    ↓
Success
Then test invalid input:
Invalid email
    ↓
Error
Then:
Missing required field
    ↓
Error
Then:
Invalid resume
    ↓
Error
________________________________________
6.16 PHASE 8 — EDGE CASE TESTING
Every feature must be tested beyond the happy path.
Examples:
Forms
Empty input
Invalid input
Very long input
Special characters
Duplicate submission
Slow connection
Network failure
Server failure
Resume upload
Valid PDF
Invalid file
Oversized file
Corrupted file
Multiple uploads
Upload cancellation
Navigation
Direct URL
Refresh
Back button
Forward button
Mobile menu
Broken route
________________________________________
6.17 PHASE 9 — BUG & ERROR IDENTIFICATION
If something fails:
STOP moving to the next feature.
The current feature is not complete.
Create a clear bug description:
Expected:
Form should submit successfully.

Actual:
Submit button remains loading.

Error:
API returned 500.

Likely area:
Recruiting API.
Do not randomly modify unrelated code.
________________________________________
6.18 PHASE 10 — ROOT-CAUSE DEBUGGING
The debugging rule is:
Find the root cause before applying a fix.
Do not repeatedly make random changes such as:
Change component
 ↓
Didn't work
 ↓
Change API
 ↓
Didn't work
 ↓
Change database
 ↓
Didn't work
Instead:
Error
 ↓
Reproduce
 ↓
Trace
 ↓
Identify root cause
 ↓
Smallest appropriate fix
________________________________________
6.19 PHASE 11 — FIX THE BUG
Apply the smallest reasonable fix.
Do not rewrite unrelated parts of the project merely because they are nearby.
Example:
Bug:
Email validation fails.

Correct:
Fix validation schema.

Incorrect:
Rewrite entire form architecture.
________________________________________
6.20 PHASE 12 — VERIFY THE FIX
After fixing:
Do NOT immediately commit.
First verify:
Original problem
        ↓
Fixed?
        ↓
YES
Then test the original reproduction steps again.
________________________________________
6.21 PHASE 13 — REGRESSION TEST
The fix must not break something that previously worked.
Example:
Fix email validation
       ↓
Test email validation
       ↓
Test name
       ↓
Test phone
       ↓
Test resume
       ↓
Test submission
This is particularly important for shared components.
________________________________________
6.22 PHASE 14 — FINAL BROWSER VERIFICATION
Before committing, test the complete feature again in the browser.
Required:
Desktop
Mobile
Primary flow
Error flow
Loading flow
Animation
Navigation
For forms:
Valid submission
Invalid submission
Server error
Duplicate click
________________________________________
6.23 PHASE 15 — FINAL CODE VERIFICATION
Before committing, inspect:
Git diff
Git status
Changed files
Unexpected files
Debug statements
Temporary code
Secrets
Unused imports
Unused dependencies
Make sure no:
console.log(...)
temporary credentials
API keys
private keys
.env
are accidentally committed.
________________________________________
6.24 PHASE 16 — COMMIT
Only after the feature passes verification should it be committed.
Commit should represent:
One coherent completed feature/change.
Example:
feat: add recruiting hero section
Then:
feat: add recruiting application form
Then:
feat: add resume upload
Then:
feat: add recruiting lead notification
This makes project history understandable.
________________________________________
6.25 PHASE 17 — VERIFY COMMIT
After committing:
git status
Verify the working tree is in the expected state.
Then inspect the commit.
Conceptually:
Feature
 ↓
Commit
 ↓
Verify commit
 ↓
Clean/expected working tree
 ↓
NEXT FEATURE
________________________________________
6.26 THE CYCLE RESTARTS
This is extremely important.
After Feature 1:
PLAN
VERIFY
BUILD
VERIFY
BROWSER TEST
VALIDATE
BUG FIX
RE-VERIFY
RE-TEST
COMMIT
Then Feature 2 starts from the beginning:
PLAN
VERIFY
BUILD
VERIFY
BROWSER TEST
VALIDATE
BUG FIX
RE-VERIFY
RE-TEST
COMMIT
And again:
Feature 3
Feature 4
Feature 5
Feature 6
...
Never skip the cycle simply because the previous feature worked.
________________________________________
6.27 COMPLETE WEBSITE FEATURE ORDER
The entire website can eventually be built approximately in this order.
Phase A — Foundation
Feature 1
Project foundation
Feature 2
Global styling/design system
Feature 3
Typography
Feature 4
Brand/logo integration
Feature 5
Navigation
Feature 6
Responsive layout foundation
________________________________________
6.28 Homepage
Feature 7
Hero
Feature 8
Hero animation
Feature 9
Primary CTA
Feature 10
Recruiting service introduction
Feature 11
Software/product service introduction
Feature 12
Service cards
Feature 13
Scroll animations
Feature 14
Video/visual section
Feature 15
Social proof section
Feature 16
FAQ
Feature 17
Final CTA
Feature 18
Footer
________________________________________
6.29 Recruiting Page
Feature 19
Recruiting hero
Feature 20
Who we help
Feature 21
Recruiting process
Feature 22
Candidate benefits
Feature 23
Recruiting visual/video section
Feature 24
Testimonial section
Feature 25
FAQ
Feature 26
Recruiting CTA
Feature 27
Recruiting form UI
Feature 28
Form validation
Feature 29
Resume upload
Feature 30
Recruiting API
Feature 31
PostgreSQL lead creation
Feature 32
Recruiting lead creation
Feature 33
Lead event creation
Feature 34
Team notification
Feature 35
Candidate confirmation
Feature 36
Success/error states
________________________________________
6.30 Software Services Page
Feature 37
Software hero
Feature 38
MVP services
Feature 39
SaaS services
Feature 40
Web application services
Feature 41
Website development
Feature 42
Portfolio development
Feature 43
Industry-specific software
Feature 44
Healthcare solutions
Feature 45
Financial solutions
Feature 46
Agriculture solutions
Feature 47
Industrial solutions
Feature 48
Software process
Feature 49
Portfolio/project showcase
Feature 50
Software inquiry CTA
Feature 51
Software inquiry form
Feature 52
Software form validation
Feature 53
Software API
Feature 54
Software lead database integration
Feature 55
Software team notification
Feature 56
Software success/error states
________________________________________
6.31 Shared Website Features
Feature 57
Global footer
Feature 58
Social links
Feature 59
Contact information
Feature 60
Responsive navigation
Feature 61
Mobile navigation
Feature 62
404 page
Feature 63
Loading states
Feature 64
Global error handling
Feature 65
SEO metadata
Feature 66
Open Graph/social sharing
Feature 67
Favicon
Feature 68
Sitemap
Feature 69
Robots configuration
________________________________________
6.32 Analytics
Analytics should be implemented carefully.
Potential events:
page_view
hero_cta_click
recruiting_cta_click
software_cta_click
recruiting_form_started
recruiting_form_submitted
resume_uploaded
software_form_started
software_form_submitted
Each analytics feature must itself follow the same development cycle.
________________________________________
6.33 Future Admin/CRM Features
After the public website is stable:
Admin authentication
        ↓
Lead dashboard
        ↓
Recruiting leads
        ↓
Software leads
        ↓
Lead status
        ↓
Lead notes
        ↓
Lead history
        ↓
Team handoff
Again:
Build one feature → complete its cycle → commit → next feature.
________________________________________
6.34 Future Outreach Automation
The eventual outreach system will also follow the exact same rule.
For example:
Feature
Lead import
PLAN
 ↓
VERIFY
 ↓
BUILD
 ↓
BROWSER TEST
 ↓
VALIDATE
 ↓
BUG FIX
 ↓
RE-VERIFY
 ↓
COMMIT
Then:
Feature
Campaign management
Same cycle.
Then:
Feature
Email outreach
Same cycle.
Then:
Feature
Follow-up scheduling
Same cycle.
And so on.
________________________________________
6.35 AI Development Rules
Since AI coding agents may be used during development, the following rules are mandatory.
Rule 1
Do not ask the AI to build the whole application at once.
Rule 2
Give the AI exactly one feature at a time.
Rule 3
Before coding, ask it to inspect the existing architecture.
Rule 4
Require an implementation plan before code.
Rule 5
Require verification after implementation.
Rule 6
Require browser testing for website features.
Rule 7
If an error occurs, require root-cause analysis.
Rule 8
Fix only the identified problem unless broader changes are required.
Rule 9
Re-test after fixing.
Rule 10
Only commit after successful verification.
Rule 11
Never move to the next feature while the current feature has unresolved bugs.
Rule 12
Never modify unrelated code unnecessarily.
________________________________________
6.36 Standard AI Prompt for Every Feature
This should become the project's reusable implementation prompt:
Implement ONLY this feature:

[FEATURE]

Before writing code:

1. Inspect the existing project architecture.
2. Identify the files/components relevant to this feature.
3. Explain the implementation plan.
4. Identify files that need to be created or modified.
5. Identify dependencies required.
6. Identify possible risks and edge cases.
7. Do not modify unrelated code.

Then implement the feature.

After implementation:

1. Verify the changed files.
2. Run the appropriate checks.
3. Start/run the application if required.
4. Test the feature in the browser.
5. Test normal and edge-case behavior.
6. Check responsive behavior if it is a UI feature.
7. Check loading and error states.
8. Identify any bugs/errors.

If bugs/errors are found:

1. Determine the root cause.
2. Explain the cause.
3. Apply the smallest appropriate fix.
4. Re-run verification.
5. Re-test the feature in the browser.
6. Perform regression testing.

Do NOT move to another feature until this feature passes verification.

Finally:

1. Review the git diff.
2. Confirm no secrets or unrelated changes exist.
3. Commit ONLY this completed feature.
4. Verify the commit.
5. Report exactly what was changed, tested, and committed.

Do not build additional features unless explicitly instructed.
________________________________________
6.37 Feature Completion Checklist
Every feature must satisfy:
Planning
•	Requirement understood
•	Scope defined
•	Acceptance criteria defined
•	Edge cases identified
Existing Project
•	Architecture inspected
•	Existing components checked
•	Existing dependencies checked
•	Existing patterns followed
Development
•	Feature implemented
•	No unrelated functionality modified
•	Code follows project architecture
Verification
•	Build/type checks pass
•	Lint checks pass where applicable
•	Browser tested
•	Responsive behavior tested
•	Loading state tested
•	Error state tested
•	Edge cases tested
Bug Handling
•	Bugs identified
•	Root causes determined
•	Fixes implemented
•	Fixes verified
•	Regression testing completed
Git
•	Git diff reviewed
•	No secrets included
•	No unrelated changes
•	Feature committed
•	Commit verified
Only then:
MOVE TO NEXT FEATURE.
________________________________________
6.38 Definition of "DONE"
A feature is NOT DONE when:
Code exists.
A feature is DONE when:
Requirement
    ↓
Plan
    ↓
Existing architecture verified
    ↓
Implementation
    ↓
Code verification
    ↓
Browser verification
    ↓
Functional testing
    ↓
Edge-case testing
    ↓
Bug discovery
    ↓
Root-cause fix
    ↓
Re-verification
    ↓
Regression testing
    ↓
Git review
    ↓
Commit
    ↓
Commit verification
Only at that point is the feature considered complete.
________________________________________
6.39 Golden Rule of This Project
One feature at a time. Never build ahead of verification.
The development process must always be:
        ┌──────────────────────┐
        │     PLAN FEATURE     │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │ VERIFY ARCHITECTURE  │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │    BUILD FEATURE     │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │   VERIFY CODE        │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │    TEST BROWSER      │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │      VALIDATE        │
        └──────────┬───────────┘
                   ↓
             BUG / ERROR?
              /       \
            YES        NO
             │          │
             ↓          │
        FIND ROOT       │
          CAUSE         │
             ↓          │
           FIX          │
             ↓          │
       VERIFY AGAIN     │
             ↓          │
        TEST AGAIN      │
             └────┬─────┘
                  ↓
        ┌──────────────────────┐
        │    REVIEW GIT DIFF   │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │       COMMIT         │
        └──────────┬───────────┘
                   ↓
        ┌──────────────────────┐
        │   VERIFY COMMIT      │
        └──────────┬───────────┘
                   ↓
             NEXT FEATURE
                   │
                   └───────────────► REPEAT
________________________________________
6.40 Final Implementation Philosophy
This project will eventually contain a substantial number of components and capabilities:
Marketing website + Recruiting platform + Software services funnel + Lead management + Future outreach automation.
We therefore prioritize controlled incremental development over speed of initial code generation.
The goal is not:
"Generate as much code as possible."
The goal is:
Build small → verify completely → fix → test → commit → repeat.
This dramatically reduces the risk of ending up with a large application that looks impressive but contains interconnected bugs that are difficult to isolate.
________________________________________
Document 6 complete
The important correction from the screenshot has now been incorporated: Document 6 does not tell us to build only one feature for the entire project. It establishes the rule that every feature is built individually and must pass the complete Plan → Verify → Build → Browser Test → Validate → Fix → Re-verify → Test → Commit cycle before the next feature begins.

