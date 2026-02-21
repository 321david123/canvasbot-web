"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "Hola! Soy tu asistente de Canvas con IA. Se todo sobre tus materias — tareas, temarios, calificaciones, anuncios y notas de clase. Preguntame lo que sea!",
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    const lower = text.toLowerCase();
    let reply =
      "Necesitaria revisar tus datos de Canvas para contestarte con precision. Cuando el backend este conectado, tendre informacion en tiempo real de todas tus materias!";

    if (lower.includes("tarea") || lower.includes("entregar") || lower.includes("pendiente") || lower.includes("homework")) {
      reply =
        "Segun tu Canvas, tienes 3 entregas esta semana:\n\n1. **Tarea: Estructura condicional if** — Pensamiento Computacional — Manana 11:59 PM\n2. **TI 2. Analisis de variables** — Vision Holistica — Jueves 11:59 PM\n3. **Examen rapido: Algoritmos** — Pensamiento Computacional — Viernes 8:50 AM\n\nTe recomiendo empezar con la #1 porque es para manana. Quieres que te explique el tema?";
    } else if (lower.includes("calificacion") || lower.includes("nota") || lower.includes("score") || lower.includes("saque")) {
      reply =
        "Tus ultimas calificaciones en **Pensamiento Computacional**:\n\n- Tarea: Programas que realizan calculos — **100/100**\n- Laboratorio: Problemas con calculos — **100/100**\n- Examen: Elementos de un Programa — **94/100**\n- Examen: Valores Booleanos — **100/100**\n- Ejercicios: Prioridad operaciones — **100/100**\n\nTu promedio es **98.8%** — vas muy bien!";
    } else if (lower.includes("profesor") || lower.includes("profe") || lower.includes("teacher") || lower.includes("maestro")) {
      reply =
        "Tus profesores este semestre:\n\n- **Microeconomia**: Revisa el syllabus\n- **Modelacion matematica**: Revisa el syllabus\n- **Pensamiento computacional**: Maria del Consuelo Serrato Arias\n- **Vision holistica**: Revisa el syllabus";
    } else if (lower.includes("clase") || lower.includes("horario") || lower.includes("hoy")) {
      reply =
        "Hoy tienes:\n\n- **7:10 - 8:50 AM** — Pensamiento computacional para ingenieria (Salon 4205)\n- **9:10 - 10:50 AM** — Modelacion matematica fundamental (Aula 14203)\n\nPara Pensamiento Computacional, el tema de hoy es sobre estructuras condicionales (if/else). Te recomiendo repasar los ejercicios del modulo 3.";
    }

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col md:h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Chat IA</h1>
        <p className="mt-1 text-sm text-muted">
          Pregunta lo que sea sobre tus clases, tareas o apuntes.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-border bg-card p-4"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                msg.role === "user"
                  ? "bg-accent/10 text-accent"
                  : "bg-success/10 text-success"
              }`}
            >
              {msg.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-accent text-white"
                  : "bg-card-hover text-foreground"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center rounded-2xl bg-card-hover px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre tus clases..."
          className="h-12 flex-1 rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </form>
    </div>
  );
}
