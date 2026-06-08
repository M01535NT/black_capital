"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    async function waitForSession(supabase: ReturnType<typeof createClient>) {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const { data } = await supabase.auth.getSession();
        if (data.session) return data.session;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
      return null;
    }

    async function prepareRecoverySession() {
      const supabase = createClient();
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const hashError = hashParams.get("error_code") || hashParams.get("error");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (hashError) {
        if (mounted) {
          setSessionReady(false);
          setCheckingSession(false);
          setError("El enlace expiró o ya fue utilizado. Solicita uno nuevo.");
        }
        return;
      }

      let authError: string | null = null;
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) authError = exchangeError.message;
      } else if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError) authError = sessionError.message;
      }

      const session = await waitForSession(supabase);
      if (mounted) {
        setSessionReady(Boolean(session));
        setCheckingSession(false);
        if (session) {
          setError("");
          window.history.replaceState({}, "", "/admin/update-password");
        } else {
          setError(
            authError
              ? "El enlace expiró o ya fue utilizado. Solicita uno nuevo."
              : "Abre el enlace más reciente desde tu correo o solicita uno nuevo."
          );
        }
      }
    }

    prepareRecoverySession();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (!sessionReady) {
      setError("No hay una sesión activa para cambiar la contraseña. Solicita un enlace nuevo.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError("El enlace expiró o no hay una sesión de recuperación activa.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 border border-white/[0.08] bg-white/[0.025] p-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10">
          <Lock className="h-5 w-5 text-[var(--color-accent)]" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-xl font-bold uppercase tracking-[0.16em] text-white">Nueva contraseña</h1>
          <p className="mt-2 text-sm text-white/50">Define una contraseña segura para tu cuenta.</p>
        </div>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="border-white/[0.1] bg-background/70 pr-12 text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            disabled={!password}
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-white/55 transition-colors hover:text-white disabled:opacity-35"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <p className="bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <Button disabled={checkingSession || loading || !password || !sessionReady} className="brushed-gold w-full rounded-full font-bold">
          {checkingSession ? "Validando enlace..." : loading ? "Guardando..." : "Actualizar contraseña"}
        </Button>
        <Link href="/admin/login" className="block text-center text-xs text-white/45 hover:text-[var(--color-accent)]">Volver al login</Link>
      </form>
    </div>
  );
}
