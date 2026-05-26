import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Mail, Phone, Shield, Building2, Calendar, ExternalLink, Edit, UserPlus } from "lucide-react";
import Link from "next/link";
import { AssignPropertiesButton } from "./assign-properties";

export const revalidate = 0;

export default async function AgentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: agent, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !agent) {
        notFound();
    }

    // Get assigned properties
    const { data: assignments } = await supabase
        .from("property_agents")
        .select("property_id")
        .eq("agent_id", id);

    const propertyIds = (assignments || []).map(a => a.property_id);

    let properties: any[] = [];
    if (propertyIds.length > 0) {
        const { data: props } = await supabase
            .from("properties")
            .select("id, title, business_type, property_use, property_type, price, currency, status, cover_image")
            .in("id", propertyIds)
            .order("created_at", { ascending: false });
        if (props) properties = props;
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto w-full">
            {/* Back + Actions */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/agents">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="section-heading text-3xl text-foreground">{agent.full_name}</h2>
                        <p className="text-foreground/50">
                            Registrado {new Date(agent.created_at).toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                </div>
                <Link href={`/admin/agents/${id}/edit`}>
                    <Button variant="outline" className="gap-2 border-foreground/20">
                        <Edit className="w-4 h-4" /> Editar Datos
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent Profile Card */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-foreground/10 rounded-2xl p-6 shadow-sm space-y-5">
                        {/* Avatar */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 text-3xl font-bold border-2 border-gold-500/20 overflow-hidden mb-4">
                                {agent.photo_url ? (
                                    <img
                                        src={agent.photo_url}
                                        alt={agent.full_name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    agent.full_name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <h3 className="text-xl font-bold">{agent.full_name}</h3>
                            <Badge
                                variant="secondary"
                                className={agent.is_active ? "bg-emerald-500/10 text-emerald-500 mt-2" : "bg-foreground/5 text-foreground/50 mt-2"}
                            >
                                {agent.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>

                        {/* Contact */}
                        <div className="space-y-3 pt-3 border-t border-foreground/5">
                            {agent.email && (
                                <a href={`mailto:${agent.email}`}
                                    className="flex items-center gap-3 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
                                >
                                    <Mail className="w-4 h-4 text-gold-500" />
                                    {agent.email}
                                </a>
                            )}
                            {agent.phone && (
                                <a href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-foreground/70 hover:text-gold-500 transition-colors"
                                >
                                    <Phone className="w-4 h-4 text-gold-500" />
                                    {agent.phone}
                                </a>
                            )}
                            {agent.license_number && (
                                <div className="flex items-center gap-3 text-sm text-foreground/70">
                                    <Shield className="w-4 h-4 text-gold-500" />
                                    Cédula: {agent.license_number}
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        {agent.bio && (
                            <div className="pt-3 border-t border-foreground/5">
                                <p className="text-sm text-foreground/60 leading-relaxed">{agent.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Assigned Properties */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-gold-500" />
                            Inventario Asignado ({properties.length})
                        </h3>
                        <AssignPropertiesButton agentId={id} assignedIds={propertyIds} />
                    </div>

                    {properties.length === 0 ? (
                        <div className="bg-card border border-foreground/10 rounded-2xl p-8 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold-500/5 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-gold-500/50" />
                            </div>
                            <p className="text-foreground/50 text-sm mb-4">
                                Este agente no tiene propiedades asignadas aún.
                            </p>
                            <AssignPropertiesButton agentId={id} assignedIds={propertyIds} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {properties.map((prop) => (
                                <Link
                                    key={prop.id}
                                    href={`/inventario/${prop.id}`}
                                    target="_blank"
                                    className="group flex items-center gap-4 bg-card border border-foreground/10 rounded-xl p-4 hover:border-gold-500/20 hover:bg-gold-500/[0.02] transition-all"
                                >
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-foreground/5">
                                        {prop.cover_image ? (
                                            <img src={prop.cover_image} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-foreground/20">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-foreground truncate group-hover:text-gold-500 transition-colors">
                                            {prop.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-foreground/50 mt-1">
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto border-foreground/10">
                                                {prop.business_type}
                                            </Badge>
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-auto border-foreground/10">
                                                {prop.property_use}
                                            </Badge>
                                            <span className="text-gold-500 font-numerics font-bold">
                                                {formatPrice(prop.price, prop.currency)}
                                            </span>
                                        </div>
                                    </div>

                                    <ExternalLink className="w-4 h-4 text-foreground/30 group-hover:text-gold-500 transition-colors shrink-0" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
