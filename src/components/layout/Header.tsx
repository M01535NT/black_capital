"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, Building2, Warehouse, Calculator, ArrowRightLeft, Percent, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

const baseLinks = [
    { name: "Inicio", href: "/" },
    { name: "Proyectos", href: "/inventario" },
];

const ventaDropdown = [
    { name: "Residencial", href: "/black-luxury", icon: Home },
    { name: "Comercial", href: "/black-business", icon: Building2 },
    { name: "Industrial", href: "/black-industrial", icon: Warehouse },
];

const rentaDropdown = [
    { name: "Residencial", href: "/black-luxury", icon: Home },
    { name: "Comercial", href: "/black-business", icon: Building2 },
    { name: "Industrial", href: "/black-industrial", icon: Warehouse },
];

const herramientasDropdown = [
    { name: "Calculadora ROI", href: "/herramientas#roi", icon: Percent },
    { name: "Simulador Flipping", href: "/herramientas#flipping", icon: ArrowRightLeft },
    { name: "Calculadora ISAI", href: "/herramientas#isai", icon: Calculator },
];

const verticals = [
    { name: "Black Luxury", href: "/black-luxury", desc: "Residencias trofeo y súper lujo" },
    { name: "Black Business", href: "/black-business", desc: "Activos corporativos clase A" },
    { name: "Black Industrial", href: "/black-industrial", desc: "Naves y parques logísticos" },
];

const corporativoLinks = [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Aviso de Privacidad", href: "/legal/privacidad" },
    { name: "Panel Admin", href: "/admin" },
];

export function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMouseEnter = (key: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setOpenDropdown(key);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
    };

    const navLinkBase = "font-display text-xs font-bold uppercase tracking-[0.12em] text-foreground/80 hover:text-gold-solid transition-colors duration-300 relative py-1";
    const navLinkActive = "text-gold-solid after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-gold-500 after:to-gold-700 after:rounded-sm";

    return (
        <>
            {/* ── Pill Navbar ── */}
            <div className={`navbar-pill backdrop-blur-xl ${scrolled ? "scrolled" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                    {/* Left: Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="font-display font-bold text-lg md:text-xl tracking-tight text-foreground whitespace-nowrap">
                            BLACK <span className="text-gold-solid">CORP</span>
                        </span>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6" ref={dropdownRef}>
                        {baseLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(navLinkBase, isActive(link.href) && navLinkActive)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Venta Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter("venta")}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link
                                href="/inventario?tipo=Venta"
                                className={cn(navLinkBase, (isActive("/inventario") && openDropdown === "venta") && navLinkActive)}
                            >
                                Venta
                            </Link>
                            {openDropdown === "venta" && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2 min-w-[220px] bg-[rgba(26,26,26,0.95)] border border-white/10 rounded-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-50">
                                    {ventaDropdown.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground rounded-xl transition-all duration-300 hover:bg-gold-500/10 hover:text-gold-solid hover:pl-5"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <item.icon className="w-4 h-4 text-gold-solid" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Renta Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter("renta")}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link
                                href="/inventario?tipo=Renta"
                                className={cn(navLinkBase, (isActive("/inventario") && openDropdown === "renta") && navLinkActive)}
                            >
                                Renta
                            </Link>
                            {openDropdown === "renta" && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2 min-w-[220px] bg-[rgba(26,26,26,0.95)] border border-white/10 rounded-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-50">
                                    {rentaDropdown.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground rounded-xl transition-all duration-300 hover:bg-gold-500/10 hover:text-gold-solid hover:pl-5"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <item.icon className="w-4 h-4 text-gold-solid" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Herramientas Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => handleMouseEnter("herramientas")}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link
                                href="/herramientas"
                                className={cn(navLinkBase, isActive("/herramientas") && navLinkActive)}
                            >
                                Herramientas
                            </Link>
                            {openDropdown === "herramientas" && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2 min-w-[220px] bg-[rgba(26,26,26,0.95)] border border-white/10 rounded-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-50">
                                    {herramientasDropdown.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-foreground rounded-xl transition-all duration-300 hover:bg-gold-500/10 hover:text-gold-solid hover:pl-5"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <item.icon className="w-4 h-4 text-gold-solid" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Right: Contacto Button + Hamburger */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href="/contacto" className="nav-btn-gold hidden lg:inline-flex">
                            <Phone className="w-3.5 h-3.5" />
                            Contacto
                        </Link>

                        <Drawer direction="right" open={drawerOpen} onOpenChange={setDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:text-gold-solid text-foreground">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Abrir menú</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-80 sm:w-96 rounded-none bg-background/80 backdrop-blur-2xl border-l border-gold-solid/10">
                                <div className="mx-auto w-full max-w-sm p-6 overflow-y-auto">
                                    <DrawerHeader className="px-0 pt-0 text-left">
                                        <DrawerTitle className="font-display text-2xl font-bold tracking-tight text-gold-solid">
                                            Navegación
                                        </DrawerTitle>
                                    </DrawerHeader>

                                    <div className="py-6 space-y-8">
                                        {/* Mobile Base Links */}
                                        <div className="lg:hidden space-y-4">
                                            <h3 className="label-overline text-foreground/50 mb-4">
                                                Menú Principal
                                            </h3>
                                            <div className="flex flex-col gap-4">
                                                {baseLinks.map((link) => (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        className={cn(
                                                            "font-display text-lg font-bold uppercase tracking-wide hover:text-gold-solid transition-colors",
                                                            isActive(link.href) ? "text-gold-solid" : "text-foreground"
                                                        )}
                                                        onClick={() => setDrawerOpen(false)}
                                                    >
                                                        {link.name}
                                                    </Link>
                                                ))}
                                                <Link
                                                    href="/inventario?tipo=Venta"
                                                    className="font-display text-lg font-bold uppercase tracking-wide text-foreground hover:text-gold-solid transition-colors"
                                                    onClick={() => setDrawerOpen(false)}
                                                >
                                                    Venta
                                                </Link>
                                                <Link
                                                    href="/inventario?tipo=Renta"
                                                    className="font-display text-lg font-bold uppercase tracking-wide text-foreground hover:text-gold-solid transition-colors"
                                                    onClick={() => setDrawerOpen(false)}
                                                >
                                                    Renta
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Verticales */}
                                        <div className="space-y-4">
                                            <h3 className="label-overline text-foreground/50 mb-4">
                                                Nuestras Marcas
                                            </h3>
                                            <div className="flex flex-col gap-4">
                                                {verticals.map((link) => (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        className="group"
                                                        onClick={() => setDrawerOpen(false)}
                                                    >
                                                        <span className={cn(
                                                            "font-display text-lg font-bold tracking-wide transition-colors",
                                                            isActive(link.href) ? "text-gold-solid" : "text-foreground group-hover:text-gold-solid"
                                                        )}>
                                                            {link.name}
                                                        </span>
                                                        <p className="text-xs text-foreground/50 mt-0.5">{link.desc}</p>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Herramientas */}
                                        <div className="space-y-4">
                                            <h3 className="label-overline text-foreground/50 mb-4">
                                                Herramientas
                                            </h3>
                                            <div className="flex flex-col gap-3">
                                                {herramientasDropdown.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className="flex items-center gap-3 text-sm font-medium text-foreground/80 hover:text-gold-solid transition-colors"
                                                        onClick={() => setDrawerOpen(false)}
                                                    >
                                                        <item.icon className="w-4 h-4 text-gold-solid" />
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Corporativo */}
                                        <div className="space-y-4">
                                            <h3 className="label-overline text-foreground/50 mb-4">
                                                Corporativo
                                            </h3>
                                            <div className="flex flex-col gap-3">
                                                {corporativoLinks.map((link) => (
                                                    <Link
                                                        key={link.name}
                                                        href={link.href}
                                                        className={cn(
                                                            "text-sm font-medium transition-colors",
                                                            isActive(link.href) ? "text-gold-solid" : "text-foreground/80 hover:text-gold-solid"
                                                        )}
                                                        onClick={() => setDrawerOpen(false)}
                                                    >
                                                        {link.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contacto CTA en mobile */}
                                        <div className="lg:hidden pt-4">
                                            <Link
                                                href="/contacto"
                                                className="flex items-center justify-center gap-2 w-full py-3 px-6 border border-gold-solid rounded-full text-gold-solid font-semibold text-sm hover:bg-gold-solid hover:text-black transition-all"
                                                onClick={() => setDrawerOpen(false)}
                                            >
                                                <Phone className="w-4 h-4" />
                                                Contactar
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>
            </div>
        </>
    );
}
