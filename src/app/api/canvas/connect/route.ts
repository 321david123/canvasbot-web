import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { testConnection } from "@/lib/canvas-api";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { canvasUrl, accessToken } = await req.json();
  if (!canvasUrl || !accessToken) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const cleanUrl = canvasUrl.replace(/\/+$/, "");

  const test = await testConnection({ canvasUrl: cleanUrl, accessToken });
  if (!test.ok) {
    return NextResponse.json(
      { error: `No se pudo conectar a Canvas: ${test.error}` },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("canvas_configs").upsert(
    {
      user_id: user.id,
      canvas_url: cleanUrl,
      access_token: accessToken,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, userName: test.userName });
}
