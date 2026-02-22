import { NextResponse } from "next/server";
import { isCanvasConnected, isDatabaseReady, getCourses } from "@/lib/bot-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const connected = isCanvasConnected();
  const dbReady = isDatabaseReady();
  let courseCount = 0;

  if (dbReady) {
    try {
      courseCount = getCourses().length;
    } catch {
      // db might exist but be empty
    }
  }

  return NextResponse.json({
    canvasConnected: connected,
    databaseReady: dbReady,
    courseCount,
    hasData: courseCount > 0,
  });
}
