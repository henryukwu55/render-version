/**
 * Run this ONCE after deploying to seed your admin user.
 *
 * Locally:  cp .env.local.example .env.local  →  fill in values  →  node scripts/init-admin.js
 * On Render: use the Shell tab in your Render service dashboard:
 *            node scripts/init-admin.js
 */
require("dotenv").config({ path: ".env.local" });
const bcrypt = require("bcryptjs");
const { query } = require("../api/db");

async function initAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local",
    );
    process.exit(1);
  }

  console.log(`\n🔐 Creating/updating admin: ${email}`);
  const hash = await bcrypt.hash(password, 12);

  const res = await query(
    `INSERT INTO admin_users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = $2, is_active = true
     RETURNING id, email`,
    [email, hash],
  );

  console.log("✅ Admin ready:", res.rows[0]);
  console.log("\n🚀 You can now log in at /admin with those credentials.\n");
  process.exit(0);
}

initAdmin().catch((e) => {
  console.error("❌ Failed:", e.message);
  process.exit(1);
});
