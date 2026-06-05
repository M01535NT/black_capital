"use client";

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
    { name: "Aviso de Privacidad", href: "/legal/privacidad" },
    { name: "Términos de Uso", href: "/legal/terminos" },
];

/**
 * Newsletter inline — formulario mínimo sin React Hook Form.
 * Single-field action contra /api/leads. Honeypot anti-bot.
 */
function FooterNewsletter() {
    return (
        <form
            action="/api/leads"
            method="post"
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
                placeholder="Tu correo corporativo"
                autoComplete="email"
                aria-label="Correo para suscribirse al directorio"
                className="flex-1 bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-[var(--color-accent)] px-0 py-2 text-sm font-light"
            />
            <Button
                type="submit"
                className="btn-ghost-gold border border-[var(--color-accent)]/40 text-white text-[11px] font-semibold uppercase tracking-[0.16em] rounded-full px-6 py-3 hover:border-[var(--color-accent)]"
            >
                <span>Suscribir</span>
                <span aria-hidden="true" className="ml-1.5 text-[var(--color-accent)]">→</span>
            </Button>
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
            className="w-full bg-[#050505] mt-auto relative"
        >
            {/* ═══════ CTA FINAL MASIVO ═══════ */}
            <div className="relative border-t border-b border-white/[0.04] overflow-hidden">
                {/* Subtle ambient */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    aria-hidden="true"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, rgba(197,160,89,0.06) 0%, transparent 60%)",
                    }}
                />
                <div className="grain-overlay" aria-hidden="true" />

                <div className="relative max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32 lg:py-48 text-center">
                  {/* Eyebrow */}
                  <div className="flex items-center justify-center gap-3 mb-10">
                    <span className="h-px w-10 bg-[var(--color-accent)]/60" />
                    <span className="text-[11px] tracking-[0.22em] uppercase text-white/70 font-semibold">
                      Acceso Directo
                    </span>
                    <span className="h-px w-10 bg-[var(--color-accent)]/60" />
                  </div>

                  {/* Massive headline */}
                  <h2 className="text-[clamp(2.5rem,7.5vw,7rem)] font-light text-white leading-[1.0] tracking-[-0.04em] mb-10 max-w-5xl mx-auto">
                    ¿Listo para invertir con alguien que te <span className="metallic-gold-static">habla claro</span>?
                  </h2>

                  {/* Sub */}
                  <p className="text-[clamp(1rem,1.4vw,1.2rem)] text-white/65 leading-[1.7] font-light max-w-2xl mx-auto mb-12">
                    Recibe el directorio completo con inventario curado y análisis financiero estructurado por activo. Sin compromiso, sin formularios eternos.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
                    <Link
                      href="/contacto"
                      className="btn-ghost-gold group inline-flex items-center gap-3 px-10 py-4 border border-[var(--color-accent)] text-white text-sm font-semibold uppercase tracking-[0.18em] rounded-full transition-colors duration-500"
                    >
                      <span>Hablar con un Asesor</span>
                      <span aria-hidden="true" className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                    <Link
                      href="/inventario"
                      className="inline-flex items-center gap-2 text-white/70 text-sm font-light tracking-wide hover:text-white transition-colors duration-300 group"
                    >
                      <span>Explorar inventario</span>
                      <span aria-hidden="true" className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </Link>
                  </div>

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
                            Plataforma digital inmobiliaria de alta gama estructurada para inversores B2B y HNWI con interés en el mercado mexicano.
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
                        Hecho con discreción en México
                    </p>
                </div>
            </div>
        </footer>
    );
}
