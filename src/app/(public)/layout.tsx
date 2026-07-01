import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/error-boundary";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--color-accent)] focus:text-black focus:rounded-lg focus:font-semibold">
                Saltar al contenido principal
            </a>
            <ScrollProgress />
            <div className="flex flex-col min-h-screen">
                <Header />
                <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
                    {/* La transición de ruta vive en app/template.tsx (RouteTransition); aquí iba una segunda animación duplicada */}
                    <ErrorBoundary>{children}</ErrorBoundary>
                </main>
                <Footer />
            </div>
            <WhatsAppFloat />
        </>
    );
}
