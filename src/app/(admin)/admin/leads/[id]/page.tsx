import { createAdminClient } from "@/lib/supabase/admin";
import { canAccessAgentScopedResource, requireAdminSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Mail, Phone, Calendar, Globe, Tag, FileText, Clock, ListChecks } from "lucide-react";
import Link from "next/link";
import { LeadActions } from "./lead-actions";
import { LeadTasks } from "./lead-tasks";
import { adminBadgeAccentClass, adminBadgeClass, adminBadgeMutedClass, adminCardClass } from "@/components/admin/admin-ui";

export const revalidate = 0;

export default async function LeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const profile = await requireAdminSession();
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: lead, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !lead) {
        notFound();
    }
    if (!canAccessAgentScopedResource(profile, lead.assigned_agent_id)) {
        notFound();
    }

    // If lead has a property_id, get property title
    let propertyTitle: string | null = null;
    if (lead.property_id) {
        const { data: prop } = await supabase
            .from("properties")
            .select("title")
            .eq("id", lead.property_id)
            .single();
        if (prop) propertyTitle = prop.title;
    }

    const [{ data: activities }, { data: tasks }] = await Promise.all([
        supabase
            .from("lead_activities")
            .select("id, type, title, body, metadata, created_at, actor_profile_id")
            .eq("lead_id", id)
            .order("created_at", { ascending: false })
            .limit(20),
        supabase
            .from("lead_tasks")
            .select("id, title, description, due_at, priority, status, completed_at, created_at")
            .eq("lead_id", id)
            .order("created_at", { ascending: false }),
    ]);

    const statusMap: Record<string, { label: string; color: string }> = {
        new: { label: "Nuevo", color: adminBadgeAccentClass },
        contacted: { label: "Contactado", color: adminBadgeClass },
        qualified: { label: "Calificado", color: adminBadgeClass },
        lost: { label: "Perdido", color: adminBadgeMutedClass },
        won: { label: "Ganado", color: adminBadgeAccentClass },
    };

    const sourceLabels: Record<string, string> = {
        organic: "Orgánico",
        campaign: "Campaña",
        referral: "Referido",
        other: "Otro",
        landing_luxury: "Landing Luxury",
        landing_business: "Landing Business",
        landing_industrial: "Landing Industrial",
    };

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/leads">
                            <Button variant="outline" size="icon" className="h-8 w-8 border-white/[0.12] bg-white/[0.025] text-white/70 hover:text-[var(--color-accent)]">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                    </Link>
                    <div>
                        <h2 className="text-display-3 font-semibold text-white">{lead.full_name}</h2>
                        <p className="text-body-sm text-white/50">
                            Registrado {new Date(lead.created_at).toLocaleDateString("es-MX", { dateStyle: "long" })}
                        </p>
                    </div>
                </div>
                <LeadActions leadId={lead.id} currentStatus={lead.status} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Contact Card */}
                    <div className={`${adminCardClass} space-y-4 p-6`}>
                        <h3 className="text-caption text-white/50">Información de Contacto</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href={`mailto:${lead.email}`}
                                className="group flex items-center gap-3 border border-white/[0.06] bg-white/[0.025] p-3 transition-colors hover:border-[var(--color-accent)]/25"
                            >
                                <Mail className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                                <div>
                                <p className="text-caption text-white/50">Correo</p>
                                    <p className="text-body-sm font-medium group-hover:text-[var(--color-accent)] transition-colors">{lead.email}</p>
                                </div>
                            </a>
                            <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank" rel="noopener noreferrer"
                                className="group flex items-center gap-3 border border-white/[0.06] bg-white/[0.025] p-3 transition-colors hover:border-[var(--color-accent)]/25"
                            >
                                <Phone className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                                <div>
                                <p className="text-caption text-white/50">Teléfono / WhatsApp</p>
                                <p className="text-body-sm font-medium group-hover:text-[var(--color-accent)] transition-colors">{lead.phone}</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Status + Source */}
                    <div className={`${adminCardClass} space-y-4 p-6`}>
                        <h3 className="text-caption text-white/50">Detalles del Lead</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-caption text-white/50">Estado Actual</p>
                                <Badge variant="outline" className={(statusMap[lead.status] || {}).color || adminBadgeMutedClass}>
                                    {(statusMap[lead.status] || {}).label || lead.status}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-caption text-white/50">Origen</p>
                                <div className="flex items-center gap-2 text-body-sm">
                                    <Globe className="w-4 h-4 text-white/50" />
                                    {sourceLabels[lead.source] || lead.source}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-caption text-white/50">Fecha de Registro</p>
                                <div className="flex items-center gap-2 text-body-sm">
                                    <Calendar className="w-4 h-4 text-white/50" />
                                    {new Date(lead.created_at).toLocaleDateString("es-MX", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-caption text-white/50">ID</p>
                                    <div className="flex items-center gap-2 text-body-sm font-sans tabular-nums text-white/60">
                                    <Tag className="w-4 h-4 text-white/50" />
                                    {lead.id.slice(0, 8)}...
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property of Interest */}
                    {propertyTitle && (
                        <div className={`${adminCardClass} space-y-3 p-6`}>
                            <h3 className="text-caption text-white/50">Propiedad de Interés</h3>
                            <Link href={`/admin/properties/${lead.property_id}`}
                                className="group flex items-center gap-3 border border-white/[0.06] bg-white/[0.025] p-3 transition-colors hover:border-[var(--color-accent)]/25"
                            >
                                <FileText className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                                <span className="text-body-sm font-medium group-hover:text-[var(--color-accent)] transition-colors">{propertyTitle}</span>
                            </Link>
                        </div>
                    )}

                    {/* Notes */}
                    <div className={`${adminCardClass} space-y-4 p-6`}>
                        <h3 className="text-caption text-white/50">Notas Internas</h3>
                        {lead.notes ? (
                                <div className="whitespace-pre-wrap border border-white/[0.06] bg-white/[0.025] p-4 text-body leading-relaxed text-white/70">
                                {lead.notes}
                            </div>
                        ) : (
                            <p className="text-body-sm italic text-white/50">Sin notas registradas.</p>
                        )}
                    </div>

                    <div className={`${adminCardClass} space-y-4 p-6`}>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[var(--color-accent)]" />
                            <h3 className="text-caption text-white/50">Timeline de actividad</h3>
                        </div>
                        {activities && activities.length > 0 ? (
                            <div className="space-y-3">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="border-l border-[var(--color-accent)]/30 pl-4">
                                        <p className="text-body-sm font-medium text-white">{activity.title}</p>
                                        {activity.body && <p className="mt-1 whitespace-pre-wrap text-body text-white/60">{activity.body}</p>}
                                        <p className="mt-1 text-body-sm text-white/40">
                                            {new Date(activity.created_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-body-sm italic text-white/50">Sin actividad registrada.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className={`${adminCardClass} space-y-3 p-5`}>
                        <h3 className="text-caption text-white/50">Acciones Rápidas</h3>
                        <a href={`mailto:${lead.email}`}
                            className="flex w-full items-center justify-center gap-2 border border-white/[0.1] px-4 py-2.5 text-body-sm font-medium transition-colors hover:border-[var(--color-accent)]/25"
                        >
                            <Mail className="w-4 h-4" /> Enviar Correo
                        </a>
                        <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 bg-[var(--color-accent)] px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[var(--color-gold-dark)]"
                        >
                            <Phone className="w-4 h-4" /> Abrir WhatsApp
                        </a>
                    </div>

                    {/* Status Change Widget */}
                    <div className={`${adminCardClass} space-y-3 p-5`}>
                        <h3 className="text-caption text-white/50">Cambiar Estado</h3>
                        <LeadActions leadId={lead.id} currentStatus={lead.status} showInline />
                    </div>

                    <div className={`${adminCardClass} space-y-3 p-5`}>
                        <div className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4 text-[var(--color-accent)]" />
                        <h3 className="text-caption text-white/50">Seguimiento</h3>
                        </div>
                        <LeadTasks leadId={lead.id} initialTasks={tasks || []} />
                    </div>
                </div>
            </div>
        </div>
    );
}
