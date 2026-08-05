// Fetches a student's real-time academic profile (attendance, points,
// season progress, roadmap status, etc.) from the Student Management
// System (SIS) so Pablo can answer questions about a student's own
// progress, not just their project work.
//
// This calls a dedicated SIS endpoint (/api/mentor/student-profile) that
// the SIS exposes specifically for this integration, gated by a shared
// secret (MENTOR_API_SECRET) rather than the student's own browser
// session -- this is a server-to-server call, so there's no session to
// reuse. It never throws: if the SIS is unreachable, slow, or doesn't
// know the student, this just returns null and the mentor session
// proceeds without a profile (nothing about the mentoring experience
// breaks).

const SIS_API_BASE_URL =
  process.env.SIS_API_BASE_URL || "https://student-management-system-beryl-phi.vercel.app";
const MENTOR_API_SECRET = process.env.MENTOR_API_SECRET;
const FETCH_TIMEOUT_MS = 5000;

/**
 * @param {string} email
 * @returns {Promise<object|null>} the student profile object, or null
 */
async function fetchStudentProfile(email) {
  if (!email || !MENTOR_API_SECRET) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const url = `${SIS_API_BASE_URL}/api/mentor/student-profile?email=${encodeURIComponent(email)}`;
    const res = await fetch(url, {
      headers: { "x-mentor-secret": MENTOR_API_SECRET },
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error(`studentProfile: SIS returned ${res.status} for ${email}`);
      return null;
    }

    const data = await res.json();
    if (!data.found) return null;
    return data.student;
  } catch (err) {
    console.error("studentProfile: fetch failed:", err.message);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Formats a student profile into a system-prompt section. Returns "" if
 * profile is null, so callers can always concatenate the result safely.
 * @param {object|null} profile
 */
function formatStudentProfileForPrompt(profile) {
  if (!profile) return "";

  const {
    first_name,
    status,
    current_season,
    expected_season,
    overall_progress_percent,
    completed_seasons,
    total_seasons,
    earned_points,
    qwasar_points,
    exercises_completed,
    projects_completed,
    workshops_attended,
    standups_attended,
    mentoring_attended,
    attendance_percent_vs_top_peer,
    last_login,
    season_breakdown,
    current_season_open_projects,
  } = profile;

  const seasonLines = (season_breakdown || [])
    .map((s) => `  - ${s.season}: ${s.progress_percent}% (${s.is_completed ? "completed" : "in progress"})`)
    .join("\n");

  const openProjectsLine =
    current_season_open_projects && current_season_open_projects.length > 0
      ? `Projects not yet completed in the current season: ${current_season_open_projects.join(", ")}.`
      : `No outstanding projects recorded for the current season.`;

  return `\n\n=== STUDENT PROFILE (LIVE DATA FROM THE STUDENT MANAGEMENT SYSTEM) ===
You are speaking with ${first_name || "this student"}. Here is their current, real-time academic status:

Status: ${status || "unknown"}
Current season: ${current_season || "unknown"}
Expected season (where they should be by now): ${expected_season || "unknown"}
Overall progress: ${overall_progress_percent ?? 0}% (${completed_seasons ?? 0} of ${total_seasons ?? 0} seasons completed)
Earned points: ${earned_points ?? 0}
Qwasar points: ${qwasar_points ?? 0}
Exercises completed: ${exercises_completed ?? 0}
Projects completed: ${projects_completed ?? 0}
Workshops attended: ${workshops_attended ?? 0}
Stand-ups attended: ${standups_attended ?? 0}
Mentoring sessions attended: ${mentoring_attended ?? 0}
Attendance, relative to the most active student org-wide: ${attendance_percent_vs_top_peer ?? 0}%
Last login: ${last_login || "unknown"}

Season-by-season progress:
${seasonLines || "  (no season progress recorded yet)"}

${openProjectsLine}

How to use this information:
- Use it to answer the student's own questions about their progress, attendance, points, or standing (e.g. "how am I doing", "what season am I on", "have I completed enough workshops"). This is real data about them specifically, not the general knowledge base.
- The attendance percentage above is relative to the most active student, not a literal "percent of sessions held" -- if asked, explain it that way rather than implying a fixed number of sessions was missed.
- Do not volunteer this profile unprompted at the start of every conversation. Greet normally and ask what they're working on, the same as usual. Bring in profile details only when the student asks about their progress/standing, or when it's clearly relevant (e.g. they say they feel behind -- you can gently reference their expected vs current season).
- If their status is "At Risk" or "Monitor" and it comes up naturally, be encouraging and constructive, not alarming -- focus on the next concrete step (e.g. an open project in their current season), not on the label itself.
- This profile does not override the coaching rules above: still don't give full solutions, still ground project-specific answers in the knowledge base.
=== END STUDENT PROFILE ===\n`;
}

module.exports = { fetchStudentProfile, formatStudentProfileForPrompt };
