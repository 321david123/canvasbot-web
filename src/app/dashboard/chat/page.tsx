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
      "Hey! I'm your Canvas AI assistant. I know everything about your courses — assignments, syllabi, grades, announcements, and lecture notes. Ask me anything!",
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

    // Simulated AI response (replace with real API call)
    await new Promise((r) => setTimeout(r, 1500));

    const responses: Record<string, string> = {
      default:
        "I'd need to check your Canvas data to answer that precisely. Once the backend is connected, I'll have real-time info about all your courses, assignments, and grades!",
    };

    const lower = text.toLowerCase();
    let reply = responses.default;
    if (lower.includes("homework") || lower.includes("tarea") || lower.includes("due")) {
      reply =
        "Based on your Canvas data, you have 3 assignments due this week:\n\n1. **Tarea: Estructura condicional if** — Pensamiento Computacional — Due tomorrow\n2. **TI 2. Analisis de variables** — Vision Holistica — Due Thursday\n3. **Examen rapido: Algoritmos** — Pensamiento Computacional — Due Friday\n\nI'd recommend starting with #1 since it's due tomorrow. Want details on any of these?";
    } else if (lower.includes("grade") || lower.includes("score") || lower.includes("calificacion")) {
      reply =
        "Here are your recent grades in **Pensamiento Computacional**:\n\n- Tarea: Programas que realizan calculos — **100/100**\n- Laboratorio: Problemas con calculos — **100/100**\n- Examen: Elementos de un Programa — **94/100**\n- Examen: Valores Booleanos — **100/100**\n- Ejercicios: Prioridad operaciones — **100/100**\n\nYour average is **98.8%** — great job!";
    } else if (lower.includes("professor") || lower.includes("profesor") || lower.includes("teacher")) {
      reply =
        "Your professors this semester:\n\n- **Microeconomia**: Check syllabus for details\n- **Modelacion matematica**: Check syllabus for details\n- **Pensamiento computacional**: Maria del Consuelo Serrato Arias\n- **Vision holistica**: Check syllabus for details";
    }

    setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col md:h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="mt-1 text-sm text-muted">
          Ask anything about your classes, assignments, or lectures.
        </p>
      </div>

      {/* Messages */}
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

      {/* Input */}
      <form onSubmit={handleSend} className="mt-4 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your classes..."
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
