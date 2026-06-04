import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { PageTransition } from "@/components/layout/PageTransition";
import { ErrorBoundary } from "@/components/error-boundary";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gold-500 focus:text-black focus:rounded-lg focus:font-semibold">
                Saltar al contenido principal
            </a>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
                    <ErrorBoundary><PageTransition>{children}</PageTransition></ErrorBoundary>
                </main>
                <Footer />
                <WhatsAppFloat />
            </div>
        </>
    );
}
