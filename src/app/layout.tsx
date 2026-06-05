import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LaoShopLink - Turn your Facebook page into an online store',
  description: 'LaoShopLink helps Lao Facebook sellers create an online store in minutes. Share product links, receive orders, and grow your business.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="lo">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
