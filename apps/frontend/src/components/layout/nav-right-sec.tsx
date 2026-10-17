'use client'

import { Button } from '@/components/ui/button'

const NavRightSection = () => {
  const cartItemsCount = 2
  const isLoggedIn = false

  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="sm" className="relative flex items-center gap-2">
        <span>Cart</span>
        {cartItemsCount > 0 && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {cartItemsCount}
          </span>
        )}
      </Button>

      {isLoggedIn ? (
        <Button size="sm" variant="ghost">
          Dashboard
        </Button>
      ) : (
        <Button size="sm">Sign In</Button>
      )}
    </div>
  )
}
export default NavRightSection
