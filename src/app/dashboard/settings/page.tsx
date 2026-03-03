"use client";

import { useState, useEffect } from "react";
import { Wifi, WifiOff, Database, Terminal, Copy } from "lucide-react";

interface CanvasStatus {
  canvasConnected: boolean;
  canvasUrl: string | null;
  lastSync: string | null;
  courseCount: number;
  hasData: boolean;
}

export default function SettingsPage() {
  const [status, setStatus] = useState<CanvasStatus | null>(null);
  const [copied, setCopied] = useState(false);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/canvas/status");
      const data = await res.json();
      setStatus(data);
    } catch {}
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function timeAgo(dateStr: string | null) {
    if (!dateStr) return "nunca";
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (mins < 1) return "justo ahora";
    if (mins < 60) return `hace ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `hace ${hours}h`;
    return `hace ${Math.floor(hours / 24)}d`;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ajustes</h1>
        <p className="mt-1 text-sm text-muted">
          Estado de tu conexión con Canvas. No pedimos tu contraseña aquí; inicias sesión en tu computadora.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Conexión con Canvas</h2>
        <p className="mt-1 text-sm text-muted">
          Los datos se suben desde el programa CanvasBot en tu computadora. Inicias sesión en Canvas ahí; esta web solo muestra lo que ya se sincronizó.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
            status?.canvasConnected ? "bg-success/10 text-success" : "bg-card-hover text-muted"
          }`}>
            {status?.canvasConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {status?.canvasConnected ? "Conectado" : "No conectado"}
          </div>
          {status?.hasData && (
            <div className="flex items-center gap-2 rounded-xl bg-accent/10 px-4 py-2.5 text-sm font-medium text-accent">
              <Database className="h-4 w-4" />
              {status.courseCount} materias &middot; sincronizado {timeAgo(status.lastSync)}
            </div>
          )}
        </div>

        <div className="mt-5 rounded-xl bg-background p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
            Para conectar o actualizar datos
          </p>
          <p className="text-sm text-muted">
            En tu computadora, en la carpeta del proyecto CanvasBot, ejecuta en la terminal. Se abre un navegador donde inicias sesión en Canvas, luego se escanea todo y se sube aquí automáticamente.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <code className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-mono text-xs text-accent">
              npm run canvas:setup
            </code>
            <button
              type="button"
              onClick={() => copyToClipboard("npm run canvas:setup")}
              className="rounded-lg border border-border p-2 text-muted hover:bg-card-hover hover:text-foreground"
              title="Copiar"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          {copied && <p className="mt-2 text-xs text-success">Copiado</p>}
        </div>
      </div>
    </div>
  );
}
