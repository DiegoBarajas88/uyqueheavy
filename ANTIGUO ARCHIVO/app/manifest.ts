import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UY QUE HEAVY',
    short_name: 'UYQH',
    description: 'Rondas conversacionales privadas para abrir conversaciones profundas desde el celular.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f7efe8',
    theme_color: '#f7efe8',
    lang: 'es-CO',
    categories: ['games', 'lifestyle', 'entertainment'],
    icons: [
      {
        src: '/pwa-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      },
      {
        src: '/apple-touch-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml'
      }
    ]
  }
}
