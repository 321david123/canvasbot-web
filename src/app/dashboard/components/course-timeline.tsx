"use client";

import { useRef, useState, useEffect } from "react";
import {
  BookOpen,
  Bell,
  Mic,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertTriangle,
  Check,
  Clock,
} from "lucide-react";

export interface TimelineEvent {
  id: string;
  type: "assignment" | "announcement" | "lecture";
  title: string;
  date: string; // ISO
  meta?: string;
  status?: "submitted" | "graded" | "late" | "pending" | "not_submitted";
  score?: number | null;
  pointsPossible?: number | null;
  url?: string | null;
}

interface CourseTimelineProps {
  events: TimelineEvent[];
  courseName: string;
}

function groupByDate(events: TimelineEvent[]): Map<string, TimelineEvent[]> {
  const map = new Map<string, TimelineEvent[]>();
  for (const e of events) {
    const key = new Date(e.date).toLocaleDateString("es-MX", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const arr = map.get(key) ?? [];
    arr.push(e);
    map.set(key, arr);
  }
  return map;
}

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isPast(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

function EventIcon({ type }: { type: TimelineEvent["type"] }) {
  if (type === "assignment") return <BookOpen className="h-3.5 w-3.5" />;
  if (type === "announcement") return <Bell className="h-3.5 w-3.5" />;
  return <Mic className="h-3.5 w-3.5" />;
}

function StatusBadge({ event }: { event: TimelineEvent }) {
  if (event.type !== "assignment") return null;

  if (event.status === "submitted" || event.status === "graded") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
        <Check className="h-2.5 w-2.5" />
        {event.score != null && event.pointsPossible
          ? `${event.score}/${event.pointsPossible}`
          : "Entregado"}
      </span>
    );
  }

  if (event.status === "late") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
        <AlertTriangle className="h-2.5 w-2.5" />
        Tarde
      </span>
    );
  }

  const due = new Date(event.date);
  const now = new Date();
  const hoursLeft = (due.getTime() - now.getTime()) / 3600000;

  if (hoursLeft < 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-medium text-danger">
        <AlertTriangle className="h-2.5 w-2.5" />
        Vencida
      </span>
    );
  }

  if (hoursLeft < 24) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-medium text-danger">
        <Clock className="h-2.5 w-2.5" />
        Urgente
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
      <Clock className="h-2.5 w-2.5" />
      Pendiente
    </span>
  );
}

function typeLabel(type: TimelineEvent["type"]) {
  if (type === "assignment") return "Tarea";
  if (type === "announcement") return "Anuncio";
  return "Clase";
}

function typeColor(type: TimelineEvent["type"]) {
  if (type === "assignment") return "bg-accent";
  if (type === "announcement") return "bg-warning";
  return "bg-success";
}

export function CourseTimeline({ events, courseName }: CourseTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const grouped = groupByDate(sorted);
  const dateKeys = Array.from(grouped.keys());

  function updateScrollState() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollState, { passive: true });
      return () => el.removeEventListener("scroll", updateScrollState);
    }
  }, []);

  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const todayEl = todayRef.current;
      const offset = todayEl.offsetLeft - container.clientWidth / 3;
      container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  }, []);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-8 py-16 text-center">
        <FileText className="mb-4 h-10 w-10 text-muted" />
        <h3 className="text-lg font-semibold">Sin eventos todavia</h3>
        <p className="mt-1 text-sm text-muted">
          Conecta Canvas para ver la linea de tiempo de {courseName}.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Scroll buttons */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-lg transition-colors hover:bg-card-hover"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card p-2 shadow-lg transition-colors hover:bg-card-hover"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Fade edges */}
      {canScrollLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-16 bg-gradient-to-r from-background to-transparent" />
      )}
      {canScrollRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-16 bg-gradient-to-l from-background to-transparent" />
      )}

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="flex gap-0 overflow-x-auto scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {dateKeys.map((dateKey, idx) => {
          const dayEvents = grouped.get(dateKey) ?? [];
          const firstEvent = dayEvents[0];
          const today = isToday(firstEvent.date);
          const past = isPast(firstEvent.date) && !today;

          return (
            <div
              key={dateKey}
              ref={today ? todayRef : undefined}
              className="flex shrink-0 flex-col items-center"
              style={{ minWidth: 240 }}
            >
              {/* Timeline connector */}
              <div className="flex w-full items-center">
                {/* Left line */}
                <div
                  className={`h-px flex-1 ${idx === 0 ? "bg-transparent" : past ? "bg-border" : "bg-accent/30"}`}
                />
                {/* Dot */}
                <div
                  className={`relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    today
                      ? "border-accent bg-accent text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]"
                      : past
                        ? "border-border bg-card text-muted"
                        : "border-accent/40 bg-card text-accent"
                  }`}
                >
                  <span className="text-xs font-bold">
                    {new Date(firstEvent.date).getDate()}
                  </span>
                </div>
                {/* Right line */}
                <div
                  className={`h-px flex-1 ${idx === dateKeys.length - 1 ? "bg-transparent" : past ? "bg-border" : "bg-accent/30"}`}
                />
              </div>

              {/* Date label */}
              <p
                className={`mt-2 text-xs font-medium ${
                  today ? "text-accent" : "text-muted"
                }`}
              >
                {today ? "Hoy" : dateKey}
              </p>

              {/* Event cards */}
              <div className="mt-3 w-full space-y-2 px-2">
                {dayEvents.map((event) => (
                  <div
                    key={`${event.type}-${event.id}`}
                    className={`group rounded-xl border px-3.5 py-3 transition-colors ${
                      today
                        ? "border-accent/20 bg-accent/5 hover:bg-accent/10"
                        : "border-border bg-card hover:bg-card-hover"
                    }`}
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-md text-white ${typeColor(event.type)}`}
                      >
                        <EventIcon type={event.type} />
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                        {typeLabel(event.type)}
                      </span>
                      <StatusBadge event={event} />
                    </div>

                    <p className="text-sm font-medium leading-snug line-clamp-2">
                      {event.title}
                    </p>

                    {event.meta && (
                      <p className="mt-1 text-xs text-muted line-clamp-1">
                        {event.meta}
                      </p>
                    )}

                    <p className="mt-1.5 text-[10px] text-muted">
                      {new Date(event.date).toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
