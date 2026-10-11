import '@/app/global.css'

interface Children {
  children: React.ReactNode
}

const Layout = ({ children }: Children) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
export default Layout
