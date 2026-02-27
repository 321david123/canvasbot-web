import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  BookOpen,
  ChevronRight,
  Bell,
  Clock,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  const { data: assignments } = await supabase
    .from("assignments")
    .select("id, course_id, due_at, submission_status")
    .eq("user_id", user.id);

  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, course_id")
    .eq("user_id", user.id);

  const allCourses = courses ?? [];
  const allAssignments = assignments ?? [];
  const allAnnouncements = announcements ?? [];

  const now = new Date();

  // Build stats per course
  const courseStats = new Map<
    string,
    { total: number; pending: number; upcoming: number; announcements: number }
  >();
  for (const a of allAssignments) {
    const entry = courseStats.get(a.course_id) ?? {
      total: 0,
      pending: 0,
      upcoming: 0,
      announcements: 0,
    };
    entry.total++;
    if (a.submission_status !== "submitted" && a.submission_status !== "graded") {
      entry.pending++;
    }
    if (a.due_at) {
      const due = new Date(a.due_at);
      if (due > now && due.getTime() - now.getTime() < 7 * 24 * 3600000) {
        entry.upcoming++;
      }
    }
    courseStats.set(a.course_id, entry);
  }
  for (const ann of allAnnouncements) {
    const entry = courseStats.get(ann.course_id) ?? {
      total: 0,
      pending: 0,
      upcoming: 0,
      announcements: 0,
    };
    entry.announcements++;
    courseStats.set(ann.course_id, entry);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Materias</h1>
        <p className="mt-1 text-sm text-muted">
          Selecciona una materia para ver su linea de tiempo.
        </p>
      </div>

      {allCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-8 py-16 text-center">
          <BookOpen className="mb-4 h-10 w-10 text-muted" />
          <h3 className="text-lg font-semibold">Sin materias</h3>
          <p className="mt-1 text-sm text-muted">
            Conecta Canvas para ver tus materias aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {allCourses.map((course) => {
            const stats = courseStats.get(course.id);
            return (
              <Link
                key={course.id}
                href={`/dashboard/courses/${course.id}`}
                className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-accent/30 hover:bg-card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-snug group-hover:text-accent transition-colors">
                      {course.name}
                    </h3>
                    {course.code && (
                      <p className="mt-0.5 text-sm text-muted">{course.code}</p>
                    )}
                  </div>
                  <ChevronRight className="ml-3 mt-0.5 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent">
                    <BookOpen className="h-3 w-3" />
                    {stats?.total ?? 0} tareas
                  </span>

                  {(stats?.pending ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 font-medium text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      {stats!.pending} pendientes
                    </span>
                  )}

                  {(stats?.upcoming ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 font-medium text-danger">
                      <Clock className="h-3 w-3" />
                      {stats!.upcoming} esta semana
                    </span>
                  )}

                  {(stats?.announcements ?? 0) > 0 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-card-hover px-2.5 py-1 font-medium text-muted">
                      <Bell className="h-3 w-3" />
                      {stats!.announcements} anuncios
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
