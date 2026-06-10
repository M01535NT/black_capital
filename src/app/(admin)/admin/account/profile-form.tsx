"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminNoticeClass } from "@/components/admin/admin-ui";

interface AccountProfileFormProps {
  initialData: {
    full_name: string;
    phone: string;
    photo_url: string;
    license_number: string;
    bio: string;
  };
}

export function AccountProfileForm({ initialData }: AccountProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const res = await fetch("/api/admin/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || "No se pudo actualizar el perfil.");
      }

      setMessage("Perfil actualizado correctamente.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2 sm:col-span-2">
          <span className="text-body-sm font-medium text-white/70">Nombre completo</span>
          <Input
            value={form.full_name}
            onChange={(event) => setForm((current) => ({ ...current, full_name: event.target.value }))}
            className="border-white/[0.1] bg-background/70 text-white"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-body-sm font-medium text-white/70">Teléfono público</span>
          <Input
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="+52 664 000 0000"
            className="border-white/[0.1] bg-background/70 text-white"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-body-sm font-medium text-white/70">Cédula / licencia</span>
          <Input
            value={form.license_number}
            onChange={(event) => setForm((current) => ({ ...current, license_number: event.target.value }))}
            className="border-white/[0.1] bg-background/70 text-white"
          />
        </label>
        <label className="block space-y-2 sm:col-span-2">
          <span className="text-body-sm font-medium text-white/70">URL de foto pública</span>
          <Input
            value={form.photo_url}
            onChange={(event) => setForm((current) => ({ ...current, photo_url: event.target.value }))}
            placeholder="https://..."
            className="border-white/[0.1] bg-background/70 text-white"
          />
        </label>
        <label className="block space-y-2 sm:col-span-2">
          <span className="text-body-sm font-medium text-white/70">Bio pública</span>
          <Textarea
            value={form.bio}
            onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
            placeholder="Trayectoria, enfoque comercial y experiencia relevante."
            className="min-h-28 border-white/[0.1] bg-background/70 text-white"
          />
        </label>
      </div>

      {error && <p className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-body-sm text-red-400">{error}</p>}
      {message && <p className={adminNoticeClass}>{message}</p>}

      <div className="flex justify-end border-t border-white/[0.06] pt-5">
        <Button disabled={saving} className="brushed-gold rounded-full px-6 font-bold">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Guardar perfil
        </Button>
      </div>
    </form>
  );
}
