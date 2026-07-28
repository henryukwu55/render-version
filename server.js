const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config({ path: ".env.local" });

const authRoutes = require("./routes/auth");
const codesRoutes = require("./routes/codes");
const analyticsRoutes = require("./routes/analytics");
const anamRoutes = require("./routes/anam");
const sessionSummaryRoutes = require("./routes/sessionSummary");
const voiceInteractionRoutes = require("./routes/voiceInteraction");
const { authenticate } = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.removeHeader("X-Frame-Options"); // remove any default protection
  res.setHeader(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://student-management-system-beryl-phi.vercel.app",
  );
  next();
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/codes", codesRoutes);
app.use("/api/analytics", authenticate, analyticsRoutes);
app.use("/api/anam", anamRoutes);
app.use("/api/session-summary", sessionSummaryRoutes);
app.use("/api/voice-interaction", voiceInteractionRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

// ── HTML Routes ─────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
});

// Widget embed page — same access code gate, Anam widget UI
app.get("/widget", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "user", "widget.html"));
});

// ── Error Handling ───────────────────────────────────────────────
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found", path: req.url });
});

app.use((req, res) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong!", message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
  console.log(`👤 User interface: http://localhost:${PORT}`);
});

// const express = require("express");
// const path = require("path");
// const cors = require("cors");
// require("dotenv").config({ path: ".env.local" });

// const authRoutes = require("./routes/auth");
// const codesRoutes = require("./routes/codes");
// const analyticsRoutes = require("./routes/analytics");
// const anamRoutes = require("./routes/anam");
// const sessionSummaryRoutes = require("./routes/sessionSummary");
// const { authenticate } = require("./middleware/auth");

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// // Serve static files
// app.use(express.static(path.join(__dirname, "public")));

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", timestamp: new Date().toISOString() });
// });

// // ── API Routes ──────────────────────────────────────────────────
// app.use("/api/auth", authRoutes);
// app.use("/api/codes", codesRoutes);
// app.use("/api/analytics", authenticate, analyticsRoutes);
// app.use("/api/anam", anamRoutes);
// app.use("/api/session-summary", sessionSummaryRoutes);

// app.get("/api/test", (req, res) => {
//   res.json({ message: "API is working!", timestamp: new Date().toISOString() });
// });

// // ── HTML Routes ─────────────────────────────────────────────────
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "user", "index.html"));
// });

// app.get("/admin", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "admin", "index.html"));
// });

// // Widget embed page — same access code gate, Anam widget UI
// app.get("/widget", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "user", "widget.html"));
// });

// // ── Error Handling ───────────────────────────────────────────────
// app.use("/api/*", (req, res) => {
//   res.status(404).json({ error: "API endpoint not found", path: req.url });
// });

// app.use((req, res) => {
//   res.status(404).send("Page not found");
// });

// app.use((err, req, res, next) => {
//   console.error("❌ Server error:", err.stack);
//   res
//     .status(500)
//     .json({ error: "Something went wrong!", message: err.message });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`\n🚀 Server running at http://localhost:${PORT}`);
//   console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
//   console.log(`👤 User interface: http://localhost:${PORT}`);
// });
