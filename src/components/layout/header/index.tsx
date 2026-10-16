"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Grid3X3 } from "lucide-react";
import { brandFont } from "@/lib/brand-font";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";
import { SavedProperties } from "@/components/property/SavedProperties";
import { NavOverlay } from "./nav-overlay";

/** Compact editorial navigation; the same routes and touch controls on every screen. */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const closeMenu = useCallback(() => setOpen(false), []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrolled((prev) => {
          const next = window.scrollY > 24;
          return next === prev ? prev : next;
        });
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Cerrar el overlay al cambiar de ruta.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn("fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-colors duration-300", scrolled ? "bg-[#080808]/95 backdrop-blur-xl" : "bg-[#080808]")}
        role="banner"
      >
        <div className={`${brandFont.className} mx-auto flex h-16 max-w-[100rem] items-center justify-between gap-3 px-5 sm:px-8 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-10`}>
          <Logo href="/" variant="mark" size="md" tone="gold" className="shrink-0 lg:col-start-2 lg:row-start-1" />
          <nav aria-label="Accesos principales" className="hidden items-center gap-5 lg:col-start-1 lg:row-start-1 lg:flex xl:gap-7">
            {[
              { name: "Propiedades", href: "/inventario" },
              { name: "Residencial", href: "/black-luxury" },
              { name: "Comercial", href: "/black-business" },
              { name: "Industrial", href: "/black-industrial" },
            ].map(link => <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className="inline-flex min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-[#e4c078] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4c078] aria-[current=page]:text-[#e4c078]">{link.name}</Link>)}
          </nav>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:col-start-3 lg:row-start-1 lg:justify-self-end">
            <Link href="/herramientas" className="hidden min-h-11 items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-[#e4c078] xl:inline-flex">Herramientas</Link>
            <Link href="/contacto" className="hidden min-h-11 items-center px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-[#e4c078] sm:inline-flex">Contacto</Link>
            <SavedProperties compact />
            <button type="button" onClick={() => setOpen(true)} aria-label="Abrir navegación" aria-expanded={open} aria-controls="primary-navigation-dialog" className="flex h-11 w-11 items-center justify-center border border-white/20 text-[#f5f2eb] transition-colors hover:border-[#d2a73c] hover:text-[#e4c078] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e4c078]">
              <Grid3X3 className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && <NavOverlay onClose={closeMenu} isActive={isActive} />}
      </AnimatePresence>
    </>
  );
}
