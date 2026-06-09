"use client";

import { useState } from "react";
import { Loader2, MailPlus, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminCardClass } from "@/components/admin/admin-ui";

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "agent";
  agent_id: string | null;
  is_active: boolean;
  invited_at: string | null;
  last_seen_at: string | null;
}

export function UsersClient({ initialUsers }: {
  initialUsers: AdminUser[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ full_name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function refreshUsers() {
    const res = await fetch("/api/admin/users");
    if (!res.ok) return;
    const json = await res.json();
    setUsers(json.users || []);
  }

  async function invite(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "No se pudo invitar usuario.");
    } else {
      setForm({ full_name: "", email: "" });
      await refreshUsers();
    }
    setSaving(false);
  }

  async function toggleActive(user: AdminUser) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, is_active: !user.is_active }),
    });
    setUsers((current) => current.map((item) => item.id === user.id ? { ...item, is_active: !item.is_active } : item));
  }

  return (
    <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
      <form onSubmit={invite} className={`${adminCardClass} min-w-0 space-y-4 p-5`}>
        <div>
          <p className="text-caption text-[var(--color-accent)]">Invitar administrador</p>
          <p className="mt-2 text-body-sm text-white/50">Para agentes usa la sección Agentes. Aquí solo se gestiona acceso administrativo.</p>
        </div>
        <Input value={form.full_name} onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))} placeholder="Nombre completo" className="border-white/[0.1] bg-background/70 text-white" />
        <Input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="correo@empresa.com" className="border-white/[0.1] bg-background/70 text-white" />
        {error && <p className="bg-red-500/10 px-3 py-2 text-body-sm text-red-400">{error}</p>}
        <Button disabled={saving || !form.email || !form.full_name} className="brushed-gold w-full rounded-full font-bold">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><MailPlus className="mr-2 h-4 w-4" /> Invitar administrador</>}
        </Button>
      </form>

      <div className={`${adminCardClass} overflow-hidden`}>
        <div className="hidden grid-cols-[1fr_120px_120px] border-b border-white/[0.08] px-4 py-3 text-caption text-white/42 sm:grid">
          <span>Usuario</span>
          <span>Rol</span>
          <span>Acceso</span>
        </div>
        {users.map((user) => (
          <div key={user.id} className="grid gap-3 border-b border-white/[0.06] px-4 py-4 sm:grid-cols-[1fr_120px_120px] sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-white/[0.08] bg-white/[0.025] text-white/60">
                <Shield className="h-4 w-4 text-[var(--color-accent)]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-body-sm font-medium text-white">{user.full_name}</p>
                <p className="truncate text-body-sm text-white/45">{user.email}</p>
            </div>
          </div>
            <span className="text-body-sm capitalize text-white/65 sm:block">
              <span className="mr-2 text-caption text-white/35 sm:hidden">Rol</span>
              {user.role}
            </span>
            <button onClick={() => toggleActive(user)} className={`w-fit px-2 py-1 text-caption ${user.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.04] text-white/45"}`}>
              {user.is_active ? "Activo" : "Inactivo"}
            </button>
          </div>
        ))}
        {users.length === 0 && <p className="px-4 py-12 text-center text-body-sm text-white/45">No hay usuarios registrados.</p>}
      </div>
    </div>
  );
}
