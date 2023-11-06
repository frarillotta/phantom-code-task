import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const satoshi = localFont({src: '../../public/fonts/Satoshi/Satoshi-Variable.woff2'})

export const metadata: Metadata = {
  title: 'Phantom code test',
  description: 'A simple bookmark app!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={satoshi.className}>{children}</body>
    </html>
  )
}
