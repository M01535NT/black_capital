import { getSiteSettings } from "@/lib/site-settings";
import { PublicSettingsProvider } from "@/components/public/site-settings-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { ScrollProgress } from "@/components/layout/ScrollProgress";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getSiteSettings();
    const readOnly = process.env.VERCEL_ENV === "preview";
    return (
        <PublicSettingsProvider settings={settings} readOnly={readOnly}>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-black focus:rounded-lg focus:font-semibold">
                Saltar al contenido principal
            </a>
            {readOnly && <div role="status" className="fixed bottom-3 right-3 z-[60] max-w-xs border border-white/20 bg-black/90 p-3 text-sm text-white">Vista previa de revisión. Los envíos y el acceso administrativo están desactivados.</div>}
            <ScrollProgress />
            <div className="flex flex-col min-h-screen">
                <Header />
                <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
                    {/* La transición de ruta vive en app/template.tsx (RouteTransition); aquí iba una segunda animación duplicada */}
                    <ErrorBoundary>{children}</ErrorBoundary>
                </main>
                <Footer />
            </div>
        </PublicSettingsProvider>
    );
}
