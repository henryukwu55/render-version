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
}

function formatCodeInput() {
  let v = codeInput.value.toUpperCase().replace(/[^A-Z0-9\-]/g, "");
  if (v.length >= 2 && !v.includes("-")) {
    v = v.slice(0, 2) + "-" + v.slice(2);
  }
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
    addTranscript(
      "system",
      `✓ Session started — ${formatDuration(state.durationSeconds)} available. Click "Connect to Cara" to begin.`,
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
    if (remaining === 10) addTranscript("system", "⚠️ 10 seconds remaining");
  } else {
    timerDisplay.classList.remove("urgent");
  }
}

// ── Connect to Anam ───────────────────────────────────────────────
async function connect() {
  if (!state.sessionToken) {
    addTranscript("system", "❌ No session token. Please restart.");
    return;
  }

  setConnectionStatus("connecting");
  connectBtn.disabled = true;
  addTranscript("system", "Connecting to Cara…");

  try {
    // 1. Get Anam session token from our backend
    const tokenRes = await fetch("/api/anam/token");
    const tokenData = await tokenRes.json();

    if (tokenData.demo_mode || !tokenData.session_token) {
      addTranscript(
        "system",
        "⚠️ ANAM_API_KEY not configured on server. Running in demo mode.",
      );
      state.isConnected = true;
      setConnectionStatus("connected");
      setControlsEnabled(true);
      return;
    }

    // 2. Dynamically import the Anam SDK from esm.sh (no build step needed)
    const { createClient } =
      await import("https://esm.sh/@anam-ai/js-sdk@latest");

    // 3. Create client with the session token
    state.anamClient = createClient(tokenData.session_token);

    // 4. Listen for talk events to show transcript
    state.anamClient.addListener("TALK_STREAM_STARTED", () => {
      addTranscript("assistant", "Cara is speaking…");
    });

    state.anamClient.addListener("CONNECTION_CLOSED", () => {
      setConnectionStatus("disconnected");
      setControlsEnabled(false);
      connectBtn.disabled = false;
      addTranscript("system", "Connection closed.");
    });

    // 5. Start streaming to the video element
    await state.anamClient.streamToVideoElement("anam-video");

    // Show video, hide placeholder
    anamVideo.style.display = "block";
    avatarPlaceholder.style.display = "none";

    state.isConnected = true;
    setConnectionStatus("connected");
    setControlsEnabled(true);
    addTranscript(
      "system",
      "✓ Connected to Cara! Start speaking — she can hear you automatically.",
    );
  } catch (err) {
    console.error("Connection error:", err);
    setConnectionStatus("disconnected");
    connectBtn.disabled = false;
    addTranscript("system", `❌ Connection failed: ${err.message}`);
  }
}

// ── Disconnect ────────────────────────────────────────────────────
function disconnect() {
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
  addTranscript("system", "Disconnected.");
}

// ── Microphone ────────────────────────────────────────────────────
function toggleMicrophone() {
  if (!state.isConnected) {
    addTranscript("system", "Connect to Cara first.");
    return;
  }
  if (!state.isMicOn) {
    state.anamClient?.unmuteInputAudio?.();
    state.isMicOn = true;
    micBtn.classList.add("active");
    micStatus.textContent = "Microphone: active — Cara is listening";
    addTranscript("system", "🎤 Microphone on.");
  } else {
    state.anamClient?.muteInputAudio?.();
    state.isMicOn = false;
    micBtn.classList.remove("active");
    micStatus.textContent = "Microphone: off";
    addTranscript("system", "🔇 Microphone off.");
  }
}

// ── Text Message ──────────────────────────────────────────────────
function sendTextMessage() {
  const message = messageInput.value.trim();
  if (!message || !state.isConnected) return;
  addTranscript("user", message);
  if (state.anamClient?.sendUserMessage) {
    state.anamClient.sendUserMessage(message);
  } else {
    addTranscript(
      "assistant",
      "Demo mode: connect to Anam to get real responses.",
    );
  }
  messageInput.value = "";
}

// ── Transcript ────────────────────────────────────────────────────
function addTranscript(role, content) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  const labels = { user: "You", assistant: "Cara", system: "System" };
  div.innerHTML = `
    <div class="role">${labels[role] || role}</div>
    <div class="content">${escapeHtml(content)}</div>
    <div class="timestamp">${new Date().toLocaleTimeString()}</div>
  `;
  transcriptEl.appendChild(div);
  div.scrollIntoView({ behavior: "smooth", block: "nearest" });
  while (transcriptEl.children.length > 100)
    transcriptEl.removeChild(transcriptEl.firstChild);
}

function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML;
}

// ── UI Helpers ────────────────────────────────────────────────────
function setConnectionStatus(status) {
  const map = {
    connected: { text: "Connected", cls: "connected" },
    connecting: { text: "Connecting…", cls: "" },
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
