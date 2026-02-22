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
  Smartphone,
  QrCode,
  Bot,
  Zap,
  SkipForward,
  AlertCircle,
} from "lucide-react";

interface OnboardingProps {
  userName: string;
  onComplete: () => void;
}

export function Onboarding({ userName, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [canvasConnected, setCanvasConnected] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("+52");
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [skipWhatsapp, setSkipWhatsapp] = useState(false);
  const [autoHomework, setAutoHomework] = useState(false);

  const steps = [
    { icon: MonitorSmartphone, label: "Conectar Canvas" },
    { icon: MessageSquare, label: "WhatsApp" },
    { icon: Settings2, label: "Preferencias" },
  ];

  function handleFinish() {
    onComplete();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            {step === 0 && `Bienvenido, ${userName.split(" ")[0]}!`}
            {step === 1 && "Conecta WhatsApp"}
            {step === 2 && "Ultimos ajustes"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {step === 0 && "Vamos a configurar tu CanvasBot en 3 pasos rapidos"}
            {step === 1 && "Recibe alertas y pregunta desde WhatsApp"}
            {step === 2 && "Personaliza como funciona tu bot"}
          </p>
        </div>

        {/* Step indicators */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  i < step
                    ? "bg-success text-white"
                    : i === step
                    ? "bg-accent text-white"
                    : "bg-card text-muted"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`hidden text-sm sm:block ${
                  i === step ? "font-medium text-foreground" : "text-muted"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`mx-1 h-px w-8 ${
                    i < step ? "bg-success" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          {/* Step 0: Canvas */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-medium">
                      Primero necesitas conectar tu Canvas
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      Para que el bot pueda leer tus materias, tareas y
                      calificaciones, necesita acceso a tu Canvas. Vas a iniciar
                      sesion en una ventana segura — nosotros guardamos la sesion
                      encriptada para que el bot pueda entrar despues sin tu
                      contrasena.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Como funciona:</h3>
                <div className="space-y-2 text-sm text-muted">
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                      1
                    </span>
                    Se abre una ventana de navegador con la pagina de Canvas del
                    Tec
                  </div>
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                      2
                    </span>
                    Tu inicias sesion normalmente con tu cuenta del Tec
                  </div>
                  <div className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                      3
                    </span>
                    El bot guarda la sesion y empieza a leer todas tus materias
                    automaticamente
                  </div>
                </div>
              </div>

              {!canvasConnected ? (
                <button
                  onClick={() => setCanvasConnected(true)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  <ExternalLink className="h-4 w-4" />
                  Conectar Canvas del Tec
                </button>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3">
                  <Check className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium text-success">
                      Canvas conectado
                    </p>
                    <p className="text-xs text-muted">
                      Se encontraron 4 materias activas. El bot empezara a leer
                      todo el contenido.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: WhatsApp */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div className="flex gap-3">
                  <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-medium">
                      WhatsApp es donde recibes todo
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      El bot te manda mensajes por WhatsApp con recordatorios de
                      entregas, alertas cuando suben algo nuevo, tu resumen
                      diario cada manana, y puedes preguntarle lo que sea sobre
                      tus clases directo desde ahi.
                    </p>
                  </div>
                </div>
              </div>

              {!skipWhatsapp ? (
                <>
                  <div className="space-y-3">
                    <h3 className="font-semibold">Que vas a recibir:</h3>
                    <div className="grid gap-2 text-sm">
                      {[
                        {
                          icon: "🌅",
                          text: "Resumen cada manana con tus pendientes del dia",
                        },
                        {
                          icon: "🔔",
                          text: "Alerta instantanea si suben tarea, anuncio o calificacion nueva",
                        },
                        {
                          icon: "⏰",
                          text: "Recordatorio antes de que se venza una entrega",
                        },
                        {
                          icon: "💬",
                          text: "Puedes preguntarle cualquier cosa sobre tus clases",
                        },
                      ].map((item) => (
                        <div
                          key={item.text}
                          className="flex items-start gap-3 rounded-lg bg-card-hover px-3 py-2.5"
                        >
                          <span className="text-base">{item.icon}</span>
                          <span className="text-muted">{item.text}</span>
                        </div>
                      ))}
                    </div>
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
                    <p className="mt-1.5 text-xs text-muted">
                      Con codigo de pais. Ejemplo: +52 para Mexico
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Como se conecta:</h3>
                    <div className="space-y-2 text-sm text-muted">
                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                          1
                        </span>
                        Te mostramos un codigo QR
                      </div>
                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                          2
                        </span>
                        En WhatsApp ve a Ajustes &gt; Dispositivos vinculados
                        &gt; Vincular dispositivo
                      </div>
                      <div className="flex gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                          3
                        </span>
                        Escaneas el QR y listo — el bot puede mandarte mensajes
                      </div>
                    </div>
                  </div>

                  {!whatsappConnected ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setWhatsappConnected(true)}
                        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                      >
                        <QrCode className="h-4 w-4" />
                        Mostrar codigo QR
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl bg-success/10 px-4 py-3">
                      <Check className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm font-medium text-success">
                          WhatsApp conectado
                        </p>
                        <p className="text-xs text-muted">
                          Te mandaremos un mensaje de prueba en unos segundos.
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSkipWhatsapp(true)}
                    className="flex w-full items-center justify-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <SkipForward className="h-3.5 w-3.5" />
                    Saltar por ahora, solo quiero usar el navegador
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
                    <p className="text-sm text-warning">
                      Sin WhatsApp no recibiras alertas automaticas, resumen
                      diario ni podras preguntar desde tu telefono. Solo podras
                      usar el dashboard en el navegador.
                    </p>
                  </div>
                  <button
                    onClick={() => setSkipWhatsapp(false)}
                    className="text-sm text-accent transition-colors hover:text-accent-hover"
                  >
                    Mejor si quiero conectar WhatsApp
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold">Tarea automatica con IA</h3>
                <p className="mt-1 text-sm text-muted">
                  El bot puede intentar hacer algunas tareas automaticamente
                  (como quizzes de opcion multiple o ejercicios simples). Tu
                  siempre revisas y apruebas antes de que se envie.
                </p>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">
                      Hacer tareas automaticamente
                    </p>
                    <p className="text-xs text-muted">
                      {autoHomework
                        ? "El bot intentara hacer tareas y te pedira aprobacion"
                        : "Desactivado — el bot solo te avisara de pendientes"}
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoHomework(!autoHomework)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      autoHomework ? "bg-accent" : "bg-border"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        autoHomework ? "translate-x-5.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
                {autoHomework && (
                  <div className="mt-3 rounded-xl border border-warning/20 bg-warning/5 px-4 py-3">
                    <p className="text-sm text-warning">
                      El bot nunca envia nada sin tu aprobacion. Te mostrara lo
                      que hizo y tu decides si se sube o no.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold">Resumen diario</h3>
                <p className="mt-1 text-sm text-muted">
                  A que hora quieres recibir tu resumen de pendientes cada
                  manana?
                </p>
                <select
                  defaultValue="7"
                  className="mt-3 h-11 w-full max-w-xs rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-accent"
                >
                  <option value="6">6:00 AM</option>
                  <option value="7">7:00 AM</option>
                  <option value="8">8:00 AM</option>
                  <option value="9">9:00 AM</option>
                </select>
              </div>

              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div className="flex gap-3">
                  <Zap className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-sm font-medium">Listo para empezar!</p>
                    <p className="mt-1 text-sm text-muted">
                      {canvasConnected
                        ? "Tu Canvas esta conectado. El bot ya esta leyendo tus materias — en unos minutos tendras toda la informacion disponible."
                        : "No conectaste Canvas todavia. Puedes hacerlo despues desde Ajustes, pero el bot no funcionara hasta que lo hagas."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
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

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex h-10 items-center gap-1 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex h-10 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <Check className="h-4 w-4" />
              Ir al dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
