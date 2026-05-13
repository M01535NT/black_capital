"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, Home, Building2, Warehouse, Calculator, ArrowRightLeft, Percent, Phone } from "lucide-react";
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
    { name: "PROYECTOS", href: "/inventario" },
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

const attributes = [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Aviso de Privacidad", href: "/legal/privacidad" },
    { name: "Panel Admin", href: "/admin" },
];

export function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
                    <nav className="hidden lg:flex items-center gap-5" ref={dropdownRef}>
                        {baseLinks.map((link) => (
                            <span key={link.name} className="nav-item">
                                <Link href={link.href} className="nav-link">
                                    {link.name}
                                </Link>
                            </span>
                        ))}

                        {/* Venta Dropdown */}
                        <span className="nav-item has-dropdown">
                            <Link
                                href="/inventario?tipo=venta"
                                className="nav-link"
                                onMouseEnter={() => setOpenDropdown("venta")}
                            >
                                Venta
                            </Link>
                            {openDropdown === "venta" && (
                                <div className="nav-dropdown backdrop-blur-2xl" onMouseLeave={() => setOpenDropdown(null)}>
                                    {ventaDropdown.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="nav-dropdown-link"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <item.icon className="w-4 h-4 text-gold-solid" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </span>

                        {/* Renta Dropdown */}
                        <span className="nav-item has-dropdown">
                            <Link
                                href="/inventario?tipo=renta"
                                className="nav-link"
                                onMouseEnter={() => setOpenDropdown("renta")}
                            >
                                Renta
                            </Link>
                            {openDropdown === "renta" && (
                                <div className="nav-dropdown backdrop-blur-2xl" onMouseLeave={() => setOpenDropdown(null)}>
                                    {rentaDropdown.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="nav-dropdown-link"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <item.icon className="w-4 h-4 text-gold-solid" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </span>

                        {/* Herramientas Dropdown */}
                        <span className="nav-item has-dropdown">
                            <Link
                                href="/herramientas"
                                className="nav-link"
                                onMouseEnter={() => setOpenDropdown("herramientas")}
                            >
                                Herramientas
                            </Link>
                            {openDropdown === "herramientas" && (
                                <div className="nav-dropdown backdrop-blur-2xl" onMouseLeave={() => setOpenDropdown(null)}>
                                    {herramientasDropdown.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="nav-dropdown-link"
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <item.icon className="w-4 h-4 text-gold-solid" />
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </span>
                    </nav>

                    {/* Right: Contacto Button + Hamburger */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Link href="/contacto" className="nav-btn-gold hidden lg:inline-flex">
                            <Phone className="w-3.5 h-3.5" />
                            Contacto
                        </Link>

                        <Drawer direction="right">
                            <DrawerTrigger asChild>
                                <Button variant="ghost" size="icon" className="hover:text-gold-solid text-foreground">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Abrir menú</span>
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-80 sm:w-96 rounded-none bg-background/70 backdrop-blur-2xl border-l border-gold-solid/10">
                                <div className="mx-auto w-full max-w-sm p-6 overflow-y-auto">
                                    <DrawerHeader className="px-0 pt-0 text-left">
                                        <DrawerTitle className="font-display text-2xl font-bold tracking-tight text-gold-solid">
                                            Navegación
                                        </DrawerTitle>
                                    </DrawerHeader>

                                    <div className="py-6 space-y-8">
                                        {/* Mobile Base Links */}
                                        <div className="lg:hidden space-y-4">
                                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                                                Menú Principal
                                            </h3>
                                            <div className="flex flex-col gap-4">
                                                {baseLinks.map((link) => (
                                                    <Link key={link.name} href={link.href} className="text-lg font-bold hover:text-gold-solid transition-colors">
                                                        <DrawerClose asChild>
                                                            <span>{link.name}</span>
                                                        </DrawerClose>
                                                    </Link>
                                                ))}
                                                <Link href="/inventario?tipo=venta" className="text-lg font-bold hover:text-gold-solid transition-colors">
                                                    <DrawerClose asChild><span>Venta</span></DrawerClose>
                                                </Link>
                                                <Link href="/inventario?tipo=renta" className="text-lg font-bold hover:text-gold-solid transition-colors">
                                                    <DrawerClose asChild><span>Renta</span></DrawerClose>
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Verticales */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                                                Nuestras Marcas
                                            </h3>
                                            <div className="flex flex-col gap-4">
                                                {verticals.map((link) => (
                                                    <Link key={link.name} href={link.href} className="group">
                                                        <DrawerClose asChild>
                                                            <div>
                                                                <span className="text-lg font-bold text-foreground group-hover:text-gold-solid transition-colors">
                                                                    {link.name}
                                                                </span>
                                                                <p className="text-xs text-foreground/50 mt-0.5">{link.desc}</p>
                                                            </div>
                                                        </DrawerClose>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Herramientas */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                                                Herramientas
                                            </h3>
                                            <div className="flex flex-col gap-3">
                                                {herramientasDropdown.map((item) => (
                                                    <Link key={item.name} href={item.href} className="flex items-center gap-3 text-sm font-medium text-foreground/80 hover:text-gold-solid transition-colors">
                                                        <DrawerClose asChild>
                                                            <span className="flex items-center gap-3">
                                                                <item.icon className="w-4 h-4 text-gold-solid" />
                                                                {item.name}
                                                            </span>
                                                        </DrawerClose>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Corporativo */}
                                        <div className="space-y-4">
                                            <h3 className="text-sm tracking-widest text-foreground/50 font-bold uppercase mb-4">
                                                Corporativo
                                            </h3>
                                            <div className="flex flex-col gap-3">
                                                {attributes.map((link) => (
                                                    <Link key={link.name} href={link.href} className="text-sm font-medium text-foreground/80 hover:text-gold-solid transition-colors">
                                                        <DrawerClose asChild>
                                                            <span>{link.name}</span>
                                                        </DrawerClose>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Contacto CTA en mobile */}
                                        <div className="lg:hidden pt-4">
                                            <Link href="/contacto" className="flex items-center justify-center gap-2 w-full py-3 px-6 border border-gold-solid rounded-full text-gold-solid font-semibold text-sm hover:bg-gold-solid hover:text-black transition-all">
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
