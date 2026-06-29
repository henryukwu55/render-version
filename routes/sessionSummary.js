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
const { authenticate } = require("../middleware/auth");

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
          model: "claude-3-5-haiku-20241022",
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
    "No ANTHROPIC_API_KEY or OPENAI_API_KEY set, or both calls failed — using fallback summary",
  );
  return fallbackSummary();
}

function fallbackSummary() {
  return {
    topic: "Unclassified",
    summary:
      "Summary unavailable — no summarisation API key configured or the request failed.",
  };
}

function parseSummaryJson(text) {
  try {
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
  console.log("📝 POST /api/session-summary — request received");
  const { sessionToken, accessCode, conversationLog } = req.body || {};

  if (!Array.isArray(conversationLog) || conversationLog.length === 0) {
    console.warn("⚠️  /api/session-summary called with no conversationLog");
    return res.status(400).json({ error: "No conversation log provided" });
  }

  const transcriptText = conversationLog
    .filter((e) => e.text && e.text.trim())
    .map((e) => `${e.role === "mentor" ? "Mentor" : "Student"}: ${e.text}`)
    .join("\n");

  if (!transcriptText.trim()) {
    console.warn(
      "⚠️  /api/session-summary: conversationLog had no usable text",
    );
    return res.status(400).json({ error: "Conversation log is empty" });
  }

  const { topic, summary } = await generateSummary(transcriptText);
  console.log(`📝 Generated summary — topic: "${topic}"`);

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
      if (!sessionId) {
        console.warn(
          "⚠️  No matching user_sessions row for session_token — storing summary with session_id = NULL",
        );
      }
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
    console.log("✅ session_summaries row inserted successfully");
    res.json({ success: true, topic, summary });
  } catch (err) {
    console.error("❌ Failed to store session summary:", err.message);
    res.status(500).json({ error: "Database error", topic, summary });
  }
});

// GET /api/session-summary/topics
// Returns topic counts for "most asked about" analytics.
// Admin-only — this exposes summarised student data, unlike POST / above
// which the student-facing page calls without a login.
router.get("/topics", authenticate, async (req, res) => {
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
// Admin-only.
router.get("/recent", authenticate, async (req, res) => {
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

// GET /api/session-summary/export?from=YYYY-MM-DD&to=YYYY-MM-DD
// Downloads a CSV of all session summaries within the given date range
// (inclusive). Intended for an admin to hand off to academic staff for
// further analysis — "what are students asking about, and when".
// Admin-only.
router.get("/export", authenticate, async (req, res) => {
  const { rowsToCsv } = require("../utils/csv");
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({
      error: "Both 'from' and 'to' query params (YYYY-MM-DD) are required",
    });
  }

  try {
    // 'to' is treated as inclusive of the whole day by adding 1 day and
    // using a strict less-than, avoiding timezone-edge surprises from
    // trying to do "<=  2026-06-29 23:59:59.999" directly.
    const result = await query(
      `SELECT id, session_id, access_code, topic, summary, message_count, created_at
       FROM session_summaries
       WHERE created_at >= $1::date AND created_at < ($2::date + INTERVAL '1 day')
       ORDER BY created_at DESC`,
      [from, to],
    );

    const csv = rowsToCsv(result.rows, [
      { key: "id", label: "ID" },
      { key: "session_id", label: "Session ID" },
      { key: "access_code", label: "Access Code" },
      { key: "topic", label: "Topic" },
      { key: "summary", label: "Summary" },
      { key: "message_count", label: "Message Count" },
      { key: "created_at", label: "Created At" },
    ]);

    const filename = `session-summaries_${from}_to_${to}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    console.error("Session summary export error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

// /**
//  * routes/sessionSummary.js
//  *
//  * When a student's session ends, the frontend sends the full conversation
//  * transcript here. This route asks an LLM to produce:
//  *   - a 2-sentence summary of what was discussed
//  *   - a short topic/project tag (e.g. "My First Backend", "Recursion")
//  * and stores both in the session_summaries table, linked to the session.
//  *
//  * This is intentionally a SEPARATE lightweight LLM call, not something
//  * Anam's avatar does — Anam's persona is for live conversation, not for
//  * post-hoc text summarisation, and keeping this as a plain text-completion
//  * call keeps it fast, cheap, and independent of avatar session state.
//  */

// const express = require("express");
// const router = express.Router();
// const { query } = require("../api/db");

// // Works with either an Anthropic or OpenAI key — whichever is set.
// // Falls back to a simple heuristic summary if neither key is configured,
// // so the feature never hard-fails a session-end request.
// async function generateSummary(transcriptText) {
//   const anthropicKey = process.env.ANTHROPIC_API_KEY;
//   const openaiKey = process.env.OPENAI_API_KEY;

//   const instruction =
//     "You will be given a transcript of a conversation between a student " +
//     "and an AI mentor for software engineering / data science coursework. " +
//     "Respond with ONLY a JSON object, no other text, in this exact format: " +
//     '{"topic": "short topic or project name, 2-5 words", "summary": "exactly two sentences summarising what was discussed and what the student needed help with"}. ' +
//     "If a specific Qwasar/Preseason/Season project is mentioned by name, use that exact project name as the topic. " +
//     'Otherwise use a short general topic like "Recursion" or "SQL joins".';

//   try {
//     if (anthropicKey) {
//       const controller = new AbortController();
//       const timer = setTimeout(() => controller.abort(), 8000);
//       const res = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "x-api-key": anthropicKey,
//           "anthropic-version": "2023-06-01",
//         },
//         body: JSON.stringify({
//           model: "claude-3-5-haiku-20241022",
//           max_tokens: 200,
//           messages: [
//             {
//               role: "user",
//               content: `${instruction}\n\nTRANSCRIPT:\n${transcriptText.slice(0, 12000)}`,
//             },
//           ],
//         }),
//         signal: controller.signal,
//       });
//       clearTimeout(timer);
//       const data = await res.json();
//       if (!res.ok) {
//         console.error(
//           "Anthropic API error:",
//           res.status,
//           data?.error?.message || JSON.stringify(data),
//         );
//         return fallbackSummary();
//       }
//       const text = data?.content?.[0]?.text || "";
//       return parseSummaryJson(text);
//     }

//     if (openaiKey) {
//       const controller = new AbortController();
//       const timer = setTimeout(() => controller.abort(), 8000);
//       const res = await fetch("https://api.openai.com/v1/chat/completions", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${openaiKey}`,
//         },
//         body: JSON.stringify({
//           model: "gpt-4o-mini",
//           max_tokens: 200,
//           messages: [
//             {
//               role: "user",
//               content: `${instruction}\n\nTRANSCRIPT:\n${transcriptText.slice(0, 12000)}`,
//             },
//           ],
//         }),
//         signal: controller.signal,
//       });
//       clearTimeout(timer);
//       const data = await res.json();
//       if (!res.ok) {
//         console.error(
//           "OpenAI API error:",
//           res.status,
//           data?.error?.message || JSON.stringify(data),
//         );
//         return fallbackSummary();
//       }
//       const text = data?.choices?.[0]?.message?.content || "";
//       return parseSummaryJson(text);
//     }
//   } catch (err) {
//     if (err.name === "AbortError") {
//       console.error("Summary generation timed out after 8s");
//     } else {
//       console.error("Summary generation error:", err.message);
//     }
//   }

//   console.warn(
//     "No ANTHROPIC_API_KEY or OPENAI_API_KEY set, or both calls failed — using fallback summary",
//   );
//   return fallbackSummary();
// }

// function fallbackSummary() {
//   return {
//     topic: "Unclassified",
//     summary:
//       "Summary unavailable — no summarisation API key configured or the request failed.",
//   };
// }

// function parseSummaryJson(text) {
//   try {
//     const cleaned = text.replace(/```json\s*|\s*```/g, "").trim();
//     const parsed = JSON.parse(cleaned);
//     return {
//       topic: (parsed.topic || "Unclassified").slice(0, 100),
//       summary: (parsed.summary || "").slice(0, 1000),
//     };
//   } catch (err) {
//     console.error("Failed to parse summary JSON:", text);
//     return { topic: "Unclassified", summary: text.slice(0, 500) || "" };
//   }
// }

// // POST /api/session-summary
// // Body: { sessionToken, accessCode, conversationLog: [{role, text, time}] }
// router.post("/", async (req, res) => {
//   console.log("📝 POST /api/session-summary — request received");
//   const { sessionToken, accessCode, conversationLog } = req.body || {};

//   if (!Array.isArray(conversationLog) || conversationLog.length === 0) {
//     console.warn("⚠️  /api/session-summary called with no conversationLog");
//     return res.status(400).json({ error: "No conversation log provided" });
//   }

//   const transcriptText = conversationLog
//     .filter((e) => e.text && e.text.trim())
//     .map((e) => `${e.role === "mentor" ? "Mentor" : "Student"}: ${e.text}`)
//     .join("\n");

//   if (!transcriptText.trim()) {
//     console.warn(
//       "⚠️  /api/session-summary: conversationLog had no usable text",
//     );
//     return res.status(400).json({ error: "Conversation log is empty" });
//   }

//   const { topic, summary } = await generateSummary(transcriptText);
//   console.log(`📝 Generated summary — topic: "${topic}"`);

//   // Look up the integer user_sessions.id from the session_token, since
//   // the frontend only ever has the token string, never the numeric id.
//   let sessionId = null;
//   if (sessionToken) {
//     try {
//       const lookup = await query(
//         `SELECT id FROM user_sessions WHERE session_token = $1 LIMIT 1`,
//         [sessionToken],
//       );
//       sessionId = lookup.rows[0]?.id || null;
//       if (!sessionId) {
//         console.warn(
//           "⚠️  No matching user_sessions row for session_token — storing summary with session_id = NULL",
//         );
//       }
//     } catch (err) {
//       console.error("Session lookup error:", err.message);
//     }
//   }

//   try {
//     await query(
//       `INSERT INTO session_summaries (session_id, access_code, topic, summary, message_count)
//        VALUES ($1, $2, $3, $4, $5)`,
//       [sessionId, accessCode || null, topic, summary, conversationLog.length],
//     );
//     console.log("✅ session_summaries row inserted successfully");
//     res.json({ success: true, topic, summary });
//   } catch (err) {
//     console.error("❌ Failed to store session summary:", err.message);
//     res.status(500).json({ error: "Database error", topic, summary });
//   }
// });

// // GET /api/session-summary/topics
// // Returns topic counts for "most asked about" analytics.
// router.get("/topics", async (req, res) => {
//   try {
//     const result = await query(`
//       SELECT topic, COUNT(*) as session_count, MAX(created_at) as last_asked
//       FROM session_summaries
//       GROUP BY topic
//       ORDER BY session_count DESC
//       LIMIT 50
//     `);
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Topic analytics error:", err.message);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// // GET /api/session-summary/recent
// // Returns the most recent summaries, useful for an admin feed view.
// router.get("/recent", async (req, res) => {
//   const limit = parseInt(req.query.limit) || 50;
//   try {
//     const result = await query(
//       `SELECT id, session_id, access_code, topic, summary, message_count, created_at
//        FROM session_summaries
//        ORDER BY created_at DESC
//        LIMIT $1`,
//       [limit],
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error("Recent summaries error:", err.message);
//     res.status(500).json({ error: "Database error" });
//   }
// });

// module.exports = router;
