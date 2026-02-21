import { Bell } from "lucide-react";

const mockAnnouncements = [
  {
    id: "1",
    title: "Cambio de salon para clase del jueves",
    course: "Microeconomia (Gpo 401)",
    date: "2026-02-15T10:30:00",
    preview:
      "Estimados alumnos, les informo que la clase del jueves 20 de febrero sera en el salon 14305 en lugar del salon habitual...",
  },
  {
    id: "2",
    title: "Recordatorio: Entrega de TI 1",
    course: "Vision holistica del consumidor (Gpo 102)",
    date: "2026-02-14T09:00:00",
    preview:
      "Recuerden que la entrega de TI 1 sobre Tendencias globales es este viernes. Asegurense de subir su documento en formato PDF...",
  },
  {
    id: "3",
    title: "Material adicional: Funciones en Python",
    course: "Pensamiento computacional para ingenieria (Gpo 402)",
    date: "2026-02-13T14:00:00",
    preview:
      "Les comparto material adicional sobre funciones en Python que veremos en las proximas clases. Revisen los ejemplos antes de la sesion...",
  },
  {
    id: "4",
    title: "Bienvenida al curso",
    course: "Modelacion matematica fundamental (Gpo 401)",
    date: "2026-02-03T08:00:00",
    preview:
      "Bienvenidos al curso de Modelacion matematica fundamental. En este curso aprenderemos los fundamentos de...",
  },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Justo ahora";
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ayer";
  return `hace ${days} dias`;
}

export default function AnnouncementsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Anuncios</h1>
        <p className="mt-1 text-sm text-muted">
          Los anuncios mas recientes de todas tus materias.
        </p>
      </div>

      <div className="space-y-4">
        {mockAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <Bell className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">{ann.title}</h3>
                <p className="mt-0.5 text-sm text-muted">
                  {ann.course} &middot; {timeAgo(ann.date)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted/80">
                  {ann.preview}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
