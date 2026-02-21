"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, Loader2, Check } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
            <Check className="h-6 w-6 text-success" />
          </div>
          <h1 className="text-2xl font-bold">Revisa tu correo</h1>
          <p className="mt-2 text-sm text-muted">
            Te enviamos un link de confirmacion a{" "}
            <span className="text-foreground">{email}</span>. Dale click para
            activar tu cuenta.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-border px-6 text-sm font-medium transition-colors hover:bg-card"
          >
            Ir a iniciar sesion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              CanvasBot
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Crea tu cuenta</h1>
          <p className="mt-1 text-sm text-muted">
            Empieza a recibir informacion de tus clases con IA
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="David Martinez"
              className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
              Correo electronico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@tec.mx"
              className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium"
            >
              Contrasena
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Minimo 6 caracteres"
              className="h-11 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Crear cuenta"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Ya tienes cuenta?{" "}
          <Link href="/login" className="text-accent hover:text-accent-hover">
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
}
