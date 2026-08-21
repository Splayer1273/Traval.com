import { NavLink, useLocation } from 'react-router-dom'
import {
  Bell, ClipboardList, Hotel, LayoutDashboard, Luggage, Plane, Receipt, ShieldCheck, User,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { cn } from '../../lib/utils.js'

const GUEST_TABS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/flights', label: 'Flights', icon: Plane },
  { to: '/hotels', label: 'Hotels', icon: Hotel },
  { to: '/login', label: 'Login', icon: User },
  { to: '/register', label: 'Join', icon: Luggage },
]

const EMPLOYEE_TABS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/flights', label: 'Flights', icon: Plane },
  { to: '/my-trips', label: 'Trips', icon: Luggage },
  { to: '/notifications', label: 'Alerts', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
]

const APPROVER_TABS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/approvals', label: 'Approvals', icon: ClipboardList },
  { to: '/flights', label: 'Flights', icon: Plane },
  { to: '/my-trips', label: 'Trips', icon: Luggage },
  { to: '/profile', label: 'Profile', icon: User },
]

const FINANCE_TABS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/claims', label: 'Claims', icon: Receipt },
  { to: '/flights', label: 'Flights', icon: Plane },
  { to: '/my-trips', label: 'Trips', icon: Luggage },
  { to: '/profile', label: 'Profile', icon: User },
]

const ADMIN_TABS = [
  { to: '/admin', label: 'Admin', icon: LayoutDashboard, end: true },
  { to: '/approvals', label: 'Approvals', icon: ClipboardList },
  { to: '/admin/bookings', label: 'Bookings', icon: Hotel },
  { to: '/admin/policies', label: 'Policies', icon: ShieldCheck },
  { to: '/profile', label: 'Profile', icon: User },
]

function tabsFor(role, isAuthenticated) {
  if (!isAuthenticated) return GUEST_TABS
  if (role === 'admin') return ADMIN_TABS
  if (role === 'approver') return APPROVER_TABS
  if (role === 'finance') return FINANCE_TABS
  return EMPLOYEE_TABS
}

// Pages inside the booking funnel / auth flows hide the tab bar so the sticky
// action bar (MobileActionBar) or form can take the bottom of the screen.
const HIDE_ON = ['/checkout', '/confirmation', '/login', '/register', '/flights/', '/hotels/', '/packages/']

export default function MobileBottomNav() {
  const location = useLocation()
  const { isAuthenticated, role } = useAuth()
  const hidden = HIDE_ON.some((p) => location.pathname !== p && location.pathname.startsWith(p))
  if (hidden) return null

  const tabs = tabsFor(role, isAuthenticated)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-16px_rgb(15_23_42/0.25)] backdrop-blur-lg md:hidden"
      aria-label="Primary"
    >
      <div className="grid grid-cols-5">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              cn(
                'group relative flex flex-col items-center gap-1 py-2 text-[10px] font-semibold transition-colors',
                isActive ? 'text-brand-700' : 'text-slate-400',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    'absolute inset-x-3 top-0 h-0.5 rounded-full bg-gradient-to-r from-brand-500 to-sun-500 transition-opacity duration-300',
                    isActive ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full transition-all duration-300',
                    isActive ? 'bg-brand-50' : 'bg-transparent group-active:bg-slate-100',
                  )}
                >
                  <t.icon className={cn('size-5 transition-transform duration-300', isActive && '-translate-y-px scale-105')} />
                </span>
                <span className={cn(isActive && 'font-bold')}>{t.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
