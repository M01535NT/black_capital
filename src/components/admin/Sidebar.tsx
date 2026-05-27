"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, UserCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Inventario", href: "/admin/properties", icon: Building2 },
    { title: "Agentes", href: "/admin/agents", icon: UserCircle },
    { title: "Leads B2B/B2C", href: "/admin/leads", icon: Users },
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
        <nav className="hidden border-r border-foreground/10 bg-card md:block w-64 h-full">
            <div className="flex h-14 items-center border-b border-foreground/10 px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="font-display font-bold text-xl tracking-wider text-foreground uppercase">
                    Black <span className="text-gold-500">Corp</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <div className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const showBadge = item.href === "/admin/leads" && newLeadsCount !== null && newLeadsCount > 0;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-foreground/70 transition-all hover:text-foreground mb-1 uppercase text-xs tracking-wider font-display",
                                    active
                                        ? "bg-gold-500/10 text-gold-500 font-bold border-l-2 border-gold-500"
                                        : "hover:bg-muted/30"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", active ? "text-gold-500" : "text-foreground/50")} />
                                <span className="flex-1">{item.title}</span>
                                {showBadge && (
                                    <span className="bg-gold-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
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
