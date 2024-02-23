import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MUNCH....',
  description: 'What\'s to eat',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* <!DOCTYPE html> */}
      <html lang="en">
        {/* <link rel="stylesheet" href="dist/heat.js.css" />
        <script src="dist/heat.js"></script>
        <div id="heat-map" data-heat-options="{ 'views': { 'map': { 'showDayNames': true } } }">
          Your HTML.
        </div> */}
        <body className={inter.className}>{children}</body>
      </html>
    </>
  )
}
