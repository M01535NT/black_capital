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
import { Reveal } from "@/components/home/_motion";
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
    { name: "Aviso de Privacidad", href: "/legal/aviso-privacidad" },
    { name: "Términos de Uso", href: "/legal/terminos-condiciones" },
];

export function Footer() {
    const phoneRaw = CONTACT_CONFIG.phoneRaw;
    const whatsappHref = `https://wa.me/${phoneRaw}?text=${encodeURIComponent(
        "Hola, me gustaría recibir información sobre propiedades en Tijuana.",
    )}`;

    return (
        <footer
            role="contentinfo"
            aria-label="Pie de página"
            className="relative mt-auto w-full overflow-hidden bg-background"
        >
            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)]/35 to-transparent"
            />
            {/* Halo dorado ambiental */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-52 left-1/2 h-[32rem] w-[46rem] -translate-x-1/2 rounded-full opacity-[0.05] blur-[110px]"
                style={{ background: "var(--gradient-gold)" }}
            />

            <div className="relative mx-auto max-w-[90rem] px-6 pb-8 pt-16 sm:px-10 sm:pt-20 lg:px-16">
                {/* Franja-statement */}
                <Reveal className="mb-14 flex flex-col gap-6 border-b border-white/[0.06] pb-12 lg:flex-row lg:items-end lg:justify-between">
                    <p className="max-w-3xl text-[clamp(1.6rem,4vw,3rem)] font-extrabold uppercase leading-[1.04] tracking-headline text-white">
                        Bienes raíces{" "}
                        <span className="gold-ink">con criterio</span>.
                    </p>
                    <p className="property-tag-type text-white/40 lg:text-right">
                        Residencial · Comercial · Industrial
                    </p>
                </Reveal>

                <Reveal
                    y={18}
                    className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-12 lg:gap-12"
                >
                    {/* Brand */}
                    <div className="col-span-2 space-y-5 md:col-span-4">
                        <Logo href="/" variant="full" size="md" tone="gold" />
                        <p className="max-w-sm text-body">
                            Inmobiliaria en Tijuana para activos residenciales, comerciales e industriales. Ponemos en orden precio, zona, documentos y ruta de cierre antes de que avances.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
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
                                        className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] focus-visible:border-[var(--color-accent)]/40 focus-visible:text-[var(--color-accent)] focus-visible:outline-none sm:h-9 sm:w-9"
                                        aria-label={`${social.name} (${handle})`}
                                    >
                                        <social.icon className="h-4 w-4" aria-hidden="true" />
                                    </a>
                                );
                            })}
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`WhatsApp · ${CONTACT_CONFIG.phone}`}
                                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/50 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] focus-visible:border-[var(--color-accent)]/40 focus-visible:text-[var(--color-accent)] focus-visible:outline-none sm:h-9 sm:w-9"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Marcas */}
                    <div className="col-span-1 space-y-5 md:col-span-3">
                        <h4 className="footer-heading-type text-white/55">Marcas</h4>
                        <ul className="space-y-3">
                            {brandLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex flex-col">
                                        <span className="footer-link-type transition-colors group-hover:text-[var(--color-accent)]">
                                            {link.name}
                                        </span>
                                        <span className="footer-legal-type mt-0.5">{link.desc}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Corporativo */}
                    <div className="col-span-1 space-y-5 md:col-span-2">
                        <h4 className="footer-heading-type text-white/55">Corporativo</h4>
                        <ul className="space-y-3">
                            {corpLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="footer-link-type transition-colors hover:text-[var(--color-accent)]"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="col-span-2 space-y-5 md:col-span-3">
                        <h4 className="footer-heading-type text-white/55">Contacto</h4>
                        <ul className="footer-link-type space-y-3 leading-relaxed text-white/55">
                            <li>
                                <a
                                    href={mapsHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex items-start gap-2 transition-colors hover:text-[var(--color-accent)]"
                                >
                                    <MapPin className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                                    <span className="group-hover:underline">{CONTACT_CONFIG.address}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:${phoneRaw}`}
                                    className="group inline-flex items-center gap-2 transition-colors hover:text-[var(--color-accent)]"
                                >
                                    <Phone className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                    <span className="tabular-nums group-hover:underline">{CONTACT_CONFIG.phone}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${CONTACT_CONFIG.email}`}
                                    className="group inline-flex items-center gap-2 break-all transition-colors hover:text-[var(--color-accent)]"
                                >
                                    <Mail className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                                    <span className="group-hover:underline">{CONTACT_CONFIG.email}</span>
                                </a>
                            </li>
                            <li className="footer-legal-type pt-1 leading-relaxed text-white/35">
                                {CONTACT_CONFIG.hours.map((line) => (
                                    <span key={line} className="block">{line}</span>
                                ))}
                            </li>
                        </ul>
                    </div>
                </Reveal>

                {/* Compliance */}
                <p className="footer-legal-type mb-6 max-w-3xl leading-relaxed text-white/55">
                    Cumplimiento LFPIORPI Art. 27 y disposiciones COFECE aplicables. Black Capital opera como intermediario inmobiliario; no presta servicios de asesoría financiera ni de inversión. Toda la información publicada está sujeta a disponibilidad y confirmación.
                </p>

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 md:flex-row">
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
