import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Black Corporativo',
        short_name: 'Black Corp',
        description: 'Boutique Inmobiliaria de Alto Nivel - Comercial, Industrial y Residencial.',
        start_url: '/',
        display: 'standalone',
        background_color: '#09090b', // zinc-950
        theme_color: '#09090b',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
