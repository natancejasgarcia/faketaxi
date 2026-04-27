import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import BottomNav from '@/components/BottomNav'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'FakeTaxi – Mis Carreras',
  description: 'Registra tus carreras de taxi rápidamente',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0d1117',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-[#0d1117]">
        <main className="flex-1 pb-20 overflow-y-auto">{children}</main>
        <BottomNav />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#21262d',
              color: '#f0f6fc',
              border: '1px solid #30363d',
              borderRadius: '12px',
              fontSize: '15px',
            },
          }}
        />
      </body>
    </html>
  )
}
