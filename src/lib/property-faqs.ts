export type PropertyFaq = { q: string; a: string };
export type FaqCatalogItem = { id: string; q: string; a: string };

/** Selección permitida por propiedad. */
export const FAQ_MIN = 3;
export const FAQ_MAX = 5;

/**
 * Catálogo semilla de preguntas frecuentes. Es el DEFAULT: al editar el
 * catálogo desde el admin, la versión vigente se guarda en `app_settings`
 * (key `faq_catalog`) y esta constante solo se usa cuando aún no hay datos.
 * Las respuestas son globales: la misma pregunta muestra la misma respuesta
 * en todas las propiedades. La columna `properties.faqs` guarda solo ids.
 */
export const DEFAULT_FAQ_CATALOG: FaqCatalogItem[] = [
    {
        id: "legal",
        q: "¿Cuál es la situación legal de la propiedad?",
        a: "Revisamos escritura, boleta predial y gravámenes antes de publicar. La documentación está disponible para revisión con tu notario.",
    },
    {
        id: "documentos",
        q: "¿Puedo revisar la documentación antes de decidir?",
        a: "Sí. La carpeta documental se comparte a través de la solicitud de documentos de esta página, con un proceso de acceso controlado.",
    },
    {
        id: "visita",
        q: "¿Puedo agendar una visita?",
        a: "Claro. Coordinamos una visita guiada con un asesor, con información previa del inmueble y de la zona.",
    },
    {
        id: "pago",
        q: "¿Qué formas de pago aceptan?",
        a: "Crédito bancario, INFONAVIT/FOVISSSTE y pago de contado, según el perfil de la operación. Te conectamos con instituciones para precalificar.",
    },
    {
        id: "precio",
        q: "¿El precio es negociable?",
        a: "El precio publicado es de lista. Cualquier propuesta se presenta al propietario para su consideración.",
    },
    {
        id: "gastos",
        q: "¿Qué gastos adicionales debo considerar?",
        a: "Escrituración, honorarios notariales, avalúo e impuestos aplicables. Te preparamos una estimación de costos de cierre.",
    },
    {
        id: "apartado",
        q: "¿Cómo se aparta la propiedad?",
        a: "Con un anticipo y la firma de un convenio. El asesor te explica el proceso, los montos y los tiempos.",
    },
    {
        id: "tiempos",
        q: "¿Cuánto tarda el proceso completo?",
        a: "Depende de la documentación y la forma de pago. Definimos una ruta de cierre con tiempos estimados por etapa.",
    },
    {
        id: "asesor",
        q: "¿Con quién trato durante el proceso?",
        a: "Con un asesor asignado de Black Capital, sin intermediarios, que da seguimiento directo a tu operación.",
    },
    {
        id: "zona",
        q: "¿Cómo es la zona y los servicios?",
        a: "Confirmamos servicios, vías de acceso y entorno del corredor. Compartimos referencias de la zona al agendar tu visita.",
    },
    {
        id: "comision",
        q: "¿El comprador paga comisión?",
        a: "No. Nuestra comisión la cubre la parte vendedora, salvo acuerdo distinto informado por adelantado.",
    },
];

/**
 * Valida y limpia un catálogo (venga de la BD o del cliente): cada item debe
 * tener id, q y a como strings no vacíos; se recortan espacios y se descartan
 * ids duplicados o inválidos. Devuelve el default si no queda nada válido.
 */
export function normalizeFaqCatalog(raw: unknown): FaqCatalogItem[] {
    if (!Array.isArray(raw)) return DEFAULT_FAQ_CATALOG;
    const seen = new Set<string>();
    const items: FaqCatalogItem[] = [];
    for (const entry of raw) {
        if (!entry || typeof entry !== "object") continue;
        const { id, q, a } = entry as Record<string, unknown>;
        if (typeof id !== "string" || typeof q !== "string" || typeof a !== "string") continue;
        const cleanId = id.trim();
        const cleanQ = q.trim();
        const cleanA = a.trim();
        if (!cleanId || !cleanQ || !cleanA || seen.has(cleanId)) continue;
        seen.add(cleanId);
        items.push({ id: cleanId, q: cleanQ, a: cleanA });
    }
    return items.length > 0 ? items : DEFAULT_FAQ_CATALOG;
}

/** Ids válidos (presentes en el catálogo dado), sin duplicados, en orden de selección. */
export function parseFaqIds(raw: unknown, catalog: FaqCatalogItem[]): string[] {
    if (!Array.isArray(raw)) return [];
    const byId = new Set(catalog.map((c) => c.id));
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const item of raw) {
        const id = typeof item === "string" ? item : (item as { id?: unknown })?.id;
        if (typeof id === "string" && byId.has(id) && !seen.has(id)) {
            seen.add(id);
            ids.push(id);
        }
    }
    return ids;
}

/**
 * Resuelve el JSON de `faqs` (ids) a los {q, a} del catálogo dado, respetando el
 * orden de selección. Server-safe. Los ids que ya no existen se descartan.
 */
export function resolvePropertyFaqs(raw: unknown, catalog: FaqCatalogItem[]): PropertyFaq[] {
    const byId = new Map(catalog.map((c) => [c.id, c]));
    return parseFaqIds(raw, catalog).map((id) => {
        const item = byId.get(id)!;
        return { q: item.q, a: item.a };
    });
}
