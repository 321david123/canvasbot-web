"use client";

import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  MonitorSmartphone,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Check,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://canvasbot-api.fly.dev";

interface CanvasStatus {
  canvasConnected: boolean;
  canvasUrl: string | null;
  lastSync: string | null;
  courseCount: number;
  hasData: boolean;
}

export default function SettingsPage() {
  const [status, setStatus] = useState<CanvasStatus | null>(null);
  const [canvasEmail, setCanvasEmail] = useState("");
  const [canvasPassword, setCanvasPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [jobMessage, setJobMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (!jobId) return;

    async function poll() {
      try {
        const res = await fetch(`${API_URL}/api/job/${jobId}`);
        const data = await res.json();
        setJobStatus(data.status);
        setJobMessage(data.message);

        if (data.status === "done") {
          setConnecting(false);
          if (pollRef.current) clearInterval(pollRef.current);
          await fetchStatus();
        } else if (data.status === "error") {
          setConnecting(false);
          setError(data.message);
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {}
    }

    pollRef.current = setInterval(poll, 2000);
    poll();

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId]);

  async function handleConnect() {
    if (!canvasEmail || !canvasPassword) {
      setError("Ingresa tu correo y contrasena.");
      return;
    }

    setConnecting(true);
    setError(null);
    setJobMessage("Enviando...");

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Sesion expirada. Recarga la pagina.");
        setConnecting(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: canvasEmail,
          password: canvasPassword,
          canvasUrl: "https://experiencia21.tec.mx",
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setConnecting(false);
        return;
      }

      setJobId(data.jobId);
      setJobStatus("pending");
    } catch {
      setError("No se pudo conectar al servidor.");
      setConnecting(false);
    }
  }

  async function handleResync() {
    if (!canvasEmail || !canvasPassword) {
      setError("Ingresa tu correo y contrasena para re-sincronizar.");
      return;
    }

    setConnecting(true);
    setError(null);

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Sesion expirada.");
        setConnecting(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/resync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: canvasEmail,
          password: canvasPassword,
          canvasUrl: "https://experiencia21.tec.mx",
          userId: user.id,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setConnecting(false);
        return;
      }

      setJobId(data.jobId);
      setJobStatus("pending");
    } catch {
      setError("No se pudo conectar al servidor.");
      setConnecting(false);
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
          Ingresa tus credenciales del Tec para conectar o actualizar tus datos.
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
            <label className="mb-1.5 block text-sm font-medium">Correo del Tec</label>
            <input
              type="email"
              value={canvasEmail}
              onChange={(e) => setCanvasEmail(e.target.value)}
              placeholder="A01234567@tec.mx"
              disabled={connecting}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Contrasena del Tec / Microsoft</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={canvasPassword}
                onChange={(e) => setCanvasPassword(e.target.value)}
                placeholder="Tu contrasena institucional"
                disabled={connecting}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 pr-10 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-xl bg-background px-3 py-2.5">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
            <p className="text-xs text-muted">
              Tus credenciales no se almacenan. Se usan solo para iniciar sesion en Canvas y leer tus datos.
            </p>
          </div>

          {/* Job progress */}
          {connecting && (
            <div className="space-y-2 rounded-xl border border-accent/20 bg-accent/5 px-4 py-3">
              <div className="flex items-center gap-2">
                {jobStatus === "done" ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                )}
                <span className="text-sm font-medium">
                  {jobStatus === "login" && "Iniciando sesion..."}
                  {jobStatus === "scraping" && "Leyendo Canvas..."}
                  {jobStatus === "pending" && "En cola..."}
                  {jobStatus === "done" && "Completado"}
                  {!jobStatus && "Conectando..."}
                </span>
              </div>
              <p className="text-xs text-muted">{jobMessage}</p>
              {jobStatus === "login" && (
                <p className="text-xs text-accent">Si Microsoft pide aprobacion en tu telefono, apruebala ahora.</p>
              )}
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleConnect}
              disabled={connecting || !canvasEmail || !canvasPassword}
              className="flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {connecting && jobStatus !== "done" ? <Loader2 className="h-4 w-4 animate-spin" /> : <MonitorSmartphone className="h-4 w-4" />}
              {status?.canvasConnected ? "Reconectar" : "Conectar Canvas"}
            </button>

            {status?.canvasConnected && (
              <button
                onClick={handleResync}
                disabled={connecting}
                className="flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-medium transition-colors hover:bg-card-hover disabled:opacity-50"
              >
                {connecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Actualizar datos
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
