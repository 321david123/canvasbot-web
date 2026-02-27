import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft, BookOpen, Bell, Mic, BarChart3 } from "lucide-react";
import {
  CourseTimeline,
  type TimelineEvent,
} from "../../components/course-timeline";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!course) {
    return (
      <div className="space-y-4">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Materias
        </Link>
        <p className="text-muted">Materia no encontrada.</p>
      </div>
    );
  }

  const { data: assignments } = await supabase
    .from("assignments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", id)
    .order("due_at");

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", id)
    .order("posted_at", { ascending: false });

  const allAssignments = assignments ?? [];
  const allAnnouncements = announcements ?? [];

  // Build timeline events
  const events: TimelineEvent[] = [];

  for (const a of allAssignments) {
    if (!a.due_at) continue;
    events.push({
      id: a.id,
      type: "assignment",
      title: a.name,
      date: a.due_at,
      meta: a.points_possible ? `${a.points_possible} pts` : undefined,
      status:
        a.submission_status === "submitted" || a.submission_status === "graded"
          ? a.submission_status
          : a.submission_status === "late"
            ? "late"
            : "pending",
      score: a.score,
      pointsPossible: a.points_possible,
      url: a.html_url,
    });
  }

  for (const ann of allAnnouncements) {
    if (!ann.posted_at) continue;
    events.push({
      id: ann.id,
      type: "announcement",
      title: ann.title,
      date: ann.posted_at,
      meta: ann.message
        ? ann.message.replace(/<[^>]*>/g, "").slice(0, 80)
        : undefined,
      url: ann.html_url,
    });
  }

  // Stats
  const now = new Date();
  const pending = allAssignments.filter(
    (a) => a.submission_status !== "submitted" && a.submission_status !== "graded"
  );
  const scored = allAssignments.filter(
    (a) => a.score != null && a.points_possible && a.points_possible > 0
  );
  const avgScore =
    scored.length > 0
      ? Math.round(
          (scored.reduce(
            (s, a) => s + (a.score! / a.points_possible!) * 100,
            0
          ) /
            scored.length) *
            10
        ) / 10
      : null;
  const upcoming = allAssignments.filter(
    (a) =>
      a.due_at &&
      new Date(a.due_at) > now &&
      new Date(a.due_at).getTime() - now.getTime() < 7 * 24 * 3600000
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/courses"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> Materias
        </Link>
        <h1 className="text-2xl font-bold">{course.name}</h1>
        {course.code && (
          <p className="mt-0.5 text-sm text-muted">{course.code}</p>
        )}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-accent">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-medium text-muted">Tareas</span>
          </div>
          <p className="mt-1 text-xl font-bold">{allAssignments.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-warning">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-medium text-muted">Pendientes</span>
          </div>
          <p className="mt-1 text-xl font-bold">{pending.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-danger">
            <Bell className="h-4 w-4" />
            <span className="text-xs font-medium text-muted">Esta semana</span>
          </div>
          <p className="mt-1 text-xl font-bold">{upcoming.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2 text-success">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs font-medium text-muted">Promedio</span>
          </div>
          <p className="mt-1 text-xl font-bold">
            {avgScore != null ? `${avgScore}%` : "—"}
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Linea de tiempo</h2>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" /> Tareas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-warning" /> Anuncios
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" /> Clases
            </span>
          </div>
        </div>
        <CourseTimeline events={events} courseName={course.name} />
      </div>

      {/* Recent announcements */}
      {allAnnouncements.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Anuncios</h2>
          <div className="space-y-3">
            {allAnnouncements.slice(0, 10).map((ann) => (
              <div
                key={ann.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                    <Bell className="h-3.5 w-3.5 text-warning" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{ann.title}</p>
                    {ann.message && (
                      <p className="mt-1 text-sm text-muted line-clamp-2">
                        {ann.message.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                    {ann.posted_at && (
                      <p className="mt-1.5 text-xs text-muted">
                        {new Date(ann.posted_at).toLocaleDateString("es-MX", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
