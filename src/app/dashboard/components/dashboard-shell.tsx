"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/assignments", label: "Tareas", icon: BookOpen },
  { href: "/dashboard/announcements", label: "Anuncios", icon: Bell },
  { href: "/dashboard/chat", label: "Chat IA", icon: MessageSquare },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
];

export function DashboardShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <GraduationCap className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-base font-semibold tracking-tight">
          CanvasBot
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 pt-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-accent/10 font-medium text-accent"
                  : "text-muted hover:bg-card-hover hover:text-foreground"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-medium text-accent">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="truncate text-sm">
            <div className="font-medium">{userName}</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-card-hover hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border md:block">
        {sidebar}
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-background transition-transform md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 rounded-lg p-1 text-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebar}
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="flex h-16 items-center gap-4 border-b border-border px-6 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-1 text-muted hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium">CanvasBot</span>
        </header>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
