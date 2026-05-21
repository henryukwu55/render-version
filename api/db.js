const { Pool } = require("pg");

let pool = null;
let retryCount = 0;
const MAX_RETRIES = 3;

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is not set. Please add your Neon connection string.",
      );
    }

    // Neon requires SSL. The connection string from Neon's dashboard already
    // includes ?sslmode=require, but we enforce it here too just in case.
    const config = {
      connectionString: process.env.DATABASE_URL,
      ssl: true, // Neon mandates SSL — do NOT use rejectUnauthorized:false
      max: 5, // Neon free tier allows ~100 connections; keep this low on Render
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    };

    pool = new Pool(config);

    pool.on("error", (err) => {
      console.error("❌ Unexpected pool error:", err.message);
    });

    pool.on("connect", () => {
      retryCount = 0;
      console.log("✅ Neon DB connected");
    });
  }
  return pool;
}

async function query(text, params, retry = true) {
  const client = getPool();
  if (!client) throw new Error("Database not configured");

  const start = Date.now();
  try {
    const res = await client.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn("⚠️ Slow query:", {
        text: text.substring(0, 100),
        duration,
      });
    }
    return res;
  } catch (error) {
    console.error("❌ Query error:", error.message);
    if (
      retry &&
      (error.message.includes("timeout") ||
        error.message.includes("terminated"))
    ) {
      if (retryCount < MAX_RETRIES) {
        retryCount++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return query(text, params, false);
      }
    }
    throw error;
  }
}

async function getClient() {
  return await getPool().connect();
}

async function testConnection() {
  try {
    const result = await query("SELECT NOW() as time", [], false);
    console.log("✅ Database test successful:", result.rows[0].time);
    return true;
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    return false;
  }
}

module.exports = { query, getClient, getPool, testConnection };
