interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

/**
 * Small card with icon + label + value, used in property detail "Características" section.
 * Features enhanced hover states and featured variant for key metrics.
 */
export function MetricCard({
    icon,
    label,
    value,
}: MetricCardProps) {
    return (
        <div 
            className="group relative flex min-h-[132px] flex-col items-center justify-center gap-3 overflow-hidden border border-white/[0.08] bg-white/[0.025] p-4 text-center transition-colors duration-300 hover:border-[var(--color-accent)]/30"
        >
            <div className="flex size-9 shrink-0 items-center justify-center border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors duration-300">
                {icon}
            </div>
            <div className="relative min-w-0 space-y-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {label}
                </p>
                <p className="text-sm font-semibold text-white sm:text-base">
                    {value}
                </p>
            </div>
        </div>
    );
}
