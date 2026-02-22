import { NextResponse } from "next/server";
import { loginProcess } from "../login/route";

export async function POST() {
  if (!loginProcess || loginProcess.killed) {
    return NextResponse.json(
      { status: "no_process", message: "No hay proceso de login activo." },
      { status: 400 }
    );
  }

  // Send Enter keystroke to stdin so canvas-login.ts saves auth and exits
  loginProcess.stdin?.write("\n");
  loginProcess.stdin?.end();

  // Wait for process to finish
  await new Promise<void>((resolve) => {
    const timeout = setTimeout(() => resolve(), 10000);
    loginProcess!.on("close", () => {
      clearTimeout(timeout);
      resolve();
    });
  });

  return NextResponse.json({
    status: "done",
    message: "Sesion de Canvas guardada.",
  });
}
