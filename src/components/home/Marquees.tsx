import { Diamond } from "lucide-react";

const corporativeValues = [
    "Compromiso",
    "Confianza",
    "Respeto",
    "Esfuerzo",
    "Calidad",
    "Trayectoria",
    "Excelencia",
];

/* ── Brand names (text-based, no fake logos) ── */
const brandNames = [
    "Portafolio Luxury",
    "Portafolio Business",
    "Portafolio Industrial",
    "Inversión Segura",
    "Alto Rendimiento",
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
                items={brandNames}
                renderItem={(brand, i) => (
                    <span key={i} className="inline-flex items-center">
                        <span className="mx-10 text-gold-600 opacity-50 transition-all duration-300 hover:opacity-100 hover:text-gold-400 hover:scale-105 cursor-default font-display font-bold uppercase tracking-[0.3em] text-sm">
                            {brand}
                        </span>
                        <Diamond className="w-1.5 h-1.5 text-gold-700/30 mx-4 inline-block shrink-0" />
                    </span>
                )}
            />
        </section>
    );
}
