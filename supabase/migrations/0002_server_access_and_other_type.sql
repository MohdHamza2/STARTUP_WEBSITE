-- =============================================================================
-- GENRA 0002: optional recruiting email, server grants, "Other" project type,
-- function hardening
--
-- Applied 2026-10-05. The live project already had an EARLIER copy of 0001
-- (run by hand, before 0001 made email optional), so this migration brings it
-- in line. Every statement is idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Email optional, phone or email required.
--
-- Owner decision 2026-10-03: the recruiting form requires a phone number and
-- makes email optional. Project and contact enquiries still require email in
-- the server schemas. The check guarantees every lead is reachable.
-- -----------------------------------------------------------------------------
alter table public.leads alter column email drop not null;

alter table public.leads drop constraint if exists leads_contact_check;
alter table public.leads
    add constraint leads_contact_check
    check (email is not null or phone is not null);

-- -----------------------------------------------------------------------------
-- Grants for the server.
--
-- Newer Supabase projects do not grant new tables to the API roles
-- automatically. All application access is server-side with the secret
-- (service_role) key, so service_role gets exactly the privileges the server
-- needs. anon and authenticated keep NONE (revoked in 0001) and RLS stays on
-- with no policies, so the public key can neither read nor write a lead.
-- -----------------------------------------------------------------------------
grant usage on schema public to service_role;

grant select, insert, update, delete on
    public.leads,
    public.recruiting_leads,
    public.software_leads,
    public.resume_files,
    public.lead_events,
    public.lead_notes,
    public.admin_users
to service_role;

-- -----------------------------------------------------------------------------
-- "Other" project type.
--
-- When a visitor chooses Other and describes the kind of work, that text is a
-- project type in its own right, so it gets its own column instead of being
-- folded into additional_information. It is required exactly when the project
-- type is OTHER (the server schema enforces the same rule).
-- -----------------------------------------------------------------------------
alter table public.software_leads
    add column if not exists other_project_type varchar(200);

alter table public.software_leads
    drop constraint if exists software_leads_other_type_check;
alter table public.software_leads
    add constraint software_leads_other_type_check
    check (project_type is distinct from 'OTHER' or other_project_type is not null);

-- -----------------------------------------------------------------------------
-- Pin the trigger function's search_path (Supabase advisor:
-- function_search_path_mutable) and keep it off the public API.
-- -----------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

revoke execute on function public.touch_updated_at() from public, anon, authenticated;
