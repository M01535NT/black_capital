"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/setup-status", { cache: "no-store" });
        if (!mounted) return;
        if (!res.ok) {
          setHasAdmin(true);
          return;
        }

        const data = await res.json().catch(() => ({}));
        setHasAdmin(Boolean(data?.hasAdmin));
      } catch {
        if (mounted) setHasAdmin(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push(from);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-white/[0.08] bg-white/[0.025] p-6">
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10">
        <Lock className="h-5 w-5 text-[var(--color-accent)]" />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white/70">Correo de acceso</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@blackcapital.mx"
            autoComplete="email"
            autoFocus
            disabled={loading}
            className="border-white/[0.1] bg-background/70 pl-10 text-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-white/70">Contraseña</label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={loading}
            className="border-white/[0.1] bg-background/70 pr-12 text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={loading || !password}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-white/55 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-35"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && <p className="bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={loading || !email || !password} className="brushed-gold w-full rounded-full font-bold">
        {loading ? "Verificando..." : "Acceder"}
      </Button>

      <div className="space-y-2 text-xs text-white/45">
        <div className="flex items-center justify-center">
          <Link href="/admin/reset-password" className="hover:text-[var(--color-accent)]">Olvidé mi contraseña</Link>
          {hasAdmin === null && <span className="ml-4 text-white/40">Cargando opciones...</span>}
          {hasAdmin === false && <Link href="/admin/setup" className="hover:text-[var(--color-accent)]">Crear primer admin</Link>}
        </div>
      </div>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-display text-4xl font-bold uppercase leading-none tracking-wide text-white">
            BLACK <span className="block text-lg tracking-[0.2em] text-[var(--color-accent)]">CAPITAL</span>
          </h1>
          <p className="text-sm text-white/50">Panel de administración</p>
        </div>

        <Suspense fallback={<div className="border border-white/[0.08] bg-white/[0.025] p-6 text-center text-white/50">Cargando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

