/**
 * routes/sessionSummary.js
 *
 * When a student's session ends, the frontend sends the full conversation
 * transcript here. This route asks an LLM to produce:
 *   - a 2-sentence summary of what was discussed
 *   - a short topic/project tag (e.g. "My First Backend", "Recursion")
 * and stores both in the session_summaries table, linked to the session.
 *
 * This is intentionally a SEPARATE lightweight LLM call, not something
 * Anam's avatar does — Anam's persona is for live conversation, not for
 * post-hoc text summarisation, and keeping this as a plain text-completion
 * call keeps it fast, cheap, and independent of avatar session state.
 */

const express = require("express");
const router = express.Router();
const { query } = require("../api/db");

// Works with either an Anthropic or OpenAI key — whichever is set.
// Falls back to a simple heuristic summary if neither key is configured,
// so the feature never hard-fails a session-end request.
async function generateSummary(transcriptText) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const instruction =
    "You will be given a transcript of a conversation between a student " +
    "and an AI mentor for software engineering / data science coursework. " +
    "Respond with ONLY a JSON object, no other text, in this exact format: " +
    '{"topic": "short topic or project name, 2-5 words", "summary": "exactly two sentences summarising what was discussed and what the student needed help with"}. ' +
    "If a specific Qwasar/Preseason/Season project is mentioned by name, use that exact project name as the topic. " +
    'Otherwise use a short general topic like "Recursion" or "SQL joins".';

  try {
    if (anthropicKey) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-haiku-20241022", // cheap + fast is fine for this
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: `${instruction}\n\nTRANSCRIPT:\n${transcriptText.slice(0, 12000)}`,
            },
          ],
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (!res.ok) {
        console.error(
          "Anthropic API error:",
          res.status,
          data?.error?.message || JSON.stringify(data),
        );
        return fallbackSummary();
      }
      const text = data?.content?.[0]?.text || "";
      return parseSummaryJson(text);
    }

    if (openaiKey) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_tokens: 200,
          messages: [
            {
              role: "user",
              content: `${instruction}\n\nTRANSCRIPT:\n${transcriptText.slice(0, 12000)}`,
            },
          ],
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      if (!res.ok) {
        console.error(
          "OpenAI API error:",
          res.status,
          data?.error?.message || JSON.stringify(data),
        );
        return fallbackSummary();
      }
      const text = data?.choices?.[0]?.message?.content || "";
      return parseSummaryJson(text);
    }
  } catch (err) {
    if (err.name === "AbortError") {
      console.error("Summary generation timed out after 8s");
    } else {
      console.error("Summary generation error:", err.message);
    }
  }

  console.warn(
    "No ANTHROPIC_API_KEY or OPENAI_API_KEY set — using fallback summary",
  );
  return fallbackSummary();
}

function fallbackSummary() {
  // No API key configured, or the call failed.
  // Don't block session-end on this — just store a minimal placeholder
  // so the row still gets written and shows up in the analytics views,
  // clearly flagged as unclassified rather than silently missing.
  return {
    topic: "Unclassified",
    summary:
      "Summary unavailable — no summarisation API key configured or the request failed.",
  };
}

function parseSummaryJson(text) {
  try {
    // Strip markdown fences if the model wrapped the JSON in them
    const cleaned = text.replace(/```json\s*|\s*```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      topic: (parsed.topic || "Unclassified").slice(0, 100),
      summary: (parsed.summary || "").slice(0, 1000),
    };
  } catch (err) {
    console.error("Failed to parse summary JSON:", text);
    return { topic: "Unclassified", summary: text.slice(0, 500) || "" };
  }
}

// POST /api/session-summary
// Body: { sessionToken, accessCode, conversationLog: [{role, text, time}] }
router.post("/", async (req, res) => {
  const { sessionToken, accessCode, conversationLog } = req.body || {};

  if (!Array.isArray(conversationLog) || conversationLog.length === 0) {
    return res.status(400).json({ error: "No conversation log provided" });
  }

  const transcriptText = conversationLog
    .filter((e) => e.text && e.text.trim())
    .map((e) => `${e.role === "mentor" ? "Mentor" : "Student"}: ${e.text}`)
    .join("\n");

  if (!transcriptText.trim()) {
    return res.status(400).json({ error: "Conversation log is empty" });
  }

  const { topic, summary } = await generateSummary(transcriptText);

  // Look up the integer user_sessions.id from the session_token, since
  // the frontend only ever has the token string, never the numeric id.
  let sessionId = null;
  if (sessionToken) {
    try {
      const lookup = await query(
        `SELECT id FROM user_sessions WHERE session_token = $1 LIMIT 1`,
        [sessionToken],
      );
      sessionId = lookup.rows[0]?.id || null;
    } catch (err) {
      console.error("Session lookup error:", err.message);
    }
  }

  try {
    await query(
      `INSERT INTO session_summaries (session_id, access_code, topic, summary, message_count)
       VALUES ($1, $2, $3, $4, $5)`,
      [sessionId, accessCode || null, topic, summary, conversationLog.length],
    );
    res.json({ success: true, topic, summary });
  } catch (err) {
    console.error("Failed to store session summary:", err.message);
    // Still return the generated summary even if the DB write failed,
    // so the frontend isn't left without feedback.
    res.status(500).json({ error: "Database error", topic, summary });
  }
});

// GET /api/session-summary/topics
// Returns topic counts for "most asked about" analytics.
router.get("/topics", async (req, res) => {
  try {
    const result = await query(`
      SELECT topic, COUNT(*) as session_count, MAX(created_at) as last_asked
      FROM session_summaries
      GROUP BY topic
      ORDER BY session_count DESC
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Topic analytics error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// GET /api/session-summary/recent
// Returns the most recent summaries, useful for an admin feed view.
router.get("/recent", async (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  try {
    const result = await query(
      `SELECT id, session_id, access_code, topic, summary, message_count, created_at
       FROM session_summaries
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Recent summaries error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
