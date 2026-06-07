import { cn } from "@/lib/utils";

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    variant?: "default" | "featured";
}

/**
 * Small card with icon + label + value, used in property detail "Características" section.
 * Features enhanced hover states and featured variant for key metrics.
 */
export function MetricCard({
    icon,
    label,
    value,
    variant = "default",
}: MetricCardProps) {
    return (
        <div 
            className={cn(
                "group relative flex items-center gap-3 overflow-hidden border p-4 transition-colors duration-300",
                variant === "featured"
                    ? "border-[var(--color-accent)]/28 bg-white/[0.035] hover:border-[var(--color-accent)]/50"
                    : "border-white/[0.08] bg-white/[0.025] hover:border-[var(--color-accent)]/30"
            )}
        >
            <div className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                variant === "featured"
                    ? "border-[var(--color-accent)]/40 bg-[var(--color-accent)] text-black"
                    : "border-[var(--color-accent)]/25 bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
            )}>
                {icon}
            </div>
            <div className="relative min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                    {label}
                </p>
                <p className="truncate text-sm font-semibold text-white sm:text-base">
                    {value}
                </p>
            </div>
        </div>
    );
}
