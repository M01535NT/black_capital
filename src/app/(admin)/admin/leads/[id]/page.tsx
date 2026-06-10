import { createAdminClient } from "@/lib/supabase/admin";
import { canAccessAgentScopedResource, requireAdminSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Mail, Phone, Calendar, Globe, Tag, FileText, Clock, ListChecks, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { LeadActions } from "./lead-actions";
import { LeadTasks } from "./lead-tasks";
import { adminBadgeAccentClass, adminBadgeClass, adminBadgeMutedClass, adminCardClass } from "@/components/admin/admin-ui";
import { isPlaceholderEmail } from "@/lib/document-access";

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

    const [{ data: activities }, { data: tasks }, { data: documentRequests }] = await Promise.all([
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
        supabase
            .from("document_access_requests")
            .select("id, property_id, document_label, document_type, status, created_at, verified_at, delivered_at, properties(title, slug)")
            .eq("lead_id", id)
            .order("created_at", { ascending: false })
            .limit(20),
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
        brochure: "Documentos",
        landing_luxury: "Landing Luxury",
        landing_business: "Landing Business",
        landing_industrial: "Landing Industrial",
    };

    const hasEmail = !isPlaceholderEmail(lead.email);
    const phoneDigits = (lead.phone || "").replace(/[^0-9]/g, "");
    const whatsappHref = phoneDigits ? `https://wa.me/${phoneDigits}` : null;

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
                            {hasEmail ? (
                                <a href={`mailto:${lead.email}`}
                                    className="group flex items-center gap-3 border border-white/[0.06] bg-white/[0.025] p-3 transition-colors hover:border-[var(--color-accent)]/25"
                                >
                                    <Mail className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                                    <div>
                                    <p className="text-caption text-white/50">Correo</p>
                                        <p className="text-body-sm font-medium group-hover:text-[var(--color-accent)] transition-colors">{lead.email}</p>
                                    </div>
                                </a>
                            ) : (
                                <div className="flex items-center gap-3 border border-white/[0.06] bg-white/[0.025] p-3">
                                <Mail className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                                <div>
                                <p className="text-caption text-white/50">Correo</p>
                                    <p className="text-body-sm font-medium text-white/45">Sin correo registrado</p>
                                </div>
                                </div>
                            )}
                            {whatsappHref ? (
                                <a href={whatsappHref}
                                    target="_blank" rel="noopener noreferrer"
                                    className="group flex items-center gap-3 border border-white/[0.06] bg-white/[0.025] p-3 transition-colors hover:border-[var(--color-accent)]/25"
                                >
                                    <Phone className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                                    <div>
                                    <p className="text-caption text-white/50">Teléfono / WhatsApp</p>
                                    <p className="text-body-sm font-medium group-hover:text-[var(--color-accent)] transition-colors">{lead.phone}</p>
                                    </div>
                                </a>
                            ) : (
                                <div className="flex items-center gap-3 border border-white/[0.06] bg-white/[0.025] p-3">
                                <Phone className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                                <div>
                                <p className="text-caption text-white/50">Teléfono / WhatsApp</p>
                                <p className="text-body-sm font-medium text-white/45">Sin teléfono</p>
                                </div>
                                </div>
                            )}
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

                    <div className={`${adminCardClass} space-y-4 p-6`}>
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
                            <h3 className="text-caption text-white/50">Acceso Documental</h3>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="border border-white/[0.06] bg-white/[0.025] p-3">
                                <p className="text-caption text-white/45">WhatsApp</p>
                                <p className="mt-2 text-body-sm text-white">
                                    {lead.whatsapp_verified_at ? "Verificado" : "Pendiente"}
                                </p>
                                {lead.whatsapp_verified_at && (
                                    <p className="mt-1 text-xs text-white/42">
                                        {new Date(lead.whatsapp_verified_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
                                    </p>
                                )}
                            </div>
                            <div className="border border-white/[0.06] bg-white/[0.025] p-3">
                                <p className="text-caption text-white/45">NDA</p>
                                <p className="mt-2 text-body-sm text-white">
                                    {lead.nda_accepted_at ? "Aceptado" : "Sin aceptación"}
                                </p>
                                {lead.nda_version && <p className="mt-1 text-xs text-white/42">{lead.nda_version}</p>}
                            </div>
                            <div className="border border-white/[0.06] bg-white/[0.025] p-3">
                                <p className="text-caption text-white/45">Aviso</p>
                                <p className="mt-2 text-body-sm text-white">
                                    {lead.privacy_accepted ? "Aceptado" : "Sin aceptación"}
                                </p>
                                {lead.privacy_notice_version && <p className="mt-1 text-xs text-white/42">{lead.privacy_notice_version}</p>}
                            </div>
                        </div>
                    </div>

                    {documentRequests && documentRequests.length > 0 && (
                        <div className={`${adminCardClass} space-y-4 p-6`}>
                            <div className="flex items-center gap-2">
                                <LockKeyhole className="h-4 w-4 text-[var(--color-accent)]" />
                                <h3 className="text-caption text-white/50">Documentos Solicitados</h3>
                            </div>
                            <div className="space-y-3">
                                {documentRequests.map((request) => {
                                    const requestProperty = Array.isArray(request.properties)
                                        ? request.properties[0]
                                        : request.properties;
                                    const requestPropertyTitle = requestProperty?.title || "Propiedad";

                                    return (
                                        <div key={request.id} className="border border-white/[0.06] bg-white/[0.025] p-4">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                <div className="min-w-0">
                                                    <p className="text-body-sm font-medium text-white">{request.document_label}</p>
                                                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/40">
                                                        {request.document_type} · {requestPropertyTitle}
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className={request.status === "delivered" ? adminBadgeAccentClass : adminBadgeClass}>
                                                    {request.status === "pending_verification"
                                                        ? "Pendiente"
                                                        : request.status === "verified"
                                                            ? "Verificado"
                                                            : request.status === "delivered"
                                                                ? "Entregado"
                                                                : request.status}
                                                </Badge>
                                            </div>
                                            <div className="mt-3 grid gap-2 text-xs text-white/42 sm:grid-cols-3">
                                                <span>Solicitud: {new Date(request.created_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}</span>
                                                <span>{request.verified_at ? `Validado: ${new Date(request.verified_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}` : "Sin validar"}</span>
                                                <span>{request.delivered_at ? `Abierto: ${new Date(request.delivered_at).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}` : "Sin apertura"}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
                        {hasEmail && (
                            <a href={`mailto:${lead.email}`}
                                className="flex w-full items-center justify-center gap-2 border border-white/[0.1] px-4 py-2.5 text-body-sm font-medium transition-colors hover:border-[var(--color-accent)]/25"
                            >
                                <Mail className="w-4 h-4" /> Enviar Correo
                            </a>
                        )}
                        {whatsappHref && (
                            <a href={whatsappHref}
                                target="_blank" rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 bg-[var(--color-accent)] px-4 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[var(--color-gold-dark)]"
                            >
                                <Phone className="w-4 h-4" /> Abrir WhatsApp
                            </a>
                        )}
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
