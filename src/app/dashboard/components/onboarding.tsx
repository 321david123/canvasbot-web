"use client";

import { useState, useEffect } from "react";
import {
  MonitorSmartphone,
  MessageSquare,
  Settings2,
  ChevronRight,
  ChevronLeft,
  Check,
  SkipForward,
  X,
  Copy,
  RefreshCw,
  Loader2,
  Wifi,
  WifiOff,
  Database,
} from "lucide-react";

interface OnboardingProps {
  userName: string;
  onComplete: () => void;
}

const TOTAL_STEPS = 3;

export function Onboarding({ userName, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [canvasConnected, setCanvasConnected] = useState(false);
  const [courseCount, setCourseCount] = useState(0);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [skipWhatsapp, setSkipWhatsapp] = useState(false);
  const [autoHomework, setAutoHomework] = useState(false);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  const steps = [
    { icon: MonitorSmartphone, label: "Canvas" },
    { icon: MessageSquare, label: "WhatsApp" },
    { icon: Settings2, label: "Listo" },
  ];

  async function checkStatus() {
    setChecking(true);
    try {
      const res = await fetch("/api/canvas/status");
      const data = await res.json();
      if (data.hasData) {
        setCanvasConnected(true);
        setCourseCount(data.courseCount);
        setLastSync(data.lastSync);
      }
    } catch {}
    setChecking(false);
  }

  useEffect(() => {
    checkStatus();
  }, []);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function timeAgo(dateStr: string | null) {
    if (!dateStr) return "nunca";
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 1) return "justo ahora";
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    return `hace ${Math.floor(hours / 24)}d`;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <button
          onClick={onComplete}
          className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:text-foreground"
        >
          Cerrar
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Progress bar */}
        <div className="flex h-1.5 w-full bg-border">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-colors duration-300 ${i <= step ? "bg-accent" : "bg-transparent"} ${i > 0 ? "ml-px" : ""}`}
            />
          ))}
        </div>

        {/* Step pills */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${i < step ? "bg-success/15 text-success" : i === step ? "bg-accent/15 text-accent" : "text-muted"}`}>
                  {i < step ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                  {s.label}
                </div>
              );
            })}
          </div>
          <span className="text-xs text-muted">{step + 1}/{TOTAL_STEPS}</span>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
          {/* ── Step 1: Canvas connection ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Paso 1 — Obligatorio
                </div>
                <h2 className="mt-3 text-xl font-bold">Conexión con Canvas</h2>
                <p className="mt-1 text-sm text-muted">
                  Los datos se suben desde el programa CanvasBot en tu computadora. Inicias sesión en Canvas ahí; esta web solo muestra lo que ya se sincronizó.
                </p>
              </div>

              {/* Connection status */}
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
                  canvasConnected ? "bg-success/10 text-success" : "bg-card-hover text-muted"
                }`}>
                  {canvasConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                  {canvasConnected ? "Conectado" : "No conectado"}
                </div>
                {canvasConnected && (
                  <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent">
                    <Database className="h-4 w-4" />
                    {courseCount} materias &middot; sincronizado {timeAgo(lastSync)}
                  </div>
                )}
              </div>

              {/* Terminal commands */}
              <div className="rounded-xl bg-background p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Para conectar o actualizar datos
                </p>
                <p className="text-sm text-muted">
                  En tu computadora, en la carpeta del proyecto CanvasBot, ejecuta en la terminal:
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <code className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs text-accent">
                    npm run canvas:login
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("npm run canvas:login")}
                    className="shrink-0 rounded-lg border border-border p-2 text-muted hover:bg-card-hover hover:text-foreground"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3 text-sm text-muted">
                  Luego, para escanear y subir datos a este dashboard:
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs text-accent">
                    npm run canvas:scrape && npm run sync
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("npm run canvas:scrape && npm run sync")}
                    className="shrink-0 rounded-lg border border-border p-2 text-muted hover:bg-card-hover hover:text-foreground"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>

                {copied && <p className="mt-2 text-xs text-success">Copiado</p>}
              </div>

              {/* Verify button */}
              <button
                type="button"
                onClick={checkStatus}
                disabled={checking}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Verificar conexión
              </button>
            </div>
          )}

          {/* ── Step 2: WhatsApp ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Paso 2 — Recomendado
                </div>
                <h2 className="mt-3 text-xl font-bold">Conecta WhatsApp</h2>
                <p className="mt-1 text-sm text-muted">
                  Recibe alertas y habla con la IA desde tu celular.
                </p>
              </div>

              {!skipWhatsapp ? (
                <>
                  <div className="rounded-xl bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Lo que recibes</p>
                    <ul className="space-y-2.5 text-sm">
                      {["Resumen cada mañana con tus pendientes", "Alerta si suben tarea o calificación", "Recordatorio antes de cada entrega", "Chat con IA sobre tus clases"].map((text) => (
                        <li key={text} className="flex gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span className="text-muted">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                    <p className="text-sm font-medium text-accent">Próximamente</p>
                    <p className="mt-1 text-xs text-muted">Por ahora puedes usar el chat de IA en este dashboard.</p>
                  </div>
                  <button type="button" onClick={() => setSkipWhatsapp(true)} className="flex w-full items-center justify-center gap-1.5 pt-1 text-xs text-muted transition-colors hover:text-foreground">
                    <SkipForward className="h-3 w-3" />
                    Saltar — solo usar el dashboard
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
                    <p className="text-sm text-warning">Sin WhatsApp solo podrás usar el dashboard web.</p>
                  </div>
                  <button type="button" onClick={() => setSkipWhatsapp(false)} className="text-sm text-accent hover:text-accent-hover">&larr; Quiero WhatsApp</button>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Done ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success">
                  Paso 3 — Último
                </div>
                <h2 className="mt-3 text-xl font-bold">Listo</h2>
                <p className="mt-1 text-sm text-muted">Configuración guardada.</p>
              </div>
              <div className="rounded-xl bg-background p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Tarea automática con IA</p>
                    <p className="mt-0.5 text-xs text-muted">El bot puede sugerir respuestas; tú apruebas antes de enviar.</p>
                  </div>
                  <button type="button" onClick={() => setAutoHomework(!autoHomework)} className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${autoHomework ? "bg-accent" : "bg-border"}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${autoHomework ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
              <div className="rounded-xl bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Resumen</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    {canvasConnected ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-red-500" />}
                    <span className={canvasConnected ? "" : "text-muted"}>Canvas {canvasConnected ? `conectado (${courseCount} materias)` : "— pendiente"}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-accent" />
                    <span>Tarea auto: <span className="font-medium">{autoHomework ? "activada" : "desactivada"}</span></span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          {step > 0 ? (
            <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground">
              <ChevronLeft className="h-4 w-4" /> Atrás
            </button>
          ) : <div />}
          {step < TOTAL_STEPS - 1 ? (
            <button type="button" onClick={() => setStep(step + 1)} className="flex h-10 items-center gap-1.5 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={onComplete} className="flex h-10 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
              <Check className="h-4 w-4" /> Empezar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
