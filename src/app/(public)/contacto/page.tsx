import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, ArrowRight, MessageCircle } from "lucide-react";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { ContactLeadForm } from "@/components/public/contact-lead-form";

export const metadata: Metadata = {
    title: "Contacto | Black Capital",
    description:
        "Contacta a Black Capital para comprar, vender, rentar, invertir o conocer el valor comercial de un inmueble en Tijuana.",
    openGraph: {
        title: "Contacto | Black Capital",
        description:
            "Consulta directa para propietarios, compradores, arrendatarios e inversionistas en Tijuana.",
        type: "website",
        locale: "es_MX",
        siteName: "Black Capital",
    },
};

const contactCards = [
    {
        icon: Phone,
        title: "WhatsApp",
        lines: [CONTACT_CONFIG.phone],
        action: {
            label: "Enviar",
            href: `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent("Hola, quiero recibir información sobre un inmueble.")}`,
            external: true,
        },
    },
    {
        icon: Mail,
        title: "Correo",
        lines: [CONTACT_CONFIG.email],
        action: {
            label: "Escribir",
            href: `mailto:${CONTACT_CONFIG.email}`,
            external: true,
        },
    },
    {
        icon: MapPin,
        title: "Oficina",
        lines: CONTACT_CONFIG.addressLines,
        action: null,
    },
    {
        icon: Clock,
        title: "Horario",
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
                className="relative overflow-hidden border-b border-white/[0.06] pt-20 lg:min-h-[72svh] lg:pt-28"
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

                <div className="relative z-10 mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-8 px-6 py-8 sm:px-10 lg:min-h-[calc(72svh-6rem)] lg:grid-cols-12 lg:gap-10 lg:px-16 lg:py-12">
                    <div className="lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 border border-white/10 bg-black/35 px-3 py-2 property-tag-type text-white/70 lg:mb-6">
                <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                Tijuana, Baja California
            </div>
            <p className="mb-3 property-tag-type text-[var(--color-accent)]">
                Contacto directo
            </p>
                        <h1 className="max-w-4xl text-display-1 leading-hero tracking-tight text-white text-balance">
                            Cuéntanos qué necesitas hacer con un inmueble.
                        </h1>
                        <p className="mt-4 max-w-2xl text-body-fluid leading-relaxed text-white/72 lg:mt-5">
                            Comprar, vender, rentar, invertir o conocer su valor comercial: empezamos por entender el objetivo.
                        </p>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-7">
                            <Link
                                href="#solicitud"
                                className="brushed-gold inline-flex min-h-[50px] items-center justify-center gap-2 rounded-none premium-cta"
                            >
                                Enviar solicitud
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </Link>
                            <a
                                href={`https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent("Hola, quiero recibir información sobre un inmueble.")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex min-h-[50px] w-fit items-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
                            >
                                <span className="property-tag-type relative pb-1">
                                    WhatsApp directo
                                    <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                                </span>
                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    <div className="hidden lg:col-span-5 lg:block">
                        <div className="border border-white/10 bg-background/82 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
                            <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-black">
                                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <p className="text-body-lg text-white">Respuesta directa</p>
                                    <p className="text-body-sm text-white/50">Formulario y WhatsApp disponibles</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 py-4 lg:grid-cols-1">
                                {["Tipo de activo", "Zona de interés", "Presupuesto", "Datos de contacto"].map((label) => (
                                    <div key={label} className="flex min-h-16 flex-col justify-between border border-white/[0.08] bg-white/[0.03] px-3 py-3 lg:min-h-0 lg:flex-row lg:items-center lg:px-4">
                                        <span className="text-body-sm text-white/65 lg:text-body">{label}</span>
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
                            Elige cómo contactarnos.
                        </h2>
                    </div>
                    <p className="max-w-xl text-body text-white/58 sm:text-right">
                        Te respondemos por el canal que elijas para entender tu objetivo y proponer el siguiente paso.
                    </p>
                </div>

                <div className="grid min-w-0 grid-cols-2 gap-3 md:gap-5" role="list">
                    {contactCards.map((card, i) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.title}
                                role="listitem"
                                className="flex min-h-[220px] min-w-0 flex-col border border-white/[0.08] bg-white/[0.025] p-4 transition-colors hover:border-[var(--color-accent)]/35 sm:p-5"
                            >
                                <span className="mb-4 block property-tag-type text-white/40">
                                    /{String(i + 1).padStart(2, "0")}
                                </span>
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-black" aria-hidden="true">
                                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                                </div>
                                <h3 className="mb-3 text-display-3 text-white">{card.title}</h3>
                                <div className="mb-5 min-h-12 flex-1 space-y-1">
                                    {card.lines.map((line, idx) => (
                                        <p key={idx} className="min-w-0 break-words text-body-sm leading-relaxed text-white/64 [overflow-wrap:anywhere] sm:text-body">
                                            {line}
                                        </p>
                                    ))}
                                </div>
                                {card.action && (
                                    <a
                                        href={card.action.href}
                                        target={card.action.external ? "_blank" : undefined}
                                        rel={card.action.external ? "noopener noreferrer" : undefined}
                                        className="group inline-flex min-h-10 w-fit items-center gap-2 text-white/78 transition-colors duration-300 hover:text-[var(--color-accent)]"
                                    >
                                        <span className="property-tag-type relative pb-1">
                                            {card.action.label}
                                            <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                                        </span>
                                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <section id="solicitud" aria-label="Solicitud" className="border-y border-white/[0.06] bg-white/[0.02] py-10 lg:py-24">
                <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-6 px-6 sm:px-10 lg:grid-cols-12 lg:gap-16 lg:px-16">
                    <div className="lg:col-span-5">
                        <p className="mb-3 property-tag-type text-[var(--color-accent)]">
                            Solicitud de contacto
                        </p>
                        <h2 className="text-display-2 text-white leading-display tracking-headline">
                            Déjanos tus datos y el contexto del inmueble.
                        </h2>
                        <p className="mt-4 max-w-md text-body text-white/58 lg:mt-6">
                            Revisamos tu mensaje y te contactamos para ordenar necesidad, zona, presupuesto o valor comercial.
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
                        También puedes empezar por inventario o WhatsApp.
                    </h2>
                    <p className="mb-10 text-body text-white/58">
                        Si todavía no tienes claro el tipo de inmueble, WhatsApp es la ruta más rápida.
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
                            href={`https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent("Hola, quiero recibir información sobre un inmueble.")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex min-h-[50px] items-center justify-center gap-2 text-white/85 transition-colors duration-300 hover:text-[var(--color-accent)]"
                        >
                            <span className="property-tag-type relative pb-1">
                                WhatsApp directo
                                <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}

