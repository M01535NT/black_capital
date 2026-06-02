const SECTION_HEADING =
    "font-display text-xs font-bold uppercase tracking-[0.2em] text-foreground/40";

/**
 * Property description block with the section heading.
 */
export function PropertyDescription({ description }: { description: string }) {
    return (
        <section className="space-y-4">
            <h2 className={SECTION_HEADING}>Descripción</h2>
            <div className="text-sm sm:text-[0.9375rem] text-foreground/60 leading-[1.75] whitespace-pre-wrap max-w-prose">
                {description}
            </div>
        </section>
    );
}
