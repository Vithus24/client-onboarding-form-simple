import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Onboarding Form',
  description: 'Professional onboarding form with validation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}