const express = require("express");
const { query } = require("../api/db");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Get analytics summary for dashboard
router.get("/summary", authenticate, async (req, res) => {
  try {
    const totalsResult = await query(`
      SELECT 
        COUNT(DISTINCT CASE WHEN event_type = 'code_generated' THEN access_code_id END) as codes_generated,
        COUNT(DISTINCT CASE WHEN event_type = 'session_start' THEN user_session_id END) as sessions_total,
        COUNT(CASE WHEN event_type = 'session_expired' THEN 1 END) as sessions_expired
      FROM analytics_events
    `);

    const activeResult = await query(`
      SELECT COUNT(*) as active_sessions
      FROM user_sessions
      WHERE ended_at IS NULL AND started_at > NOW() - INTERVAL '24 hours'
    `);

    const dailyResult = await query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(CASE WHEN event_type = 'session_start' THEN 1 END) as sessions_started,
        COUNT(DISTINCT access_code_id) as unique_codes_used,
        COUNT(CASE WHEN event_type = 'session_expired' THEN 1 END) as sessions_expired
      FROM analytics_events
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `);

    res.json({
      totals: totalsResult.rows[0] || {
        codes_generated: 0,
        sessions_total: 0,
        sessions_expired: 0,
      },
      realtime: {
        active_sessions: parseInt(activeResult.rows[0]?.active_sessions || 0),
      },
      daily: dailyResult.rows,
    });
  } catch (error) {
    console.error("Analytics summary error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get code performance analytics
router.get("/code-performance", authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.code,
        c.duration_seconds,
        COUNT(DISTINCT us.id) as times_used,
        ROUND(AVG(us.duration_used)) as avg_duration_used,
        COUNT(CASE WHEN us.ended_reason = 'completed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN us.ended_reason = 'expired' THEN 1 END) as expired_count
      FROM access_codes c
      LEFT JOIN user_sessions us ON c.id = us.access_code_id
      GROUP BY c.id, c.code, c.duration_seconds
      ORDER BY times_used DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Code performance error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Get recent events with filtering
router.get("/events", authenticate, async (req, res) => {
  const { type, limit = 50 } = req.query;

  try {
    let queryText = `
      SELECT ae.*, ac.code
      FROM analytics_events ae
      LEFT JOIN access_codes ac ON ae.access_code_id = ac.id
    `;

    const params = [];
    if (type && type !== "") {
      queryText += ` WHERE ae.event_type = $1`;
      params.push(type);
    }

    queryText += ` ORDER BY ae.created_at DESC LIMIT $${params.length + 1}`;
    params.push(parseInt(limit));

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Events error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Daily engagement trend — sessions started + unique students per day,
// for the student success office to spot usage trends over time.
// Scoped to permanent (email-based, unlimited-access) sessions only —
// that's the identifiable student population the success office
// actually tracks; access-code sessions are anonymous one-offs and
// live in the separate Code Performance table instead.
router.get("/engagement-trend", authenticate, async (req, res) => {
  const days = Math.min(parseInt(req.query.days) || 30, 90);
  try {
    const result = await query(
      `SELECT
         DATE(started_at) AS date,
         COUNT(*) AS sessions,
         COUNT(DISTINCT email) AS unique_students
       FROM user_sessions
       WHERE is_permanent = true
         AND started_at > NOW() - ($1 || ' days')::INTERVAL
       GROUP BY DATE(started_at)
       ORDER BY date ASC`,
      [days],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Engagement trend error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// How sessions end — ended by the student themselves, or never cleanly
// ended (tab closed / connection dropped mid-session). Permanent
// sessions have no timer, so there's no "expired" case here — that
// only applies to timed access-code sessions, covered separately in
// Code Performance. "No clean end" is the signal worth watching: it
// can mean a technical problem OR a student disengaging mid-session.
router.get("/session-outcomes", authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        COUNT(CASE WHEN ended_reason = 'manual' THEN 1 END) AS ended_by_student,
        COUNT(CASE WHEN ended_at IS NULL AND started_at < NOW() - INTERVAL '1 hour' THEN 1 END) AS no_clean_end
      FROM user_sessions
      WHERE is_permanent = true
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Session outcomes error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Per-student engagement — built from the exact allowlist so it also
// surfaces students who have NEVER logged in, not just active ones.
// Sorted so the least-engaged students surface first, since that's the
// list most useful for outreach.
router.get("/student-engagement", authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT
        ase.email,
        ase.label,
        COUNT(us.id) AS session_count,
        MAX(us.started_at) AS last_active,
        ROUND(AVG(EXTRACT(EPOCH FROM (us.ended_at - us.started_at))))
          FILTER (WHERE us.ended_at IS NOT NULL) AS avg_session_seconds,
        COUNT(DISTINCT ss.topic) AS distinct_topics
      FROM allowed_student_emails ase
      LEFT JOIN user_sessions us ON us.email = ase.email
      LEFT JOIN session_summaries ss ON ss.session_id = us.id
      WHERE ase.is_active = true
      GROUP BY ase.email, ase.label
      ORDER BY last_active ASC NULLS FIRST
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Student engagement error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
