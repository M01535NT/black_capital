"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AccountEmailForm({ currentEmail }: { currentEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(currentEmail);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/account/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || "No se pudo actualizar el correo.");
      }

      setPassword("");
      setMessage("Correo actualizado correctamente.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el correo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-body-sm font-medium text-white/70">Nuevo correo</span>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="border-white/[0.1] bg-background/70 text-white"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-body-sm font-medium text-white/70">Contraseña actual</span>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            placeholder="Confirma tu contraseña"
            className="border-white/[0.1] bg-background/70 text-white"
          />
        </label>
      </div>

      {error && <p className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-body-sm text-red-400">{error}</p>}
      {message && <p className="border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-body-sm text-emerald-400">{message}</p>}

      <div className="flex justify-end border-t border-white/[0.06] pt-5">
        <Button disabled={saving || !email || !password || email === currentEmail} className="brushed-gold rounded-full px-6 font-bold">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          Actualizar correo
        </Button>
      </div>
    </form>
  );
}
