import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Mail, Phone, Shield, Building2, ExternalLink, Edit } from "lucide-react";
import Link from "next/link";
import { AssignPropertiesButton } from "./assign-properties";
import Image from "next/image";
import { AgentStatusToggle } from "@/components/admin/agent-status-toggle";
import { AgentDeleteButton } from "@/components/admin/agent-delete-button";
import { adminBadgeAccentClass, adminBadgeMutedClass, adminCardClass } from "@/components/admin/admin-ui";

export const revalidate = 0;

export default async function AgentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await requireAdminSession();
    const { id } = await params;
    const supabase = createAdminClient();

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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase row from property_agents join
    const propertyIds = (assignments || []).map((a: any) => a.property_id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Supabase query result for property list
    let properties: any[] = [];
    if (propertyIds.length > 0) {
        const { data: props } = await supabase
            .from("properties")
            .select("id, slug, title, business_type, property_use, property_type, price, currency, status, cover_image")
            .in("id", propertyIds)
            .order("created_at", { ascending: false });
        if (props) properties = props;
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            {/* Back + Actions */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/agents">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-white/[0.12] bg-white/[0.025] text-white/70 hover:text-[var(--color-accent)]">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-display-3 font-display text-3xl font-semibold uppercase tracking-display text-white">{agent.full_name}</h2>
                        <p className="text-white/50">
                            Registrado {new Date(agent.created_at).toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <AgentStatusToggle agentId={id} initialActive={!!agent.is_active} compact />
                    {!agent.is_active && (
                        <AgentDeleteButton agentId={id} agentName={agent.full_name} />
                    )}
                    <Link href={`/admin/agents/${id}/edit`}>
                        <Button variant="outline" className="gap-2 border-white/[0.12] bg-white/[0.025] text-white hover:text-[var(--color-accent)]">
                            <Edit className="w-4 h-4" /> Editar Datos
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent Profile Card */}
                <div className="lg:col-span-1">
                    <div className={`${adminCardClass} space-y-5 p-6`}>
                        {/* Avatar */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)] text-3xl font-bold border-2 border-[var(--color-accent)]/20 overflow-hidden mb-4">
                                {agent.photo_url ? (
                                    <Image
                                        src={agent.photo_url}
                                        alt={agent.full_name}
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    agent.full_name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white">{agent.full_name}</h3>
                            <Badge
                                variant="outline"
                                className={`${agent.is_active ? adminBadgeAccentClass : adminBadgeMutedClass} mt-2`}
                            >
                                {agent.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>

                        {/* Contact */}
                        <div className="space-y-3 border-t border-white/[0.06] pt-3">
                            {agent.email && (
                                <a href={`mailto:${agent.email}`}
                                    className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[var(--color-accent)]"
                                >
                                    <Mail className="w-4 h-4 text-[var(--color-accent)]" />
                                    {agent.email}
                                </a>
                            )}
                            {agent.phone && (
                                <a href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, "")}`}
                                    target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[var(--color-accent)]"
                                >
                                    <Phone className="w-4 h-4 text-[var(--color-accent)]" />
                                    {agent.phone}
                                </a>
                            )}
                            {agent.license_number && (
                                <div className="flex items-center gap-3 text-sm text-white/70">
                                    <Shield className="w-4 h-4 text-[var(--color-accent)]" />
                                    Cédula: {agent.license_number}
                                </div>
                            )}
                        </div>

                        {/* Bio */}
                        {agent.bio && (
                            <div className="border-t border-white/[0.06] pt-3">
                                <p className="text-sm leading-relaxed text-white/60">{agent.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Assigned Properties */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <Building2 className="w-5 h-5 text-[var(--color-accent)]" />
                            Inventario Asignado ({properties.length})
                        </h3>
                        <AssignPropertiesButton agentId={id} assignedIds={propertyIds} />
                    </div>

                    {properties.length === 0 ? (
                        <div className={`${adminCardClass} p-8 text-center`}>
                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-accent)]/5 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-[var(--color-accent)]/50" />
                            </div>
                            <p className="mb-4 text-sm text-white/50">
                                Este agente no tiene propiedades asignadas aún.
                            </p>
                            <AssignPropertiesButton agentId={id} assignedIds={propertyIds} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {properties.map((prop) => (
                                <Link
                                    key={prop.id}
                                    href={`/inventario/${prop.slug || prop.id}`}
                                    target="_blank"
                                    className="group flex items-center gap-4 border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:border-[var(--color-accent)]/25"
                                >
                                    {/* Thumbnail */}
                                    <div className="h-16 w-16 shrink-0 overflow-hidden border border-white/[0.06] bg-white/[0.035]">
                                        {prop.cover_image ? (
                                            <Image
                                                src={prop.cover_image}
                                                alt={prop.title || "Propiedad"}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-white/20">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="truncate font-bold text-white transition-colors group-hover:text-[var(--color-accent)]">
                                            {prop.title}
                                        </p>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
                                            <Badge variant="outline" className="h-auto border-white/[0.08] bg-white/[0.025] px-1.5 py-0 text-caption text-white/60">
                                                {prop.business_type}
                                            </Badge>
                                            <Badge variant="outline" className="h-auto border-white/[0.08] bg-white/[0.025] px-1.5 py-0 text-caption text-white/60">
                                                {prop.property_use}
                                            </Badge>
                                            <span className="text-[var(--color-accent)] font-numerics font-bold">
                                                {formatPrice(prop.price, prop.currency)}
                                            </span>
                                        </div>
                                    </div>

                                    <ExternalLink className="w-4 h-4 shrink-0 text-white/50 transition-colors group-hover:text-[var(--color-accent)]" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
