import { createClient } from "@/lib/supabase/server";
import { Building2, Users, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboardPage() {
    const supabase = await createClient();

    // Fetch summary stats
    const [propertiesRes, leadsRes, recentLeadsRes] = await Promise.all([
        supabase.from("properties").select("id, status, property_use", { count: "exact" }),
        supabase.from("leads").select("id, status", { count: "exact" }),
        supabase.from("leads").select("id, full_name, email, source, status, created_at").order("created_at", { ascending: false }).limit(5),
    ]);

    const properties = propertiesRes.data || [];
    const leads = leadsRes.data || [];
    const recentLeads = recentLeadsRes.data || [];

    const activeProperties = properties.filter(p => p.status === "Available").length;
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === "new").length;

    const stats = [
        {
            label: "Propiedades Activas",
            value: activeProperties,
            icon: Building2,
            href: "/admin/properties",
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
        },
        {
            label: "Total Leads",
            value: totalLeads,
            icon: Users,
            href: "/admin/leads",
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
        },
        {
            label: "Leads Nuevos",
            value: newLeads,
            icon: TrendingUp,
            href: "/admin/leads",
            color: "text-gold-500",
            bgColor: "bg-gold-500/10",
        },
        {
            label: "Total Propiedades",
            value: properties.length,
            icon: Clock,
            href: "/admin/properties",
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-display font-bold text-foreground">Dashboard</h2>
                <p className="text-foreground/50">Resumen general del sistema Black Corporativo.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={stat.label}
                            href={stat.href}
                            className="group p-6 rounded-xl border border-foreground/10 bg-card hover:border-gold-500/30 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-numerics font-bold text-foreground">{stat.value}</p>
                            <p className="text-sm text-foreground/50 mt-1">{stat.label}</p>
                        </Link>
                    );
                })}
            </div>

            {/* Recent Leads */}
            <div className="rounded-xl border border-foreground/10 bg-card overflow-hidden">
                <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-foreground">Últimos Leads</h3>
                    <Link href="/admin/leads" className="text-sm text-gold-500 hover:underline">
                        Ver todos →
                    </Link>
                </div>
                {recentLeads.length === 0 ? (
                    <div className="p-12 text-center text-foreground/40">
                        No hay leads registrados aún.
                    </div>
                ) : (
                    <div className="divide-y divide-foreground/5">
                        {recentLeads.map((lead) => (
                            <div key={lead.id} className="px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-foreground">{lead.full_name || "Sin nombre"}</p>
                                    <p className="text-sm text-foreground/50">{lead.email}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                                        lead.status === "new"
                                            ? "bg-gold-500/10 text-gold-500"
                                            : lead.status === "contacted"
                                                ? "bg-blue-500/10 text-blue-400"
                                                : "bg-foreground/10 text-foreground/50"
                                    }`}>
                                        {lead.status}
                                    </span>
                                    <p className="text-xs text-foreground/30 mt-1">
                                        {new Date(lead.created_at).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
