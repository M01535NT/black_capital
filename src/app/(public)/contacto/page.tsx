import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/contact-config";

export const metadata: Metadata = {
    title: "Contacto | Black Corporativo",
    description:
        "Contacta a Black Corporativo. Oficinas en Tijuana, WhatsApp directo y asesoría personalizada para compradores e inversionistas en Baja California.",
    openGraph: {
        title: "Contacto | Black Corporativo",
        description:
            "Consulta directa con nuestros asesores inmobiliarios. Oficinas en Tijuana, Baja California. Atención personalizada para compradores, vendedores e inversionistas.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Corporativo",
    },
};

const contactCards = [
    {
        icon: Phone,
        title: "WhatsApp Directo",
        lines: [CONTACT_CONFIG.phone],
        action: {
            label: "Enviar Mensaje",
            href: `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent("Hola, me gustaría recibir información sobre propiedades de inversión.")}`,
            external: true,
        },
    },
    {
        icon: Mail,
        title: "Correo Electrónico",
        lines: [CONTACT_CONFIG.email],
        action: {
            label: "Escribir",
            href: `mailto:${CONTACT_CONFIG.email}`,
            external: true,
        },
    },
    {
        icon: MapPin,
        title: "Oficina Corporativa",
        lines: CONTACT_CONFIG.addressLines,
        action: null,
    },
    {
        icon: Clock,
        title: "Horario de Atención",
        lines: CONTACT_CONFIG.hours,
        action: null,
    },
];

export default function ContactoPage() {
    return (
        <div className="w-full flex-1 bg-background">
            {/* Hero — mismo lenguaje que Home */}
            <section
                aria-label="Contacto"
                className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-24 bg-background border-b border-white/[0.04] overflow-hidden"
            >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent" />
                <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-8">
                            <Eyebrow label="Contacto directo" />
                            <h1 className="text-display-1 font-light text-white leading-hero tracking-tight text-balance">
                                Hablemos de{" "}
                                <span className="metallic-gold-static gold-glow">inversión</span>.
                            </h1>
                            <p className="text-body-fluid text-white/70 leading-relaxed font-light max-w-2xl mt-6 sm:mt-10">
                                Nuestro equipo está listo para atenderte. Ya sea que busques una propiedad
                                específica, requieras un análisis financiero o desees explorar oportunidades
                                de inversión en México.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Canales — 2×2 con vlines y hairline (sin glass cards) */}
            <Section id="canales" label="Canales de atención" spacing="default" containerWidth="wide">
                <div className="flex items-end justify-between gap-8 mb-14 sm:mb-20">
                    <div className="max-w-2xl">
                        <Eyebrow label="Canales" />
                        <h2 className="text-display-2 font-light text-white leading-display tracking-headline">
                            Cuatro formas de <span className="text-white/45">empezar.</span>
                        </h2>
                    </div>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-white/[0.06]" role="list">
                    {/* Horizontal hairline (mobile) */}
                    <div
                        className="md:hidden absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />
                    {/* Vertical hairline (desktop) */}
                    <div
                        className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-accent)]/30 to-transparent pointer-events-none"
                        aria-hidden="true"
                    />

                    {contactCards.map((card, i) => {
                        const Icon = card.icon;
                        const isTop = i < 2;
                        return (
                            <div
                                key={card.title}
                                role="listitem"
                                className={
                                    "relative p-8 sm:p-10 lg:p-14 flex flex-col items-start " +
                                    (isTop ? "border-b md:border-b border-white/[0.06]" : "")
                                }
                            >
                                <span className="text-[10px] tracking-[0.2em] uppercase text-white/40 font-semibold mb-6">
                                    /{String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="w-14 h-14 rounded-full border border-[var(--color-accent)]/40 flex items-center justify-center mb-8" aria-hidden="true">
                                    <Icon className="w-6 h-6 text-[var(--color-accent)]" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-display-4 font-semibold text-white tracking-snug mb-3">
                                    {card.title}
                                </h3>
                                <div className="space-y-1 mb-6 flex-1">
                                    {card.lines.map((line, idx) => (
                                        <p key={idx} className="text-body-sm text-white/65 leading-relaxed font-light">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                                {card.action && (
                                    <a
                                        href={card.action.href}
                                        target={card.action.external ? "_blank" : undefined}
                                        rel={card.action.external ? "noopener noreferrer" : undefined}
                                        className="btn-ghost-gold inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--color-accent)]/30 text-white text-[11px] font-semibold uppercase tracking-[0.16em] rounded-full hover:border-[var(--color-accent)] transition-colors duration-300"
                                    >
                                        <span>{card.action.label}</span>
                                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Section>

            {/* CTA final — sin glass card, patrón Newsletter */}
            <Section id="agendar" label="Agendar" spacing="tight" containerWidth="wide">
                <div className="text-center max-w-2xl mx-auto">
                    <Eyebrow label="Próximo paso" />
                    <h2 className="text-display-2 font-light text-white leading-display tracking-headline mb-5">
                        ¿Listo para invertir con{" "}
                        <span className="metallic-gold-static">claridad</span>?
                    </h2>
                    <p className="text-body-fluid-sm text-white/65 leading-relaxed font-light mb-10">
                        Explora nuestro portafolio verificado o agenda una consultoría personalizada.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                        <Link
                            href="/inventario"
                            className="brushed-gold inline-flex items-center gap-2 px-7 py-3.5 text-[13px] font-bold tracking-[0.06em] rounded-full hover:scale-[1.015] transition-all duration-300"
                        >
                            <span>Ver Inventario</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                        <Link
                            href="/nosotros"
                            className="btn-ghost-gold inline-flex items-center gap-2 px-7 py-3.5 border border-white/35 text-white text-[13px] font-semibold tracking-[0.06em] rounded-full hover:border-accent transition-colors duration-300"
                        >
                            <span>Conócenos</span>
                        </Link>
                    </div>
                </div>
            </Section>
        </div>
    );
}
