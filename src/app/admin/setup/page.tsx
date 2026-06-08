"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export default function AdminSetupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [setupToken, setSetupToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, setupToken }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "No se pudo crear el admin inicial.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (signInError) {
      router.push("/admin/login");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 border border-white/[0.08] bg-white/[0.025] p-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10">
          <ShieldCheck className="h-5 w-5 text-[var(--color-accent)]" />
        </div>
        <div className="text-center">
          <h1 className="font-display text-xl font-bold uppercase tracking-[0.16em] text-white">Primer administrador</h1>
          <p className="mt-2 text-sm text-white/50">Disponible sólo mientras no exista un admin activo.</p>
        </div>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" className="border-white/[0.1] bg-background/70 text-white" />
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="correo@empresa.com" className="border-white/[0.1] bg-background/70 text-white" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña inicial" className="border-white/[0.1] bg-background/70 text-white" />
        <Input type="password" value={setupToken} onChange={(e) => setSetupToken(e.target.value)} placeholder="Token de setup" className="border-white/[0.1] bg-background/70 text-white" />
        {error && <p className="bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <Button disabled={loading || !fullName || !email || password.length < 8 || !setupToken} className="brushed-gold w-full rounded-full font-bold">
          {loading ? "Creando..." : "Crear admin"}
        </Button>
      </form>
    </div>
  );
}
