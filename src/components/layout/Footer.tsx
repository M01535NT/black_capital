"use client";

import Link from "next/link";
import { Linkedin, Instagram, Twitter } from "lucide-react";
import { FadeIn } from "@/components/ui/motion";

const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "X", icon: Twitter, href: "#" },
];

export function Footer() {
    return (
        <footer className="w-full bg-background py-12 mt-auto relative">
            {/* Animated gold gradient border top */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

            <FadeIn direction="up" delay={0.1}>
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                                BLACK <span className="text-gold-500">CORP</span>
                            </span>
                        </Link>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                            Plataforma digital inmobiliaria de alta gama estructurada para inversores B2B y HNWI con interés en el mercado mexicano.
                        </p>
                    </div>

                    {/* Marcas Hijas */}
                    <div className="space-y-4">
                        <h4 className="font-bold tracking-widest text-sm uppercase text-foreground">Nuestras Marcas</h4>
                        <ul className="space-y-2">
                            <li><Link href="/black-luxury" className="text-sm text-foreground/70 hover:text-gold-500 transition-colors">Black Luxury (Residencial)</Link></li>
                            <li><Link href="/black-business" className="text-sm text-foreground/70 hover:text-gold-500 transition-colors">Black Business (Comercial)</Link></li>
                            <li><Link href="/black-industrial" className="text-sm text-foreground/70 hover:text-gold-500 transition-colors">Black Industrial</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Corp */}
                    <div className="space-y-4">
                        <h4 className="font-bold tracking-widest text-sm uppercase text-foreground">Corporativo</h4>
                        <ul className="space-y-2">
                            <li><Link href="/nosotros" className="text-sm text-foreground/70 hover:text-gold-500 transition-colors">Nosotros</Link></li>
                            <li><Link href="/herramientas" className="text-sm text-foreground/70 hover:text-gold-500 transition-colors">Herramientas Inversionistas</Link></li>
                            <li><Link href="/legal/privacidad" className="text-sm text-foreground/70 hover:text-gold-500 transition-colors">Aviso de Privacidad</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-bold tracking-widest text-sm uppercase text-foreground">Contacto</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                            <li>Corporativo Torre XYZ, CDMX.</li>
                            <li>+52 (55) 1234 5678</li>
                            <li>contacto@blackcorporativo.com</li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-4 mt-12 pt-8 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center text-xs text-foreground/50">
                    <p>&copy; {new Date().getFullYear()} Black Corporativo. Todos los derechos reservados.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        {socialLinks.map((social) => (
                            <a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground/50 hover:text-gold-500 transition-colors"
                                aria-label={social.name}
                            >
                                <social.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                </div>
            </FadeIn>
        </footer>
    );
}
