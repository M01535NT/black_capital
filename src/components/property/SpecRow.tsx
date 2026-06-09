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
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-2 last:border-b-0">
            <span className="property-tag-type text-white/45">{label}</span>
            <span
                className={`text-right text-body text-white/78 ${
                    mono ? "font-mono text-body-sm" : ""
                }`}
            >
                {value}
            </span>
        </div>
    );
}
