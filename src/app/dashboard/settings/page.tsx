"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Wifi,
  WifiOff,
  ExternalLink,
  RefreshCw,
  Check,
  Database,
} from "lucide-react";

interface CanvasStatus {
  canvasConnected: boolean;
  databaseReady: boolean;
  courseCount: number;
  hasData: boolean;
}

export default function SettingsPage() {
  const [status, setStatus] = useState<CanvasStatus | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginStarted, setLoginStarted] = useState(false);
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapeOutput, setScrapeOutput] = useState<string | null>(null);
  const [loginDoneLoading, setLoginDoneLoading] = useState(false);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/canvas/status");
      const data = await res.json();
      setStatus(data);
    } catch {
      // server might not be ready
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  async function handleCanvasLogin() {
    setLoginLoading(true);
    setLoginStarted(false);
    try {
      const res = await fetch("/api/canvas/login", { method: "POST" });
      const data = await res.json();
      if (data.status === "started" || data.status === "already_running") {
        setLoginStarted(true);
      }
    } catch {
      // error
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLoginDone() {
    setLoginDoneLoading(true);
    try {
      await fetch("/api/canvas/login-done", { method: "POST" });
      await fetchStatus();
      setLoginStarted(false);
    } catch {
      // error
    } finally {
      setLoginDoneLoading(false);
    }
  }

  async function handleScrape() {
    setScrapeLoading(true);
    setScrapeOutput(null);
    try {
      const res = await fetch("/api/canvas/scrape", { method: "POST" });
      const data = await res.json();
      setScrapeOutput(data.output || "Scrape completado.");
      await fetchStatus();
    } catch {
      setScrapeOutput("Error al hacer scrape.");
    } finally {
      setScrapeLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ajustes</h1>
        <p className="mt-1 text-sm text-muted">
          Configura tu conexion con Canvas y controla el bot.
        </p>
      </div>

      {/* Canvas connection */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Conexion con Canvas</h2>
        <p className="mt-1 text-sm text-muted">
          Inicia sesion en Canvas para que el bot pueda leer tus materias.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
              status?.canvasConnected
                ? "bg-success/10 text-success"
                : "bg-card-hover text-muted"
            }`}
          >
            {status?.canvasConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            {status?.canvasConnected ? "Sesion guardada" : "No conectado"}
          </div>

          {status?.hasData && (
            <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent">
              <Database className="h-4 w-4" />
              {status.courseCount} materias en la base de datos
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {!loginStarted ? (
            <button
              onClick={handleCanvasLogin}
              disabled={loginLoading}
              className="flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {loginLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              {status?.canvasConnected ? "Reconectar Canvas" : "Conectar Canvas"}
            </button>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
                <p className="text-sm">
                  Se abrio una ventana de navegador. Inicia sesion en Canvas y cuando veas tu dashboard, haz click en el boton de abajo.
                </p>
              </div>
              <button
                onClick={handleLoginDone}
                disabled={loginDoneLoading}
                className="flex h-11 items-center gap-2 rounded-xl bg-success px-5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {loginDoneLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Ya inicie sesion
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Scrape controls */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Sincronizar datos de Canvas</h2>
        <p className="mt-1 text-sm text-muted">
          Ejecuta un scrape para traer los datos mas recientes de tus materias, tareas y anuncios.
        </p>

        <div className="mt-4 space-y-3">
          <button
            onClick={handleScrape}
            disabled={scrapeLoading}
            className="flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {scrapeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {scrapeLoading ? "Scrapeando Canvas..." : "Scrape rapido"}
          </button>

          {scrapeOutput && (
            <pre className="max-h-48 overflow-auto rounded-xl bg-background p-4 text-xs text-muted">
              {scrapeOutput}
            </pre>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Comandos del bot (terminal)</h2>
        <p className="mt-1 text-sm text-muted">
          Tambien puedes usar estos comandos desde la terminal en la carpeta del proyecto:
        </p>
        <div className="mt-4 space-y-2 text-sm text-muted">
          <div className="flex gap-3">
            <code className="shrink-0 rounded bg-background px-2 py-1 text-xs font-mono text-accent">
              npm run canvas:scrape
            </code>
            <span>Scrape rapido (listas)</span>
          </div>
          <div className="flex gap-3">
            <code className="shrink-0 rounded bg-background px-2 py-1 text-xs font-mono text-accent">
              npm run canvas:crawl
            </code>
            <span>Crawl profundo (todo el contenido)</span>
          </div>
          <div className="flex gap-3">
            <code className="shrink-0 rounded bg-background px-2 py-1 text-xs font-mono text-accent">
              npm run scheduler
            </code>
            <span>Scheduler continuo (actualiza cada 30 min)</span>
          </div>
          <div className="flex gap-3">
            <code className="shrink-0 rounded bg-background px-2 py-1 text-xs font-mono text-accent">
              npm run whatsapp
            </code>
            <span>Iniciar bot de WhatsApp</span>
          </div>
          <div className="flex gap-3">
            <code className="shrink-0 rounded bg-background px-2 py-1 text-xs font-mono text-accent">
              npm run chat
            </code>
            <span>Chat con IA en terminal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
