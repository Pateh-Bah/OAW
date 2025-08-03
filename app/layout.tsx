import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AccessibilityProvider } from '@/components/accessibility-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Overhead Aluminium Workshop',
  description: 'Professional aluminium workshop management system for Freetown, Sierra Leone',
  keywords: 'aluminium, workshop, construction, Sierra Leone, Freetown, windows, doors, cabinets',
  authors: [{ name: 'Overhead Aluminium Workshop' }],
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  // Enhanced mobile metadata
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OAW Workshop',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // Allow zoom for accessibility
  userScalable: true,
  viewportFit: 'cover', // Handle notched screens
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={inter.className}
        suppressHydrationWarning={true}
        data-new-gr-c-s-check-loaded=""
        data-gr-ext-installed=""
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AccessibilityProvider />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}