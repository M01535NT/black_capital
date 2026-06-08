"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
    Linkedin,
    Instagram,
    Twitter,
    MapPin,
    Phone,
    Mail,
    MessageCircle,
} from "lucide-react";
import { Logo } from "./Logo";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ── Google Maps link derived from the human-readable address ── */
const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    CONTACT_CONFIG.address,
)}`;

const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: CONTACT_CONFIG.social.linkedin },
    { name: "Instagram", icon: Instagram, href: CONTACT_CONFIG.social.instagram },
    { name: "X", icon: Twitter, href: CONTACT_CONFIG.social.x },
] as const;

const brandLinks = [
    { name: "Black Luxury", href: "/black-luxury", desc: "Residencial" },
    { name: "Black Business", href: "/black-business", desc: "Comercial" },
    { name: "Black Industrial", href: "/black-industrial", desc: "Industrial" },
];

const corpLinks = [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Herramientas", href: "/herramientas" },
    { name: "Panel Admin", href: "/admin" },
    { name: "Aviso de Privacidad", href: "/legal/aviso-privacidad" },
    { name: "Términos de Uso", href: "/legal/terminos-condiciones" },
];

/**
 * Newsletter inline — formulario mínimo sin React Hook Form.
 * Single-field action contra /api/leads. Honeypot anti-bot.
 */
function FooterNewsletter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setStatus("submitting");

        const formData = new FormData(event.currentTarget);
        const honeypot = String(formData.get("company_honeypot") || "");

        try {
            const response = await fetch("/api/public-leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_honeypot: honeypot,
                    full_name: "Suscriptor newsletter",
                    email,
                    phone: "",
                    privacy_accepted: true,
                    source: "newsletter",
                    status: "new",
                    notes: "Newsletter footer",
                }),
            });

            if (!response.ok) throw new Error("No se pudo registrar");

            setEmail("");
            setStatus("success");
        } catch {
            setStatus("error");
        }
    }

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col sm:flex-row gap-2 max-w-md"
            aria-label="Suscripción al directorio de inversores"
        >
            <input
                type="text"
                name="company_honeypot"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
            />
            <Input
                type="email"
                name="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Tu correo corporativo"
                autoComplete="email"
                aria-label="Correo para suscribirse al directorio"
                className="flex-1 bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-2 text-sm font-light"
            />
            <Button
                type="submit"
                disabled={status === "submitting"}
                className="btn-ghost-gold border border-[var(--color-accent)]/40 text-white text-[11px] font-semibold uppercase tracking-[0.16em] rounded-full px-6 py-3 hover:border-[var(--color-accent)]"
            >
                <span>{status === "submitting" ? "Enviando" : "Suscribir"}</span>
                <span aria-hidden="true" className="ml-1.5 text-[var(--color-accent)]">→</span>
            </Button>
            <p className="sr-only" aria-live="polite">
                {status === "success"
                    ? "Solicitud registrada"
                    : status === "error"
                    ? "No se pudo registrar la solicitud"
                    : ""}
            </p>
        </form>
    );
}

export function Footer() {
    const phoneRaw = CONTACT_CONFIG.phoneRaw;
    const whatsappHref = `https://wa.me/${phoneRaw}?text=${encodeURIComponent(
        "Hola, me gustaría recibir información sobre propiedades de inversión.",
    )}`;

    return (
        <footer
            role="contentinfo"
            aria-label="Pie de página"
            className="w-full bg-background mt-auto relative"
        >
            {/* ═══════ CTA FINAL COMPACTO (~280px) ═══════ */}
            <div className="border-t border-b border-white/[0.04]">
                <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-14 text-center">
                  {/* Eyebrow */}
                  <div className="flex items-center justify-center gap-3 mb-5">
                    <span className="h-px w-10 bg-[var(--color-accent)]/60" />
                    <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 font-semibold">
                      Acceso Directo
                    </span>
                    <span className="h-px w-10 bg-[var(--color-accent)]/60" />
                  </div>

                  {/* Compact headline */}
                  <h2 className="text-display-3 font-light text-white leading-display tracking-headline mb-6 max-w-2xl mx-auto">
                    ¿Listo para invertir con <span className="metallic-gold-static">claridad</span>?
                  </h2>

                  {/* Newsletter inline */}
                  <div className="max-w-md mx-auto">
                    <FooterNewsletter />
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/30 font-semibold mt-4">
                      Compliance LFPIORPI · COFECE · Privacidad garantizada
                    </p>
                  </div>
                </div>
            </div>

            {/* ═══════ FOOTER PROPIAMENTE ═══════ */}
            <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 pt-20 pb-8">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 space-y-5">
                        <Logo href="/" variant="full" size="md" tone="gold" />
                        <p className="text-[13px] text-white/55 leading-[1.7] font-light max-w-sm">
                            Plataforma inmobiliaria premium en Tijuana, Baja California. Casas residenciales, centros comerciales y naves industriales con análisis financiero estructurado para compradores, empresarios e inversionistas.
                        </p>
                        <div className="flex gap-2 pt-2 flex-wrap">
                            {socialLinks.map((social) => {
                                const handle = (() => {
                                    try {
                                        return new URL(social.href).pathname.replace(/^\//, "@");
                                    } catch {
                                        return social.name;
                                    }
                                })();
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={`${social.name} · ${handle}`}
                                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all duration-300 focus-visible:text-[var(--color-accent)] focus-visible:border-[var(--color-accent)]/40 focus-visible:outline-none"
                                        aria-label={`${social.name} (${handle})`}
                                    >
                                        <social.icon className="w-4 h-4" aria-hidden="true" />
                                    </a>
                                );
                            })}
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`WhatsApp · ${CONTACT_CONFIG.phone}`}
                                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)]/40 transition-all duration-300 focus-visible:text-[var(--color-accent)] focus-visible:border-[var(--color-accent)]/40 focus-visible:outline-none"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Marcas */}
                    <div className="col-span-1 md:col-span-3 space-y-5">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                            Marcas
                        </h4>
                        <ul className="space-y-3">
                            {brandLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex flex-col">
                                        <span className="text-[13px] font-semibold uppercase tracking-wide text-white/75 group-hover:text-[var(--color-accent)] transition-colors">
                                            {link.name}
                                        </span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                                            {link.desc}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Corporativo */}
                    <div className="col-span-1 md:col-span-2 space-y-5">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                            Corporativo
                        </h4>
                        <ul className="space-y-3">
                            {corpLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-[13px] font-semibold uppercase tracking-wide text-white/75 hover:text-[var(--color-accent)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="col-span-2 md:col-span-3 space-y-5">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/55">
                            Contacto
                        </h4>
                        <ul className="space-y-3 text-[13px] text-white/55 leading-relaxed">
                            <li>
                                <a
                                    href={mapsHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-start gap-2 hover:text-[var(--color-accent)] transition-colors"
                                >
                                    <MapPin className="w-3.5 h-3.5 mt-1 text-[var(--color-accent)] flex-shrink-0" aria-hidden="true" />
                                    <span className="group-hover:underline">{CONTACT_CONFIG.address}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${phoneRaw}`}
                                    className="group inline-flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors"
                                >
                                    <Phone className="w-3.5 h-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                    <span className="group-hover:underline">{CONTACT_CONFIG.phone}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${CONTACT_CONFIG.email}`}
                                    className="group inline-flex items-center gap-2 hover:text-[var(--color-accent)] transition-colors break-all"
                                >
                                    <Mail className="w-3.5 h-3.5 text-[var(--color-accent)] flex-shrink-0" aria-hidden="true" />
                                    <span className="group-hover:underline">{CONTACT_CONFIG.email}</span>
                                </a>
                            </li>
                            <li className="pt-1 text-[10px] tracking-[0.18em] uppercase text-white/35 leading-relaxed">
                                {CONTACT_CONFIG.hours.map((line) => (
                                    <span key={line} className="block">{line}</span>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Compliance */}
                <p className="text-[10px] tracking-[0.16em] uppercase text-white/30 mb-6 max-w-3xl leading-relaxed font-light">
                    Cumplimiento LFPIORPI Art. 27 y disposiciones COFECE aplicables. Black Capital opera como intermediario inmobiliario; no presta servicios de asesoría financiera ni de inversión. Toda la información publicada está sujeta a disponibilidad y confirmación.
                </p>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/40">
                        © {new Date().getFullYear()} Black Capital. Todos los derechos reservados.
                    </p>
                    <p className="text-[10px] tracking-[0.18em] uppercase text-white/30">
                        Representación inmobiliaria profesional
                    </p>
                </div>
            </div>
        </footer>
    );
}
