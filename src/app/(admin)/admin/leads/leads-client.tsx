"use client";

import { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, BellRing, Clock, PlusCircle, Loader2, X, Check, ChevronDown, Users, Columns3, Table2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { AdminEmptyState, AdminPageHeader, adminCardClass } from "@/components/admin/admin-ui";

interface Lead {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    source: string;
    status: string;
    assigned_agent_id?: string | null;
    created_at: string;
    pending_tasks?: number;
    overdue_tasks?: number;
    due_today_tasks?: number;
    last_activity_at?: string | null;
}

interface Agent {
    id: string;
    full_name: string;
}

interface LeadsPageClientProps {
    leads: Lead[];
    agents: Agent[];
    supabaseError?: string | null;
}

const STATUS_OPTIONS = [
    { value: "new", label: "Nuevo", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    { value: "contacted", label: "Contactado", color: "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20" },
    { value: "qualified", label: "Calificado", color: "bg-white/[0.06] text-white/75 border-white/[0.12]" },
    { value: "lost", label: "Perdido", color: "bg-red-500/10 text-red-400 border-red-500/20" },
    { value: "won", label: "Ganado", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
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

function getLeadAttention(lead: Lead) {
    const lastActivity = lead.last_activity_at ? new Date(lead.last_activity_at) : null;
    const createdAt = new Date(lead.created_at);
    const reference = lastActivity || createdAt;
    const daysWithoutFollowUp = Math.floor((Date.now() - reference.getTime()) / 86_400_000);
    return {
        isOverdue: (lead.overdue_tasks || 0) > 0,
        dueToday: (lead.due_today_tasks || 0) > 0,
        stale: lead.status !== "won" && lead.status !== "lost" && daysWithoutFollowUp >= 3,
        daysWithoutFollowUp,
    };
}

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
                    <div className="absolute left-0 top-full z-20 mt-1 min-w-[150px] overflow-hidden border border-white/[0.08] bg-[#0b0b0b] py-1 shadow-2xl">
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
                                        ? "bg-[var(--color-accent)]/10 font-medium text-[var(--color-accent)]"
                                        : "text-white/70 hover:bg-white/[0.04]"
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
                        ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)] border-[var(--color-accent)]/20"
                        : "bg-white/[0.03] text-white/50 border-white/[0.08]"
                )}
            >
                {assigned ? assigned.full_name.split(" ")[0] : "Sin asignar"}
                <ChevronDown className="w-3 h-3" />
            </button>
            {open && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full z-20 mt-1 min-w-[170px] overflow-hidden border border-white/[0.08] bg-[#0b0b0b] py-1 shadow-2xl">
                        <button
                            onClick={() => {
                                onChange(lead.id, null);
                                setOpen(false);
                            }}
                            className={cn(
                                "w-full text-left px-3 py-2 text-xs transition-colors",
                                !assigned ? "font-medium text-[var(--color-accent)]" : "text-white/70 hover:bg-white/[0.04]"
                            )}
                        >
                            Sin asignar
                        </button>
                        <div className="border-t border-white/[0.06]" />
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
                                        ? "bg-[var(--color-accent)]/10 font-medium text-[var(--color-accent)]"
                                        : "text-white/70 hover:bg-white/[0.04]"
                                )}
                            >
                                <span className="h-2 w-2 bg-[var(--color-accent)]" />
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

export function LeadsPageClient({ leads, agents, supabaseError }: LeadsPageClientProps) {
    const [data, setData] = useState<Lead[]>(leads);
    const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
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

    const updateStatus = useCallback(async (id: string, status: string) => {
        // Save original status for rollback
        const originalStatus = data.find(l => l.id === id)?.status || "new";
        setData(prev => prev.map(l => l.id === id ? { ...l, status } : l));
        try {
            const res = await fetch("/api/leads", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (!res.ok) throw new Error("Error al actualizar estado");
        } catch (err) {
            console.error(err);
            // Rollback using the snapshot
            setData(prev => prev.map(l => l.id === id ? { ...l, status: originalStatus } : l));
        }
    }, [data]);

    const updateAgent = useCallback(async (id: string, agentId: string | null) => {
        const originalAgentId = data.find(l => l.id === id)?.assigned_agent_id ?? null;
        setData(prev => prev.map(l => l.id === id ? { ...l, assigned_agent_id: agentId } : l));
        try {
            // Leads agent assignment is done via the leads API
            const res = await fetch("/api/leads", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, assigned_agent_id: agentId }),
            });
            if (!res.ok) throw new Error("Error al asignar agente");
        } catch (err) {
            console.error(err);
            setData(prev => prev.map(l => l.id === id ? { ...l, assigned_agent_id: originalAgentId } : l));
        }
    }, [data]);

    const columns = useMemo<ColumnDef<Lead>[]>(() => [
        {
            accessorKey: "full_name",
            header: "Nombre",
            cell: ({ row }) => (
                <Link href={`/admin/leads/${row.original.id}`} className="font-bold text-white hover:text-[var(--color-accent)] transition-colors">
                    {row.getValue("full_name")}
                </Link>
            ),
        },
        {
            accessorKey: "email",
            header: "Correo",
            cell: ({ row }) => <span className="text-sm text-white/62">{row.getValue("email")}</span>,
        },
        {
            accessorKey: "phone",
            header: "Teléfono",
            cell: ({ row }) => <span className="text-sm text-white/62">{row.getValue("phone")}</span>,
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
            id: "attention",
            header: "Atención",
            cell: ({ row }) => {
                const attention = getLeadAttention(row.original);
                if (attention.isOverdue) return <span className="text-xs font-semibold text-red-400">Tarea vencida</span>;
                if (attention.dueToday) return <span className="text-xs font-semibold text-[var(--color-accent)]">Vence hoy</span>;
                if (attention.stale) return <span className="text-xs font-semibold text-white/55">Sin seguimiento {attention.daysWithoutFollowUp}d</span>;
                return <span className="text-xs text-white/30">Al día</span>;
            },
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
                return <div className="text-right text-sm text-white/45">{formatted}</div>;
            },
        },
    ], [agents, updateStatus, updateAgent]);

    const attentionLeads = useMemo(() => {
        return data.filter((lead) => {
            const attention = getLeadAttention(lead);
            return attention.isOverdue || attention.dueToday || attention.stale || !lead.assigned_agent_id;
        });
    }, [data]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!form.full_name || !form.email || !form.phone) {
            setError("Todos los campos marcados son obligatorios.");
            return;
        }

        setSubmitting(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- form payload, validated by zod schema
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
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.error || "Error al registrar lead");
            }

            const json = await res.json();
            // Add new lead to local state immediately (no page refresh needed)
            setData(prev => [json.lead, ...prev]);

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
                <AdminPageHeader
                    eyebrow="Comercial"
                    title="Leads"
                    description="Administra contactos, estado de seguimiento y asignación de asesores."
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex border border-white/[0.08] bg-white/[0.025] p-1">
                        <button
                            type="button"
                            onClick={() => setViewMode("kanban")}
                            className={cn("flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em]", viewMode === "kanban" ? "bg-[var(--color-accent)] text-black" : "text-white/55 hover:text-white")}
                        >
                            <Columns3 className="h-4 w-4" />
                            Pipeline
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("table")}
                            className={cn("flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em]", viewMode === "table" ? "bg-[var(--color-accent)] text-black" : "text-white/55 hover:text-white")}
                        >
                            <Table2 className="h-4 w-4" />
                            Tabla
                        </button>
                    </div>
                    <Button onClick={() => setOpen(true)} className="brushed-gold shrink-0 rounded-full px-6 font-bold">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Registrar lead
                    </Button>
                </div>

                {attentionLeads.length > 0 && (
                    <div className="grid gap-3 lg:grid-cols-3">
                        <AttentionSummary
                            icon={AlertTriangle}
                            label="Tareas vencidas"
                            value={data.filter((lead) => (lead.overdue_tasks || 0) > 0).length}
                            tone="red"
                        />
                        <AttentionSummary
                            icon={Clock}
                            label="Vencen hoy"
                            value={data.filter((lead) => (lead.due_today_tasks || 0) > 0).length}
                            tone="gold"
                        />
                        <AttentionSummary
                            icon={BellRing}
                            label="Sin seguimiento"
                            value={data.filter((lead) => getLeadAttention(lead).stale).length}
                            tone="muted"
                        />
                    </div>
                )}

                {data.length === 0 ? (
                    <>
                        <AdminEmptyState
                            icon={Users}
                            title="No hay leads registrados"
                            description="Registra tu primer lead para empezar a gestionar el embudo comercial."
                        />
                        {supabaseError && (
                            <div className="border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                                Error de conexión: {supabaseError}
                            </div>
                        )}
                    </>
                ) : (
                    viewMode === "kanban" ? (
                        <LeadKanban leads={data} agents={agents} onStatusChange={updateStatus} />
                    ) : (
                        <div className={`${adminCardClass} overflow-hidden`}>
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
                    )
                )}
            </div>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md border border-white/[0.08] bg-[#0b0b0b] shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/[0.08] p-4">
                            <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">Registrar lead</h3>
                            <button onClick={() => setOpen(false)} className="p-1 text-white/50 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-white/70">Nombre completo *</label>
                                <Input
                                    placeholder="Ej. Juan Pérez"
                                    value={form.full_name}
                                    onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-white/70">Correo electrónico *</label>
                                <Input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    value={form.email}
                                    onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-white/70">Teléfono *</label>
                                <Input
                                    placeholder="+52 555 123 4567"
                                    value={form.phone}
                                    onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-white/70">Origen</label>
                                <select
                                    value={form.source}
                                    onChange={e => setForm(prev => ({ ...prev, source: e.target.value }))}
                                    className="flex h-10 w-full border border-white/[0.12] bg-transparent px-3 py-2 text-sm text-white ring-offset-background focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
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
                                <label className="mb-1 block text-sm font-medium text-white/70">Estado</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="flex h-10 w-full border border-white/[0.12] bg-transparent px-3 py-2 text-sm text-white ring-offset-background focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                                >
                                    <option value="new">Nuevo</option>
                                    <option value="contacted">Contactado</option>
                                    <option value="qualified">Calificado</option>
                                    <option value="won">Ganado</option>
                                    <option value="lost">Perdido</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-white/70">Asesor asignado</label>
                                <select
                                    value={form.assigned_agent_id || ""}
                                    onChange={e => setForm(prev => ({ ...prev, assigned_agent_id: e.target.value || undefined }))}
                                    className="flex h-10 w-full border border-white/[0.12] bg-transparent px-3 py-2 text-sm text-white ring-offset-background focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                                >
                                    <option value="">Sin asignar</option>
                                    {agents.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.full_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-white/70">Notas</label>
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
                                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 border-white/[0.12] bg-white/[0.025] text-white">
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={submitting} className="brushed-gold flex-1 font-bold">
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

function AttentionSummary({
    icon: Icon,
    label,
    value,
    tone,
}: {
    icon: typeof AlertTriangle;
    label: string;
    value: number;
    tone: "red" | "gold" | "muted";
}) {
    return (
        <div className={cn(
            "flex items-center justify-between border p-4",
            tone === "red" && "border-red-500/20 bg-red-500/10 text-red-400",
            tone === "gold" && "border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
            tone === "muted" && "border-white/[0.08] bg-white/[0.025] text-white/55",
        )}>
            <div className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.14em]">{label}</span>
            </div>
            <span className="text-2xl font-light text-white">{value}</span>
        </div>
    );
}

function LeadKanban({
    leads,
    agents,
    onStatusChange,
}: {
    leads: Lead[];
    agents: Agent[];
    onStatusChange: (id: string, status: string) => void;
}) {
    return (
        <div className="grid gap-4 xl:grid-cols-5">
            {STATUS_OPTIONS.map((status) => {
                const items = leads.filter((lead) => lead.status === status.value);
                return (
                    <section key={status.value} className={`${adminCardClass} min-h-[360px] overflow-hidden`}>
                        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
                            <div className="flex items-center gap-2">
                                <span className={cn("h-2.5 w-2.5", status.color.split(" ")[0])} />
                                <h2 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-white/70">{status.label}</h2>
                            </div>
                            <span className="text-xs text-white/45">{items.length}</span>
                        </div>
                        <div className="space-y-3 p-3">
                            {items.map((lead) => {
                                const assigned = agents.find((agent) => agent.id === lead.assigned_agent_id);
                                return (
                                    <article key={lead.id} className="border border-white/[0.08] bg-white/[0.025] p-3 transition-colors hover:border-[var(--color-accent)]/30">
                                        <Link href={`/admin/leads/${lead.id}`} className="block font-semibold text-white hover:text-[var(--color-accent)]">
                                            {lead.full_name}
                                        </Link>
                                        <p className="mt-1 truncate text-xs text-white/45">{lead.email}</p>
                                        <LeadAttentionBadges lead={lead} />
                                        <div className="mt-3 flex items-center justify-between gap-2">
                                            <span className="truncate text-xs text-white/45">{assigned?.full_name || "Sin asignar"}</span>
                                            <select
                                                value={lead.status}
                                                onChange={(event) => onStatusChange(lead.id, event.target.value)}
                                                className="max-w-28 border border-white/[0.08] bg-[#0b0b0b] px-2 py-1 text-xs text-white"
                                            >
                                                {STATUS_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </article>
                                );
                            })}
                            {items.length === 0 && <p className="py-8 text-center text-sm text-white/35">Sin leads.</p>}
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

function LeadAttentionBadges({ lead }: { lead: Lead }) {
    const attention = getLeadAttention(lead);
    const badges: Array<{ label: string; className: string }> = [];
    if (attention.isOverdue) badges.push({ label: "Vencido", className: "border-red-500/20 bg-red-500/10 text-red-400" });
    if (attention.dueToday) badges.push({ label: "Hoy", className: "border-[var(--color-accent)]/20 bg-[var(--color-accent)]/10 text-[var(--color-accent)]" });
    if (!lead.assigned_agent_id) badges.push({ label: "Sin asignar", className: "border-white/[0.08] bg-white/[0.04] text-white/55" });
    if (attention.stale) badges.push({ label: `${attention.daysWithoutFollowUp}d sin seguimiento`, className: "border-white/[0.08] bg-white/[0.04] text-white/55" });
    if (badges.length === 0) return null;
    return (
        <div className="mt-3 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
                <span key={badge.label} className={cn("border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em]", badge.className)}>
                    {badge.label}
                </span>
            ))}
        </div>
    );
}
