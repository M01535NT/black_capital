import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ForceDark } from "@/components/force-dark";
import { PageTransition } from "@/components/layout/PageTransition";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <ForceDark />
            <Header />
            <main className="flex-1 flex flex-col">
                <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
}
