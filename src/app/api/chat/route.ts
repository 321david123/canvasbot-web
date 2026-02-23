import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";

const SYSTEM_PROMPT = `Eres el asistente personal de Canvas del estudiante: util, proactivo, y enfocado en mantenerlo al dia.
Respondes siempre en español.

Tu estilo:
- Se proactivo: sugiere que hacer a continuacion.
- Usa la seccion PENDIENTES para recomendar tareas.
- Se especifico: nombres de cursos, tareas, fechas.
- Respuestas concisas pero accionables.
- Si algo no esta en los datos, dilo y sugiere revisar Canvas.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY no esta configurada." },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Se requiere un mensaje." }, { status: 400 });
  }

  // Build context from Supabase
  const [coursesRes, assignmentsRes, announcementsRes] = await Promise.all([
    supabase.from("courses").select("*").eq("user_id", user.id).order("name"),
    supabase.from("assignments").select("*").eq("user_id", user.id).order("due_at"),
    supabase.from("announcements").select("*").eq("user_id", user.id).order("posted_at", { ascending: false }).limit(20),
  ]);

  const courses = coursesRes.data ?? [];
  const assignments = assignmentsRes.data ?? [];
  const announcements = announcementsRes.data ?? [];

  const courseMap = new Map(courses.map((c: any) => [c.id, c.name]));

  const pending = assignments.filter(
    (a: any) => a.submission_status !== "submitted" && a.submission_status !== "graded"
  );

  let context = "# PENDIENTES (tareas no entregadas)\n";
  for (const a of pending) {
    context += `- ${a.name} | ${courseMap.get(a.course_id) ?? a.course_id} | entrega: ${a.due_at ?? "sin fecha"} | estado: ${a.submission_status ?? "desconocido"}\n`;
  }

  context += "\n# MATERIAS\n";
  for (const c of courses) {
    const cAssign = assignments.filter((a: any) => a.course_id === c.id);
    context += `\n## ${c.name} (${c.code ?? ""})\n`;
    context += "Tareas:\n";
    for (const a of cAssign) {
      const status = a.submission_status === "submitted" || a.submission_status === "graded"
        ? `entregada${a.score != null ? ` ${a.score}/${a.points_possible}` : ""}`
        : a.submission_status ?? "pendiente";
      context += `- ${a.name} | entrega: ${a.due_at ?? "—"} | ${status}\n`;
    }
    const cAnn = announcements.filter((a: any) => a.course_id === c.id);
    if (cAnn.length) {
      context += "Anuncios:\n";
      for (const an of cAnn) context += `- ${an.title} (${an.posted_at ?? "—"})\n`;
    }
  }

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT + "\n\nDatos actuales del estudiante:\n" + context },
      { role: "user", content: message },
    ],
    max_tokens: 1024,
  });

  const reply = response.choices[0]?.message?.content?.trim() ?? "No pude generar una respuesta.";
  return NextResponse.json({ reply });
}
