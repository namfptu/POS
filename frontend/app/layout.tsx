import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google' // Import Nunito_Sans
import './globals.css'
import { AuthProvider } from '@/context/auth-context'; // Import AuthProvider

const nunitoSans = Nunito_Sans({ // Configure Nunito_Sans
  subsets: ['latin'],
  variable: '--font-nunito-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} font-sans antialiased`}> {/* Apply Nunito_Sans variable */}
        <AuthProvider> {/* Wrap children with AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
