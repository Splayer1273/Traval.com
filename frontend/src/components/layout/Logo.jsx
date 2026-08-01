import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'
import { cn } from '../../lib/utils.js'

export default function Logo({ light = false, small = false }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 via-brand-500 to-sun-500 shadow-glow transition-transform group-hover:scale-105">
        <Plane className={cn('text-white', small ? 'size-4' : 'size-5')} />
      </span>
      <span className="leading-tight">
        <span className={cn('block font-display text-lg font-bold tracking-tight', light ? 'text-white' : 'text-slate-900')}>
          Project Sunrise
        </span>
        <span className={cn('block text-[10px] font-semibold uppercase tracking-[0.22em]', light ? 'text-slate-300' : 'text-sun-600')}>
          Travel & Explore
        </span>
      </span>
    </Link>
  )
}
