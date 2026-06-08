"use client";

import { useState } from "react";
import { Loader2, MailPlus, Shield, UserCircle } from "lucide-react";
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

interface Agent {
  id: string;
  full_name: string;
  email: string | null;
  is_active: boolean | null;
}

export function UsersClient({ initialUsers, agents }: { initialUsers: AdminUser[]; agents: Agent[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ full_name: "", email: "", role: "agent", agent_id: "" });
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
      setForm({ full_name: "", email: "", role: "agent", agent_id: "" });
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
          <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">Invitar usuario</p>
          <p className="mt-2 text-sm text-white/50">El usuario recibirá un enlace para definir su contraseña.</p>
        </div>
        <Input value={form.full_name} onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))} placeholder="Nombre completo" className="border-white/[0.1] bg-background/70 text-white" />
        <Input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="correo@empresa.com" className="border-white/[0.1] bg-background/70 text-white" />
        <select value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value, agent_id: e.target.value === "admin" ? "" : prev.agent_id }))} className="h-10 w-full border border-white/[0.12] bg-background/70 px-3 text-sm text-white">
          <option value="agent">Agente</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "agent" && (
          <select value={form.agent_id} onChange={(e) => setForm((prev) => ({ ...prev, agent_id: e.target.value }))} className="h-10 w-full border border-white/[0.12] bg-background/70 px-3 text-sm text-white">
            <option value="">Sin agente vinculado</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.full_name}</option>
            ))}
          </select>
        )}
        {error && <p className="bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}
        <Button disabled={saving || !form.email || !form.full_name} className="brushed-gold w-full rounded-full font-bold">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><MailPlus className="mr-2 h-4 w-4" /> Invitar</>}
        </Button>
      </form>

      <div className={`${adminCardClass} overflow-hidden`}>
        <div className="hidden grid-cols-[1fr_120px_120px] border-b border-white/[0.08] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white/42 sm:grid">
          <span>Usuario</span>
          <span>Rol</span>
          <span>Acceso</span>
        </div>
        {users.map((user) => (
          <div key={user.id} className="grid gap-3 border-b border-white/[0.06] px-4 py-4 sm:grid-cols-[1fr_120px_120px] sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border border-white/[0.08] bg-white/[0.025] text-white/60">
                {user.role === "admin" ? <Shield className="h-4 w-4 text-[var(--color-accent)]" /> : <UserCircle className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user.full_name}</p>
                <p className="truncate text-xs text-white/45">{user.email}</p>
              </div>
            </div>
            <span className="text-sm capitalize text-white/65 sm:block">
              <span className="mr-2 text-xs uppercase tracking-[0.12em] text-white/35 sm:hidden">Rol</span>
              {user.role}
            </span>
            <button onClick={() => toggleActive(user)} className={`w-fit px-2 py-1 text-xs font-semibold ${user.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.04] text-white/45"}`}>
              {user.is_active ? "Activo" : "Inactivo"}
            </button>
          </div>
        ))}
        {users.length === 0 && <p className="px-4 py-12 text-center text-sm text-white/45">No hay usuarios registrados.</p>}
      </div>
    </div>
  );
}
