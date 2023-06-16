import Image from 'next/image'
import './globals.css'
import SideBar from '@/components/sidebar/SideBar'
import logo from '../public/logo.jpg'
import Link from 'next/link'

export const metadata = {
  title: 'FM LIGTING',
  description: 'electric products online shop store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>

        <main className="all-content">
          <SideBar />
          <div className="main-content">
            {children}
          </div>
        </main>

      </body>
    </html>
  )
}
