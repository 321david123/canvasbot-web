"use client";

import { useState, useEffect } from "react";
import {
  Loader2,
  Wifi,
  WifiOff,
  Key,
  RefreshCw,
  Database,
  ExternalLink,
} from "lucide-react";

interface CanvasStatus {
  canvasConnected: boolean;
  canvasUrl: string | null;
  lastSync: string | null;
  courseCount: number;
  hasData: boolean;
}

export default function SettingsPage() {
  const [status, setStatus] = useState<CanvasStatus | null>(null);
  const [canvasUrl, setCanvasUrl] = useState("https://experiencia21.tec.mx");
  const [accessToken, setAccessToken] = useState("");
  const [connectLoading, setConnectLoading] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncOutput, setSyncOutput] = useState<string | null>(null);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/canvas/status");
      const data = await res.json();
      setStatus(data);
      if (data.canvasUrl) setCanvasUrl(data.canvasUrl);
    } catch {}
  }

  useEffect(() => { fetchStatus(); }, []);

  async function handleConnect() {
    if (!accessToken.trim()) { setConnectError("Pega tu token."); return; }
    setConnectLoading(true);
    setConnectError(null);
    try {
      const res = await fetch("/api/canvas/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvasUrl: canvasUrl.trim(), accessToken: accessToken.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setConnectError(data.error); return; }

      setSyncLoading(true);
      setSyncOutput("Sincronizando...");
      const syncRes = await fetch("/api/canvas/sync", { method: "POST" });
      const syncData = await syncRes.json();
      if (syncData.ok) {
        setSyncOutput(`Listo: ${syncData.courses} materias, ${syncData.assignments} tareas, ${syncData.announcements} anuncios.`);
      } else {
        setSyncOutput(syncData.error || "Error al sincronizar.");
      }
      await fetchStatus();
      setAccessToken("");
    } catch {
      setConnectError("Error de conexion.");
    } finally {
      setConnectLoading(false);
      setSyncLoading(false);
    }
  }

  async function handleSync() {
    setSyncLoading(true);
    setSyncOutput("Sincronizando...");
    try {
      const res = await fetch("/api/canvas/sync", { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setSyncOutput(`Listo: ${data.courses} materias, ${data.assignments} tareas, ${data.announcements} anuncios.`);
      } else {
        setSyncOutput(data.error || "Error.");
      }
      await fetchStatus();
    } catch {
      setSyncOutput("Error de conexion.");
    } finally {
      setSyncLoading(false);
    }
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
        <p className="mt-1 text-sm text-muted">Configura tu conexion con Canvas.</p>
      </div>

      {/* Connection status */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Conexion con Canvas</h2>
        <p className="mt-1 text-sm text-muted">
          Usa un token de acceso personal de Canvas para conectar.
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

        <div className="mt-5 space-y-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">URL de Canvas</label>
            <input
              type="url"
              value={canvasUrl}
              onChange={(e) => setCanvasUrl(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Token de acceso{" "}
              <a
                href={`${canvasUrl}/profile/settings`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-normal text-accent hover:underline"
              >
                (generar en Canvas <ExternalLink className="h-3 w-3" />)
              </a>
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder={status?.canvasConnected ? "Pega un nuevo token para reconectar" : "Pega tu token aqui..."}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 font-mono text-sm outline-none transition-colors placeholder:font-sans placeholder:text-muted/50 focus:border-accent"
            />
          </div>

          {connectError && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{connectError}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              disabled={connectLoading || syncLoading || !accessToken.trim()}
              className="flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {connectLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
              {status?.canvasConnected ? "Reconectar" : "Conectar"}
            </button>

            {status?.canvasConnected && (
              <button
                onClick={handleSync}
                disabled={syncLoading}
                className="flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-medium transition-colors hover:bg-card-hover disabled:opacity-50"
              >
                {syncLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Sincronizar ahora
              </button>
            )}
          </div>

          {syncOutput && (
            <p className="rounded-lg bg-accent/5 px-3 py-2 text-sm text-accent">{syncOutput}</p>
          )}
        </div>
      </div>
    </div>
  );
}
