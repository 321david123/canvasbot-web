import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";

const ROOT_DIR = path.resolve(process.cwd(), "..");
dotenv.config({ path: path.join(ROOT_DIR, ".env") });

const DB_PATH = path.resolve(ROOT_DIR, process.env.DB_PATH || "./data/canvasbot.db");
const AUTH_PATH = path.join(ROOT_DIR, process.env.PLAYWRIGHT_AUTH_DIR || "./playwright/.auth", "canvas-state.json");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`Bot database not found at ${DB_PATH}. Run npm run canvas:scrape first.`);
  }
  _db = new Database(DB_PATH, { readonly: true });
  return _db;
}

function safeGetDb(): Database.Database | null {
  try {
    return getDb();
  } catch {
    return null;
  }
}

// ─── Types ───

export interface Course {
  id: string;
  name: string;
  code: string | null;
  href: string | null;
}

export interface Assignment {
  id: string;
  course_id: string;
  name: string;
  due_at: string | null;
  points_possible: number | null;
  description_html: string | null;
  url: string | null;
  type: string;
  submission_status: string | null;
  score: number | null;
  submitted_at: string | null;
}

export interface Announcement {
  id: string;
  course_id: string;
  title: string;
  body_html: string | null;
  posted_at: string | null;
  url: string | null;
}

export interface LectureSession {
  id: number;
  course_id: string;
  title: string | null;
  started_at: string | null;
  ended_at: string | null;
  summary: string | null;
}

// ─── Queries ───

export function getCourses(): Course[] {
  const db = safeGetDb();
  if (!db) return [];
  return db.prepare("SELECT id, name, code, href FROM courses ORDER BY name").all() as Course[];
}

export function getAssignments(): Assignment[] {
  const db = safeGetDb();
  if (!db) return [];
  return db
    .prepare(
      `SELECT id, course_id, name, due_at, points_possible, description_html, url, type, submission_status, score, submitted_at
       FROM assignments ORDER BY due_at DESC`
    )
    .all() as Assignment[];
}

export function getAnnouncements(): Announcement[] {
  const db = safeGetDb();
  if (!db) return [];
  return db
    .prepare(
      `SELECT id, course_id, title, body_html, posted_at, url
       FROM announcements ORDER BY posted_at DESC`
    )
    .all() as Announcement[];
}

export function getLectureSessions(): LectureSession[] {
  const db = safeGetDb();
  if (!db) return [];
  return db
    .prepare(
      `SELECT id, course_id, title, started_at, ended_at, summary
       FROM lecture_sessions ORDER BY started_at DESC`
    )
    .all() as LectureSession[];
}

export function getUpcomingAssignments(): Assignment[] {
  const db = safeGetDb();
  if (!db) return [];
  return db
    .prepare(
      `SELECT id, course_id, name, due_at, points_possible, description_html, url, type, submission_status, score, submitted_at
       FROM assignments
       WHERE due_at IS NOT NULL AND due_at > datetime('now')
       ORDER BY due_at ASC`
    )
    .all() as Assignment[];
}

export function getNotSubmittedAssignments(): Assignment[] {
  const db = safeGetDb();
  if (!db) return [];
  return db
    .prepare(
      `SELECT id, course_id, name, due_at, points_possible, description_html, url, type, submission_status, score, submitted_at
       FROM assignments
       WHERE (submission_status IS NULL OR submission_status != 'submitted')
         AND type IN ('assignment', 'quiz')
       ORDER BY due_at ASC`
    )
    .all() as Assignment[];
}

export function getDashboardStats() {
  const db = safeGetDb();
  if (!db) return { courses: 0, weekAssignments: 0, urgentCount: 0, notSubmitted: 0, avgScore: null as number | null, lastSync: null as string | null };

  const courseCount = (db.prepare("SELECT COUNT(*) as c FROM courses").get() as any).c;

  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const weekAssignments = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM assignments WHERE due_at IS NOT NULL AND due_at > datetime('now') AND due_at <= ?"
      )
      .get(weekFromNow) as any
  ).c;

  const oneDayFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const urgentCount = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM assignments WHERE due_at IS NOT NULL AND due_at > datetime('now') AND due_at <= ?"
      )
      .get(oneDayFromNow) as any
  ).c;

  const notSubmitted = (
    db
      .prepare(
        "SELECT COUNT(*) as c FROM assignments WHERE (submission_status IS NULL OR submission_status != 'submitted') AND type IN ('assignment', 'quiz')"
      )
      .get() as any
  ).c;

  const avgRow = db
    .prepare(
      "SELECT AVG(score * 100.0 / points_possible) as avg FROM assignments WHERE score IS NOT NULL AND points_possible > 0"
    )
    .get() as any;
  const avgScore = avgRow?.avg != null ? Math.round(avgRow.avg * 10) / 10 : null;

  const lastSyncRow = db
    .prepare("SELECT MAX(updated_at) as ts FROM courses")
    .get() as any;

  return {
    courses: courseCount,
    weekAssignments,
    urgentCount,
    notSubmitted,
    avgScore,
    lastSync: lastSyncRow?.ts ?? null,
  };
}

export function getCourseName(courseId: string): string {
  const db = safeGetDb();
  if (!db) return courseId;
  const row = db.prepare("SELECT name FROM courses WHERE id = ?").get(courseId) as { name: string } | undefined;
  return row?.name ?? courseId;
}

export function getCourseMap(): Map<string, string> {
  const courses = getCourses();
  return new Map(courses.map((c) => [c.id, c.name]));
}

/** Build the full AI context string (same as the bot's getContextForAI) */
export function getContextForAI(): string {
  const db = safeGetDb();
  if (!db) return "No Canvas data available yet. The bot database has not been created.";

  const courses = db.prepare("SELECT id, name FROM courses ORDER BY name").all() as any[];
  const assignments = db
    .prepare(
      "SELECT course_id, name, due_at, points_possible, type, submission_status, score, submitted_at FROM assignments ORDER BY course_id, due_at"
    )
    .all() as any[];
  const announcements = db
    .prepare("SELECT course_id, title, posted_at FROM announcements ORDER BY course_id, posted_at DESC")
    .all() as any[];
  const content = db
    .prepare(
      "SELECT course_id, title, content_type, body_text FROM course_content ORDER BY course_id, content_type, title"
    )
    .all() as any[];
  const lectures = db
    .prepare(
      "SELECT course_id, title, started_at, summary, transcript FROM lecture_sessions ORDER BY course_id, started_at DESC"
    )
    .all() as any[];

  const notSubmitted = db
    .prepare(
      `SELECT name, course_id, due_at, submission_status FROM assignments
       WHERE (submission_status IS NULL OR submission_status != 'submitted') AND type IN ('assignment','quiz')
       ORDER BY due_at ASC`
    )
    .all() as any[];

  const lines: string[] = [
    "# SUGGESTIONS\n## Not submitted:\n",
    ...notSubmitted.map(
      (a: any) =>
        `- ${a.name} (${a.course_id}) | due: ${a.due_at ?? "no date"} | status: ${a.submission_status ?? "unknown"}\n`
    ),
    "\n# Your Canvas — full crawled content\n",
  ];

  for (const c of courses) {
    lines.push(`\n## Course: ${c.name} (ID: ${c.id})\n`);

    for (const row of content.filter((x: any) => x.course_id === c.id)) {
      lines.push(`\n### [${row.content_type}] ${row.title}\n`);
      lines.push(row.body_text?.trim() ? row.body_text.trim() + "\n" : "(no text content)\n");
    }

    const cLectures = lectures.filter((x: any) => x.course_id === c.id);
    if (cLectures.length) {
      lines.push("\n--- Lecture sessions ---\n");
      for (const ls of cLectures.slice(0, 5)) {
        lines.push(`- ${ls.started_at ?? ""} — ${ls.title ?? "Lecture"}\n`);
        if (ls.summary) lines.push(`Summary: ${ls.summary}\n`);
      }
    }

    const cAssign = assignments.filter((a: any) => a.course_id === c.id);
    if (cAssign.length) {
      lines.push("\n--- Assignments ---\n");
      for (const a of cAssign) {
        const status =
          a.submission_status === "submitted"
            ? `submitted${a.score != null ? ` ${a.score}` : ""}`
            : a.submission_status ?? "—";
        lines.push(
          `- ${a.type}: ${a.name} | due: ${a.due_at ?? "—"} | points: ${a.points_possible ?? "—"} | ${status}\n`
        );
      }
    }

    const cAnn = announcements.filter((a: any) => a.course_id === c.id);
    if (cAnn.length) {
      lines.push("\n--- Announcements ---\n");
      for (const an of cAnn) lines.push(`- ${an.title} (${an.posted_at ?? "—"})\n`);
    }
  }

  return lines.join("\n");
}

// ─── Status checks ───

export function isCanvasConnected(): boolean {
  return fs.existsSync(AUTH_PATH);
}

export function isDatabaseReady(): boolean {
  return fs.existsSync(DB_PATH);
}

export function getOpenAIKey(): string {
  return process.env.OPENAI_API_KEY || "";
}

export function getRootDir(): string {
  return ROOT_DIR;
}
