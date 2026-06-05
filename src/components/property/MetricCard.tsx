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
                "group relative overflow-hidden rounded-2xl border transition-all duration-500 flex items-center gap-3 p-4",
                variant === "featured"
                    ? "bg-gradient-to-br from-gold-500/10 to-transparent border-gold-500/30 hover:border-gold-500/60 hover:shadow-[0_0_30px_-8px_rgba(212,175,55,0.15)]"
                    : "bg-card border-foreground/5 hover:border-gold-500/15"
            )}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 to-gold-500/0 group-hover:to-gold-500/5 transition-all duration-500" />
            
            {/* Icon container */}
            <div className={cn(
                "size-10 rounded-full flex items-center justify-center shrink-0 border transition-all duration-500",
                variant === "featured"
                    ? "bg-gold-500/20 border-gold-500/40 text-gold-500 group-hover:scale-110 group-hover:bg-gold-500/30"
                    : "bg-gold-500/10 border-gold-500/20 text-gold-500"
            )}>
                {icon}
            </div>
            
            {/* Label and Value */}
            <div className="relative min-w-0">
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
