"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";
import { baseLinks, DESKTOP_DROPDOWNS, navLinkBase, navLinkActive } from "./constants";
import { NavDropdown } from "./desktop-nav";
import { MobileDrawer } from "./mobile-drawer";

/**
 * Navbar minimalista flotante.
 *  - Inicial: transparente, sin borde, solo backdrop-blur sutil.
 *  - Al hacer scroll (>80px): backdrop-blur-md + border-bottom 1px gold 20%.
 *  - Logo a la izquierda, links al centro con underline animado, CTA a la derecha.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
          const next = window.scrollY > 80;
          return next === prev ? prev : next;
        });
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    // ✅ Close dropdown on route change — legitimate side-effect
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        // Floating bar full-width, top pegado a 0
        "fixed top-0 inset-x-0 z-50",
        "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        // Initial: transparente, sin borde
        !scrolled && "bg-transparent",
        // Scrolled: blur + border inferior gold 20% (1px)
        scrolled && "bg-background/70 backdrop-blur-md border-b border-accent/20",
      )}
      role="banner"
    >
      <div className="max-w-[90rem] mx-auto px-6 sm:px-10 lg:px-16 h-16 lg:h-20 flex items-center justify-between gap-4">
        <Logo href="/" variant="mark" size="md" tone="gold" className="flex-shrink-0" />

        {/* Desktop nav (center) */}
        <nav aria-label="Menu principal" className="hidden lg:flex items-center gap-8">
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
              onClose={() => setOpenDropdown((curr) => (curr === def.key ? null : curr))}
            />
          ))}
        </nav>

        {/* Right: CTA + mobile trigger */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/contacto"
            className="brushed-gold hidden lg:inline-flex items-center gap-2 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] rounded-full hover:scale-[1.015] transition-all duration-300"
          >
            <span>Asesoría</span>
            <span aria-hidden="true">→</span>
          </Link>

          <MobileDrawer pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
