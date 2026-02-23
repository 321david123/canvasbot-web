"use client";

import { useState, useEffect } from "react";
import {
  MonitorSmartphone,
  MessageSquare,
  Settings2,
  ChevronRight,
  ChevronLeft,
  Check,
  Key,
  SkipForward,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface OnboardingProps {
  userName: string;
  onComplete: () => void;
}

const TOTAL_STEPS = 3;

export function Onboarding({ userName, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [canvasUrl, setCanvasUrl] = useState("https://experiencia21.tec.mx");
  const [accessToken, setAccessToken] = useState("");
  const [canvasConnected, setCanvasConnected] = useState(false);
  const [canvasLoading, setCanvasLoading] = useState(false);
  const [canvasError, setCanvasError] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [skipWhatsapp, setSkipWhatsapp] = useState(false);
  const [autoHomework, setAutoHomework] = useState(false);

  const steps = [
    { icon: MonitorSmartphone, label: "Canvas" },
    { icon: MessageSquare, label: "WhatsApp" },
    { icon: Settings2, label: "Listo" },
  ];

  useEffect(() => {
    fetch("/api/canvas/status")
      .then((r) => r.json())
      .then((data) => {
        if (data.canvasConnected && data.hasData) {
          setCanvasConnected(true);
          setSyncResult(`${data.courseCount} materias conectadas.`);
        }
      })
      .catch(() => {});
  }, []);

  async function handleConnect() {
    if (!accessToken.trim()) {
      setCanvasError("Pega tu token de Canvas.");
      return;
    }
    setCanvasLoading(true);
    setCanvasError(null);

    try {
      const res = await fetch("/api/canvas/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvasUrl: canvasUrl.trim(), accessToken: accessToken.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCanvasError(data.error || "Error al conectar.");
        setCanvasLoading(false);
        return;
      }

      // Now sync data
      setSyncLoading(true);
      const syncRes = await fetch("/api/canvas/sync", { method: "POST" });
      const syncData = await syncRes.json();

      if (syncData.ok) {
        setCanvasConnected(true);
        setSyncResult(`${syncData.courses} materias, ${syncData.assignments} tareas, ${syncData.announcements} anuncios.`);
      } else {
        setCanvasError(syncData.error || "Error al sincronizar.");
      }
    } catch {
      setCanvasError("Error de conexion.");
    } finally {
      setCanvasLoading(false);
      setSyncLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <button
          onClick={onComplete}
          className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:text-foreground"
        >
          Saltar
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="flex h-1.5 w-full bg-border">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-colors duration-300 ${
                i <= step ? "bg-accent" : "bg-transparent"
              } ${i > 0 ? "ml-px" : ""}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    i < step ? "bg-success/15 text-success" : i === step ? "bg-accent/15 text-accent" : "text-muted"
                  }`}
                >
                  {i < step ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                  {s.label}
                </div>
              );
            })}
          </div>
          <span className="text-xs text-muted">{step + 1}/{TOTAL_STEPS}</span>
        </div>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
          {/* Step 1: Canvas token */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Paso 1 — Obligatorio
                </div>
                <h2 className="mt-3 text-xl font-bold">Conecta tu Canvas</h2>
                <p className="mt-1 text-sm text-muted">
                  Necesitamos un token de acceso para leer tus materias. Es seguro — tu lo generas y lo puedes revocar cuando quieras.
                </p>
              </div>

              {canvasConnected ? (
                <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3 ring-1 ring-success/20">
                  <Check className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-success">Canvas conectado</p>
                    <p className="text-xs text-muted">{syncResult}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Como generar tu token (30 segundos)
                    </p>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">1</span>
                        <span>
                          Abre{" "}
                          <a
                            href={`${canvasUrl}/profile/settings`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-accent hover:underline"
                          >
                            Canvas &rarr; Configuracion
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">2</span>
                        <span>Baja hasta &ldquo;Approved Integrations&rdquo; o &ldquo;Integraciones aprobadas&rdquo;</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">3</span>
                        <span>Click en &ldquo;+ New Access Token&rdquo;, pon cualquier nombre, y click en &ldquo;Generate Token&rdquo;</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">4</span>
                        <span>Copia el token y pegalo aqui abajo</span>
                      </li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">URL de Canvas</label>
                      <input
                        type="url"
                        value={canvasUrl}
                        onChange={(e) => setCanvasUrl(e.target.value)}
                        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">Token de acceso</label>
                      <input
                        type="password"
                        value={accessToken}
                        onChange={(e) => setAccessToken(e.target.value)}
                        placeholder="Pega tu token aqui..."
                        className="h-11 w-full rounded-xl border border-border bg-background px-4 font-mono text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                      />
                    </div>
                  </div>

                  {canvasError && (
                    <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{canvasError}</p>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={canvasLoading || syncLoading || !accessToken.trim()}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                  >
                    {canvasLoading || syncLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {syncLoading ? "Leyendo materias..." : "Verificando token..."}
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4" />
                        Conectar Canvas
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* Step 2: WhatsApp */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Paso 2 — Recomendado
                </div>
                <h2 className="mt-3 text-xl font-bold">WhatsApp (proximamente)</h2>
                <p className="mt-1 text-sm text-muted">
                  Pronto podras recibir alertas, recordatorios y preguntar desde WhatsApp. Por ahora, usa el chat en el dashboard.
                </p>
              </div>

              <div className="rounded-xl bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Lo que viene
                </p>
                <ul className="space-y-2.5 text-sm">
                  {[
                    "Resumen cada manana con tus pendientes",
                    "Alerta al instante si suben tarea o calificacion",
                    "Recordatorio antes de cada entrega",
                    "Chat directo con IA sobre tus clases",
                  ].map((text) => (
                    <li key={text} className="flex gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-muted">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-center text-sm text-muted">
                Por ahora, puedes usar el <strong>Chat IA</strong> en el dashboard para preguntar lo que sea sobre tus clases.
              </p>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success">
                  Paso 3 — Ultimo
                </div>
                <h2 className="mt-3 text-xl font-bold">Personaliza tu bot</h2>
                <p className="mt-1 text-sm text-muted">
                  Puedes cambiar todo despues en Ajustes.
                </p>
              </div>

              <div className="rounded-xl bg-background p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Tarea automatica con IA</p>
                    <p className="mt-0.5 text-xs text-muted">
                      El bot intenta resolver quizzes y ejercicios. Tu siempre apruebas antes de que se envie.
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoHomework(!autoHomework)}
                    className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
                      autoHomework ? "bg-accent" : "bg-border"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        autoHomework ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                {autoHomework && (
                  <p className="mt-3 rounded-lg bg-warning/5 px-3 py-2 text-xs text-warning ring-1 ring-warning/20">
                    Nunca se envia nada sin tu aprobacion.
                  </p>
                )}
              </div>

              <div className="rounded-xl bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Tu configuracion
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    {canvasConnected ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-danger" />
                    )}
                    <span className={canvasConnected ? "" : "text-muted"}>
                      Canvas {canvasConnected ? "conectado" : "— no conectado"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-accent" />
                    <span>
                      Tarea auto: <span className="font-medium">{autoHomework ? "activada" : "desactivada"}</span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
              Atras
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex h-10 items-center gap-1.5 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onComplete}
              className="flex h-10 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Check className="h-4 w-4" />
              Empezar a usar CanvasBot
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
