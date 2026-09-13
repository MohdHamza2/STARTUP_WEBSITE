DOCUMENT 5 — FEATURE SPECIFICATION
Recruiting Lead & Application Funnel
Document Status: Draft for implementation
Feature: Recruiting Lead Submission
Priority: P0 / Critical
Primary Route: /recruiting
________________________________________
5.1 Feature Objective
The Recruiting feature allows a visitor who is interested in receiving recruiting/career assistance to submit their information to the company.
The complete flow should be:
Visitor
   ↓
Recruiting Page
   ↓
Understand Service
   ↓
CTA
   ↓
Recruiting Form
   ↓
Enter Information
   ↓
Optional Resume Upload
   ↓
Validation
   ↓
Submit
   ↓
Lead Created
   ↓
Team Notification
   ↓
Success Confirmation
   ↓
Recruiting Team Handles Follow-up
The visitor should not need to manually email the company after completing the form.
________________________________________
5.2 User Story
Primary user story
As a potential candidate looking for recruiting/career assistance, I want to submit my information and optionally upload my resume so that the recruiting team can review my profile and contact me.
Internal team story
As a recruiting team member, I want submitted candidates to automatically appear in our lead database and receive a notification so that I can follow up with interested candidates.
________________________________________
5.3 Entry Points
Users can reach the Recruiting feature through:
Homepage
   ↓
"Explore Recruiting"
or:
Homepage
   ↓
"Get Started"
   ↓
Recruiting
or directly:
/recruiting
Potential future sources:
Google
LinkedIn
Instagram
Reddit
Email
Referral
Paid/organic campaigns
The source should eventually be captured through URL parameters where appropriate.
Example concept:
/recruiting?source=linkedin
________________________________________
5.4 Recruiting Page Structure
The complete page:
/recruiting
│
├── Navigation
│
├── Hero
│
├── Who We Help
│
├── How It Works
│
├── What We Help With
│
├── Candidate Benefits
│
├── Visual / Video Section
│
├── Social Proof
│
├── FAQ
│
├── Application CTA
│
├── Recruiting Form
│
└── Footer
________________________________________
5.5 Hero
The hero must immediately communicate:
What we do
Recruiting/career assistance.
Who it is for
Candidates looking for opportunities, particularly people navigating the US job market.
Desired action
Submit profile / Get Started.
Conceptual structure:
------------------------------------------------
               RECRUITING / CAREERS

        Your Next Opportunity
        Starts Here.

   We help candidates navigate their
   job search and connect with relevant
   opportunities.

           [ Get Started ]

          ↓ Scroll to explore
------------------------------------------------
The final marketing copy will be finalized separately.
________________________________________
5.6 How It Works
Keep this simple.
01
Tell Us About Yourself

        ↓

02
Share Your Resume

        ↓

03
Our Team Reviews Your Profile

        ↓

04
We Follow Up With You
Do not promise:
Guaranteed job placement.
The site should communicate assistance and opportunity, not a guaranteed employment outcome.
________________________________________
5.7 Form UX
The form should not feel like a government application.
It should feel modern, simple and approachable.
Recommended structure:
Step 1
Basic Information

Step 2
Education & Work Information

Step 3
Resume & Preferences

Step 4
Review & Submit
However, we should initially implement it as a single logical form with sections rather than overcomplicating it with multiple pages.
________________________________________
5.8 Form Fields
Section A — Basic Information
Full Name
Required
Type: text
Validation:
Minimum: 2 characters
Maximum: 150 characters
________________________________________
Email
Required
Type: email
Validation:
Valid email format
Maximum 320 characters
________________________________________
Phone Number
Optional
Type: tel
The application should accept international formats rather than assuming every candidate has a US number.
________________________________________
5.9 Section B — Education
Current Education
Optional
Possible UI options:
Bachelor's
Master's
PhD
Recently Graduated
Working Professional
Other
________________________________________
University
Optional
Type: text
________________________________________
Graduation Year
Optional
Type: number/select
________________________________________
5.10 Section C — Recruiting Information
US Visa / Work Authorization Status
Optional
Possible values:
F-1
F-1 OPT
STEM OPT
H-1B
H-4 EAD
J-1
Other
Prefer not to say
The list must remain editable later.
________________________________________
Target Job / Role
Example:
Software Engineer
Data Analyst
Business Analyst
Product Manager
etc.
Optional
________________________________________
Preferred Industry
Example:
Technology
Healthcare
Finance
Agriculture
Manufacturing
Other
________________________________________
Current / Preferred Location
Optional
________________________________________
LinkedIn Profile
Optional
Validation should ensure that if provided, it is a valid URL.
________________________________________
5.11 Section D — Resume
Resume Upload
Optional
Supported initial formats:
PDF
DOC
DOCX
Recommended initial size limit:
10 MB
This should be configurable.
________________________________________
5.12 Resume UX
The upload component should look modern.
Example:
┌─────────────────────────────────────┐
│                                     │
│       ↑ Drop your resume here       │
│                                     │
│       or Browse Files               │
│                                     │
│       PDF, DOC, DOCX · Max 10 MB    │
│                                     │
└─────────────────────────────────────┘
After upload:
┌─────────────────────────────────────┐
│ 📄 Mohammed_Hamza_Resume.pdf        │
│ 1.8 MB                              │
│                                     │
│                       Remove ✕       │
└─────────────────────────────────────┘
________________________________________
5.13 Additional Information
Optional
Textarea
Placeholder:
Tell us anything else you'd like our team to know.
________________________________________
5.14 Consent
The form should include an appropriate communication/consent statement.
Conceptually:
☐ I agree to be contacted regarding my inquiry
  and understand that submitting this form does
  not guarantee employment or placement.
The exact legal language should be reviewed before production launch.
________________________________________
5.15 Submit Button
Primary CTA:
Submit Profile
Alternative:
Get Started
During submission:
Submitting...
The button must be disabled while the request is processing to prevent accidental duplicate submissions.
________________________________________
5.16 Frontend Validation
Use:
React Hook Form
        +
Zod
Flow:
User Input
    ↓
React Hook Form
    ↓
Zod Validation
    ↓
Valid?
 ┌──────┴──────┐
 NO           YES
 │             │
 ▼             ▼
Error        Submit
Message
Errors should appear next to the relevant field.
Example:
Email
[hamza@             ]

Please enter a valid email address.
________________________________________
5.17 Server-Side Validation
Frontend validation is not enough.
The server must validate the request again.
Browser
   │
   ▼
API
   │
   ▼
Zod Server Validation
   │
   ▼
Database
A malicious user can bypass browser validation, so the API must never trust incoming data.
________________________________________
5.18 Submission API
Proposed endpoint:
POST /api/leads/recruiting
Request concept:
{
  "name": "...",
  "email": "...",
  "phone": "...",
  "education": "...",
  "university": "...",
  "graduationYear": 2027,
  "visaStatus": "...",
  "targetRole": "...",
  "preferredIndustry": "...",
  "location": "...",
  "linkedinUrl": "...",
  "additionalInformation": "..."
}
Resume upload should be handled securely according to the final storage implementation rather than blindly accepting arbitrary file content through the API.
________________________________________
5.19 Submission Sequence
User
 │
 │ Submit
 ▼
Frontend
 │
 │ POST
 ▼
Next.js API
 │
 ├── Validate request
 │
 ├── Validate anti-bot/rate-limit checks
 │
 ├── Create Lead
 │
 ├── Create Recruiting Lead
 │
 ├── Store Resume
 │
 ├── Create Event
 │
 └── Send Notification
 │
 ▼
Success
________________________________________
5.20 Database Transaction
Where practical, creation of the related database records should be treated as one logical operation.
Conceptually:
BEGIN
   │
   ├── Create leads
   │
   ├── Create recruiting_leads
   │
   ├── Create resume metadata
   │
   └── Create lead event
   │
COMMIT
If a critical database operation fails:
ROLLBACK
We should avoid situations where the database says:
Recruiting lead exists
but its associated data was only partially created.
________________________________________
5.21 Resume Upload Failure
Resume upload is optional.
Therefore:
Form submitted
      │
      ├── No resume
      │      ↓
      │    Continue
      │
      └── Resume
             ↓
          Upload
             │
        ┌────┴────┐
        ▼         ▼
      Success    Failure
        │         │
        ▼         ▼
      Continue   Explain
A failed optional resume upload should not necessarily destroy the entire lead submission.
The UX can tell the user:
Your profile was submitted, but your resume could not be uploaded. You can try again.
The exact behavior will depend on the final implementation.
________________________________________
5.22 Success State
After successful submission:
              ✓

       Profile Submitted

Thank you. Our team has received
your information and will review
your profile.

       [ Back to Home ]
Avoid claiming:
We found you a job.
The form only means the company received the candidate's information.
________________________________________
5.23 Email Notification
After a successful lead:
New Recruiting Lead

Name: ...
Email: ...
Phone: ...
Education: ...
Visa Status: ...
Target Role: ...
Industry: ...

Resume: Available

Source: LinkedIn
The recruiting team receives this automatically.
________________________________________
5.24 Candidate Confirmation Email
If enabled:
Subject:
We've received your profile
Content should confirm receipt and explain the next step without promising employment.
________________________________________
5.25 Lead Event
On submission:
event_type = FORM_SUBMITTED
Metadata could include:
{
  "lead_type": "RECRUITING",
  "resume_uploaded": true,
  "source": "linkedin"
}
________________________________________
5.26 Lead Status
New submissions begin as:
NEW
Later the recruiting team can move them:
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
HANDED_OVER
________________________________________
5.27 Source Attribution
The system should support:
source
and ideally:
utm_source
utm_medium
utm_campaign
utm_content
utm_term
This is extremely useful for the future outreach/marketing system.
Example:
LinkedIn campaign
       ↓
Website
       ↓
Recruiting form
       ↓
Database
       ↓
source = linkedin
campaign = fall-2026
Then the team can determine which acquisition channel actually generates leads.
________________________________________
5.28 Spam Protection
The endpoint must be protected.
Recommended layers:
Cloudflare
    ↓
Turnstile
    ↓
Rate Limit
    ↓
Server Validation
    ↓
Database
Rate limiting should prevent one IP/client from flooding the endpoint.
________________________________________
5.29 Security Requirements
Never expose:
Supabase service-role key
Resend API key
Database credentials
Other private secrets
to client-side JavaScript.
Use:
.env.local
for local development.
Production secrets should be configured through the hosting provider's environment-variable system.
________________________________________
5.30 Privacy Requirements
Because the form collects potentially sensitive candidate information, we need:
Privacy Policy
Terms
Consent mechanism
Secure storage
Restricted internal access
Resume URLs should not be publicly guessable or publicly exposed.
________________________________________
5.31 Accessibility
The form must support:
•	Keyboard navigation
•	Screen readers
•	Visible focus states
•	Proper labels
•	Accessible errors
•	Accessible upload component
•	Mobile input controls
Animation must not prevent form completion.
________________________________________
5.32 Mobile UX
A large percentage of social-media traffic may eventually come from mobile.
Therefore the form must work properly on:
Phone
Tablet
Desktop
On mobile:
Full-width inputs
Large touch targets
Minimal unnecessary text
Simple upload interaction
Sticky/visible CTA where appropriate
________________________________________
5.33 Animation Requirements
The form itself should be animated, but not excessively.
Recommended:
Page load
   ↓
Hero reveal

Scroll
   ↓
Section reveal

Form enters viewport
   ↓
Subtle reveal

Input focus
   ↓
Micro interaction

Submit
   ↓
Loading transition

Success
   ↓
Animated confirmation
Avoid:
Input constantly moving
Excessive parallax
Animations that delay typing
Animations that block submission
________________________________________
5.34 Performance Requirements
The form should remain usable even if the rest of the page contains heavy visual effects.
Important principle:
Form functionality must never depend on the animation system.
If GSAP fails:
Form should still work.
If video fails:
Form should still work.
If animation is disabled:
Form should still work.
________________________________________
5.35 Error States
Validation error
Please correct the highlighted fields.
Network error
Something went wrong while submitting.
Please try again.
Server error
We couldn't process your request right now.
Please try again later.
File error
This file type isn't supported.
Please upload PDF, DOC or DOCX.
File size
Your resume exceeds the maximum
allowed file size.
________________________________________
5.36 Duplicate Submission
If a user clicks submit multiple times:
First click
   ↓
Submitting...
   ↓
Button disabled
This prevents accidental duplicates.
The backend should also consider idempotency/duplicate detection for robustness.
________________________________________
5.37 Admin Notification
The initial version can simply notify the relevant team by email.
Later:
Email
 +
Admin Dashboard
 +
CRM
 +
Outreach Automation
can be added without redesigning the public form.
________________________________________
5.38 Future Outreach Integration
This feature is deliberately designed to become the input layer for the future outreach/CRM system.
                    LEAD SOURCES
                         │
                         ▼
                  ┌─────────────┐
                  │ LEAD SYSTEM │
                  └──────┬──────┘
                         │
            ┌────────────┼────────────┐
            ▼            ▼            ▼
         Website      Future       Referral
         Forms       Channels
            │            │
            └────────────┼────────────┘
                         ▼
                       LEADS
                         │
                         ▼
                  Qualification
                         │
                         ▼
                  Recruiting Team
This means the work we do now isn't wasted when the larger outreach automation is built.
________________________________________
5.39 Feature Acceptance Criteria
The feature is considered complete only when:
Form
•	Recruiting page exists
•	Form is responsive
•	All required fields work
•	Optional fields work
•	Resume upload works
•	Validation works
•	Error messages work
•	Submit button has loading state
Backend
•	API endpoint exists
•	Server validation works
•	Lead is created
•	Recruiting details are created
•	Resume metadata is stored
•	Lead event is created
Notifications
•	Team notification works
•	Candidate confirmation works if enabled
Security
•	Secrets aren't exposed
•	Upload restrictions work
•	Rate limiting works
•	Bot protection works
•	Database access is protected
UX
•	Success screen works
•	Mobile layout works
•	Keyboard navigation works
•	Reduced-motion behavior works
Analytics
•	Form started event
•	Form submitted event
•	Resume uploaded event
•	Submission success/failure tracking
________________________________________
5.40 Definition of Done
We do not consider the feature complete merely because:
"The form appears on the screen."
It is complete only when:
Frontend
   ↓
Validation
   ↓
API
   ↓
Database
   ↓
Resume Storage
   ↓
Event Tracking
   ↓
Team Notification
   ↓
Success UX
all work together.
________________________________________
5.41 Feature Boundary
Included now
✅ Recruiting landing page
✅ Recruiting form
✅ PostgreSQL integration
✅ Resume upload
✅ Lead creation
✅ Lead events
✅ Email notification
✅ Validation
✅ Security foundation
✅ Analytics events 
Not included yet
❌ Automated LinkedIn messaging
❌ Automated Reddit messaging
❌ Automated Instagram messaging
❌ Mass unsolicited outreach
❌ AI deciding who should receive messages
❌ Full CRM
❌ Recruiting-team dashboard
❌ Automated candidate qualification 
Those belong to later feature documents and must be designed around the actual capabilities and policies of each platform.
________________________________________
5.42 Final Feature Architecture
                    VISITOR
                       │
                       ▼
               /recruiting
                       │
                       ▼
                 Recruiting UI
                       │
                       ▼
                  Lead Form
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        Form Validation       Resume
             │                   │
             └─────────┬─────────┘
                       ▼
                Next.js API
                       │
                Security Layer
                       │
                       ▼
                  PostgreSQL
                  /       \
                 /         \
                ▼           ▼
         Recruiting Lead   Events
                │
                ▼
        Supabase Storage
                │
                ▼
             Resume
                       
                       │
                       ▼
                    Resend
                       │
              ┌────────┴────────┐
              ▼                 ▼
        Recruiting Team      Candidate
         Notification       Confirmation
________________________________________
Document 5 conclusion
The Recruiting Lead Funnel is now fully specified at the feature level.
The most important architectural decision is that this isn't just a frontend form. It is the first complete lead acquisition pipeline:
Visitor → Form → Validation → Database → Resume → Event → Notification → Team Follow-up
That gives us the foundation for the much larger objective you described.

