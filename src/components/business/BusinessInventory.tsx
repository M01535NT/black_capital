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
    11|interface BusinessProperty {
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
    22|export function BusinessInventory() {
    23|    const [properties, setProperties] = useState<BusinessProperty[]>([]);
    24|    const [loading, setLoading] = useState(true);
    25|
    26|    useEffect(() => {
    27|        async function fetchBusiness() {
    28|            const supabase = createClient();
    29|            const { data } = await supabase
    30|                .from("properties")
    31|                .select("id, title, property_type, business_type, price, currency, m2_construction, cover_image")
    32|                .eq("property_use", "Comercial")
    33|                .eq("status", "Available")
    34|                .order("created_at", { ascending: false })
    35|                .limit(3);
    36|
    37|            setProperties((data as BusinessProperty[]) || []);
    38|            setLoading(false);
    39|        }
    40|        fetchBusiness();
    41|    }, []);
    42|
    43|    const formatPrice = (price: number, currency: string) => {
    44|        return new Intl.NumberFormat("es-MX", { style: "currency", currency }).format(price);
    45|    };
    46|
    47|    return (
    48|        <section className="w-full py-28 bg-background relative overflow-hidden">
    49|            {/* Top separator */}
    50|            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />
    51|
    52|            {/* Floating accent */}
    53|            <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-gold-500/3 blur-[100px] pointer-events-none" />
    54|
    55|            <div className="container mx-auto px-4">
    56|                <FadeIn className="text-center max-w-3xl mx-auto mb-20">
    57|                    <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
    58|                        Portafolio Comercial
    59|                    </span>
    60|                    <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
    61|                        Espacios{" "}
    62|                        <span className="metallic-gold">Estratégicos</span>
    63|                    </h2>
    64|                    <p className="text-foreground/45 text-lg">
    65|                        Cada activo comercial ha sido evaluado por nuestro comité
    66|                        de inversiones bajo estándares institucionales.
    67|                    </p>
    68|                </FadeIn>
    69|
    70|                {loading ? (
    71|                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    72|                        {[...Array(3)].map((_, i) => (
    73|                            <div
    74|                                key={i}
    75|                                className="aspect-[16/10] rounded-2xl bg-zinc-900/50 border border-gold-500/5 animate-pulse"
    76|                            />
    77|                        ))}
    78|                    </div>
    79|                ) : properties.length === 0 ? (
    80|                    <FadeIn className="max-w-2xl mx-auto text-center py-16">
    81|                        <div className="rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm p-12">
    82|                            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-8">
    83|                                <span className="text-gold-500 text-2xl">✦</span>
    84|                            </div>
    85|                            <h3 className="card-title text-xl text-foreground/70 mb-3">
    86|                                Portafolio en Curación
    87|                            </h3>
    88|                            <p className="text-foreground/40 text-sm max-w-md mx-auto">
    89|                                Nuestro equipo está seleccionando los mejores activos comerciales.
    90|                                Solicita acceso anticipado para ser el primero en conocerlos.
    91|                            </p>
    92|                        </div>
    93|                    </FadeIn>
    94|                ) : (
    95|                    <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    96|                        {properties.map((prop) => (
    97|                            <StaggerItem key={prop.id}>
    98|                                <Link
    99|                                    href={`/inventario/${prop.id}`}
   100|                                    className="group block relative overflow-hidden rounded-2xl border border-gold-500/10 hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/10 transition-all duration-700 bg-zinc-950/40"
   101|                                >
   102|                                    {/* Image */}
   103|                                    <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
   104|                                        {prop.cover_image ? (
   105|                                            <Image
   106|                                                src={prop.cover_image}
   107|                                                alt={prop.title}
   108|                                                fill
   109|                                                sizes="(max-width: 768px) 100vw, 50vw"
   110|                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
   111|                                            />
   112|                                        ) : (
   113|                                            <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center">
   114|                                                <span className="text-foreground/15 text-sm uppercase tracking-widest">
   115|                                                    En preparación
   116|                                                </span>
   117|                                            </div>
   118|                                        )}
   119|                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
   120|
   121|                                        {/* Type badge */}
   122|                                        <div className="absolute top-4 left-4 px-4 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-gold-500/20 text-xs font-bold uppercase tracking-widest text-gold-400">
   123|                                            {prop.property_type}
   124|                                        </div>
   125|                                    </div>
   126|
   127|                                    {/* Info */}
   128|                                    <div className="p-8 space-y-3">
   129|                                        <h3 className="card-title text-lg text-foreground group-hover:text-gold-500 transition-colors duration-300">
   130|                                            {prop.title}
   131|                                        </h3>
   132|                                        <div className="flex items-center gap-6 text-sm text-foreground/40">
   133|                                            <span className="flex items-center gap-1.5">
   134|                                                <MapPin className="w-3.5 h-3.5 text-gold-500/50" />
   135|                                                {prop.business_type}
   136|                                            </span>
   137|                                            {prop.m2_construction && (
   138|                                                <span className="flex items-center gap-1.5">
   139|                                                    <Maximize2 className="w-3.5 h-3.5 text-gold-500/50" />
   140|                                                    {prop.m2_construction.toLocaleString()} m²
   141|                                                </span>
   142|                                            )}
   143|                                        </div>
   144|                                        <p className="metallic-gold font-numerics font-bold text-xl">
   145|                                            {formatPrice(prop.price, prop.currency)}
   146|                                        </p>
   147|                                    </div>
   148|                                </Link>
   149|                            </StaggerItem>
   150|                        ))}
   151|                    </StaggerChildren>
   152|                )}
   153|
   154|                {/* CTA to full inventory */}
   155|                <FadeIn className="text-center mt-16">
   156|                    <Link href="/inventario?brand=business">
   157|                        <Button
   158|                            variant="outline"
   159|                            className="border-gold-500/20 text-foreground/60 hover:border-gold-500/40 hover:text-gold-500 font-bold tracking-widest uppercase px-8 py-6 text-sm rounded-full group"
   160|                        >
   161|                            Ver Portafolio Completo
   162|                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
   163|                        </Button>
   164|                    </Link>
   165|                </FadeIn>
   166|            </div>
   167|        </section>
   168|    );
   169|}
   170|