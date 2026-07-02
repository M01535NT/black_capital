export type PropertyFaq = { q: string; a: string };

/**
 * Normaliza el JSON de la columna `faqs` a un arreglo válido de {q, a}.
 * Pura y server-safe: se usa tanto en el server component de la ficha como
 * en el componente cliente PropertyFAQ.
 */
export function parsePropertyFaqs(raw: unknown): PropertyFaq[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter(
            (item): item is PropertyFaq =>
                !!item &&
                typeof item === "object" &&
                typeof (item as PropertyFaq).q === "string" &&
                typeof (item as PropertyFaq).a === "string" &&
                (item as PropertyFaq).q.trim().length > 0 &&
                (item as PropertyFaq).a.trim().length > 0,
        )
        .map((item) => ({ q: item.q.trim(), a: item.a.trim() }));
}
