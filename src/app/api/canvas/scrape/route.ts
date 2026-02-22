import { NextResponse } from "next/server";
import { spawn } from "node:child_process";
import { getRootDir } from "@/lib/bot-db";

export async function POST() {
  const rootDir = getRootDir();

  return new Promise<Response>((resolve) => {
    const proc = spawn("npx", ["tsx", "src/scripts/scrape-canvas.ts"], {
      cwd: rootDir,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PATH: process.env.PATH },
    });

    let output = "";
    proc.stdout?.on("data", (data) => { output += data.toString(); });
    proc.stderr?.on("data", (data) => { output += data.toString(); });

    const timeout = setTimeout(() => {
      proc.kill();
      resolve(
        NextResponse.json({ status: "timeout", output }, { status: 504 })
      );
    }, 120_000);

    proc.on("close", (code) => {
      clearTimeout(timeout);
      resolve(
        NextResponse.json({
          status: code === 0 ? "done" : "error",
          exitCode: code,
          output,
        })
      );
    });
  });
}
