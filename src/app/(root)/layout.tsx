// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'AVD Soluções - Plataforma Completa de Gestão de RH',
  description: 'Soluções inovadoras em gestão de recursos humanos. Automatize processos, aumente a produtividade e transforme seu RH.',
  keywords: 'RH, gestão de pessoas, software RH, recursos humanos, Angola',
  authors: [{ name: 'AVD Soluções' }],
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-AO" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${inter.className} antialiased bg-gradient-to-br from-slate-900 to-slate-800 text-slate-900`}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
         
        </div>
      </body>
    </html>
  )
}