import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { getRootDir } from "@/lib/bot-db";

let loginProcess: ReturnType<typeof spawn> | null = null;

export async function POST() {
  if (loginProcess && !loginProcess.killed) {
    return NextResponse.json({ status: "already_running", message: "Ya hay una sesion de login abierta. Inicia sesion en la ventana del navegador." });
  }

  const rootDir = getRootDir();

  loginProcess = spawn("npx", ["tsx", "src/scripts/canvas-login.ts"], {
    cwd: rootDir,
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env, PATH: process.env.PATH },
  });

  let output = "";
  loginProcess.stdout?.on("data", (data) => { output += data.toString(); });
  loginProcess.stderr?.on("data", (data) => { output += data.toString(); });
  loginProcess.on("close", () => { loginProcess = null; });

  // Wait a bit for the browser to open
  await new Promise((r) => setTimeout(r, 3000));

  return NextResponse.json({
    status: "started",
    message: "Ventana de Canvas abierta. Inicia sesion y luego haz click en 'Ya inicie sesion'.",
    pid: loginProcess?.pid,
  });
}

export { loginProcess };
