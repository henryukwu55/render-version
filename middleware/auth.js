const { query } = require("../api/db");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const result = await query(
      `SELECT asession.*, admin.email, admin.id as admin_id
       FROM admin_sessions asession
       JOIN admin_users admin ON asession.admin_id = admin.id
       WHERE asession.session_token = $1 
         AND asession.is_valid = true 
         AND asession.expires_at > NOW()`,
      [token],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    req.admin = {
      id: result.rows[0].admin_id,
      email: result.rows[0].email,
      sessionToken: token,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
}

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    try {
      const result = await query(
        `SELECT admin_id FROM admin_sessions 
         WHERE session_token = $1 AND is_valid = true AND expires_at > NOW()`,
        [token],
      );
      if (result.rows.length > 0) {
        req.admin = { id: result.rows[0].admin_id, sessionToken: token };
      }
    } catch (error) {
      // Continue without admin
    }
  }
  next();
}

module.exports = { authenticate, optionalAuth };
