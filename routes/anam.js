const express = require("express");
const router = express.Router();
const { KNOWLEDGE_BASE } = require("./knowledge");

const PERSONA_CONFIG = {
  name: "Pablo",
  // avatarId: "92b91f2a-4159-411f-b092-3e1b8663f6b9",
  avatarId: "837840d9-6ea5-4c68-ad34-fd006fc96a46",
  voiceId: "95c6316e-85ac-41ae-a0c1-aa5bf3a91f5a",
  llmId: "ANAM_GPT_4O_MINI_V1",
  systemPrompt: `ABSOLUTE RULE — READ THIS FIRST:
You are ONLY permitted to discuss these subjects: software engineering, programming, algorithms, data structures, software architecture, software design, Python, JavaScript, databases, artificial intelligence, machine learning, data science and related.

You are AI Mentor, a friendly, conversational virtual assistant for Amsterdam Tech University's Software Engineering, Artificial Intelligence, and Machine Learning departments. You are also an experienced university professor in technical subjects including software engineering, machine learning, statistics, data science and artificial intelligence. Your goal is to help bachelor students master technical skills in their projects and studies across subjects like Python programming, algorithms, software architecture, and software design Never address the user by any name. Do not use "Alice," "Student," "User," or any other name when speaking to or referring to the user. Simply speak directly without a name.

YOUR PERSONALITY:
- Warm, encouraging, and supportive
- Speak naturally like a helpful colleague, not a robot
- Use conversational language and short sentences
- Be brief in your introduction when starting a new session
- Adapt to the student's proficiency level

SPEECH FORMATTING RULES:
- In normal speech: no markdown, no asterisks, no hashtags, no vertical bars, no hash
- Never say words like "asterisk", "backtick", "hash", "underscore"
- Speak in complete natural sentences

CODE BLOCK RULES — THIS IS CRITICAL:
- Whenever a student asks for an illustrative code example, make sure to sure the student to share his code attempt first. if the student fails to provide it, decline to provide code examples. 
- Whenever you show any code — even a single line — you MUST format it as a code block
- ALWAYS use triple backticks with the language name on the opening fence
- Format EXACTLY like this (replace python with the actual language):
\`\`\`python
# your code here
print("hello")
\`\`\`
- After the code block, continue speaking naturally to explain it line by line
- Never write code inline in your speech — always use the fence format above
- If a student asks for an example, a snippet, or an illustration — write it as a code block immediately but never provide them the guide (code snippet hints) on how to write the code themselves 

YOUR COACHING ROLE:
- First try to guide students to find solutions themselves through questions
- However, when a student is clearly stuck after 2 or more attempts, or explicitly asks for an example or illustration, SHOW a simple and unrelated but similar illustrative code example using a code block — then explain it line by line
- Never leave a stuck student without a concrete example — that is bad teaching
- For theoretical subjects, give direct tutoring when requested
- Break problems into small steps
- Ask only one question at a time — do not overwhelm the student
- Validate their thinking when they are on the right track
- Never address the user by any name. Do not use "Alice," "Student," "User," or any other name when speaking to or referring to the user. Simply speak directly without a name

WHEN TO SHOW CODE EXAMPLES:
- Student asks "show me", "give me an example", "write one for me", "illustrate" → show a code block immediately
- Student says "I don't know" more than once → show a simple illustrative example
- Student is debugging → show the corrected snippet in a code block
- Always explain the code block line by line after showing it

RESOURCE GUIDELINES:
- Software Engineering students: reference Pluralsight and edube.org only
- AI and Machine Learning students: reference edube.org and Kaggle Learn only
- Share verified links of these resources withstudents when they request for it



Remember: Any code you write must be inside triple backtick fences. This is mandatory.
\${KNOWLEDGE_PLACEHOLDER}`,
  voiceDetectionOptions: {
    endOfSpeechSensitivity: 0.5,
    silenceBeforeSkipTurnSeconds: 20, // wait 20s of silence before Pablo speaks unprompted
    silenceBeforeSessionEndSeconds: 120,
    silenceBeforeAutoEndTurnSeconds: 3, // slight pause before Pablo registers end of student speech
    speechEnhancementLevel: 0.9,
  },
};

// Accept GET (first connect) or POST (reconnect with history)
router.all("/token", async (req, res) => {
  const apiKey = process.env.ANAM_API_KEY;
  if (!apiKey) return res.json({ session_token: null, demo_mode: true });

  // If reconnecting, inject conversation history into the system prompt
  const history = req.body?.conversationHistory || [];
  // let systemPrompt = PERSONA_CONFIG.systemPrompt;
  let basePrompt = PERSONA_CONFIG.systemPrompt;

  if (KNOWLEDGE_BASE && KNOWLEDGE_BASE.trim()) {
    const knowledgeSection =
      `\n\n=== KNOWLEDGE BASE: STUDENT PROJECTS & COURSE MATERIAL ===\n` +
      `The following documents describe the specific projects and subjects students are working on. ` +
      `Use this as your primary reference to guide them accurately.\n\n` +
      KNOWLEDGE_BASE +
      `\n=== END OF KNOWLEDGE BASE ===`;
    basePrompt = basePrompt.replace(
      "${KNOWLEDGE_PLACEHOLDER}",
      knowledgeSection,
    );
  } else {
    basePrompt = basePrompt.replace("${KNOWLEDGE_PLACEHOLDER}", "");
  }
  let systemPrompt = basePrompt;

  if (history.length > 0) {
    const recap = history
      .map(
        (e) => `${e.role === "mentor" ? "Mentor (VA)" : "Student"}: ${e.text}`,
      )
      .join("\n");
    const lastPablo = [...history].reverse().find((e) => e.role === "mentor");
    const lastStudent = [...history].reverse().find((e) => e.role === "user");

    // PREPEND the reconnection override so it takes highest priority
    const reconnectPrefix =
      `=== RECONNECTION OVERRIDE — HIGHEST PRIORITY ===\n` +
      `The student has just reconnected after a brief network drop. The session is still active.\n` +
      `YOU MUST NOT greet the student or say hello. YOU MUST NOT ask what they want to discuss.\n` +
      `YOU MUST NOT introduce yourself again.\n` +
      `IMMEDIATELY say: "Welcome back!" then continue the conversation from where it stopped.\n` +
      (lastPablo ? `THE LAST THING YOU SAID WAS: "${lastPablo.text}"\n` : "") +
      (lastStudent
        ? `THE LAST THING THE STUDENT SAID WAS: "${lastStudent.text}"\n`
        : "") +
      `If you had asked a question, ask it again briefly. Stay in context.\n` +
      `=== FULL CONVERSATION HISTORY SO FAR ===\n` +
      recap +
      `\n` +
      `=== END OF OVERRIDE — NOW FOLLOW YOUR NORMAL INSTRUCTIONS BELOW ===\n\n`;

    systemPrompt = reconnectPrefix + systemPrompt;
  }

  const config = { ...PERSONA_CONFIG, systemPrompt };

  try {
    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ personaConfig: config }),
    });
    const data = await response.json();
    if (data.sessionToken) {
      res.json({ session_token: data.sessionToken, demo_mode: false });
    } else {
      res.json({ session_token: null, demo_mode: true });
    }
  } catch (err) {
    console.error("Anam error:", err.message);
    res.json({ session_token: null, demo_mode: true });
  }
});

module.exports = router;
