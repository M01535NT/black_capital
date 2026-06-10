 "use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  baseLinks,
  verticales,
} from "./constants";

function useIsActive(pathname: string) {
  return (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
}

interface MobileDrawerProps {
  pathname: string;
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="footer-heading-type gold-ink">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function MobileDrawer({ pathname }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive(pathname);
  const primaryLinks = [
    { name: "Comprar", href: "/contacto?objetivo=comprar" },
    { name: "Vender", href: "/contacto?objetivo=vender" },
    { name: "Rentar", href: "/inventario?tipo=Renta" },
    { name: "Invertir", href: "/contacto?objetivo=invertir" },
  ];
  const companyLinks = [
    { name: "Nosotros", href: "/nosotros" },
    { name: "Equipo", href: "/nosotros/equipo" },
    { name: "Historia", href: "/nosotros/historia" },
    { name: "Valores", href: "/nosotros/valores" },
  ];
  const legalLinks = [
    { name: "Aviso de privacidad", href: "/legal/aviso-privacidad" },
    { name: "Términos de uso", href: "/legal/terminos-condiciones" },
  ];

  const handleClose = () => setOpen(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "group relative h-11 w-11 overflow-hidden rounded-none border transition-all duration-300",
            "border-white/12 bg-black/20 text-foreground hover:border-[var(--color-accent)]/55 hover:bg-white/[0.06]",
            "focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            open && "border-[var(--color-accent)]/55 bg-[var(--color-accent)]/10",
          )}
          aria-label="Abrir navegación"
        >
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-accent)_0%,transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
          <span className="relative flex h-4 w-5 flex-col justify-between" aria-hidden="true">
            <span
              className={cn(
                "h-px w-5 origin-left bg-current transition-transform duration-300",
                open && "translate-x-0.5 rotate-45",
              )}
            />
            <span
              className={cn(
                "h-px w-3.5 self-end bg-current transition-all duration-300 group-hover:w-5",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-px w-5 origin-left bg-current transition-transform duration-300",
                open && "translate-x-0.5 -rotate-45",
              )}
            />
          </span>
          <span className="sr-only">Abrir navegación</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent
        accessibleTitle="Navegación principal"
        className="h-screen top-0 right-0 left-auto mt-0 w-80 sm:w-96 lg:w-[420px] rounded-none bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-[var(--color-accent)]/15"
      >
        <div className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden p-4 sm:p-5">
          <DrawerHeader className="shrink-0 px-0 pb-2 pt-0 text-left flex flex-row items-center justify-end">
            <button
              onClick={handleClose}
              className="text-foreground/60 hover:text-[var(--color-accent)] transition-colors p-1"
              aria-label="Cerrar navegación"
            >
              <X className="w-5 h-5" />
            </button>
          </DrawerHeader>

          <div className="flex flex-1 flex-col gap-3 overflow-hidden border-t border-white/[0.06] py-3">
            <div className="flex flex-1 flex-col justify-start gap-3">
              <div className="grid grid-cols-2 gap-2">
                {baseLinks.map((link) => (
                  <Link
                    key={link.name}
                      href={link.href}
                      className={cn(
                      "font-display flex min-h-10 items-center justify-center border border-white/[0.08] px-3 text-center nav-link-type transition-colors",
                      isActive(link.href)
                        ? "border-white/20 bg-white/[0.035] gold-ink"
                        : "text-foreground/80 hover:border-white/18 hover:text-[var(--color-accent)]",
                    )}
                    onClick={handleClose}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <NavGroup title="Operaciones">
                <div className="grid grid-cols-2 gap-2">
                  {primaryLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "font-display flex min-h-11 items-center justify-between border border-white/[0.08] bg-white/[0.02] px-3 text-left hero-mobile-secondary-link transition-colors",
                        isActive(link.href)
                          ? "border-[var(--color-accent)]/35 bg-[var(--color-accent)]/10 gold-ink"
                          : "text-foreground hover:border-white/18 hover:text-[var(--color-accent)]",
                      )}
                      onClick={handleClose}
                    >
                      {link.name}
                      <span aria-hidden="true" className="text-[var(--color-accent)]">→</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/contacto"
                  className={cn(
                    "font-display mt-2 flex min-h-11 items-center justify-center border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-3 text-center nav-link-type transition-colors hover:border-[var(--color-accent)]/55",
                    isActive("/contacto") ? "gold-ink" : "text-foreground",
                  )}
                  onClick={handleClose}
                >
                  Contacto
                </Link>
              </NavGroup>

              <NavGroup title="Líneas de negocio">
                <div className="grid gap-2">
                  {verticales.map((link) => (
                    <Link key={link.name} href={link.href} onClick={handleClose} className="group border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 focus-visible:outline-none">
                      <span className={cn(
                        "font-display hero-mobile-secondary-link transition-colors",
                        isActive(link.href) ? "gold-ink" : "text-foreground group-hover:text-[var(--color-accent)]",
                      )}>
                        {link.name}
                      </span>
                      <p className="mt-0.5 truncate text-[0.78rem] leading-tight text-foreground/45">{link.desc}</p>
                    </Link>
                  ))}
                </div>
              </NavGroup>

              <NavGroup title="Herramientas">
                <Link
                  href="/herramientas"
                  className={cn(
                    "font-display flex min-h-[52px] items-center justify-between border border-white/[0.06] bg-white/[0.02] px-3 hero-mobile-secondary-link transition-colors",
                    isActive("/herramientas") ? "gold-ink" : "text-foreground/90 hover:text-[var(--color-accent)]",
                  )}
                  onClick={handleClose}
                >
                  <span>
                    Calculadoras
                    <span className="mt-0.5 block truncate text-[0.78rem] leading-tight text-foreground/45">
                      ROI, Flipping, ISAI
                    </span>
                  </span>
                  <span aria-hidden="true" className="text-[var(--color-accent)]">→</span>
                </Link>
              </NavGroup>

              <NavGroup title="Conócenos">
                <div className="grid grid-cols-4 gap-1.5">
                  {companyLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "font-display min-h-8 border border-white/[0.06] px-2 py-2 text-center text-[0.78rem] font-semibold leading-none transition-colors",
                        isActive(link.href) ? "gold-ink" : "text-foreground/80 hover:text-[var(--color-accent)]",
                      )}
                      onClick={handleClose}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </NavGroup>

              <NavGroup title="Legal">
                <div className="grid grid-cols-2 gap-2">
                  {legalLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "font-display text-[0.72rem] leading-snug text-foreground/55 transition-colors hover:text-[var(--color-accent)]",
                        isActive(link.href) && "gold-ink",
                      )}
                      onClick={handleClose}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </NavGroup>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
