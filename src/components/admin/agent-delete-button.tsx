"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldAlert, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AgentDeleteButtonProps {
  agentId: string;
  agentName: string;
  compact?: boolean;
}

export function AgentDeleteButton({ agentId, agentName, compact = false }: AgentDeleteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function deleteAgent() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/agents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agentId, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "No se pudo eliminar el agente");

      toast.success("Agente eliminado");
      setOpen(false);
      router.push("/admin/agents");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el agente");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size={compact ? "icon" : "default"}
        onClick={() => setOpen(true)}
        className={compact ? "h-7 w-7 border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20" : "gap-2 border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {!compact && "Eliminar"}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-red-500/20 bg-[#0b0b0b] shadow-2xl">
            <div className="flex items-start justify-between border-b border-white/[0.08] p-5">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 items-center justify-center border border-red-500/20 bg-red-500/10 text-red-300">
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-white">Eliminar agente</h3>
                  <p className="mt-1 text-sm text-white/50">
                    Se eliminara definitivamente a {agentName}. Esta accion requiere tu contraseña.
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="text-white/45 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-white/70">Contraseña de administrador</span>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Confirma tu contraseña"
                  className="border-white/[0.1] bg-background/70 text-white"
                />
              </label>
              {error && <p className="border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={deleting} className="flex-1 border-white/[0.12] bg-white/[0.025] text-white">
                  Cancelar
                </Button>
                <Button type="button" onClick={deleteAgent} disabled={deleting || !password} className="flex-1 bg-red-500 text-white hover:bg-red-600">
                  {deleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
