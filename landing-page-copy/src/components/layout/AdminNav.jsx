import { NavLink } from 'react-router-dom'
import { BarChart3, ClipboardList, Hotel, LayoutDashboard, ShieldCheck, Users } from 'lucide-react'

import { cn } from '../../lib/utils.js'

const LINKS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/approvals', label: 'Approvals', icon: ClipboardList },
  { to: '/admin/bookings', label: 'Bookings', icon: Hotel },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/policies', label: 'Travel Policies', icon: ShieldCheck },
  { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
]

export default function AdminNav() {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.end}
          className={({ isActive }) =>
            cn(
              'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all',
              isActive ? 'bg-brand-600 text-white shadow-glow' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-slate-900',
            )
          }
        >
          <l.icon className="size-4" /> {l.label}
        </NavLink>
      ))}
    </div>
  )
}
