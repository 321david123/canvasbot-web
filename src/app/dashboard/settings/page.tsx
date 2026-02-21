"use client";

import { useState } from "react";
import { Save, Loader2, Wifi, WifiOff } from "lucide-react";

export default function SettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("+52");
  const [digestHour, setDigestHour] = useState("7");
  const [refreshInterval, setRefreshInterval] = useState("30");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [canvasConnected] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Ajustes</h1>
        <p className="mt-1 text-sm text-muted">
          Configura tu experiencia con CanvasBot.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Conexion con Canvas</h2>
        <p className="mt-1 text-sm text-muted">
          Conecta tu cuenta de Canvas para que podamos leer tus materias.
        </p>
        <div className="mt-4 flex items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
              canvasConnected
                ? "bg-success/10 text-success"
                : "bg-card-hover text-muted"
            }`}
          >
            {canvasConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            {canvasConnected ? "Conectado" : "No conectado"}
          </div>
          <button className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
            {canvasConnected ? "Reconectar" : "Conectar Canvas"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Notificaciones por WhatsApp</h2>
          <p className="mt-1 text-sm text-muted">
            Recibe recordatorios de entregas y actualizaciones de Canvas por
            WhatsApp.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Tu numero de WhatsApp
              </label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+52 123 456 7890"
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                Hora del resumen diario
              </label>
              <select
                value={digestHour}
                onChange={(e) => setDigestHour(e.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-accent"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i === 0
                      ? "12:00 AM"
                      : i < 12
                      ? `${i}:00 AM`
                      : i === 12
                      ? "12:00 PM"
                      : `${i - 12}:00 PM`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-semibold">Sincronizacion con Canvas</h2>
          <p className="mt-1 text-sm text-muted">
            Cada cuanto quieres que revisemos Canvas para buscar cambios.
          </p>
          <div className="mt-4 max-w-xs">
            <label className="mb-1.5 block text-sm font-medium">
              Intervalo de actualizacion (minutos)
            </label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition-colors focus:border-accent"
            >
              <option value="15">Cada 15 minutos</option>
              <option value="30">Cada 30 minutos</option>
              <option value="60">Cada hora</option>
              <option value="120">Cada 2 horas</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex h-11 items-center gap-2 rounded-xl bg-accent px-6 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Guardar ajustes
          </button>
          {saved && (
            <span className="text-sm text-success">Ajustes guardados!</span>
          )}
        </div>
      </form>
    </div>
  );
}
