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
  Terminal,
  RefreshCw,
  Loader2,
  Copy,
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
      }
    } catch {}
    setChecking(false);
  }

  useEffect(() => { checkStatus(); }, []);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          {/* Step 1: Canvas setup */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Paso 1 — Obligatorio
                </div>
                <h2 className="mt-3 text-xl font-bold">Conecta tu Canvas</h2>
                <p className="mt-1 text-sm text-muted">
                  CanvasBot navega tu Canvas como si fueras tu, sin usar APIs bloqueadas. Corre un programa en tu computadora que lee todo y lo sube aqui.
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
                  <div className="rounded-xl bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      En tu terminal, corre estos comandos
                    </p>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">1</span>
                        <div className="min-w-0 flex-1">
                          <p>Clona el proyecto (solo la primera vez)</p>
                          <button onClick={() => copyToClipboard("git clone https://github.com/321david123/canvasbot-web.git canvasbot && cd canvasbot && npm install")} className="mt-1.5 flex w-full items-center gap-2 rounded-lg bg-card px-3 py-2 text-left font-mono text-xs text-accent hover:bg-card-hover">
                            <Terminal className="h-3 w-3 shrink-0" />
                            <span className="truncate">git clone ... && npm install</span>
                            <Copy className="ml-auto h-3 w-3 shrink-0 text-muted" />
                          </button>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">2</span>
                        <div className="min-w-0 flex-1">
                          <p>Configura tu .env con tus datos de Supabase</p>
                          <p className="mt-1 text-xs text-muted">Copia .env.example a .env y llena SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_EMAIL (tu correo tec), SUPABASE_PASSWORD</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">3</span>
                        <div className="min-w-0 flex-1">
                          <p>Inicia sesion en Canvas (se abre un navegador)</p>
                          <button onClick={() => copyToClipboard("npm run canvas:login")} className="mt-1.5 flex w-full items-center gap-2 rounded-lg bg-card px-3 py-2 text-left font-mono text-xs text-accent hover:bg-card-hover">
                            <Terminal className="h-3 w-3 shrink-0" />
                            npm run canvas:login
                            <Copy className="ml-auto h-3 w-3 shrink-0 text-muted" />
                          </button>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">4</span>
                        <div className="min-w-0 flex-1">
                          <p>Escanea Canvas y sincroniza al dashboard</p>
                          <button onClick={() => copyToClipboard("npm run canvas:scrape && npm run sync")} className="mt-1.5 flex w-full items-center gap-2 rounded-lg bg-card px-3 py-2 text-left font-mono text-xs text-accent hover:bg-card-hover">
                            <Terminal className="h-3 w-3 shrink-0" />
                            npm run canvas:scrape && npm run sync
                            <Copy className="ml-auto h-3 w-3 shrink-0 text-muted" />
                          </button>
                        </div>
                      </li>
                    </ol>
                    {copied && <p className="mt-2 text-center text-xs text-success">Copiado!</p>}
                  </div>

                  <button
                    onClick={checkStatus}
                    disabled={checking}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
                  >
                    {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Ya lo hice — verificar conexion
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
                  Recibe alertas y habla con la IA desde tu celular.
                </p>
              </div>

              {!skipWhatsapp ? (
                <>
                  <div className="rounded-xl bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Lo que recibes</p>
                    <ul className="space-y-2.5 text-sm">
                      {["Resumen cada manana con tus pendientes", "Alerta al instante si suben tarea o calificacion", "Recordatorio antes de cada entrega", "Chat con IA sobre tus clases"].map((text) => (
                        <li key={text} className="flex gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span className="text-muted">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-background p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Como activarlo</p>
                    <p className="text-sm text-muted">
                      En tu terminal corre{" "}
                      <code className="rounded bg-card px-1.5 py-0.5 text-xs text-accent">npm run whatsapp</code>{" "}
                      — aparece un QR que escaneas desde WhatsApp &rarr; Dispositivos vinculados.
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
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Para mantener datos frescos</p>
                <p className="text-sm text-muted">
                  Corre{" "}
                  <code className="rounded bg-card px-1.5 py-0.5 text-xs text-accent">npm run scheduler</code>{" "}
                  en tu computadora. Escanea Canvas cada 30 min y sincroniza automaticamente.
                </p>
              </div>

              <div className="rounded-xl bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Tu configuracion</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    {canvasConnected ? <Check className="h-4 w-4 text-success" /> : <X className="h-4 w-4 text-danger" />}
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
