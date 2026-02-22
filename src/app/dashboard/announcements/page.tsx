import { Bell } from "lucide-react";
import { getAnnouncements, getCourseMap } from "@/lib/bot-db";

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Justo ahora";
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ayer";
  return `hace ${days} dias`;
}

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);
}

export const dynamic = "force-dynamic";

export default function AnnouncementsPage() {
  const announcements = getAnnouncements();
  const courseMap = getCourseMap();

  if (announcements.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Anuncios</h1>
          <p className="mt-1 text-sm text-muted">
            No hay anuncios todavia. Conecta Canvas para ver los anuncios de tus materias.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Anuncios</h1>
        <p className="mt-1 text-sm text-muted">
          Los anuncios mas recientes de todas tus materias — {announcements.length} en total.
        </p>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-card-hover"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                <Bell className="h-4 w-4 text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold">{ann.title}</h3>
                <p className="mt-0.5 text-sm text-muted">
                  {courseMap.get(ann.course_id) ?? ann.course_id} &middot;{" "}
                  {timeAgo(ann.posted_at)}
                </p>
                {ann.body_html && (
                  <p className="mt-2 text-sm leading-relaxed text-muted/80">
                    {stripHtml(ann.body_html)}
                    {(ann.body_html?.length ?? 0) > 200 ? "..." : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
