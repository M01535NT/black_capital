import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ForceDark } from "@/components/force-dark";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <ForceDark />
            <Header />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <WhatsAppFloat />
        </div>
    );
}
