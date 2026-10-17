'use client'

import Link from 'next/link'

const NavLeftSection = () => {
  return (
    <div className="flex items-center gap-6">
      <Link href="/" className="flex items-center space-x-2">
        <span className="font-extrabold text-xl tracking-tight text-primary uppercase">
          IbnoStore
        </span>
      </Link>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link href="/" className="transition-colors hover:text-foreground text-foreground">
          Shop All
        </Link>
        <Link
          href="/featured"
          className="transition-colors hover:text-foreground text-muted-foreground"
        >
          Featured
        </Link>
      </nav>
    </div>
  )
}
export default NavLeftSection
