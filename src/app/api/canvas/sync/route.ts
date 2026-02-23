import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { fetchCourses, fetchAssignments, fetchAnnouncements } from "@/lib/canvas-api";

export const maxDuration = 60;

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: config } = await supabase
    .from("canvas_configs")
    .select("canvas_url, access_token")
    .eq("user_id", user.id)
    .single();

  if (!config) {
    return NextResponse.json({ error: "Canvas no conectado" }, { status: 400 });
  }

  const opts = { canvasUrl: config.canvas_url, accessToken: config.access_token };

  // Fetch courses
  const courses = await fetchCourses(opts);
  if (courses.length > 0) {
    const rows = courses.map((c) => ({
      id: String(c.id),
      user_id: user.id,
      name: c.name,
      code: c.course_code || null,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from("courses").upsert(rows, { onConflict: "id,user_id" });
  }

  // Fetch assignments for each course
  let totalAssignments = 0;
  for (const course of courses) {
    const assignments = await fetchAssignments(opts, course.id);
    if (assignments.length > 0) {
      const rows = assignments.map((a) => ({
        id: String(a.id),
        user_id: user.id,
        course_id: String(course.id),
        name: a.name,
        due_at: a.due_at || null,
        points_possible: a.points_possible ?? null,
        submission_status: a.submission?.workflow_state || null,
        score: a.submission?.score ?? null,
        submitted_at: a.submission?.submitted_at || null,
        html_url: a.html_url || null,
        assignment_type: a.submission_types?.includes("online_quiz") ? "quiz" : "assignment",
        updated_at: new Date().toISOString(),
      }));
      await supabase.from("assignments").upsert(rows, { onConflict: "id,user_id" });
      totalAssignments += assignments.length;
    }
  }

  // Fetch announcements
  let totalAnnouncements = 0;
  const courseIds = courses.map((c) => c.id);
  const announcements = await fetchAnnouncements(opts, courseIds);
  if (announcements.length > 0) {
    const rows = announcements.map((a) => ({
      id: String(a.id),
      user_id: user.id,
      course_id: extractCourseId(a.html_url),
      title: a.title,
      message: a.message || null,
      posted_at: a.posted_at || null,
      html_url: a.html_url || null,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from("announcements").upsert(rows, { onConflict: "id,user_id" });
    totalAnnouncements = announcements.length;
  }

  // Update config timestamp
  await supabase
    .from("canvas_configs")
    .update({ updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  return NextResponse.json({
    ok: true,
    courses: courses.length,
    assignments: totalAssignments,
    announcements: totalAnnouncements,
  });
}

function extractCourseId(htmlUrl: string): string {
  const match = htmlUrl?.match(/\/courses\/(\d+)/);
  return match ? match[1] : "unknown";
}
