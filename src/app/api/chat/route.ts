import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getContextForAI, getOpenAIKey } from "@/lib/bot-db";

const SYSTEM_PROMPT = `Eres el asistente personal de Canvas del estudiante: util, proactivo, y enfocado en mantenerlo al dia.
Respondes siempre en español.

Tu estilo:
- Se proactivo: sugiere que hacer a continuacion (e.g. "Te conviene hacer X antes de la fecha limite").
- Usa la seccion de SUGERENCIAS: lista tareas no entregadas y proximas a vencer. Cuando pregunten "que tengo que hacer?", "se me paso algo?", o "que hay pendiente?", usa eso.
- Para "que vamos a ver en clase?" usa el syllabus y contenido del curso.
- Cuando veas submission_status "not_submitted" o faltante, tratalo como posiblemente no entregado.
- Se especifico: nombres de cursos, tareas, fechas. Respuestas concisas pero accionables.
- Si algo no esta en los datos, dilo y sugiere revisar Canvas.`;

export async function POST(req: NextRequest) {
  const key = getOpenAIKey();
  if (!key) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY no esta configurada en el archivo .env del bot." },
      { status: 500 }
    );
  }

  const { message } = await req.json();
  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Se requiere un mensaje." }, { status: 400 });
  }

  const context = getContextForAI();
  const openai = new OpenAI({ apiKey: key });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT + "\n\nDatos actuales:\n" + context },
      { role: "user", content: message },
    ],
    max_tokens: 1024,
  });

  const reply = response.choices[0]?.message?.content?.trim() ?? "No pude generar una respuesta.";
  return NextResponse.json({ reply });
}
