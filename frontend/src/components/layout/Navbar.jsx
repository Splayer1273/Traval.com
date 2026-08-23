import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Banknote, BarChart3, Bell, Briefcase, Building2, ChevronDown, ClipboardList, Hotel, Languages,
  LayoutDashboard, LogOut, Menu, Plane, Receipt, ShieldCheck, User, Users, Luggage,
} from 'lucide-react'
import Logo from './Logo.jsx'
import { Button } from '../ui/button.jsx'
import { Badge } from '../ui/badge.jsx'
import { Avatar, AvatarFallback } from '../ui/avatar.jsx'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../ui/sheet.jsx'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '../ui/dropdown-menu.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCurrency } from '../../context/CurrencyContext.jsx'
import { useNotifications } from '../../context/NotificationContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { cn } from '../../lib/utils.js'

const GUEST_LINKS = [
  { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
  { to: '/about', label: 'About', icon: Building2, end: true },
  { to: '/services', label: 'Services', icon: Briefcase },
  { to: '/solutions', label: 'Solutions', icon: Users },
  { to: '/features', label: 'Features', icon: ClipboardList },
  { to: '/why-us', label: 'Why Us', icon: ShieldCheck },
  { to: '/faq', label: 'FAQ', icon: ClipboardList },
  { to: '/contact', label: 'Contact', icon: Hotel, end: true },
]

const EMPLOYEE_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/flights', label: 'Search Flights', icon: Plane },
  { to: '/hotels', label: 'Search Hotels', icon: Hotel },
  { to: '/my-trips', label: 'My Trips', icon: Luggage },
  { to: '/profile', label: 'Profile', icon: User },
]

const APPROVER_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/approvals', label: 'Approvals', icon: ClipboardList },
  { to: '/flights', label: 'Flights', icon: Plane },
  { to: '/hotels', label: 'Hotels', icon: Hotel },
  { to: '/profile', label: 'Profile', icon: User },
]

const FINANCE_LINKS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/claims', label: 'Claims', icon: Receipt },
  { to: '/flights', label: 'Flights', icon: Plane },
  { to: '/hotels', label: 'Hotels', icon: Hotel },
  { to: '/profile', label: 'Profile', icon: User },
]

const ADMIN_LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/approvals', label: 'Approvals', icon: ClipboardList },
  { to: '/admin/bookings', label: 'Bookings', icon: Hotel },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/policies', label: 'Travel Policies', icon: ShieldCheck },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

function linksFor(role, isAuthenticated) {
  if (!isAuthenticated) return GUEST_LINKS
  if (role === 'admin') return ADMIN_LINKS
  if (role === 'approver') return APPROVER_LINKS
  if (role === 'finance') return FINANCE_LINKS
  return EMPLOYEE_LINKS
}

function scrollToSection(hash) {
  const id = hash.replace('#', '')
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const { user, isAuthenticated, role, logout } = useAuth()
  const { currency, setCurrency, language, setLanguage, currencies, languages } = useCurrency()
  const { notifs, unread, markRead, markAllRead } = useNotifications()
  const { success } = useToast()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : ''

  const handleLogout = async () => {
    await logout()
    success('You have been signed out of the corporate portal.')
    navigate('/')
  }

  const links = linksFor(role, isAuthenticated)

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-white/85 backdrop-blur-lg transition-shadow duration-300',
        scrolled ? 'border-slate-200/80 shadow-[0_4px_24px_-12px_rgb(15_23_42/0.18)]' : 'border-slate-200/60',
      )}
    >
      <div className="container-x flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-3 lg:h-[72px]">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="border-b border-slate-100 bg-gradient-to-br from-brand-50 via-white to-sun-50 p-5">
              <Logo />
            </div>
            {isAuthenticated && (
              <div className="border-b border-slate-100 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-10">
                    {user?.avatar ? <img src={user.avatar} alt={user.firstName} className="size-full object-cover" /> : null}
                    <AvatarFallback>{initials || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
                    <p className="truncate text-xs text-slate-500">{user?.designation} · {user?.department}</p>
                  </div>
                </div>
              </div>
            )}
            <nav className="flex flex-col gap-1 px-3 py-4">
              <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {role === 'admin' ? 'Admin' : role === 'approver' ? 'Approver' : role === 'finance' ? 'Finance' : isAuthenticated ? 'Corporate travel' : 'Corporate portal'}
              </p>
              {links.map((l) => (
                l.hash ? (
                  <button
                    key={l.hash}
                    onClick={() => scrollToSection(l.hash)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                  >
                    <l.icon className="size-4" /> {l.label}
                  </button>
                ) : (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    className={({ isActive }) =>
                      cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                      isActive ? 'text-brand-700 bg-brand-50' : 'text-brand-600 hover:bg-brand-50 hover:text-brand-700',
                      )
                    }
                  >
                    <l.icon className="size-4" /> {l.label}
                  </NavLink>
                )
              ))}
              {isAuthenticated && (
                <>
                  <NavLink to="/notifications" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Bell className="size-4" /> Notifications
                    {unread > 0 && <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">{unread}</span>}
                  </NavLink>
                  {role === 'admin' && (
                    <NavLink to="/admin/policies" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                      <ShieldCheck className="size-4" /> Travel Policies
                    </NavLink>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50">
                    <LogOut className="size-4" /> Logout
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="flex gap-2 px-3 pt-1">
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => navigate('/login')}>Login</Button>
                  <Button size="sm" className="flex-1" onClick={() => navigate('/register')}>Create Account</Button>
                </div>
              )}
            </nav>

            {/* Language & currency */}
            <div className="mt-auto border-t border-slate-100 p-4">
              <div className="space-y-1 rounded-xl bg-slate-50 p-3">
                <p className="px-1 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Preferences</p>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Languages className="size-4 text-slate-400" /> Language
                  </span>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="h-9 w-28 bg-white text-xs shadow-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => (
                        <SelectItem key={l.code} value={l.code}><span className="mr-2">{l.flag}</span>{l.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Banknote className="size-4 text-slate-400" /> Currency
                  </span>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-9 w-28 bg-white text-xs shadow-none"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.values(currencies).map((c) => (
                        <SelectItem key={c.code} value={c.code}><span className="mr-2">{c.flag}</span>{c.code} — {c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 lg:flex">
          {links.map((l) => (
            l.hash ? (
              <button
                key={l.hash}
                onClick={() => scrollToSection(l.hash)}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-brand-600 transition-all hover:bg-brand-50 hover:text-brand-700"
              >
                {l.label}
              </button>
            ) : (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className="rounded-full px-3.5 py-2 text-sm font-semibold text-brand-600 transition-all hover:bg-brand-50 hover:text-brand-700"
              >
                {l.label}
              </NavLink>
            )
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
          {/* Notifications */}
          <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
            <DropdownMenuTrigger asChild>
              <button className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900" aria-label="Notifications">
                <Bell className="size-5" />
                {unread > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
              <DropdownMenuLabel className="flex items-center justify-between">
                Notifications
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[11px] font-semibold text-brand-600 hover:underline">
                    Mark all read
                  </button>
                )}
              </DropdownMenuLabel>
              <div className="max-h-80 overflow-y-auto">
                {notifs.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-slate-400">You're all caught up.</p>
                ) : (
                  notifs.slice(0, 5).map((n) => (
                    <DropdownMenuItem key={n.id} className="items-start gap-3 py-3!" onClick={() => { markRead(n.id); if (n.link) navigate(n.link) }}>
                      <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-brand-500')} />
                      <div className="min-w-0">
                        <p className={cn('text-sm', n.read ? 'text-slate-500' : 'font-semibold text-slate-800')}>{n.title}</p>
                        <p className="text-xs text-slate-400">{n.text}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400">{n.time}</p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/notifications')} className="justify-center text-xs font-semibold text-brand-700">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-1 pr-1.5 transition-colors hover:bg-slate-100 sm:pr-2">
                  <Avatar className="size-8 sm:size-9">
                    {user?.avatar ? <img src={user.avatar} alt={user.firstName} className="size-full object-cover" /> : null}
                    <AvatarFallback>{initials || 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-semibold text-slate-800 xl:block">
                    {user?.firstName} {user?.lastName?.[0] ?? ''}
                  </span>
                  <ChevronDown className="hidden size-4 text-slate-400 xl:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>
                  <p className="text-sm font-bold text-slate-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs font-normal text-slate-400">{user?.designation} · {user?.department}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}><User className="size-4" /> My Profile</DropdownMenuItem>
                {['employee', 'finance'].includes(role) && (
                  <DropdownMenuItem onClick={() => navigate('/claims')}><Receipt className="size-4" /> My Claims</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate('/my-trips')}><Luggage className="size-4" /> My Trips</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/notifications')}><Bell className="size-4" /> Notifications</DropdownMenuItem>
                {role === 'admin' && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}><Building2 className="size-4" /> Admin Console</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin/policies')}><ShieldCheck className="size-4" /> Travel Policies</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin/reports')}><BarChart3 className="size-4" /> Spend Reports</DropdownMenuItem>
                  </>
                )}
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
