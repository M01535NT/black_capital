     1|"use client";
     2|
     3|import { useEffect, useState } from "react";
     4|import Image from "next/image";
     5|import Link from "next/link";
     6|import { createClient } from "@/lib/supabase/client";
     7|import { MapPin, Maximize2, ArrowRight } from "lucide-react";
     8|import { Button } from "@/components/ui/button";
     9|import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
    10|
    11|interface IndustrialProperty {
    12|    id: string;
    13|    title: string;
    14|    property_type: string;
    15|    business_type: string;
    16|    price: number;
    17|    currency: string;
    18|    m2_construction: number | null;
    19|    cover_image: string | null;
    20|}
    21|
    22|export function IndustrialInventory() {
    23|    const [properties, setProperties] = useState<IndustrialProperty[]>([]);
    24|    const [loading, setLoading] = useState(true);
    25|
    26|    useEffect(() => {
    27|        async function fetchIndustrial() {
    28|            const supabase = createClient();
    29|            const { data } = await supabase
    30|                .from("properties")
    31|                .select("id, title, property_type, business_type, price, currency, m2_construction, cover_image")
    32|                .eq("property_use", "Industrial")
    33|                .eq("status", "Available")
    34|                .order("created_at", { ascending: false })
    35|                .limit(3);
    36|
    37|            setProperties((data as IndustrialProperty[]) || []);
    38|            setLoading(false);
    39|        }
    40|        fetchIndustrial();
    41|    }, []);
    42|
    43|    return (
    44|        <section className="w-full py-24 bg-background relative overflow-hidden">
    45|            {/* Top separator */}
    46|            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-steel-500/30 to-transparent" />
    47|
    48|            <div className="container mx-auto px-4">
    49|                <FadeIn className="text-center max-w-3xl mx-auto mb-16">
    50|                    <div className="flex items-center justify-center gap-4 mb-6">
    51|                        <div className="w-8 h-px bg-steel-500" />
    52|                        <span className="text-xs font-bold uppercase tracking-[0.4em] text-steel-400">
    53|                            Portafolio activo
    54|                        </span>
    55|                        <div className="w-8 h-px bg-steel-500" />
    56|                    </div>
    57|                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
    58|                        Inventario <span className="metallic-gold">Industrial</span>
    59|                    </h2>
    60|                    <p className="text-foreground/50 text-lg">
    61|                        Activos seleccionados con análisis financiero completo y documentación verificada.
    62|                    </p>
    63|                </FadeIn>
    64|
    65|                {loading ? (
    66|                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
    67|                        {[...Array(4)].map((_, i) => (
    68|                            <div
    69|                                key={i}
    70|                                className="aspect-[16/10] bg-zinc-900/50 border border-steel-500/10 animate-pulse"
    71|                            />
    72|                        ))}
    73|                    </div>
    74|                ) : properties.length === 0 ? (
    75|                    <FadeIn className="max-w-2xl mx-auto text-center py-16">
    76|                        <div className="border border-steel-500/15 bg-zinc-950/50 p-12">
    77|                            <div className="w-6 h-6 border-t-2 border-l-2 border-steel-500/30 mb-8 mx-auto" />
    78|                            <h3 className="card-title text-xl text-foreground/70 mb-3 uppercase tracking-wider">
    79|                                Portafolio en Preparación
    80|                            </h3>
    81|                            <p className="text-foreground/40 text-sm max-w-md mx-auto">
    82|                                Nuestro inventario industrial se actualiza constantemente.
    83|                                Solicita acceso anticipado para recibir las primeras oportunidades.
    84|                            </p>
    85|                        </div>
    86|                    </FadeIn>
    87|                ) : (
    88|                    <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
    89|                        {properties.map((prop) => (
    90|                            <StaggerItem key={prop.id}>
    91|                                <Link
    92|                                    href={`/inventario/${prop.id}`}
    93|                                    className="group block relative overflow-hidden border border-steel-500/15 hover:border-gold-500/30 transition-all duration-500 bg-zinc-950/50"
    94|                                >
    95|                                    {/* Image */}
    96|                                    <div className="relative aspect-[16/10] overflow-hidden">
    97|                                        {prop.cover_image ? (
    98|                                            <Image
    99|                                                src={prop.cover_image}
   100|                                                alt={prop.title}
   101|                                                fill
   102|                                                sizes="(max-width: 768px) 100vw, 50vw"
   103|                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
   104|                                            />
   105|                                        ) : (
   106|                                            <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center">
   107|                                                <span className="text-foreground/20 text-sm uppercase tracking-widest">
   108|                                                    Sin imagen
   109|                                                </span>
   110|                                            </div>
   111|                                        )}
   112|                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
   113|
   114|                                        {/* Type badge */}
   115|                                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm border border-steel-500/20 text-xs font-bold uppercase tracking-widest text-steel-400">
   116|                                            {prop.property_type}
   117|                                        </div>
   118|                                    </div>
   119|
   120|                                    {/* Info */}
   121|                                    <div className="p-6 space-y-3">
   122|                                        <h3 className="card-title text-lg text-foreground group-hover:text-gold-500 transition-colors">
   123|                                            {prop.title}
   124|                                        </h3>
   125|                                        <div className="flex items-center gap-4 text-sm text-foreground/40">
   126|                                            <span className="flex items-center gap-1.5">
   127|                                                <MapPin className="w-3.5 h-3.5" />
   128|                                                {prop.business_type}
   129|                                            </span>
   130|                                            {prop.m2_construction && (
   131|                                                <span className="flex items-center gap-1.5">
   132|                                                    <Maximize2 className="w-3.5 h-3.5" />
   133|                                                    {prop.m2_construction.toLocaleString()} m²
   134|                                                </span>
   135|                                            )}
   136|                                        </div>
   137|                                        <p className="text-gold-500 font-numerics font-bold text-lg">
   138|                                            {new Intl.NumberFormat("es-MX", { style: "currency", currency: prop.currency }).format(prop.price)}
   139|                                        </p>
   140|                                    </div>
   141|                                </Link>
   142|                            </StaggerItem>
   143|                        ))}
   144|                    </StaggerChildren>
   145|                )}
   146|
   147|                {/* CTA to full inventory */}
   148|                <FadeIn className="text-center mt-12">
   149|                    <Link href="/inventario?brand=industrial">
   150|                        <Button
   151|                            variant="outline"
   152|                            className="border-steel-500/30 text-foreground/70 hover:border-gold-500/30 hover:text-gold-500 font-bold tracking-widest uppercase px-8 py-6 text-sm group"
   153|                        >
   154|                            Ver Todo el Inventario Industrial
   155|                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
   156|                        </Button>
   157|                    </Link>
   158|                </FadeIn>
   159|            </div>
   160|        </section>
   161|    );
   162|}
   163|