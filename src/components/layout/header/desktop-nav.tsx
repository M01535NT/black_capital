"use client";

import { useRef, useCallback, useEffect, KeyboardEvent } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinkBase, navLinkActive, type DropdownDef } from "./constants";

interface NavDropdownProps {
  def: DropdownDef;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
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
          className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2 min-w-[260px] bg-[#111111]/96 border border-white/10 rounded-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl z-50"
        >
          <Link
            href={def.href}
            role="menuitem"
            className="flex items-center justify-between px-4 py-2.5 mb-1 text-xs uppercase tracking-overline font-display font-bold text-gold-solid rounded-xl border-b border-white/5 pb-3 hover:text-gold-400 focus-visible:outline-none focus-visible:text-gold-400"
            onClick={onClose}
          >
            Ver todo de {def.label}
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          {def.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-3 text-sm text-foreground rounded-xl transition-all duration-300 hover:bg-gold-500/10 hover:text-gold-solid hover:pl-5 focus-visible:bg-gold-500/10 focus-visible:text-gold-solid focus-visible:outline-none"
                onClick={onClose}
              >
                <Icon className="w-4 h-4 text-gold-solid" aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
