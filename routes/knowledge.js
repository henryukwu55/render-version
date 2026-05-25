/**
 * knowledge.js
 * Reads all .md files from the Knowledge/ folder at startup
 * and returns them as a single formatted string for injection
 * into Pablo's system prompt.
 */

const fs = require("fs");
const path = require("path");

const KNOWLEDGE_DIR = path.join(__dirname, "..", "Knowledge");

function loadKnowledge() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.log(
      "ℹ️  No Knowledge/ folder found — skipping knowledge base load",
    );
    return "";
  }

  const files = fs
    .readdirSync(KNOWLEDGE_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .sort(); // deterministic order

  if (files.length === 0) {
    console.log("ℹ️  Knowledge/ folder is empty — no knowledge base loaded");
    return "";
  }

  console.log(
    `📚 Loading ${files.length} knowledge file(s): ${files.join(", ")}`,
  );

  const sections = files.map((file) => {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8").trim();
    const title = file
      .replace(/\.md$/, "")
      .replace(/-/g, " ")
      .replace(/_/g, " ");
    return `### ${title}\n${raw}`;
  });

  return sections.join("\n\n---\n\n");
}

// Load once at startup — not on every request (performance)
const KNOWLEDGE_BASE = loadKnowledge();

module.exports = { KNOWLEDGE_BASE };
