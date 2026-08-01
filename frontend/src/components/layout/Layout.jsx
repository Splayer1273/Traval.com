import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import MobileBottomNav from './MobileBottomNav.jsx'
import { cn } from '../../lib/utils.js'

export default function Layout({ padded = true }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  const isFullBleed = pathname === '/' || pathname.startsWith('/checkout') || pathname.startsWith('/confirmation')

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className={cn('flex-1', !padded && 'flex flex-col', !isFullBleed && 'pb-16 md:pb-0')}>
        <Outlet />
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  )
}
