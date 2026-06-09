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
            className="group relative flex min-h-[104px] min-w-0 flex-col items-center justify-center gap-2 overflow-hidden border border-white/[0.08] bg-white/[0.025] p-2 text-center transition-colors duration-300 hover:border-[var(--color-accent)]/30 sm:min-h-[132px] sm:gap-3 sm:p-4"
        >
            <div className="flex size-8 shrink-0 items-center justify-center border border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-[var(--color-accent)] transition-colors duration-300 sm:size-9">
                {icon}
            </div>
            <div className="relative min-w-0 space-y-1">
                <p className="break-words property-tag-type text-white/45">
                    {label}
                </p>
                <p className="break-words text-display-3 leading-snug text-white">
                    {value}
                </p>
            </div>
        </div>
    );
}
