const PROPERTY_PLACEHOLDER_IMAGES: Record<string, { src: string; alt: string }> = {
    residencial: {
        src: "/brand-luxury.webp",
        alt: "Residencia placeholder en Tijuana",
    },
    comercial: {
        src: "/brand-business.webp",
        alt: "Espacio comercial placeholder en Tijuana",
    },
    industrial: {
        src: "/brand-industrial.webp",
        alt: "Nave industrial placeholder en Tijuana",
    },
};

export function getPropertyPlaceholderImage(propertyUse: string | null | undefined) {
    const key = propertyUse?.toLowerCase() ?? "";
    return PROPERTY_PLACEHOLDER_IMAGES[key] ?? PROPERTY_PLACEHOLDER_IMAGES.residencial;
}
