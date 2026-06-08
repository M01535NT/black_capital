import { AdminSidebar } from "@/components/admin/Sidebar";
import { AdminTopbarActions } from "@/components/admin/topbar-actions";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { ExternalLink, Menu } from "lucide-react";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="grid min-h-screen w-full max-w-full overflow-x-hidden bg-background text-white md:grid-cols-[256px_minmax(0,1fr)]">
            <AdminSidebar />
            <div className="flex min-w-0 max-w-full flex-col overflow-x-hidden">
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
                                <Link href="/" className="font-display text-xl font-bold uppercase leading-none tracking-wide text-white">
                                    Black <span className="block text-sm font-light tracking-[0.18em] text-[var(--color-accent)]">Capital</span>
                                </Link>
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <Link href="/admin" className="border border-white/[0.08] px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white/70 hover:text-[var(--color-accent)]">Dashboard</Link>
                                <Link href="/admin/properties" className="border border-white/[0.08] px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white/70 hover:text-[var(--color-accent)]">Inventario</Link>
                                <Link href="/admin/leads" className="border border-white/[0.08] px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white/70 hover:text-[var(--color-accent)]">Leads</Link>
                                <Link href="/admin/account" className="border border-white/[0.08] px-3 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white/70 hover:text-[var(--color-accent)]">Mi cuenta</Link>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <div className="min-w-0 flex-1" />
                    <Link
                        href="/"
                        className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/45 transition-colors hover:text-[var(--color-accent)] sm:inline-flex"
                    >
                        Sitio público
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <ModeToggle />
                    <AdminTopbarActions />
                </header>

                <main className="flex min-w-0 max-w-full flex-1 flex-col gap-6 overflow-x-hidden p-3 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
