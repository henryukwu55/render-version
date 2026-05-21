// ── State ──────────────────────────────────────────────────────
const state = {
  token: localStorage.getItem("admin_token"),
  eventFilter: "",
};

// ── API helper ──────────────────────────────────────────────────
async function api(method, path, body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    logout();
    return null;
  }
  return res.ok ? res.json() : null;
}

// ── Auth ────────────────────────────────────────────────────────
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("login-btn");
  const err = document.getElementById("login-error");
  btn.textContent = "Signing in…";
  btn.disabled = true;
  err.classList.add("hidden");

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();

  if (!res.ok) {
    err.textContent = data.error || "Login failed";
    err.classList.remove("hidden");
    btn.textContent = "Sign In";
    btn.disabled = false;
    return;
  }

  state.token = data.token;
  localStorage.setItem("admin_token", data.token);
  document.getElementById("admin-email-label").textContent = data.email;
  showDashboard();
});

document.getElementById("logout-btn").addEventListener("click", logout);
async function logout() {
  if (state.token) await api("POST", "/auth/logout");
  state.token = null;
  localStorage.removeItem("admin_token");
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
}

// ── Navigation ──────────────────────────────────────────────────
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".nav-item")
      .forEach((n) => n.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => {
      p.classList.remove("active");
      p.classList.add("hidden");
    });
    item.classList.add("active");
    const tab = document.getElementById(`tab-${item.dataset.tab}`);
    tab.classList.remove("hidden");
    tab.classList.add("active");
    if (item.dataset.tab === "codes") loadCodes();
    if (item.dataset.tab === "analytics") loadAnalytics();
  });
});

// ── Dashboard startup ───────────────────────────────────────────
async function showDashboard() {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  loadOverview();
}

async function loadOverview() {
  const data = await api("GET", "/analytics/summary");
  if (!data) return;

  document.getElementById("stat-codes").textContent =
    data.totals.codes_generated || 0;
  document.getElementById("stat-sessions").textContent =
    data.totals.sessions_total || 0;
  document.getElementById("stat-expired").textContent =
    data.totals.sessions_expired || 0;
  document.getElementById("stat-active").textContent =
    data.realtime?.active_sessions || 0;

  const tbody = document.getElementById("daily-tbody");
  tbody.innerHTML = "";
  (data.daily || []).forEach((row) => {
    tbody.innerHTML += `
      <tr>
        <td>${formatDate(row.date)}</td>
        <td>${row.sessions_started || 0}</td>
        <td>${row.unique_codes_used || 0}</td>
        <td>${row.sessions_expired || 0}</td>
      </tr>`;
  });
  if (!data.daily?.length)
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:var(--muted)">No data yet</td></tr>';
}

// ── Codes ───────────────────────────────────────────────────────
document.getElementById("gen-code-btn").addEventListener("click", async () => {
  const duration = parseInt(document.getElementById("code-duration").value);
  const display = document.getElementById("new-code-display");
  display.classList.add("hidden");

  const data = await api("POST", "/codes/generate", {
    duration_seconds: duration,
  });
  if (!data) return;

  display.textContent = data.code;
  display.classList.remove("hidden");
  loadCodes();
});

async function loadCodes() {
  const codes = await api("GET", "/codes");
  if (!codes) return;
  const tbody = document.getElementById("codes-tbody");
  tbody.innerHTML = "";
  codes.forEach((c) => {
    const expired = new Date(c.expires_at) < new Date();
    const status = c.is_used ? "used" : expired ? "expired" : "active";
    const pillClass = {
      active: "pill-green",
      used: "pill-yellow",
      expired: "pill-red",
    }[status];
    tbody.innerHTML += `
      <tr>
        <td><span class="code-chip">${c.code}</span></td>
        <td>${formatDuration(c.duration_seconds)}</td>
        <td>${formatDate(c.created_at)}</td>
        <td>${formatDate(c.expires_at)}</td>
        <td><span class="pill ${pillClass}">${status}</span></td>
        <td>${c.session_count || 0}</td>
      </tr>`;
  });
  if (!codes.length)
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;color:var(--muted)">No codes yet</td></tr>';
}

// ── Analytics ───────────────────────────────────────────────────
async function loadAnalytics() {
  loadCodePerformance();
  loadEvents();
}

async function loadCodePerformance() {
  const rows = await api("GET", "/analytics/code-performance");
  if (!rows) return;
  const tbody = document.getElementById("perf-tbody");
  tbody.innerHTML = "";
  rows.forEach((r) => {
    tbody.innerHTML += `
      <tr>
        <td><span class="code-chip">${r.code}</span></td>
        <td>${formatDuration(r.duration_seconds)}</td>
        <td>${r.times_used}</td>
        <td>${r.avg_duration_used ? formatDuration(Math.round(r.avg_duration_used)) : "—"}</td>
        <td>${r.completed_count}</td>
        <td>${r.expired_count}</td>
      </tr>`;
  });
  if (!rows.length)
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;color:var(--muted)">No data yet</td></tr>';
}

async function loadEvents() {
  const type = state.eventFilter;
  const events = await api(
    "GET",
    `/analytics/events?limit=50${type ? "&type=" + type : ""}`,
  );
  if (!events) return;
  const tbody = document.getElementById("events-tbody");
  tbody.innerHTML = "";
  events.forEach((e) => {
    tbody.innerHTML += `
      <tr>
        <td style="color:var(--muted)">${formatDateTime(e.created_at)}</td>
        <td>${e.event_type}</td>
        <td>${e.code ? `<span class="code-chip">${e.code}</span>` : "—"}</td>
      </tr>`;
  });
  if (!events.length)
    tbody.innerHTML =
      '<tr><td colspan="3" style="text-align:center;color:var(--muted)">No events</td></tr>';
}

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    state.eventFilter = btn.dataset.type;
    loadEvents();
  });
});

// ── Utilities ───────────────────────────────────────────────────
function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function formatDuration(secs) {
  if (!secs) return "—";
  if (secs < 60) return `${secs}s`;
  if (secs < 3600) return `${Math.round(secs / 60)}m`;
  return `${(secs / 3600).toFixed(1)}h`;
}

// ── Init ────────────────────────────────────────────────────────
(async () => {
  if (state.token) {
    const me = await api("GET", "/auth/me");
    if (me?.admin) {
      document.getElementById("admin-email-label").textContent = me.admin.email;
      showDashboard();
      return;
    }
    state.token = null;
    localStorage.removeItem("admin_token");
  }
  document.getElementById("login-screen").classList.remove("hidden");
})();
