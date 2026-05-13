import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, UserCircle, TrendingUp, ArrowRight, Mail, Phone } from "lucide-react";
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
    (leadsByStatus || []).forEach(l => {
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
        .select("id, name, email, phone, source, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5);

    // ── Recent properties ──
    const { data: recentProperties } = await supabase
        .from("properties")
        .select("id, title, business_type, price, currency, cover_image, status")
        .order("created_at", { ascending: false })
        .limit(4);

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

    return (
        <div className="space-y-6">
            {/* Header + Quick Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-foreground">Dashboard</h2>
                    <p className="text-foreground/50">Panel de control de Black Corporativo.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link href="/admin/properties/new">
                        <Button size="sm" className="bg-gold-500 text-black hover:bg-gold-600 gap-1.5 text-xs">
                            <Plus className="w-3.5 h-3.5" /> Nueva Propiedad
                        </Button>
                    </Link>
                    <Link href="/admin/leads">
                        <Button size="sm" variant="outline" className="border-foreground/20 gap-1.5 text-xs">
                            <Users className="w-3.5 h-3.5" /> Leads Nuevos
                            {(newLeads ?? 0) > 0 && (
                                <span className="bg-gold-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1">
                                    {newLeads}
                                </span>
                            )}
                        </Button>
                    </Link>
                    <Link href="/admin/agents/new">
                        <Button size="sm" variant="outline" className="border-foreground/20 gap-1.5 text-xs">
                            <UserCircle className="w-3.5 h-3.5" /> Nuevo Agente
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/admin/properties" className="bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <Building2 className="w-5 h-5 text-gold-500" />
                        <TrendingUp className="w-4 h-4 text-foreground/20 group-hover:text-gold-500/50 transition-colors" />
                    </div>
                    <p className="text-3xl font-numerics font-bold">{totalProperties || 0}</p>
                    <p className="text-xs text-foreground/50 mt-1">Propiedades en inventario</p>
                </Link>
                <Link href="/admin/agents" className="bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <UserCircle className="w-5 h-5 text-gold-500" />
                    </div>
                    <p className="text-3xl font-numerics font-bold">{totalAgents || 0}</p>
                    <p className="text-xs text-foreground/50 mt-1">Agentes activos</p>
                </Link>
                <Link href="/admin/leads" className="bg-card border border-foreground/10 rounded-2xl p-5 hover:border-gold-500/20 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                        <Users className="w-5 h-5 text-gold-500" />
                    </div>
                    <p className="text-3xl font-numerics font-bold">{totalLeads || 0}</p>
                    <p className="text-xs text-foreground/50 mt-1">Leads totales</p>
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
                    <p className="text-3xl font-numerics font-bold">{newLeads || 0}</p>
                    <p className="text-xs text-foreground/50 mt-1">Leads sin revisar</p>
                </Link>
            </div>

            {/* Funnel + Recent Leads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lead Funnel */}
                <div className="bg-card border border-foreground/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold">Embudo de Leads</h3>
                        <Link href="/admin/leads" className="text-xs text-gold-500 hover:underline">Ver todos</Link>
                    </div>
                    <div className="space-y-3">
                        {funnelStages.map((stage) => {
                            const pct = stage.total > 0 ? Math.round((stage.count / stage.total) * 100) : 0;
                            return (
                                <div key={stage.key} className="space-y-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground/70">{stage.label}</span>
                                        <span className="font-numerics font-bold">{stage.count}</span>
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
                        <h3 className="font-bold">Leads Recientes</h3>
                        <Link href="/admin/leads" className="text-xs text-gold-500 hover:underline">Ver todos</Link>
                    </div>
                    {recentLeads && recentLeads.length > 0 ? (
                        <div className="space-y-2">
                            {recentLeads.map((lead) => (
                                <Link
                                    key={lead.id}
                                    href={`/admin/leads/${lead.id}`}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-sm font-bold shrink-0">
                                        {lead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate group-hover:text-gold-500 transition-colors">
                                            {lead.name}
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
            </div>

            {/* Recent Properties */}
            <div className="bg-card border border-foreground/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold">Propiedades Recién Agregadas</h3>
                    <Link href="/admin/properties" className="text-xs text-gold-500 hover:underline">Ver inventario</Link>
                </div>
                {recentProperties && recentProperties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentProperties.map((prop) => (
                            <Link
                                key={prop.id}
                                href={`/admin/properties/${prop.id}`}
                                className="group bg-background border border-foreground/5 rounded-xl overflow-hidden hover:border-gold-500/20 transition-all"
                            >
                                <div className="aspect-[16/9] bg-muted overflow-hidden">
                                    {prop.cover_image ? (
                                        <img src={prop.cover_image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-foreground/10">
                                            <Building2 className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 space-y-1">
                                    <p className="text-sm font-bold truncate group-hover:text-gold-500 transition-colors">{prop.title}</p>
                                    <div className="flex items-center justify-between">
                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto border-foreground/10">
                                            {prop.business_type}
                                        </Badge>
                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusColors[prop.status] || ""}`}>
                                            {prop.status === "Available" ? "Disponible"
                                                : prop.status === "Sold" ? "Vendido"
                                                : prop.status === "Rented" ? "Rentado"
                                                : prop.status}
                                        </span>
                                    </div>
                                    <p className="font-numerics font-bold text-gold-500 text-sm">
                                        {formatPrice(prop.price, prop.currency)}
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
    );
}
