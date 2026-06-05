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
    ArrowRight,
} from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CONTACT_CONFIG } from "@/lib/contact-config";

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
 * Inline newsletter form inside the footer CTA band.
 * Kept minimal and local — no React Hook Form to avoid a heavy client
 * island for what is a single-field action. The /api/leads route is the
 * same one the LeadMagnet uses, but for a newsletter capture we only
 * need `full_name` and `email`, so we post a trimmed payload and rely on
 * the server to default the rest.
 */
function FooterNewsletter() {
    return (
        <form
            action="/api/leads"
            method="post"
            className="flex flex-col sm:flex-row gap-2 max-w-md"
            aria-label="Suscripción al directorio de inversores"
        >
            {/* Honeypot for bots */}
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
                className="flex-1 bg-transparent border-0 border-b border-white/15 text-white placeholder:text-white/30 rounded-none focus-visible:ring-0 focus-visible:border-gold-mid px-0 py-2 text-sm font-light"
            />
            <Button
                type="submit"
                className="brushed-gold text-sm font-bold tracking-wide px-8 py-4 rounded-2xl hover:brightness-105 hover:scale-[1.02] transition-all duration-300"
            >
                Suscribir
                <span className="ml-1.5 text-base">&rarr;</span>
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
            className="w-full bg-background pt-0 pb-4 mt-auto relative"
        >
            {/* ── Top CTA band ──
                Second primary CTA of the page. Catches the user who scrolled
                past the LeadMagnet form but is still considering. */}
            <div className="w-full border-y border-gold-500/15 bg-gradient-to-b from-zinc-950/60 to-background">
                <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="font-display text-caption font-bold uppercase tracking-eyebrow text-gold-solid">
                                Acceso Directo
                            </span>
                            <h3 className="text-display-3 text-foreground mt-3 mb-2">
                                ¿Listo para invertir?
                            </h3>
                            <p className="text-body-lg text-foreground/65 max-w-md">
                                Recibe el directorio completo con inventario
                                curado y análisis financiero por activo.
                            </p>
                        </div>
                        <div className="md:justify-self-end w-full">
                            <FooterNewsletter />
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated gold gradient border top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent pointer-events-none" />

            <FadeIn direction="up" delay={0.1}>
                <div className="max-w-7xl mx-auto px-4 pt-12">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
                        {/* Brand */}
                        <div className="md:col-span-4 space-y-4">
                            <Logo href="/" variant="full" size="md" tone="gold" />
                            <p className="text-body-sm text-foreground/60 leading-relaxed max-w-sm">
                                Plataforma digital inmobiliaria de alta gama
                                estructurada para inversores B2B y HNWI con
                                interés en el mercado mexicano.
                            </p>
                            <div className="flex gap-2 pt-2 flex-wrap">
                                {socialLinks.map((social) => {
                                    const handle = (() => {
                                        try {
                                            return new URL(social.href).pathname
                                                .replace(/^\//, "@");
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
                                            className="w-9 h-9 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/50 hover:text-gold-solid hover:border-gold-500/30 transition-all duration-300 focus-visible:text-gold-solid focus-visible:border-gold-500/30 focus-visible:outline-none"
                                            aria-label={`${social.name} (${handle})`}
                                        >
                                            <social.icon
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    );
                                })}
                                <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={`WhatsApp · ${CONTACT_CONFIG.phone}`}
                                    className="w-9 h-9 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/50 hover:text-gold-solid hover:border-gold-500/30 transition-all duration-300 focus-visible:text-gold-solid focus-visible:border-gold-500/30 focus-visible:outline-none"
                                    aria-label="WhatsApp"
                                >
                                    <MessageCircle
                                        className="w-4 h-4"
                                        aria-hidden="true"
                                    />
                                </a>
                            </div>
                        </div>

                        {/* Marcas Hijas */}
                        <div className="md:col-span-3 md:col-start-6 space-y-4">
                            <h4 className="font-display text-xs font-bold uppercase tracking-overline text-foreground/55">
                                Nuestras Marcas
                            </h4>
                            <ul className="space-y-3">
                                {brandLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="group flex flex-col"
                                        >
                                            <span className="font-display text-sm font-semibold uppercase tracking-wide text-foreground/70 group-hover:text-gold-solid transition-colors">
                                                {link.name}
                                            </span>
                                            <span className="text-caption text-foreground/45 uppercase tracking-wider">
                                                {link.desc}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal & Corp */}
                        <div className="md:col-span-2 space-y-4">
                            <h4 className="font-display text-xs font-bold uppercase tracking-overline text-foreground/55">
                                Corporativo
                            </h4>
                            <ul className="space-y-3">
                                {corpLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="font-display text-sm font-semibold uppercase tracking-wide text-foreground/70 hover:text-gold-solid transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="md:col-span-3 space-y-4">
                            <h4 className="font-display text-xs font-bold uppercase tracking-overline text-foreground/55">
                                Contacto
                            </h4>
                            <ul className="space-y-3 text-body-sm text-foreground/60">
                                <li>
                                    <a
                                        href={mapsHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group inline-flex items-start gap-2 leading-relaxed hover:text-gold-solid transition-colors"
                                    >
                                        <MapPin
                                            className="w-4 h-4 mt-0.5 text-gold-solid flex-shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="group-hover:underline">
                                            {CONTACT_CONFIG.address}
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`tel:${phoneRaw}`}
                                        className="group inline-flex items-center gap-2 hover:text-gold-solid transition-colors"
                                    >
                                        <Phone
                                            className="w-4 h-4 text-gold-solid"
                                            aria-hidden="true"
                                        />
                                        <span className="group-hover:underline">
                                            {CONTACT_CONFIG.phone}
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href={`mailto:${CONTACT_CONFIG.email}`}
                                        className="group inline-flex items-center gap-2 hover:text-gold-solid transition-colors break-all"
                                    >
                                        <Mail
                                            className="w-4 h-4 text-gold-solid flex-shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span className="group-hover:underline">
                                            {CONTACT_CONFIG.email}
                                        </span>
                                    </a>
                                </li>
                                <li className="pt-1 text-caption text-foreground/40 leading-relaxed">
                                    {CONTACT_CONFIG.hours.map((line) => (
                                        <span key={line} className="block">
                                            {line}
                                        </span>
                                    ))}
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Compliance line — required signal for institutional buyers */}
                    <p className="text-caption text-foreground/35 mb-4 max-w-3xl">
                        Cumplimiento LFPIORPI Art. 27 y disposiciones COFECE
                        aplicables. Black Capital opera como intermediario
                        inmobiliario; no presta servicios de asesoría financiera
                        ni de inversión. Toda la información publicada está
                        sujeta a disponibilidad y confirmación.
                    </p>

                    {/* Bottom bar */}
                    <div className="pt-4 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-caption text-foreground/45 tracking-wide">
                            © {new Date().getFullYear()} Black Capital.
                            Todos los derechos reservados.
                        </p>
                        <p className="text-caption text-foreground/35">
                            Hecho con discreción en México
                        </p>
                    </div>
                </div>
            </FadeIn>
        </footer>
    );
}
