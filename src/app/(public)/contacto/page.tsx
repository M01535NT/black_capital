import type { Metadata } from "next";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/ui/motion";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Contacto | Black Corporativo",
    description:
        "Contacta a Black Corporativo. Oficinas corporativas, WhatsApp directo y consultoría personalizada para inversores B2B y HNWI en México.",
    openGraph: {
        title: "Contacto | Black Corporativo",
        description:
            "Consulta directa con nuestros asesores inmobiliarios especializados. Oficinas en CDMX. Atención a inversores institucionales y privados.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Corporativo",
    },
};

const contactCards = [
    {
        icon: Phone,
        title: "WhatsApp Directo",
        lines: ["+52 (55) 1234 5678"],
        action: {
            label: "Enviar Mensaje",
            href: "https://wa.me/521234567890?text=Hola%2C%20me%20gustar%C3%ADa%20recibir%20informaci%C3%B3n%20sobre%20propiedades%20de%20inversi%C3%B3n.",
            external: true,
        },
    },
    {
        icon: Mail,
        title: "Correo Electrónico",
        lines: ["contacto@blackcorporativo.com"],
        action: {
            label: "Escribir",
            href: "mailto:contacto@blackcorporativo.com",
            external: true,
        },
    },
    {
        icon: MapPin,
        title: "Oficina Corporativa",
        lines: ["Torre XYZ, Piso 12", "Av. Paseo de la Reforma", "Ciudad de México, 06600"],
        action: null,
    },
    {
        icon: Clock,
        title: "Horario de Atención",
        lines: ["Lunes a Viernes", "9:00 AM — 6:00 PM (CT)", "Sábados con cita previa"],
        action: null,
    },
];

export default function ContactoPage() {
    return (
        <div className="w-full flex-1 bg-background">
            {/* Hero */}
            <div className="bg-zinc-950 py-24 border-b border-gold-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--color-gold-500)/0.05,_transparent_50%)]" />
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <FadeIn>
                        <span className="animate-gold-shimmer text-xs font-bold uppercase tracking-[0.5em] mb-6 inline-block">
                            Contacto Directo
                        </span>
                        <h1 className="section-heading text-4xl md:text-6xl text-foreground mb-6">
                            Hablemos de{" "}
                            <span className="metallic-gold">Inversión</span>
                        </h1>
                        <p className="text-foreground/50 text-lg leading-relaxed max-w-2xl mx-auto">
                            Nuestro equipo está listo para atenderte. Ya sea que busques
                            una propiedad específica, requieras un análisis financiero o
                            desees explorar oportunidades de inversión en México.
                        </p>
                    </FadeIn>
                </div>
            </div>

            {/* Contact Cards */}
            <div className="container mx-auto px-4 py-24">
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {contactCards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <StaggerItem key={card.title}>
                                <div className="group p-10 rounded-2xl border border-gold-500/10 bg-zinc-950/40 backdrop-blur-sm hover:border-gold-500/30 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-700 flex flex-col h-full">
                                    <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-8 group-hover:bg-gold-500/20 transition-all duration-500">
                                        <Icon className="w-6 h-6 text-gold-500" />
                                    </div>
                                    <h3 className="card-title text-xl text-foreground mb-4">
                                        {card.title}
                                    </h3>
                                    <div className="space-y-1 mb-6 flex-1">
                                        {card.lines.map((line, i) => (
                                            <p key={i} className="text-foreground/45 text-sm">
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                    {card.action && (
                                        <a
                                            href={card.action.href}
                                            target={card.action.external ? "_blank" : undefined}
                                            rel={card.action.external ? "noopener noreferrer" : undefined}
                                        >
                                            <Button className="bg-gold-500 text-black hover:bg-gold-400 font-bold group/btn">
                                                {card.action.label}
                                                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </StaggerItem>
                        );
                    })}
                </StaggerChildren>
            </div>

            {/* CTA Final */}
            <div className="container mx-auto px-4 pb-24">
                <FadeIn>
                    <div className="max-w-3xl mx-auto text-center p-12 rounded-2xl border border-gold-500/20 bg-zinc-950/60 backdrop-blur-sm">
                        <h2 className="section-heading text-3xl text-foreground mb-6">
                            ¿Listo para invertir?
                        </h2>
                        <p className="text-foreground/50 text-lg leading-relaxed mb-8">
                            Explora nuestro portafolio de propiedades verificadas con
                            análisis financiero estructurado. O contacta a un asesor
                            para una consultoría personalizada.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/inventario">
                                <Button className="bg-gold-500 text-black hover:bg-gold-400 font-bold px-8 py-6 text-base">
                                    Ver Inventario
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/nosotros">
                                <Button variant="outline" className="border-gold-500/30 text-gold-500 hover:bg-gold-500/10 font-bold px-8 py-6 text-base">
                                    Conócenos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
