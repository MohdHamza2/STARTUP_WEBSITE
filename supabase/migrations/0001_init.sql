-- =============================================================================
-- GENRA — initial schema
--
-- This implements DOC4 §4.31 and §4.32 verbatim. Column names, types, lengths
-- and nullability are taken from that document, not invented. Where DOC4 leaves
-- something to the application layer (project types, visa status, education) the
-- column is VARCHAR and the permitted values live in src/content, exactly as
-- DOC4 §4.13 and §4.11 require.
--
-- Tables DOC4 §4.4 explicitly defers are NOT created here:
--   outreach_contacts, outreach_campaigns, outreach_messages, outreach_events
--
-- Apply with the Supabase SQL editor or `supabase db push`.
-- =============================================================================

-- gen_random_uuid()
create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- leads — the central table. Every submission creates one row here.
-- -----------------------------------------------------------------------------
create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),

    lead_type varchar(30) not null,

    name varchar(150) not null,
    -- NOT NULL per DOC4 §4.24 and §4.31, and owner decision D1. The build brief
    -- suggested making recruiting email optional; the approved database
    -- architecture takes precedence and was confirmed by the owner.
    email varchar(320) not null,
    phone varchar(50),

    -- VARCHAR rather than an enum, per DOC4 §4.8: new lead sources must not
    -- require a migration.
    source varchar(100),

    status varchar(40) not null default 'NEW',
    consent_status varchar(40) not null default 'NOT_PROVIDED',

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    -- DOC4 §4.24: lead_type and status must represent supported values. Enforced
    -- as CHECK constraints so invalid data cannot be written by any path.
    constraint leads_lead_type_check
        check (lead_type in ('RECRUITING', 'SOFTWARE')),
    constraint leads_status_check
        check (status in (
            'NEW', 'CONTACTED', 'RESPONDED', 'INTERESTED', 'QUALIFIED',
            'HANDED_OVER', 'CONVERTED', 'NOT_INTERESTED', 'INVALID',
            'UNSUBSCRIBED', 'DO_NOT_CONTACT', 'CLOSED'
        )),
    constraint leads_consent_status_check
        check (consent_status in (
            'NOT_PROVIDED', 'CONSENTED', 'DECLINED', 'WITHDRAWN'
        ))
);

-- -----------------------------------------------------------------------------
-- recruiting_leads — recruiting-specific fields (DOC4 §4.9).
-- Kept separate because none of these apply to software clients.
-- -----------------------------------------------------------------------------
create table if not exists public.recruiting_leads (
    lead_id uuid primary key
        references public.leads(id) on delete cascade,

    visa_status varchar(100),
    education varchar(150),
    university varchar(250),
    graduation_year integer,

    target_role varchar(200),
    preferred_industry varchar(150),
    location varchar(200),

    linkedin_url text,

    additional_information text
);

-- -----------------------------------------------------------------------------
-- software_leads — software-specific fields (DOC4 §4.12).
-- -----------------------------------------------------------------------------
create table if not exists public.software_leads (
    lead_id uuid primary key
        references public.leads(id) on delete cascade,

    company varchar(250),
    project_type varchar(100),
    business_or_personal varchar(50),
    industry varchar(150),

    current_website text,

    budget_range varchar(100),
    timeline varchar(100),

    project_description text not null,

    additional_information text
);

-- -----------------------------------------------------------------------------
-- resume_files — metadata only. The file itself lives in Supabase Storage
-- (DOC4 §4.15/§4.16). A lead may have more than one over time, so this is not
-- constrained to one row per lead.
-- -----------------------------------------------------------------------------
create table if not exists public.resume_files (
    id uuid primary key default gen_random_uuid(),

    lead_id uuid not null
        references public.leads(id) on delete cascade,

    storage_path text not null,
    original_filename text not null,
    mime_type varchar(100),
    file_size bigint,

    created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- lead_events — history and audit (DOC4 §4.18). JSONB metadata so a new event
-- property does not require a column (DOC4 §4.19).
-- -----------------------------------------------------------------------------
create table if not exists public.lead_events (
    id uuid primary key default gen_random_uuid(),

    lead_id uuid not null
        references public.leads(id) on delete cascade,

    event_type varchar(100) not null,
    metadata jsonb,

    created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- lead_notes — internal only. DOC4 §4.17: never exposed to the public user.
-- -----------------------------------------------------------------------------
create table if not exists public.lead_notes (
    id uuid primary key default gen_random_uuid(),

    lead_id uuid not null
        references public.leads(id) on delete cascade,

    created_by uuid,
    note text not null,

    created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- admin_users — internal team (DOC4 §4.20). Present for the future internal
-- dashboard; there is NO public authentication in this application.
-- -----------------------------------------------------------------------------
create table if not exists public.admin_users (
    id uuid primary key default gen_random_uuid(),

    email varchar(320) not null unique,
    name varchar(150) not null,

    role varchar(50) not null default 'VIEWER',
    is_active boolean not null default true,

    created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- Indexes — exactly the set in DOC4 §4.32.
-- -----------------------------------------------------------------------------
create index if not exists idx_leads_email on public.leads(email);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_type on public.leads(lead_type);
create index if not exists idx_leads_source on public.leads(source);
create index if not exists idx_leads_created_at on public.leads(created_at);

create index if not exists idx_recruiting_linkedin
    on public.recruiting_leads(linkedin_url);

create index if not exists idx_software_project_type
    on public.software_leads(project_type);
create index if not exists idx_software_industry
    on public.software_leads(industry);

create index if not exists idx_lead_events_lead on public.lead_events(lead_id);
create index if not exists idx_lead_events_created
    on public.lead_events(created_at);

create index if not exists idx_lead_notes_lead on public.lead_notes(lead_id);

-- -----------------------------------------------------------------------------
-- updated_at maintenance
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at
    before update on public.leads
    for each row execute function public.touch_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
--
-- DOC4 §4.29 and prompt §44: the browser must never reach this data.
--
-- RLS is enabled on every table and NO POLICY IS CREATED. With RLS on and no
-- policy, anon and authenticated roles are denied everything — which is exactly
-- what we want, because this application has no public accounts and all access
-- is server-side.
--
-- The service-role key bypasses RLS by design. It is used only in server code
-- and must never be sent to the browser or prefixed NEXT_PUBLIC_.
--
-- Adding a permissive policy here would expose candidate resumes, visa status
-- and contact details to anyone holding the public anon key. Do not add one.
-- =============================================================================

alter table public.leads enable row level security;
alter table public.recruiting_leads enable row level security;
alter table public.software_leads enable row level security;
alter table public.resume_files enable row level security;
alter table public.lead_events enable row level security;
alter table public.lead_notes enable row level security;
alter table public.admin_users enable row level security;

-- Belt and braces: revoke the default grants Supabase gives the public roles,
-- so the tables are unreachable even if RLS were later disabled by mistake.
revoke all on public.leads from anon, authenticated;
revoke all on public.recruiting_leads from anon, authenticated;
revoke all on public.software_leads from anon, authenticated;
revoke all on public.resume_files from anon, authenticated;
revoke all on public.lead_events from anon, authenticated;
revoke all on public.lead_notes from anon, authenticated;
revoke all on public.admin_users from anon, authenticated;

-- =============================================================================
-- STORAGE — private resume bucket
--
-- prompt §29/§41 and DOC2 §19: resumes must never be publicly accessible.
-- `public => false` means there is no public URL at all; the only way to read an
-- object is a signed URL generated server-side, or the service role.
--
-- No storage.objects policy is created for anon or authenticated, so neither can
-- list, read, insert or delete. Uploads happen server-side with the service role
-- after the file has passed type, size and magic-byte validation.
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'resumes',
    'resumes',
    false,
    10485760,                      -- 10 MB, matching DOC5 §5.11
    array['application/pdf']       -- PDF only, per owner decision D6
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;
