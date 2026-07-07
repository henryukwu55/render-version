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
    if (item.dataset.tab === "emails") loadAllowedEmails();
    if (item.dataset.tab === "analytics") loadAnalytics();
    if (item.dataset.tab === "reports") loadReports();
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

// ── Student Emails ────────────────────────────────────────────────
document.getElementById("add-email-btn").addEventListener("click", async () => {
  const emailInput = document.getElementById("new-email-input");
  const labelInput = document.getElementById("new-email-label");
  const errEl = document.getElementById("email-error");
  errEl.classList.add("hidden");

  const email = emailInput.value.trim();
  if (!email) {
    errEl.textContent = "Please enter an email address.";
    errEl.classList.remove("hidden");
    return;
  }

  const data = await postAllowedEmails({ email, label: labelInput.value.trim() }, errEl);
  if (!data) return;

  emailInput.value = "";
  labelInput.value = "";
  loadAllowedEmails();
});

document
  .getElementById("add-bulk-email-btn")
  .addEventListener("click", async () => {
    const bulkInput = document.getElementById("bulk-email-input");
    const errEl = document.getElementById("email-error");
    errEl.classList.add("hidden");

    const raw = bulkInput.value.trim();
    if (!raw) {
      errEl.textContent = "Paste at least one email first.";
      errEl.classList.remove("hidden");
      return;
    }

    const emails = raw.split(/[\n,;]+/).map((e) => e.trim()).filter(Boolean);
    const data = await postAllowedEmails({ emails }, errEl);
    if (!data) return;

    bulkInput.value = "";
    loadAllowedEmails();
  });

async function postAllowedEmails(body, errEl) {
  const res = await fetch("/api/codes/allowed-emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    errEl.textContent = data.error || "Failed to add email(s).";
    errEl.classList.remove("hidden");
    return null;
  }
  return data;
}

async function loadAllowedEmails() {
  const emails = await api("GET", "/codes/allowed-emails");
  if (!emails) return;
  const tbody = document.getElementById("emails-tbody");
  tbody.innerHTML = "";
  emails.forEach((e) => {
    tbody.innerHTML += `
      <tr>
        <td><span class="code-chip">${escapeHtml(e.email)}</span></td>
        <td>${e.label ? escapeHtml(e.label) : "—"}</td>
        <td style="color:var(--muted)">${formatDate(e.created_at)}</td>
        <td><button class="remove-email-btn" data-id="${e.id}">Remove</button></td>
      </tr>`;
  });
  if (!emails.length)
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:var(--muted)">No emails allowlisted yet</td></tr>';

  tbody.querySelectorAll(".remove-email-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (!confirm("Remove this email? They'll lose automatic access."))
        return;
      const ok = await api("DELETE", `/codes/allowed-emails/${btn.dataset.id}`);
      if (ok) loadAllowedEmails();
    });
  });
}

// ── Analytics ───────────────────────────────────────────────────
async function loadAnalytics() {
  loadEngagementTrend();
  loadSessionOutcomes();
  loadTopicsChart();
  loadStudentEngagement();
  loadCodePerformance();
  loadEvents();
}

let engagementChartInstance = null;
async function loadEngagementTrend() {
  const rows = await api("GET", "/analytics/engagement-trend?days=30");
  if (!rows) return;

  const labels = rows.map((r) =>
    new Date(r.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
  );
  const sessions = rows.map((r) => parseInt(r.sessions));
  const students = rows.map((r) => parseInt(r.unique_students));

  const ctx = document.getElementById("engagement-chart");
  if (engagementChartInstance) engagementChartInstance.destroy();
  engagementChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Sessions",
          data: sessions,
          borderColor: "#7c6dfa",
          backgroundColor: "rgba(124, 109, 250, 0.15)",
          fill: true,
          tension: 0.3,
        },
        {
          label: "Unique Students",
          data: students,
          borderColor: "#34d399",
          backgroundColor: "rgba(52, 211, 153, 0.1)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: chartBaseOptions(),
  });
}

let outcomesChartInstance = null;
async function loadSessionOutcomes() {
  const data = await api("GET", "/analytics/session-outcomes");
  if (!data) return;

  const ctx = document.getElementById("outcomes-chart");
  if (outcomesChartInstance) outcomesChartInstance.destroy();
  outcomesChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Ended by Student", "No Clean End"],
      datasets: [
        {
          data: [
            parseInt(data.ended_by_student) || 0,
            parseInt(data.no_clean_end) || 0,
          ],
          backgroundColor: ["#34d399", "#f87171"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      ...chartBaseOptions(),
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#888898", font: { family: "DM Sans", size: 11 } },
        },
      },
    },
  });
}

let topicsChartInstance = null;
async function loadTopicsChart() {
  const rows = await api("GET", "/session-summary/topics");
  if (!rows) return;
  const top = rows.slice(0, 10);

  const ctx = document.getElementById("topics-chart");
  if (topicsChartInstance) topicsChartInstance.destroy();
  topicsChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: top.map((r) => r.topic || "Untitled"),
      datasets: [
        {
          label: "Sessions",
          data: top.map((r) => parseInt(r.session_count)),
          backgroundColor: "#a78bfa",
          borderRadius: 4,
        },
      ],
    },
    options: {
      ...chartBaseOptions(),
      indexAxis: "y",
      plugins: { legend: { display: false } },
    },
  });
}

function chartBaseOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: "#888898", font: { family: "DM Sans", size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: { color: "#888898", font: { family: "DM Sans", size: 11 } },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#888898", font: { family: "DM Sans", size: 11 } },
      },
    },
  };
}

async function loadStudentEngagement() {
  const rows = await api("GET", "/analytics/student-engagement");
  if (!rows) return;
  const tbody = document.getElementById("student-engagement-tbody");
  tbody.innerHTML = "";

  rows.forEach((r) => {
    const sessionCount = parseInt(r.session_count);
    let status, statusClass;
    if (sessionCount === 0) {
      status = "Never logged in";
      statusClass = "status-never";
    } else {
      const daysSince = r.last_active
        ? (Date.now() - new Date(r.last_active).getTime()) / 86400000
        : Infinity;
      if (daysSince > 14) {
        status = "Inactive 14+ days";
        statusClass = "status-inactive";
      } else {
        status = "Active";
        statusClass = "status-active";
      }
    }

    tbody.innerHTML += `
      <tr>
        <td>
          <div>${escapeHtml(r.email)}</div>
          ${r.label ? `<div style="color:var(--muted);font-size:12px">${escapeHtml(r.label)}</div>` : ""}
        </td>
        <td>${sessionCount}</td>
        <td style="color:var(--muted)">${r.last_active ? formatDateTime(r.last_active) : "Never"}</td>
        <td>${r.avg_session_seconds ? formatDuration(Math.round(r.avg_session_seconds)) : "—"}</td>
        <td>${r.distinct_topics || 0}</td>
        <td><span class="status-badge ${statusClass}">${status}</span></td>
      </tr>`;
  });

  if (!rows.length)
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align:center;color:var(--muted)">No allowlisted students yet</td></tr>';
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

// ── Reports ───────────────────────────────────────────────────────
// Default the date range to the last 30 days so the tab is useful the
// moment an admin opens it, without forcing them to pick dates first.
function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  const fmt = (d) => d.toISOString().slice(0, 10);
  return { from: fmt(from), to: fmt(to) };
}

function initReportDates() {
  const fromInput = document.getElementById("report-from");
  const toInput = document.getElementById("report-to");
  if (!fromInput.value || !toInput.value) {
    const { from, to } = defaultDateRange();
    fromInput.value = from;
    toInput.value = to;
  }
}

async function loadReports() {
  initReportDates();
  loadTopicsPreview();
  loadRecentSummariesPreview();
  loadVoiceStatsPreview();
}

async function loadTopicsPreview() {
  const rows = await api("GET", "/session-summary/topics");
  const tbody = document.getElementById("topics-tbody");
  if (!rows) {
    tbody.innerHTML =
      '<tr><td colspan="3" style="text-align:center;color:var(--muted)">Unable to load</td></tr>';
    return;
  }
  tbody.innerHTML = "";
  rows.slice(0, 15).forEach((r) => {
    tbody.innerHTML += `
      <tr>
        <td>${escapeHtml(r.topic)}</td>
        <td>${r.session_count}</td>
        <td style="color:var(--muted)">${formatDateTime(r.last_asked)}</td>
      </tr>`;
  });
  if (!rows.length)
    tbody.innerHTML =
      '<tr><td colspan="3" style="text-align:center;color:var(--muted)">No data yet</td></tr>';
}

async function loadRecentSummariesPreview() {
  const rows = await api("GET", "/session-summary/recent?limit=10");
  const tbody = document.getElementById("summaries-tbody");
  if (!rows) {
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:var(--muted)">Unable to load</td></tr>';
    return;
  }
  tbody.innerHTML = "";
  rows.forEach((r) => {
    tbody.innerHTML += `
      <tr>
        <td style="color:var(--muted)">${formatDateTime(r.created_at)}</td>
        <td>${r.access_code ? `<span class="code-chip">${escapeHtml(r.access_code)}</span>` : "—"}</td>
        <td>${escapeHtml(r.topic)}</td>
        <td>${escapeHtml(r.summary)}</td>
      </tr>`;
  });
  if (!rows.length)
    tbody.innerHTML =
      '<tr><td colspan="4" style="text-align:center;color:var(--muted)">No data yet</td></tr>';
}

async function loadVoiceStatsPreview() {
  const stats = await api("GET", "/voice-interaction/stats");
  const wrap = document.getElementById("voice-stats-grid");
  if (!stats || !stats.total_exchanges) {
    wrap.innerHTML =
      '<div class="stat-card"><div class="stat-label">Voice Exchanges</div><div class="stat-val">0</div></div>';
    return;
  }
  wrap.innerHTML = `
    <div class="stat-card">
      <div class="stat-label">Voice Exchanges</div>
      <div class="stat-val">${stats.total_exchanges}</div>
    </div>
    <div class="stat-card accent">
      <div class="stat-label">Avg Response Latency</div>
      <div class="stat-val">${stats.avg_mentor_latency_ms ? (stats.avg_mentor_latency_ms / 1000).toFixed(1) + "s" : "—"}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Avg Student Speech</div>
      <div class="stat-val">${stats.avg_student_speech_ms ? (stats.avg_student_speech_ms / 1000).toFixed(1) + "s" : "—"}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Avg Mentor Response</div>
      <div class="stat-val">${stats.avg_mentor_response_ms ? (stats.avg_mentor_response_ms / 1000).toFixed(1) + "s" : "—"}</div>
    </div>`;
}

// ── CSV downloads ────────────────────────────────────────────────
// Downloads must use a real navigation (not fetch + JSON) so the browser
// triggers a file save with the server's Content-Disposition filename.
// Since the endpoint requires the admin's bearer token and a plain link
// click can't attach an Authorization header, the response is fetched
// with the token, then turned into a Blob and "clicked" via a temporary
// anchor — same end result as a direct link, but auth-aware.
async function downloadCsv(path, filenameFallback) {
  try {
    const res = await fetch(`/api${path}`, {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Export failed. Please check the date range.");
      return;
    }
    const blob = await res.blob();
    const disposition = res.headers.get("Content-Disposition") || "";
    const match = disposition.match(/filename="(.+?)"/);
    const filename = match ? match[1] : filenameFallback;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    alert("Network error during export. Please try again.");
  }
}

document
  .getElementById("export-summaries-btn")
  .addEventListener("click", () => {
    const from = document.getElementById("report-from").value;
    const to = document.getElementById("report-to").value;
    if (!from || !to) return alert("Please choose both a from and to date.");
    downloadCsv(
      `/session-summary/export?from=${from}&to=${to}`,
      `session-summaries_${from}_to_${to}.csv`,
    );
  });

document.getElementById("export-voice-btn").addEventListener("click", () => {
  const from = document.getElementById("report-from").value;
  const to = document.getElementById("report-to").value;
  if (!from || !to) return alert("Please choose both a from and to date.");
  downloadCsv(
    `/voice-interaction/export?from=${from}&to=${to}`,
    `voice-interactions_${from}_to_${to}.csv`,
  );
});

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

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
