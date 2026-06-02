import type { AgentInfo } from "./AgentCard";

/**
 * JSON-LD structured data for a single property listing, per schema.org/RealEstateListing.
 * Rendered as a <script type="application/ld+json"> in the page head.
 *
 * Why this matters: real estate sites that ship JSON-LD get rich results in
 * Google Search (price, address, photo carousel, agent). This is the single
 * highest-ROI frontend change for a property site.
 */
export interface PropertyJsonLdProps {
    title: string;
    description: string;
    address: string;
    coverImage: string | null;
    price: number;
    currency: string;
    priceMxn?: number | null;
    businessType: string;
    propertyType: string;
    m2Construction?: number | null;
    m2Terrain?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    agents?: AgentInfo[];
    url: string;
}

export function PropertyJsonLd(props: PropertyJsonLdProps) {
    const {
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
    } = props;

    const schema = {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: title,
        description,
        url,
        image: coverImage ? [coverImage] : undefined,
        datePosted: new Date().toISOString(),
        address: {
            "@type": "PostalAddress",
            streetAddress: address,
            addressCountry: "MX",
        },
        offers: {
            "@type": "Offer",
            price,
            priceCurrency: currency,
            // Schema standardizes "For Sale" / "For Rent"
            businessType:
                businessType === "Renta" ? "For Rent" : "For Sale",
        },
        // Optional: surface MXN equivalent for SEO if the listing is in USD
        ...(priceMxn && currency !== "MXN" && {
            priceSpecification: {
                "@type": "PriceSpecification",
                price: priceMxn,
                priceCurrency: "MXN",
            },
        }),
        // Real estate specifics
        ...(m2Construction ? { floorSize: { "@type": "QuantitativeValue", value: m2Construction, unitCode: "MTK" } } : {}),
        ...(m2Terrain ? { lotSize: { "@type": "QuantitativeValue", value: m2Terrain, unitCode: "MTK" } } : {}),
        ...(propertyType ? { category: propertyType } : {}),
        // Real estate agent
        ...(agents && agents.length > 0
            ? {
                  broker: agents.map((a) => ({
                      "@type": "RealEstateAgent",
                      name: a.full_name,
                      ...(a.email ? { email: a.email } : {}),
                      ...(a.phone ? { telephone: a.phone } : {}),
                      ...(a.license_number ? { identifier: a.license_number } : {}),
                  })),
              }
            : {}),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
