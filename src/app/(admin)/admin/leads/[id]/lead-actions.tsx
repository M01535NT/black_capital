"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
    { value: "new", label: "Nuevo", color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
    { value: "contacted", label: "Contactado", color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" },
    { value: "qualified", label: "Calificado", color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
    { value: "lost", label: "Perdido", color: "bg-red-500/10 text-red-500 hover:bg-red-500/20" },
    { value: "won", label: "Ganado", color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" },
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
            // Append note locally
            const timestamp = new Date().toLocaleString("es-MX");
            const newNote = `[${timestamp}] ${notes}`;

            // The API uses PUT to update — we append locally and send the full notes
            // For simplicity, we'll construct the appended notes from what we know
            const res = await fetch("/api/leads", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: leadId, notes: newNote }),
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
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                opt.value === status
                                    ? `${opt.color} border-current`
                                    : "bg-transparent text-foreground/50 border-foreground/10 hover:border-foreground/30"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-2 pt-2 border-t border-foreground/5">
                    <Textarea
                        placeholder="Agregar nota de seguimiento..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="h-20 text-sm"
                    />
                    <div className="flex items-center justify-between">
                        {message && <span className="text-xs text-emerald-500">{message}</span>}
                        <Button
                            size="sm"
                            onClick={saveNotes}
                            disabled={saving || !notes.trim()}
                            className="bg-gold-500 text-black hover:bg-gold-600 text-xs ml-auto"
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
                className="bg-gold-500 text-black hover:bg-gold-600 gap-2"
            >
                Cambiar Estado <ChevronDown className="w-4 h-4" />
            </Button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1 right-0 z-20 min-w-[180px] bg-card border border-foreground/10 rounded-xl shadow-2xl py-1 overflow-hidden">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => changeStatus(opt.value)}
                                disabled={opt.value === status}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2",
                                    opt.value === status
                                        ? "text-gold-500 font-medium bg-gold-500/5"
                                        : "text-foreground/70 hover:bg-muted/50"
                                )}
                            >
                                <span className={cn("w-2 h-2 rounded-full", opt.color.split(" ")[0])} />
                                {opt.label}
                                {opt.value === status && <Check className="w-3.5 h-3.5 ml-auto" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
            {message && <span className="text-xs text-emerald-500 ml-2">{message}</span>}
        </div>
    );
}
