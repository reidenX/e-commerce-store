import '@/app/global.css'
import Navbar from '@/components/layout/navbar'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Production Storefront',
  description: 'Next.js + Tailwind + shadcn/ui Decoupled Client Engine',
}
interface Children {
  children: React.ReactNode
}

const Layout = ({ children }: Children) => {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} antialiased h-full flex flex-col bg-slate-50/50`}>
        <Navbar />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  )
}
export default Layout
