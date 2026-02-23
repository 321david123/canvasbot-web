"use client";

import { useState, useEffect, useRef } from "react";
import {
  MonitorSmartphone,
  MessageSquare,
  Settings2,
  ChevronRight,
  ChevronLeft,
  Check,
  SkipForward,
  X,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

interface OnboardingProps {
  userName: string;
  onComplete: () => void;
}

const TOTAL_STEPS = 3;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://canvasbot-api.fly.dev";

export function Onboarding({ userName, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [canvasConnected, setCanvasConnected] = useState(false);
  const [courseCount, setCourseCount] = useState(0);
  const [skipWhatsapp, setSkipWhatsapp] = useState(false);
  const [autoHomework, setAutoHomework] = useState(false);

  // Canvas login form
  const [canvasEmail, setCanvasEmail] = useState("");
  const [canvasPassword, setCanvasPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [canvasUrl] = useState("https://experiencia21.tec.mx");

  // Job tracking
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobMessage, setJobMessage] = useState("");
  const [jobError, setJobError] = useState("");
  const [connecting, setConnecting] = useState(false);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    { icon: MonitorSmartphone, label: "Canvas" },
    { icon: MessageSquare, label: "WhatsApp" },
    { icon: Settings2, label: "Listo" },
  ];

  async function checkStatus() {
    try {
      const res = await fetch("/api/canvas/status");
      const data = await res.json();
      if (data.hasData) {
        setCanvasConnected(true);
        setCourseCount(data.courseCount);
      }
    } catch {}
  }

  useEffect(() => {
    checkStatus();
  }, []);

  // Poll job status
  useEffect(() => {
    if (!jobId) return;

    async function poll() {
      try {
        const res = await fetch(`${API_URL}/api/job/${jobId}`);
        const data = await res.json();
        setJobStatus(data.status);
        setJobMessage(data.message);

        if (data.status === "done") {
          setConnecting(false);
          setCanvasConnected(true);
          setCourseCount(data.result?.courses || 0);
          if (pollRef.current) clearInterval(pollRef.current);
        } else if (data.status === "error") {
          setConnecting(false);
          setJobError(data.message);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // Network error, keep polling
      }
    }

    pollRef.current = setInterval(poll, 2000);
    poll();

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId]);

  async function handleConnect() {
    if (!canvasEmail || !canvasPassword) {
      setJobError("Ingresa tu correo y contrasena.");
      return;
    }

    setConnecting(true);
    setJobError("");
    setJobMessage("Enviando...");

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setJobError("Sesion expirada. Recarga la pagina.");
        setConnecting(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: canvasEmail,
          password: canvasPassword,
          canvasUrl,
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setJobError(data.error);
        setConnecting(false);
        return;
      }

      setJobId(data.jobId);
      setJobStatus("pending");
      setJobMessage("En cola...");
    } catch (e: any) {
      setJobError("No se pudo conectar al servidor. Intenta de nuevo.");
      setConnecting(false);
    }
  }

  function getStatusIcon() {
    if (jobStatus === "login") return <Loader2 className="h-4 w-4 animate-spin text-accent" />;
    if (jobStatus === "scraping") return <Loader2 className="h-4 w-4 animate-spin text-accent" />;
    if (jobStatus === "done") return <Check className="h-4 w-4 text-success" />;
    if (jobStatus === "error") return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <Loader2 className="h-4 w-4 animate-spin text-muted" />;
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
              className={`h-full flex-1 transition-colors duration-300 ${i <= step ? "bg-accent" : "bg-transparent"} ${i > 0 ? "ml-px" : ""}`}
            />
          ))}
        </div>

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
          {/* Step 1: Canvas login */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Paso 1 — Obligatorio
                </div>
                <h2 className="mt-3 text-xl font-bold">Conecta tu Canvas</h2>
                <p className="mt-1 text-sm text-muted">
                  Ingresa tus credenciales del Tec. Nuestro servidor abre Canvas, lee todas tus materias, tareas y anuncios, y los trae aqui.
                </p>
              </div>

              {canvasConnected ? (
                <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3 ring-1 ring-success/20">
                  <Check className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-success">Canvas conectado</p>
                    <p className="text-xs text-muted">{courseCount} materias sincronizadas.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted">Correo del Tec</label>
                      <input
                        type="email"
                        value={canvasEmail}
                        onChange={(e) => setCanvasEmail(e.target.value)}
                        placeholder="A01234567@tec.mx"
                        disabled={connecting}
                        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted">Contrasena del Tec / Microsoft</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={canvasPassword}
                          onChange={(e) => setCanvasPassword(e.target.value)}
                          placeholder="Tu contrasena institucional"
                          disabled={connecting}
                          className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-10 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-xl bg-background px-3 py-2.5">
                    <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
                    <p className="text-xs text-muted">
                      Tus credenciales se usan solo para iniciar sesion en Canvas una vez. No las almacenamos. Si Microsoft pide 2FA, aprueba en tu celular.
                    </p>
                  </div>

                  {/* Job progress */}
                  {connecting && (
                    <div className="space-y-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className="text-sm font-medium">
                          {jobStatus === "login" && "Iniciando sesion..."}
                          {jobStatus === "scraping" && "Leyendo Canvas..."}
                          {jobStatus === "pending" && "En cola..."}
                          {!jobStatus && "Conectando..."}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{jobMessage}</p>
                      {jobStatus === "login" && (
                        <p className="text-xs text-accent">Si Microsoft pide aprobacion en tu telefono, apruebala ahora.</p>
                      )}
                    </div>
                  )}

                  {jobError && (
                    <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                      <p className="text-sm text-red-400">{jobError}</p>
                    </div>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={connecting || !canvasEmail || !canvasPassword}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Conectando...
                      </>
                    ) : (
                      <>
                        <MonitorSmartphone className="h-4 w-4" />
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
                <h2 className="mt-3 text-xl font-bold">Conecta WhatsApp</h2>
                <p className="mt-1 text-sm text-muted">
                  Recibe alertas de tareas y platica con la IA desde tu celular.
                </p>
              </div>

              {!skipWhatsapp ? (
                <>
                  <div className="rounded-xl bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Lo que recibes</p>
                    <ul className="space-y-2.5 text-sm">
                      {[
                        "Resumen cada manana con tus pendientes",
                        "Alerta al instante si suben tarea o calificacion",
                        "Recordatorio antes de cada entrega",
                        "Chat con IA sobre tus clases",
                      ].map((text) => (
                        <li key={text} className="flex gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span className="text-muted">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                    <p className="text-sm font-medium text-accent">Proximamente</p>
                    <p className="mt-1 text-xs text-muted">
                      La conexion de WhatsApp estara disponible pronto. Por ahora puedes usar el chat de IA desde el dashboard.
                    </p>
                  </div>

                  <button onClick={() => setSkipWhatsapp(true)} className="flex w-full items-center justify-center gap-1.5 pt-1 text-xs text-muted transition-colors hover:text-foreground">
                    <SkipForward className="h-3 w-3" />
                    Saltar — solo usar el dashboard
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
                    <p className="text-sm text-warning">Sin WhatsApp solo podras usar el dashboard web.</p>
                  </div>
                  <button onClick={() => setSkipWhatsapp(false)} className="text-sm text-accent hover:text-accent-hover">&larr; Mejor si quiero WhatsApp</button>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Done */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success">
                  Paso 3 — Ultimo
                </div>
                <h2 className="mt-3 text-xl font-bold">Listo!</h2>
                <p className="mt-1 text-sm text-muted">Tu bot esta configurado.</p>
              </div>

              <div className="rounded-xl bg-background p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Tarea automatica con IA</p>
                    <p className="mt-0.5 text-xs text-muted">El bot intenta resolver ejercicios. Tu apruebas antes de enviar.</p>
                  </div>
                  <button onClick={() => setAutoHomework(!autoHomework)} className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${autoHomework ? "bg-accent" : "bg-border"}`}>
                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${autoHomework ? "translate-x-5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Tu configuracion</p>
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

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground">
              <ChevronLeft className="h-4 w-4" /> Atras
            </button>
          ) : <div />}

          {step < TOTAL_STEPS - 1 ? (
            <button onClick={() => setStep(step + 1)} className="flex h-10 items-center gap-1.5 rounded-xl bg-accent px-5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={onComplete} className="flex h-10 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-semibold text-white transition-colors hover:bg-accent-hover">
              <Check className="h-4 w-4" /> Empezar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
