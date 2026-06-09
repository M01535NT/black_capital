"use client";

import { useState, type ReactNode } from "react";
import { Bell, LayoutDashboard, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminNoticeClass } from "@/components/admin/admin-ui";

const DEFAULTS = {
  startPage: "/admin",
  leadsView: "pipeline",
  internalNotifications: true,
  emailNotifications: true,
};

type Preferences = typeof DEFAULTS;

function readStoredPreferences(storageKey: string): Preferences {
  if (typeof window === "undefined") return DEFAULTS;
  const raw = window.localStorage.getItem(storageKey);
  if (!raw) return DEFAULTS;
  try {
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function AccountPreferencesForm({ profileId }: { profileId: string }) {
  const storageKey = `black-capital:account-preferences:${profileId}`;
  const [preferences, setPreferences] = useState<Preferences>(() => readStoredPreferences(storageKey));
  const [message, setMessage] = useState("");

  function save() {
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
    setMessage("Preferencias guardadas en este dispositivo.");
    window.setTimeout(() => setMessage(""), 2500);
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-2">
          <span className="inline-flex items-center gap-2 text-body-sm font-medium text-white/70">
            <LayoutDashboard className="h-4 w-4 text-[var(--color-accent)]" />
            Página inicial
          </span>
          <select
            value={preferences.startPage}
            onChange={(event) => setPreferences((current) => ({ ...current, startPage: event.target.value }))}
            className="h-10 w-full border border-white/[0.12] bg-[#0b0b0b] px-3 text-body-sm text-white"
          >
            <option className="bg-[#0b0b0b] text-white" value="/admin">Dashboard</option>
            <option className="bg-[#0b0b0b] text-white" value="/admin/leads">Leads</option>
            <option className="bg-[#0b0b0b] text-white" value="/admin/properties">Inventario</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-body-sm font-medium text-white/70">Vista preferida de leads</span>
          <select
            value={preferences.leadsView}
            onChange={(event) => setPreferences((current) => ({ ...current, leadsView: event.target.value }))}
            className="h-10 w-full border border-white/[0.12] bg-[#0b0b0b] px-3 text-body-sm text-white"
          >
            <option className="bg-[#0b0b0b] text-white" value="pipeline">Pipeline</option>
            <option className="bg-[#0b0b0b] text-white" value="table">Tabla</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <PreferenceToggle
          icon={<Bell className="h-4 w-4" />}
          label="Notificaciones internas"
          enabled={preferences.internalNotifications}
          onChange={(value) => setPreferences((current) => ({ ...current, internalNotifications: value }))}
        />
        <PreferenceToggle
          icon={<Bell className="h-4 w-4" />}
          label="Notificaciones por correo"
          enabled={preferences.emailNotifications}
          onChange={(value) => setPreferences((current) => ({ ...current, emailNotifications: value }))}
        />
      </div>

      {message && <p className={adminNoticeClass}>{message}</p>}

      <div className="flex justify-end border-t border-white/[0.06] pt-5">
        <Button type="button" onClick={save} className="brushed-gold rounded-full px-6 font-bold">
          <Save className="mr-2 h-4 w-4" />
          Guardar preferencias
        </Button>
      </div>
    </div>
  );
}

function PreferenceToggle({
  icon,
  label,
  enabled,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between border border-white/[0.08] bg-white/[0.025] px-4 py-3 text-left transition-colors hover:border-[var(--color-accent)]/25"
    >
      <span className="flex items-center gap-3 text-body-sm text-white/70">
        <span className="text-[var(--color-accent)]">{icon}</span>
        {label}
      </span>
      <span className={enabled ? "text-caption text-[var(--color-accent)]" : "text-caption text-white/35"}>
        {enabled ? "Activo" : "Inactivo"}
      </span>
    </button>
  );
}
