import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UY QUE HEAVY — Conversaciones profundas',
  description: 'Una experiencia digital premium para generar conversaciones emotivas y reales.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
