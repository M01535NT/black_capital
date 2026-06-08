"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, UserCircle, Settings, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Inventario", href: "/admin/properties", icon: Building2 },
    { title: "Agentes", href: "/admin/agents", icon: UserCircle },
    { title: "Leads B2B/B2C", href: "/admin/leads", icon: Users },
    { title: "Usuarios", href: "/admin/users", icon: UserCog },
    { title: "Configuración", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [newLeadsCount, setNewLeadsCount] = useState<number | null>(null);

    useEffect(() => {
        async function fetchNewLeads() {
            try {
                const res = await fetch("/api/leads", {
                    headers: { "Content-Type": "application/json" },
                });
                if (res.ok) {
                    const json = await res.json();
                    setNewLeadsCount(json.newCount ?? 0);
                }
            } catch (err) {
                console.error("Error fetching new leads count:", err);
            }
        }
        fetchNewLeads();
        const interval = setInterval(fetchNewLeads, 30000);
        return () => clearInterval(interval);
    }, []);

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === href;
        return pathname.startsWith(href);
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
                        const showBadge = item.href === "/admin/leads" && newLeadsCount !== null && newLeadsCount > 0;
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
                                <span className="flex-1">{item.title}</span>
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
