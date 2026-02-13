import type { Metadata } from 'next'
import './globals.css'

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
      <body className="flex flex-1 justify-center items-center h-screen w-screen p-5 antialiased ">
        {children}
      </body>
    </html>
  )
}
