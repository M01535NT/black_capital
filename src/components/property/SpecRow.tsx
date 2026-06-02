/**
 * Single key-value row used in the property detail sidebar "Ficha Técnica" card.
 */
export function SpecRow({
    label,
    value,
    mono = false,
}: {
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="flex items-center justify-between gap-3 py-1">
            <span className="text-[11px] text-foreground/40 uppercase tracking-wider">{label}</span>
            <span
                className={`text-sm font-medium text-foreground text-right ${
                    mono ? "font-mono text-xs" : ""
                }`}
            >
                {value}
            </span>
        </div>
    );
}
