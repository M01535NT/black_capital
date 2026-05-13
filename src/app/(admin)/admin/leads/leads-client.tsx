"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { columns, LeadRow } from "./columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface LeadsPageClientProps {
    leads: LeadRow[];
}

export function LeadsPageClient({ leads }: LeadsPageClientProps) {
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        source: "organic",
        notes: "",
        status: "new",
    });
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!form.full_name || !form.email || !form.phone) {
            setError("Todos los campos marcados son obligatorios.");
            return;
        }

        setSubmitting(true);
        try {
            const supabase = createClient();
            const { error: insertError } = await supabase.from("leads").insert({
                name: form.full_name,
                email: form.email,
                phone: form.phone,
                source: form.source,
                notes: form.notes || null,
                status: form.status,
                privacy_accepted: true,
            });

            if (insertError) throw insertError;

            setOpen(false);
            setForm({ full_name: "", email: "", phone: "", source: "organic", notes: "", status: "new" });
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrar");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">Gestión de Leads</h2>
                        <p className="text-muted-foreground">
                            Administra los contactos de clientes potenciales, sus orígenes y estado en el embudo.
                        </p>
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        className="bg-gold-500 text-black hover:bg-gold-600 font-bold shrink-0"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Registrar Lead
                    </Button>
                </div>

                <div className="bg-card border border-foreground/10 rounded-xl overflow-hidden shadow-sm">
                    <DataTable
                        columns={columns}
                        data={leads}
                        searchPlaceholder="Buscar por nombre o correo..."
                        searchFields={["name", "email"]}
                        filters={[
                            { id: "source", label: "Origen", options: ["organic", "campaign", "referral", "other", "landing_luxury", "landing_business", "landing_industrial"] },
                            { id: "status", label: "Estado", options: ["new", "contacted", "qualified", "lost", "won"] },
                        ]}
                    />
                </div>
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-foreground/10 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
                            <h3 className="font-bold text-lg">Registrar Lead Manual</h3>
                            <button onClick={() => setOpen(false)} className="p-1 hover:text-foreground/50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Nombre Completo *</label>
                                <Input
                                    placeholder="Ej. Juan Pérez"
                                    value={form.full_name}
                                    onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Correo Electrónico *</label>
                                <Input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={form.email}
                                    onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Teléfono *</label>
                                <Input
                                    placeholder="+52 555 123 4567"
                                    value={form.phone}
                                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Origen</label>
                                <Select value={form.source} onValueChange={v => setForm(prev => ({ ...prev, source: v }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="organic">Orgánico</SelectItem>
                                        <SelectItem value="campaign">Campaña</SelectItem>
                                        <SelectItem value="referral">Referido</SelectItem>
                                        <SelectItem value="other">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Estado</label>
                                <Select value={form.status} onValueChange={v => setForm(prev => ({ ...prev, status: v }))}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">Nuevo</SelectItem>
                                        <SelectItem value="contacted">Contactado</SelectItem>
                                        <SelectItem value="qualified">Calificado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Notas</label>
                                <Textarea
                                    placeholder="Comentarios adicionales..."
                                    value={form.notes}
                                    onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                                    className="h-20"
                                />
                            </div>

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}

                            <div className="flex gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting} className="flex-1 bg-gold-500 text-black hover:bg-gold-600">
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Lead"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
