import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  UserRound, Luggage, CalendarClock, History, Bookmark, Heart, CreditCard,
  Bell, SlidersHorizontal, ShieldCheck, Headphones, LogOut, Plane,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { Avatar, AvatarFallback } from '../../components/ui/avatar.jsx'
import { cn } from '../../lib/utils.js'

const NAV = [
  { to: '/account', label: 'Profile', icon: UserRound, end: true },
  { to: '/account/bookings', label: 'My Bookings', icon: Luggage },
  { to: '/account/upcoming', label: 'Upcoming Trips', icon: CalendarClock },
  { to: '/account/past', label: 'Past Trips', icon: History },
  { to: '/account/saved', label: 'Saved Trips', icon: Bookmark },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/payments', label: 'Payment Methods', icon: CreditCard },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
  { to: '/account/preferences', label: 'Travel Preferences', icon: SlidersHorizontal },
  { to: '/account/security', label: 'Security', icon: ShieldCheck },
  { to: '/account/support', label: 'Help & Support', icon: Headphones },
]

export default function AccountLayout() {
  const { user, logout } = useAuth()
  const { success } = useToast()
  const navigate = useNavigate()

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : 'U'

  const handleLogout = async () => {
    await logout()
    success('You have been signed out.', 'See you soon')
    navigate('/')
  }

  return (
    <div className="bg-slate-50">
      <div className="container-x py-8">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-6 text-white shadow-lift">
          <Avatar className="size-16 border-2 border-white/40">
            {user?.avatar ? <img src={user.avatar} alt={user.firstName} className="size-full object-cover" /> : null}
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-semibold">
              Welcome back, {user?.firstName || 'Traveller'} 👋
            </h1>
            <p className="text-sm text-brand-100">Member since {user?.memberSince ? new Date(user.memberSince).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '2024'}</p>
          </div>
          <div className="hidden gap-6 text-center sm:flex">
            <div><p className="font-display text-2xl font-bold">3</p><p className="text-xs text-brand-200">Upcoming trips</p></div>
            <div><p className="font-display text-2xl font-bold">12</p><p className="text-xs text-brand-200">Trips completed</p></div>
            <div><p className="font-display text-2xl font-bold">8</p><p className="text-xs text-brand-200">Saved trips</p></div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <nav className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-card lg:overflow-visible">
              <div className="flex gap-1 lg:flex-col">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors',
                        isActive
                          ? 'bg-brand-600 text-white shadow-glow'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                      )
                    }
                  >
                    <item.icon className="size-4" /> {item.label}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 lg:mt-1"
                >
                  <LogOut className="size-4" /> Logout
                </button>
              </div>
            </nav>
            <div className="mt-4 hidden rounded-2xl bg-gradient-to-br from-sun-50 to-amber-50 p-5 lg:block">
              <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Plane className="size-4 text-sun-600" /> Sunrise Rewards</p>
              <p className="mt-1 text-xs text-slate-500">Earn 5 points per ₹100 spent. You have <span className="font-bold text-sun-600">2,450 pts</span>.</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sun-500 to-sun-600" />
              </div>
              <p className="mt-2 text-[11px] text-slate-500">Next reward at 3,000 pts — a free airport lounge pass!</p>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
