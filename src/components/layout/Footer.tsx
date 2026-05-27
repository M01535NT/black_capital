"use client";

import Link from "next/link";
import { Linkedin, Instagram, Twitter } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";
import { CONTACT_CONFIG } from "@/lib/contact-config";

const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: CONTACT_CONFIG.social.linkedin },
    { name: "Instagram", icon: Instagram, href: CONTACT_CONFIG.social.instagram },
    { name: "X", icon: Twitter, href: CONTACT_CONFIG.social.x },
];

const brandLinks = [
    { name: "Black Luxury", href: "/black-luxury", desc: "Residencial" },
    { name: "Black Business", href: "/black-business", desc: "Comercial" },
    { name: "Black Industrial", href: "/black-industrial", desc: "Industrial" },
];

const corpLinks = [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Herramientas", href: "/herramientas" },
    { name: "Aviso de Privacidad", href: "/legal/privacidad" },
    { name: "Panel Admin", href: "/admin" },
];

export function Footer() {
    return (
        <footer className="w-full bg-background pt-10 pb-4 mt-auto relative">
            {/* Animated gold gradient border top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

            <FadeIn direction="up" delay={0.1}>
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
                        {/* Brand */}
                        <div className="md:col-span-4 space-y-2">
                            <Link href="/" className="inline-block">
                                <span className="font-display font-bold text-xl tracking-tight text-foreground">
                                    BLACK <span className="text-gold-500">CORP</span>
                                </span>
                            </Link>
                            <p className="body-small text-foreground/60 leading-relaxed max-w-sm">
                                Plataforma digital inmobiliaria de alta gama estructurada para inversores B2B y HNWI con interés en el mercado mexicano.
                            </p>
                            <div className="flex gap-4 pt-2">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/40 hover:text-gold-500 hover:border-gold-500/30 transition-all duration-300"
                                        aria-label={social.name}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Marcas Hijas */}
                        <div className="md:col-span-3 md:col-start-6 space-y-2">
                            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                                Nuestras Marcas
                            </h4>
                            <ul className="space-y-2">
                                {brandLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="group flex flex-col">
                                            <span className="font-display text-sm font-semibold uppercase tracking-wide text-foreground/70 group-hover:text-gold-500 transition-colors">
                                                {link.name}
                                            </span>
                                            <span className="text-xs text-foreground/40 uppercase tracking-wider">
                                                {link.desc}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal & Corp */}
                        <div className="md:col-span-2 space-y-4">
                            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                                Corporativo
                            </h4>
                            <ul className="space-y-4">
                                {corpLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="font-display text-sm font-semibold uppercase tracking-wide text-foreground/70 hover:text-gold-500 transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="md:col-span-3 space-y-4">
                            <h4 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                                Contacto
                            </h4>
                            <ul className="space-y-4 body-small text-foreground/60">
                                <li className="leading-relaxed">{CONTACT_CONFIG.address}</li>
                                <li>{CONTACT_CONFIG.phone}</li>
                                <li className="hover:text-gold-500 transition-colors cursor-pointer">{CONTACT_CONFIG.email}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="pt-4 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-foreground/40 tracking-wide">
                            &copy; {new Date().getFullYear()} Black Corporativo. Todos los derechos reservados.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/legal/privacidad" className="text-xs text-foreground/40 hover:text-gold-500 transition-colors uppercase tracking-wider">
                                Privacidad
                            </Link>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </footer>
    );
}
