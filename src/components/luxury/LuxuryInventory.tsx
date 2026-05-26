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
    11|interface LuxuryProperty {
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
    22|export function LuxuryInventory() {
    23|    const [properties, setProperties] = useState<LuxuryProperty[]>([]);
    24|    const [loading, setLoading] = useState(true);
    25|
    26|    useEffect(() => {
    27|        async function fetchLuxury() {
    28|            const supabase = createClient();
    29|            const { data } = await supabase
    30|                .from("properties")
    31|                .select("id, title, property_type, business_type, price, currency, m2_construction, cover_image")
    32|                .eq("property_use", "Residencial")
    33|                .eq("status", "Available")
    34|                .order("created_at", { ascending: false })
    35|                .limit(3);
    36|
    37|            setProperties((data as LuxuryProperty[]) || []);
    38|            setLoading(false);
    39|        }
    40|        fetchLuxury();
    41|    }, []);
    42|
    43|    return (
    44|        <section className="w-full py-28 bg-background relative overflow-hidden">
    45|            {/* Top separator */}
    46|            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    47|
    48|            {/* Floating accent */}
    49|            <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-gold-500/3 blur-[100px] pointer-events-none" />
    50|
    51|            <div className="container mx-auto px-4">
    52|                <FadeIn className="text-center max-w-3xl mx-auto mb-20">
    53|                    <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
    54|                        Selección curada
    55|                    </span>
    56|                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
    57|                        Propiedades de{" "}
    58|                        <span className="metallic-gold">Súper Lujo</span>
    59|                    </h2>
    60|                    <p className="text-foreground/45 text-lg">
    61|                        Cada propiedad ha sido verificada, analizada financieramente
    62|                        y aprobada por nuestro comité de inversiones.
    63|                    </p>
    64|                </FadeIn>
    65|
    66|                {loading ? (
    67|                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    68|                        {[...Array(3)].map((_, i) => (
    69|                            <div
    70|                                key={i}
    71|                                className="aspect-[16/10] rounded-2xl bg-zinc-900/50 border border-gold-500/5 animate-pulse"
    72|                            />
    73|                        ))}
    74|                    </div>
    75|                ) : properties.length === 0 ? (
    76|                    <FadeIn className="max-w-2xl mx-auto text-center py-16">
    77|                        <div className="rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm p-12">
    78|                            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-8">
    79|                                <span className="text-gold-500 text-2xl">✦</span>
    80|                            </div>
    81|                            <h3 className="card-title text-xl text-foreground/70 mb-3">
    82|                                Portafolio en Curación
    83|                            </h3>
    84|                            <p className="text-foreground/40 text-sm max-w-md mx-auto">
    85|                                Nuestro equipo está seleccionando las mejores propiedades de lujo.
    86|                                Solicita acceso anticipado para ser el primero en conocerlas.
    87|                            </p>
    88|                        </div>
    89|                    </FadeIn>
    90|                ) : (
    91|                    <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    92|                        {properties.map((prop) => (
    93|                            <StaggerItem key={prop.id}>
    94|                                <Link
    95|                                    href={`/inventario/${prop.id}`}
    96|                                    className="group block relative overflow-hidden rounded-2xl border border-gold-500/10 hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-700 bg-zinc-950/40"
    97|                                >
    98|                                    {/* Image */}
    99|                                    <div className="relative aspect-[16/10] overflow-hidden">
   100|                                        {prop.cover_image ? (
   101|                                            <Image
   102|                                                src={prop.cover_image}
   103|                                                alt={prop.title}
   104|                                                fill
   105|                                                sizes="(max-width: 768px) 100vw, 50vw"
   106|                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
   107|                                            />
   108|                                        ) : (
   109|                                            <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center">
   110|                                                <span className="text-foreground/15 text-sm uppercase tracking-widest">
   111|                                                    En preparación
   112|                                                </span>
   113|                                            </div>
   114|                                        )}
   115|                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
   116|
   117|                                        {/* Type badge */}
   118|                                        <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-gold-500/20 text-xs font-bold uppercase tracking-widest text-gold-400">
   119|                                            {prop.property_type}
   120|                                        </div>
   121|                                    </div>
   122|
   123|                                    {/* Info */}
   124|                                    <div className="p-8 space-y-3">
   125|                                        <h3 className="card-title text-lg text-foreground group-hover:text-gold-500 transition-colors duration-300">
   126|                                            {prop.title}
   127|                                        </h3>
   128|                                        <div className="flex items-center gap-4 text-sm text-foreground/40">
   129|                                            <span className="flex items-center gap-1.5">
   130|                                                <MapPin className="w-3.5 h-3.5" />
   131|                                                {prop.business_type}
   132|                                            </span>
   133|                                            {prop.m2_construction && (
   134|                                                <span className="flex items-center gap-1.5">
   135|                                                    <Maximize2 className="w-3.5 h-3.5" />
   136|                                                    {prop.m2_construction.toLocaleString()} m²
   137|                                                </span>
   138|                                            )}
   139|                                        </div>
   140|                                        <p className="text-gold-500 font-numerics font-bold text-lg">
   141|                                            {new Intl.NumberFormat("es-MX", { style: "currency", currency: prop.currency }).format(prop.price)}
   142|                                        </p>
   143|                                    </div>
   144|                                </Link>
   145|                            </StaggerItem>
   146|                        ))}
   147|                    </StaggerChildren>
   148|                )}
   149|
   150|                {/* CTA to full inventory */}
   151|                <FadeIn className="text-center mt-16">
   152|                    <Link href="/inventario?brand=luxury">
   153|                        <Button
   154|                            variant="outline"
   155|                            className="border-gold-500/20 text-foreground/60 hover:border-gold-500/40 hover:text-gold-500 font-bold tracking-widest uppercase px-8 py-6 text-sm rounded-full group"
   156|                        >
   157|                            Ver Portafolio Completo
   158|                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
   159|                        </Button>
   160|                    </Link>
   161|                </FadeIn>
   162|            </div>
   163|        </section>
   164|    );
   165|}
   166|