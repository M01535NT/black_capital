"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
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
    <div className="space-y-4">
      <h3 className="font-display text-[11px] uppercase tracking-overline text-gold-solid/90 font-bold">
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
          className="hover:text-gold-solid/90 hover:bg-white/5 text-foreground lg:hidden"
          aria-label="Abrir menu de navegacion"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-80 sm:w-96 rounded-none bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-gold-500/15">
        <div className="mx-auto w-full max-w-sm p-6 overflow-y-auto">
          <DrawerHeader className="px-0 pt-0 text-left flex flex-row items-center justify-between">
            <DrawerTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
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

          <div className="py-6 space-y-8">
            <NavGroup title="Navegacion">
              <div className="flex flex-col gap-3">
                {baseLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "font-display text-lg font-bold uppercase tracking-wide transition-colors",
                      isActive(link.href) ? "text-gold-solid" : "text-foreground hover:text-gold-solid",
                    )}
                    onClick={handleClose}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </NavGroup>

            <NavGroup title="Nuestras Marcas">
              <div className="flex flex-col gap-4">
                {verticales.map((link) => (
                  <Link key={link.name} href={link.href} onClick={handleClose} className="group focus-visible:outline-none">
                    <span className={cn(
                      "font-display text-lg font-bold tracking-wide transition-colors",
                      isActive(link.href) ? "text-gold-solid" : "text-foreground group-hover:text-gold-solid",
                    )}>
                      {link.name}
                    </span>
                    <p className="text-xs text-foreground/50 mt-0.5">{link.desc}</p>
                  </Link>
                ))}
              </div>
            </NavGroup>

            <NavGroup title="Herramientas">
              <div className="flex flex-col gap-3">
                {herramientasDropdown.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 text-sm font-medium text-foreground/80 hover:text-gold-solid transition-colors"
                      onClick={handleClose}
                    >
                      <Icon className="w-4 h-4 text-gold-solid/80" aria-hidden="true" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </NavGroup>

            <NavGroup title="Corporativo">
              <div className="flex flex-col gap-3">
                {corporativoLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isActive(link.href) ? "text-gold-solid" : "text-foreground/80 hover:text-gold-solid",
                    )}
                    onClick={handleClose}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </NavGroup>

            {/* Contacto CTA */}
            <div className="pt-2">
              <Link
                href="/contacto"
                className="flex items-center justify-center gap-2 w-full py-3 px-6 border border-gold-solid/60 rounded-full text-gold-solid font-semibold text-sm hover:bg-gold-solid hover:text-black transition-all"
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
