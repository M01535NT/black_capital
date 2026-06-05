/**
 * JSON-LD server component.
 *
 * Renders a <script type="application/ld+json"> for structured data.
 * Place in the server-component JSX of a page; it will be serialized
 * into the SSR HTML. Search engines read it from the body (or head,
 * depending on the consumer).
 *
 * Per the FRONTEND_RECOMMENDATIONS.md Section 10, every public page
 * should expose a schema relevant to its content (Organization, WebSite,
 * ItemList, AboutPage, Product/Offer, etc).
 *
 * @example
 *   <JsonLd data={{
 *     "@context": "https://schema.org",
 *     "@type": "RealEstateAgent",
 *     name: "Black Corporativo",
 *   }} />
 */

interface JsonLdProps {
    data:
        | Record<string, unknown>
        | Record<string, unknown>[]
        | object
        | object[];
    /** Optional id. If you have multiple blocks on the same page, set distinct ids. */
    id?: string;
}

export function JsonLd({ data, id = "ld-jsonld" }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            id={id}
            // Safe: data is server-controlled, never user input.
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
