"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GraduationCap, Loader2 } from "lucide-react";

function isValidTecEmail(email: string): boolean {
  return /^[^\s@]+@(tec\.mx|itesm\.mx)$/i.test(email.trim());
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const tecValid = isValidTecEmail(email);
  const canSubmit = name.trim().length > 0 && tecValid && password.length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim(), onboarding_step: 0 },
      },
    });

    if (signUpError) {
      if (signUpError.message.toLowerCase().includes("rate limit")) {
        setError("Demasiados intentos. Desactiva 'Confirm email' en Supabase (Authentication > Providers > Email) y espera unos minutos.");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }

    // If Supabase returned a session (email confirmation is off), we're done
    if (signUpData.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    // Otherwise try signing in directly (works when confirmation is disabled)
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError("No se pudo iniciar sesion. Revisa que la confirmacion de correo este desactivada en Supabase.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
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
            Usa tu correo institucional del Tec de Monterrey
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
              Correo del Tec
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="A01234567@tec.mx"
              className={`h-11 w-full rounded-xl border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-accent ${
                email.length > 0 && !tecValid
                  ? "border-danger"
                  : "border-border"
              }`}
            />
            {email.length > 0 && !tecValid && (
              <p className="mt-1.5 text-xs text-danger">
                Solo se permiten correos @tec.mx o @itesm.mx
              </p>
            )}
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
            disabled={loading || !canSubmit}
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
