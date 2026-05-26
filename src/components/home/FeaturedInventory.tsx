     1|"use client";
     2|
     3|import Link from "next/link";
     4|import { ArrowRight, Maximize2, Building2 } from "lucide-react";
     5|import { Button } from "@/components/ui/button";
     6|import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
     7|
     8|const mockFeatured = [
     9|    {
    10|        id: "1",
    11|        title: "Torre Corporativa Ansel",
    12|        slug: "torre-corporativa-ansel",
    13|        property_use: "Comercial",
    14|        business_type: "Venta",
    15|        m2_terrain: 2500,
    16|        m2_construction: 15000,
    17|        price: 185000000,
    18|        currency: "MXN",
    19|        attributes: ["Certificación LEED", "Helipuerto"],
    20|        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    21|    },
    22|    {
    23|        id: "2",
    24|        title: "Penthouse The Legacy",
    25|        slug: "penthouse-the-legacy",
    26|        property_use: "Residencial",
    27|        business_type: "Venta",
    28|        m2_terrain: null,
    29|        m2_construction: 450,
    30|        price: 42500000,
    31|        currency: "MXN",
    32|        attributes: ["Vista Panorámica", "Domo de Cristal"],
    33|        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    34|    },
    35|    {
    36|        id: "3",
    37|        title: "Parque Logístico Norte",
    38|        slug: "parque-logistico-norte",
    39|        property_use: "Industrial",
    40|        business_type: "Renta",
    41|        m2_terrain: 50000,
    42|        m2_construction: 35000,
    43|        price: 8.5,
    44|        currency: "USD",
    45|        attributes: ["Cross Docking", "Seguridad 24/7"],
    46|        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
    47|    }
    48|];
    49|
    50|function formatPrice(price: number, currency: string, businessType: string): string {
    51|    if (businessType === "Renta") {
    52|        return `$${price} ${currency}/m²/mes`;
    53|    }
    54|    if (price >= 1_000_000) {
    55|        return `$${(price / 1_000_000).toFixed(1)} M ${currency}`;
    56|    }
    57|    return `$${price.toLocaleString()} ${currency}`;
    58|}
    59|
    60|export function FeaturedInventory() {
    61|    return (
    62|        <section className="w-full py-24 bg-zinc-950">
    63|            <div className="container mx-auto px-4">
    64|                <FadeIn className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
    65|                    <div className="max-w-2xl">
    66|                        <h2 className="section-heading text-3xl md:text-5xl text-foreground mb-4">
    67|                            Inventario Exclusivo
    68|                        </h2>
    69|                        <p className="text-foreground/70 text-lg">
    70|                            Una selección curada de nuestras oportunidades de inversión más destacadas en el mercado actual.
    71|                        </p>
    72|                    </div>
    73|                    <Link href="/inventario">
    74|                        <Button variant="outline" className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black">
    75|                            Ver Todo el Catálogo <ArrowRight className="w-4 h-4 ml-2" />
    76|                        </Button>
    77|                    </Link>
    78|                </FadeIn>
    79|
    80|                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    81|                    {mockFeatured.map((item) => (
    82|                        <StaggerItem key={item.id}>
    83|                            <Link href={`/inventario/${item.id}`} className="group block h-full">
    84|                                <article className="h-full flex flex-col bg-background border border-foreground/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-gold-500/30 hover:shadow-[0_0_40px_-5px] hover:shadow-gold-500/20">
    85|
    86|                                    {/* Image Wrapper */}
    87|                                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
    88|                                        <img
    89|                                            src={item.image}
    90|                                            alt={item.title}
    91|                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
    92|                                        />
    93|                                        <div className="absolute top-4 left-4">
    94|                                            <span className="px-3 py-1 bg-black/80 backdrop-blur-sm text-gold-500 text-xs font-bold uppercase tracking-widest rounded-full border border-gold-500/20">
    95|                                                {item.property_use}
    96|                                            </span>
    97|                                        </div>
    98|                                        <div className="absolute top-4 right-4">
    99|                                            <span className="px-3 py-1 bg-gold-500/90 text-black text-xs font-bold uppercase tracking-wider rounded-full">
   100|                                                {item.business_type}
   101|                                            </span>
   102|                                        </div>
   103|                                    </div>
   104|
   105|                                    {/* Content */}
   106|                                    <div className="p-6 flex-1 flex flex-col">
   107|                                        <h3 className="card-title text-2xl text-foreground group-hover:text-gold-500 transition-colors line-clamp-2 mb-2">
   108|                                            {item.title}
   109|                                        </h3>
   110|
   111|                                        {/* Price */}
   112|                                        <p className="font-numerics text-xl font-bold text-gold-400 mb-4">
   113|                                            {formatPrice(item.price, item.currency, item.business_type)}
   114|                                        </p>
   115|
   116|                                        {/* Metrics */}
   117|                                        <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-foreground/70">
   118|                                            {item.m2_terrain && (
   119|                                                <div className="flex items-center gap-2">
   120|                                                    <Maximize2 className="w-4 h-4 text-gold-500" />
   121|                                                    <span className="font-numerics">{item.m2_terrain.toLocaleString()} m² T</span>
   122|                                                </div>
   123|                                            )}
   124|                                            {item.m2_construction && (
   125|                                                <div className="flex items-center gap-2">
   126|                                                    <Building2 className="w-4 h-4 text-gold-500" />
   127|                                                    <span className="font-numerics">{item.m2_construction.toLocaleString()} m² C</span>
   128|                                                </div>
   129|                                            )}
   130|                                        </div>
   131|
   132|                                        {/* Attributes */}
   133|                                        <div className="mt-auto pt-4 border-t border-foreground/10 flex flex-wrap gap-2">
   134|                                            {item.attributes.map((attr, idx) => (
   135|                                                <span key={idx} className="text-xs px-2 py-1 bg-foreground/5 text-foreground/80 rounded-md">
   136|                                                    {attr}
   137|                                                </span>
   138|                                            ))}
   139|                                        </div>
   140|                                    </div>
   141|                                </article>
   142|                            </Link>
   143|                        </StaggerItem>
   144|                    ))}
   145|                </StaggerChildren>
   146|            </div>
   147|        </section>
   148|    );
   149|}
   150|