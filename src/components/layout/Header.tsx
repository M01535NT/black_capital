"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    DrawerClose,
} from "@/components/ui/drawer";

const baseLinks = [
    { name: "INICIO", href: "/" },
    { name: "INVENTARIO", href: "/inventario" },
    { name: "NOSOTROS", href: "/nosotros" },
    { name: "HERRAMIENTAS", href: "/herramientas" },
];

const verticals = [
    { name: "Black Luxury", href: "/black-luxury" },
    { name: "Black Business", href: "/black-business" },
    { name: "Black Industrial", href: "/black-industrial" },
];

const attributes = [
    { name: "Legal", href: "/legal/privacidad" },
    { name: "Nosotros", href: "/nosotros" },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${scrolled
                    ? "bg-background/80 backdrop-blur-xl border-gold-500/10 shadow-[0_1px_30px_-10px] shadow-gold-500/10"
                    : "bg-transparent backdrop-blur-none border-transparent shadow-none"
                }`}
        >
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Left: Logo */}
                <div className="flex-1">
                    <Link href="/" className="inline-block">
                        <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                            BLACK <span className="text-gold-500">CORP</span>
                        </span>
                    </Link>
                </div>

                {/* Center: Desktop Navigation */}
                <nav className="hidden md:flex flex-1 justify-center gap-8">
                    {baseLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-bold tracking-widest text-foreground hover:text-gold-500 transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Right: Hamburger Menu (Drawer) */}
                <div className="flex-1 flex justify-end">
                    <Drawer direction="right">
                        <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:text-gold-500">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Abrir menú</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-80 sm:w-96 rounded-none bg-background/70 backdrop-blur-2xl border-l border-gold-500/10">
                            <div className="mx-auto w-full max-w-sm p-6 overflow-y-auto">
                                <DrawerHeader className="px-0 pt-0 text-left">
                                    <DrawerTitle className="font-display text-2xl font-bold tracking-tight text-gold-500">
                                        Navegación
                                    </DrawerTitle>
                                </DrawerHeader>

                                <div className="py-6 space-y-8">
                                    {/* Mobile Base Links (hidden on desktop) */}
                                    <div className="md:hidden space-y-4">
                                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                                            Menú Principal
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                            {baseLinks.map((link) => (
                                                <Link key={link.name} href={link.href} className="text-lg font-bold hover:text-gold-500">
                                                    <DrawerClose asChild>
                                                        <span>{link.name}</span>
                                                    </DrawerClose>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Verticales */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                                            Nuestras Marcas
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                            {verticals.map((link) => (
                                                <Link key={link.name} href={link.href} className="text-lg font-bold text-foreground hover:text-gold-500">
                                                    <DrawerClose asChild>
                                                        <span>{link.name}</span>
                                                    </DrawerClose>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Atributos */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                                            Corporativo
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                            {attributes.map((link) => (
                                                <Link key={link.name} href={link.href} className="text-lg font-bold text-foreground hover:text-gold-500">
                                                    <DrawerClose asChild>
                                                        <span>{link.name}</span>
                                                    </DrawerClose>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>
        </header>
    );
}
