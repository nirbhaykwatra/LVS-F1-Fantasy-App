import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'LVS F1 Fantasy',
        short_name: 'LVSF1',
        description: 'Run an LVS F1 Fantasy league with your friends!',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#e10600',
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
    }
}