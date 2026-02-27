import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Download, Ruler, Building2, Calendar, ShieldCheck, Mail } from "lucide-react";
import { GatedBrochure } from "@/components/public/gated-brochure";

export const revalidate = 60;

export default async function PropertyDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: property, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !property) {
        return notFound();
    }

    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    };

    return (
        <div className="w-full bg-background min-h-screen">
            {/* Header Hero Area */}
            <div className="w-full h-[50vh] md:h-[60vh] relative bg-zinc-900 border-b border-foreground/10">
                {property.cover_image ? (
                    <img
                        src={property.cover_image}
                        alt={property.title}
                        className="w-full h-full object-cover opacity-70"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-zinc-600">Imagen no disponible</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-gold-500 text-black uppercase tracking-wider">{property.business_type}</Badge>
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-md uppercase tracking-wider">{property.property_use}</Badge>
                            <Badge variant="outline" className="bg-background/50 backdrop-blur-md uppercase tracking-wider">{property.property_type}</Badge>
                            {property.is_project && <Badge className="bg-blue-600 text-white">Proyecto VIP</Badge>}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4 max-w-4xl leading-tight">
                            {property.title}
                        </h1>
                        <p className="text-3xl font-numerics font-bold text-gold-500">
                            {formatPrice(property.price, property.currency)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Overview */}
                    <div className="bg-muted/30 p-8 rounded-2xl border border-foreground/5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-foreground/10">
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Ruler className="text-gold-500 w-6 h-6" />
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Terreno</p>
                            <p className="font-numerics font-bold text-xl">{property.m2_terrain ? `${property.m2_terrain} m²` : "N/D"}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Building2 className="text-gold-500 w-6 h-6" />
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Construcción</p>
                            <p className="font-numerics font-bold text-xl">{property.m2_construction ? `${property.m2_construction} m²` : "N/D"}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Calendar className="text-gold-500 w-6 h-6" />
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Publicado</p>
                            <p className="font-numerics font-bold text-lg">
                                {new Date(property.created_at).toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <ShieldCheck className="text-gold-500 w-6 h-6" />
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">Estatus</p>
                            <p className="font-bold text-lg text-emerald-500">Verificado</p>
                        </div>
                    </div>

                    {/* Full Description */}
                    <div>
                        <h2 className="text-2xl font-bold border-b border-foreground/10 pb-4 mb-6">Descripción de la Propiedad</h2>
                        <div className="prose prose-invert prose-lg max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                            {property.description}
                        </div>
                    </div>
                </div>

                {/* Sidebar Call to Actions */}
                <div className="space-y-6">
                    <div className="bg-background border border-foreground/10 p-8 rounded-2xl sticky top-24 shadow-2xl shadow-black/50">
                        <h3 className="text-xl font-bold mb-2">¿Te interesa esta propiedad?</h3>
                        <p className="text-muted-foreground text-sm mb-6">
                            Obtén información detallada, planos y proyecciones financieras descargando nuestro brochure ejecutivo.
                        </p>

                        <GatedBrochure propertyId={property.id} propertyName={property.title} />

                        <Button variant="outline" className="w-full font-bold py-6 text-lg border-foreground/20 hover:bg-muted">
                            <Mail className="mr-2 h-5 w-5" />
                            Agendar Recorrido
                        </Button>

                        <div className="mt-6 pt-6 border-t border-foreground/10 text-center">
                            <p className="text-xs text-muted-foreground">
                                Operación gestionada como <strong className="text-foreground">{property.business_type}</strong> bajo estrictos estándares de confidencialidad Black Corporativo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
