"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { adminNoticeClass } from "@/components/admin/admin-ui";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${origin}/admin/update-password`,
    });

    if (resetError) setError("No se pudo enviar el enlace. Intenta nuevamente.");
    else setMessage("Si el correo existe, recibirá un enlace para restaurar la contraseña.");
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 border border-white/[0.08] bg-white/[0.025] p-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10">
          <Mail className="h-5 w-5 text-[var(--color-accent)]" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-xl font-bold uppercase tracking-[0.16em] text-white">Restaurar acceso</h1>
          <p className="mt-2 text-sm text-white/50">Enviaremos un enlace de recuperación al correo del usuario.</p>
        </div>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@empresa.com" className="border-white/[0.1] bg-background/70 text-white" />
        {message && <p className={adminNoticeClass}>{message}</p>}
        {error && <p className="bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <Button disabled={loading || !email} className="brushed-gold w-full rounded-full font-bold">
          {loading ? "Enviando..." : "Enviar enlace"}
        </Button>
        <Link href="/admin/login" className="block text-center text-xs text-white/45 hover:text-[var(--color-accent)]">Volver al login</Link>
      </form>
    </div>
  );
}
