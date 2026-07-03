"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Phone, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_CONFIG } from "@/lib/contact-config";
import { verticales } from "./constants";

const EASE = [0.23, 1, 0.32, 1] as const;

const primaryLinks = [
  { name: "Inicio", href: "/" },
  { name: "Inventario", href: "/inventario" },
  { name: "Nosotros", href: "/nosotros" },
  { name: "Herramientas", href: "/herramientas" },
  { name: "Contacto", href: "/contacto" },
];

const operations = [
  { name: "Comprar", href: "/contacto?objetivo=comprar" },
  { name: "Vender", href: "/contacto?objetivo=vender" },
  { name: "Rentar", href: "/inventario?tipo=Renta" },
  { name: "Invertir", href: "/contacto?objetivo=invertir" },
];

const lineImages: Record<string, string> = {
  "Black Luxury": "/line-residencial.webp",
  "Black Business": "/line-comercial.webp",
  "Black Industrial": "/line-industrial.webp",
};

const legalLinks = [
  { name: "Aviso de privacidad", href: "/legal/aviso-privacidad" },
  { name: "Términos de uso", href: "/legal/terminos-condiciones" },
];

const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: EASE } },
};

const panel: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
  exit: {},
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

interface NavOverlayProps {
  onClose: () => void;
  isActive: (href: string) => boolean;
}

const whatsappHref = `https://wa.me/${CONTACT_CONFIG.phoneRaw}?text=${encodeURIComponent(
  "Hola, quiero asesoría sobre un inmueble en Tijuana.",
)}`;

export function NavOverlay({ onClose, isActive }: NavOverlayProps) {
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  // Bloqueo de scroll del body + Escape + foco inicial mientras el overlay vive.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Navegación principal"
      className="fixed inset-0 z-[60] overflow-y-auto bg-[#060606]/95 backdrop-blur-2xl"
      variants={reduce ? undefined : backdrop}
      initial={reduce ? { opacity: 1 } : "hidden"}
      animate={reduce ? { opacity: 1 } : "show"}
      exit={reduce ? { opacity: 0 } : "exit"}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full opacity-[0.10] blur-[100px]"
        style={{ background: "var(--gradient-gold)" }}
      />
      <div className="grain-overlay opacity-[0.08]" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[90rem] flex-col px-6 pb-10 pt-5 sm:px-10 lg:px-16">
        {/* Barra superior del overlay */}
        <div className="flex items-center justify-between">
          <span className="property-tag-type gold-ink">Menú</span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Cerrar navegación"
            className="group flex h-11 w-11 items-center justify-center border border-white/12 text-white/70 transition-colors duration-300 hover:border-[var(--color-accent)]/55 hover:text-[var(--color-accent)]"
          >
            <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          </button>
        </div>

        <motion.div
          className="grid flex-1 grid-cols-1 items-center gap-12 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16"
          variants={reduce ? undefined : panel}
          initial={reduce ? false : "hidden"}
          animate={reduce ? false : "show"}
          exit={reduce ? undefined : "exit"}
        >
          {/* Columna primaria: links grandes */}
          <nav aria-label="Navegación" className="flex flex-col">
            {primaryLinks.map((link, i) => (
              <motion.div key={link.name} variants={reduce ? undefined : item}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-4 border-b border-white/[0.08] py-4 transition-colors duration-300 sm:py-5",
                    isActive(link.href) ? "text-white" : "text-white/70 hover:text-white",
                  )}
                >
                  <span className="property-tag-type w-7 shrink-0 text-white/30">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[clamp(1.9rem,6vw,3.75rem)] font-extrabold uppercase leading-none tracking-tight">
                    {link.name}
                  </span>
                  <ArrowUpRight className="ml-auto h-6 w-6 shrink-0 text-[var(--color-accent)] opacity-0 transition-[transform,opacity] duration-200 ease-out group-hover:translate-x-1 group-hover:opacity-100" />
                </Link>
              </motion.div>
            ))}

            {/* Operaciones (chips) */}
            <motion.div
              variants={reduce ? undefined : item}
              className="mt-8 flex flex-wrap gap-2.5"
            >
              {operations.map((op) => (
                <Link
                  key={op.name}
                  href={op.href}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 border border-white/[0.12] px-4 py-2 property-tag-type text-white/75 transition-colors duration-300 hover:border-[var(--color-accent)]/45 hover:text-[var(--color-accent)]"
                >
                  {op.name}
                </Link>
              ))}
            </motion.div>
          </nav>

          {/* Columna secundaria: líneas + contacto */}
          <div className="flex flex-col gap-8">
            <motion.div variants={reduce ? undefined : item}>
              <p className="mb-4 property-tag-type text-white/40">Líneas de negocio</p>
              <div className="grid grid-cols-3 gap-3">
                {verticales.map((line) => (
                  <Link
                    key={line.name}
                    href={line.href}
                    onClick={onClose}
                    className="group relative aspect-[3/4] overflow-hidden border border-white/[0.08]"
                  >
                    <Image
                      src={lineImages[line.name] ?? "/brand-luxury.webp"}
                      alt={line.name}
                      fill
                      sizes="(max-width: 1024px) 30vw, 15vw"
                      className="object-cover opacity-70 transition-[transform,opacity] duration-300 ease-out group-hover:scale-105 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <span className="absolute inset-x-0 bottom-0 p-3 font-display text-[0.8rem] font-bold uppercase leading-tight text-white">
                      {line.name.replace("Black ", "")}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={reduce ? undefined : item}
              className="flex flex-col gap-3 border-t border-white/[0.08] pt-6"
            >
              <a
                href={`tel:${CONTACT_CONFIG.phoneRaw}`}
                className="group inline-flex items-center gap-3 text-white/75 transition-colors hover:text-[var(--color-accent)]"
              >
                <Phone className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
                <span className="text-body-sm tabular-nums">{CONTACT_CONFIG.phone}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-white/75 transition-colors hover:text-[var(--color-accent)]"
              >
                <MessageCircle className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
                <span className="text-body-sm">Escríbenos por WhatsApp</span>
              </a>
            </motion.div>

            <motion.div variants={reduce ? undefined : item} className="flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((l) => (
                <Link
                  key={l.name}
                  href={l.href}
                  onClick={onClose}
                  className="footer-legal-type text-white/40 transition-colors hover:text-white/70"
                >
                  {l.name}
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
