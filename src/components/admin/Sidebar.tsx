"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Inventario",
        href: "/admin/properties",
        icon: Building2,
    },
    {
        title: "Leads B2B/B2C",
        href: "/admin/leads",
        icon: Users,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <nav className="hidden border-r border-foreground/10 bg-muted/40 md:block w-64 h-full">
            <div className="flex h-14 items-center border-b border-foreground/10 px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="font-display font-bold text-xl tracking-tight text-foreground">
                    BLACK <span className="text-gold-500">CORP</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <div className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-foreground/70 transition-all hover:text-foreground mb-1",
                                    isActive ? "bg-muted text-foreground font-bold" : ""
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "text-gold-500" : "")} />
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
