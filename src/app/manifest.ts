import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Black Capital',
        short_name: 'Black Capital',
        description: 'Inmobiliaria en Tijuana para activos residenciales, comerciales e industriales.',
        id: '/',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#09090b', // zinc-950
        theme_color: '#09090b',
        orientation: 'portrait-primary',
        icons: [
            {
                src: '/icon-192x192.webp',
                sizes: '192x192',
                type: 'image/webp',
            },
            {
                src: '/icon-512x512.webp',
                sizes: '512x512',
                type: 'image/webp',
                purpose: 'maskable',
            },
        ],
    };
}
