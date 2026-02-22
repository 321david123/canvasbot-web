import { Check, Clock } from "lucide-react";
import { getAssignments, getCourseMap } from "@/lib/bot-db";

function StatusBadge({
  status,
  score,
  points,
}: {
  status: string | null;
  score: number | null;
  points: number | null;
}) {
  if (status === "submitted" && score != null && points != null && points > 0) {
    const pct = (score / points) * 100;
    const color =
      pct >= 90
        ? "text-success bg-success/10"
        : pct >= 70
        ? "text-warning bg-warning/10"
        : "text-danger bg-danger/10";
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${color}`}
      >
        <Check className="h-3 w-3" />
        {score}/{points}
      </span>
    );
  }
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
        <Check className="h-3 w-3" />
        Entregada
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
      <Clock className="h-3 w-3" />
      Pendiente
    </span>
  );
}

export const dynamic = "force-dynamic";

export default function AssignmentsPage() {
  const assignments = getAssignments();
  const courseMap = getCourseMap();

  const pending = assignments.filter((a) => a.submission_status !== "submitted");
  const submitted = assignments.filter((a) => a.submission_status === "submitted");

  if (assignments.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Tareas</h1>
          <p className="mt-1 text-sm text-muted">
            No hay tareas todavia. Conecta Canvas y haz un scrape para ver tus tareas aqui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Tareas</h1>
        <p className="mt-1 text-sm text-muted">
          Todas tus tareas de todas las materias — {assignments.length} en total.
        </p>
      </div>

      {pending.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warning">
            Pendientes ({pending.length})
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="divide-y divide-border">
              {pending.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-card-hover"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.name}</p>
                    <p className="text-sm text-muted">
                      {courseMap.get(a.course_id) ?? a.course_id} &middot;{" "}
                      {a.due_at
                        ? `Entrega ${new Date(a.due_at).toLocaleDateString("es-MX", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}`
                        : "Sin fecha"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge
                      status={a.submission_status}
                      score={a.score}
                      points={a.points_possible}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {submitted.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-success">
            Completadas ({submitted.length})
          </h2>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="divide-y divide-border">
              {submitted.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-card-hover"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{a.name}</p>
                    <p className="text-sm text-muted">
                      {courseMap.get(a.course_id) ?? a.course_id} &middot;{" "}
                      {a.due_at
                        ? new Date(a.due_at).toLocaleDateString("es-MX", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        : "Sin fecha"}
                    </p>
                  </div>
                  <StatusBadge
                    status={a.submission_status}
                    score={a.score}
                    points={a.points_possible}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
