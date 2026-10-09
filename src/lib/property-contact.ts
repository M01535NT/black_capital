/** Keep property identity and intent together when handing off to contact. */
export function propertyContactHref({ propertyId, propertyTitle, brand, objective = 'consultar-propiedad' }: {
    propertyId: string;
    propertyTitle: string;
    brand?: string;
    objective?: 'consultar-propiedad' | 'solicitar-visita';
}) {
    const params = new URLSearchParams({ property_id: propertyId, propiedad: propertyTitle, objetivo: objective });
    if (brand) params.set('brand', brand);
    return `/contacto?${params.toString()}`;
}
