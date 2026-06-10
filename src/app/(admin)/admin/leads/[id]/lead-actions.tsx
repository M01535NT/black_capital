"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminBadgeAccentClass, adminBadgeClass, adminBadgeMutedClass } from "@/components/admin/admin-ui";

const STATUS_OPTIONS = [
    { value: "new", label: "Nuevo", color: adminBadgeAccentClass, dot: "bg-[var(--color-accent)]" },
    { value: "contacted", label: "Contactado", color: adminBadgeClass, dot: "bg-white/60" },
    { value: "qualified", label: "Calificado", color: adminBadgeClass, dot: "bg-white/60" },
    { value: "lost", label: "Perdido", color: adminBadgeMutedClass, dot: "bg-white/28" },
    { value: "won", label: "Ganado", color: adminBadgeAccentClass, dot: "bg-[var(--color-accent)]" },
];

interface LeadActionsProps {
    leadId: string;
    currentStatus: string;
    showInline?: boolean;
}

export function LeadActions({ leadId, currentStatus, showInline }: LeadActionsProps) {
    const [status, setStatus] = useState(currentStatus);
    const [open, setOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    async function changeStatus(newStatus: string) {
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/leads", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: leadId, status: newStatus }),
            });
            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json.error || "Error al actualizar estado");
            }
            setStatus(newStatus);
            setOpen(false);
            setMessage("Estado actualizado");
            router.refresh();
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Error");
        } finally {
            setSaving(false);
        }
    }

    async function saveNotes() {
        if (!notes.trim()) return;
        setSaving(true);
        setMessage("");
        try {
            const res = await fetch("/api/lead-activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lead_id: leadId, type: "note", body: notes }),
            });

            if (!res.ok) {
                const json = await res.json().catch(() => ({}));
                throw new Error(json.error || "Error al guardar nota");
            }
            setNotes("");
            setMessage("Nota guardada");
            router.refresh();
        } catch (err) {
            setMessage(err instanceof Error ? err.message : "Error");
        } finally {
            setSaving(false);
        }
    }

    if (showInline) {
        return (
            <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => changeStatus(opt.value)}
                            disabled={saving || opt.value === status}
                            className={cn(
                                "border px-3 py-1.5 text-xs font-medium transition-all",
                                opt.value === status
                                    ? opt.color
                                    : "border-white/[0.08] bg-transparent text-white/50 hover:border-white/[0.18] hover:text-white"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-2 border-t border-white/[0.06] pt-2">
                    <Textarea
                        placeholder="Agregar nota de seguimiento..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="h-20 text-sm"
                    />
                    <div className="flex items-center justify-between">
                        {message && <span className="text-xs text-[var(--color-accent)]">{message}</span>}
                        <Button
                            size="sm"
                            onClick={saveNotes}
                            disabled={saving || !notes.trim()}
                            className="bg-[var(--color-accent)] text-black hover:bg-[var(--color-gold-dark)] text-xs ml-auto"
                        >
                            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Guardar Nota
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <Button
                onClick={() => setOpen(!open)}
                className="bg-[var(--color-accent)] text-black hover:bg-[var(--color-gold-dark)] gap-2"
            >
                Cambiar Estado <ChevronDown className="w-4 h-4" />
            </Button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1 right-0 z-20 min-w-[180px] overflow-hidden border border-white/[0.08] bg-[#050505] py-1 shadow-2xl">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => changeStatus(opt.value)}
                                disabled={opt.value === status}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2",
                                    opt.value === status
                                        ? "text-[var(--color-accent)] font-medium bg-[var(--color-accent)]/5"
                                        : "text-white/70 hover:bg-white/[0.04]"
                                )}
                            >
                                <span className={cn("h-2 w-2", opt.dot)} />
                                {opt.label}
                                {opt.value === status && <Check className="w-3.5 h-3.5 ml-auto" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
            {message && <span className="ml-2 text-xs text-[var(--color-accent)]">{message}</span>}
        </div>
    );
}
