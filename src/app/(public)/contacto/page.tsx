     1|import type { Metadata } from "next";
     2|import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
     3|import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
     4|import { Button } from "@/components/ui/button";
     5|import Link from "next/link";
     6|
     7|export const metadata: Metadata = {
     8|    title: "Contacto | Black Corporativo",
     9|    description:
    10|        "Contacta a Black Corporativo. Oficinas corporativas, WhatsApp directo y consultoría personalizada para inversores B2B y HNWI en México.",
    11|    openGraph: {
    12|        title: "Contacto | Black Corporativo",
    13|        description:
    14|            "Consulta directa con nuestros asesores inmobiliarios especializados. Oficinas en CDMX. Atención a inversores institucionales y privados.",
    15|        type: "website",
    16|        locale: "es_MX",
    17|        siteName: "Black Corporativo",
    18|    },
    19|};
    20|
    21|const contactCards = [
    22|    {
    23|        icon: Phone,
    24|        title: "WhatsApp Directo",
    25|        lines: ["+52 (55) 1234 5678"],
    26|        action: {
    27|            label: "Enviar Mensaje",
    28|            href: "https://wa.me/521234567890?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20propiedades%20de%20inversi%C3%B3n.",
    29|            external: true,
    30|        },
    31|    },
    32|    {
    33|        icon: Mail,
    34|        title: "Correo Electrónico",
    35|        lines: ["contacto@blackcorporativo.com"],
    36|        action: {
    37|            label: "Escribir",
    38|            href: "mailto:contacto@blackcorporativo.com",
    39|            external: true,
    40|        },
    41|    },
    42|    {
    43|        icon: MapPin,
    44|        title: "Oficina Corporativa",
    45|        lines: ["Torre XYZ, Piso 12", "Av. Paseo de la Reforma", "Ciudad de México, 06600"],
    46|        action: null,
    47|    },
    48|    {
    49|        icon: Clock,
    50|        title: "Horario de Atención",
    51|        lines: ["Lunes a Viernes", "9:00 AM — 6:00 PM (CT)", "Sábados con cita previa"],
    52|        action: null,
    53|    },
    54|];
    55|
    56|export default function ContactoPage() {
    57|    return (
    58|        <div className="w-full flex-1 bg-background">
    59|            {/* Hero */}
    60|            <div className="bg-zinc-950 py-24 border-b border-gold-500/20 relative overflow-hidden">
    61|                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
    62|                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
    63|                    <FadeIn>
    64|                        <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
    65|                            Contacto Directo
    66|                        </span>
    67|                        <h1 className="section-heading text-4xl md:text-6xl text-white mb-6">
    68|                            Hablemos de{" "}
    69|                            <span className="metallic-gold">Inversión</span>
    70|                        </h1>
    71|                        <p className="text-foreground/50 text-lg leading-relaxed max-w-2xl mx-auto">
    72|                            Nuestro equipo está listo para atenderte. Ya sea que busques
    73|                            una propiedad específica, requieras un análisis financiero o
    74|                            desees explorar oportunidades de inversión en México.
    75|                        </p>
    76|                    </FadeIn>
    77|                </div>
    78|            </div>
    79|
    80|            {/* Contact Cards */}
    81|            <div className="container mx-auto px-4 py-24">
    82|                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
    83|                    {contactCards.map((card) => {
    84|                        const Icon = card.icon;
    85|                        return (
    86|                            <StaggerItem key={card.title}>
    87|                                <div className="group p-10 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700 flex flex-col h-full">
    88|                                    <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 transition-all duration-500">
    89|                                        <Icon className="w-6 h-6 text-gold-500" />
    90|                                    </div>
    91|                                    <h3 className="card-title text-xl text-foreground mb-4">
    92|                                        {card.title}
    93|                                    </h3>
    94|                                    <div className="space-y-1 mb-6 flex-1">
    95|                                        {card.lines.map((line, i) => (
    96|                                            <p key={i} className="text-foreground/45 text-sm">
    97|                                                {line}
    98|                                            </p>
    99|                                        ))}
   100|                                    </div>
   101|                                    {card.action && (
   102|                                        <a
   103|                                            href={card.action.href}
   104|                                            target={card.action.external ? "_blank" : undefined}
   105|                                            rel={card.action.external ? "noopener noreferrer" : undefined}
   106|                                        >
   107|                                            <Button className="bg-gold-500 text-black hover:bg-gold-400 font-bold group/btn">
   108|                                                {card.action.label}
   109|                                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
   110|                                            </Button>
   111|                                        </a>
   112|                                    )}
   113|                                </div>
   114|                            </StaggerItem>
   115|                        );
   116|                    })}
   117|                </StaggerChildren>
   118|            </div>
   119|
   120|            {/* CTA Final */}
   121|            <div className="container mx-auto px-4 pb-24">
   122|                <FadeIn>
   123|                    <div className="max-w-3xl mx-auto text-center p-12 rounded-2xl border border-gold-500/20 bg-zinc-950/60 backdrop-blur-sm">
   124|                        <h2 className="section-heading text-3xl text-white mb-6">
   125|                            ¿Listo para invertir?
   126|                        </h2>
   127|                        <p className="text-foreground/50 text-lg leading-relaxed mb-8">
   128|                            Explora nuestro portafolio de propiedades verificadas con
   129|                            análisis financiero estructurado. O contacta a un asesor
   130|                            para una consultoría personalizada.
   131|                        </p>
   132|                        <div className="flex flex-wrap justify-center gap-4">
   133|                            <Link href="/inventario">
   134|                                <Button className="bg-gold-500 text-black hover:bg-gold-400 font-bold px-8 py-6 text-base">
   135|                                    Ver Inventario
   136|                                    <ArrowRight className="w-4 h-4 ml-2" />
   137|                                </Button>
   138|                            </Link>
   139|                            <Link href="/nosotros">
   140|                                <Button variant="outline" className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 font-bold px-8 py-6 text-base">
   141|                                    Conócenos
   142|                                </Button>
   143|                            </Link>
   144|                        </div>
   145|                    </div>
   146|                </FadeIn>
   147|            </div>
   148|        </div>
   149|    );
   150|}
   151|