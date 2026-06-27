-- Migration: session_summaries
-- Stores a short LLM-generated summary + topic tag for each completed
-- student session, so admins can answer "what are students asking about
-- most" without reading every transcript by hand.

CREATE TABLE IF NOT EXISTS session_summaries (
  id            SERIAL PRIMARY KEY,
  session_id    INTEGER REFERENCES user_sessions(id) ON DELETE CASCADE,
  access_code   TEXT,                 -- denormalised for quick lookups even if the code is later deleted
  topic         TEXT,                 -- short tag, e.g. "My First Backend" or "Recursion (general)"
  summary       TEXT,                 -- the 2-sentence summary
  message_count INTEGER DEFAULT 0,    -- how many turns were in the conversation that was summarised
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookups for "most asked topics" queries
CREATE INDEX IF NOT EXISTS idx_session_summaries_topic
  ON session_summaries (topic);

CREATE INDEX IF NOT EXISTS idx_session_summaries_created_at
  ON session_summaries (created_at);
