const express = require("express");
const { query } = require("../api/db");

const router = express.Router();

// Get analytics summary for dashboard
router.get("/summary", async (req, res) => {
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
router.get("/code-performance", async (req, res) => {
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
router.get("/events", async (req, res) => {
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

module.exports = router;
