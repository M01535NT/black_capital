"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
    { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { title: "Inventario", href: "/admin/properties", icon: Building2 },
    { title: "Agentes", href: "/admin/agents", icon: UserCircle },
    { title: "Leads B2B/B2C", href: "/admin/leads", icon: Users },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const [newLeadsCount, setNewLeadsCount] = useState<number | null>(null);

    useEffect(() => {
        async function fetchNewLeads() {
            try {
                const supabase = createClient();
                const { count } = await supabase
                    .from("leads")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "new");
                setNewLeadsCount(count);
            } catch {
                // fail silently
            }
        }
        fetchNewLeads();
        // Poll every 30s
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
                <Link href="/" className="font-display font-bold text-xl tracking-tight text-foreground">
                    BLACK <span className="text-gold-500">CORP</span>
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
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/70 transition-all hover:text-foreground mb-1",
                                    active ? "bg-muted text-foreground font-bold" : ""
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", active ? "text-gold-500" : "")} />
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
