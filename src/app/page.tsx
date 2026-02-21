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
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#how" className="transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="transition-colors hover:text-foreground">
            Pricing
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--accent)_0%,_transparent_50%)] opacity-[0.08]" />
      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted">
          <Zap className="h-3.5 w-3.5 text-accent" />
          Built for Tec de Monterrey students
        </div>
        <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
          Your AI knows{" "}
          <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
            everything
          </span>{" "}
          about your classes
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          CanvasBot crawls your Canvas account, reads every assignment, syllabus,
          and announcement — then texts you on WhatsApp so you never miss a
          deadline again.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-base font-medium text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
          >
            Start for free
            <ChevronRight className="h-4 w-4" />
          </Link>
          <a
            href="#how"
            className="flex h-12 items-center rounded-xl border border-border px-8 text-base font-medium text-muted transition-colors hover:border-foreground/20 hover:text-foreground"
          >
            See how it works
          </a>
        </div>
        <div className="mx-auto mt-16 max-w-4xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/40">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-danger/60" />
            <div className="h-3 w-3 rounded-full bg-warning/60" />
            <div className="h-3 w-3 rounded-full bg-success/60" />
            <span className="ml-2 text-xs text-muted">CanvasBot Dashboard</span>
          </div>
          <div className="p-6 md:p-8">
            <div className="space-y-3 font-mono text-sm">
              <div className="text-muted">
                <span className="text-accent">you:</span> What homework do I have
                due this week?
              </div>
              <div className="text-foreground">
                <span className="text-success">bot:</span> You have 3 assignments
                due this week:
              </div>
              <div className="ml-4 space-y-1 text-foreground/80">
                <div>
                  1. <span className="text-warning">Tarea: Estructura condicional if</span>{" "}
                  — Pensamiento Computacional — Due tomorrow
                </div>
                <div>
                  2. <span className="text-warning">TI 2. Analisis de variables</span>{" "}
                  — Vision Holistica — Due Thursday
                </div>
                <div>
                  3. <span className="text-warning">Examen rapido: Algoritmos</span>{" "}
                  — Pensamiento Computacional — Due Friday
                </div>
              </div>
              <div className="text-foreground">
                <span className="text-success">bot:</span> I&apos;d recommend starting
                with #1 since it&apos;s due tomorrow. Want me to explain the topic?
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Brain,
    title: "Knows everything about your classes",
    description:
      "Crawls every page of your Canvas: syllabi, assignments, announcements, grades, wiki pages, modules. Ask it anything.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp integration",
    description:
      "Get deadline reminders, daily digests, and instant alerts when something new is posted. Ask questions right from WhatsApp.",
  },
  {
    icon: Bell,
    title: "Smart reminders",
    description:
      "Daily morning digest of what's due today and this week. Instant alerts when grades are posted or deadlines change.",
  },
  {
    icon: Shield,
    title: "Private & secure",
    description:
      "Your data stays yours. We navigate Canvas on your behalf — no passwords stored in plain text, sessions encrypted.",
  },
  {
    icon: Mic,
    title: "Lecture recording & notes",
    description:
      "Record your classes, get automatic transcriptions and AI-generated summaries. Ask what was covered in any lecture.",
  },
  {
    icon: Clock,
    title: "Always up to date",
    description:
      "Auto-refreshes every 30 minutes. Detects new assignments, grade changes, and announcements — notifies you instantly.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to ace your classes
          </h2>
          <p className="mt-4 text-lg text-muted">
            Stop checking Canvas 20 times a day. Let AI do it for you.
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

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Sign up & link Canvas",
      description:
        "Create an account and log into your Canvas through our secure browser. One-time setup, takes 2 minutes.",
    },
    {
      number: "02",
      title: "We crawl everything",
      description:
        "Our bot visits every page of every class — assignments, syllabus, announcements, grades, wiki pages, modules.",
    },
    {
      number: "03",
      title: "Ask anything, get alerts",
      description:
        "Chat with AI about your classes. Get WhatsApp reminders for deadlines, new content, and grade updates.",
    },
  ];

  return (
    <section id="how" className="border-y border-border bg-card/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Up and running in minutes
          </h2>
          <p className="mt-4 text-lg text-muted">
            No API keys, no technical setup. Just log in and go.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="mb-4 text-5xl font-bold text-accent/20">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">
                {step.description}
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
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Try it out, see if you like it",
      features: [
        "Manual Canvas refresh",
        "AI chat (10 questions/day)",
        "View assignments & deadlines",
        "Basic dashboard",
      ],
      cta: "Get started",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$10",
      period: "/month",
      description: "Everything you need to stay on top",
      features: [
        "Auto-refresh every 30 minutes",
        "Unlimited AI chat",
        "WhatsApp alerts & daily digest",
        "Lecture recording & transcription",
        "Grade change notifications",
        "Priority support",
      ],
      cta: "Start free trial",
      highlight: true,
    },
    {
      name: "Pro+",
      price: "$20",
      period: "/month",
      description: "For those who want it all",
      features: [
        "Everything in Pro",
        "AI homework assistance",
        "Assignment auto-drafting",
        "Study guides generation",
        "Exam prep summaries",
        "Early access to new features",
      ],
      cta: "Coming soon",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted">
            Start free. Upgrade when you&apos;re hooked.
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
                  Most popular
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
        <p>Built for students, by students. Tec de Monterrey.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <Footer />
    </>
  );
}
