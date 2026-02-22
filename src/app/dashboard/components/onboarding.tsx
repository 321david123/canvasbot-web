"use client";

import { useState } from "react";
import {
  GraduationCap,
  MonitorSmartphone,
  MessageSquare,
  Settings2,
  ChevronRight,
  ChevronLeft,
  Check,
  ExternalLink,
  QrCode,
  SkipForward,
  X,
} from "lucide-react";

interface OnboardingProps {
  userName: string;
  onComplete: () => void;
}

const TOTAL_STEPS = 3;

export function Onboarding({ userName, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [canvasConnected, setCanvasConnected] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("+52");
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [skipWhatsapp, setSkipWhatsapp] = useState(false);
  const [autoHomework, setAutoHomework] = useState(false);

  const steps = [
    { icon: MonitorSmartphone, label: "Canvas" },
    { icon: MessageSquare, label: "WhatsApp" },
    { icon: Settings2, label: "Listo" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* Modal card */}
      <div className="relative mx-4 w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Skip button */}
        <button
          onClick={onComplete}
          className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:text-foreground"
          title="Saltar configuracion"
        >
          Saltar
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Top progress bar */}
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

        {/* Step label bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-3">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    i < step
                      ? "bg-success/15 text-success"
                      : i === step
                      ? "bg-accent/15 text-accent"
                      : "text-muted"
                  }`}
                >
                  {i < step ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Icon className="h-3 w-3" />
                  )}
                  {s.label}
                </div>
              );
            })}
          </div>
          <span className="text-xs text-muted">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>

        {/* Content */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
          {/* ─── Step 1: Canvas ─── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Paso 1 — Obligatorio
                </div>
                <h2 className="mt-3 text-xl font-bold">
                  Inicia sesion en Canvas
                </h2>
                <p className="mt-1 text-sm text-muted">
                  El bot necesita entrar a tu Canvas para leer tus materias. Sin
                  esto, nada funciona.
                </p>
              </div>

              <div className="rounded-xl bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Asi funciona
                </p>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      1
                    </span>
                    <span>
                      Se abre una ventana del navegador con la pagina del Tec
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      2
                    </span>
                    <span>
                      Inicias sesion con tu cuenta normal — no guardamos tu
                      contrasena
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                      3
                    </span>
                    <span>
                      El bot guarda la sesion y empieza a leer todo
                      automaticamente
                    </span>
                  </li>
                </ol>
              </div>

              {!canvasConnected ? (
                <button
                  onClick={() => setCanvasConnected(true)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir Canvas e iniciar sesion
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3 ring-1 ring-success/20">
                  <Check className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-success">
                      Canvas conectado
                    </p>
                    <p className="text-xs text-muted">
                      4 materias encontradas. El bot ya esta leyendo todo.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Step 2: WhatsApp ─── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  Paso 2 — Recomendado
                </div>
                <h2 className="mt-3 text-xl font-bold">Conecta WhatsApp</h2>
                <p className="mt-1 text-sm text-muted">
                  Recibe todo directo en tu celular: recordatorios, alertas,
                  resumen diario, y puedes preguntarle lo que sea.
                </p>
              </div>

              {!skipWhatsapp ? (
                <>
                  <div className="rounded-xl bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Lo que vas a recibir por WhatsApp
                    </p>
                    <ul className="space-y-2.5 text-sm">
                      {[
                        "Resumen cada manana con tus pendientes del dia",
                        "Alerta al instante si suben tarea, anuncio o calificacion",
                        "Recordatorio antes de cada entrega",
                        "Chat directo — preguntale lo que sea sobre tus clases",
                      ].map((text) => (
                        <li key={text} className="flex gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                          <span className="text-muted">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Tu numero de WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      placeholder="+52 81 1234 5678"
                      className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
                    />
                    <p className="mt-1 text-xs text-muted">
                      Con codigo de pais (+52 Mexico)
                    </p>
                  </div>

                  <div className="rounded-xl bg-background p-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Como conectarlo
                    </p>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                          1
                        </span>
                        <span>Da click en el boton de abajo — aparece un QR</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                          2
                        </span>
                        <span>
                          En WhatsApp abre Ajustes &rarr; Dispositivos vinculados
                          &rarr; Vincular
                        </span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                          3
                        </span>
                        <span>Escaneas el QR y listo</span>
                      </li>
                    </ol>
                  </div>

                  {!whatsappConnected ? (
                    <button
                      onClick={() => setWhatsappConnected(true)}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
                    >
                      <QrCode className="h-4 w-4" />
                      Mostrar codigo QR
                    </button>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3 ring-1 ring-success/20">
                      <Check className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm font-semibold text-success">
                          WhatsApp conectado
                        </p>
                        <p className="text-xs text-muted">
                          Te mandamos un mensaje de prueba.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSkipWhatsapp(true)}
                    className="flex w-full items-center justify-center gap-1.5 pt-1 text-xs text-muted transition-colors hover:text-foreground"
                  >
                    <SkipForward className="h-3 w-3" />
                    Saltar — solo quiero usar el navegador
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
                    <p className="text-sm text-warning">
                      Sin WhatsApp solo podras usar el dashboard. No recibiras
                      alertas, resumen diario ni podras preguntar desde tu
                      celular.
                    </p>
                  </div>
                  <button
                    onClick={() => setSkipWhatsapp(false)}
                    className="text-sm text-accent transition-colors hover:text-accent-hover"
                  >
                    &larr; Mejor si quiero conectar WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── Step 3: Preferences ─── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-success">
                  Paso 3 — Ultimo
                </div>
                <h2 className="mt-3 text-xl font-bold">
                  Personaliza tu bot
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Ajusta como funciona antes de empezar. Puedes cambiar todo
                  despues en Ajustes.
                </p>
              </div>

              {/* Auto-homework toggle */}
              <div className="rounded-xl bg-background p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">
                      Tarea automatica con IA
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      El bot intenta hacer quizzes y ejercicios simples. Tu
                      siempre apruebas antes de que se envie.
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

              {/* Daily digest time */}
              <div className="rounded-xl bg-background p-4">
                <p className="text-sm font-semibold">Resumen diario</p>
                <p className="mt-0.5 text-xs text-muted">
                  A que hora quieres recibir tu resumen de pendientes?
                </p>
                <select
                  defaultValue="7"
                  className="mt-3 h-10 w-full rounded-xl border border-border bg-card px-3 text-sm outline-none transition-colors focus:border-accent"
                >
                  <option value="6">6:00 AM</option>
                  <option value="7">7:00 AM</option>
                  <option value="8">8:00 AM</option>
                  <option value="9">9:00 AM</option>
                </select>
              </div>

              {/* Summary of what's set up */}
              <div className="rounded-xl bg-background p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                  Resumen de tu configuracion
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    {canvasConnected ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <X className="h-4 w-4 text-danger" />
                    )}
                    <span className={canvasConnected ? "" : "text-muted"}>
                      Canvas{" "}
                      {canvasConnected ? "conectado" : "— no conectado"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    {whatsappConnected ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : skipWhatsapp ? (
                      <SkipForward className="h-4 w-4 text-muted" />
                    ) : (
                      <X className="h-4 w-4 text-danger" />
                    )}
                    <span
                      className={whatsappConnected ? "" : "text-muted"}
                    >
                      WhatsApp{" "}
                      {whatsappConnected
                        ? "conectado"
                        : skipWhatsapp
                        ? "— omitido"
                        : "— no conectado"}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-accent" />
                    <span>
                      Tarea auto:{" "}
                      <span className="font-medium">
                        {autoHomework ? "activada" : "desactivada"}
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer with nav buttons */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
            >
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
