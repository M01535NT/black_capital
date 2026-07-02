export type PropertyFaq = { q: string; a: string };
export type FaqCatalogItem = { id: string; q: string; a: string };

/** Selección permitida por propiedad. */
export const FAQ_MIN = 3;
export const FAQ_MAX = 5;

/**
 * Catálogo fijo de preguntas frecuentes. Las respuestas son SIEMPRE las mismas
 * para la misma pregunta (fuente única de verdad): el agente solo elige cuáles
 * mostrar con un checkbox, no edita el texto. La columna `properties.faqs`
 * guarda únicamente los ids seleccionados y aquí se resuelve el contenido.
 */
export const FAQ_CATALOG: FaqCatalogItem[] = [
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

const CATALOG_BY_ID = new Map(FAQ_CATALOG.map((item) => [item.id, item]));

/** Normaliza el JSON de la columna `faqs` a una lista de ids válidos del catálogo. */
export function parseFaqIds(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    const seen = new Set<string>();
    const ids: string[] = [];
    for (const item of raw) {
        // Formato actual: array de ids. Se tolera el formato legado {id} por si acaso.
        const id = typeof item === "string" ? item : (item as { id?: unknown })?.id;
        if (typeof id === "string" && CATALOG_BY_ID.has(id) && !seen.has(id)) {
            seen.add(id);
            ids.push(id);
        }
    }
    return ids;
}

/**
 * Resuelve el JSON de `faqs` a los {q, a} del catálogo, respetando el orden de
 * selección. Server-safe (sin "use client"): la usa el server component de la
 * ficha y también el admin. Los ids desconocidos se descartan.
 */
export function resolvePropertyFaqs(raw: unknown): PropertyFaq[] {
    return parseFaqIds(raw).map((id) => {
        const item = CATALOG_BY_ID.get(id)!;
        return { q: item.q, a: item.a };
    });
}
