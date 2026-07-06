const express = require("express");
const crypto = require("crypto");
const { query } = require("../api/db");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// VALIDATE CODE ENDPOINT (for user entry)
router.post("/validate", async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided" });

  try {
    const cleanCode = code.trim().toUpperCase();

    const result = await Promise.race([
      query(
        `SELECT id, code, duration_seconds, expires_at, is_used 
         FROM access_codes 
         WHERE code = $1`,
        [cleanCode],
      ),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 15000),
      ),
    ]);

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid code" });

    const codeData = result.rows[0];

    if (codeData.is_used)
      return res.status(401).json({ error: "Code already used" });
    if (new Date() > new Date(codeData.expires_at))
      return res.status(401).json({ error: "Code expired" });

    const sessionToken = crypto.randomBytes(32).toString("hex");

    await query(
      `UPDATE access_codes SET is_used = true, used_at = NOW(), used_by_ip = $1 WHERE id = $2`,
      [req.ip, codeData.id],
    );

    const sessionResult = await query(
      `INSERT INTO user_sessions (access_code_id, session_token, ip_address, user_agent)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [codeData.id, sessionToken, req.ip, req.headers["user-agent"]],
    );

    query(
      `INSERT INTO analytics_events (event_type, access_code_id, user_session_id, duration_value, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        "session_start",
        codeData.id,
        sessionResult.rows[0].id,
        codeData.duration_seconds,
        req.ip,
      ],
    ).catch((err) => console.error("Analytics error:", err.message));

    res.json({
      session_token: sessionToken,
      duration_seconds: codeData.duration_seconds,
    });
  } catch (error) {
    console.error("Validation error:", error);
    if (error.message.includes("timeout")) {
      res
        .status(503)
        .json({ error: "Database connection timeout. Please try again." });
    } else {
      res.status(500).json({ error: "Server error. Please try again." });
    }
  }
});

// END SESSION ENDPOINT
router.post("/end-session", async (req, res) => {
  const { session_token, duration_used, ended_reason } = req.body;

  if (!session_token)
    return res.status(400).json({ error: "No session token" });

  try {
    const result = await query(
      `UPDATE user_sessions 
       SET ended_at = NOW(), duration_used = $1, ended_reason = $2
       WHERE session_token = $3 RETURNING access_code_id`,
      [duration_used, ended_reason, session_token],
    );

    if (result.rows.length > 0) {
      query(
        `INSERT INTO analytics_events (event_type, access_code_id, duration_value, ip_address, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          "session_end",
          result.rows[0].access_code_id,
          duration_used,
          req.ip,
          JSON.stringify({ reason: ended_reason }),
        ],
      ).catch((err) => console.error("Analytics error:", err.message));
    }

    res.json({ success: true });
  } catch (error) {
    console.error("End session error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GENERATE new access code (admin only)
router.post("/generate", authenticate, async (req, res) => {
  const { duration_seconds } = req.body;

  if (!duration_seconds || duration_seconds < 10 || duration_seconds > 259200) {
    return res
      .status(400)
      .json({ error: "Invalid duration (10-259200 seconds)" });
  }

  try {
    let code;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      code = `AT-${random}`;
      const existing = await query(
        "SELECT id FROM access_codes WHERE code = $1",
        [code],
      );
      if (existing.rows.length === 0) isUnique = true;
      attempts++;
    }

    if (!isUnique)
      return res.status(500).json({ error: "Failed to generate unique code" });

    const expiresAt = new Date(Date.now() + duration_seconds * 1000);

    // ensures the code expires exactly after the requested duration
    const result = await query(
      `INSERT INTO access_codes (code, duration_seconds, created_by, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING id, code, duration_seconds`,
      [code, duration_seconds, 1, expiresAt],
    );

    query(
      `INSERT INTO analytics_events (event_type, access_code_id, duration_value, ip_address)
       VALUES ($1, $2, $3, $4)`,
      ["code_generated", result.rows[0].id, duration_seconds, req.ip],
    ).catch((err) => console.error("Analytics error:", err.message));

    res.json({
      code: result.rows[0].code,
      duration_seconds: result.rows[0].duration_seconds,
    });
  } catch (error) {
    console.error("Generate code error:", error);
    res.status(500).json({ error: "Database error: " + error.message });
  }
});

// GET all access codes (admin only)
router.get("/", authenticate, async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, COUNT(us.id) as session_count
      FROM access_codes c
      LEFT JOIN user_sessions us ON c.id = us.access_code_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Get codes error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// ── DOMAIN ALLOWLIST MANAGEMENT (admin only) ──────────────────────
// GET all allowlisted domains
router.get("/domains", authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, domain, label, is_active, created_at
       FROM allowed_email_domains
       ORDER BY created_at DESC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get domains error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// ADD a new allowlisted domain
router.post("/domains", authenticate, async (req, res) => {
  let { domain, label } = req.body;

  if (!domain || !domain.trim()) {
    return res.status(400).json({ error: "Domain is required" });
  }

  // Accept either "amsterdam.tech" or "@amsterdam.tech" or a full email —
  // normalise down to just the bare domain either way.
  domain = domain.trim().toLowerCase().replace(/^@/, "");
  if (domain.includes("@")) domain = domain.split("@")[1];

  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
    return res
      .status(400)
      .json({ error: "That doesn't look like a valid domain" });
  }

  try {
    const result = await query(
      `INSERT INTO allowed_email_domains (domain, label)
       VALUES ($1, $2)
       ON CONFLICT (domain) DO UPDATE SET is_active = true, label = EXCLUDED.label
       RETURNING id, domain, label, is_active, created_at`,
      [domain, label?.trim() || null],
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Add domain error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// REMOVE an allowlisted domain
router.delete("/domains/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query(
      "DELETE FROM allowed_email_domains WHERE id = $1 RETURNING id",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Domain not found" });
    }
    res.json({ success: true });
  } catch (error) {
    console.error("Delete domain error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// EMAIL DOMAIN ACCESS — permanent, no code needed for allowlisted domains
router.post("/email-access", async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Valid email required" });
  }

  const domain = email.trim().toLowerCase().split("@")[1];

  try {
    const result = await query(
      "SELECT domain, label FROM allowed_email_domains WHERE domain = $1 AND is_active = true",
      [domain],
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        error:
          "This email isn't on the automatic access list. Please use an access code instead.",
      });
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");

    const sessionResult = await query(
      `INSERT INTO user_sessions (session_token, email, is_permanent, ip_address, user_agent)
       VALUES ($1, $2, true, $3, $4) RETURNING id`,
      [
        sessionToken,
        email.trim().toLowerCase(),
        req.ip,
        req.headers["user-agent"],
      ],
    );

    query(
      `INSERT INTO analytics_events (event_type, user_session_id, metadata, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [
        "domain_access_granted",
        sessionResult.rows[0].id,
        JSON.stringify({ domain, email: email.trim().toLowerCase() }),
        req.ip,
      ],
    ).catch((err) => console.error("Analytics error:", err.message));

    res.json({ session_token: sessionToken, permanent: true });
  } catch (error) {
    console.error("Email access error:", error);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;
