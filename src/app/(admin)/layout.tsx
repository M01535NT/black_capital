import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminTopbarActions } from "@/components/admin/topbar-actions";
import { AdminBackButton } from "@/components/admin/admin-back-button";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { AdminPublicLinksMenu } from "@/components/admin/admin-public-links-menu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";
import { requireAdminSession } from "@/lib/auth";

const ADMIN_NAV_ITEMS = [
    { title: "Dashboard", href: "/admin" },
    { title: "Inventario", href: "/admin/properties" },
    { title: "Leads", href: "/admin/leads" },
    { title: "Mi cuenta", href: "/admin/account" },
];

const ADMIN_ONLY_ITEMS = [
    { title: "Equipo", href: "/admin/agents" },
    { title: "Configuración", href: "/admin/settings" },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const profile = await requireAdminSession();

    const mobileNavItems = profile.role === "admin"
        ? [...ADMIN_NAV_ITEMS, ...ADMIN_ONLY_ITEMS]
        : ADMIN_NAV_ITEMS.map((item) => ({
            ...item,
            title:
                item.title === "Inventario"
                    ? "Mis propiedades"
                    : item.title === "Leads"
                            ? "Mis leads"
                            : item.title,
        }));

    return (
        <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-white">
            <AdminSidebar userRole={profile.role} />
            <div className="flex min-w-0 max-w-full flex-col overflow-x-hidden transition-[padding] duration-200 md:pl-[var(--admin-sidebar-width,256px)]">
                <header className="flex h-16 min-w-0 items-center gap-2 overflow-x-clip border-b border-white/[0.08] bg-background/95 px-3 backdrop-blur-xl sm:gap-4 sm:px-4 lg:px-6">
                    <Drawer direction="left">
                        <DrawerTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 rounded-full border-white/[0.12] bg-white/[0.025] text-white md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Abrir menú de navegación</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-full w-[min(18rem,85vw)] rounded-none border-r border-white/[0.08] bg-[#070707] sm:max-w-xs">
                            <div className="flex h-16 items-center border-b border-white/[0.08] px-5">
                                <Link href="/" className="text-display-3 font-semibold text-white">
                                    Black <span className="block text-sm tracking-[0.18em] text-[var(--color-accent)]">Capital</span>
                                </Link>
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                {mobileNavItems.map((item) => (
                                    <DrawerClose key={item.href} asChild>
                                        <Link
                                            href={item.href}
                                            className="border border-white/[0.08] px-3 py-3 text-caption text-white/70 hover:text-[var(--color-accent)]"
                                        >
                                            {item.title}
                                        </Link>
                                    </DrawerClose>
                                ))}
                                <div className="mt-4 border-t border-white/[0.08] pt-4">
                                    <AdminLogoutButton compact />
                                </div>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <AdminBackButton />
                    <div className="min-w-0 flex-1" />
                    <AdminPublicLinksMenu />
                    <AdminTopbarActions />
                </header>

                <main className="flex min-w-0 max-w-full flex-1 flex-col gap-6 overflow-x-hidden p-3 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

