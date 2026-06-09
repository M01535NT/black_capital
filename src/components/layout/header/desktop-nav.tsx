"use client";

import { useRef, useCallback, useEffect, KeyboardEvent, useId } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinkBase, navLinkActive, type DropdownDef } from "./constants";

interface NavDropdownProps {
  def: DropdownDef;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function GoldDropdownIcon({ icon: Icon }: { icon: LucideIcon }) {
  const gradientId = useId().replace(/:/g, "");

  return (
    <Icon className="w-4 h-4" stroke={`url(#${gradientId})`} aria-hidden="true">
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

export function NavDropdown({ def, isOpen, onOpen, onClose }: NavDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(onClose, 180);
  }, [cancelClose, onClose]);

  const handleMouseEnter = useCallback(() => {
    cancelClose();
    onOpen();
  }, [cancelClose, onOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Escape" && isOpen) {
      e.preventDefault();
      onClose();
      triggerRef.current?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? onClose() : onOpen())}
        onFocus={onOpen}
        onKeyDown={onKeyDown}
        className={cn(navLinkBase, isOpen && navLinkActive)}
      >
        {def.label}
        <ChevronDown
          className={cn("w-3 h-3 transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div
          role="menu"
          aria-label={def.label}
          className="font-display absolute top-full left-1/2 -translate-x-1/2 translate-y-2 min-w-[260px] bg-[#111111]/96 border border-white/10 rounded-none p-3 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl z-50"
        >
          <Link
            href={def.href}
            role="menuitem"
            className="font-display property-tag-type flex items-center justify-between px-4 py-2.5 mb-1 rounded-none border-b border-white/5 pb-3 focus-visible:outline-none"
            onClick={onClose}
          >
            <span className="gold-ink">Ver todo de {def.label}</span>
            <GoldDropdownIcon icon={ArrowRight} />
          </Link>
          {def.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                role="menuitem"
                className="font-display text-body-sm flex items-center gap-3 px-4 py-3 text-foreground rounded-none transition-all duration-300 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] hover:pl-5 focus-visible:bg-[var(--color-accent)]/10 focus-visible:text-[var(--color-accent)] focus-visible:outline-none"
                onClick={onClose}
              >
                <GoldDropdownIcon icon={Icon} />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
