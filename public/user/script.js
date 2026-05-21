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
  localStream: null,
  // Transcript tracking
  caraStreamingDiv: null, // the live <div> being built word-by-word
  caraStreamingContent: "", // accumulated text for current Cara turn
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
  if (!cleanCode.startsWith("AT-")) {
    cleanCode = cleanCode.replace(/^AT-?/i, "");
    cleanCode = "AT-" + cleanCode;
  }
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
    console.error("Validation error:", err);
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
  if (remaining < 60) {
    timerDisplay.classList.add("urgent");
    if (remaining === 10) addSystemNote("⚠️ 10 seconds remaining");
  } else {
    timerDisplay.classList.remove("urgent");
  }
}

// ── Connect to Anam ───────────────────────────────────────────────
async function connect() {
  if (!state.sessionToken) {
    addSystemNote("❌ No session token. Please restart.");
    return;
  }
  setConnectionStatus("connecting");
  connectBtn.disabled = true;
  addSystemNote("Connecting to Cara…");
  try {
    // 1. Get Anam session token from backend
    const tokenRes = await fetch("/api/anam/token");
    const tokenData = await tokenRes.json();
    if (tokenData.demo_mode || !tokenData.session_token) {
      addSystemNote("⚠️ ANAM_API_KEY not configured on server.");
      state.isConnected = true;
      setConnectionStatus("connected");
      setControlsEnabled(true);
      return;
    }

    // 2. Wait for SDK
    await new Promise((resolve, reject) => {
      if (window.anamCreateClient) return resolve();
      const timeout = setTimeout(
        () => reject(new Error("Anam SDK took too long to load")),
        10000,
      );
      window.addEventListener(
        "anam-sdk-ready",
        () => {
          clearTimeout(timeout);
          resolve();
        },
        { once: true },
      );
    });

    // 3. Request mic permission explicitly
    addSystemNote("🎤 Requesting microphone access…");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      stream.getTracks().forEach((t) => t.stop());
    } catch (permErr) {
      addSystemNote(
        "❌ Microphone permission denied. Allow mic access in your browser settings and try again.",
      );
      setConnectionStatus("disconnected");
      connectBtn.disabled = false;
      return;
    }

    // 4. Create client
    state.anamClient = window.anamCreateClient(tokenData.session_token);

    // ── Transcript events ────────────────────────────────────────
    // Real-time word-by-word streaming for Cara's speech
    state.anamClient.addListener("MESSAGE_STREAM_EVENT_RECEIVED", (event) => {
      if (event.role === "persona") {
        // Cara is speaking — stream words into a live bubble
        updateCaraStream(event.content);
      } else if (event.role === "user") {
        // User finished speaking — show their full recognised utterance
        finaliseCaraStream(); // close any open Cara bubble first
        addUserBubble(event.content);
      }
    });

    // Full history after each turn completes — use to finalise/correct Cara's bubble
    state.anamClient.addListener("MESSAGE_HISTORY_UPDATED", (messages) => {
      // Find the last assistant message and finalise with its complete text
      const lastAssistant = [...messages]
        .reverse()
        .find((m) => m.role === "assistant");
      if (lastAssistant) finaliseCaraStream(lastAssistant.content);
    });

    state.anamClient.addListener("CONNECTION_CLOSED", () => {
      finaliseCaraStream();
      setConnectionStatus("disconnected");
      setControlsEnabled(false);
      connectBtn.disabled = false;
      micBtn.textContent = "🎤 Microphone";
      micBtn.classList.remove("active");
      micStatus.textContent = "Microphone: off";
      addSystemNote("Connection closed.");
    });

    // 5. Start streaming
    await state.anamClient.streamToVideoElement("anam-video");

    anamVideo.style.display = "block";
    avatarPlaceholder.style.display = "none";
    state.isConnected = true;
    setConnectionStatus("connected");
    setControlsEnabled(true);
    state.isMicOn = true;
    micBtn.classList.add("active");
    micBtn.textContent = "🔇 Mute Mic";
    micStatus.textContent = "Microphone: active — Cara can hear you";
    addSystemNote("✓ Connected! Cara can hear you — start speaking.");
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
  if (state.localStream) {
    state.localStream.getTracks().forEach((t) => t.stop());
    state.localStream = null;
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
  micStatus.textContent = "Microphone: off";
  addSystemNote("Disconnected.");
}

// ── Microphone ────────────────────────────────────────────────────
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
    addSystemNote("🎤 Microphone unmuted — Cara can hear you.");
  }
}

// ── Text Message ──────────────────────────────────────────────────
function sendTextMessage() {
  const message = messageInput.value.trim();
  if (!message || !state.isConnected) return;
  // Add user bubble immediately so they see their text
  addUserBubble(message);
  if (state.anamClient?.sendUserMessage) {
    state.anamClient.sendUserMessage(message);
  }
  messageInput.value = "";
}

// ── Transcript: building-block functions ─────────────────────────

// System notes (connection info, warnings) — subtle, centred
function addSystemNote(text) {
  const div = document.createElement("div");
  div.className = "tx-system";
  div.textContent = text;
  transcriptEl.appendChild(div);
  scrollTranscript();
}

// User bubble — right-aligned
function addUserBubble(text) {
  if (!text || !text.trim()) return;
  const wrap = document.createElement("div");
  wrap.className = "tx-row tx-user";
  wrap.innerHTML = `
    <div class="tx-label">You</div>
    <div class="tx-bubble">${escapeHtml(text)}</div>
    <div class="tx-time">${timestamp()}</div>`;
  transcriptEl.appendChild(wrap);
  scrollTranscript();
}

// Called repeatedly as Cara speaks — streams words into one growing bubble
function updateCaraStream(partialText) {
  if (!partialText) return;
  if (!state.caraStreamingDiv) {
    // First word of a new Cara turn — create the bubble
    const wrap = document.createElement("div");
    wrap.className = "tx-row tx-cara";
    wrap.innerHTML = `
      <div class="tx-label">Cara</div>
      <div class="tx-bubble tx-streaming"></div>
      <div class="tx-time">${timestamp()}</div>`;
    transcriptEl.appendChild(wrap);
    state.caraStreamingDiv = wrap.querySelector(".tx-bubble");
    state.caraStreamingContent = "";
  }
  state.caraStreamingContent = partialText; // SDK sends full partial each time
  state.caraStreamingDiv.textContent = state.caraStreamingContent;
  scrollTranscript();
}

// Called when Cara's turn is fully done — locks in the final text, removes cursor
function finaliseCaraStream(finalText) {
  if (!state.caraStreamingDiv) return;
  if (finalText) state.caraStreamingDiv.textContent = finalText;
  state.caraStreamingDiv.classList.remove("tx-streaming");
  state.caraStreamingDiv = null;
  state.caraStreamingContent = "";
}

function scrollTranscript() {
  transcriptEl.scrollTop = transcriptEl.scrollHeight;
}

// ── Copy transcript ───────────────────────────────────────────────
function copyTranscript() {
  const lines = [];
  transcriptEl.querySelectorAll(".tx-row, .tx-system").forEach((el) => {
    if (el.classList.contains("tx-system")) {
      lines.push(`[${el.textContent}]`);
    } else {
      const label = el.querySelector(".tx-label")?.textContent || "";
      const text = el.querySelector(".tx-bubble")?.textContent || "";
      const time = el.querySelector(".tx-time")?.textContent || "";
      if (text.trim()) lines.push(`${time}  ${label}: ${text}`);
    }
  });
  const full = lines.join("\n");
  navigator.clipboard
    .writeText(full)
    .then(() => {
      copyBtn.textContent = "✓ Copied!";
      copyBtn.style.background = "var(--success)";
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy Transcript";
        copyBtn.style.background = "";
      }, 2000);
    })
    .catch(() => {
      // Fallback for browsers that block clipboard
      const ta = document.createElement("textarea");
      ta.value = full;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => {
        copyBtn.textContent = "📋 Copy Transcript";
      }, 2000);
    });
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
  if (state.localStream) state.localStream.getTracks().forEach((t) => t.stop());
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
  if (state.localStream) state.localStream.getTracks().forEach((t) => t.stop());
});

init();
