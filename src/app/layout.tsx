import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthProvider }         from '@/contexts/AuthContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ThemeProvider }         from '@/contexts/ThemeContext'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default:  'Blog Platform',
    template: '%s | Blog Platform',
  },
  description: 'Une plateforme de blog communautaire moderne.',
  openGraph: {
    type:   'website',
    locale: 'fr_FR',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0D10',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col antialiased">
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
