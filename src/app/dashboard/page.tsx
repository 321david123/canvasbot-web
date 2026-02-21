import {
  BookOpen,
  Clock,
  AlertTriangle,
  Bell,
  TrendingUp,
  Wifi,
} from "lucide-react";

const mockCourses = [
  { id: "652358", name: "Microeconomia", code: "Gpo 401", assignments: 3, pending: 1 },
  { id: "652873", name: "Modelacion matematica fundamental", code: "Gpo 401", assignments: 3, pending: 0 },
  { id: "653142", name: "Pensamiento computacional para ingenieria", code: "Gpo 402", assignments: 10, pending: 2 },
  { id: "658147", name: "Vision holistica del consumidor", code: "Gpo 102", assignments: 10, pending: 3 },
];

const mockUpcoming = [
  { name: "Tarea: Estructura condicional if", course: "Pensamiento Computacional", due: "Manana, 11:59 PM", urgent: true },
  { name: "TI 2. Analisis de variables", course: "Vision Holistica", due: "Jue 20 Feb, 11:59 PM", urgent: false },
  { name: "Examen rapido: Algoritmos", course: "Pensamiento Computacional", due: "Vie 21 Feb, 8:50 AM", urgent: false },
];

const mockActivity = [
  { type: "grade", text: "Calificacion publicada: Tarea Programas que realizan calculos — 100/100", time: "hace 2h" },
  { type: "announcement", text: "Nuevo anuncio en Microeconomia: Cambio de salon", time: "hace 5h" },
  { type: "assignment", text: "Nueva tarea: Evidencia 1 en Vision Holistica", time: "hace 1d" },
];

function StatCard({ icon: Icon, label, value, sub }: { icon: typeof BookOpen; label: string; value: string; sub?: string }) {
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

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Inicio</h1>
        <p className="mt-1 text-sm text-muted">
          Tus clases de un vistazo. Ultima sincronizacion hace 12 min.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="Materias activas" value="4" />
        <StatCard icon={Clock} label="Entregas esta semana" value="3" sub="1 urgente" />
        <StatCard icon={AlertTriangle} label="Sin entregar" value="6" />
        <StatCard icon={TrendingUp} label="Promedio" value="98.5" sub="todas las materias" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Proximas entregas</h2>
            <Clock className="h-4 w-4 text-muted" />
          </div>
          <div className="divide-y divide-border">
            {mockUpcoming.map((item) => (
              <div key={item.name} className="flex items-start gap-3 px-5 py-4">
                <div
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    item.urgent ? "bg-danger" : "bg-warning"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted">
                    {item.course} &middot; {item.due}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-semibold">Actividad reciente</h2>
            <Bell className="h-4 w-4 text-muted" />
          </div>
          <div className="divide-y divide-border">
            {mockActivity.map((item) => (
              <div key={item.text} className="flex items-start gap-3 px-5 py-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-muted">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Tus materias</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mockCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm text-muted">{course.code}</p>
                </div>
                <Wifi className="h-4 w-4 text-success" />
              </div>
              <div className="mt-4 flex gap-4 text-sm text-muted">
                <span>{course.assignments} tareas</span>
                {course.pending > 0 && (
                  <span className="text-warning">
                    {course.pending} pendientes
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
