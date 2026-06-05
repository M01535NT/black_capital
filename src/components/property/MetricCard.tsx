/**
 * Small card with icon + label + value, used in property detail "Características" section.
 */
export function MetricCard({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-foreground/5 hover:border-gold-500/15 transition-all duration-300 flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-[calc(33.333%-0.5rem)] max-w-[calc(50%-0.375rem)] sm:max-w-[calc(33.333%-0.5rem)]">
            <div className="size-10 rounded-full bg-gold-500/10 flex items-center justify-center shrink-0 border border-gold-500/20">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-caption uppercase tracking-card text-foreground/50 font-semibold">
                    {label}
                </p>
                <p className="font-numerics font-semibold text-foreground text-sm sm:text-base truncate">
                    {value}
                </p>
            </div>
        </div>
    );
}
