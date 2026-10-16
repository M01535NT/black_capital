import Link from "next/link";
import { brandFont } from "@/lib/brand-font";
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
import { getSiteSettings } from "@/lib/site-settings";
import { contactFromSettings } from "@/lib/site-settings-schema";
import { CONTACT_CONFIG } from "@/lib/contact-config";

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
    { name: "Propiedades", href: "/inventario" },
    { name: "Para propietarios", href: "/propietarios" },
    { name: "Nosotros", href: "/nosotros" },
    { name: "Herramientas", href: "/herramientas" },
    { name: "Aviso de Privacidad", href: "/legal/aviso-privacidad" },
    { name: "Términos de Uso", href: "/legal/terminos-condiciones" },
];

export async function Footer() {
    const CONTACT_CONFIG = contactFromSettings(await getSiteSettings());
    const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_CONFIG.address)}`;
    const phoneRaw = CONTACT_CONFIG.phoneRaw;
    const whatsappHref = `https://wa.me/${phoneRaw}?text=${encodeURIComponent(
        CONTACT_CONFIG.whatsAppTemplate,
    )}`;

    return (
        <footer
            role="contentinfo"
            aria-label="Pie de página"
            className={`${brandFont.className} relative mt-auto w-full overflow-hidden border-t border-[#d2a73c]/30 bg-[#080808]`}
        >
            <div className="relative mx-auto max-w-[90rem] px-6 pb-8 pt-16 sm:px-10 sm:pt-20 lg:px-16">
                <div
                    className="mb-16 grid grid-cols-2 gap-10 md:grid-cols-12 lg:gap-12"
                >
                    {/* Brand */}
                    <div className="col-span-2 space-y-5 md:col-span-4">
                        <Logo href="/" variant="full" size="md" tone="gold" />
                        <p className="max-w-sm text-base leading-[1.8] text-white/60">
                            Representación inmobiliaria en Tijuana. Residencial, comercial e industrial.
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
                                        className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/50 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] focus-visible:border-[var(--color-accent)]/40 focus-visible:text-[var(--color-accent)] focus-visible:outline-none sm:h-11 sm:w-11"
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
                                className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/50 transition-colors duration-200 ease-out hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)] focus-visible:border-[var(--color-accent)]/40 focus-visible:text-[var(--color-accent)] focus-visible:outline-none sm:h-11 sm:w-11"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Marcas */}
                    <div className="col-span-1 space-y-5 md:col-span-3">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2a73c]">Marcas</h4>
                        <ul className="space-y-3">
                            {brandLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex min-h-11 flex-col justify-center">
                                        <span className="text-lg font-semibold uppercase tracking-[0.04em] text-[#f5f2eb] transition-colors group-hover:text-[var(--color-accent)]">
                                            {link.name}
                                        </span>
                                        <span className="mt-0.5 text-xs uppercase tracking-[0.14em] text-white/45">{link.desc}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Corporativo */}
                    <div className="col-span-1 space-y-5 md:col-span-2">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2a73c]">Corporativo</h4>
                        <ul className="space-y-3">
                            {corpLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="inline-flex min-h-11 items-center text-sm uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-[var(--color-accent)]"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div className="col-span-2 space-y-5 md:col-span-3">
                        <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d2a73c]">Contacto</h4>
                        <ul className="space-y-3 text-sm leading-relaxed text-white/65">
                            <li>
                                <a
                                    href={mapsHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group inline-flex min-h-11 items-start gap-2 transition-colors hover:text-[var(--color-accent)]"
                                >
                                    <MapPin className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                                    <span className="group-hover:underline">{CONTACT_CONFIG.address}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`tel:+${phoneRaw}`}
                                    className="group inline-flex min-h-11 items-center gap-2 transition-colors hover:text-[var(--color-accent)]"
                                >
                                    <Phone className="h-3.5 w-3.5 text-[var(--color-accent)]" aria-hidden="true" />
                                    <span className="tabular-nums group-hover:underline">{CONTACT_CONFIG.phone}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${CONTACT_CONFIG.email}`}
                                    className="group inline-flex min-h-11 items-center gap-2 break-all transition-colors hover:text-[var(--color-accent)]"
                                >
                                    <Mail className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-accent)]" aria-hidden="true" />
                                    <span className="group-hover:underline">{CONTACT_CONFIG.email}</span>
                                </a>
                            </li>
                            <li className="pt-1 text-xs leading-relaxed text-white/45">
                                {CONTACT_CONFIG.hours.map((line) => (
                                    <span key={line} className="block">{line}</span>
                                ))}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Compliance */}
                <p className="mb-6 max-w-3xl text-xs leading-relaxed text-white/50">
                    Cumplimiento LFPIORPI Art. 27 y disposiciones COFECE aplicables. Black Capital opera como intermediario inmobiliario; no presta servicios de asesoría financiera ni de inversión. Toda la información publicada está sujeta a disponibilidad y confirmación.
                </p>

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 md:flex-row">
                    <p className="text-xs tracking-[0.02em] text-white/50">
                        © {new Date().getFullYear()} Black Capital. Todos los derechos reservados.
                    </p>
                    <p className="text-xs uppercase tracking-[0.1em] text-white/40">
                        Representación inmobiliaria profesional
                    </p>
                </div>
            </div>
        </footer>
    );
}
