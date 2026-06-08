import { requireAdminSession } from "@/lib/auth";
import {
    getPropertiesCount,
    getAgentsCount,
    getLeadsCount,
    getLeadsByStatus,
    getRecentLeads,
    getRecentProperties,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import {
    Building2,
    Users,
    UserCircle,
    Mail,
    CalendarDays,
    Eye,
    Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AdminPageHeader, AdminSectionCard, AdminStatCard } from "@/components/admin/admin-ui";

export const revalidate = 0;

export default async function AdminDashboard() {
    const profile = await requireAdminSession();

    let totalProperties = await getPropertiesCount();
    let totalAgents = await getAgentsCount(true);
    let totalLeads = await getLeadsCount();
    let newLeads = await getLeadsCount("new");
    let leadsByStatus = await getLeadsByStatus();
    let recentLeads = await getRecentLeads(5);
    let recentProperties = await getRecentProperties(5);

    if (profile.role === "agent") {
        const { createAdminClient } = await import("@/lib/supabase/admin");
        const supabase = createAdminClient();
        const agentId = profile.agent_id || "00000000-0000-0000-0000-000000000000";
        const [{ data: assignedProperties }, { data: scopedLeads }, { data: scopedRecentLeads }] = await Promise.all([
            supabase.from("property_agents").select("property_id").eq("agent_id", agentId),
            supabase.from("leads").select("status").eq("assigned_agent_id", agentId),
            supabase.from("leads").select("id, full_name, email, phone, source, status, created_at").eq("assigned_agent_id", agentId).order("created_at", { ascending: false }).limit(5),
        ]);
        const propertyIds = (assignedProperties || []).map((row) => row.property_id);
        const { data: scopedRecentProperties } = propertyIds.length > 0
            ? await supabase.from("properties").select("id, title, business_type, price, currency, cover_image, status, created_at").in("id", propertyIds).order("created_at", { ascending: false }).limit(5)
            : { data: [] };
        totalProperties = propertyIds.length;
        totalAgents = 1;
        totalLeads = scopedLeads?.length || 0;
        newLeads = (scopedLeads || []).filter((lead) => lead.status === "new").length;
        leadsByStatus = scopedLeads || [];
        recentLeads = scopedRecentLeads || [];
        recentProperties = scopedRecentProperties || [];
    }

    const statusCounts: Record<string, number> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase leads status row
    (leadsByStatus || []).forEach((lead: any) => {
        statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
    });

    const funnelStages = [
        { key: "new", label: "Nuevo", color: "bg-sky-400", count: statusCounts.new || 0 },
        { key: "contacted", label: "Contactado", color: "bg-[var(--color-accent)]", count: statusCounts.contacted || 0 },
        { key: "qualified", label: "Calificado", color: "bg-white/70", count: statusCounts.qualified || 0 },
        { key: "won", label: "Ganado", color: "bg-emerald-400", count: statusCounts.won || 0 },
        { key: "lost", label: "Perdido", color: "bg-red-400", count: statusCounts.lost || 0 },
    ];

    const todayStr = new Date().toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency, maximumFractionDigits: 0 }).format(price);
    };

    const statusLabels: Record<string, string> = {
        new: "Nuevo",
        contacted: "Contactado",
        qualified: "Calificado",
        won: "Ganado",
        lost: "Perdido",
    };

    const sourceLabels: Record<string, string> = {
        organic: "Orgánico",
        campaign: "Campaña",
        referral: "Referido",
        landing_luxury: "Luxury",
        landing_business: "Business",
        landing_industrial: "Industrial",
        newsletter: "Newsletter",
    };

    const propertyStatusLabels: Record<string, string> = {
        Available: "Disponible",
        Under_Offer: "Bajo oferta",
        Sold: "Vendido",
        Rented: "Rentado",
    };

    const quickActions = [
        { label: "Nueva propiedad", href: "/admin/properties/new", icon: Plus },
        { label: "Revisar leads", href: "/admin/leads", icon: Mail },
        { label: "Nuevo agente", href: "/admin/agents/new", icon: UserCircle },
        { label: "Ver sitio", href: "/", icon: Eye },
    ];

    return (
        <div className="min-w-0 space-y-8">
            <AdminPageHeader
                eyebrow="Panel operativo"
                title="Dashboard"
                description="Resumen comercial para inventario, leads y equipo. Prioriza seguimiento y actualización de contenido."
            />

            <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AdminStatCard href="/admin/properties" icon={Building2} label="Propiedades" value={totalProperties || 0} note="Inventario registrado" />
                <AdminStatCard href="/admin/agents" icon={UserCircle} label="Agentes activos" value={totalAgents || 0} note="Equipo disponible" accent="muted" />
                <AdminStatCard href="/admin/leads" icon={Users} label="Leads totales" value={totalLeads || 0} note="Solicitudes capturadas" accent="blue" />
                <AdminStatCard href="/admin/leads?status=new" icon={Mail} label="Sin revisar" value={newLeads || 0} note="Requieren primer contacto" accent="green" />
            </div>

            <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="group flex min-h-16 items-center justify-between border border-white/[0.08] bg-white/[0.025] px-4 transition-colors hover:border-[var(--color-accent)]/30"
                    >
                        <span className="flex items-center gap-3 text-sm font-semibold text-white/78 group-hover:text-white">
                            <action.icon className="h-4 w-4 text-[var(--color-accent)]" />
                            {action.label}
                        </span>
                        <span className="text-[var(--color-accent)]">→</span>
                    </Link>
                ))}
            </div>

            <div className="grid min-w-0 gap-6 xl:grid-cols-12">
                <AdminSectionCard title="Embudo de leads" className="xl:col-span-4">
                    <div className="mb-5 flex min-w-0 items-center gap-2 text-sm text-white/55">
                        <CalendarDays className="h-4 w-4 text-[var(--color-accent)]" />
                        <span className="min-w-0 truncate capitalize">{todayStr}</span>
                    </div>
                    <div className="space-y-4">
                        {funnelStages.map((stage) => {
                            const pct = totalLeads > 0 ? Math.round((stage.count / totalLeads) * 100) : 0;
                            return (
                                <div key={stage.key} className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="font-semibold uppercase tracking-[0.14em] text-white/55">{stage.label}</span>
                                        <span className="text-white">{stage.count}</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden bg-white/[0.045]">
                                        <div className={`h-full ${stage.color}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </AdminSectionCard>

                <AdminSectionCard title="Leads recientes" action={{ label: "Ver todos", href: "/admin/leads" }} className="xl:col-span-4">
                    {recentLeads && recentLeads.length > 0 ? (
                        <div className="space-y-2">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {recentLeads.map((lead: any) => (
                                <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center gap-3 border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-[var(--color-accent)]/25">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--color-accent)]/10 text-sm font-bold text-[var(--color-accent)]">
                                        {(lead.full_name || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-white">{lead.full_name}</p>
                                        <p className="truncate text-xs text-white/45">{sourceLabels[lead.source] || lead.source}</p>
                                    </div>
                                    <Badge className="border border-white/[0.08] bg-white/[0.03] text-[10px] text-white/60">
                                        {statusLabels[lead.status] || lead.status}
                                    </Badge>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-sm text-white/45">No hay leads recientes.</p>
                    )}
                </AdminSectionCard>

                <AdminSectionCard title="Inventario reciente" action={{ label: "Ver inventario", href: "/admin/properties" }} className="xl:col-span-4">
                    {recentProperties && recentProperties.length > 0 ? (
                        <div className="space-y-2">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {recentProperties.map((property: any) => (
                                <Link key={property.id} href={`/admin/properties/${property.id}/edit`} className="flex items-center gap-3 border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-[var(--color-accent)]/25">
                                    <div className="relative h-11 w-11 shrink-0 overflow-hidden bg-white/[0.04]">
                                        {property.cover_image ? (
                                            <Image src={property.cover_image} alt={property.title} fill sizes="44px" className="object-cover" />
                                        ) : (
                                            <Building2 className="m-3 h-5 w-5 text-white/25" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-white">{property.title}</p>
                                        <p className="truncate text-xs text-white/45">
                                            {propertyStatusLabels[property.status] || property.status} · {property.business_type}
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-xs font-semibold text-[var(--color-accent)]">
                                        {formatPrice(property.price, property.currency)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="py-8 text-center text-sm text-white/45">No hay propiedades recientes.</p>
                    )}
                </AdminSectionCard>
            </div>
        </div>
    );
}
