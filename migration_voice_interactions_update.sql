-- Migration: extend voice_interactions for real exchange-pair tracking
--
-- The original voice_interactions table (from the very first schema) had
-- columns for a single speaker event: interaction_type, message_length,
-- response_time_ms. In practice the useful unit of analysis is a full
-- EXCHANGE — the student's turn paired with Pablo's reply — since that's
-- what lets you answer "how responsive is Pablo" and "how much are
-- students actually saying" per turn.
--
-- This migration adds the columns needed for that without dropping the
-- original ones, so nothing breaks if anything else still references them.

ALTER TABLE voice_interactions
  ADD COLUMN IF NOT EXISTS access_code TEXT,
  ADD COLUMN IF NOT EXISTS student_speech_duration_ms INTEGER,
  ADD COLUMN IF NOT EXISTS student_message_length INTEGER,
  ADD COLUMN IF NOT EXISTS mentor_response_latency_ms INTEGER,
  ADD COLUMN IF NOT EXISTS mentor_response_duration_ms INTEGER,
  ADD COLUMN IF NOT EXISTS mentor_message_length INTEGER;

CREATE INDEX IF NOT EXISTS idx_voice_interactions_session
  ON voice_interactions (user_session_id);

CREATE INDEX IF NOT EXISTS idx_voice_interactions_created_at
  ON voice_interactions (created_at);
