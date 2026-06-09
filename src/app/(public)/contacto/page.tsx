import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { ContactLeadForm } from "@/components/public/contact-lead-form";

export const metadata: Metadata = {
    title: "Contacto | Black Capital",
    description:
        "Contacta a Black Capital. Oficinas en Tijuana, WhatsApp directo y asesoría personalizada para compradores e inversionistas en Baja California.",
    openGraph: {
        title: "Contacto | Black Capital",
        description:
            "Consulta directa con nuestros asesores inmobiliarios. Oficinas en Tijuana, Baja California. Atención personalizada para compradores, vendedores e inversionistas.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Capital",
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
                className="relative min-h-[72svh] overflow-hidden border-b border-white/[0.06] pt-24 lg:pt-28"
            >
                <Image
                    src="/hero-poster.webp"
                    alt="Contacto inmobiliario en Tijuana"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-background/88 to-background/35" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />

                <div className="relative z-10 mx-auto grid min-h-[calc(72svh-6rem)] max-w-[90rem] grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 lg:grid-cols-12 lg:px-16">
                    <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/10 bg-black/35 px-3 py-2 property-tag-type text-white/70">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                Tijuana, Baja California
            </div>
            <p className="mb-3 property-tag-type text-[var(--color-accent)]">
                Contacto directo
            </p>
                        <h1 className="max-w-4xl text-display-1 leading-hero tracking-tight text-white text-balance">
                            Hablemos de tu siguiente operación.
                        </h1>
                        <p className="mt-6 max-w-2xl text-body-fluid leading-relaxed text-white/72">
                            Comparte tu búsqueda y el equipo preparará opciones para seguimiento comercial: residencia, local, oficina, nave o venta de propiedad.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="#solicitud"
                                className="brushed-gold inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none premium-cta"
                            >
                                Enviar solicitud
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <a
                                href={`https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent("Hola, me gustaría recibir información sobre propiedades de inversión.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none border border-white/18 bg-white/[0.04] premium-cta text-white transition-colors hover:border-[var(--color-accent)]"
                            >
                                WhatsApp directo
                            </a>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="border border-white/10 bg-background/82 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
                            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-body-lg text-white">Respuesta comercial</p>
                                    <p className="text-body-sm text-white/50">Formulario y WhatsApp disponibles</p>
                                </div>
                            </div>
                            <div className="grid gap-3 py-4">
                                {["Tipo de activo", "Zona de interés", "Presupuesto", "Datos de contacto"].map((label) => (
                                    <div key={label} className="flex items-center justify-between border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                                        <span className="text-body text-white/65">{label}</span>
                                        <span className="property-tag-type text-[var(--color-accent)]">Enviar</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                href="#solicitud"
                                className="inline-flex w-full items-center justify-center gap-2 premium-cta bg-white text-black"
                            >
                                Dejar datos
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section id="canales" aria-label="Canales de atención" className="mx-auto max-w-[90rem] px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-3 property-tag-type text-[var(--color-accent)]">
                            Canales
                        </p>
                        <h2 className="text-display-2 leading-display tracking-headline text-white">
                            Cuatro formas de empezar.
                        </h2>
                    </div>
                    <p className="max-w-xl text-body text-white/58 sm:text-right">
                        Elige el canal más directo. La información se usará para seguimiento comercial.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2" role="list">
                    {contactCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.title}
                                role="listitem"
                                className="border border-white/[0.08] bg-white/[0.025] p-5 transition-colors hover:border-[var(--color-accent)]/35"
                            >
                                <span className="mb-5 block property-tag-type text-white/40">
                                    /{String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-black" aria-hidden="true">
                                    <Icon className="h-5 w-5" strokeWidth={1.8} />
                                </div>
                                <h3 className="mb-3 text-display-3 text-white">{card.title}</h3>
                                <div className="mb-6 min-h-12 space-y-1">
                                    {card.lines.map((line, idx) => (
                                        <p key={idx} className="text-body leading-relaxed text-white/64">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                                {card.action && (
                                    <a
                                        href={card.action.href}
                                        target={card.action.external ? "_blank" : undefined}
                                        rel={card.action.external ? "noopener noreferrer" : undefined}
                                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--color-accent)]/35 px-5 property-tag-type text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black"
                                    >
                                        <span>{card.action.label}</span>
                                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <section id="solicitud" aria-label="Solicitud" className="border-y border-white/[0.06] bg-white/[0.02] py-16 lg:py-24">
                <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-10 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16">
                    <div className="lg:col-span-5">
                        <p className="mb-3 property-tag-type text-[var(--color-accent)]">
                            Captura de lead
                        </p>
                        <h2 className="text-display-2 text-white leading-display tracking-headline">
                            Deja tus datos y el contexto de búsqueda.
                        </h2>
                        <p className="mt-6 max-w-md text-body text-white/58">
                            Este formulario usa placeholders operativos. Cuando el cliente defina inventario, zonas y agentes, el panel de administración podrá alimentar el seguimiento real.
                        </p>
                    </div>
                    <div className="lg:col-span-7">
                        <div className="border border-white/[0.08] bg-background/70 p-5 sm:p-6">
                            <ContactLeadForm />
                        </div>
                    </div>
                </div>
            </section>

            <section id="agendar" aria-label="Agendar" className="mx-auto max-w-[90rem] px-6 py-16 text-center sm:px-10 lg:px-16 lg:py-24">
                <div className="mx-auto max-w-2xl">
                        <p className="mb-3 property-tag-type text-[var(--color-accent)]">
                            Próximo paso
                        </p>
                    <h2 className="mb-5 text-display-2 leading-display tracking-headline text-white">
                        Continúa por inventario o WhatsApp.
                    </h2>
                    <p className="mb-10 text-body text-white/58">
                        Si todavía no tienes claro el tipo de activo, WhatsApp es la ruta más rápida.
                    </p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/inventario"
                            className="brushed-gold inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none premium-cta"
                        >
                            <span>Ver Inventario</span>
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                        <a
                            href={`https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent("Hola, me gustaría recibir información sobre propiedades de inversión.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none border border-white/18 bg-white/[0.04] premium-cta text-white transition-colors hover:border-[var(--color-accent)]"
                        >
                            <span>WhatsApp directo</span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

