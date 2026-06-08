"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Power } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentStatusToggleProps {
  agentId: string;
  initialActive: boolean;
  compact?: boolean;
}

export function AgentStatusToggle({ agentId, initialActive, compact = false }: AgentStatusToggleProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(initialActive);
  const [saving, setSaving] = useState(false);

  async function toggleStatus() {
    const nextActive = !isActive;
    setSaving(true);

    try {
      const res = await fetch("/api/agents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agentId, is_active: nextActive }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json.error || "No se pudo actualizar el estado del agente");
      }

      setIsActive(nextActive);
      toast.success(nextActive ? "Agente activo" : "Agente inactivo");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar estado");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? "sm" : "default"}
      onClick={toggleStatus}
      disabled={saving}
      className={cn(
        "gap-2 border-white/[0.12] bg-white/[0.025] text-white hover:border-[var(--color-accent)]/40",
        compact && "h-8 rounded-full px-3 text-xs",
      )}
    >
      {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Power className="h-3.5 w-3.5" />}
      {compact ? (isActive ? "Inactivar" : "Activar") : (isActive ? "Marcar inactivo" : "Marcar activo")}
    </Button>
  );
}
