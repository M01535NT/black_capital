"use client";

import { useState, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Loader2, X, Check, ChevronDown, Users, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Lead {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    assigned_agent_id?: string | null;
    created_at: string;
}

interface Agent {
    id: string;
    full_name: string;
}

interface LeadsPageClientProps {
    leads: Lead[];
    agents: Agent[];
}

const STATUS_OPTIONS = [
    { value: "new", label: "Nuevo", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
    { value: "contacted", label: "Contactado", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    { value: "qualified", label: "Calificado", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    { value: "lost", label: "Perdido", color: "bg-red-500/10 text-red-500 border-red-500/20" },
    { value: "won", label: "Ganado", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
];

const sourceLabels: Record<string, string> = {
    organic: "Orgánico",
    campaign: "Campaña",
    referral: "Referido",
    other: "Otro",
    landing_luxury: "Luxury",
    landing_business: "Business",
    landing_industrial: "Industrial",
};

function StatusCell({ lead, onChange }: { lead: Lead; onChange: (id: string, status: string) => void }) {
    const [open, setOpen] = useState(false);
    const current = STATUS_OPTIONS.find(s => s.value === lead.status) || STATUS_OPTIONS[0];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border transition-all",
                    current.color
                )}
            >
                {current.label}
                <ChevronDown className="w-3 h-3" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1 left-0 z-20 min-w-[140px] bg-card border border-foreground/10 rounded-xl shadow-2xl py-1 overflow-hidden">
                        {STATUS_OPTIONS.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(lead.id, opt.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2",
                                    opt.value === lead.status
                                        ? "text-gold-500 font-medium bg-gold-500/5"
                                        : "text-foreground/70 hover:bg-muted/50"
                                )}
                            >
                                <span className={cn("w-2 h-2 rounded-full", opt.color.split(" ")[0])} />
                                {opt.label}
                                {opt.value === lead.status && <Check className="w-3 h-3 ml-auto" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function AgentCell({ lead, agents, onChange }: { lead: Lead; agents: Agent[]; onChange: (id: string, agentId: string | null) => void }) {
    const [open, setOpen] = useState(false);
    const assigned = agents.find(a => a.id === lead.assigned_agent_id);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border transition-all",
                    assigned
                        ? "bg-gold-500/10 text-gold-500 border-gold-500/20"
                        : "bg-muted/30 text-foreground/50 border-foreground/10"
                )}
            >
                {assigned ? assigned.full_name.split(" ")[0] : "Sin asignar"}
                <ChevronDown className="w-3 h-3" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute top-full mt-1 left-0 z-20 min-w-[160px] bg-card border border-foreground/10 rounded-xl shadow-2xl py-1 overflow-hidden">
                        <button
                            onClick={() => {
                                onChange(lead.id, null);
                                setOpen(false);
                            }}
                            className={cn(
                                "w-full text-left px-3 py-2 text-xs transition-colors",
                                !assigned ? "text-gold-500 font-medium" : "text-foreground/70 hover:bg-muted/50"
                            )}
                        >
                            Sin asignar
                        </button>
                        <div className="border-t border-foreground/5" />
                        {agents.map((agent) => (
                            <button
                                key={agent.id}
                                onClick={() => {
                                    onChange(lead.id, agent.id);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2",
                                    agent.id === lead.assigned_agent_id
                                        ? "text-gold-500 font-medium bg-gold-500/5"
                                        : "text-foreground/70 hover:bg-muted/50"
                                )}
                            >
                                <span className="w-2 h-2 rounded-full bg-gold-500" />
                                {agent.full_name}
                                {agent.id === lead.assigned_agent_id && <Check className="w-3 h-3 ml-auto" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export function LeadsPageClient({ leads, agents }: LeadsPageClientProps) {
    const [data, setData] = useState<Lead[]>(leads);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        full_name: "",
        email: "",
        phone: "",
        source: "organic",
        notes: "",
        status: "new",
        assigned_agent_id: "" as string | undefined,
    });
    const [error, setError] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const updateStatus = useCallback(async (id: string, status: string) => {
        // Save original status for rollback
        const originalStatus = data.find(l => l.id === id)?.status || "new";
        setData(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        try {
            const { error: updErr } = await supabase.from("leads").update({ status }).eq("id", id);
            if (updErr) throw updErr;
        } catch (err) {
            console.error(err);
            // Rollback using the snapshot we captured
            setData(prev => prev.map(l => l.id === id ? { ...l, status: originalStatus } : l));
        }
    }, [supabase, data]);

    const updateAgent = useCallback(async (id: string, agentId: string | null) => {
        const originalAgentId = data.find(l => l.id === id)?.assigned_agent_id ?? null;
        setData(prev => prev.map(l => l.id === id ? { ...l, assigned_agent_id: agentId } : l));
        try {
            const { error: updErr } = await supabase.from("leads").update({ assigned_agent_id: agentId }).eq("id", id);
            if (updErr) throw updErr;
        } catch (err) {
            console.error(err);
            setData(prev => prev.map(l => l.id === id ? { ...l, assigned_agent_id: originalAgentId } : l));
        }
    }, [supabase, data]);

    const columns = useMemo<ColumnDef<Lead>[]>(() => [
        {
            accessorKey: "full_name",
            header: "Nombre",
            cell: ({ row }) => (
                <Link href={`/admin/leads/${row.original.id}`} className="font-bold text-foreground hover:text-gold-500 transition-colors">
                    {row.getValue("full_name")}
                </Link>
            ),
        },
        {
            accessorKey: "email",
            header: "Correo",
            cell: ({ row }) => <span className="text-foreground/70 text-sm">{row.getValue("email")}</span>,
        },
        {
            accessorKey: "phone",
            header: "Teléfono",
            cell: ({ row }) => <span className="text-foreground/70 text-sm">{row.getValue("phone")}</span>,
        },
        {
            accessorKey: "source",
            header: "Origen",
            cell: ({ row }) => {
                const source = row.getValue("source") as string;
                return <div className="capitalize text-sm">{sourceLabels[source] || source}</div>;
            },
        },
        {
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => <StatusCell lead={row.original} onChange={updateStatus} />,
        },
        {
            id: "assigned_agent",
            header: "Asesor",
            cell: ({ row }) => <AgentCell lead={row.original} agents={agents} onChange={updateAgent} />,
        },
        {
            accessorKey: "created_at",
            header: () => <div className="text-right">Fecha</div>,
            cell: ({ row }) => {
                const dateStr = row.getValue("created_at") as string;
                const date = new Date(dateStr);
                const formatted = new Intl.DateTimeFormat("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }).format(date);
                return <div className="text-right text-muted-foreground text-sm">{formatted}</div>;
            },
        },
    ], [agents, updateStatus, updateAgent]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!form.full_name || !form.email || !form.phone) {
            setError("Todos los campos marcados son obligatorios.");
            return;
        }

        setSubmitting(true);
        try {
            const payload: any = {
                full_name: form.full_name,
                email: form.email,
                phone: form.phone,
                source: form.source,
                notes: form.notes || null,
                status: form.status,
                privacy_accepted: true,
            };
            if (form.assigned_agent_id) {
                payload.assigned_agent_id = form.assigned_agent_id;
            }
            const { error: insertError } = await supabase.from("leads").insert(payload);

            if (insertError) throw insertError;

            setOpen(false);
            setForm({ full_name: "", email: "", phone: "", source: "organic", notes: "", status: "new", assigned_agent_id: undefined });
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
                        <h2 className="font-display uppercase tracking-wider text-2xl font-bold text-foreground">Gestión de Leads</h2>
                        <p className="text-muted-foreground text-sm">
                            Administra contactos, estados y asignaciones.
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

                {data.length === 0 ? (
                    <div className="bg-card border border-foreground/10 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 flex items-center justify-center">
                            <Users className="w-8 h-8 text-gold-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 font-display uppercase tracking-wider">No hay leads registrados</h3>
                        <p className="text-foreground/50 mb-6">Registra tu primer lead para empezar a gestionar el embudo de ventas.</p>
                        <Button
                            onClick={() => setOpen(true)}
                            className="bg-gold-500 text-black hover:bg-gold-600 font-bold"
                        >
                            Registrar Lead
                        </Button>
                    </div>
                ) : (
                    <div className="bg-card border border-foreground/10 rounded-xl overflow-hidden shadow-sm">
                        <DataTable
                            columns={columns}
                            data={data}
                            searchPlaceholder="Buscar por nombre o correo..."
                            searchFields={["full_name", "email"]}
                            filters={[
                                { id: "source", label: "Origen", options: ["organic", "campaign", "referral", "other", "landing_luxury", "landing_business", "landing_industrial"] },
                                { id: "status", label: "Estado", options: ["new", "contacted", "qualified", "lost", "won"] },
                            ]}
                        />
                    </div>
                )}
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-foreground/10 rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-4 border-b border-foreground/10">
                            <h3 className="font-bold text-lg font-display uppercase tracking-wider">Registrar Lead Manual</h3>
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
                                <select
                                    value={form.source}
                                    onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))}
                                    className="flex h-10 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                                >
                                    <option value="organic">Orgánico</option>
                                    <option value="campaign">Campaña</option>
                                    <option value="referral">Referido</option>
                                    <option value="other">Otro</option>
                                    <option value="landing_luxury">Landing Luxury</option>
                                    <option value="landing_business">Landing Business</option>
                                    <option value="landing_industrial">Landing Industrial</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Estado</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="flex h-10 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                                >
                                    <option value="new">Nuevo</option>
                                    <option value="contacted">Contactado</option>
                                    <option value="qualified">Calificado</option>
                                    <option value="won">Ganado</option>
                                    <option value="lost">Perdido</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Asesor Asignado</label>
                                <select
                                    value={form.assigned_agent_id || ""}
                                    onChange={e => setForm(prev => ({ ...prev, assigned_agent_id: e.target.value || undefined }))}
                                    className="flex h-10 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-gold-500/40"
                                >
                                    <option value="">Sin asignar</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.full_name}</option>
                                    ))}
                                </select>
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
