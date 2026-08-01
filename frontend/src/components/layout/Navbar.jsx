import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell, ChevronDown, Heart, LogOut, Menu, Plane, Hotel, Briefcase,
  Map, Tag, Luggage, HelpCircle, User, Settings, Bookmark, CreditCard,
  Languages,
} from 'lucide-react'
import Logo from './Logo.jsx'
import { Button } from '../ui/button.jsx'
import { Badge } from '../ui/badge.jsx'
import { Avatar, AvatarFallback } from '../ui/avatar.jsx'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet.jsx'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '../ui/dropdown-menu.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCurrency } from '../../context/CurrencyContext.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { NOTIFICATIONS } from '../../data/users.js'
import { cn } from '../../lib/utils.js'

const NAV_LINKS = [
  { to: '/flights', label: 'Flights', icon: Plane },
  { to: '/hotels', label: 'Hotels', icon: Hotel },
  { to: '/packages', label: 'Packages', icon: Briefcase },
  { to: '/destinations', label: 'Destinations', icon: Map },
  { to: '/offers', label: 'Offers', icon: Tag },
  { to: '/my-trips', label: 'My Trips', icon: Luggage },
  { to: '/help', label: 'Help', icon: HelpCircle },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { currency, setCurrency, language, setLanguage, currencies, languages } = useCurrency()
  const { count: wishlistCount } = useWishlist()
  const { success } = useToast()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const unread = notifs.filter((n) => !n.read).length

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : ''

  const handleLogout = async () => {
    await logout()
    success('You have been signed out. See you soon!')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div className="container-x flex h-16 items-center justify-between gap-3 sm:h-[72px]">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="border-b border-slate-100 p-5">
              <Logo />
            </div>
            <nav className="flex flex-col gap-1 px-3 py-4">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50',
                    )
                  }
                >
                  <l.icon className="size-4" /> {l.label}
                </NavLink>
              ))}
              <div className="my-2 h-px bg-slate-100" />
              {isAuthenticated ? (
                <>
                  <NavLink to="/account" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <User className="size-4" /> My Account
                  </NavLink>
                  <NavLink to="/wishlist" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Heart className="size-4" /> Saved Trips
                  </NavLink>
                  <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50">
                    <LogOut className="size-4" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 px-3">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate('/login')}>Login</Button>
                  <Button size="sm" className="flex-1" onClick={() => navigate('/register')}>Create Account</Button>
                </div>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  isActive ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Currency */}
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="h-9 w-auto gap-1 border-0 bg-transparent px-2 shadow-none hover:bg-slate-100 [&>svg]:hidden">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(currencies).map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="mr-2">{c.flag}</span>{c.code} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Language (desktop) */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="hidden h-9 w-auto gap-1 border-0 bg-transparent px-2 shadow-none hover:bg-slate-100 [&>svg]:hidden sm:flex">
              <Languages className="size-4 text-slate-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l.code} value={l.code}>
                  <span className="mr-2">{l.flag}</span>{l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Notifications */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <button className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100" aria-label="Notifications">
                <Bell className="size-5" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                {unread > 0 && (
                  <button
                    onClick={() => setNotifs((n) => n.map((x) => ({ ...x, read: true })))}
                    className="text-[11px] font-semibold text-brand-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </DropdownMenuLabel>
              <div className="max-h-80 overflow-y-auto">
                {notifs.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex items-start gap-3 py-3!">
                    <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-brand-500')} />
                    <div className="min-w-0">
                      <p className={cn('text-sm', n.read ? 'text-slate-500' : 'font-semibold text-slate-800')}>{n.title}</p>
                      <p className="text-xs text-slate-400">{n.text}</p>
                      <p className="mt-0.5 text-[11px] text-slate-400">{n.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Wishlist */}
          <Link to="/wishlist" className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100" aria-label="Wishlist">
            <Heart className="size-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-sun-500 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-slate-100">
                  <Avatar className="size-9">
                    {user.avatar ? <img src={user.avatar} alt={user.firstName} className="size-full object-cover" /> : null}
                    <AvatarFallback>{initials || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-semibold text-slate-800 xl:block">
                    {user.firstName} {user.lastName?.[0] ?? ''}
                  </span>
                  <ChevronDown className="hidden size-4 text-slate-400 xl:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <p className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</p>
                  <p className="text-xs font-normal text-slate-400">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/account')}><User className="size-4" /> My Account</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-trips')}><Luggage className="size-4" /> My Bookings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/wishlist')}><Bookmark className="size-4" /> Saved Trips</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account')}><Settings className="size-4" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-rose-600"><LogOut className="size-4" /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
              <Button size="sm" onClick={() => navigate('/register')}>Create Account</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
