 "use client";

import { useId, useState } from "react";
import Link from "next/link";
import { X, type LucideIcon } from "lucide-react";
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

function GoldMenuIcon({ icon: Icon }: { icon: LucideIcon }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <Icon className="w-3.5 h-3.5" stroke={`url(#${gradientId})`} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c89625" />
          <stop offset="24%" stopColor="#d2a73c" />
          <stop offset="44%" stopColor="#e4c363" />
          <stop offset="58%" stopColor="#f1e292" />
          <stop offset="72%" stopColor="#e4c76a" />
          <stop offset="100%" stopColor="#d0a539" />
        </linearGradient>
      </defs>
    </Icon>
  );
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
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
  const visibleBaseLinks = baseLinks.filter((link) => link.name !== "Inicio" && link.name !== "Inventario");

  const handleClose = () => setOpen(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "group relative h-11 w-11 overflow-hidden rounded-full border transition-all duration-300",
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
      <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-80 sm:w-96 lg:w-[420px] rounded-none bg-[#0a0a0a]/95 backdrop-blur-2xl border-l border-[var(--color-accent)]/15">
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

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto border-t border-white/[0.06] py-4">
            <div className="flex flex-1 flex-col justify-start gap-5 pb-6">
              <div className="grid grid-cols-1 gap-[clamp(1rem,3vw,1.75rem)]">
                {visibleBaseLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                      "font-display flex items-center justify-center border border-white/[0.08] px-3 py-3 text-center hero-mobile-main-link transition-colors",
                      isActive(link.href) ? "border-[var(--color-accent)]/45 gold-ink" : "text-foreground hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]",
                    )}
                    onClick={handleClose}
                    style={{ lineHeight: "normal" }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <NavGroup title="Marcas">
                <div className="grid gap-[clamp(1rem,3vw,1.75rem)]">
                  {verticales.map((link) => (
                  <Link key={link.name} href={link.href} onClick={handleClose} className="group border border-white/[0.06] bg-white/[0.02] px-3 py-2 focus-visible:outline-none">
                      <span className={cn(
                        "font-display hero-mobile-secondary-link transition-colors",
                        isActive(link.href) ? "gold-ink" : "text-foreground group-hover:text-[var(--color-accent)]",
                      )}>
                        {link.name}
                      </span>
                      <p className="mt-0.5 truncate property-location-type text-foreground/45">{link.desc}</p>
                    </Link>
                  ))}
                </div>
              </NavGroup>

              <NavGroup title="Herramientas">
                <div className="grid gap-3">
                  {herramientasDropdown.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="font-display flex min-h-8 items-center gap-2 hero-mobile-secondary-link transition-colors"
                        onClick={handleClose}
                      >
                        <GoldMenuIcon icon={Icon} />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </NavGroup>

              <NavGroup title="Corporativo">
                <div className="grid grid-cols-1 gap-2.5">
                  {corporativoLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "font-display hero-mobile-secondary-link transition-colors",
                        isActive(link.href) ? "gold-ink" : "text-foreground/80 hover:text-[var(--color-accent)]",
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
