import { Diamond } from "lucide-react";

const corporativeValues = [
    "Compromiso",
    "Confianza",
    "Respeto",
    "Esfuerzo",
    "Calidad"
];

/* ── Brand SVG Logos (simplified outlines, gold-filled) ── */
function BimboLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 160 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="32" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="36" letterSpacing="2" fill="currentColor">BIMBO</text>
        </svg>
    );
}

function CocaColaLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 240 45" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="36" fontFamily="Georgia, serif" fontWeight="700" fontSize="38" fontStyle="italic" fill="currentColor">Coca-Cola</text>
        </svg>
    );
}

function CoppelLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 180 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="32" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="34" letterSpacing="3" fill="currentColor">COPPEL</text>
        </svg>
    );
}

function TersaLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 150 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="32" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="36" letterSpacing="4" fill="currentColor">TERSA</text>
        </svg>
    );
}

function LalaLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 120 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="32" fontFamily="Arial Black, Arial" fontWeight="900" fontSize="36" letterSpacing="3" fill="currentColor">LALA</text>
        </svg>
    );
}

const brandLogos = [
    { name: "Bimbo", Logo: BimboLogo },
    { name: "Coca-Cola", Logo: CocaColaLogo },
    { name: "Coppel", Logo: CoppelLogo },
    { name: "Tersa", Logo: TersaLogo },
    { name: "Lala", Logo: LalaLogo },
];

function MarqueeTrack<T>({ items, renderItem }: { items: T[]; renderItem: (val: T, i: number) => React.ReactNode }) {
    const doubled = [...items, ...items, ...items, ...items];
    return (
        <>
            <div className="animate-marquee inline-block">
                {doubled.map((val, i) => renderItem(val, i))}
            </div>
            <div className="animate-marquee inline-block">
                {doubled.map((val, i) => renderItem(val, i + doubled.length))}
            </div>
        </>
    );
}

export function TopMarquee() {
    return (
        <div className="w-full bg-transparent overflow-hidden py-4 whitespace-nowrap flex select-none border-y border-white/5">
            <MarqueeTrack
                items={corporativeValues}
                renderItem={(val, i) => (
                    <span key={i} className="inline-flex items-center">
                        <span className="mx-6 font-display font-bold uppercase tracking-[0.2em] text-foreground/50 text-sm md:text-base transition-colors duration-300 hover:text-gold-500 cursor-default">
                            {val}
                        </span>
                        <Diamond className="w-2 h-2 text-gold-500/30 mx-2 inline-block shrink-0" />
                    </span>
                )}
            />
        </div>
    );
}

export function BottomMarquee() {
    return (
        <section className="w-full bg-transparent overflow-hidden py-10 whitespace-nowrap flex select-none relative border-y border-gold-700/20">
            <MarqueeTrack
                items={brandLogos}
                renderItem={(brand, i) => (
                    <span key={i} className="inline-flex items-center">
                        <span className="mx-10 text-gold-600 opacity-50 transition-all duration-300 hover:opacity-100 hover:text-gold-400 hover:scale-105 cursor-default">
                            <brand.Logo className="h-8 md:h-10 w-auto" />
                        </span>
                        <Diamond className="w-1.5 h-1.5 text-gold-700/30 mx-4 inline-block shrink-0" />
                    </span>
                )}
            />
        </section>
    );
}
