import NavLeftSection from '@/components/layout/nav-left-sec'
import NavRightSection from '@/components/layout/nav-right-sec'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md support-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLeftSection />
        <NavRightSection />
      </div>
    </header>
  )
}
export default Navbar
