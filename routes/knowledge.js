const fs = require("fs");
const path = require("path");

const KNOWLEDGE_DIR = path.join(__dirname, "..", "Knowledge");
const MAX_CHARS = 161479; // ~25,000 tokens — proven safe budget for ANAM_GPT_4O_MINI_V1

function normalise(str) {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

// Clean markdown symbols so the LLM doesn't vocalize them as "hash hash hash"
function cleanMarkdown(text) {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/(?<!\w)\*(?!\w)/g, "")
    .replace(/(?<!\w)_(?!\w)/g, "")
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?/g, "").replace(/```/g, ""))
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^[-*_]{3,}$/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "\u2022 ")
    .replace(/^[\s]*\d+\.\s+/gm, "\u2022 ")
    .replace(/^\*+\s*$/gm, "")
    .replace(/^-+\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s*[#*_~-]+\s*$/gm, "")
    .trim();
}

// ── Parser for the standard structured field format ───────────────
// (Project Name: / Project Submission: / Project Description: / etc.)
function parseStructured(text) {
  const projects = [];
  const blocks = text.replace(/\r\n/g, "\n").split(/\n---+\n/).filter(b => b.trim().length > 30);

  for (const block of blocks) {
    const lines = block.split("\n");
    const p = { name:"",submission:"",description:"",instructions:"",examples:"",hints:"",canDo:"",cannotDo:"",techSpec:"",allowedFunctions:"",common_mistakes:"" };
    let cur = null; const buf = {};

    for (const line of lines) {
      const t = line.trim(); if (!t) continue;
      if (/^Project Name:/i.test(t))            { p.name = t.replace(/^Project Name:\s*/i,""); cur=null; continue; }
      if (/^Project Submission:/i.test(t))       { p.submission = t.replace(/^Project Submission:\s*/i,""); cur=null; continue; }
      if (/^Project Description:/i.test(t))      { cur="d"; buf[cur]=t.replace(/^Project Description:\s*/i,""); continue; }
      if (/^Project Instructions:/i.test(t))      { cur="i"; buf[cur]=t.replace(/^Project Instructions:\s*/i,""); continue; }
      if (/^Examples?:/i.test(t))                 { cur="e"; buf[cur]=t.replace(/^Examples?:\s*/i,""); continue; }
      if (/^Hints?:/i.test(t))                    { cur="h"; buf[cur]=t.replace(/^Hints?:\s*/i,""); continue; }
      if (/^You can do:/i.test(t))                { cur="cd"; buf[cur]=t.replace(/^You can do:\s*/i,""); continue; }
      if (/^You cannot do:/i.test(t))             { cur="cnd"; buf[cur]=t.replace(/^You cannot do:\s*/i,""); continue; }
      if (/^Project Technical Spec/i.test(t))     { cur="ts"; buf[cur]=t.replace(/^Project Technical Spec[^:]*:\s*/i,""); continue; }
      if (/^Allowed [Ff]unctions?:/i.test(t))     { cur="af"; buf[cur]=t.replace(/^Allowed [Ff]unctions?:\s*/i,""); continue; }
      if (/^Common Mistakes:/i.test(t))           { cur="m"; buf[cur]=t.replace(/^Common Mistakes:\s*/i,""); continue; }
      if (cur) buf[cur] = (buf[cur]||"") + (buf[cur]?" ":"") + t;
    }

    if (buf.d)   p.description = buf.d;
    if (buf.i)   p.instructions = buf.i;
    if (buf.e)   p.examples = buf.e;
    if (buf.h)   p.hints = buf.h;
    if (buf.cd)  p.canDo = buf.cd;
    if (buf.cnd) p.cannotDo = buf.cnd;
    if (buf.ts)  p.techSpec = buf.ts;
    if (buf.af)  p.allowedFunctions = buf.af;
    if (buf.m)   p.common_mistakes = buf.m;

    if (p.name && p.name.length > 1) projects.push(p);
  }
  return projects;
}

function formatProject(p, category) {
  const f = (label, val) => (val && val.trim()) ? `${label}: ${val.trim()}` : null;
  return [
    `PROJECT: ${p.name}`,
    f("Category", category),
    f("Submission", p.submission),
    f("Description", p.description),
    f("Instructions", p.instructions),
    f("Examples", p.examples),
    f("Hints", p.hints),
    f("What you CAN do", p.canDo),
    f("What you CANNOT do", p.cannotDo),
    f("Technical Specification", p.techSpec),
    f("Allowed Functions", p.allowedFunctions),
    f("Common Mistakes", p.common_mistakes),
  ].filter(Boolean).join("\n");
}

// ── Fallback parser for old-style files (=== headers, no labeled fields) ──
function parseOldStyle(text) {
  const projects = [];
  const norm = text.replace(/\r\n/g, "\n");
  const rawBlocks = norm.split(/={3,}/);

  for (let i = 0; i < rawBlocks.length; i++) {
    const block = rawBlocks[i].trim();
    if (!block || block.length < 30) continue;
    const lines = block.split("\n");
    let titleLine = lines[0].trim();
    if (!titleLine || titleLine.length < 3) continue;
    if (/^(bachelor|---+|season\s*0?[23]\s*(ds|se|software))/i.test(titleLine)) continue;

    const p = { name:"",submission:"",description:"",instructions:"",examples:"",hints:"",canDo:"",cannotDo:"",techSpec:"",allowedFunctions:"",common_mistakes:"" };

    p.name = titleLine
      .replace(/^season\s*\d+\s*(ds|se|arc\s*\d+)?\s*project\s*\d+\s*[:\-]?\s*/i, "")
      .replace(/^#+\s*/, "")
      .trim();

    if (!p.name || p.name.length < 2) {
      for (let j = 1; j < Math.min(lines.length, 5); j++) {
        const c = lines[j].trim();
        if (c && c.length > 2 && !/^(submit|description|languages?)/i.test(c)) { p.name = c; break; }
      }
    }
    if (!p.name || p.name.length < 2) continue;

    let cur = null; const buf = {};
    for (let j = 1; j < lines.length; j++) {
      const t = lines[j].trim(); if (!t) continue;
      if (/^submit\s+(dir|file)/i.test(t))              { p.submission += (p.submission?" | ":"") + t; continue; }
      if (/^languages?\s/i.test(t))                     { continue; }
      if (/^(description)$/i.test(t))                   { cur = "d"; continue; }
      if (/^(instructions)$/i.test(t))                   { cur = "i"; continue; }
      if (/^(examples?|example\s*\d{2})/i.test(t))       { cur = "e"; buf[cur]=(buf[cur]||"")+t+"\n"; continue; }
      if (/^(hints?|tips?)$/i.test(t))                   { cur = "h"; continue; }
      if (/^(technical\s*spec|requirements?)/i.test(t))  { cur = "ts"; continue; }
      if (/^(authorized|allowed)\s*func/i.test(t))       { cur = "af"; continue; }
      if (cur) buf[cur] = (buf[cur]||"") + (buf[cur]?"\n":"") + t;
    }

    if (buf.d)  p.description  = buf.d;
    if (buf.i)  p.instructions = buf.i;
    if (buf.e)  p.examples     = buf.e;
    if (buf.h)  p.hints        = buf.h;
    if (buf.ts) p.techSpec     = buf.ts;
    if (buf.af) p.allowedFunctions = buf.af;

    if (p.name && (p.description || p.submission)) projects.push(p);
  }
  return projects;
}

function loadKnowledge() {
  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.log("\u2139\ufe0f  No Knowledge/ folder found");
    return { KNOWLEDGE_BASE: "", projects: [], projectMap: {} };
  }

  const files = fs.readdirSync(KNOWLEDGE_DIR)
    .filter(f => f.endsWith(".md") && f.toLowerCase() !== "readme.md")
    .sort();

  if (files.length === 0) {
    console.log("\u2139\ufe0f  Knowledge/ folder is empty");
    return { KNOWLEDGE_BASE: "", projects: [], projectMap: {} };
  }

  console.log(`\ud83d\udcda Loading ${files.length} knowledge file(s)...`);

  const allProjects = [];
  const projectMap = {};
  const allSections = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(KNOWLEDGE_DIR, file), "utf-8");
    const label = file.replace(/\.md$/i, "").replace(/[_-]/g, " ");
    const projects = parseStructured(raw);

    if (projects.length > 0) {
      // Structured parse succeeded — format each project individually, fully detailed
      const formatted = projects.map(p => {
        const txt = formatProject(p, label);
        const key = normalise(p.name);
        projectMap[key] = txt;
        allProjects.push({ name: p.name, category: label, key });
        return txt;
      });
      allSections.push(`## ${label}\n\n` + formatted.join("\n\n---\n\n"));
      console.log(`  \u2713 ${file}: ${projects.length} project(s) [structured]`);
    } else {
      // Try the old === heading style before giving up
      const oldProjects = parseOldStyle(raw);
      if (oldProjects.length > 0) {
        const formatted = oldProjects.map(p => {
          const txt = formatProject(p, label);
          const key = normalise(p.name);
          projectMap[key] = txt;
          allProjects.push({ name: p.name, category: label, key });
          return txt;
        });
        allSections.push(`## ${label}\n\n` + formatted.join("\n\n---\n\n"));
        console.log(`  \u2713 ${file}: ${oldProjects.length} project(s) [old-style parsed]`);
      } else {
        // Last resort: clean markdown and include raw, so nothing is ever silently dropped
        const cleaned = cleanMarkdown(raw);
        allSections.push(`## ${label}\n${cleaned}`);
        console.log(`  \u26a0 ${file}: no structured fields found, using cleaned raw text`);
      }
    }
  }

  let combined = allSections.join("\n\n---\n\n");

  if (combined.length > MAX_CHARS) {
    console.warn(`\u26a0\ufe0f  Knowledge base truncated from ${combined.length} to ${MAX_CHARS} chars`);
    combined = combined.slice(0, MAX_CHARS) + "\n\n[... truncated]";
  }

  console.log(`\ud83d\udcda Knowledge base ready: ${allProjects.length} projects | ${combined.length} chars (~${Math.round(combined.length / 4)} tokens)`);

  return { KNOWLEDGE_BASE: combined, projects: allProjects, projectMap };
}

const { KNOWLEDGE_BASE, projects, projectMap } = loadKnowledge();

module.exports = { KNOWLEDGE_BASE, projects, projectMap };
