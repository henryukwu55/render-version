-- ============================================================
-- Atech Virtual Assistant — Neon PostgreSQL Schema
-- Safe to run multiple times (fully idempotent)
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS admin_sessions (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_valid BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS access_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_at TIMESTAMPTZ,
    used_by_ip VARCHAR(45),
    session_token_generated BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    access_code_id INTEGER REFERENCES access_codes(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_used INTEGER,
    ended_reason VARCHAR(50),
    ip_address VARCHAR(45),
    user_agent TEXT
);

CREATE TABLE IF NOT EXISTS analytics_events (
    id BIGSERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    access_code_id INTEGER REFERENCES access_codes(id),
    user_session_id INTEGER REFERENCES user_sessions(id),
    duration_value INTEGER,
    metadata JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voice_interactions (
    id BIGSERIAL PRIMARY KEY,
    user_session_id INTEGER REFERENCES user_sessions(id),
    interaction_type VARCHAR(20),
    message_length INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_access_codes_code       ON access_codes(code);
CREATE INDEX IF NOT EXISTS idx_access_codes_expires_at ON access_codes(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token    ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token     ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type   ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_date   ON analytics_events(created_at);

-- Function + trigger to auto-expire old admin sessions on each new login.
-- CREATE OR REPLACE handles re-runs safely.
-- The trigger uses DO $$ ... $$ to skip creation only if it already exists.
CREATE OR REPLACE FUNCTION expire_old_sessions()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE admin_sessions SET is_valid = false WHERE expires_at < NOW();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trigger_expire_sessions'
    ) THEN
        CREATE TRIGGER trigger_expire_sessions
            AFTER INSERT ON admin_sessions
            EXECUTE FUNCTION expire_old_sessions();
    END IF;
END;
$$;
