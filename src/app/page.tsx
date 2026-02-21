import Link from "next/link";
import {
  Brain,
  MessageSquare,
  Bell,
  Shield,
  Zap,
  Clock,
  GraduationCap,
  ChevronRight,
  Check,
  Mic,
  Bot,
  Search,
  FileText,
  BarChart3,
  Smartphone,
  RefreshCw,
  BookOpen,
  CalendarDays,
  AlertTriangle,
  Star,
  ArrowRight,
} from "lucide-react";

function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <GraduationCap className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            CanvasBot
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted md:flex">
          <a href="#que-es" className="transition-colors hover:text-foreground">
            Que es
          </a>
          <a href="#funciones" className="transition-colors hover:text-foreground">
            Funciones
          </a>
          <a href="#como-funciona" className="transition-colors hover:text-foreground">
            Como funciona
          </a>
          <a href="#precios" className="transition-colors hover:text-foreground">
            Precios
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Empezar gratis
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,_transparent_50%)] opacity-[0.08]" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted">
          <Zap className="h-3.5 w-3.5 text-accent" />
          Hecho para estudiantes del Tec de Monterrey
        </div>
        <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
          Una IA que sabe{" "}
          <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
            absolutamente todo
          </span>{" "}
          de tus clases
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
          CanvasBot entra a tu Canvas, lee cada tarea, cada examen, cada
          anuncio, cada calificacion y cada pagina de todas tus materias.
          Despues te manda recordatorios por WhatsApp y puedes preguntarle
          cualquier cosa sobre tus clases como si fuera ChatGPT pero
          especializado en TU semestre.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-base font-medium text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
          >
            Empezar gratis
            <ChevronRight className="h-4 w-4" />
          </Link>
          <a
            href="#que-es"
            className="flex h-12 items-center rounded-xl border border-border px-8 text-base font-medium text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            Ver como funciona
          </a>
        </div>

        {/* Demo conversation */}
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-danger/60" />
            <div className="h-3 w-3 rounded-full bg-warning/60" />
            <div className="h-3 w-3 rounded-full bg-success/60" />
            <span className="ml-2 text-xs text-muted">
              CanvasBot — Chat con IA
            </span>
          </div>
          <div className="p-6 md:p-8">
            <div className="space-y-4 font-mono text-sm">
              <div className="text-muted">
                <span className="text-accent">tu:</span> Que tareas tengo para
                esta semana?
              </div>
              <div className="text-foreground">
                <span className="text-success">bot:</span> Tienes 3 entregas
                esta semana:
              </div>
              <div className="ml-4 space-y-1.5 text-foreground/80">
                <div>
                  1.{" "}
                  <span className="text-warning">
                    Tarea: Estructura condicional if
                  </span>{" "}
                  — Pensamiento Computacional — Manana 11:59 PM
                </div>
                <div>
                  2.{" "}
                  <span className="text-warning">
                    TI 2. Analisis de variables
                  </span>{" "}
                  — Vision Holistica — Jueves 11:59 PM
                </div>
                <div>
                  3.{" "}
                  <span className="text-warning">Examen rapido: Algoritmos</span>{" "}
                  — Pensamiento Computacional — Viernes 8:50 AM
                </div>
              </div>
              <div className="text-foreground">
                <span className="text-success">bot:</span> Te recomiendo empezar
                con la #1 porque es para manana. Quieres que te explique el
                tema?
              </div>
              <div className="text-muted">
                <span className="text-accent">tu:</span> Si, y tambien dime que
                calificacion saque en la tarea pasada
              </div>
              <div className="text-foreground">
                <span className="text-success">bot:</span> En &quot;Programas que
                realizan calculos&quot; sacaste{" "}
                <span className="text-success">100/100</span>. Sobre la
                estructura condicional if: es cuando el programa toma
                decisiones. Por ejemplo...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhatIsIt() {
  return (
    <section id="que-es" className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Que es CanvasBot?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Es un bot con inteligencia artificial que se conecta a tu cuenta de
            Canvas y{" "}
            <span className="text-foreground font-medium">
              lee absolutamente todo
            </span>
            : el temario de cada materia, las instrucciones de cada tarea, cada
            anuncio que publica tu profesor, tus calificaciones, las paginas del
            curso, los quizzes, los modulos — todo.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Con toda esa informacion, puedes{" "}
            <span className="text-foreground font-medium">
              preguntarle lo que sea
            </span>{" "}
            como si fuera un ChatGPT pero que sabe exactamente que clases
            llevas, que te falta por entregar, que calificacion sacaste y que
            viene la proxima semana. Ademas te manda{" "}
            <span className="text-foreground font-medium">
              mensajes por WhatsApp
            </span>{" "}
            cuando hay algo importante.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
              <Search className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Lee todo tu Canvas</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Navega cada pagina de cada materia como lo haria un humano.
              Syllabus, tareas, anuncios, calificaciones, paginas wiki,
              modulos, quizzes — no se le escapa nada.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
              <Bot className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Preguntale lo que sea</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              &quot;Que tarea tengo manana?&quot;, &quot;Que calificacion saque en el
              examen?&quot;, &quot;De que trata la clase de hoy?&quot;, &quot;Que me falta por
              entregar?&quot; — sabe todo y te contesta al instante.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10">
              <Smartphone className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-lg font-semibold">Te avisa por WhatsApp</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Cada manana te manda un resumen de lo que tienes que hacer. Si
              suben una tarea nueva, te cambian una fecha o te publican una
              calificacion — te avisa al momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Brain,
    title: "IA especializada en tus clases",
    description:
      "No es un ChatGPT generico. Tiene acceso a toda la informacion de TUS materias, TUS tareas y TUS calificaciones. Las respuestas son especificas a tu semestre.",
  },
  {
    icon: MessageSquare,
    title: "Chat por WhatsApp",
    description:
      "Preguntale directo desde WhatsApp. No necesitas abrir otra app ni ir a Canvas. Mandas tu pregunta y te responde con informacion real de tus clases.",
  },
  {
    icon: Bell,
    title: "Alertas instantaneas",
    description:
      "Cuando tu profesor sube una tarea nueva, publica un anuncio o te pone calificacion — te llega un mensaje al momento. No tienes que estar checando Canvas.",
  },
  {
    icon: CalendarDays,
    title: "Resumen diario cada manana",
    description:
      "Todos los dias a la hora que tu elijas, te manda un resumen: que tienes que entregar hoy, que viene esta semana, que se te paso y que anuncios hay nuevos.",
  },
  {
    icon: Mic,
    title: "Graba tus clases",
    description:
      "Graba la clase de tu profesor, la transcribe automaticamente y hace un resumen con IA. Despues puedes preguntarle \"Que vimos en la clase del lunes?\" y te contesta.",
  },
  {
    icon: BarChart3,
    title: "Seguimiento de calificaciones",
    description:
      "Ve tus calificaciones de todas las materias en un solo lugar. Te dice tu promedio, que entregas te faltan y si se te paso algo.",
  },
  {
    icon: RefreshCw,
    title: "Siempre actualizado",
    description:
      "Se actualiza cada 30 minutos automaticamente. Si algo cambia en Canvas, lo detecta y te avisa. No tienes que hacer nada.",
  },
  {
    icon: Shield,
    title: "Privado y seguro",
    description:
      "Tu informacion es solo tuya. Navegamos Canvas en tu nombre con una sesion encriptada. No guardamos contrasenas en texto plano.",
  },
  {
    icon: FileText,
    title: "Todo el contenido del curso",
    description:
      "No solo lee las tareas — lee las paginas del curso, el syllabus, los materiales, las instrucciones detalladas de cada actividad. Toda la info que necesitas en un solo lugar.",
  },
];

function Features() {
  return (
    <section id="funciones" className="border-t border-border bg-card/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Todo lo que necesitas para no reprobar
          </h2>
          <p className="mt-4 text-lg text-muted">
            Deja de revisar Canvas 20 veces al dia. Deja que la IA lo haga por
            ti.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:bg-card-hover"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <f.icon className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatsAppDemo() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Tu asistente vive en tu WhatsApp
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              No necesitas abrir ninguna app nueva. CanvasBot te manda mensajes
              directo a WhatsApp con todo lo que necesitas saber. Y si tienes
              una duda, le preguntas ahi mismo.
            </p>
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: CalendarDays,
                  text: "Resumen matutino: \"Buenos dias! Hoy tienes que entregar la Tarea de Python y tienes examen de Micro a las 9 AM\"",
                },
                {
                  icon: AlertTriangle,
                  text: "Alerta: \"Nueva tarea subida en Vision Holistica: Evidencia 1. Fecha de entrega: 28 de febrero\"",
                },
                {
                  icon: Star,
                  text: "Calificacion: \"Te pusieron 100/100 en el Laboratorio de Pensamiento Computacional\"",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                  <p className="text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* WhatsApp-style mockup */}
          <div className="mx-auto w-full max-w-sm rounded-3xl border border-border bg-[#0b141a] p-4 shadow-2xl">
            <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#1f2c34] px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">CanvasBot</p>
                <p className="text-xs text-[#8696a0]">en linea</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="ml-auto max-w-[75%] rounded-xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-sm text-white">
                Que me falta por entregar?
              </div>
              <div className="mr-auto max-w-[85%] rounded-xl rounded-tl-sm bg-[#1f2c34] px-3 py-2 text-sm text-[#e9edef]">
                Tienes 3 pendientes:
                <br />
                <br />
                1. Tarea: Estructura condicional if — manana
                <br />
                2. TI 2: Analisis de variables — jueves
                <br />
                3. Examen rapido — viernes
                <br />
                <br />
                La mas urgente es la #1. Quieres que te ayude con el tema?
              </div>
              <div className="ml-auto max-w-[75%] rounded-xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-sm text-white">
                Que calificacion saque en el lab?
              </div>
              <div className="mr-auto max-w-[85%] rounded-xl rounded-tl-sm bg-[#1f2c34] px-3 py-2 text-sm text-[#e9edef]">
                En el Laboratorio: Problemas con calculos sacaste 100/100.
                Muy bien!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Crea tu cuenta y conecta Canvas",
      description:
        "Te registras, inicias sesion en tu Canvas a traves de nuestro navegador seguro. Solo lo haces una vez — guardamos la sesion encriptada.",
    },
    {
      number: "02",
      title: "El bot lee todas tus materias",
      description:
        "Automaticamente navega cada pagina de cada curso: syllabus, tareas, anuncios, calificaciones, paginas wiki, quizzes, modulos. Guarda todo en una base de datos.",
    },
    {
      number: "03",
      title: "Pregunta lo que quieras y recibe alertas",
      description:
        "Usa el chat o WhatsApp para preguntar cualquier cosa. Recibe resumen diario cada manana y alertas instantaneas cuando algo cambia en Canvas.",
    },
  ];

  return (
    <section
      id="como-funciona"
      className="border-t border-border bg-card/30 py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Listo en 2 minutos
          </h2>
          <p className="mt-4 text-lg text-muted">
            Sin configuracion tecnica. Solo entra y conecta tu Canvas.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              <div className="mb-4 text-5xl font-bold text-accent/20">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute top-8 -right-4 hidden h-5 w-5 text-accent/30 md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    {
      emoji: "📚",
      question: "\"Que tarea tengo para manana?\"",
      answer:
        "Te dice exactamente que tienes pendiente, de que materia es, a que hora se entrega y si ya la subiste o no.",
    },
    {
      emoji: "📝",
      question: "\"De que va a tratar la clase de hoy?\"",
      answer:
        "Lee el syllabus y el contenido del modulo actual para decirte que tema toca y que material necesitas revisar antes.",
    },
    {
      emoji: "📊",
      question: "\"Cuanto llevo de promedio?\"",
      answer:
        "Suma todas tus calificaciones y te da tu promedio por materia. Te dice que entregas te faltan y como afectan tu nota.",
    },
    {
      emoji: "🔔",
      question: "\"Avisame si suben algo nuevo\"",
      answer:
        "No necesitas ni pedirlo. Cada 30 min revisa Canvas y si hay tarea nueva, anuncio o calificacion — te manda WhatsApp.",
    },
    {
      emoji: "🎤",
      question: "\"Que dijo el profe en la clase pasada?\"",
      answer:
        "Si grabaste la clase, la IA la transcribe y resume. Puedes preguntarle sobre cualquier clase grabada.",
    },
    {
      emoji: "😰",
      question: "\"Se me paso alguna entrega?\"",
      answer:
        "Revisa todas tus tareas, compara las fechas y tu estatus de entrega. Si algo se te paso, te lo dice clarito.",
    },
  ];

  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ejemplos de lo que puedes preguntar
          </h2>
          <p className="mt-4 text-lg text-muted">
            Si tiene que ver con tus clases, CanvasBot lo sabe.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <div
              key={c.question}
              className="rounded-2xl border border-border bg-card p-6 transition-all hover:bg-card-hover"
            >
              <div className="mb-3 text-2xl">{c.emoji}</div>
              <h3 className="font-semibold text-accent">{c.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {c.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const plans = [
    {
      name: "Gratis",
      price: "$0",
      period: "para siempre",
      description: "Pruebalo, sin compromiso",
      features: [
        "Actualizar Canvas manualmente",
        "Chat con IA (10 preguntas/dia)",
        "Ver tareas y fechas de entrega",
        "Dashboard basico",
      ],
      cta: "Empezar gratis",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$10",
      period: "USD/mes",
      description: "Todo lo que necesitas para no perder nada",
      features: [
        "Actualizacion automatica cada 30 min",
        "Chat con IA ilimitado",
        "Alertas por WhatsApp al instante",
        "Resumen diario cada manana",
        "Grabacion y transcripcion de clases",
        "Notificaciones de calificaciones",
        "Soporte prioritario",
      ],
      cta: "Empezar prueba gratis",
      highlight: true,
    },
    {
      name: "Pro+",
      price: "$20",
      period: "USD/mes",
      description: "Para los que quieren todo automatizado",
      features: [
        "Todo lo de Pro",
        "Asistente de tareas con IA",
        "Borradores automaticos de entregas",
        "Guias de estudio generadas",
        "Resumenes para examenes",
        "Acceso anticipado a nuevas funciones",
      ],
      cta: "Proximamente",
      highlight: false,
    },
  ];

  return (
    <section id="precios" className="border-t border-border bg-card/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Precios simples y transparentes
          </h2>
          <p className="mt-4 text-lg text-muted">
            Empieza gratis. Mejora cuando estes convencido.
          </p>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all ${
                plan.highlight
                  ? "border-accent bg-accent/5 shadow-lg shadow-accent/10"
                  : "border-border bg-card hover:border-border hover:bg-card-hover"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
                  Mas popular
                </div>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 flex h-11 w-full items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                  plan.highlight
                    ? "bg-accent text-white hover:bg-accent-hover"
                    : "border border-border text-foreground hover:bg-card-hover"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Deja de estresarte por Canvas
        </h2>
        <p className="mt-4 text-lg text-muted">
          Unete a los estudiantes que ya no se les pasa ninguna entrega. Empieza
          gratis hoy.
        </p>
        <Link
          href="/signup"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-base font-medium text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
        >
          Crear cuenta gratis
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-accent">
            <GraduationCap className="h-3.5 w-3.5 text-white" />
          </div>
          <span>CanvasBot</span>
        </div>
        <p>Hecho por estudiantes, para estudiantes. Tec de Monterrey.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhatIsIt />
      <Features />
      <WhatsAppDemo />
      <UseCases />
      <HowItWorks />
      <Pricing />
      <FinalCTA />
      <Footer />
    </>
  );
}
