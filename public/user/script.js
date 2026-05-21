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
  caraStreamBubble: null, // live <div class="tx-bubble"> being updated
  caraStreamText: "", // accumulated text for current Cara turn
  conversationLog: [], // [{role, text, time}] — source of truth for copy
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
  endSessionBtn.addEventListener("click", () => endSession("manual"));
  restartBtn.addEventListener("click", () => location.reload());
  copyBtn.addEventListener("click", copyTranscript);
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
    startTimer();
    addSystemNote(
      `Session started — ${formatDuration(state.durationSeconds)} available. Click "Connect to Cara" to begin.`,
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
  addSystemNote("Connecting to Cara…");

  try {
    const tokenRes = await fetch("/api/anam/token");
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
      micStatus.textContent = "Microphone: active — Cara can hear you";
      addSystemNote("✓ Microphone granted — Cara can hear you.");
    });
    state.anamClient.addListener("MIC_PERMISSION_DENIED", (err) => {
      addSystemNote(
        "❌ Microphone denied. Open browser settings and allow mic, then reconnect.",
      );
      micStatus.textContent = "Microphone: permission denied";
    });

    // ── Connection events ──────────────────────────────────────
    state.anamClient.addListener("CONNECTION_ESTABLISHED", () => {
      addSystemNote("✓ Connected to Cara.");
    });
    state.anamClient.addListener("SESSION_READY", () => {
      addSystemNote("✓ Cara is ready — start speaking!");
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
      micStatus.textContent = "🎤 Listening…";
    });
    state.anamClient.addListener("USER_SPEECH_ENDED", () => {
      micStatus.textContent = "Microphone: active — Cara can hear you";
    });

    // ── Transcript: streaming (word-by-word APPEND) ────────────
    // MESSAGE_STREAM_EVENT_RECEIVED sends INCREMENTAL new words, not full text.
    // role = "persona" while Cara speaks; role = "user" when user turn finalises.
    state.anamClient.addListener("MESSAGE_STREAM_EVENT_RECEIVED", (event) => {
      if (event.role === "persona") {
        // Append new word fragment to the live Cara bubble
        appendToCaraStream(event.content);
      } else if (event.role === "user") {
        // User's recognised speech — show as a user bubble
        finaliseCaraStream();
        addUserBubble(event.content, true);
      }
    });

    // MESSAGE_HISTORY_UPDATED fires after each full turn.
    // Use it to correct/finalise Cara's bubble with the clean final text.
    state.anamClient.addListener("MESSAGE_HISTORY_UPDATED", (messages) => {
      const lastAssistant = [...messages]
        .reverse()
        .find((m) => m.role === "assistant");
      const lastUser = [...messages].reverse().find((m) => m.role === "user");

      if (lastAssistant) {
        finaliseCaraStream(lastAssistant.content);
        // Update conversation log with clean final text
        const existing = state.conversationLog.findLast?.(
          (e) => e.role === "cara",
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

// ── Microphone toggle ─────────────────────────────────────────────
function toggleMicrophone() {
  if (!state.isConnected || !state.anamClient) {
    addSystemNote("Connect to Cara first.");
    return;
  }
  if (state.isMicOn) {
    state.anamClient.muteInputAudio();
    state.isMicOn = false;
    micBtn.classList.remove("active");
    micBtn.textContent = "🎤 Unmute Mic";
    micStatus.textContent = "Microphone: muted";
    addSystemNote("🔇 Microphone muted — Cara cannot hear you.");
  } else {
    state.anamClient.unmuteInputAudio();
    state.isMicOn = true;
    micBtn.classList.add("active");
    micBtn.textContent = "🔇 Mute Mic";
    micStatus.textContent = "Microphone: active — Cara can hear you";
    addSystemNote("🎤 Microphone active — Cara can hear you.");
  }
}

// ── Text message ──────────────────────────────────────────────────
function sendTextMessage() {
  const message = messageInput.value.trim();
  if (!message || !state.isConnected) return;
  addUserBubble(message, true);
  if (state.anamClient?.sendUserMessage)
    state.anamClient.sendUserMessage(message);
  messageInput.value = "";
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
  const time = timestamp();
  // Add to conversation log
  state.conversationLog.push({
    role: "user",
    text: text.trim(),
    time,
    final: true,
  });
  if (!addToDOM) return; // called from history update when DOM already has it
  const wrap = document.createElement("div");
  wrap.className = "tx-row tx-user";
  wrap.innerHTML = `
    <div class="tx-label">You</div>
    <div class="tx-bubble">${escapeHtml(text)}</div>
    <div class="tx-time">${time}</div>`;
  transcriptEl.appendChild(wrap);
  scrollTranscript();
}

// APPEND incremental words to the live Cara bubble
function appendToCaraStream(fragment) {
  if (!fragment) return;
  if (!state.caraStreamBubble) {
    // First fragment of a new Cara turn — create the bubble
    const time = timestamp();
    state.conversationLog.push({ role: "cara", text: "", time, final: false });
    const wrap = document.createElement("div");
    wrap.className = "tx-row tx-cara";
    wrap.innerHTML = `
      <div class="tx-label">Cara</div>
      <div class="tx-bubble tx-streaming"></div>
      <div class="tx-time">${time}</div>`;
    transcriptEl.appendChild(wrap);
    state.caraStreamBubble = wrap.querySelector(".tx-bubble");
    state.caraStreamText = "";
  }
  // APPEND the new fragment (not replace)
  state.caraStreamText += fragment;
  state.caraStreamBubble.textContent = state.caraStreamText;
  scrollTranscript();
}

// Lock in Cara's bubble when her turn is done; optionally correct with final clean text
function finaliseCaraStream(finalText) {
  if (!state.caraStreamBubble) return;
  if (finalText && finalText.trim()) {
    state.caraStreamBubble.textContent = finalText.trim();
    state.caraStreamText = finalText.trim();
  }
  state.caraStreamBubble.classList.remove("tx-streaming");
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
      const label = e.role === "cara" ? "Cara" : "You";
      return `[${e.time}]  ${label}: ${e.text}`;
    });

  if (lines.length === 0) {
    copyBtn.textContent = "Nothing to copy yet";
    setTimeout(() => {
      copyBtn.textContent = "📋 Copy Transcript";
    }, 2000);
    return;
  }

  const header = `Atech Virtual Assistant — Conversation Transcript\nSession: ${new Date().toLocaleString()}\n${"─".repeat(60)}\n`;
  const full = header + lines.join("\n");

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
  if (reason === "manual") location.reload();
}

window.addEventListener("beforeunload", () => {
  if (state.anamClient) state.anamClient.stopStreaming();
});

init();
