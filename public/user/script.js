// ── State ────────────────────────────────────────────────────────
const state = {
  sessionToken: null,
  durationSeconds: 0,
  secondsUsed: 0,
  timerInterval: null,
  anamClient: null,
  isConnected: false,
  isMicOn: false,
  accessCode: null,
  // Transcript
  caraStreamBubble: null,
  caraStreamText: "",
  conversationLog: [], // also mirrored to sessionStorage for reconnect memory
  isReconnecting: false, // true when reconnecting mid-session (not first connect)
  // Student activity detection
  studentTyping: false,
  studentSpeaking: false,
  typingTimer: null, // debounce — clears "typing" state after pause
};

// ── DOM ──────────────────────────────────────────────────────────
const codeEntryScreen = document.getElementById("code-entry-screen");
const appScreen = document.getElementById("app-screen");
const codeInput = document.getElementById("access-code-input");
const submitCodeBtn = document.getElementById("submit-code-btn");
const codeError = document.getElementById("code-error");
const connectBtn = document.getElementById("connect-btn");
const disconnectBtn = document.getElementById("disconnect-btn");
const micBtn = document.getElementById("mic-btn");
const sendBtn = document.getElementById("send-btn");
const messageInput = document.getElementById("message-input");
const transcriptEl = document.getElementById("transcript");
const copyBtn = document.getElementById("copy-btn");
const pdfBtn = document.getElementById("pdf-btn");
const statusDot = document.getElementById("status-dot");
const statusText = document.getElementById("status-text");
const micStatus = document.getElementById("mic-status");
const timerDisplay = document.getElementById("timer-display");
const endSessionBtn = document.getElementById("end-session-btn");
const restartBtn = document.getElementById("restart-btn");
const expiredOverlay = document.getElementById("expired-overlay");
const anamVideo = document.getElementById("anam-video");
const avatarPlaceholder = document.getElementById("avatar-placeholder");

// ── Init ─────────────────────────────────────────────────────────
function init() {
  codeInput.addEventListener("input", formatCodeInput);
  codeInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") validateCode();
  });
  submitCodeBtn.addEventListener("click", validateCode);
  connectBtn.addEventListener("click", connect);
  disconnectBtn.addEventListener("click", disconnect);
  micBtn.addEventListener("click", toggleMicrophone);
  sendBtn.addEventListener("click", sendTextMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendTextMessage();
  });
  // Detect typing — pause Pablo's output while student is composing
  messageInput.addEventListener("input", onStudentTyping);
  messageInput.addEventListener("blur", onStudentStoppedTyping);
  // Soft privacy nudge whenever the student pastes text into the box
  messageInput.addEventListener("paste", onMessageInputPaste);
  endSessionBtn.addEventListener("click", () => endSession("manual"));
  restartBtn.addEventListener("click", () => location.reload());
  copyBtn.addEventListener("click", copyTranscript);
  pdfBtn.addEventListener("click", () => downloadTranscriptPDF());

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    // Restore saved preference
    const saved = localStorage.getItem("pablo_theme");
    if (saved === "light") applyTheme("light");
    themeToggle.addEventListener("click", () => {
      const isLight = document.documentElement.dataset.theme === "light";
      applyTheme(isLight ? "dark" : "light");
    });
  }
}

function applyTheme(mode) {
  document.documentElement.dataset.theme = mode;
  localStorage.setItem("pablo_theme", mode);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = mode === "light" ? "🌙 Dark" : "☀️ Light";
}

// ── Session memory helpers ───────────────────────────────────────
function saveHistory() {
  try {
    sessionStorage.setItem(
      "pablo_history",
      JSON.stringify(
        state.conversationLog.filter((e) => e.final && e.text.trim()),
      ),
    );
  } catch (e) {}
}

function loadHistory() {
  try {
    const raw = sessionStorage.getItem("pablo_history");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function clearHistory() {
  try {
    sessionStorage.removeItem("pablo_history");
  } catch (e) {}
}

function formatCodeInput() {
  let v = codeInput.value.toUpperCase().replace(/[^A-Z0-9\-]/g, "");
  if (v.length >= 2 && !v.includes("-")) v = v.slice(0, 2) + "-" + v.slice(2);
  codeInput.value = v.slice(0, 8);
}

// ── Validate Code ─────────────────────────────────────────────────
async function validateCode() {
  let rawCode = codeInput.value.trim();
  codeError.textContent = "";
  if (!rawCode || rawCode.length < 7) {
    codeError.textContent = "Please enter a valid code (e.g. AT-X7K9P)";
    return;
  }
  let cleanCode = rawCode.toUpperCase();
  if (!cleanCode.startsWith("AT-"))
    cleanCode = "AT-" + cleanCode.replace(/^AT-?/i, "");

  submitCodeBtn.disabled = true;
  submitCodeBtn.textContent = "Verifying…";
  try {
    const res = await fetch("/api/codes/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: cleanCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      codeError.textContent = data.error || "Invalid or expired code.";
      submitCodeBtn.disabled = false;
      submitCodeBtn.textContent = "Start Session";
      return;
    }
    state.sessionToken = data.session_token;
    state.durationSeconds = data.duration_seconds;
    state.accessCode = cleanCode;
    codeEntryScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    // Load any history saved from a previous connection in this session
    state.conversationLog = loadHistory();
    startTimer();
    addSystemNote(
      `Session started — ${formatDuration(state.durationSeconds)} available. Click "Connect to Mentor" to begin.`,
    );
  } catch (err) {
    codeError.textContent = "Network error. Please try again.";
    submitCodeBtn.disabled = false;
    submitCodeBtn.textContent = "Start Session";
  }
}

// ── Timer ─────────────────────────────────────────────────────────
function startTimer() {
  updateTimerDisplay();
  state.timerInterval = setInterval(() => {
    state.secondsUsed++;
    updateTimerDisplay();
    if (state.secondsUsed >= state.durationSeconds) expireSession();
  }, 1000);
}

function updateTimerDisplay() {
  const remaining = Math.max(0, state.durationSeconds - state.secondsUsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  timerDisplay.classList.toggle("urgent", remaining < 60);
  if (remaining === 10) addSystemNote("⚠️ 10 seconds remaining");
}

// ── Connect ───────────────────────────────────────────────────────
async function connect() {
  if (!state.sessionToken) {
    addSystemNote("❌ No session token. Please restart.");
    return;
  }
  setConnectionStatus("connecting");
  connectBtn.disabled = true;
  addSystemNote("Connecting to Mentor…");

  try {
    // If we have prior conversation history, send it so Pablo can continue the context
    const history = state.conversationLog.filter(
      (e) => e.final && e.text.trim(),
    );
    state.isReconnecting = history.length > 0;

    // ── Speech pace from localStorage ──────────────────
    const savedPace = localStorage.getItem("pablo_speech_pace") || "normal";
    const speechPace = ["slow", "normal", "fast"].includes(savedPace)
      ? savedPace
      : "normal";

    // ── Student sentiment hint, computed from recent message history ──
    // Coarse client-side heuristic only — not a clinical or diagnostic
    // judgement. Gives Pablo a head start if reconnecting mid-struggle;
    // his real-time empathetic adaptation comes from reading tone in the
    // live conversation directly (see EMOTIONAL INTELLIGENCE in the
    // system prompt), this is just a hint for the moment of reconnect.
    const studentSentimentHint = computeSentimentHint(history);

    const tokenRes = await fetch("/api/anam/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationHistory: history,
        speechPace: speechPace,
        studentSentimentHint: studentSentimentHint,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.demo_mode || !tokenData.session_token) {
      addSystemNote("⚠️ ANAM_API_KEY not configured on server.");
      state.isConnected = true;
      setConnectionStatus("connected");
      setControlsEnabled(true);
      return;
    }

    // Wait for SDK (loaded via <script type="module"> in HTML)
    await new Promise((resolve, reject) => {
      if (window.anamCreateClient) return resolve();
      const t = setTimeout(
        () => reject(new Error("Anam SDK timed out")),
        15000,
      );
      window.addEventListener(
        "anam-sdk-ready",
        () => {
          clearTimeout(t);
          resolve();
        },
        { once: true },
      );
    });

    // Create client — do NOT call getUserMedia before this.
    // The SDK handles mic permission internally; pre-grabbing the stream breaks it.
    state.anamClient = window.anamCreateClient(tokenData.session_token);

    // ── Mic permission events ──────────────────────────────────
    state.anamClient.addListener("MIC_PERMISSION_PENDING", () => {
      addSystemNote("🎤 Requesting microphone permission…");
    });
    state.anamClient.addListener("MIC_PERMISSION_GRANTED", () => {
      state.isMicOn = true;
      micBtn.classList.add("active");
      micBtn.textContent = "🔇 Mute Mic";
      micStatus.textContent = "Microphone: active — Mentor can hear you";
      addSystemNote("✓ Microphone granted — Mentor can hear you.");
    });
    state.anamClient.addListener("MIC_PERMISSION_DENIED", (err) => {
      addSystemNote(
        "❌ Microphone denied. Open browser settings and allow mic, then reconnect.",
      );
      micStatus.textContent = "Microphone: permission denied";
    });

    // ── Connection events ──────────────────────────────────────
    state.anamClient.addListener("CONNECTION_ESTABLISHED", () => {
      addSystemNote("✓ Connected to Mentor.");
    });
    state.anamClient.addListener("SESSION_READY", () => {
      addSystemNote("✓ Mentor is ready — start speaking!");
    });
    state.anamClient.addListener("CONNECTION_CLOSED", () => {
      finaliseCaraStream();
      setConnectionStatus("disconnected");
      setControlsEnabled(false);
      connectBtn.disabled = false;
      micBtn.textContent = "🎤 Microphone";
      micBtn.classList.remove("active");
      micStatus.textContent = "Microphone: off";
      state.isConnected = false;
      state.isMicOn = false;
      addSystemNote("Connection closed.");
    });

    // ── User speech events ─────────────────────────────────────
    state.anamClient.addListener("USER_SPEECH_STARTED", () => {
      onStudentSpeaking();
    });
    state.anamClient.addListener("USER_SPEECH_ENDED", () => {
      onStudentFinishedSpeaking();
    });

    // ── Transcript: streaming (word-by-word APPEND) ────────────
    // MESSAGE_STREAM_EVENT_RECEIVED sends INCREMENTAL new words, not full text.
    // role = "persona" while Cara speaks; role = "user" when user turn finalises.
    state.anamClient.addListener("MESSAGE_STREAM_EVENT_RECEIVED", (event) => {
      if (event.role === "persona") {
        // Append new word fragment to the live Pablo bubble
        appendToCaraStream(event.content);
      } else if (event.role === "user") {
        // User's recognised speech — show as a user bubble
        finaliseCaraStream();
        addUserBubble(event.content, true);
      }
    });

    // MESSAGE_HISTORY_UPDATED fires after each full turn.
    // Use it to correct/finalise Pablo's bubble with the clean final text.
    state.anamClient.addListener("MESSAGE_HISTORY_UPDATED", (messages) => {
      const lastAssistant = [...messages]
        .reverse()
        .find((m) => m.role === "assistant");
      const lastUser = [...messages].reverse().find((m) => m.role === "user");

      if (lastAssistant) {
        finaliseCaraStream(lastAssistant.content);
        // Update conversation log with clean final text
        const existing = state.conversationLog.findLast?.(
          (e) => e.role === "mentor",
        );
        if (existing && !existing.final) {
          existing.text = lastAssistant.content;
          existing.final = true;
        }
      }
      if (lastUser) {
        // Make sure the user bubble is in the log (stream event may have already added it)
        const lastLogUser = state.conversationLog.findLast?.(
          (e) => e.role === "user",
        );
        if (!lastLogUser || lastLogUser.text !== lastUser.content) {
          addUserBubble(lastUser.content, false); // false = don't duplicate DOM if already there
        }
        // Update log entry to final
        const logEntry = state.conversationLog.findLast?.(
          (e) => e.role === "user",
        );
        if (logEntry) {
          logEntry.text = lastUser.content;
          logEntry.final = true;
        }
      }
    });

    // ── Start streaming ────────────────────────────────────────
    await state.anamClient.streamToVideoElement("anam-video");

    anamVideo.style.display = "block";
    avatarPlaceholder.style.display = "none";
    state.isConnected = true;
    setConnectionStatus("connected");
    setControlsEnabled(true);
    if (state.isReconnecting) {
      addSystemNote(
        "↩️ Reconnected — Mentor remembers your conversation and will continue where you left off.",
      );
    }
  } catch (err) {
    console.error("Connection error:", err);
    setConnectionStatus("disconnected");
    connectBtn.disabled = false;
    addSystemNote(`❌ Connection failed: ${err.message}`);
  }
}

// ── Disconnect ────────────────────────────────────────────────────
function disconnect() {
  finaliseCaraStream();
  if (state.anamClient) {
    state.anamClient.stopStreaming();
    state.anamClient = null;
  }
  anamVideo.srcObject = null;
  anamVideo.style.display = "none";
  avatarPlaceholder.style.display = "flex";
  state.isConnected = false;
  state.isMicOn = false;
  setConnectionStatus("disconnected");
  setControlsEnabled(false);
  connectBtn.disabled = false;
  micBtn.classList.remove("active");
  micBtn.textContent = "🎤 Microphone";
  micStatus.textContent = "Microphone: off";
  addSystemNote("Disconnected.");
}

// ── Student activity detection ───────────────────────────────────
// When student types, mute the MIC INPUT so the SDK silence detector
// doesn't think the student has gone quiet and trigger Pablo to speak.
// We also mute Pablo's output so he doesn't talk over the typing.
function onStudentTyping() {
  if (!state.isConnected || !state.anamClient) return;
  if (!state.studentTyping) {
    state.studentTyping = true;
    // Mute mic input — stops SDK silence detector from firing
    state.anamClient.muteInputAudio?.();
    // Also mute Pablo's output so he doesn't interrupt
    state.anamClient.muteOutputAudio?.();
    setStudentActivityIndicator("typing");
  }
  // Debounce — if student stops typing for 2.5s, release
  clearTimeout(state.typingTimer);
  state.typingTimer = setTimeout(onStudentStoppedTyping, 2500);
}

function onStudentStoppedTyping() {
  if (!state.studentTyping) return;
  state.studentTyping = false;
  clearTimeout(state.typingTimer);
  if (!state.studentSpeaking) {
    // Restore mic input so Pablo can hear again
    state.anamClient?.unmuteInputAudio?.();
    state.anamClient?.unmuteOutputAudio?.();
    setStudentActivityIndicator(null);
    // Sync mic button state
    if (state.isMicOn) {
      micStatus.textContent = "Microphone: active — Mentor can hear you";
    }
  }
}

// Soft, non-blocking privacy reminder shown whenever the student pastes
// text into the message box. This does NOT block, alter, or inspect the
// pasted content in any way — it only shows a brief heads-up, since real
// personal data (names, emails, IDs) is something students sometimes
// paste in without thinking when copying an error message or assignment
// text that happens to include their own details.
let pasteWarningTimer = null;
function onMessageInputPaste() {
  const banner = document.getElementById("paste-warning");
  if (!banner) return;
  banner.classList.remove("hidden");
  // Restart the dismiss timer on every paste rather than stacking timers
  clearTimeout(pasteWarningTimer);
  pasteWarningTimer = setTimeout(() => {
    banner.classList.add("hidden");
  }, 6000);
}

// Called by USER_SPEECH_STARTED SDK event
function onStudentSpeaking() {
  state.studentSpeaking = true;
  // Don't mute input — the student IS speaking, SDK should hear them
  // Mute Pablo's output so he doesn't talk over the student
  state.anamClient?.muteOutputAudio?.();
  micStatus.textContent = "🎤 Listening…";
  setStudentActivityIndicator("speaking");
}

// Called by USER_SPEECH_ENDED SDK event
function onStudentFinishedSpeaking() {
  state.studentSpeaking = false;
  micStatus.textContent = "Microphone: active — Mentor can hear you";
  if (!state.studentTyping) {
    state.anamClient?.unmuteOutputAudio?.();
    setStudentActivityIndicator(null);
  }
}

// Shows/hides the "student is responding" indicator in the transcript
function setStudentActivityIndicator(mode) {
  let el = document.getElementById("student-activity-indicator");
  if (!mode) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("div");
    el.id = "student-activity-indicator";
    el.className = "tx-system tx-activity";
    transcriptEl.appendChild(el);
  }
  el.textContent =
    mode === "typing"
      ? "✏️  Student is typing a response…"
      : "🎤  Student is speaking…";
  scrollTranscript();
}

// ── Microphone toggle ─────────────────────────────────────────────
function toggleMicrophone() {
  if (!state.isConnected || !state.anamClient) {
    addSystemNote("Connect to Mentor first.");
    return;
  }
  if (state.isMicOn) {
    state.anamClient.muteInputAudio();
    state.isMicOn = false;
    micBtn.classList.remove("active");
    micBtn.textContent = "🎤 Unmute Mic";
    micStatus.textContent = "Microphone: muted";
    addSystemNote("🔇 Microphone muted — Mentor cannot hear you.");
  } else {
    state.anamClient.unmuteInputAudio();
    state.isMicOn = true;
    micBtn.classList.add("active");
    micBtn.textContent = "🔇 Mute Mic";
    micStatus.textContent = "Microphone: active — Mentor can hear you";
    addSystemNote("🎤 Microphone active — Mentor can hear you.");
  }
}

// ── Text message ──────────────────────────────────────────────────
function sendTextMessage() {
  const message = messageInput.value.trim();
  if (!message || !state.isConnected) return;
  // Force-close any still-open Mentor response bubble before adding the
  // student's message. The voice path does this automatically because
  // Anam fires MESSAGE_STREAM_EVENT_RECEIVED with role:"user" the moment
  // speech is detected, which finalises the previous bubble synchronously.
  // Typed messages have no equivalent signal — MESSAGE_HISTORY_UPDATED
  // for the prior turn isn't guaranteed to have arrived yet, so without
  // this the next reply's fragments silently append into the still-open
  // bubble from the previous turn instead of starting a new one.
  finaliseCaraStream();
  addUserBubble(message, true);
  if (state.anamClient?.sendUserMessage)
    state.anamClient.sendUserMessage(message);
  messageInput.value = "";
}

// ── Sentiment hint (coarse heuristic, not a diagnosis) ─────────────
// Scans the student's most recent messages for plain-text signals of
// frustration/discouragement or confidence/momentum. This is a lightweight
// pattern match — not sentiment-analysis ML, not a clinical assessment —
// it exists only to give Pablo's empathetic response a head start on
// reconnect. The live, real-time tone reading happens inside the LLM
// itself via the EMOTIONAL INTELLIGENCE section of the system prompt.
function computeSentimentHint(history) {
  const studentMessages = history
    .filter((e) => e.role === "user")
    .slice(-5) // only look at the most recent few messages
    .map((e) => e.text.toLowerCase());

  if (studentMessages.length === 0) return "neutral";

  const struggleSignals = [
    "i don't know",
    "i dont know",
    "i give up",
    "this is too hard",
    "i'm stuck",
    "im stuck",
    "i can't",
    "i cant",
    "confused",
    "frustrated",
    "this isn't working",
    "this is not working",
    "still doesn't work",
    "still not working",
    "i don't understand",
    "i dont understand",
    "lost",
    "no idea",
  ];

  const confidenceSignals = [
    "got it",
    "that makes sense",
    "i understand",
    "it works",
    "that worked",
    "thank you",
    "thanks",
    "great",
    "perfect",
    "makes sense now",
    "i see",
  ];

  let struggleScore = 0;
  let confidenceScore = 0;
  let shortTerseCount = 0;

  for (const msg of studentMessages) {
    const trimmed = msg.trim();
    if (struggleSignals.some((signal) => trimmed.includes(signal))) {
      struggleScore++;
    }
    if (confidenceSignals.some((signal) => trimmed.includes(signal))) {
      confidenceScore++;
    }
    // Very short replies (one or two words) repeated across several
    // messages can indicate disengagement or frustration, especially
    // after the mentor has just explained something at length.
    const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
    if (wordCount > 0 && wordCount <= 2) shortTerseCount++;
  }

  // Several short terse replies in a row is itself a mild struggle signal,
  // even without an explicit phrase like "I don't know".
  if (shortTerseCount >= 3) struggleScore += 1;

  if (struggleScore >= 2 && struggleScore > confidenceScore)
    return "struggling";
  if (confidenceScore >= 2 && confidenceScore > struggleScore)
    return "confident";
  return "neutral";
}

// ── Transcript helpers ────────────────────────────────────────────

function addSystemNote(text) {
  const div = document.createElement("div");
  div.className = "tx-system";
  div.textContent = text;
  transcriptEl.appendChild(div);
  scrollTranscript();
}

function addUserBubble(text, addToDOM = true) {
  if (!text || !text.trim()) return;
  const t = text.trim();
  const time = timestamp();
  state.conversationLog.push({ role: "user", text: t, time, final: true });
  saveHistory();
  if (!addToDOM) return;
  const wrap = document.createElement("div");
  wrap.className = "tx-row tx-user";
  // Label bold + coloured, then quoted speech inline, then faint timestamp
  const label = document.createElement("span");
  label.className = "tx-label";
  label.textContent = "Student: ";
  const bubble = document.createElement("span");
  bubble.className = "tx-bubble";
  bubble.textContent = "“" + t + "”";
  const ts = document.createElement("span");
  ts.className = "tx-time";
  ts.textContent = time;
  wrap.appendChild(label);
  wrap.appendChild(bubble);
  wrap.appendChild(document.createTextNode(" "));
  wrap.appendChild(ts);
  transcriptEl.appendChild(wrap);
  scrollTranscript();
}

// ── Segment parser: splits Pablo's text into speech + code blocks ──
function parseSegments(raw) {
  const segments = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0,
    match;
  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex)
      segments.push({
        type: "text",
        content: raw.slice(lastIndex, match.index),
      });
    segments.push({
      type: "code",
      lang: match[1] || "plaintext",
      content: match[2],
    });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < raw.length)
    segments.push({ type: "text", content: raw.slice(lastIndex) });
  return segments;
}

// Detect bullet markers (•, -, *) or numbered list markers (1., 2.) at the
// start of a line. Used to decide whether a paragraph should render as
// a <ul>/<ol> instead of plain prose.
const BULLET_LINE_RE = /^\s*([•\-\*]|\d+[.)])\s+(.*)$/;

// Split raw text into paragraph-like blocks: a "list" block is one or more
// consecutive bullet/numbered lines; a "prose" block is everything else,
// split on blank lines so distinct paragraphs don't get glued together.
function splitIntoBlocks(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let currentList = null;
  let currentProse = [];

  const flushProse = () => {
    const joined = currentProse.join(" ").trim();
    if (joined) blocks.push({ kind: "prose", text: joined });
    currentProse = [];
  };
  const flushList = () => {
    if (currentList && currentList.items.length) blocks.push(currentList);
    currentList = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const bulletMatch = line.match(BULLET_LINE_RE);

    if (bulletMatch) {
      flushProse();
      const marker = bulletMatch[1];
      const isOrdered = /^\d/.test(marker);
      if (!currentList || currentList.ordered !== isOrdered) {
        flushList();
        currentList = { kind: "list", ordered: isOrdered, items: [] };
      }
      currentList.items.push(bulletMatch[2].trim());
      continue;
    }

    if (!line) {
      // Blank line — ends whatever block is open
      flushList();
      flushProse();
      continue;
    }

    // Plain prose line — close any open list, accumulate into prose
    flushList();
    currentProse.push(line);
  }
  flushList();
  flushProse();
  return blocks;
}

// Render a block of text (prose + lists) into a parent element with
// real DOM structure so bullets, numbered steps, and paragraph breaks
// are visually distinct instead of collapsing into one line.
function renderTextBlock(parent, text) {
  const txt = text.trim();
  if (!txt) return;
  const blocks = splitIntoBlocks(txt);

  blocks.forEach((block) => {
    if (block.kind === "list") {
      const listEl = document.createElement(block.ordered ? "ol" : "ul");
      listEl.className = "tx-list";
      block.items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        listEl.appendChild(li);
      });
      parent.appendChild(listEl);
    } else {
      const p = document.createElement("p");
      p.className = "tx-bubble-text";
      p.textContent = block.text;
      parent.appendChild(p);
    }
  });
}

// Render finalised segments with syntax highlighting
function renderSegments(parent, segments) {
  parent.innerHTML = "";
  segments.forEach((seg) => {
    if (seg.type === "text") {
      renderTextBlock(parent, seg.content);
    } else {
      const wrap = document.createElement("div");
      wrap.className = "tx-code-wrap";

      const header = document.createElement("div");
      header.className = "tx-code-header";
      const langLabel = document.createElement("span");
      langLabel.textContent = seg.lang || "code";
      const copyBtn = document.createElement("button");
      copyBtn.className = "tx-code-copy";
      copyBtn.textContent = "Copy";
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(seg.content).then(() => {
          copyBtn.textContent = "Copied!";
          setTimeout(() => {
            copyBtn.textContent = "Copy";
          }, 2000);
        });
      };
      header.appendChild(langLabel);
      header.appendChild(copyBtn);

      const pre = document.createElement("pre");
      const code = document.createElement("code");
      code.className = seg.lang ? "language-" + seg.lang : "";
      code.textContent = seg.content;
      pre.appendChild(code);
      wrap.appendChild(header);
      wrap.appendChild(pre);
      parent.appendChild(wrap);
      if (window.hljs) window.hljs.highlightElement(code);
    }
  });
}

// APPEND incremental fragments — live code preview while fence is open.
// Re-rendering is throttled to one paint per animation frame instead of
// once per fragment: rebuilding the whole bubble (innerHTML = "") on every
// single word can outpace the browser's paint cycle on longer responses,
// which is what caused visible "skipping" — some intermediate renders were
// simply never painted before being replaced by the next one.
function appendToCaraStream(fragment) {
  if (!fragment) return;
  if (!state.caraStreamBubble) {
    const time = timestamp();
    state.conversationLog.push({
      role: "mentor",
      text: "Mentor(VA)",
      time,
      final: false,
    });
    const wrap = document.createElement("div");
    wrap.className = "tx-row tx-cara";
    const label = document.createElement("span");
    label.className = "tx-label";
    label.textContent = "Mentor (VA): ";
    const contentEl = document.createElement("div");
    contentEl.className = "tx-stream-content";
    const cursor = document.createElement("span");
    cursor.className = "tx-cursor";
    cursor.textContent = "▮";
    const ts = document.createElement("span");
    ts.className = "tx-time";
    ts.textContent = time;
    wrap.appendChild(label);
    wrap.appendChild(contentEl);
    wrap.appendChild(cursor);
    wrap.appendChild(document.createTextNode(" "));
    wrap.appendChild(ts);
    transcriptEl.appendChild(wrap);
    state.caraStreamBubble = {
      wrap,
      contentEl,
      cursor,
      renderScheduled: false,
    };
    state.caraStreamText = "";
  }

  state.caraStreamText += fragment;

  // Schedule a single render for the next animation frame. If multiple
  // fragments arrive before that frame fires, they all get folded into
  // the same render — nothing is skipped, it's just batched.
  const bubble = state.caraStreamBubble;
  if (!bubble.renderScheduled) {
    bubble.renderScheduled = true;
    requestAnimationFrame(() => {
      renderStreamingContent(bubble.contentEl, state.caraStreamText);
      bubble.renderScheduled = false;
      scrollTranscript();
    });
  }
}

// Renders the live (in-progress) streaming text into contentEl.
// Pulled out of appendToCaraStream so it can be called once per frame
// regardless of how many fragments arrived in that frame.
function renderStreamingContent(contentEl, fullText) {
  const openFences = (fullText.match(/```/g) || []).length;

  if (openFences % 2 === 1) {
    // Inside an open code fence — show live code preview
    contentEl.innerHTML = "";
    const fenceStart = fullText.lastIndexOf("```");
    const beforeCode = fullText.slice(0, fenceStart).trim();
    if (beforeCode) {
      renderTextBlock(contentEl, beforeCode);
    }
    const liveWrap = document.createElement("div");
    liveWrap.className = "tx-code-wrap";
    const liveHeader = document.createElement("div");
    liveHeader.className = "tx-code-header";
    liveHeader.textContent = "writing code…";
    const livePre = document.createElement("div");
    livePre.className = "tx-code-live";
    livePre.textContent = fullText.slice(fenceStart + 3).replace(/^\w*\n/, "");
    liveWrap.appendChild(liveHeader);
    liveWrap.appendChild(livePre);
    contentEl.appendChild(liveWrap);
  } else {
    // All fences closed — render with highlighting
    renderSegments(contentEl, parseSegments(fullText));
  }
}

// Finalise — apply full syntax highlighting, remove cursor
function finaliseCaraStream(finalText) {
  if (!state.caraStreamBubble) return;
  const { contentEl, cursor } = state.caraStreamBubble;
  const text =
    finalText && finalText.trim() ? finalText.trim() : state.caraStreamText;
  const entry =
    state.conversationLog.findLast &&
    state.conversationLog.findLast((e) => e.role === "mentor" && !e.final);
  if (entry) {
    entry.text = text;
    entry.final = true;
  }
  saveHistory();
  // Mark as no longer scheduled so any in-flight requestAnimationFrame
  // callback becomes a no-op against stale state (state.caraStreamBubble
  // is about to be nulled below, so renderStreamingContent's frame, if it
  // still fires, simply has nothing to act on).
  state.caraStreamBubble.renderScheduled = false;
  renderSegments(contentEl, parseSegments(text));
  if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
  state.caraStreamBubble = null;
  state.caraStreamText = "";
}

function scrollTranscript() {
  transcriptEl.scrollTop = transcriptEl.scrollHeight;
}

// ── Copy transcript ───────────────────────────────────────────────
function copyTranscript() {
  // Build from conversationLog — guaranteed to have all finalised turns
  const lines = state.conversationLog
    .filter((e) => e.text.trim())
    .map((e) => {
      const label = e.role === "mentor" ? "Mentor (VA)" : "Student";
      return `${label}: "${e.text.trim()}"\n[${e.time}]`;
    });

  if (lines.length === 0) {
    copyBtn.textContent = "Nothing to copy yet";
    setTimeout(() => {
      copyBtn.textContent = "📋 Copy Transcript";
    }, 2000);
    return;
  }

  const header = `AI Mentor — Conversation Transcript\nSession: ${new Date().toLocaleString()}\n${"─".repeat(60)}`;
  const full = header + "\n\n" + lines.join("\n\n");

  navigator.clipboard
    .writeText(full)
    .then(() => flashCopyBtn("✓ Copied!"))
    .catch(() => {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = full;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      flashCopyBtn("✓ Copied!");
    });
}

function flashCopyBtn(msg) {
  const orig = copyBtn.textContent;
  copyBtn.textContent = msg;
  copyBtn.style.color = "var(--success)";
  copyBtn.style.borderColor = "var(--success)";
  setTimeout(() => {
    copyBtn.textContent = orig;
    copyBtn.style.color = "";
    copyBtn.style.borderColor = "";
  }, 2000);
}

// ── Download transcript as PDF ───────────────────────────────────
// Reuses the exact same data source as copyTranscript (conversationLog),
// so the PDF always matches what Copy Transcript would produce — no
// separate/duplicate source of truth to drift out of sync.
// silent=true is used when this is triggered automatically on session
// end, so it doesn't show "Nothing to copy yet" flashes to the student
// if there happens to be no content.
function downloadTranscriptPDF(silent = false) {
  const lines = state.conversationLog.filter((e) => e.text.trim());

  if (lines.length === 0) {
    if (!silent) flashPdfBtn("Nothing to download yet");
    return;
  }

  if (!window.jspdf || !window.jspdf.jsPDF) {
    console.error("jsPDF library not loaded — cannot generate PDF.");
    if (!silent) flashPdfBtn("PDF unavailable");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  const addPageIfNeeded = (neededHeight) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // ── Title block ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("AI Mentor — Conversation Transcript", margin, y);
  y += 22;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 110);
  doc.text(`Session: ${new Date().toLocaleString()}`, margin, y);
  y += 10;
  if (state.accessCode) {
    doc.text(`Access Code: ${state.accessCode}`, margin, y);
    y += 10;
  }
  y += 6;
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  // ── Each turn ──
  lines.forEach((entry) => {
    const label = entry.role === "mentor" ? "Mentor (VA)" : "Student";
    const labelColor =
      entry.role === "mentor" ? [124, 109, 250] : [52, 211, 153];

    addPageIfNeeded(28);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...labelColor);
    doc.text(`${label}`, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text(`${entry.time}`, pageWidth - margin, y, { align: "right" });
    y += 16;

    // Strip code fences for the PDF — render code in monospace inline
    // so step-by-step instructions and code stay readable on paper
    // without trying to replicate syntax highlighting.
    const segments = splitTextAndCode(entry.text.trim());

    segments.forEach((seg) => {
      if (seg.type === "code") {
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        doc.setTextColor(40, 40, 40);
        const codeLines = doc.splitTextToSize(seg.content, maxWidth - 16);
        const blockHeight = codeLines.length * 11 + 12;
        addPageIfNeeded(blockHeight);
        doc.setFillColor(245, 245, 248);
        doc.rect(margin, y - 9, maxWidth, blockHeight, "F");
        let codeY = y + 4;
        codeLines.forEach((line) => {
          addPageIfNeeded(11);
          doc.text(line, margin + 8, codeY);
          codeY += 11;
        });
        y = codeY + 6;
      } else {
        const blocks = splitIntoBlocks(seg.content);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        doc.setTextColor(30, 30, 30);

        blocks.forEach((block) => {
          if (block.kind === "list") {
            block.items.forEach((item, idx) => {
              const bulletPrefix = block.ordered ? `${idx + 1}. ` : "• ";
              const wrapped = doc.splitTextToSize(
                bulletPrefix + item,
                maxWidth - 12,
              );
              wrapped.forEach((line, lineIdx) => {
                addPageIfNeeded(14);
                doc.text(line, margin + 10, y);
                y += 14;
              });
            });
            y += 2;
          } else {
            const wrapped = doc.splitTextToSize(block.text, maxWidth);
            wrapped.forEach((line) => {
              addPageIfNeeded(14);
              doc.text(line, margin, y);
              y += 14;
            });
            y += 4;
          }
        });
      }
    });

    y += 10;
    addPageIfNeeded(1);
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y - 6, pageWidth - margin, y - 6);
  });

  const filename = `AI-Mentor-Transcript-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
  if (!silent) flashPdfBtn("✓ Downloaded!");
}

// Splits raw text into {type:"text"|"code", content} segments, same fence
// syntax as parseSegments but kept separate since the PDF renderer needs
// plain content strings rather than DOM nodes.
function splitTextAndCode(raw) {
  const segments = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0,
    match;
  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex)
      segments.push({
        type: "text",
        content: raw.slice(lastIndex, match.index),
      });
    segments.push({ type: "code", content: match[2] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < raw.length)
    segments.push({ type: "text", content: raw.slice(lastIndex) });
  return segments;
}

function flashPdfBtn(msg) {
  const orig = pdfBtn.textContent;
  pdfBtn.textContent = msg;
  pdfBtn.style.color = "var(--success)";
  pdfBtn.style.borderColor = "var(--success)";
  setTimeout(() => {
    pdfBtn.textContent = orig;
    pdfBtn.style.color = "";
    pdfBtn.style.borderColor = "";
  }, 2000);
}

// ── Helpers ───────────────────────────────────────────────────────
function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML;
}
function timestamp() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function setConnectionStatus(status) {
  const map = {
    connected: { text: "Connected", cls: "connected" },
    connecting: { text: "Connecting…", cls: "connecting" },
    disconnected: { text: "Disconnected", cls: "" },
  };
  const s = map[status];
  if (s) {
    statusText.textContent = s.text;
    statusDot.className = `status-dot ${s.cls}`;
  }
}
function setControlsEnabled(enabled) {
  [micBtn, sendBtn, messageInput].forEach((el) => {
    if (el) el.disabled = !enabled;
  });
  connectBtn.disabled = enabled;
  disconnectBtn.disabled = !enabled;
}
function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m} minutes`;
}

// ── Session End ───────────────────────────────────────────────────
async function expireSession() {
  clearInterval(state.timerInterval);
  await endSession("expired");
  expiredOverlay.classList.remove("hidden");
}

async function endSession(reason) {
  clearInterval(state.timerInterval);
  finaliseCaraStream();
  if (state.anamClient) {
    state.anamClient.stopStreaming();
    state.anamClient = null;
  }
  // Auto-download the transcript as PDF the moment the session truly ends
  // (manual end button, timer expiry, or tab close) — but NOT on a simple
  // disconnect, since the student may reconnect and isn't actually done.
  // Must happen before clearHistory() below, since that wipes the data
  // this reads from.
  downloadTranscriptPDF(true);
  // Capture the conversation BEFORE clearHistory() wipes it, so the
  // summary request below still has something to send.
  const finishedConversation = [...state.conversationLog];
  // Clear session memory only when session truly ends, not on disconnect
  clearHistory();
  if (!state.sessionToken) return;
  try {
    await fetch("/api/codes/end-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_token: state.sessionToken,
        duration_used: state.secondsUsed,
        ended_reason: reason,
      }),
    });
  } catch (err) {
    console.error("Failed to track session end:", err);
  }
  // Generate and store a short topic + 2-sentence summary for analytics
  // ("what are students asking about most"). This is awaited with a hard
  // timeout cap rather than fired-and-forgotten: a plain fire-and-forget
  // fetch() immediately followed by location.reload() below is a real
  // race condition — page reloads can and do abort in-flight requests
  // before the browser finishes sending them, which silently drops the
  // summary. Capping at 3s keeps the student from waiting on a slow LLM
  // call while still giving the request a genuine chance to complete.
  if (finishedConversation.length > 0) {
    await sendSessionSummaryWithTimeout(finishedConversation, 3000);
  }
  if (reason === "manual") location.reload();
}

function sendSessionSummaryWithTimeout(conversationLog, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return fetch("/api/session-summary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionToken: state.sessionToken || null,
      accessCode: state.accessCode || null,
      conversationLog,
    }),
    signal: controller.signal,
  })
    .then(() => {
      clearTimeout(timer);
    })
    .catch((err) => {
      clearTimeout(timer);
      // Timeout or network failure — log it, but never let this block
      // or break the session-end flow that follows.
      console.error("Session summary request failed or timed out:", err);
    });
}

window.addEventListener("beforeunload", () => {
  if (state.anamClient) state.anamClient.stopStreaming();
});

init();

// // ── State ────────────────────────────────────────────────────────
// const state = {
//   sessionToken: null,
//   durationSeconds: 0,
//   secondsUsed: 0,
//   timerInterval: null,
//   anamClient: null,
//   isConnected: false,
//   isMicOn: false,
//   accessCode: null,
//   // Transcript
//   caraStreamBubble: null,
//   caraStreamText: "",
//   conversationLog: [], // also mirrored to sessionStorage for reconnect memory
//   isReconnecting: false, // true when reconnecting mid-session (not first connect)
//   // Student activity detection
//   studentTyping: false,
//   studentSpeaking: false,
//   typingTimer: null, // debounce — clears "typing" state after pause
// };

// // ── DOM ──────────────────────────────────────────────────────────
// const codeEntryScreen = document.getElementById("code-entry-screen");
// const appScreen = document.getElementById("app-screen");
// const codeInput = document.getElementById("access-code-input");
// const submitCodeBtn = document.getElementById("submit-code-btn");
// const codeError = document.getElementById("code-error");
// const connectBtn = document.getElementById("connect-btn");
// const disconnectBtn = document.getElementById("disconnect-btn");
// const micBtn = document.getElementById("mic-btn");
// const sendBtn = document.getElementById("send-btn");
// const messageInput = document.getElementById("message-input");
// const transcriptEl = document.getElementById("transcript");
// const copyBtn = document.getElementById("copy-btn");
// const pdfBtn = document.getElementById("pdf-btn");
// const statusDot = document.getElementById("status-dot");
// const statusText = document.getElementById("status-text");
// const micStatus = document.getElementById("mic-status");
// const timerDisplay = document.getElementById("timer-display");
// const endSessionBtn = document.getElementById("end-session-btn");
// const restartBtn = document.getElementById("restart-btn");
// const expiredOverlay = document.getElementById("expired-overlay");
// const anamVideo = document.getElementById("anam-video");
// const avatarPlaceholder = document.getElementById("avatar-placeholder");

// // ── Init ─────────────────────────────────────────────────────────
// function init() {
//   codeInput.addEventListener("input", formatCodeInput);
//   codeInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") validateCode();
//   });
//   submitCodeBtn.addEventListener("click", validateCode);
//   connectBtn.addEventListener("click", connect);
//   disconnectBtn.addEventListener("click", disconnect);
//   micBtn.addEventListener("click", toggleMicrophone);
//   sendBtn.addEventListener("click", sendTextMessage);
//   messageInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") sendTextMessage();
//   });
//   // Detect typing — pause Pablo's output while student is composing
//   messageInput.addEventListener("input", onStudentTyping);
//   messageInput.addEventListener("blur", onStudentStoppedTyping);
//   // Soft privacy nudge whenever the student pastes text into the box
//   messageInput.addEventListener("paste", onMessageInputPaste);
//   endSessionBtn.addEventListener("click", () => endSession("manual"));
//   restartBtn.addEventListener("click", () => location.reload());
//   copyBtn.addEventListener("click", copyTranscript);
//   pdfBtn.addEventListener("click", () => downloadTranscriptPDF());

//   // Theme toggle
//   const themeToggle = document.getElementById("theme-toggle");
//   if (themeToggle) {
//     // Restore saved preference
//     const saved = localStorage.getItem("pablo_theme");
//     if (saved === "light") applyTheme("light");
//     themeToggle.addEventListener("click", () => {
//       const isLight = document.documentElement.dataset.theme === "light";
//       applyTheme(isLight ? "dark" : "light");
//     });
//   }
// }

// function applyTheme(mode) {
//   document.documentElement.dataset.theme = mode;
//   localStorage.setItem("pablo_theme", mode);
//   const btn = document.getElementById("theme-toggle");
//   if (btn) btn.textContent = mode === "light" ? "🌙 Dark" : "☀️ Light";
// }

// // ── Session memory helpers ───────────────────────────────────────
// function saveHistory() {
//   try {
//     sessionStorage.setItem(
//       "pablo_history",
//       JSON.stringify(
//         state.conversationLog.filter((e) => e.final && e.text.trim()),
//       ),
//     );
//   } catch (e) {}
// }

// function loadHistory() {
//   try {
//     const raw = sessionStorage.getItem("pablo_history");
//     return raw ? JSON.parse(raw) : [];
//   } catch (e) {
//     return [];
//   }
// }

// function clearHistory() {
//   try {
//     sessionStorage.removeItem("pablo_history");
//   } catch (e) {}
// }

// function formatCodeInput() {
//   let v = codeInput.value.toUpperCase().replace(/[^A-Z0-9\-]/g, "");
//   if (v.length >= 2 && !v.includes("-")) v = v.slice(0, 2) + "-" + v.slice(2);
//   codeInput.value = v.slice(0, 8);
// }

// // ── Validate Code ─────────────────────────────────────────────────
// async function validateCode() {
//   let rawCode = codeInput.value.trim();
//   codeError.textContent = "";
//   if (!rawCode || rawCode.length < 7) {
//     codeError.textContent = "Please enter a valid code (e.g. AT-X7K9P)";
//     return;
//   }
//   let cleanCode = rawCode.toUpperCase();
//   if (!cleanCode.startsWith("AT-"))
//     cleanCode = "AT-" + cleanCode.replace(/^AT-?/i, "");

//   submitCodeBtn.disabled = true;
//   submitCodeBtn.textContent = "Verifying…";
//   try {
//     const res = await fetch("/api/codes/validate", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ code: cleanCode }),
//     });
//     const data = await res.json();
//     if (!res.ok) {
//       codeError.textContent = data.error || "Invalid or expired code.";
//       submitCodeBtn.disabled = false;
//       submitCodeBtn.textContent = "Start Session";
//       return;
//     }
//     state.sessionToken = data.session_token;
//     state.durationSeconds = data.duration_seconds;
//     state.accessCode = cleanCode;
//     codeEntryScreen.classList.add("hidden");
//     appScreen.classList.remove("hidden");
//     // Load any history saved from a previous connection in this session
//     state.conversationLog = loadHistory();
//     startTimer();
//     addSystemNote(
//       `Session started — ${formatDuration(state.durationSeconds)} available. Click "Connect to Mentor" to begin.`,
//     );
//   } catch (err) {
//     codeError.textContent = "Network error. Please try again.";
//     submitCodeBtn.disabled = false;
//     submitCodeBtn.textContent = "Start Session";
//   }
// }

// // ── Timer ─────────────────────────────────────────────────────────
// function startTimer() {
//   updateTimerDisplay();
//   state.timerInterval = setInterval(() => {
//     state.secondsUsed++;
//     updateTimerDisplay();
//     if (state.secondsUsed >= state.durationSeconds) expireSession();
//   }, 1000);
// }

// function updateTimerDisplay() {
//   const remaining = Math.max(0, state.durationSeconds - state.secondsUsed);
//   const mins = Math.floor(remaining / 60);
//   const secs = remaining % 60;
//   timerDisplay.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
//   timerDisplay.classList.toggle("urgent", remaining < 60);
//   if (remaining === 10) addSystemNote("⚠️ 10 seconds remaining");
// }

// // ── Connect ───────────────────────────────────────────────────────
// async function connect() {
//   if (!state.sessionToken) {
//     addSystemNote("❌ No session token. Please restart.");
//     return;
//   }
//   setConnectionStatus("connecting");
//   connectBtn.disabled = true;
//   addSystemNote("Connecting to Mentor…");

//   try {
//     // If we have prior conversation history, send it so Pablo can continue the context
//     const history = state.conversationLog.filter(
//       (e) => e.final && e.text.trim(),
//     );
//     state.isReconnecting = history.length > 0;

//     // ── Speech pace from localStorage ──────────────────
//     const savedPace = localStorage.getItem("pablo_speech_pace") || "normal";
//     const speechPace = ["slow", "normal", "fast"].includes(savedPace)
//       ? savedPace
//       : "normal";

//     // ── Student sentiment hint, computed from recent message history ──
//     // Coarse client-side heuristic only — not a clinical or diagnostic
//     // judgement. Gives Pablo a head start if reconnecting mid-struggle;
//     // his real-time empathetic adaptation comes from reading tone in the
//     // live conversation directly (see EMOTIONAL INTELLIGENCE in the
//     // system prompt), this is just a hint for the moment of reconnect.
//     const studentSentimentHint = computeSentimentHint(history);

//     const tokenRes = await fetch("/api/anam/token", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         conversationHistory: history,
//         speechPace: speechPace,
//         studentSentimentHint: studentSentimentHint,
//       }),
//     });

//     const tokenData = await tokenRes.json();
//     if (tokenData.demo_mode || !tokenData.session_token) {
//       addSystemNote("⚠️ ANAM_API_KEY not configured on server.");
//       state.isConnected = true;
//       setConnectionStatus("connected");
//       setControlsEnabled(true);
//       return;
//     }

//     // Wait for SDK (loaded via <script type="module"> in HTML)
//     await new Promise((resolve, reject) => {
//       if (window.anamCreateClient) return resolve();
//       const t = setTimeout(
//         () => reject(new Error("Anam SDK timed out")),
//         15000,
//       );
//       window.addEventListener(
//         "anam-sdk-ready",
//         () => {
//           clearTimeout(t);
//           resolve();
//         },
//         { once: true },
//       );
//     });

//     // Create client — do NOT call getUserMedia before this.
//     // The SDK handles mic permission internally; pre-grabbing the stream breaks it.
//     state.anamClient = window.anamCreateClient(tokenData.session_token);

//     // ── Mic permission events ──────────────────────────────────
//     state.anamClient.addListener("MIC_PERMISSION_PENDING", () => {
//       addSystemNote("🎤 Requesting microphone permission…");
//     });
//     state.anamClient.addListener("MIC_PERMISSION_GRANTED", () => {
//       state.isMicOn = true;
//       micBtn.classList.add("active");
//       micBtn.textContent = "🔇 Mute Mic";
//       micStatus.textContent = "Microphone: active — Mentor can hear you";
//       addSystemNote("✓ Microphone granted — Mentor can hear you.");
//     });
//     state.anamClient.addListener("MIC_PERMISSION_DENIED", (err) => {
//       addSystemNote(
//         "❌ Microphone denied. Open browser settings and allow mic, then reconnect.",
//       );
//       micStatus.textContent = "Microphone: permission denied";
//     });

//     // ── Connection events ──────────────────────────────────────
//     state.anamClient.addListener("CONNECTION_ESTABLISHED", () => {
//       addSystemNote("✓ Connected to Mentor.");
//     });
//     state.anamClient.addListener("SESSION_READY", () => {
//       addSystemNote("✓ Mentor is ready — start speaking!");
//     });
//     state.anamClient.addListener("CONNECTION_CLOSED", () => {
//       finaliseCaraStream();
//       setConnectionStatus("disconnected");
//       setControlsEnabled(false);
//       connectBtn.disabled = false;
//       micBtn.textContent = "🎤 Microphone";
//       micBtn.classList.remove("active");
//       micStatus.textContent = "Microphone: off";
//       state.isConnected = false;
//       state.isMicOn = false;
//       addSystemNote("Connection closed.");
//     });

//     // ── User speech events ─────────────────────────────────────
//     state.anamClient.addListener("USER_SPEECH_STARTED", () => {
//       onStudentSpeaking();
//     });
//     state.anamClient.addListener("USER_SPEECH_ENDED", () => {
//       onStudentFinishedSpeaking();
//     });

//     // ── Transcript: streaming (word-by-word APPEND) ────────────
//     // MESSAGE_STREAM_EVENT_RECEIVED sends INCREMENTAL new words, not full text.
//     // role = "persona" while Cara speaks; role = "user" when user turn finalises.
//     state.anamClient.addListener("MESSAGE_STREAM_EVENT_RECEIVED", (event) => {
//       if (event.role === "persona") {
//         // Append new word fragment to the live Pablo bubble
//         appendToCaraStream(event.content);
//       } else if (event.role === "user") {
//         // User's recognised speech — show as a user bubble
//         finaliseCaraStream();
//         addUserBubble(event.content, true);
//       }
//     });

//     // MESSAGE_HISTORY_UPDATED fires after each full turn.
//     // Use it to correct/finalise Pablo's bubble with the clean final text.
//     state.anamClient.addListener("MESSAGE_HISTORY_UPDATED", (messages) => {
//       const lastAssistant = [...messages]
//         .reverse()
//         .find((m) => m.role === "assistant");
//       const lastUser = [...messages].reverse().find((m) => m.role === "user");

//       if (lastAssistant) {
//         finaliseCaraStream(lastAssistant.content);
//         // Update conversation log with clean final text
//         const existing = state.conversationLog.findLast?.(
//           (e) => e.role === "mentor",
//         );
//         if (existing && !existing.final) {
//           existing.text = lastAssistant.content;
//           existing.final = true;
//         }
//       }
//       if (lastUser) {
//         // Make sure the user bubble is in the log (stream event may have already added it)
//         const lastLogUser = state.conversationLog.findLast?.(
//           (e) => e.role === "user",
//         );
//         if (!lastLogUser || lastLogUser.text !== lastUser.content) {
//           addUserBubble(lastUser.content, false); // false = don't duplicate DOM if already there
//         }
//         // Update log entry to final
//         const logEntry = state.conversationLog.findLast?.(
//           (e) => e.role === "user",
//         );
//         if (logEntry) {
//           logEntry.text = lastUser.content;
//           logEntry.final = true;
//         }
//       }
//     });

//     // ── Start streaming ────────────────────────────────────────
//     await state.anamClient.streamToVideoElement("anam-video");

//     anamVideo.style.display = "block";
//     avatarPlaceholder.style.display = "none";
//     state.isConnected = true;
//     setConnectionStatus("connected");
//     setControlsEnabled(true);
//     if (state.isReconnecting) {
//       addSystemNote(
//         "↩️ Reconnected — Mentor remembers your conversation and will continue where you left off.",
//       );
//     }
//   } catch (err) {
//     console.error("Connection error:", err);
//     setConnectionStatus("disconnected");
//     connectBtn.disabled = false;
//     addSystemNote(`❌ Connection failed: ${err.message}`);
//   }
// }

// // ── Disconnect ────────────────────────────────────────────────────
// function disconnect() {
//   finaliseCaraStream();
//   if (state.anamClient) {
//     state.anamClient.stopStreaming();
//     state.anamClient = null;
//   }
//   anamVideo.srcObject = null;
//   anamVideo.style.display = "none";
//   avatarPlaceholder.style.display = "flex";
//   state.isConnected = false;
//   state.isMicOn = false;
//   setConnectionStatus("disconnected");
//   setControlsEnabled(false);
//   connectBtn.disabled = false;
//   micBtn.classList.remove("active");
//   micBtn.textContent = "🎤 Microphone";
//   micStatus.textContent = "Microphone: off";
//   addSystemNote("Disconnected.");
// }

// // ── Student activity detection ───────────────────────────────────
// // When student types, mute the MIC INPUT so the SDK silence detector
// // doesn't think the student has gone quiet and trigger Pablo to speak.
// // We also mute Pablo's output so he doesn't talk over the typing.
// function onStudentTyping() {
//   if (!state.isConnected || !state.anamClient) return;
//   if (!state.studentTyping) {
//     state.studentTyping = true;
//     // Mute mic input — stops SDK silence detector from firing
//     state.anamClient.muteInputAudio?.();
//     // Also mute Pablo's output so he doesn't interrupt
//     state.anamClient.muteOutputAudio?.();
//     setStudentActivityIndicator("typing");
//   }
//   // Debounce — if student stops typing for 2.5s, release
//   clearTimeout(state.typingTimer);
//   state.typingTimer = setTimeout(onStudentStoppedTyping, 2500);
// }

// function onStudentStoppedTyping() {
//   if (!state.studentTyping) return;
//   state.studentTyping = false;
//   clearTimeout(state.typingTimer);
//   if (!state.studentSpeaking) {
//     // Restore mic input so Pablo can hear again
//     state.anamClient?.unmuteInputAudio?.();
//     state.anamClient?.unmuteOutputAudio?.();
//     setStudentActivityIndicator(null);
//     // Sync mic button state
//     if (state.isMicOn) {
//       micStatus.textContent = "Microphone: active — Mentor can hear you";
//     }
//   }
// }

// // Soft, non-blocking privacy reminder shown whenever the student pastes
// // text into the message box. This does NOT block, alter, or inspect the
// // pasted content in any way — it only shows a brief heads-up, since real
// // personal data (names, emails, IDs) is something students sometimes
// // paste in without thinking when copying an error message or assignment
// // text that happens to include their own details.
// let pasteWarningTimer = null;
// function onMessageInputPaste() {
//   const banner = document.getElementById("paste-warning");
//   if (!banner) return;
//   banner.classList.remove("hidden");
//   // Restart the dismiss timer on every paste rather than stacking timers
//   clearTimeout(pasteWarningTimer);
//   pasteWarningTimer = setTimeout(() => {
//     banner.classList.add("hidden");
//   }, 6000);
// }

// // Called by USER_SPEECH_STARTED SDK event
// function onStudentSpeaking() {
//   state.studentSpeaking = true;
//   // Don't mute input — the student IS speaking, SDK should hear them
//   // Mute Pablo's output so he doesn't talk over the student
//   state.anamClient?.muteOutputAudio?.();
//   micStatus.textContent = "🎤 Listening…";
//   setStudentActivityIndicator("speaking");
// }

// // Called by USER_SPEECH_ENDED SDK event
// function onStudentFinishedSpeaking() {
//   state.studentSpeaking = false;
//   micStatus.textContent = "Microphone: active — Mentor can hear you";
//   if (!state.studentTyping) {
//     state.anamClient?.unmuteOutputAudio?.();
//     setStudentActivityIndicator(null);
//   }
// }

// // Shows/hides the "student is responding" indicator in the transcript
// function setStudentActivityIndicator(mode) {
//   let el = document.getElementById("student-activity-indicator");
//   if (!mode) {
//     if (el) el.remove();
//     return;
//   }
//   if (!el) {
//     el = document.createElement("div");
//     el.id = "student-activity-indicator";
//     el.className = "tx-system tx-activity";
//     transcriptEl.appendChild(el);
//   }
//   el.textContent =
//     mode === "typing"
//       ? "✏️  Student is typing a response…"
//       : "🎤  Student is speaking…";
//   scrollTranscript();
// }

// // ── Microphone toggle ─────────────────────────────────────────────
// function toggleMicrophone() {
//   if (!state.isConnected || !state.anamClient) {
//     addSystemNote("Connect to Mentor first.");
//     return;
//   }
//   if (state.isMicOn) {
//     state.anamClient.muteInputAudio();
//     state.isMicOn = false;
//     micBtn.classList.remove("active");
//     micBtn.textContent = "🎤 Unmute Mic";
//     micStatus.textContent = "Microphone: muted";
//     addSystemNote("🔇 Microphone muted — Mentor cannot hear you.");
//   } else {
//     state.anamClient.unmuteInputAudio();
//     state.isMicOn = true;
//     micBtn.classList.add("active");
//     micBtn.textContent = "🔇 Mute Mic";
//     micStatus.textContent = "Microphone: active — Mentor can hear you";
//     addSystemNote("🎤 Microphone active — Mentor can hear you.");
//   }
// }

// // ── Text message ──────────────────────────────────────────────────
// function sendTextMessage() {
//   const message = messageInput.value.trim();
//   if (!message || !state.isConnected) return;
//   // Force-close any still-open Mentor response bubble before adding the
//   // student's message. The voice path does this automatically because
//   // Anam fires MESSAGE_STREAM_EVENT_RECEIVED with role:"user" the moment
//   // speech is detected, which finalises the previous bubble synchronously.
//   // Typed messages have no equivalent signal — MESSAGE_HISTORY_UPDATED
//   // for the prior turn isn't guaranteed to have arrived yet, so without
//   // this the next reply's fragments silently append into the still-open
//   // bubble from the previous turn instead of starting a new one.
//   finaliseCaraStream();
//   addUserBubble(message, true);
//   if (state.anamClient?.sendUserMessage)
//     state.anamClient.sendUserMessage(message);
//   messageInput.value = "";
// }

// // ── Sentiment hint (coarse heuristic, not a diagnosis) ─────────────
// // Scans the student's most recent messages for plain-text signals of
// // frustration/discouragement or confidence/momentum. This is a lightweight
// // pattern match — not sentiment-analysis ML, not a clinical assessment —
// // it exists only to give Pablo's empathetic response a head start on
// // reconnect. The live, real-time tone reading happens inside the LLM
// // itself via the EMOTIONAL INTELLIGENCE section of the system prompt.
// function computeSentimentHint(history) {
//   const studentMessages = history
//     .filter((e) => e.role === "user")
//     .slice(-5) // only look at the most recent few messages
//     .map((e) => e.text.toLowerCase());

//   if (studentMessages.length === 0) return "neutral";

//   const struggleSignals = [
//     "i don't know",
//     "i dont know",
//     "i give up",
//     "this is too hard",
//     "i'm stuck",
//     "im stuck",
//     "i can't",
//     "i cant",
//     "confused",
//     "frustrated",
//     "this isn't working",
//     "this is not working",
//     "still doesn't work",
//     "still not working",
//     "i don't understand",
//     "i dont understand",
//     "lost",
//     "no idea",
//   ];

//   const confidenceSignals = [
//     "got it",
//     "that makes sense",
//     "i understand",
//     "it works",
//     "that worked",
//     "thank you",
//     "thanks",
//     "great",
//     "perfect",
//     "makes sense now",
//     "i see",
//   ];

//   let struggleScore = 0;
//   let confidenceScore = 0;
//   let shortTerseCount = 0;

//   for (const msg of studentMessages) {
//     const trimmed = msg.trim();
//     if (struggleSignals.some((signal) => trimmed.includes(signal))) {
//       struggleScore++;
//     }
//     if (confidenceSignals.some((signal) => trimmed.includes(signal))) {
//       confidenceScore++;
//     }
//     // Very short replies (one or two words) repeated across several
//     // messages can indicate disengagement or frustration, especially
//     // after the mentor has just explained something at length.
//     const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
//     if (wordCount > 0 && wordCount <= 2) shortTerseCount++;
//   }

//   // Several short terse replies in a row is itself a mild struggle signal,
//   // even without an explicit phrase like "I don't know".
//   if (shortTerseCount >= 3) struggleScore += 1;

//   if (struggleScore >= 2 && struggleScore > confidenceScore) return "struggling";
//   if (confidenceScore >= 2 && confidenceScore > struggleScore) return "confident";
//   return "neutral";
// }

// // ── Transcript helpers ────────────────────────────────────────────

// function addSystemNote(text) {
//   const div = document.createElement("div");
//   div.className = "tx-system";
//   div.textContent = text;
//   transcriptEl.appendChild(div);
//   scrollTranscript();
// }

// function addUserBubble(text, addToDOM = true) {
//   if (!text || !text.trim()) return;
//   const t = text.trim();
//   const time = timestamp();
//   state.conversationLog.push({ role: "user", text: t, time, final: true });
//   saveHistory();
//   if (!addToDOM) return;
//   const wrap = document.createElement("div");
//   wrap.className = "tx-row tx-user";
//   // Label bold + coloured, then quoted speech inline, then faint timestamp
//   const label = document.createElement("span");
//   label.className = "tx-label";
//   label.textContent = "Student: ";
//   const bubble = document.createElement("span");
//   bubble.className = "tx-bubble";
//   bubble.textContent = "“" + t + "”";
//   const ts = document.createElement("span");
//   ts.className = "tx-time";
//   ts.textContent = time;
//   wrap.appendChild(label);
//   wrap.appendChild(bubble);
//   wrap.appendChild(document.createTextNode(" "));
//   wrap.appendChild(ts);
//   transcriptEl.appendChild(wrap);
//   scrollTranscript();
// }

// // ── Segment parser: splits Pablo's text into speech + code blocks ──
// function parseSegments(raw) {
//   const segments = [];
//   const regex = /```(\w*)\n?([\s\S]*?)```/g;
//   let lastIndex = 0,
//     match;
//   while ((match = regex.exec(raw)) !== null) {
//     if (match.index > lastIndex)
//       segments.push({
//         type: "text",
//         content: raw.slice(lastIndex, match.index),
//       });
//     segments.push({
//       type: "code",
//       lang: match[1] || "plaintext",
//       content: match[2],
//     });
//     lastIndex = regex.lastIndex;
//   }
//   if (lastIndex < raw.length)
//     segments.push({ type: "text", content: raw.slice(lastIndex) });
//   return segments;
// }

// // Detect bullet markers (•, -, *) or numbered list markers (1., 2.) at the
// // start of a line. Used to decide whether a paragraph should render as
// // a <ul>/<ol> instead of plain prose.
// const BULLET_LINE_RE = /^\s*([•\-\*]|\d+[.)])\s+(.*)$/;

// // Split raw text into paragraph-like blocks: a "list" block is one or more
// // consecutive bullet/numbered lines; a "prose" block is everything else,
// // split on blank lines so distinct paragraphs don't get glued together.
// function splitIntoBlocks(text) {
//   const lines = text.replace(/\r\n/g, "\n").split("\n");
//   const blocks = [];
//   let currentList = null;
//   let currentProse = [];

//   const flushProse = () => {
//     const joined = currentProse.join(" ").trim();
//     if (joined) blocks.push({ kind: "prose", text: joined });
//     currentProse = [];
//   };
//   const flushList = () => {
//     if (currentList && currentList.items.length) blocks.push(currentList);
//     currentList = null;
//   };

//   for (const rawLine of lines) {
//     const line = rawLine.trim();
//     const bulletMatch = line.match(BULLET_LINE_RE);

//     if (bulletMatch) {
//       flushProse();
//       const marker = bulletMatch[1];
//       const isOrdered = /^\d/.test(marker);
//       if (!currentList || currentList.ordered !== isOrdered) {
//         flushList();
//         currentList = { kind: "list", ordered: isOrdered, items: [] };
//       }
//       currentList.items.push(bulletMatch[2].trim());
//       continue;
//     }

//     if (!line) {
//       // Blank line — ends whatever block is open
//       flushList();
//       flushProse();
//       continue;
//     }

//     // Plain prose line — close any open list, accumulate into prose
//     flushList();
//     currentProse.push(line);
//   }
//   flushList();
//   flushProse();
//   return blocks;
// }

// // Render a block of text (prose + lists) into a parent element with
// // real DOM structure so bullets, numbered steps, and paragraph breaks
// // are visually distinct instead of collapsing into one line.
// function renderTextBlock(parent, text) {
//   const txt = text.trim();
//   if (!txt) return;
//   const blocks = splitIntoBlocks(txt);

//   blocks.forEach((block) => {
//     if (block.kind === "list") {
//       const listEl = document.createElement(block.ordered ? "ol" : "ul");
//       listEl.className = "tx-list";
//       block.items.forEach((item) => {
//         const li = document.createElement("li");
//         li.textContent = item;
//         listEl.appendChild(li);
//       });
//       parent.appendChild(listEl);
//     } else {
//       const p = document.createElement("p");
//       p.className = "tx-bubble-text";
//       p.textContent = block.text;
//       parent.appendChild(p);
//     }
//   });
// }

// // Render finalised segments with syntax highlighting
// function renderSegments(parent, segments) {
//   parent.innerHTML = "";
//   segments.forEach((seg) => {
//     if (seg.type === "text") {
//       renderTextBlock(parent, seg.content);
//     } else {
//       const wrap = document.createElement("div");
//       wrap.className = "tx-code-wrap";

//       const header = document.createElement("div");
//       header.className = "tx-code-header";
//       const langLabel = document.createElement("span");
//       langLabel.textContent = seg.lang || "code";
//       const copyBtn = document.createElement("button");
//       copyBtn.className = "tx-code-copy";
//       copyBtn.textContent = "Copy";
//       copyBtn.onclick = () => {
//         navigator.clipboard.writeText(seg.content).then(() => {
//           copyBtn.textContent = "Copied!";
//           setTimeout(() => {
//             copyBtn.textContent = "Copy";
//           }, 2000);
//         });
//       };
//       header.appendChild(langLabel);
//       header.appendChild(copyBtn);

//       const pre = document.createElement("pre");
//       const code = document.createElement("code");
//       code.className = seg.lang ? "language-" + seg.lang : "";
//       code.textContent = seg.content;
//       pre.appendChild(code);
//       wrap.appendChild(header);
//       wrap.appendChild(pre);
//       parent.appendChild(wrap);
//       if (window.hljs) window.hljs.highlightElement(code);
//     }
//   });
// }

// // APPEND incremental fragments — live code preview while fence is open.
// // Re-rendering is throttled to one paint per animation frame instead of
// // once per fragment: rebuilding the whole bubble (innerHTML = "") on every
// // single word can outpace the browser's paint cycle on longer responses,
// // which is what caused visible "skipping" — some intermediate renders were
// // simply never painted before being replaced by the next one.
// function appendToCaraStream(fragment) {
//   if (!fragment) return;
//   if (!state.caraStreamBubble) {
//     const time = timestamp();
//     state.conversationLog.push({
//       role: "mentor",
//       text: "Mentor(VA)",
//       time,
//       final: false,
//     });
//     const wrap = document.createElement("div");
//     wrap.className = "tx-row tx-cara";
//     const label = document.createElement("span");
//     label.className = "tx-label";
//     label.textContent = "Mentor (VA): ";
//     const contentEl = document.createElement("div");
//     contentEl.className = "tx-stream-content";
//     const cursor = document.createElement("span");
//     cursor.className = "tx-cursor";
//     cursor.textContent = "▮";
//     const ts = document.createElement("span");
//     ts.className = "tx-time";
//     ts.textContent = time;
//     wrap.appendChild(label);
//     wrap.appendChild(contentEl);
//     wrap.appendChild(cursor);
//     wrap.appendChild(document.createTextNode(" "));
//     wrap.appendChild(ts);
//     transcriptEl.appendChild(wrap);
//     state.caraStreamBubble = {
//       wrap,
//       contentEl,
//       cursor,
//       renderScheduled: false,
//     };
//     state.caraStreamText = "";
//   }

//   state.caraStreamText += fragment;

//   // Schedule a single render for the next animation frame. If multiple
//   // fragments arrive before that frame fires, they all get folded into
//   // the same render — nothing is skipped, it's just batched.
//   const bubble = state.caraStreamBubble;
//   if (!bubble.renderScheduled) {
//     bubble.renderScheduled = true;
//     requestAnimationFrame(() => {
//       renderStreamingContent(bubble.contentEl, state.caraStreamText);
//       bubble.renderScheduled = false;
//       scrollTranscript();
//     });
//   }
// }

// // Renders the live (in-progress) streaming text into contentEl.
// // Pulled out of appendToCaraStream so it can be called once per frame
// // regardless of how many fragments arrived in that frame.
// function renderStreamingContent(contentEl, fullText) {
//   const openFences = (fullText.match(/```/g) || []).length;

//   if (openFences % 2 === 1) {
//     // Inside an open code fence — show live code preview
//     contentEl.innerHTML = "";
//     const fenceStart = fullText.lastIndexOf("```");
//     const beforeCode = fullText.slice(0, fenceStart).trim();
//     if (beforeCode) {
//       renderTextBlock(contentEl, beforeCode);
//     }
//     const liveWrap = document.createElement("div");
//     liveWrap.className = "tx-code-wrap";
//     const liveHeader = document.createElement("div");
//     liveHeader.className = "tx-code-header";
//     liveHeader.textContent = "writing code…";
//     const livePre = document.createElement("div");
//     livePre.className = "tx-code-live";
//     livePre.textContent = fullText.slice(fenceStart + 3).replace(/^\w*\n/, "");
//     liveWrap.appendChild(liveHeader);
//     liveWrap.appendChild(livePre);
//     contentEl.appendChild(liveWrap);
//   } else {
//     // All fences closed — render with highlighting
//     renderSegments(contentEl, parseSegments(fullText));
//   }
// }

// // Finalise — apply full syntax highlighting, remove cursor
// function finaliseCaraStream(finalText) {
//   if (!state.caraStreamBubble) return;
//   const { contentEl, cursor } = state.caraStreamBubble;
//   const text =
//     finalText && finalText.trim() ? finalText.trim() : state.caraStreamText;
//   const entry =
//     state.conversationLog.findLast &&
//     state.conversationLog.findLast((e) => e.role === "mentor" && !e.final);
//   if (entry) {
//     entry.text = text;
//     entry.final = true;
//   }
//   saveHistory();
//   // Mark as no longer scheduled so any in-flight requestAnimationFrame
//   // callback becomes a no-op against stale state (state.caraStreamBubble
//   // is about to be nulled below, so renderStreamingContent's frame, if it
//   // still fires, simply has nothing to act on).
//   state.caraStreamBubble.renderScheduled = false;
//   renderSegments(contentEl, parseSegments(text));
//   if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
//   state.caraStreamBubble = null;
//   state.caraStreamText = "";
// }

// function scrollTranscript() {
//   transcriptEl.scrollTop = transcriptEl.scrollHeight;
// }

// // ── Copy transcript ───────────────────────────────────────────────
// function copyTranscript() {
//   // Build from conversationLog — guaranteed to have all finalised turns
//   const lines = state.conversationLog
//     .filter((e) => e.text.trim())
//     .map((e) => {
//       const label = e.role === "mentor" ? "Mentor (VA)" : "Student";
//       return `${label}: "${e.text.trim()}"\n[${e.time}]`;
//     });

//   if (lines.length === 0) {
//     copyBtn.textContent = "Nothing to copy yet";
//     setTimeout(() => {
//       copyBtn.textContent = "📋 Copy Transcript";
//     }, 2000);
//     return;
//   }

//   const header = `AI Mentor — Conversation Transcript\nSession: ${new Date().toLocaleString()}\n${"─".repeat(60)}`;
//   const full = header + "\n\n" + lines.join("\n\n");

//   navigator.clipboard
//     .writeText(full)
//     .then(() => flashCopyBtn("✓ Copied!"))
//     .catch(() => {
//       // Fallback
//       const ta = document.createElement("textarea");
//       ta.value = full;
//       ta.style.position = "fixed";
//       ta.style.opacity = "0";
//       document.body.appendChild(ta);
//       ta.select();
//       document.execCommand("copy");
//       document.body.removeChild(ta);
//       flashCopyBtn("✓ Copied!");
//     });
// }

// function flashCopyBtn(msg) {
//   const orig = copyBtn.textContent;
//   copyBtn.textContent = msg;
//   copyBtn.style.color = "var(--success)";
//   copyBtn.style.borderColor = "var(--success)";
//   setTimeout(() => {
//     copyBtn.textContent = orig;
//     copyBtn.style.color = "";
//     copyBtn.style.borderColor = "";
//   }, 2000);
// }

// // ── Download transcript as PDF ───────────────────────────────────
// // Reuses the exact same data source as copyTranscript (conversationLog),
// // so the PDF always matches what Copy Transcript would produce — no
// // separate/duplicate source of truth to drift out of sync.
// // silent=true is used when this is triggered automatically on session
// // end, so it doesn't show "Nothing to copy yet" flashes to the student
// // if there happens to be no content.
// function downloadTranscriptPDF(silent = false) {
//   const lines = state.conversationLog.filter((e) => e.text.trim());

//   if (lines.length === 0) {
//     if (!silent) flashPdfBtn("Nothing to download yet");
//     return;
//   }

//   if (!window.jspdf || !window.jspdf.jsPDF) {
//     console.error("jsPDF library not loaded — cannot generate PDF.");
//     if (!silent) flashPdfBtn("PDF unavailable");
//     return;
//   }

//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF({ unit: "pt", format: "a4" });

//   const pageWidth = doc.internal.pageSize.getWidth();
//   const pageHeight = doc.internal.pageSize.getHeight();
//   const margin = 48;
//   const maxWidth = pageWidth - margin * 2;
//   let y = margin;

//   const addPageIfNeeded = (neededHeight) => {
//     if (y + neededHeight > pageHeight - margin) {
//       doc.addPage();
//       y = margin;
//     }
//   };

//   // ── Title block ──
//   doc.setFont("helvetica", "bold");
//   doc.setFontSize(16);
//   doc.text("AI Mentor — Conversation Transcript", margin, y);
//   y += 22;

//   doc.setFont("helvetica", "normal");
//   doc.setFontSize(10);
//   doc.setTextColor(110, 110, 110);
//   doc.text(`Session: ${new Date().toLocaleString()}`, margin, y);
//   y += 10;
//   if (state.accessCode) {
//     doc.text(`Access Code: ${state.accessCode}`, margin, y);
//     y += 10;
//   }
//   y += 6;
//   doc.setDrawColor(200, 200, 200);
//   doc.line(margin, y, pageWidth - margin, y);
//   y += 20;

//   // ── Each turn ──
//   lines.forEach((entry) => {
//     const label = entry.role === "mentor" ? "Mentor (VA)" : "Student";
//     const labelColor =
//       entry.role === "mentor" ? [124, 109, 250] : [52, 211, 153];

//     addPageIfNeeded(28);

//     doc.setFont("helvetica", "bold");
//     doc.setFontSize(11);
//     doc.setTextColor(...labelColor);
//     doc.text(`${label}`, margin, y);

//     doc.setFont("helvetica", "normal");
//     doc.setFontSize(9);
//     doc.setTextColor(150, 150, 150);
//     doc.text(`${entry.time}`, pageWidth - margin, y, { align: "right" });
//     y += 16;

//     // Strip code fences for the PDF — render code in monospace inline
//     // so step-by-step instructions and code stay readable on paper
//     // without trying to replicate syntax highlighting.
//     const segments = splitTextAndCode(entry.text.trim());

//     segments.forEach((seg) => {
//       if (seg.type === "code") {
//         doc.setFont("courier", "normal");
//         doc.setFontSize(9);
//         doc.setTextColor(40, 40, 40);
//         const codeLines = doc.splitTextToSize(seg.content, maxWidth - 16);
//         const blockHeight = codeLines.length * 11 + 12;
//         addPageIfNeeded(blockHeight);
//         doc.setFillColor(245, 245, 248);
//         doc.rect(margin, y - 9, maxWidth, blockHeight, "F");
//         let codeY = y + 4;
//         codeLines.forEach((line) => {
//           addPageIfNeeded(11);
//           doc.text(line, margin + 8, codeY);
//           codeY += 11;
//         });
//         y = codeY + 6;
//       } else {
//         const blocks = splitIntoBlocks(seg.content);
//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(10.5);
//         doc.setTextColor(30, 30, 30);

//         blocks.forEach((block) => {
//           if (block.kind === "list") {
//             block.items.forEach((item, idx) => {
//               const bulletPrefix = block.ordered ? `${idx + 1}. ` : "• ";
//               const wrapped = doc.splitTextToSize(
//                 bulletPrefix + item,
//                 maxWidth - 12,
//               );
//               wrapped.forEach((line, lineIdx) => {
//                 addPageIfNeeded(14);
//                 doc.text(line, margin + 10, y);
//                 y += 14;
//               });
//             });
//             y += 2;
//           } else {
//             const wrapped = doc.splitTextToSize(block.text, maxWidth);
//             wrapped.forEach((line) => {
//               addPageIfNeeded(14);
//               doc.text(line, margin, y);
//               y += 14;
//             });
//             y += 4;
//           }
//         });
//       }
//     });

//     y += 10;
//     addPageIfNeeded(1);
//     doc.setDrawColor(230, 230, 230);
//     doc.line(margin, y - 6, pageWidth - margin, y - 6);
//   });

//   const filename = `AI-Mentor-Transcript-${new Date().toISOString().slice(0, 10)}.pdf`;
//   doc.save(filename);
//   if (!silent) flashPdfBtn("✓ Downloaded!");
// }

// // Splits raw text into {type:"text"|"code", content} segments, same fence
// // syntax as parseSegments but kept separate since the PDF renderer needs
// // plain content strings rather than DOM nodes.
// function splitTextAndCode(raw) {
//   const segments = [];
//   const regex = /```(\w*)\n?([\s\S]*?)```/g;
//   let lastIndex = 0,
//     match;
//   while ((match = regex.exec(raw)) !== null) {
//     if (match.index > lastIndex)
//       segments.push({ type: "text", content: raw.slice(lastIndex, match.index) });
//     segments.push({ type: "code", content: match[2] });
//     lastIndex = regex.lastIndex;
//   }
//   if (lastIndex < raw.length)
//     segments.push({ type: "text", content: raw.slice(lastIndex) });
//   return segments;
// }

// function flashPdfBtn(msg) {
//   const orig = pdfBtn.textContent;
//   pdfBtn.textContent = msg;
//   pdfBtn.style.color = "var(--success)";
//   pdfBtn.style.borderColor = "var(--success)";
//   setTimeout(() => {
//     pdfBtn.textContent = orig;
//     pdfBtn.style.color = "";
//     pdfBtn.style.borderColor = "";
//   }, 2000);
// }

// // ── Helpers ───────────────────────────────────────────────────────
// function escapeHtml(text) {
//   const d = document.createElement("div");
//   d.textContent = text;
//   return d.innerHTML;
// }
// function timestamp() {
//   return new Date().toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }
// function setConnectionStatus(status) {
//   const map = {
//     connected: { text: "Connected", cls: "connected" },
//     connecting: { text: "Connecting…", cls: "connecting" },
//     disconnected: { text: "Disconnected", cls: "" },
//   };
//   const s = map[status];
//   if (s) {
//     statusText.textContent = s.text;
//     statusDot.className = `status-dot ${s.cls}`;
//   }
// }
// function setControlsEnabled(enabled) {
//   [micBtn, sendBtn, messageInput].forEach((el) => {
//     if (el) el.disabled = !enabled;
//   });
//   connectBtn.disabled = enabled;
//   disconnectBtn.disabled = !enabled;
// }
// function formatDuration(seconds) {
//   if (seconds < 60) return `${seconds}s`;
//   const m = Math.floor(seconds / 60);
//   const s = seconds % 60;
//   return s > 0 ? `${m}m ${s}s` : `${m} minutes`;
// }

// // ── Session End ───────────────────────────────────────────────────
// async function expireSession() {
//   clearInterval(state.timerInterval);
//   await endSession("expired");
//   expiredOverlay.classList.remove("hidden");
// }

// async function endSession(reason) {
//   clearInterval(state.timerInterval);
//   finaliseCaraStream();
//   if (state.anamClient) {
//     state.anamClient.stopStreaming();
//     state.anamClient = null;
//   }
//   // Auto-download the transcript as PDF the moment the session truly ends
//   // (manual end button, timer expiry, or tab close) — but NOT on a simple
//   // disconnect, since the student may reconnect and isn't actually done.
//   // Must happen before clearHistory() below, since that wipes the data
//   // this reads from.
//   downloadTranscriptPDF(true);
//   // Clear session memory only when session truly ends, not on disconnect
//   clearHistory();
//   if (!state.sessionToken) return;
//   try {
//     await fetch("/api/codes/end-session", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         session_token: state.sessionToken,
//         duration_used: state.secondsUsed,
//         ended_reason: reason,
//       }),
//     });
//   } catch (err) {
//     console.error("Failed to track session end:", err);
//   }
//   if (reason === "manual") location.reload();
// }

// window.addEventListener("beforeunload", () => {
//   if (state.anamClient) state.anamClient.stopStreaming();
// });

// init();
