"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SECTION_HEADING =
    "property-tag-type text-white/48";

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
                    className="group mt-3 inline-flex items-center gap-2 text-white/78 transition-colors duration-300 hover:text-[var(--color-accent)]"
                >
                    <span className="property-tag-type relative pb-1">
                        {expanded ? "Leer menos" : "Leer más"}
                        <span className="absolute bottom-0 left-0 h-px w-full bg-current opacity-45 transition-opacity duration-300 group-hover:opacity-100" />
                    </span>
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
