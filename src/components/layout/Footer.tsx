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
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent"
            />
            {/* ═══════ FOOTER PROPIAMENTE ═══════ */}
            <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 pt-12 pb-8 sm:pt-16">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-10 lg:gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-4 space-y-5">
                        <Logo href="/" variant="full" size="md" tone="gold" />
                        <p className="text-body max-w-sm">
                            Inmobiliaria en Tijuana para activos residenciales, comerciales e industriales. Te ayudamos a ordenar precio, zona, documentos y ruta de cierre.
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
                        <h4 className="footer-heading-type text-white/55">
                            Marcas
                        </h4>
                        <ul className="space-y-3">
                            {brandLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex flex-col">
                                        <span className="footer-link-type group-hover:text-[var(--color-accent)] transition-colors">
                                            {link.name}
                                        </span>
                                        <span className="footer-legal-type mt-0.5">
                                            {link.desc}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Corporativo */}
                    <div className="col-span-1 md:col-span-2 space-y-5">
                        <h4 className="footer-heading-type text-white/55">
                            Corporativo
                        </h4>
                        <ul className="space-y-3">
                            {corpLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="footer-link-type hover:text-[var(--color-accent)] transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="col-span-2 md:col-span-3 space-y-5">
                        <h4 className="footer-heading-type text-white/55">
                            Contacto
                        </h4>
                        <ul className="space-y-3 footer-link-type text-white/55 leading-relaxed">
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
                                <li className="pt-1 footer-legal-type text-white/35 leading-relaxed">
                                    {CONTACT_CONFIG.hours.map((line) => (
                                        <span key={line} className="block">{line}</span>
                                    ))}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Compliance */}
                <p className="footer-legal-type mb-6 max-w-3xl leading-relaxed text-white/55">
                    Cumplimiento LFPIORPI Art. 27 y disposiciones COFECE aplicables. Black Capital opera como intermediario inmobiliario; no presta servicios de asesoría financiera ni de inversión. Toda la información publicada está sujeta a disponibilidad y confirmación.
                </p>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="footer-legal-type text-white/40">
                        © {new Date().getFullYear()} Black Capital. Todos los derechos reservados.
                    </p>
                    <p className="footer-legal-type text-white/30">
                        Representación inmobiliaria profesional
                    </p>
                </div>
            </div>
        </footer>
    );
}
