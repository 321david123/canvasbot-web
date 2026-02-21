import { Check, Clock, AlertTriangle, ExternalLink } from "lucide-react";

const mockAssignments = [
  { id: "1", name: "Tarea: Estructura condicional if", course: "Pensamiento computacional", due: "2026-02-16T23:59:00", status: "pending", points: 100 },
  { id: "2", name: "TI 2. Analisis de las variables internas y externas", course: "Vision holistica del consumidor", due: "2026-02-20T23:59:00", status: "pending", points: 100 },
  { id: "3", name: "Examen rapido: Algoritmo-Python-Operaciones", course: "Pensamiento computacional", due: "2026-02-21T08:50:00", status: "pending", points: 100 },
  { id: "4", name: "Tarea: Programas que realizan calculos", course: "Pensamiento computacional", due: "2026-02-12T23:59:00", status: "submitted", points: 100, score: 100 },
  { id: "5", name: "Laboratorio: Problemas que involucran calculos", course: "Pensamiento computacional", due: "2026-02-10T23:59:00", status: "submitted", points: 100, score: 100 },
  { id: "6", name: "Examen: Elementos de un Programa", course: "Pensamiento computacional", due: "2026-02-09T23:59:00", status: "submitted", points: 100, score: 94 },
  { id: "7", name: "Examen: Valores Booleanos", course: "Pensamiento computacional", due: "2026-02-08T23:59:00", status: "submitted", points: 100, score: 100 },
  { id: "8", name: "Ejercicios: Prioridad operaciones", course: "Pensamiento computacional", due: "2026-02-07T23:59:00", status: "submitted", points: 100, score: 100 },
  { id: "9", name: "Actividad en clase: La linea del tiempo", course: "Vision holistica del consumidor", due: "2026-02-14T23:59:00", status: "submitted", points: 50, score: 45 },
  { id: "10", name: "Diagnostico final de conocimientos previos", course: "Microeconomia", due: "2026-02-05T23:59:00", status: "submitted", points: 10, score: 8 },
];

function StatusBadge({ status, score, points }: { status: string; score?: number; points: number }) {
  if (status === "submitted" && score != null) {
    const pct = (score / points) * 100;
    const color = pct >= 90 ? "text-success bg-success/10" : pct >= 70 ? "text-warning bg-warning/10" : "text-danger bg-danger/10";
    return (
      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${color}`}>
        <Check className="h-3 w-3" />
        {score}/{points}
      </span>
    );
  }
  if (status === "submitted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
        <Check className="h-3 w-3" />
        Submitted
      </span>
    );
  }
  const now = new Date();
  const due = new Date(mockAssignments.find((a) => a.status === status)?.due ?? "");
  const overdue = due < now;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
        overdue ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
      }`}
    >
      {overdue ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
      {overdue ? "Missing" : "Pending"}
    </span>
  );
}

export default function AssignmentsPage() {
  const pending = mockAssignments.filter((a) => a.status !== "submitted");
  const submitted = mockAssignments.filter((a) => a.status === "submitted");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Assignments</h1>
        <p className="mt-1 text-sm text-muted">
          All your assignments across every course.
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-warning">
            Pending ({pending.length})
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
                      {a.course} &middot; Due{" "}
                      {new Date(a.due).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <StatusBadge status={a.status} points={a.points} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Submitted */}
      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-success">
          Completed ({submitted.length})
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
                    {a.course} &middot;{" "}
                    {new Date(a.due).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <StatusBadge status={a.status} score={a.score} points={a.points} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
