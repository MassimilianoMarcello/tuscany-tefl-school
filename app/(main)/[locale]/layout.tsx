// app/[locale]/layout.tsx
// ✅ Root layout — avvolge tutta l'app con NextIntlClientProvider
//    Questo layout sostituisce app/layout.tsx come punto di ingresso principale

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import "../../globals.css"
import { Navbar } from "@/components/navbar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Tuscany TEFL School",
  description: "Get your TEFL certification in Tuscany",
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  // Valida la locale — se non è supportata mostra 404
  if (!routing.locales.includes(locale as "it" | "en")) {
    notFound()
  }

  // Carica i messaggi per la locale corrente
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
           <Navbar locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}