"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTION_HEADING =
    "font-display text-xs font-bold uppercase tracking-wide-display text-foreground/50";

/**
 * Property description block with read more/less toggle and premium typography.
 * Aligned with Home design aesthetic.
 */
export function PropertyDescription({ description }: { description: string }) {
    const [expanded, setExpanded] = useState(false);
    const isLong = description.length > 400;
    const displayText = isLong && !expanded ? description.slice(0, 400) + "..." : description;

    return (
        <section className="space-y-5">
            {/* Heading con hairline */}
            <div className="flex items-center gap-3">
                <span className="h-px w-10 bg-[var(--color-accent)]/60" />
                <h2 className={SECTION_HEADING}>Descripción</h2>
            </div>
            
            {/* Texto con tipografía premium */}
            <div className="text-body-lg text-foreground/70 leading-[1.85] whitespace-pre-wrap max-w-prose">
                {displayText}
            </div>
            
            {/* Botón Leer más/menos */}
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gold-500 hover:text-gold-400 transition-colors group"
                >
                    {expanded ? "Leer menos" : "Leer más"}
                    <ChevronDown 
                        className={cn(
                            "size-4 transition-transform duration-300",
                            expanded && "rotate-180"
                        )}
                    />
                </button>
            )}
        </section>
    );
}
