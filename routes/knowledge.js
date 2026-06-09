const fs = require("fs");
const path = require("path");

const KNOWLEDGE_DIR = path.join(__dirname, "..", "Knowledge");
const MAX_CHARS = 100000; // ~25,000 tokens

function loadKnowledge() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.log("ℹ️ No Knowledge/ folder found");
    return "";
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .sort();

  if (files.length === 0) {
    console.log("ℹ️ Knowledge/ folder is empty");
    return "";
  }

  console.log(`📚 Loading ${files.length} knowledge file(s)...`);

  const allSections = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
    const label = file.replace(/\.md$/, "").replace(/[_-]/g, " ");

    // DIRECT FULL CONTENT - no extraction
    allSections.push(`## ${label}\n${raw}`);
    console.log(`  ✓ ${file}: ${raw.length} chars (FULL CONTENT)`);
  }

  let combined = allSections.join("\n\n---\n\n");

  if (combined.length > MAX_CHARS) {
    console.warn(
      `⚠️ Knowledge base truncated from ${combined.length} to ${MAX_CHARS} chars`,
    );
    combined = combined.slice(0, MAX_CHARS) + "\n\n[... truncated]";
  }

  console.log(
    `📚 Knowledge base ready: ${combined.length} chars (~${Math.round(combined.length / 4)} tokens)`,
  );
  return combined;
}

const KNOWLEDGE_BASE = loadKnowledge();
module.exports = { KNOWLEDGE_BASE };

// /**
//  * knowledge.js
//  * Reads all .md files from the Knowledge/ folder at startup.
//  * Extracts structured project data (name, goal, requirements, concepts, mistakes)
//  * and compresses them to fit within Anam's system prompt token limit (~8000 tokens).
//  */

// const fs   = require("fs");
// const path = require("path");

// const KNOWLEDGE_DIR  = path.join(__dirname, "..", "Knowledge");
// const MAX_CHARS      = 28000; // ~7000 tokens — safe margin under Anam's limit

// // ── Extract key structured content from a markdown file ──────────
// function extractProjects(text) {
//   // Normalise line endings
//   text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

//   const lines   = text.split("\n");
//   const projects = [];
//   let current   = null;
//   let section   = null;

//   const GOAL_RE      = /^(goal|objective|description)\b/i;
//   const CORE_RE      = /^(core req|core rule|feature|requirement)/i;
//   const CONCEPT_RE   = /^(key concept|concept|what.*learn)/i;
//   const MISTAKE_RE   = /^(common mistake|mistake|tip)/i;
//   const PROJECT_RE   = /(?:project\s*\d*\s*[:\-]?\s*)(my [a-z0-9 ]+|[a-z0-9 ]{4,40})/i;
//   const HEADING_RE   = /^={3,}$|^-{3,}$/;

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i].trim();

//     // Project separator or heading
//     if (HEADING_RE.test(line)) continue;

//     // Detect a new project title
//     // Match various heading formats including "Season03 DS Project 1:" followed by title on next line
//     const projMatch = line.match(/^(Season\s*0?\d+\s*(?:DS|Arc\s*\d*|SE|Software\s*Eng(?:ineer)?)?\.?\s*Project\s*\d+[:\s]*.*|Preseason\s*(?:Web|Data)?\s*Project\s*\d+[:\s]+.+)/i);
//     const isMyProject = line.toLowerCase().startsWith("my ") && line.length < 60 && !line.includes(":");
//     const isProjectTitle = projMatch || isMyProject;
//     // Also detect standalone project names that follow a "Season03 DS Project N:" line
//     const prevLine = i > 0 ? lines[i-1].trim() : "";
//     const isNameAfterLabel = /^Season\s*0?\d+\s*DS\s*Project\s*\d+\s*:?\s*$/i.test(prevLine) && line.length > 2 && line.length < 60;
//     if (isProjectTitle || isNameAfterLabel) {
//       if (current && current.name) projects.push(current);
//       current = {
//         name    : line.replace(/^=+|=+$/g, "").trim(),
//         goal    : "",
//         core    : [],
//         concepts: [],
//         mistakes: [],
//       };
//       section = null;
//       continue;
//     }

//     if (!current) continue;

//     // Section detection
//     if (GOAL_RE.test(line))    { section = "goal";     continue; }
//     if (CORE_RE.test(line))    { section = "core";     continue; }
//     if (CONCEPT_RE.test(line)) { section = "concepts"; continue; }
//     if (MISTAKE_RE.test(line)) { section = "mistakes"; continue; }

//     // Collect content into section
//     if (!line || line.length < 2) { section = null; continue; }

//     if (section === "goal" && !current.goal && line.length > 10) {
//       current.goal = line;
//     } else if (section === "core" && line.startsWith("-") && current.core.length < 6) {
//       current.core.push(line);
//     } else if (section === "concepts" && line.startsWith("-") && current.concepts.length < 6) {
//       current.concepts.push(line);
//     } else if (section === "mistakes" && line.startsWith("-") && current.mistakes.length < 5) {
//       current.mistakes.push(line);
//     }
//   }

//   if (current && current.name) projects.push(current);
//   return projects;
// }

// // ── Format a project compactly ───────────────────────────────────
// function formatProject(p) {
//   const parts = [`PROJECT: ${p.name}`];
//   if (p.goal)              parts.push(`Goal: ${p.goal}`);
//   if (p.core.length)       parts.push(`Requirements: ${p.core.join(" | ")}`);
//   if (p.concepts.length)   parts.push(`Key concepts: ${p.concepts.join(" | ")}`);
//   if (p.mistakes.length)   parts.push(`Watch out for: ${p.mistakes.join(" | ")}`);
//   return parts.join("\n");
// }

// // ── Load and compress all knowledge files ────────────────────────
// function loadKnowledge() {
//   if (!fs.existsSync(KNOWLEDGE_DIR)) {
//     console.log("ℹ️  No Knowledge/ folder found");
//     return "";
//   }

//   const files = fs.readdirSync(KNOWLEDGE_DIR)
//     .filter(f => f.endsWith(".md") && f !== "README.md")
//     .sort();

//   if (files.length === 0) {
//     console.log("ℹ️  Knowledge/ folder is empty");
//     return "";
//   }

//   console.log(`📚 Loading ${files.length} knowledge file(s)...`);

//   const allSections = [];

//   for (const file of files) {
//     const raw      = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
//     const label    = file.replace(/\.md$/, "").replace(/[_-]/g, " ");
//     const projects = extractProjects(raw);

//     if (projects.length > 0) {
//       const formatted = projects.map(formatProject).join("\n\n");
//       allSections.push(`## ${label}\n${formatted}`);
//       console.log(`  ✓ ${file}: ${projects.length} project(s) extracted`);
//     } else {
//       // Fallback: take the raw file but truncate to 1500 chars
//       allSections.push(`## ${label}\n${raw.slice(0, 1500).replace(/\r\n/g, "\n")}`);
//       console.log(`  ⚠ ${file}: no structured projects found, using truncated raw`);
//     }
//   }

//   let combined = allSections.join("\n\n---\n\n");

//   // Hard cap to protect the system prompt limit
//   if (combined.length > MAX_CHARS) {
//     console.warn(`⚠️  Knowledge base truncated from ${combined.length} to ${MAX_CHARS} chars`);
//     combined = combined.slice(0, MAX_CHARS) + "\n\n[... additional projects available — ask students to specify their season/project]";
//   }

//   console.log(`📚 Knowledge base ready: ${combined.length} chars (~${Math.round(combined.length/4)} tokens)`);
//   return combined;
// }

// const KNOWLEDGE_BASE = loadKnowledge();
// module.exports = { KNOWLEDGE_BASE };
