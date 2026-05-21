const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { query } = require("../api/db");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// Admin login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const result = await query(
      "SELECT id, email, password_hash FROM admin_users WHERE email = $1 AND is_active = true",
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];
    const isValid = await bcrypt.compare(password, admin.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await query(
      `INSERT INTO admin_sessions (admin_id, session_token, expires_at, ip_address, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [admin.id, sessionToken, expiresAt, req.ip, req.headers["user-agent"]],
    );

    await query("UPDATE admin_users SET last_login = NOW() WHERE id = $1", [
      admin.id,
    ]);

    res.json({ token: sessionToken, email: admin.email });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current admin info
router.get("/me", authenticate, async (req, res) => {
  res.json({ admin: { email: req.admin.email, id: req.admin.id } });
});

// Logout
router.post("/logout", authenticate, async (req, res) => {
  try {
    await query(
      "UPDATE admin_sessions SET is_valid = false WHERE session_token = $1",
      [req.admin.sessionToken],
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
