-- ============================================================
-- Migration: permanent, no-code access for allowlisted email domains
-- Safe to run multiple times (fully idempotent)
-- ============================================================

-- One row per domain that gets automatic, unlimited access.
CREATE TABLE IF NOT EXISTS allowed_email_domains (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(255) UNIQUE NOT NULL,
    label VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the initial allowlisted domain.
INSERT INTO allowed_email_domains (domain, label)
VALUES ('amsterdam.tech', 'Amsterdam Tech University')
ON CONFLICT (domain) DO NOTHING;

-- Track which email a session belongs to, and whether it's a permanent
-- (domain-granted) session vs. a normal timed access-code session.
-- access_code_id on user_sessions is already nullable in the base schema,
-- so no change needed there.
ALTER TABLE user_sessions
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS is_permanent BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_allowed_email_domains_domain
  ON allowed_email_domains(domain);

CREATE INDEX IF NOT EXISTS idx_user_sessions_email
  ON user_sessions(email);
