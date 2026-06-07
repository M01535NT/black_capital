"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import {
  baseLinks,
  verticales,
  herramientasDropdown,
  corporativoLinks,
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
    <div className="space-y-2.5">
      <h3 className="font-display text-[10px] uppercase tracking-[0.18em] text-gold-solid/90 font-bold">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function MobileDrawer({ pathname }: MobileDrawerProps) {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive(pathname);

  const handleClose = () => setOpen(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "group relative h-11 w-11 overflow-hidden rounded-full border transition-all duration-300",
            "border-white/12 bg-black/20 text-foreground hover:border-gold-solid/55 hover:bg-white/[0.06]",
            "focus-visible:ring-2 focus-visible:ring-gold-solid focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            open && "border-gold-solid/55 bg-gold-solid/10",
          )}
          aria-label="Abrir menu de navegacion"
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
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-80 sm:w-96 lg:w-[420px] rounded-none bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-gold-500/15">
        <div className="mx-auto flex h-full w-full max-w-sm flex-col overflow-hidden p-4 sm:p-5">
          <DrawerHeader className="shrink-0 px-0 pb-3 pt-0 text-left flex flex-row items-center justify-between">
            <DrawerTitle className="font-display text-xl font-bold tracking-tight text-foreground">
              Menu
            </DrawerTitle>
            <button
              onClick={handleClose}
              className="text-foreground/60 hover:text-gold-solid transition-colors p-1"
              aria-label="Cerrar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </DrawerHeader>

          <div className="flex flex-1 flex-col justify-between gap-4 border-t border-white/[0.06] pt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                  {baseLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "flex min-h-10 items-center justify-center border border-white/[0.08] px-3 text-center font-display text-[12px] font-bold uppercase tracking-[0.12em] transition-colors",
                        isActive(link.href) ? "border-gold-solid/45 text-gold-solid" : "text-foreground hover:border-gold-solid/40 hover:text-gold-solid",
                      )}
                      onClick={handleClose}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

            <NavGroup title="Marcas">
              <div className="grid gap-2">
                {verticales.map((link) => (
                  <Link key={link.name} href={link.href} onClick={handleClose} className="group border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 focus-visible:outline-none">
                    <span className={cn(
                      "font-display text-sm font-bold tracking-wide transition-colors",
                      isActive(link.href) ? "text-gold-solid" : "text-foreground group-hover:text-gold-solid",
                    )}>
                      {link.name}
                    </span>
                    <p className="mt-0.5 truncate text-[11px] text-foreground/45">{link.desc}</p>
                  </Link>
                ))}
              </div>
            </NavGroup>

            <NavGroup title="Herramientas">
              <div className="grid gap-2">
                {herramientasDropdown.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex min-h-8 items-center gap-2 text-xs font-medium text-foreground/78 hover:text-gold-solid transition-colors"
                      onClick={handleClose}
                    >
                      <Icon className="w-3.5 h-3.5 text-gold-solid/80" aria-hidden="true" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </NavGroup>

            <NavGroup title="Corporativo">
              <div className="grid grid-cols-1 gap-2">
                {corporativoLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-xs font-medium transition-colors",
                      isActive(link.href) ? "text-gold-solid" : "text-foreground/80 hover:text-gold-solid",
                    )}
                    onClick={handleClose}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </NavGroup>
            </div>

            {/* Contacto CTA */}
            <div className="shrink-0">
              <Link
                href="/contacto"
                className="flex min-h-10 items-center justify-center gap-2 w-full px-5 border border-gold-solid/60 rounded-full text-gold-solid font-semibold text-sm hover:bg-gold-solid hover:text-black transition-all"
                onClick={handleClose}
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
