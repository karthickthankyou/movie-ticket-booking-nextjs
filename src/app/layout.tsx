import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'mapbox-gl/dist/mapbox-gl.css'

import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from '@/trpc/clients/client'
import { Toaster } from '@/components/molecules/Toaster/toaster'
import { Navbar } from '@/components/organisms/Navbar'
import { Container } from '@/components/atoms/container'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Showtime!',
  description: 'Karthick Ragavendran',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body className={inter.className}>
            <Toaster />
            <Navbar />
            <Container>{children}</Container>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  )
}
