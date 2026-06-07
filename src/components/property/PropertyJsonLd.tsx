interface AgentInfo {
    id: string;
    full_name: string;
    email: string | null;
    phone: string | null;
    photo_url: string | null;
    license_number: string | null;
}

export interface PropertyJsonLdProps {
    title: string;
    description?: string | null;
    address: string;
    coverImage?: string | null;
    price: number;
    currency: string;
    priceMxn?: number | null;
    businessType: string;
    propertyType: string;
    m2Construction?: number | null;
    m2Terrain?: number | null;
    agents?: AgentInfo[];
    url: string;
}

export function PropertyJsonLd({
    title,
    description,
    address,
    coverImage,
    price,
    currency,
    priceMxn,
    businessType,
    propertyType,
    m2Construction,
    m2Terrain,
    agents,
    url,
}: PropertyJsonLdProps) {
    const typeMap: Record<string, string> = {
        casa: 'House',
        departamento: 'Apartment',
        terreno: 'Land',
        local: 'Place',
        oficina: 'Place',
        bodega: 'Place',
        'nave industrial': 'Place',
    };
    const mappedType = typeMap[propertyType.toLowerCase()] || 'Residence';

    const ld: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': mappedType,
        '@id': `https://blackcorporativo.vercel.app${url}`,
        url: `https://blackcorporativo.vercel.app${url}`,
        name: title,
        description: description || `${propertyType} en ${address}`,
        image: coverImage || undefined,
        address: {
            '@type': 'PostalAddress',
            streetAddress: address,
            addressRegion: 'Baja California',
            addressCountry: 'MX',
        },
        offers: {
            '@type': 'Offer',
            price: price,
            priceCurrency: currency || 'MXN',
            businessFunction: businessType,
            availability: 'https://schema.org/InStock',
        },
    };

    if (priceMxn != null && currency !== "MXN") {
        ld.additionalProperty = [
            {
                "@type": "PropertyValue",
                name: "Precio aproximado MXN",
                value: priceMxn,
            },
        ];
    }

    if (m2Construction != null) {
        (ld.offers as Record<string, unknown>).floorSize = {
            '@type': 'QuantitativeValue',
            value: m2Construction,
            unitCode: 'MTK',
        };
    }

    if (m2Terrain != null) {
        ld.landSize = {
            '@type': 'QuantitativeValue',
            value: m2Terrain,
            unitCode: 'MTK',
        };
    }

    if (agents && agents.length > 0) {
        const agent = agents[0];
        ld.broker = {
            '@type': 'RealEstateAgent',
            name: agent.full_name || 'Black Capital',
            ...(agent.email && { email: agent.email }),
            ...(agent.phone && { telephone: agent.phone }),
            worksFor: {
                '@type': 'Organization',
                name: 'Black Capital',
                url: 'https://blackcorporativo.vercel.app',
            },
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
    );
}
