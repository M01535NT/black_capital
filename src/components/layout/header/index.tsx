"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { NavOverlay } from "./nav-overlay";

/**
 * Navbar editorial con menú por hamburguesa en TODOS los dispositivos (firma de
 * marca conservada). La barra es glass translúcida; al hacer scroll (>24px) se
 * solidifica y aparece el hairline dorado inferior. La hamburguesa abre un
 * overlay full-screen animado (framer-motion) con la navegación completa.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "bg-background/80 backdrop-blur-xl" : "bg-background/30 backdrop-blur-md",
        )}
        role="banner"
      >
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-4 px-6 sm:px-10 lg:h-[4.5rem] lg:px-16">
          <Logo href="/" variant="mark" size="md" tone="gold" className="flex-shrink-0" />

          <div className="flex flex-shrink-0 items-center gap-3">
            <a
              href={`tel:${CONTACT_CONFIG.phoneRaw}`}
              className="group hidden items-center gap-2 text-white/65 transition-colors duration-300 hover:text-[var(--color-accent)] xl:inline-flex"
              aria-label={`Llamar al ${CONTACT_CONFIG.phone}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="property-tag-type tabular-nums">{CONTACT_CONFIG.phone}</span>
            </a>

            <span aria-hidden="true" className="hidden h-5 w-px bg-white/12 xl:block" />

            <Link
              href="/contacto"
              className="premium-cta brushed-gold font-display hidden items-center gap-2 rounded-none transition-transform duration-300 hover:scale-[1.015] sm:inline-flex"
            >
              <span>Asesoría</span>
              <span aria-hidden="true">→</span>
            </Link>

            {/* Hamburguesa — visible en TODOS los dispositivos (firma) */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Abrir navegación"
              aria-expanded={open}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center overflow-hidden border transition-colors duration-300",
                "border-white/12 text-foreground hover:border-[var(--color-accent)]/55 hover:bg-white/[0.06]",
              )}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-10"
              />
              <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
                <span className="h-px w-5 bg-current transition-transform duration-300 group-hover:translate-x-0.5" />
                <span className="h-px w-3.5 self-end bg-current transition-[width] duration-200 ease-out group-hover:w-5" />
                <span className="h-px w-5 bg-current transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>
        </div>

        <div
          aria-hidden="true"
          className={cn(
            "h-px w-full bg-gradient-to-r from-transparent via-[var(--color-accent)]/45 to-transparent transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />
      </header>

      <AnimatePresence>
        {open && <NavOverlay onClose={() => setOpen(false)} isActive={isActive} />}
      </AnimatePresence>
    </>
  );
}
