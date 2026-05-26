import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Building2,
    Users,
    UserCircle,
    TrendingUp,
    ArrowRight,
    Mail,
    Phone,
    CalendarDays,
    ClipboardList,
    Briefcase,
    Eye,
} from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboard() {
    const supabase = await createClient();

    // ── Stats ──
    const { count: totalProperties } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });

    const { count: totalAgents } = await supabase
        .from("agents")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

    const { count: totalLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true });

    const { count: newLeads } = await supabase
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "new");

    // ── Leads by status ──
    const { data: leadsByStatus } = await supabase
        .from("leads")
        .select("status")
        .not("status", "is", null);

    const statusCounts: Record<string, number> = {};
    (leadsByStatus || []).forEach((l: any) => {
        statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
    });

    const funnelStages = [
        { key: "new", label: "Nuevo", color: "bg-blue-500", count: statusCounts["new"] || 0, total: totalLeads || 1 },
        { key: "contacted", label: "Contactado", color: "bg-yellow-500", count: statusCounts["contacted"] || 0, total: totalLeads || 1 },
        { key: "qualified", label: "Calificado", color: "bg-purple-500", count: statusCounts["qualified"] || 0, total: totalLeads || 1 },
        { key: "won", label: "Ganado", color: "bg-emerald-500", count: statusCounts["won"] || 0, total: totalLeads || 1 },
        { key: "lost", label: "Perdido", color: "bg-red-500", count: statusCounts["lost"] || 0, total: totalLeads || 1 },
    ];

    // ── Recent leads ──
    const { data: recentLeads } = await supabase
        .from("leads")
        .select("id, full_name, email, phone, source, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

    // ── Recent properties ──
    const { data: recentProperties } = await supabase
        .from("properties")
        .select("id, title, business_type, price, currency, cover_image, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

    const today = new Date();
    const todayStr = today.toLocaleDateString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    const statusColors: Record<string, string> = {
        Available: "text-emerald-500 bg-emerald-500/10",
        Under_Offer: "text-yellow-500 bg-yellow-500/10",
        Sold: "text-red-500 bg-red-500/10",
        Rented: "text-blue-500 bg-blue-500/10",
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
    };

    const quickActions = [
        {
            label: "Nueva Propiedad",
            href: "/admin/properties/new",
            icon: Building2,
            color: "text-gold-500",
            bg: "bg-gold-500/10",
        },
        {
            label: "Nuevo Lead",
            href: "/admin/leads",
            icon: Users,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Nuevo Agente",
            href: "/admin/agents/new",
            icon: UserCircle,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
        },
        {
            label: "Ver Inventario",
            href: "/admin/properties",
            icon: Eye,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header + Date */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="font-display uppercase tracking-wider text-3xl text-foreground">Dashboard</h2>
                    <p className="text-foreground/50 text-sm mt-1">Panel de control de Black Corporativo.</p>
                </div>
                <div className="flex items-center gap-3 bg-card border border-foreground/10 rounded-xl px-4 py-2">
                    <CalendarDays className="w-4 h-4 text-gold-500" />
                    <span className="text-sm text-foreground/70 capitalize">{todayStr}</span>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                    <Link
                        key={action.href}
                        href={action.href}
                        className="group bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300 flex items-center gap-4"
                    >
                        <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center shrink-0`}>
                            <action.icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground group-hover:text-gold-500 transition-colors uppercase tracking-wider">
                                {action.label}
                            </p>
                            <p className="text-[10px] text-foreground/40 mt-0.5">Ir ahora</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-foreground/20 ml-auto group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
                    </Link>
                ))}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/properties" className="bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <Building2 className="w-5 h-5 text-gold-500" />
                        <TrendingUp className="w-4 h-4 text-foreground/20 group-hover:text-gold-500/50 transition-colors" />
                    </div>
                    <p className="text-3xl font-numerics font-bold text-foreground">{totalProperties || 0}</p>
                    <p className="text-[10px] text-foreground/50 mt-1 uppercase tracking-wider font-display">Propiedades en inventario</p>
                </Link>
                <Link href="/admin/agents" className="bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <UserCircle className="w-5 h-5 text-gold-500" />
                    </div>
                    <p className="text-3xl font-numerics font-bold text-foreground">{totalAgents || 0}</p>
                    <p className="text-[10px] text-foreground/50 mt-1 uppercase tracking-wider font-display">Agentes activos</p>
                </Link>
                <Link href="/admin/leads" className="bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <Users className="w-5 h-5 text-gold-500" />
                    </div>
                    <p className="text-3xl font-numerics font-bold text-foreground">{totalLeads || 0}</p>
                    <p className="text-[10px] text-foreground/50 mt-1 uppercase tracking-wider font-display">Leads totales</p>
                </Link>
                <Link href="/admin/leads?status=new" className="bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/20 transition-all group relative">
                    <div className="flex items-center justify-between mb-3">
                        <Mail className="w-5 h-5 text-gold-500" />
                        {(newLeads ?? 0) > 0 && (
                            <span className="bg-gold-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {newLeads} nuevo{(newLeads ?? 0) !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                    <p className="text-3xl font-numerics font-bold text-foreground">{newLeads || 0}</p>
                    <p className="text-[10px] text-foreground/50 mt-1 uppercase tracking-wider font-display">Leads sin revisar</p>
                </Link>
            </div>

            {/* Funnel + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Lead Funnel */}
                <div className="lg:col-span-1 bg-card border border-foreground/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-display uppercase tracking-wider text-sm font-bold">Embudo de Leads</h3>
                        <Link href="/admin/leads" className="text-xs text-gold-500 hover:underline font-display uppercase tracking-wider">Ver todos</Link>
                    </div>
                    <div className="space-y-3">
                        {funnelStages.map((stage) => {
                            const pct = stage.total > 0 ? Math.round((stage.count / stage.total) * 100) : 0;
                            return (
                                <div key={stage.key} className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground/70 text-xs uppercase tracking-wider font-display">{stage.label}</span>
                                        <span className="font-numerics font-bold text-sm">{stage.count}</span>
                                    </div>
                                    <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${stage.color} opacity-70`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {totalLeads === 0 && (
                        <p className="text-sm text-foreground/50 text-center py-4">No hay leads registrados aún.</p>
                    )}
                </div>

                {/* Recent Leads */}
                <div className="bg-card border border-foreground/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-display uppercase tracking-wider text-sm font-bold">Leads Recientes</h3>
                        <Link href="/admin/leads" className="text-xs text-gold-500 hover:underline font-display uppercase tracking-wider">Ver todos</Link>
                    </div>
                    {recentLeads && recentLeads.length > 0 ? (
                        <div className="space-y-2">
                            {recentLeads.map((lead: any) => (
                                <Link
                                    key={lead.id}
                                    href={`/admin/leads/${lead.id}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-sm font-bold shrink-0">
                                        {(lead.full_name || "?").charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate group-hover:text-gold-500 transition-colors">
                                            {lead.full_name}
                                        </p>
                                        <p className="text-xs text-foreground/50 truncate">
                                            {sourceLabels[lead.source] || lead.source}
                                            {lead.phone && ` · ${lead.phone}`}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <Badge variant="secondary"
                                            className={`text-[10px] px-1.5 py-0 h-auto ${
                                                lead.status === "new" ? "bg-blue-500/10 text-blue-500"
                                                : lead.status === "contacted" ? "bg-yellow-500/10 text-yellow-500"
                                                : lead.status === "qualified" ? "bg-purple-500/10 text-purple-500"
                                                : lead.status === "won" ? "bg-emerald-500/10 text-emerald-500"
                                                : lead.status === "lost" ? "bg-red-500/10 text-red-500"
                                                : ""
                                            }`}
                                        >
                                            {statusLabels[lead.status] || lead.status}
                                        </Badge>
                                        <p className="text-[10px] text-foreground/30 mt-0.5">
                                            {new Date(lead.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Users className="w-8 h-8 text-foreground/20 mx-auto mb-2" />
                            <p className="text-sm text-foreground/50">No hay leads aún.</p>
                        </div>
                    )}
                </div>

                {/* Recent Properties Activity */}
                <div className="bg-card border border-foreground/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-display uppercase tracking-wider text-sm font-bold">Actividad de Propiedades</h3>
                        <Link href="/admin/properties" className="text-xs text-gold-500 hover:underline font-display uppercase tracking-wider">Ver inventario</Link>
                    </div>
                    {recentProperties && recentProperties.length > 0 ? (
                        <div className="space-y-3">
                            {recentProperties.map((prop: any) => (
                                <Link
                                    key={prop.id}
                                    href={`/admin/properties/${prop.id}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-muted overflow-hidden shrink-0 border border-foreground/5">
                                        {prop.cover_image ? (
                                            <img src={prop.cover_image} alt={prop.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-4 h-4 text-foreground/20 m-2.5" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate group-hover:text-gold-500 transition-colors">{prop.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[prop.status] || ""}`}>
                                                {prop.status === "Available" ? "Disponible"
                                                    : prop.status === "Sold" ? "Vendido"
                                                    : prop.status === "Rented" ? "Rentado"
                                                    : prop.status === "Under_Offer" ? "Bajo Oferta"
                                                    : prop.status}
                                            </span>
                                            <span className="text-[10px] text-foreground/40">{prop.business_type}</span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-numerics font-bold text-gold-500">{formatPrice(prop.price, prop.currency)}</p>
                                        <p className="text-[10px] text-foreground/30 mt-0.5">
                                            {new Date(prop.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Building2 className="w-8 h-8 text-foreground/20 mx-auto mb-2" />
                            <p className="text-sm text-foreground/50">No hay propiedades aún.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
