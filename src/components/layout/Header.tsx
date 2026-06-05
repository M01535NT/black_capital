"use client";

import { useState, useEffect, useRef, useCallback, KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    Home,
    Building2,
    Warehouse,
    Calculator,
    ArrowRightLeft,
    Percent,
    Phone,
    ChevronDown,
} from "lucide-react";
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

/* ── Accessible dropdown component ──────────────────────────────────── */

type DropdownKey = "venta" | "renta" | "herramientas";

interface DropdownDef {
    key: DropdownKey;
    label: string;
    href: string;
    items: { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const DESKTOP_DROPDOWNS: DropdownDef[] = [
    { key: "venta", label: "Venta", href: "/inventario?tipo=Venta", items: ventaDropdown },
    { key: "renta", label: "Renta", href: "/inventario?tipo=Renta", items: rentaDropdown },
    { key: "herramientas", label: "Herramientas", href: "/herramientas", items: herramientasDropdown },
];

function NavDropdown({
    def,
    isOpen,
    onOpen,
    onClose,
    isActive,
}: {
    def: DropdownDef;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    isActive: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLAnchorElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelClose = useCallback(() => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    }, []);

    const scheduleClose = useCallback(() => {
        cancelClose();
        closeTimer.current = setTimeout(onClose, 150);
    }, [cancelClose, onClose]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    // Close on Escape and return focus to trigger
    const onKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
        if (e.key === "Escape" && isOpen) {
            e.preventDefault();
            onClose();
            triggerRef.current?.focus();
        }
    };

    const navLinkBase =
        "font-display text-xs font-bold uppercase tracking-card text-foreground/80 hover:text-gold-solid transition-colors duration-300 relative py-1 inline-flex items-center gap-1";
    const navLinkActive =
        "text-gold-solid after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-gold-500 after:to-gold-700 after:rounded-sm";

    return (
        <div
            ref={containerRef}
            className="relative"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
        >
            <Link
                ref={triggerRef}
                href={def.href}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                onClick={(e) => {
                    // Toggle on click for keyboard/touch users; let the link
                    // navigate if the user clicks the label area itself.
                    if (!isOpen) {
                        e.preventDefault();
                        onOpen();
                    }
                }}
                onFocus={onOpen}
                onKeyDown={onKeyDown}
                className={cn(navLinkBase, isActive && navLinkActive)}
            >
                {def.label}
                <ChevronDown
                    className={cn(
                        "w-3 h-3 transition-transform duration-200",
                        isOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                />
            </Link>
            {isOpen && (
                <div
                    role="menu"
                    aria-label={def.label}
                    className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2 min-w-[220px] bg-[rgba(26,26,26,0.95)] border border-white/10 rounded-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl z-50"
                >
                    {def.items.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                role="menuitem"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground rounded-xl transition-all duration-300 hover:bg-gold-500/10 hover:text-gold-solid hover:pl-5 focus-visible:bg-gold-500/10 focus-visible:text-gold-solid focus-visible:outline-none"
                                onClick={onClose}
                            >
                                <Icon
                                    className="w-4 h-4 text-gold-solid"
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

/* ── Main Header ────────────────────────────────────────────────────── */

export function Header() {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close any open dropdown on route change.
    useEffect(() => {
        setOpenDropdown(null);
    }, [pathname]);

    const navLinkBase =
        "font-display text-xs font-bold uppercase tracking-card text-foreground/80 hover:text-gold-solid transition-colors duration-300 relative py-1";
    const navLinkActive =
        "text-gold-solid after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-gold-500 after:to-gold-700 after:rounded-sm";

    return (
        <header
            className={cn(
                "fixed top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-50",
                "px-4 md:px-6 py-2 flex items-center justify-between gap-2",
                "bg-black/75 backdrop-blur-xl border border-white/10 rounded-full",
                "transition-[background-color,border-color,box-shadow] duration-300",
                scrolled &&
                    "bg-black/92 border-gold-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)]",
            )}
            role="banner"
        >
            {/* Left: Logo */}
            <Link
                href="/"
                className="flex-shrink-0"
                aria-label="Black Corporativo — Inicio"
            >
                <span className="font-display font-bold text-lg md:text-xl tracking-tight text-foreground whitespace-nowrap">
                    BLACK <span className="text-gold-solid">CORP</span>
                </span>
            </Link>

            {/* Center: Desktop Navigation */}
            <nav
                ref={navRef}
                aria-label="Menú principal"
                className="hidden lg:flex items-center gap-6"
            >
                {baseLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={cn(navLinkBase, isActive(link.href) && navLinkActive)}
                    >
                        {link.name}
                    </Link>
                ))}

                {DESKTOP_DROPDOWNS.map((def) => (
                    <NavDropdown
                        key={def.key}
                        def={def}
                        isOpen={openDropdown === def.key}
                        onOpen={() => setOpenDropdown(def.key)}
                        onClose={() =>
                            setOpenDropdown((curr) => (curr === def.key ? null : curr))
                        }
                        isActive={
                            isActive(def.href) ||
                            (def.key === openDropdown && isActive("/inventario"))
                        }
                    />
                ))}
            </nav>

            {/* Right: Contacto + Hamburger */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                    href="/contacto"
                    className="hidden lg:inline-flex items-center gap-2 px-5 py-2 border border-gold-solid rounded-full text-gold-solid text-xs font-display font-bold uppercase tracking-wider hover:bg-gold-solid hover:text-black transition-all duration-300"
                >
                    <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                    Contacto
                </Link>

                <Drawer
                    direction="right"
                    open={drawerOpen}
                    onOpenChange={setDrawerOpen}
                >
                    <DrawerTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:text-gold-solid text-foreground"
                            aria-label="Abrir menú de navegación"
                            aria-expanded={drawerOpen}
                        >
                            <Menu className="h-5 w-5" aria-hidden="true" />
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
                                    <h3 className="text-caption text-foreground/50 mb-4 uppercase font-sans font-bold tracking-overline">
                                        Menú Principal
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {baseLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className={cn(
                                                    "font-display text-lg font-bold uppercase tracking-wide hover:text-gold-solid transition-colors focus-visible:text-gold-solid focus-visible:outline-none",
                                                    isActive(link.href)
                                                        ? "text-gold-solid"
                                                        : "text-foreground",
                                                )}
                                                onClick={() => setDrawerOpen(false)}
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                        <Link
                                            href="/inventario?tipo=Venta"
                                            className="font-display text-lg font-bold uppercase tracking-wide text-foreground hover:text-gold-solid transition-colors focus-visible:text-gold-solid focus-visible:outline-none"
                                            onClick={() => setDrawerOpen(false)}
                                        >
                                            Venta
                                        </Link>
                                        <Link
                                            href="/inventario?tipo=Renta"
                                            className="font-display text-lg font-bold uppercase tracking-wide text-foreground hover:text-gold-solid transition-colors focus-visible:text-gold-solid focus-visible:outline-none"
                                            onClick={() => setDrawerOpen(false)}
                                        >
                                            Renta
                                        </Link>
                                    </div>
                                </div>

                                {/* Verticales */}
                                <div className="space-y-4">
                                    <h3 className="text-caption text-foreground/50 mb-4 uppercase font-sans font-bold tracking-overline">
                                        Nuestras Marcas
                                    </h3>
                                    <div className="flex flex-col gap-4">
                                        {verticals.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className="group focus-visible:outline-none"
                                                onClick={() => setDrawerOpen(false)}
                                            >
                                                <span
                                                    className={cn(
                                                        "font-display text-lg font-bold tracking-wide transition-colors",
                                                        isActive(link.href)
                                                            ? "text-gold-solid"
                                                            : "text-foreground group-hover:text-gold-solid",
                                                    )}
                                                >
                                                    {link.name}
                                                </span>
                                                <p className="text-xs text-foreground/50 mt-0.5">
                                                    {link.desc}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Herramientas */}
                                <div className="space-y-4">
                                    <h3 className="text-caption text-foreground/50 mb-4 uppercase font-sans font-bold tracking-overline">
                                        Herramientas
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {herramientasDropdown.map((item) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-center gap-3 text-sm font-medium text-foreground/80 hover:text-gold-solid transition-colors focus-visible:text-gold-solid focus-visible:outline-none"
                                                    onClick={() => setDrawerOpen(false)}
                                                >
                                                    <Icon
                                                        className="w-4 h-4 text-gold-solid"
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Corporativo */}
                                <div className="space-y-4">
                                    <h3 className="text-caption text-foreground/50 mb-4 uppercase font-sans font-bold tracking-overline">
                                        Corporativo
                                    </h3>
                                    <div className="flex flex-col gap-3">
                                        {corporativoLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                className={cn(
                                                    "text-sm font-medium transition-colors focus-visible:outline-none",
                                                    isActive(link.href)
                                                        ? "text-gold-solid"
                                                        : "text-foreground/80 hover:text-gold-solid",
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
                                        className="flex items-center justify-center gap-2 w-full py-3 px-6 border border-gold-solid rounded-full text-gold-solid font-semibold text-sm hover:bg-gold-solid hover:text-black transition-all focus-visible:bg-gold-solid focus-visible:text-black focus-visible:outline-none"
                                        onClick={() => setDrawerOpen(false)}
                                    >
                                        <Phone
                                            className="w-4 h-4"
                                            aria-hidden="true"
                                        />
                                        Contactar
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </header>
    );
}
