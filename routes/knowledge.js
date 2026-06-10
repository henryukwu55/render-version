const fs = require("fs");
const path = require("path");

const KNOWLEDGE_DIR = path.join(__dirname, "..", "Knowledge");
const MAX_CHARS = 161479; // ~25,000 tokens

// Clean markdown symbols so LLM doesn't vocalize them as "hash hash hash"
function cleanMarkdown(text) {
  return (
    text
      // Remove headers (###, ##, # at start of lines)
      .replace(/^#{1,6}\s+/gm, "")
      // Remove bold markers
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      // Remove italic markers (but keep underscores in words)
      .replace(/(?<!\w)\*(?!\w)/g, "")
      .replace(/(?<!\w)_(?!\w)/g, "")
      // Remove code block markers but keep content
      .replace(/```[\s\S]*?```/g, (match) => {
        return match.replace(/```\w*\n?/g, "").replace(/```/g, "");
      })
      // Remove inline code markers but keep content
      .replace(/`([^`]+)`/g, "$1")
      // Remove horizontal rules
      .replace(/^[-*_]{3,}$/gm, "")
      // Convert list markers to plain text (using • instead of - or *)
      .replace(/^[\s]*[-*+]\s+/gm, "• ")
      .replace(/^[\s]*\d+\.\s+/gm, "• ")
      // Remove standalone asterisks and dashes on their own lines
      .replace(/^\*+\s*$/gm, "")
      .replace(/^-+\s*$/gm, "")
      // Remove extra whitespace and clean up
      .replace(/\n{3,}/g, "\n\n")
      // Remove any remaining standalone symbols
      .replace(/^\s*[#*_\-~]+\s*$/gm, "")
      .trim()
  );
}

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

    // CLEAN the markdown symbols BEFORE adding to knowledge base
    const cleaned = cleanMarkdown(raw);

    allSections.push(`## ${label}\n${cleaned}`);
    console.log(
      `  ✓ ${file}: ${raw.length} chars -> ${cleaned.length} chars (cleaned)`,
    );
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

// const fs = require("fs");
// const path = require("path");

// const KNOWLEDGE_DIR = path.join(__dirname, "..", "Knowledge");
// const MAX_CHARS = 161470; // ~25,000 tokens

// function loadKnowledge() {
//   if (!fs.existsSync(KNOWLEDGE_DIR)) {
//     console.log("ℹ️ No Knowledge/ folder found");
//     return "";
//   }

//   const files = fs
//     .readdirSync(KNOWLEDGE_DIR)
//     .filter((f) => f.endsWith(".md") && f !== "README.md")
//     .sort();

//   if (files.length === 0) {
//     console.log("ℹ️ Knowledge/ folder is empty");
//     return "";
//   }

//   console.log(`📚 Loading ${files.length} knowledge file(s)...`);

//   const allSections = [];

//   for (const file of files) {
//     const raw = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
//     const label = file.replace(/\.md$/, "").replace(/[_-]/g, " ");

//     // DIRECT FULL CONTENT - no extraction
//     allSections.push(`## ${label}\n${raw}`);
//     console.log(`  ✓ ${file}: ${raw.length} chars (FULL CONTENT)`);
//   }

//   let combined = allSections.join("\n\n---\n\n");

//   if (combined.length > MAX_CHARS) {
//     console.warn(
//       `⚠️ Knowledge base truncated from ${combined.length} to ${MAX_CHARS} chars`,
//     );
//     combined = combined.slice(0, MAX_CHARS) + "\n\n[... truncated]";
//   }

//   console.log(
//     `📚 Knowledge base ready: ${combined.length} chars (~${Math.round(combined.length / 4)} tokens)`,
//   );
//   return combined;
// }

// const KNOWLEDGE_BASE = loadKnowledge();
// module.exports = { KNOWLEDGE_BASE };
