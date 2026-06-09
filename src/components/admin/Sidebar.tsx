"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, LockKeyhole, Mail, MousePointer2, PanelLeftClose, PanelLeftOpen, Settings, UserCircle } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { AdminTooltip } from "@/components/admin/admin-tooltip";

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
    { title: "Leads", href: "/admin/leads", icon: Mail, roles: ["admin", "agent"], showBadge: true },
    { title: "Equipo", href: "/admin/agents", icon: UserCircle, roles: ["admin"] },
    { title: "Configuración", href: "/admin/settings", icon: Settings, roles: ["admin"] },
    { title: "Mi cuenta", href: "/admin/account", icon: LockKeyhole, roles: ["admin", "agent"] },
];

interface AdminSidebarProps {
    userRole: AdminRole;
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
    const pathname = usePathname();
    const [newLeadsCount, setNewLeadsCount] = useState<number | null>(null);
    const [mode, setMode] = useState<"open" | "closed" | "hover">("open");
    const [hovered, setHovered] = useState(false);
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
    const expanded = mode === "open" || (mode === "hover" && hovered);

    useEffect(() => {
        document.documentElement.style.setProperty("--admin-sidebar-width", expanded ? "256px" : "72px");
        return () => {
            document.documentElement.style.removeProperty("--admin-sidebar-width");
        };
    }, [expanded]);

    const isActive = (href: string) => {
        const basePath = href.split("?")[0];
        if (basePath === "/admin") return pathname === "/admin";
        return pathname === basePath || pathname.startsWith(`${basePath}/`);
    };

    return (
        <nav
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "fixed inset-y-0 left-0 z-40 hidden h-screen shrink-0 overflow-visible border-r border-white/[0.08] bg-[#070707] transition-[width] duration-200 md:block",
                expanded ? "w-64" : "w-[72px]"
            )}
        >
            <div className={cn("flex h-16 items-center justify-between gap-3 border-b border-white/[0.08]", expanded ? "px-5" : "justify-center px-0")}>
                <Link href="/" className={cn("min-w-0 font-display font-bold uppercase leading-none tracking-wide text-white", expanded ? "text-xl" : "flex h-10 w-10 items-center justify-center border border-[var(--color-accent)]/25 text-sm text-[var(--color-accent)]")}>
                    {expanded ? (
                        <>Black <span className="block text-sm tracking-[0.18em] text-[var(--color-accent)]">Capital</span></>
                    ) : (
                        <span>BC</span>
                    )}
                </Link>
                {expanded && (
                    <SidebarModeControl mode={mode} onModeChange={setMode} />
                )}
            </div>
            <div className={cn("flex h-[calc(100vh-4rem)] flex-col overflow-hidden", expanded ? "py-5" : "py-4")}>
                {!expanded && (
                    <div className="mb-4 flex justify-center">
                        <SidebarModeControl mode={mode} onModeChange={setMode} compact />
                    </div>
                )}
                <div className={cn("grid items-start overflow-y-auto overflow-x-visible text-sm font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", expanded ? "px-3" : "justify-items-center px-0")}>
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const showBadge = item.showBadge && newLeadsCount !== null && newLeadsCount > 0;
                        const title =
                            userRole === "agent"
                                ? (item.title === "Inventario" ? "Mis propiedades" : item.title === "Leads" ? "Mis leads" : item.title)
                                : item.title;

                        const link = (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-label={title}
                                className={cn(
                                    "mb-1 flex items-center gap-3 border border-transparent px-3 py-3 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55 transition-colors",
                                        !expanded && "h-11 w-11 justify-center px-0",
                                    active
                                        ? "border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                                        : "hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", active ? "text-[var(--color-accent)]" : "text-white/38")} />
                                {expanded && <span className="flex-1">{title}</span>}
                                {showBadge && expanded && (
                                    <span className="min-w-[18px] bg-[var(--color-accent)] px-1.5 py-0.5 text-center text-caption font-bold text-black">
                                        {newLeadsCount}
                                    </span>
                                )}
                            </Link>
                        );

                        return expanded ? link : (
                            <AdminTooltip key={item.href} label={title}>
                                {link}
                            </AdminTooltip>
                        );
                    })}
                </div>
                <div className={cn("mt-auto pt-4", expanded ? "px-3" : "flex justify-center px-0")}>
                    <AdminLogoutButton compact={!expanded} />
                </div>
            </div>
        </nav>
    );
}

function SidebarModeControl({
    mode,
    onModeChange,
    compact = false,
}: {
    mode: "open" | "closed" | "hover";
    onModeChange: (mode: "open" | "closed" | "hover") => void;
    compact?: boolean;
}) {
    const options = [
        { value: "open" as const, label: "Mantener abierto", icon: PanelLeftOpen },
        { value: "closed" as const, label: "Mantener cerrado", icon: PanelLeftClose },
        { value: "hover" as const, label: "Abrir al pasar cursor", icon: MousePointer2 },
    ];

    return (
        <div className={cn("flex items-center gap-1 border border-white/[0.08] bg-white/[0.025] p-1", compact && "w-11 flex-col border-transparent bg-transparent p-0")}>
            {options.map((option) => {
                const Icon = option.icon;
                return (
                    <AdminTooltip key={option.value} label={option.label}>
                        <button
                            type="button"
                            onClick={() => onModeChange(option.value)}
                            aria-label={option.label}
                            className={cn(
                                "flex h-7 w-7 items-center justify-center border border-transparent text-white/45 transition-colors hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white",
                                compact && "h-9 w-9",
                                mode === option.value && "bg-[var(--color-accent)] text-black hover:text-black"
                            )}
                        >
                            <Icon className="h-3.5 w-3.5" />
                        </button>
                    </AdminTooltip>
                );
            })}
        </div>
    );
}

