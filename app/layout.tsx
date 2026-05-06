import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UY QUE HEAVY — Conversaciones guiadas',
  description: 'App conversacional mobile-first para abrir conversaciones profundas entre pareja, amigos y familia con cartas privadas y cierre emocional.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UY QUE HEAVY'
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/pwa-icon.svg',
    apple: '/apple-touch-icon.svg'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#f7efe8" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
