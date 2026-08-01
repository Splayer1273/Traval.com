import { NavLink, useLocation } from 'react-router-dom'
import { Home, Search, Heart, Luggage, User } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const TABS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/flights', label: 'Search', icon: Search },
  { to: '/wishlist', label: 'Saved', icon: Heart },
  { to: '/my-trips', label: 'Trips', icon: Luggage },
  { to: '/account', label: 'Account', icon: User },
]

export default function MobileBottomNav() {
  const location = useLocation()
  // Hide on the home hero and checkout/confirmation flows
  if (['/checkout', '/confirmation', '/login', '/register'].some((p) => location.pathname.startsWith(p))) return null
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
      <div className="grid grid-cols-5">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors',
                isActive ? 'text-brand-700' : 'text-slate-400',
              )
            }
          >
            <t.icon className="size-5" />
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
