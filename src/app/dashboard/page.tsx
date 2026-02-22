import {
  BookOpen,
  Clock,
  AlertTriangle,
  Bell,
  TrendingUp,
  Wifi,
} from "lucide-react";
import { SetupBanner } from "./components/setup-banner";
import {
  getDashboardStats,
  getCourses,
  getUpcomingAssignments,
  getAnnouncements,
  getAssignments,
  getCourseMap,
  isCanvasConnected,
} from "@/lib/bot-db";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-4.5 w-4.5 text-accent" />
        </div>
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {sub && <p className="text-xs text-muted">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "justo ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export const dynamic = "force-dynamic";

export default function DashboardOverview() {
  const canvasConnected = isCanvasConnected();
  const stats = getDashboardStats();
  const courses = getCourses();
  const courseMap = getCourseMap();
  const upcoming = getUpcomingAssignments().slice(0, 5);
  const allAssignments = getAssignments();
  const announcements = getAnnouncements().slice(0, 5);

  const courseAssignmentCounts = new Map<string, { total: number; pending: number }>();
  for (const a of allAssignments) {
    const entry = courseAssignmentCounts.get(a.course_id) ?? { total: 0, pending: 0 };
    entry.total++;
    if (a.submission_status !== "submitted") entry.pending++;
    courseAssignmentCounts.set(a.course_id, entry);
  }

  const noData = courses.length === 0;

  return (
    <div className="space-y-8">
      <SetupBanner canvasConnected={canvasConnected} whatsappConnected={false} />
      <div>
        <h1 className="text-2xl font-bold">Inicio</h1>
        <p className="mt-1 text-sm text-muted">
          {noData
            ? "Conecta Canvas para ver tus clases aqui."
            : `Tus clases de un vistazo. Ultima sincronizacion ${timeAgo(stats.lastSync)}.`}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Materias activas" value={String(stats.courses)} />
        <StatCard
          icon={Clock}
          label="Entregas esta semana"
          value={String(stats.weekAssignments)}
          sub={stats.urgentCount > 0 ? `${stats.urgentCount} urgente${stats.urgentCount > 1 ? "s" : ""}` : undefined}
        />
        <StatCard icon={AlertTriangle} label="Sin entregar" value={String(stats.notSubmitted)} />
        <StatCard
          icon={TrendingUp}
          label="Promedio"
          value={stats.avgScore != null ? String(stats.avgScore) : "—"}
          sub={stats.avgScore != null ? "todas las materias" : "sin calificaciones"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Proximas entregas</h2>
            <Clock className="h-4 w-4 text-muted" />
          </div>
          <div className="divide-y divide-border">
            {upcoming.length === 0 && (
              <p className="px-5 py-6 text-sm text-muted">
                {noData ? "Sin datos — conecta Canvas primero." : "No hay entregas proximas."}
              </p>
            )}
            {upcoming.map((a) => {
              const hoursLeft = a.due_at
                ? (new Date(a.due_at).getTime() - Date.now()) / 3600000
                : Infinity;
              return (
                <div key={a.id} className="flex items-start gap-3 px-5 py-4">
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      hoursLeft < 24 ? "bg-danger" : hoursLeft < 72 ? "bg-warning" : "bg-accent"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="text-xs text-muted">
                      {courseMap.get(a.course_id) ?? a.course_id} &middot;{" "}
                      {a.due_at
                        ? new Date(a.due_at).toLocaleDateString("es-MX", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Sin fecha"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent announcements */}
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Anuncios recientes</h2>
            <Bell className="h-4 w-4 text-muted" />
          </div>
          <div className="divide-y divide-border">
            {announcements.length === 0 && (
              <p className="px-5 py-6 text-sm text-muted">
                {noData ? "Sin datos — conecta Canvas primero." : "No hay anuncios recientes."}
              </p>
            )}
            {announcements.map((ann) => (
              <div key={ann.id} className="flex items-start gap-3 px-5 py-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{ann.title}</p>
                  <p className="text-xs text-muted">
                    {courseMap.get(ann.course_id) ?? ann.course_id} &middot;{" "}
                    {timeAgo(ann.posted_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses grid */}
      {courses.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold">Tus materias</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course) => {
              const counts = courseAssignmentCounts.get(course.id);
              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{course.name}</h3>
                      {course.code && (
                        <p className="text-sm text-muted">{course.code}</p>
                      )}
                    </div>
                    <Wifi className="h-4 w-4 text-success" />
                  </div>
                  <div className="mt-4 flex gap-4 text-sm text-muted">
                    <span>{counts?.total ?? 0} tareas</span>
                    {(counts?.pending ?? 0) > 0 && (
                      <span className="text-warning">
                        {counts!.pending} pendientes
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
