import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: config } = await supabase
    .from("canvas_configs")
    .select("canvas_url, updated_at")
    .eq("user_id", user.id)
    .single();

  const { count: courseCount } = await supabase
    .from("courses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  return NextResponse.json({
    canvasConnected: !!config,
    canvasUrl: config?.canvas_url ?? null,
    lastSync: config?.updated_at ?? null,
    courseCount: courseCount ?? 0,
    hasData: (courseCount ?? 0) > 0,
  });
}
