"use client";

import {
  MonitorSmartphone,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface SetupBannerProps {
  canvasConnected: boolean;
  whatsappConnected: boolean;
}

export function SetupBanner({
  canvasConnected,
  whatsappConnected,
}: SetupBannerProps) {
  if (canvasConnected && whatsappConnected) return null;

  return (
    <div className="space-y-3">
      {!canvasConnected && (
        <div className="flex items-center justify-between rounded-2xl border border-warning/30 bg-warning/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <MonitorSmartphone className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div>
              <p className="text-sm font-semibold text-warning">
                Conecta Canvas para empezar
              </p>
              <p className="mt-0.5 text-sm text-muted">
                El bot necesita acceso a tu Canvas para leer tus materias,
                tareas y calificaciones. Sin esto, nada funciona.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="ml-4 flex shrink-0 items-center gap-1 rounded-lg bg-warning px-3 py-2 text-xs font-medium text-black transition-opacity hover:opacity-90"
          >
            Conectar
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {!whatsappConnected && canvasConnected && (
        <div className="flex items-center justify-between rounded-2xl border border-accent/30 bg-accent/5 px-5 py-4">
          <div className="flex items-start gap-3">
            <MessageSquare className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="text-sm font-semibold text-accent">
                Conecta WhatsApp para recibir alertas
              </p>
              <p className="mt-0.5 text-sm text-muted">
                Sin WhatsApp solo puedes usar el dashboard. Conectalo para
                recibir recordatorios y poder preguntar desde tu telefono.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="ml-4 flex shrink-0 items-center gap-1 rounded-lg bg-accent px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
          >
            Configurar
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
