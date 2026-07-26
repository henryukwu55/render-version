-- ============================================================
-- Migration: store the student's email on session_summaries
-- Safe to run multiple times (fully idempotent)
-- Requires migration_add_email_domain_access.sql to have been run first,
-- since this relies on user_sessions.email existing.
-- ============================================================

ALTER TABLE session_summaries
  ADD COLUMN IF NOT EXISTS email VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_session_summaries_email
  ON session_summaries(email);
