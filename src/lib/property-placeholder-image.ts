const PROPERTY_PLACEHOLDER_IMAGES: Record<string, { src: string; alt: string }> = {
    residencial: {
        src: "/brand-luxury.webp",
        alt: "Residencia seleccionada en Tijuana",
    },
    comercial: {
        src: "/brand-business.webp",
        alt: "Espacio comercial en Tijuana",
    },
    industrial: {
        src: "/brand-industrial.webp",
        alt: "Nave industrial en Tijuana",
    },
};

export function getPropertyPlaceholderImage(propertyUse: string | null | undefined) {
    const key = propertyUse?.toLowerCase() ?? "";
    return PROPERTY_PLACEHOLDER_IMAGES[key] ?? PROPERTY_PLACEHOLDER_IMAGES.residencial;
}
