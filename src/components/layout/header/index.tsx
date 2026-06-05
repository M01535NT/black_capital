"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../Logo";
import { cn } from "@/lib/utils";
import { baseLinks, DESKTOP_DROPDOWNS, navLinkBase, navLinkActive } from "./constants";
import { NavDropdown } from "./desktop-nav";
import { MobileDrawer } from "./mobile-drawer";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-4 left-4 right-4 max-w-7xl mx-auto z-50",
        "px-4 md:px-6 py-2.5 flex items-center justify-between gap-2",
        "bg-black/70 backdrop-blur-xl border border-white/10 rounded-full",
        "transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled &&
          "bg-black/90 border-gold-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-saturate-150",
      )}
      role="banner"
    >
      <Logo href="/" variant="mark" size="md" tone="gold" className="flex-shrink-0" />

      {/* Desktop Navigation */}
      <nav aria-label="Menu principal" className="hidden lg:flex items-center gap-6">
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

      {/* Right: Contacto CTA + Hamburger */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href="/contacto"
          className="hidden lg:inline-flex items-center gap-2 px-5 py-2 border border-gold-500/40 rounded-2xl text-gold-solid text-xs font-semibold uppercase tracking-wider hover:bg-gold-solid hover:text-black transition-all duration-300"
        >
          Contacto
        </Link>

        <MobileDrawer pathname={pathname} />
      </div>
    </header>
  );
}
