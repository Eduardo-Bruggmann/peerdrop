import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Main from '@/components/Main'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'PeerDrop',
  description: 'A peer-to-peer file sharing app built with Next.js and WebRTC.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-1 flex-col justify-center items-center h-screen w-screen">
        <Header />
        <Main>{children}</Main>
        <Footer />
      </body>
    </html>
  )
}
