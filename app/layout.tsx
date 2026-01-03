import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bilgoo - Türkiye\'nin En Eğlenceli Quiz Oyunu',
  description: 'Ücretsiz Türkçe bilgi yarışması! Genel kültür, bilim, tarih ve daha fazla kategoride binlerce soru.',
  keywords: 'bilgi yarışması, quiz, test, genel kültür, eğitim, oyun, türkçe, online, ücretsiz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#667eea" />
      </head>
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
