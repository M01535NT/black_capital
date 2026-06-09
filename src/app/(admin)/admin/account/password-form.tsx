"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

export function AccountPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError("No se pudo actualizar la contraseña. Vuelve a iniciar sesión e intenta otra vez.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setMessage("Contraseña actualizada correctamente.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordInput
          label="Nueva contraseña"
          value={password}
          onChange={setPassword}
          showPassword={showPassword}
        />
        <PasswordInput
          label="Confirmar contraseña"
          value={confirmPassword}
          onChange={setConfirmPassword}
          showPassword={showPassword}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        className="text-caption text-white/45 inline-flex items-center gap-2 transition-colors hover:text-[var(--color-accent)]"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      </button>

      {error && <p className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-body-sm text-red-400">{error}</p>}
      {message && <p className="border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-body-sm text-emerald-400">{message}</p>}

      <div className="flex justify-end border-t border-white/[0.06] pt-5">
        <Button disabled={saving || !password || !confirmPassword} className="brushed-gold rounded-full px-6 font-bold">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
          Actualizar contraseña
        </Button>
      </div>
    </form>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  showPassword,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-body-sm font-medium text-white/70">{label}</span>
      <Input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        className="border-white/[0.1] bg-background/70 text-white"
      />
    </label>
  );
}
