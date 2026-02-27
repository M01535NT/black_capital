import { AdminSidebar } from "@/components/admin/Sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
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
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <AdminSidebar />
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b border-foreground/10 bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Drawer direction="left">
                        <DrawerTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Abrir menú de navegación</span>
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="w-64 sm:max-w-xs h-full rounded-none">
                            {/* Mobile Sidebar Logic */}
                            <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                                <Link href="/" className="font-display font-bold text-xl tracking-tight text-foreground">
                                    BLACK <span className="text-gold-500">CORP</span>
                                </Link>
                            </div>
                            <div className="p-4 flex flex-col gap-2">
                                <Link href="/admin/dashboard" className="rounded-lg px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-muted font-bold">Dashboard</Link>
                                <Link href="/admin/properties" className="rounded-lg px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-muted font-bold">Inventario</Link>
                                <Link href="/admin/leads" className="rounded-lg px-3 py-2 text-foreground/70 hover:text-foreground hover:bg-muted font-bold">Leads</Link>
                            </div>
                        </DrawerContent>
                    </Drawer>

                    <div className="w-full flex-1">
                        <h1 className="text-lg font-bold tracking-tight text-foreground/50">Backoffice Admin</h1>
                    </div>
                    <ModeToggle />
                </header>

                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
                    {children}
                </main>
            </div>
        </div>
    );
}
