-- =============================================================================
-- GENRA 0003: index resume_files.lead_id
--
-- Supabase advisor unindexed_foreign_keys. Resumes are looked up by lead, and
-- deleting a lead cascades into this table, so the foreign key needs an index
-- like every other lead_id column already has.
-- =============================================================================
create index if not exists idx_resume_files_lead on public.resume_files(lead_id);
