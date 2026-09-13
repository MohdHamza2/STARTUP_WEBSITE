DOCUMENT 4 — DATABASE DESIGN
4.1 Database Objective
The database must support the company's two primary business funnels:
1.	Recruiting / Career Assistance
2.	Software / Product Development
Both funnels generate leads, so they will share a central leads entity while maintaining separate detail tables for each type.
The database should also support:
•	Contact information
•	Recruiting applications
•	Resume references
•	Software project inquiries
•	Lead source tracking
•	Lead status
•	Team handoff
•	Internal notes
•	Activity/history
•	Consent/preferences
•	Future CRM/outreach integration
•	Analytics references
•	Auditability
________________________________________
4.2 Database Technology
Primary database
PostgreSQL
Recommended hosted implementation:
Supabase PostgreSQL
We are deliberately not using Docker.
Architecture:
Next.js
   │
   ▼
Supabase
   │
   └── PostgreSQL
File uploads such as resumes should use:
Supabase Storage
rather than storing the actual file inside PostgreSQL.
________________________________________
4.3 Core Data Model
The central relationship is:
                         ┌─────────────────┐
                         │      LEADS      │
                         └────────┬────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
        ┌────────────────┐ ┌──────────────┐ ┌──────────────┐
        │  RECRUITING   │ │   SOFTWARE   │ │ LEAD EVENTS  │
        │     LEAD      │ │     LEAD     │ │              │
        └───────┬────────┘ └──────────────┘ └──────────────┘
                │
                ▼
        ┌────────────────┐
        │ RESUME FILES   │
        └────────────────┘

                         LEADS
                           │
                           ▼
                    ┌──────────────┐
                    │ LEAD NOTES   │
                    └──────────────┘
________________________________________
4.4 Tables
The initial database will contain:
leads
recruiting_leads
software_leads
resume_files
lead_notes
lead_events
admin_users
Potential future tables:
outreach_contacts
outreach_campaigns
outreach_messages
outreach_events
These should not be implemented prematurely. They belong to the future outreach system once its requirements and permitted integrations are finalized.
________________________________________
4.5 TABLE — leads
This is the central table.
Every person/company submitting a form gets a record here.
Purpose
Stores information common to both recruiting and software leads.
Field	Type	Required	Description
id	UUID	Yes	Primary key
lead_type	ENUM	Yes	Recruiting or software
name	VARCHAR	Yes	Lead's name
email	VARCHAR	Yes	Primary email
phone	VARCHAR	No	Contact number
source	VARCHAR	No	Where lead originated
status	ENUM	Yes	Current lead status
consent_status	ENUM	Yes	Communication preference/consent
created_at	TIMESTAMPTZ	Yes	Creation time
updated_at	TIMESTAMPTZ	Yes	Last update
________________________________________
4.6 Lead Type
Use:
RECRUITING
SOFTWARE
This allows the application to determine which funnel generated the lead.
Example:
lead_type = RECRUITING
versus:
lead_type = SOFTWARE
________________________________________
4.7 Lead Status
Initial lifecycle:
NEW
CONTACTED
RESPONDED
INTERESTED
QUALIFIED
HANDED_OVER
CONVERTED
NOT_INTERESTED
INVALID
UNSUBSCRIBED
DO_NOT_CONTACT
CLOSED
Lifecycle
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
INTERESTED    NOT_INTERESTED
 │
 ▼
QUALIFIED
 │
 ▼
HANDED_OVER
 │
 ▼
TEAM FOLLOW-UP
 │
 ▼
CONVERTED
This is intentionally more comprehensive than the initial website needs.
It gives the future recruiting team enough structure to manage leads.
________________________________________
4.8 Source Tracking
The source field should support sources such as:
WEBSITE
LINKEDIN
GOOGLE
REDDIT
INSTAGRAM
FACEBOOK
REFERRAL
DIRECT
OTHER
However, we should not restrict the database to only these values if future sources are added.
Better implementation:
source VARCHAR
rather than an inflexible database enum.
We can later introduce a dedicated source table if the outreach platform becomes sophisticated.
________________________________________
4.9 TABLE — recruiting_leads
This table contains recruiting-specific information.
Relationship:
leads.id
     │
     │ 1 : 1
     ▼
recruiting_leads.lead_id
Fields:
Field	Type	Required	Description
lead_id	UUID	Yes	FK → leads.id
visa_status	VARCHAR	No	US visa/status information
education	VARCHAR	No	Current education
university	VARCHAR	No	University
graduation_year	INTEGER	No	Expected/completed year
target_role	VARCHAR	No	Desired role
preferred_industry	VARCHAR	No	Preferred industry
location	VARCHAR	No	Current/preferred location
linkedin_url	TEXT	No	LinkedIn profile
additional_information	TEXT	No	Additional user information
Why separate this table?
Because these fields don't apply to software clients.
We should not put:
visa_status
university
graduation_year
inside the general leads table.
________________________________________
4.10 Education Field
The user specifically requested education to be optional.
Therefore:
education NULLABLE
Possible values might eventually include:
Bachelor's
Master's
PhD
Bootcamp
Other
But the database should initially store the user's actual value rather than forcing an unnecessarily restrictive enum.
________________________________________
4.11 Visa Status
The form can provide a controlled list to users, but the database should store it as text.
Possible options:
F-1
F-1 OPT
STEM OPT
H-1B
H-4 EAD
J-1
Other
Prefer not to say
This list should be treated as editable application content, not permanently hard-coded into the database.
________________________________________
4.12 TABLE — software_leads
Software-specific information belongs here.
Field	Type	Required	Description
lead_id	UUID	Yes	FK → leads.id
company	VARCHAR	No	Company name
project_type	VARCHAR	No	Type of project
business_or_personal	VARCHAR	No	Intended use
industry	VARCHAR	No	Industry
current_website	TEXT	No	Existing website
budget_range	VARCHAR	No	Estimated budget
timeline	VARCHAR	No	Expected timeline
project_description	TEXT	Yes	Project requirements
additional_information	TEXT	No	Additional details
________________________________________
4.13 Project Types
Possible values:
MVP
SAAS
WEB_APPLICATION
WEBSITE
PORTFOLIO
E_COMMERCE
INTERNAL_BUSINESS_SOFTWARE
API_BACKEND
AI_PRODUCT
INDUSTRY_SPECIFIC
OTHER
Again, these should preferably be managed as frontend configuration/content rather than making the PostgreSQL schema unnecessarily rigid.
________________________________________
4.14 Industry
Initial industries:
Healthcare
Finance
Agriculture
Industrial
Other
Future additions can include:
Education
Real Estate
Logistics
Retail
Manufacturing
Technology
Professional Services
________________________________________
4.15 TABLE — resume_files
The resume itself should live in Supabase Storage.
PostgreSQL stores its metadata.
Field	Type	Description
id	UUID	Primary key
lead_id	UUID	FK → leads.id
storage_path	TEXT	Storage location
original_filename	TEXT	Original file name
mime_type	VARCHAR	File MIME type
file_size	BIGINT	File size
created_at	TIMESTAMPTZ	Upload time
Relationship:
Lead
 │
 └── Resume File
A lead can potentially have multiple resume versions in the future.
Therefore we should not force this to one resume forever.
________________________________________
4.16 Resume Storage
Actual architecture:
User
 │
 ▼
Upload Resume
 │
 ▼
Validation
 │
 ▼
Supabase Storage
 │
 └── resumes/
       └── <lead-id>/
             └── resume-file
Database:
resume_files
     │
     └── storage_path
This separates:
file storage
from
business data.
________________________________________
4.17 TABLE — lead_notes
Internal recruiting/team notes.
Field	Type	Description
id	UUID	Primary key
lead_id	UUID	FK → leads.id
created_by	UUID	FK → admin_users.id
note	TEXT	Internal note
created_at	TIMESTAMPTZ	Creation time
Example:
Lead: John Doe

Notes:

"Interested in software engineering positions."
"Needs follow-up next week."
"Resume reviewed."
These notes should never be exposed to the public user.
________________________________________
4.18 TABLE — lead_events
This records important changes.
Example events:
LEAD_CREATED
FORM_SUBMITTED
RESUME_UPLOADED
STATUS_CHANGED
EMAIL_SENT
TEAM_HANDOFF
CONSENT_UPDATED
Fields:
Field	Type	Description
id	UUID	Primary key
lead_id	UUID	FK
event_type	VARCHAR	Event type
metadata	JSONB	Additional event information
created_at	TIMESTAMPTZ	Event timestamp
________________________________________
4.19 Why JSONB for Metadata?
Suppose an event contains:
{
  "old_status": "NEW",
  "new_status": "CONTACTED"
}
Another event could contain:
{
  "email_template": "recruiting-introduction"
}
Rather than creating a different table column for every possible event property, JSONB provides flexibility.
________________________________________
4.20 TABLE — admin_users
Internal team members.
Fields:
Field	Type	Description
id	UUID	Primary key
email	VARCHAR	Team member email
name	VARCHAR	Name
role	VARCHAR	Team role
is_active	BOOLEAN	Account active
created_at	TIMESTAMPTZ	Creation date
Potential roles:
ADMIN
RECRUITER
SALES
MANAGER
VIEWER
The exact authorization model can be finalized when the internal admin dashboard is designed.
________________________________________
4.21 Complete Relationship Diagram
                         ┌─────────────────────┐
                         │       LEADS         │
                         │─────────────────────│
                         │ id PK               │
                         │ lead_type           │
                         │ name                │
                         │ email               │
                         │ phone               │
                         │ source              │
                         │ status              │
                         │ consent_status      │
                         │ created_at          │
                         │ updated_at          │
                         └─────────┬───────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                │                  │                  │
                ▼                  ▼                  ▼
     ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
     │ RECRUITING      │ │ SOFTWARE        │ │ LEAD_EVENTS     │
     │ LEADS           │ │ LEADS           │ │                 │
     │─────────────────│ │─────────────────│ │─────────────────│
     │ lead_id FK      │ │ lead_id FK      │ │ id PK           │
     │ visa_status     │ │ company         │ │ lead_id FK      │
     │ education       │ │ project_type    │ │ event_type      │
     │ university      │ │ industry        │ │ metadata JSONB  │
     │ graduation_year │ │ budget          │ │ created_at      │
     │ target_role     │ │ timeline        │ └─────────────────┘
     │ industry        │ │ description     │
     │ linkedin_url    │ └─────────────────┘
     │ location        │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ RESUME_FILES    │
     │─────────────────│
     │ id PK           │
     │ lead_id FK      │
     │ storage_path    │
     │ filename        │
     │ mime_type       │
     │ file_size       │
     │ created_at      │
     └─────────────────┘

              LEADS
                │
                ▼
        ┌─────────────────┐
        │   LEAD_NOTES    │
        │─────────────────│
        │ id PK           │
        │ lead_id FK      │
        │ created_by FK   │
        │ note            │
        │ created_at      │
        └─────────────────┘
                │
                ▼
        ┌─────────────────┐
        │  ADMIN_USERS    │
        └─────────────────┘
________________________________________
4.22 Primary Keys
All major entities should use UUIDs.
Example:
id UUID PRIMARY KEY
Advantages:
•	Safer than sequential public IDs
•	Better for distributed systems
•	Difficult to enumerate
•	Suitable for future integrations
________________________________________
4.23 Foreign Keys
Relationships:
recruiting_leads.lead_id
        → leads.id

software_leads.lead_id
        → leads.id

resume_files.lead_id
        → leads.id

lead_notes.lead_id
        → leads.id

lead_notes.created_by
        → admin_users.id

lead_events.lead_id
        → leads.id
________________________________________
4.24 Constraints
Important constraints:
Email
NOT NULL
for leads.
Lead type
Must represent a supported lead category.
Status
Must represent a valid lifecycle state.
Foreign keys
Must reference existing records.
Resume
File size/type restrictions should be enforced at the application/storage layer in addition to database metadata validation.
________________________________________
4.25 Indexes
Important indexes:
leads.email
leads.status
leads.lead_type
leads.source
leads.created_at

recruiting_leads.linkedin_url

software_leads.project_type
software_leads.industry

lead_events.lead_id
lead_events.created_at

lead_notes.lead_id
This allows queries such as:
Show all new recruiting leads.
or:
Show software leads received this month.
to remain fast.
________________________________________
4.26 Duplicate Lead Handling
This is important.
A person could submit the recruiting form twice.
We should not blindly create duplicate people.
Potential strategy:
Email
  │
  ▼
Existing lead?
 ┌───────┴────────┐
NO                YES
│                  │
▼                  ▼
Create          Update /
Lead            Record Event
However, we should not necessarily enforce UNIQUE(email) globally, because the same person could potentially submit different service inquiries.
Instead, duplicate detection can initially happen at the application/business-logic layer.
________________________________________
4.27 Consent and Communication Preferences
Because this system is intended to become a lead-generation and future outreach platform, communication preferences need to be explicitly represented.
Initial field:
consent_status
Possible values:
NOT_PROVIDED
CONSENTED
DECLINED
WITHDRAWN
For future outreach, we should eventually expand this into channel-specific consent/preferences.
For example:
email_allowed
sms_allowed
marketing_allowed
But these should only be added when the actual outreach requirements are finalized.
________________________________________
4.28 Future Outreach Extension
The architecture intentionally leaves room for:
                    LEADS
                      │
                      ▼
              OUTREACH SYSTEM
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
     Email        Platform A      Platform B
       │              │              │
       └──────────────┼──────────────┘
                      ▼
              OUTREACH EVENTS
                      │
                      ▼
                    LEADS
Possible future entities:
outreach_campaigns
outreach_contacts
outreach_messages
outreach_events
We will design these separately because the rules and APIs of each outreach channel need to be verified before implementation.
________________________________________
4.29 Data Privacy
The database will contain potentially sensitive applicant information such as:
•	Phone numbers
•	Email addresses
•	Visa status
•	Education
•	LinkedIn URLs
•	Resumes
Therefore:
Never expose the database directly to the browser.
Correct:
Browser
   ↓
Next.js server/API
   ↓
Supabase
Not:
Browser
   ↓
Direct unrestricted database access
Supabase Row Level Security should be configured appropriately.
________________________________________
4.30 Data Retention
The PRD should eventually establish a formal retention policy.
For now:
Lead data → retained for business/recruiting operations
Resume → retained only as long as operationally justified
Events → retained for audit/history
The exact retention periods should be determined before production launch rather than inventing arbitrary periods now.
________________________________________
4.31 Proposed PostgreSQL Schema
Conceptually:
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_type VARCHAR(30) NOT NULL,

    name VARCHAR(150) NOT NULL,
    email VARCHAR(320) NOT NULL,
    phone VARCHAR(50),

    source VARCHAR(100),

    status VARCHAR(40) NOT NULL DEFAULT 'NEW',

    consent_status VARCHAR(40) NOT NULL DEFAULT 'NOT_PROVIDED',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Recruiting:
CREATE TABLE recruiting_leads (
    lead_id UUID PRIMARY KEY
        REFERENCES leads(id) ON DELETE CASCADE,

    visa_status VARCHAR(100),
    education VARCHAR(150),
    university VARCHAR(250),
    graduation_year INTEGER,

    target_role VARCHAR(200),
    preferred_industry VARCHAR(150),
    location VARCHAR(200),

    linkedin_url TEXT,

    additional_information TEXT
);
Software:
CREATE TABLE software_leads (
    lead_id UUID PRIMARY KEY
        REFERENCES leads(id) ON DELETE CASCADE,

    company VARCHAR(250),
    project_type VARCHAR(100),
    business_or_personal VARCHAR(50),
    industry VARCHAR(150),

    current_website TEXT,

    budget_range VARCHAR(100),
    timeline VARCHAR(100),

    project_description TEXT NOT NULL,

    additional_information TEXT
);
Resume metadata:
CREATE TABLE resume_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_id UUID NOT NULL
        REFERENCES leads(id) ON DELETE CASCADE,

    storage_path TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    mime_type VARCHAR(100),
    file_size BIGINT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Events:
CREATE TABLE lead_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_id UUID NOT NULL
        REFERENCES leads(id) ON DELETE CASCADE,

    event_type VARCHAR(100) NOT NULL,

    metadata JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Notes:
CREATE TABLE lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    lead_id UUID NOT NULL
        REFERENCES leads(id) ON DELETE CASCADE,

    created_by UUID,

    note TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
Admin users:
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    email VARCHAR(320) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,

    role VARCHAR(50) NOT NULL DEFAULT 'VIEWER',

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
________________________________________
4.32 Indexes
Initial indexes:
CREATE INDEX idx_leads_email
ON leads(email);

CREATE INDEX idx_leads_status
ON leads(status);

CREATE INDEX idx_leads_type
ON leads(lead_type);

CREATE INDEX idx_leads_source
ON leads(source);

CREATE INDEX idx_leads_created_at
ON leads(created_at);

CREATE INDEX idx_recruiting_linkedin
ON recruiting_leads(linkedin_url);

CREATE INDEX idx_software_project_type
ON software_leads(project_type);

CREATE INDEX idx_software_industry
ON software_leads(industry);

CREATE INDEX idx_lead_events_lead
ON lead_events(lead_id);

CREATE INDEX idx_lead_events_created
ON lead_events(created_at);

CREATE INDEX idx_lead_notes_lead
ON lead_notes(lead_id);
________________________________________
4.33 Database → Application Flow
Recruiting
User
 ↓
Recruiting Form
 ↓
Validation
 ↓
Create leads record
 ↓
Create recruiting_leads record
 ↓
Upload resume
 ↓
Create resume_files record
 ↓
Create LEAD_CREATED event
 ↓
Send team notification
Software
User
 ↓
Software Form
 ↓
Validation
 ↓
Create leads record
 ↓
Create software_leads record
 ↓
Create LEAD_CREATED event
 ↓
Send team notification
________________________________________
4.34 Database Design Decision
The final database architecture is:
One central leads table + specialized recruiting/software tables + resume metadata + event history + internal notes + admin users.
This provides a clean foundation for the website now while leaving room for the eventual recruiting/outreach platform.
Important architectural principle
We should not build the future outreach database prematurely.
First:
Website
 ↓
Lead Generation
 ↓
Lead Database
 ↓
Team Handoff
Then:
Lead Database
 ↓
Outreach / CRM Automation
That separation will make the system much easier to maintain.
________________________________________
Document 4 status
Area	Decision
Database	PostgreSQL
Hosting	Supabase
Docker	❌ Not used
Primary IDs	UUID
Lead model	Centralized
Recruiting data	Separate table
Software data	Separate table
Resume	Supabase Storage
Resume metadata	PostgreSQL
Lead history	lead_events
Internal notes	lead_notes
Admin users	admin_users
Future outreach	Separate extension
Security	RLS + server-side API
Content	CMS-managed where appropriate
Document 4 is now complete.
The next document from your original sequence is Document 5 — Build One Feature. For this project, I recommend that we do the complete Recruiting Lead Form as our first feature because it is the most important conversion point: frontend → validation → resume upload → PostgreSQL → email notification → success/error handling.

