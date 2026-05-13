import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Mail, Phone, Calendar, Globe, Tag, FileText } from "lucide-react";
import Link from "next/link";
import { LeadActions } from "./lead-actions";

export const revalidate = 0;

export default async function LeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: lead, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !lead) {
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

    const statusMap: Record<string, { label: string; color: string }> = {
        new: { label: "Nuevo", color: "bg-blue-500/10 text-blue-500" },
        contacted: { label: "Contactado", color: "bg-yellow-500/10 text-yellow-500" },
        qualified: { label: "Calificado", color: "bg-purple-500/10 text-purple-500" },
        lost: { label: "Perdido", color: "bg-red-500/10 text-red-500" },
        won: { label: "Ganado", color: "bg-emerald-500/10 text-emerald-500" },
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
        <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/leads">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-foreground/20">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-foreground">{lead.name}</h2>
                        <p className="text-foreground/50 text-sm">
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
                    <div className="bg-card border border-foreground/10 rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Información de Contacto</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <a href={`mailto:${lead.email}`}
                                className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl hover:bg-gold-500/5 transition-colors group"
                            >
                                <Mail className="w-5 h-5 text-gold-500 shrink-0" />
                                <div>
                                    <p className="text-xs text-foreground/50">Correo</p>
                                    <p className="text-sm font-medium group-hover:text-gold-500 transition-colors">{lead.email}</p>
                                </div>
                            </a>
                            <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl hover:bg-gold-500/5 transition-colors group"
                            >
                                <Phone className="w-5 h-5 text-gold-500 shrink-0" />
                                <div>
                                    <p className="text-xs text-foreground/50">Teléfono / WhatsApp</p>
                                    <p className="text-sm font-medium group-hover:text-gold-500 transition-colors">{lead.phone}</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Status + Source */}
                    <div className="bg-card border border-foreground/10 rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Detalles del Lead</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <p className="text-xs text-foreground/50">Estado Actual</p>
                                <Badge variant="secondary" className={(statusMap[lead.status] || {}).color || ""}>
                                    {(statusMap[lead.status] || {}).label || lead.status}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-foreground/50">Origen</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Globe className="w-4 h-4 text-foreground/40" />
                                    {sourceLabels[lead.source] || lead.source}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-foreground/50">Fecha de Registro</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="w-4 h-4 text-foreground/40" />
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
                                <p className="text-xs text-foreground/50">ID</p>
                                <div className="flex items-center gap-2 text-sm font-mono text-foreground/60">
                                    <Tag className="w-4 h-4 text-foreground/40" />
                                    {lead.id.slice(0, 8)}...
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Property of Interest */}
                    {propertyTitle && (
                        <div className="bg-card border border-foreground/10 rounded-2xl p-6 space-y-3">
                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Propiedad de Interés</h3>
                            <Link href={`/admin/properties/${lead.property_id}`}
                                className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl hover:bg-gold-500/5 transition-colors group"
                            >
                                <FileText className="w-5 h-5 text-gold-500 shrink-0" />
                                <span className="text-sm font-medium group-hover:text-gold-500 transition-colors">{propertyTitle}</span>
                            </Link>
                        </div>
                    )}

                    {/* Notes */}
                    <div className="bg-card border border-foreground/10 rounded-2xl p-6 space-y-4">
                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Notas Internas</h3>
                        {lead.notes ? (
                            <div className="text-sm text-foreground/70 whitespace-pre-wrap leading-relaxed bg-muted/20 p-4 rounded-xl border border-foreground/5">
                                {lead.notes}
                            </div>
                        ) : (
                            <p className="text-sm text-foreground/50 italic">Sin notas registradas.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-3">
                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Acciones Rápidas</h3>
                        <a href={`mailto:${lead.email}`}
                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 border border-foreground/20 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors"
                        >
                            <Mail className="w-4 h-4" /> Enviar Correo
                        </a>
                        <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gold-500 text-black rounded-xl text-sm font-bold hover:bg-gold-600 transition-colors"
                        >
                            <Phone className="w-4 h-4" /> Abrir WhatsApp
                        </a>
                    </div>

                    {/* Status Change Widget */}
                    <div className="bg-card border border-foreground/10 rounded-2xl p-5 space-y-3">
                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase">Cambiar Estado</h3>
                        <LeadActions leadId={lead.id} currentStatus={lead.status} showInline />
                    </div>
                </div>
            </div>
        </div>
    );
}
