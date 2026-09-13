DOCUMENT 7 — TEST THE APPLICATION
What it does
This document defines the complete testing strategy for the entire website/application.
Testing must not be treated as something done only after the entire application is finished. Every feature must be tested individually as soon as it is implemented, followed by integration and end-to-end testing of the complete application.
The goal is to ensure that:
•	Every feature works as intended.
•	The website works correctly in the browser.
•	Forms validate correctly.
•	Resume/file uploads work safely.
•	APIs behave correctly.
•	Database operations are correct.
•	Authentication and authorization work correctly.
•	Animations and responsive UI do not break functionality.
•	Mobile, tablet, and desktop layouts work.
•	Errors are handled properly.
•	Edge cases are covered.
•	Bugs are identified, fixed, and retested.
•	No previously working feature is accidentally broken by a new feature.
________________________________________
1. CORE TESTING RULE
NEVER TEST THE ENTIRE APPLICATION ONLY AT THE END.
The application must be tested one feature at a time.
For every feature:
Plan → Build → Verify → Test → Browser Test → Validate → Find Bugs → Fix → Verify Again → Commit → Move to Next Feature
Then repeat the same cycle for the next feature.
Example:
Feature 1
    ↓
Plan
    ↓
Build
    ↓
Verify
    ↓
Test
    ↓
Browser Testing
    ↓
Validation
    ↓
Bug/Error?
    ├── YES → Fix → Verify → Test Again
    └── NO
    ↓
Commit
    ↓
Feature 2
    ↓
Repeat
This process continues until every feature has completed the cycle.
________________________________________
2. TESTING PHASES
Testing should be divided into the following levels:
Level 1 — Component/UI Testing
Test individual UI components.
Examples:
•	Buttons
•	Navigation
•	Cards
•	Forms
•	Modals
•	Dropdowns
•	File upload component
•	Testimonials
•	Service cards
•	Footer
•	Header
•	Animation components
________________________________________
Level 2 — Feature Testing
Test each complete feature independently.
For example:
Recruiting Application Form
        ↓
Enter information
        ↓
Validate information
        ↓
Submit
        ↓
API
        ↓
Database
        ↓
Success/Error response
        ↓
Browser confirmation
________________________________________
Level 3 — Integration Testing
Verify that different parts of the system work together.
Examples:
Frontend
   ↓
API
   ↓
Database
or:
Application Form
   ↓
Resume Upload
   ↓
Storage
   ↓
Candidate Record
________________________________________
Level 4 — End-to-End Testing
Test the application exactly as a real visitor would use it.
Example:
Open website
      ↓
Landing page
      ↓
Recruiting page
      ↓
Read information
      ↓
Click Apply
      ↓
Fill form
      ↓
Upload resume
      ↓
Submit
      ↓
Receive confirmation
The complete user journey must work without requiring manual intervention.
________________________________________
3. TEST EVERY FEATURE INDIVIDUALLY
The following features must eventually be tested.
A. Landing Page
Test:
•	Website loads successfully.
•	Logo appears correctly.
•	Navigation works.
•	Hero section loads.
•	CTA buttons work.
•	Recruiting CTA redirects correctly.
•	Software/product CTA redirects correctly.
•	Animations load.
•	Scroll animations work.
•	Video/background effects work.
•	Sections appear in the correct order.
•	Footer loads correctly.
•	Social links work once configured.
•	Contact information is correct.
•	Responsive layout works.
________________________________________
4. RECRUITING PAGE
Test:
•	Recruiting page opens correctly.
•	All sections load.
•	Recruiting explanation is displayed correctly.
•	Candidate benefits are displayed.
•	CTA buttons work.
•	Application form opens/appears correctly.
•	Testimonials/reviews render correctly.
•	Navigation works.
•	Animations do not interfere with usability.
•	Mobile layout works.
•	Desktop layout works.
Important
The currently planned testimonials may be placeholder/fake reviews during development, as previously decided.
They must remain clearly configurable so they can later be replaced with genuine testimonials.
________________________________________
5. RECRUITING APPLICATION FORM
Test every field independently.
Required/expected fields
•	Name
•	Email
•	Phone/contact number
•	Resume upload
•	US visa type
•	Current education
•	Other relevant candidate information
Test:
Valid input
Name → Valid
Email → Valid
Phone → Valid
Visa → Valid
Education → Valid
Resume → Valid
Expected result:
Form submits successfully
________________________________________
6. INVALID FORM TESTING
Every validation rule must be tested.
Examples:
Name
Empty
Very short
Very long
Numbers only
Special characters
Normal name
Email
Empty
abc
abc@
abc@gmail
valid@email.com
Phone
Test:
•	Empty
•	Too short
•	Too long
•	Letters
•	Special characters
•	Valid number
Resume
Test:
•	No file
•	Unsupported file type
•	Very large file
•	Empty file
•	Valid PDF
•	Valid DOC/DOCX if supported
________________________________________
7. EDGE CASE TESTING
Testing must not stop at the normal/happy path.
Test unusual situations such as:
•	User submits empty form.
•	User submits form multiple times.
•	User clicks Submit repeatedly.
•	User loses internet during submission.
•	API becomes unavailable.
•	Database becomes unavailable.
•	Upload fails.
•	Upload is interrupted.
•	User refreshes during submission.
•	User navigates away during submission.
•	User enters extremely long text.
•	User enters unexpected characters.
•	User uses unsupported file types.
•	User has a slow internet connection.
The application should fail gracefully rather than crashing.
________________________________________
8. SOFTWARE SERVICES PAGE
Test:
•	Software page loads.
•	Software services are displayed.
•	MVP services display correctly.
•	SaaS services display correctly.
•	End-to-end product development information displays correctly.
•	Website development section works.
•	Portfolio development section works.
•	Industry-specific solutions display correctly.
•	Healthcare section works.
•	Financial section works.
•	Agriculture section works.
•	Industry-specific project section works.
•	CTA buttons work.
•	Contact form works.
•	Animations work.
•	Responsive design works.
________________________________________
9. SOFTWARE/PRODUCT INQUIRY FORM
Test:
•	Name
•	Email
•	Phone/contact
•	Company/personal project information
•	Project requirements
•	Service interested in
•	Optional additional information
Test:
Valid submission
Invalid submission
Empty submission
Duplicate submission
Very long input
Special characters
Network failure
API failure
Database failure
________________________________________
10. BROWSER TESTING
Because this is a website, browser testing is mandatory.
Every major feature must be tested directly in a real browser.
Test at minimum:
•	Chrome
•	Edge
•	Firefox
•	Safari where available
Also test:
Desktop
•	1920×1080
•	1440×900
•	1366×768
Tablet
•	Typical tablet viewport
Mobile
•	Small mobile
•	Standard mobile
•	Large mobile
The exact dimensions can be expanded later according to the supported browser/device matrix.
________________________________________
11. RESPONSIVE TESTING
Every page must be checked at different screen sizes.
Verify:
•	Navigation
•	Menus
•	Buttons
•	Forms
•	Images
•	Videos
•	Text
•	Cards
•	Spacing
•	Animations
•	Footer
•	CTA sections
Nothing should:
•	Overflow horizontally.
•	Become unreadable.
•	Overlap.
•	Disappear unexpectedly.
•	Become impossible to click.
•	Break because of animation.
________________________________________
12. ANIMATION & VIDEO TESTING
Since the website intentionally uses modern animation, animation itself must be tested.
Check:
•	Scroll animations trigger correctly.
•	Elements do not flicker.
•	Animations do not overlap content.
•	Videos load correctly.
•	Video does not prevent page interaction.
•	Animation does not block buttons.
•	Animation does not cause excessive lag.
•	Mobile devices remain usable.
•	Reduced-motion preferences are respected where appropriate.
•	Failed video/media loading does not break the page.
Important rule
Visual effects must never be allowed to compromise functionality.
A beautiful animation that prevents a user from submitting a form is considered a bug.
________________________________________
13. API TESTING
Every API must be tested independently.
Test:
Successful request
Valid request
    ↓
API
    ↓
Expected response
Invalid request
Invalid request
    ↓
API
    ↓
Validation error
Also test:
•	Missing parameters
•	Invalid parameters
•	Unauthorized requests where applicable
•	Malformed requests
•	Duplicate requests
•	Server errors
•	Database errors
•	Timeout scenarios
The API should return appropriate status codes and useful error responses.
________________________________________
14. DATABASE TESTING
Verify:
•	Records are created correctly.
•	Required fields are stored.
•	Optional fields remain optional.
•	Data types are correct.
•	Relationships work.
•	Duplicate records are handled appropriately.
•	Invalid data cannot corrupt the database.
•	Database failures are handled gracefully.
For candidate submissions:
Candidate Form
      ↓
API
      ↓
Validation
      ↓
Database
      ↓
Candidate Record
Verify that the stored information matches the submitted information.
________________________________________
15. FILE/RESUME UPLOAD TESTING
Resume upload requires additional testing.
Test:
Supported
Valid PDF
Valid DOC/DOCX (if supported)
Unsupported
.exe
.zip
.js
.sh
Other unsupported files
Test:
•	File size limits.
•	Filename edge cases.
•	Duplicate filenames.
•	Special characters.
•	Very long filenames.
•	Corrupted files.
•	Upload interruption.
•	Network failure.
•	Storage failure.
Security validation must happen server-side, not only in the browser.
________________________________________
16. ERROR HANDLING TESTING
Every important operation must have:
Success state
Success → clear confirmation
Loading state
Submitting → loading indicator
Failure state
Failure → understandable error message
Retry state
Where appropriate:
Failure
   ↓
Retry
   ↓
Successful operation
Users should never see unexplained technical errors such as:
500 Internal Server Error
UnhandledPromiseRejection
undefined
null
unless such information is intentionally exposed in a development environment.
________________________________________
17. SECURITY TESTING
Security must be tested throughout development.
Check:
•	Form input validation.
•	Server-side validation.
•	File upload validation.
•	Authentication where applicable.
•	Authorization where applicable.
•	API access controls.
•	Sensitive information exposure.
•	Environment variables.
•	Secrets.
•	Database access.
•	Error messages.
•	Injection vulnerabilities.
•	XSS risks.
•	CSRF protections where applicable.
•	Rate limiting/abuse protections where appropriate.
Secrets must never be placed in frontend code or committed to Git.
________________________________________
18. PERFORMANCE TESTING
The website is animation-heavy, therefore performance is especially important.
Test:
•	Initial page loading.
•	JavaScript execution.
•	Image loading.
•	Video loading.
•	Animation performance.
•	API response time.
•	Form submission time.
•	Mobile performance.
Identify:
•	Large images.
•	Unnecessary JavaScript.
•	Heavy animations.
•	Unoptimized videos.
•	Unnecessary API calls.
•	Slow database queries.
________________________________________
19. ACCESSIBILITY TESTING
Test:
•	Keyboard navigation.
•	Focus states.
•	Form labels.
•	Button accessibility.
•	Color contrast.
•	Image alternative text.
•	Screen-reader compatibility where applicable.
•	Form error accessibility.
•	Reduced-motion support.
•	Logical heading structure.
A user should be able to understand and navigate the website even without relying entirely on animations.
________________________________________
20. REGRESSION TESTING
Whenever a new feature is added, previously completed features must be checked.
Example:
Feature 1 → Working ✓

Build Feature 2

Test Feature 2 ✓

Now retest Feature 1
If Feature 1 breaks because of Feature 2:
Identify bug
   ↓
Fix
   ↓
Retest Feature 2
   ↓
Retest Feature 1
   ↓
Regression passes
This continues throughout the project.
________________________________________
21. BUG REPORTING
Every discovered bug should be documented.
Use this format:
Bug ID:
Feature:
Severity:
Environment:
Steps to Reproduce:
Expected Result:
Actual Result:
Error:
Root Cause:
Fix:
Verification:
Status:
Example:
Bug ID: REC-001
Feature: Recruiting Application Form
Severity: High

Expected:
Valid application submits successfully.

Actual:
Submit button remains loading indefinitely.

Root Cause:
API response was not handled correctly.

Fix:
Corrected API response handling.

Verification:
Form submitted successfully in Chrome and Edge.

Status:
Resolved
________________________________________
22. BUG SEVERITY
Use a consistent severity system.
Critical
Application cannot function.
Example:
•	Website completely unavailable.
•	Database corruption.
•	Major security vulnerability.
High
Important functionality is broken.
Example:
•	Application form cannot submit.
•	Resume upload completely broken.
Medium
Feature works incorrectly but has a workaround.
Low
Minor visual or usability problem.
Example:
•	Slight spacing issue.
•	Minor animation problem.
________________________________________
23. TESTING AFTER BUG FIX
A bug is not considered fixed simply because the code was changed.
The complete cycle is:
Bug discovered
      ↓
Understand root cause
      ↓
Fix
      ↓
Run verification
      ↓
Run feature test again
      ↓
Run browser test again
      ↓
Run relevant regression tests
      ↓
Confirm bug is actually resolved
Only then can the feature be considered complete.
________________________________________
24. DEFINITION OF DONE
A feature is considered DONE only when:
•	Implementation completed
•	Code reviewed
•	Unit/component tests completed where appropriate
•	Validation tested
•	Error handling tested
•	Edge cases tested
•	API tested where applicable
•	Database tested where applicable
•	Browser tested
•	Responsive behavior tested
•	Animation tested
•	Accessibility checked
•	Security considerations checked
•	Bugs fixed
•	Regression testing completed
•	Final verification passed
•	Git commit created
________________________________________
25. COMPLETE TESTING WORKFLOW
The project should ultimately follow this process:
START
  ↓
Select ONE feature
  ↓
Understand requirements
  ↓
Create test scenarios
  ↓
Build feature
  ↓
Verify implementation
  ↓
Run automated tests
  ↓
Run browser tests
  ↓
Test valid inputs
  ↓
Test invalid inputs
  ↓
Test edge cases
  ↓
Test errors/failures
  ↓
Test responsive UI
  ↓
Test animation/media
  ↓
Security/performance checks
  ↓
BUG FOUND?
 ┌───────────────┐
 │               │
YES              NO
 │               │
 ↓               ↓
Find root cause  Regression test
 │               ↓
Fix bug          Final verification
 │               ↓
Verify fix       Commit
 │               ↓
Retest feature   NEXT FEATURE
 │
 └──────→ Repeat
________________________________________
26. FINAL PROJECT TEST
After all individual features have passed, perform one complete end-to-end test of the application.
Visitor journey
Landing Page
      ↓
Explore Website
      ↓
Recruiting Page
      ↓
Application
      ↓
Form Validation
      ↓
Resume Upload
      ↓
Submission
      ↓
Confirmation
Then:
Landing Page
      ↓
Software/Product Page
      ↓
Explore Services
      ↓
Inquiry Form
      ↓
Submit
      ↓
Confirmation
Both complete journeys must work.
________________________________________
27. FINAL RELEASE GATE
The application should NOT be considered ready for launch until:
All features tested
        +
All critical/high bugs resolved
        +
Forms verified
        +
Browser testing passed
        +
Mobile testing passed
        +
API testing passed
        +
Database testing passed
        +
Security checks passed
        +
Performance acceptable
        +
Accessibility checked
        +
End-to-end testing passed
        +
Regression testing passed
        ↓
      RELEASE
Core Rule for the Entire Project
Build one feature at a time. Test one feature at a time. Fix one feature at a time. Verify one feature at a time. Commit one completed feature at a time. Then move to the next feature.
Never allow multiple unfinished features to accumulate without verification.
And most importantly:
A feature is not complete when the code is written. It is complete only after it has been verified, tested in the browser, validated against requirements, had its bugs fixed, passed regression testing, and been committed successfully.

