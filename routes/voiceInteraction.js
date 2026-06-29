/**
 * routes/voiceInteraction.js
 *
 * Logs one row per completed voice EXCHANGE (student speaks, Pablo
 * replies) for analytics: how long students talk, how responsive Pablo
 * is, and roughly how much each side says per turn. Fed by timing
 * events already wired up in script.js (USER_SPEECH_STARTED/ENDED,
 * appendToCaraStream's first fragment, finaliseCaraStream).
 *
 * This is fire-and-forget from the frontend's perspective — a single
 * missed log row is not worth blocking or slowing down the live
 * conversation, so failures here are logged but never surfaced to the
 * student.
 */

const express = require("express");
const router = express.Router();
const { query } = require("../api/db");
const { authenticate } = require("../middleware/auth");

// POST /api/voice-interaction
// Body: {
//   sessionToken, accessCode,
//   studentSpeechDurationMs, studentMessageLength,
//   mentorResponseLatencyMs, mentorResponseDurationMs, mentorMessageLength
// }
router.post("/", async (req, res) => {
  const {
    sessionToken,
    accessCode,
    studentSpeechDurationMs,
    studentMessageLength,
    mentorResponseLatencyMs,
    mentorResponseDurationMs,
    mentorMessageLength,
  } = req.body || {};

  // Look up the integer user_sessions.id from the token, same pattern
  // as session-summary — the frontend only ever has the token string.
  let sessionId = null;
  if (sessionToken) {
    try {
      const lookup = await query(
        `SELECT id FROM user_sessions WHERE session_token = $1 LIMIT 1`,
        [sessionToken],
      );
      sessionId = lookup.rows[0]?.id || null;
    } catch (err) {
      console.error("Voice interaction session lookup error:", err.message);
    }
  }

  try {
    await query(
      `INSERT INTO voice_interactions (
         user_session_id, access_code, interaction_type,
         student_speech_duration_ms, student_message_length,
         mentor_response_latency_ms, mentor_response_duration_ms, mentor_message_length
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        sessionId,
        accessCode || null,
        "exchange",
        studentSpeechDurationMs ?? null,
        studentMessageLength ?? null,
        mentorResponseLatencyMs ?? null,
        mentorResponseDurationMs ?? null,
        mentorMessageLength ?? null,
      ],
    );
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to store voice interaction:", err.message);
    // Never block or alarm the student over an analytics log failure.
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/voice-interaction/stats
// Aggregate stats — average response latency, average speech length, etc.
// Admin-only.
router.get("/stats", authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        COUNT(*) AS total_exchanges,
        ROUND(AVG(student_speech_duration_ms)) AS avg_student_speech_ms,
        ROUND(AVG(student_message_length)) AS avg_student_message_length,
        ROUND(AVG(mentor_response_latency_ms)) AS avg_mentor_latency_ms,
        ROUND(AVG(mentor_response_duration_ms)) AS avg_mentor_response_ms,
        ROUND(AVG(mentor_message_length)) AS avg_mentor_message_length
      FROM voice_interactions
      WHERE interaction_type = 'exchange'
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Voice interaction stats error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/voice-interaction/export?from=YYYY-MM-DD&to=YYYY-MM-DD
// Downloads a CSV of all voice interaction exchanges within the given
// date range (inclusive) — response latency, speech length, etc. per
// exchange, for handing off to academic staff for further analysis.
// Admin-only.
router.get("/export", authenticate, async (req, res) => {
  const { rowsToCsv } = require("../utils/csv");
  const { from, to } = req.query;

  if (!from || !to) {
    return res
      .status(400)
      .json({ error: "Both 'from' and 'to' query params (YYYY-MM-DD) are required" });
  }

  try {
    const result = await query(
      `SELECT id, user_session_id, access_code, interaction_type,
              student_speech_duration_ms, student_message_length,
              mentor_response_latency_ms, mentor_response_duration_ms, mentor_message_length,
              created_at
       FROM voice_interactions
       WHERE created_at >= $1::date AND created_at < ($2::date + INTERVAL '1 day')
       ORDER BY created_at DESC`,
      [from, to],
    );

    const csv = rowsToCsv(result.rows, [
      { key: "id", label: "ID" },
      { key: "user_session_id", label: "Session ID" },
      { key: "access_code", label: "Access Code" },
      { key: "interaction_type", label: "Type" },
      { key: "student_speech_duration_ms", label: "Student Speech Duration (ms)" },
      { key: "student_message_length", label: "Student Message Length (chars)" },
      { key: "mentor_response_latency_ms", label: "Mentor Response Latency (ms)" },
      { key: "mentor_response_duration_ms", label: "Mentor Response Duration (ms)" },
      { key: "mentor_message_length", label: "Mentor Message Length (chars)" },
      { key: "created_at", label: "Created At" },
    ]);

    const filename = `voice-interactions_${from}_to_${to}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );
    res.send(csv);
  } catch (err) {
    console.error("Voice interaction export error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
