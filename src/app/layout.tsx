import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import BottomNav from '@/components/BottomNav'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'DevOS Control Center', template: '%s — DevOS' },
  description: 'CEO operating dashboard — DevOS autonomous software company',
  robots:   { index: false, follow: false },
  manifest: '/manifest.json',
  appleWebApp: {
    capable:        true,
    title:          'DevOS',
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  themeColor:    '#0a0a0a',
  width:         'device-width',
  initialScale:  1,
  viewportFit:   'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0a0a0a] text-slate-100 antialiased">
        <div className="flex h-screen overflow-hidden">
          {/* Desktop sidebar — hidden on mobile */}
          <Sidebar />
          {/* Main content — bottom padding on mobile for bottom nav */}
          <main className="flex-1 md:ml-64 overflow-y-auto pb-20 md:pb-0">
            {children}
          </main>
        </div>
        {/* Mobile bottom navigation — hidden on desktop */}
        <BottomNav />
      </body>
    </html>
  )
}
