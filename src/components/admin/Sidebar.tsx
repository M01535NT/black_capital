"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, LockKeyhole, Mail, Settings, UserCircle, UserCog } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminRole = "admin" | "agent";

interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
    roles: AdminRole[];
    showBadge?: boolean;
}

const NAV_ITEMS: NavItem[] = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["admin", "agent"] },
    { title: "Inventario", href: "/admin/properties", icon: Building2, roles: ["admin", "agent"] },
    { title: "Leads nuevos", href: "/admin/leads?status=new", icon: Mail, roles: ["admin", "agent"] },
    { title: "Leads", href: "/admin/leads", icon: Mail, roles: ["admin", "agent"], showBadge: true },
    { title: "Agentes", href: "/admin/agents", icon: UserCircle, roles: ["admin"] },
    { title: "Usuarios", href: "/admin/users", icon: UserCog, roles: ["admin"] },
    { title: "Configuración", href: "/admin/settings", icon: Settings, roles: ["admin"] },
    { title: "Mi cuenta", href: "/admin/account", icon: LockKeyhole, roles: ["admin", "agent"] },
];

interface AdminSidebarProps {
    userRole: AdminRole;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
    const pathname = usePathname();
    const [newLeadsCount, setNewLeadsCount] = useState<number | null>(null);
    const isMounted = useRef(true);
    const inFlight = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        async function fetchNewLeads() {
            if (inFlight.current) return;
            inFlight.current = true;
            try {
                const res = await fetch("/api/leads", {
                    headers: { "Content-Type": "application/json" },
                });
                if (res.ok) {
                    const json = await res.json();
                    if (isMounted.current) setNewLeadsCount(json.newCount ?? 0);
                }
            } catch (err) {
                console.error("Error fetching new leads count:", err);
            } finally {
                inFlight.current = false;
            }
        }

        fetchNewLeads();
        const interval = setInterval(fetchNewLeads, 30000);
        return () => {
            isMounted.current = false;
            clearInterval(interval);
        };
    }, []);

    const navItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

    const isActive = (href: string) => {
        const basePath = href.split("?")[0];
        if (basePath === "/admin") return pathname === "/admin";
        return pathname === basePath || pathname.startsWith(`${basePath}/`);
    };

    return (
        <nav className="hidden h-full w-64 border-r border-white/[0.08] bg-[#070707] md:block">
            <div className="flex h-16 items-center border-b border-white/[0.08] px-5">
                <Link href="/" className="font-display text-xl font-bold uppercase leading-none tracking-wide text-white">
                    Black <span className="block text-sm font-light tracking-[0.18em] text-[var(--color-accent)]">Capital</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-5">
                <div className="grid items-start px-3 text-sm font-medium">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const showBadge = item.showBadge && newLeadsCount !== null && newLeadsCount > 0;
                        const title =
                            userRole === "agent"
                                ? (item.title === "Inventario" ? "Mis propiedades" : item.title === "Leads" ? "Mis leads" : item.title === "Leads nuevos" ? "Leads por responder" : item.title)
                                : item.title;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "mb-1 flex items-center gap-3 border border-transparent px-3 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55 transition-colors",
                                    active
                                        ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                                        : "hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", active ? "text-[var(--color-accent)]" : "text-white/38")} />
                                <span className="flex-1">{title}</span>
                                {showBadge && (
                                    <span className="min-w-[18px] bg-[var(--color-accent)] px-1.5 py-0.5 text-center text-caption font-bold text-black">
                                        {newLeadsCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
