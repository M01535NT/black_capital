"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTION_HEADING =
    "text-[11px] font-bold uppercase tracking-[0.18em] text-white/48";

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
            <div className="max-w-prose whitespace-pre-wrap text-body-fluid leading-[1.8] text-white/66">
                {displayText}
            </div>
            
            {/* Botón Leer más/menos */}
            {isLong && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="group mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--color-accent)]/35 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)] transition-colors hover:bg-[var(--color-accent)] hover:text-black"
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
