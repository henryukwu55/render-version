-- ============================================================
-- Migration: restrict permanent access to an exact list of student
-- emails instead of a whole email domain.
-- Safe to run multiple times (fully idempotent)
-- ============================================================

CREATE TABLE IF NOT EXISTS allowed_student_emails (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    label VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_allowed_student_emails_email
  ON allowed_student_emails(email);

-- NOTE: this replaces the domain-based allowlist from
-- migration_add_email_domain_access.sql — /api/codes/email-access now
-- checks allowed_student_emails instead of allowed_email_domains.
-- The old allowed_email_domains table is left in place (unused) rather
-- than dropped, in case you want to reference or restore it later.
-- Drop it yourself with:
--   DROP TABLE IF EXISTS allowed_email_domains;
-- once you've confirmed you don't need it.
