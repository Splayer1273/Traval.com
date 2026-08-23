import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils.js'

const LOGO_URL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4kGrvYzb_s_niaPHB23NYaYW_O9t8R013-jA7hTNPBQ&s=10'

export default function Logo({ light = false, small = false }) {
  return (
    <Link to="/" className="group flex items-center gap-2 sm:gap-2.5">
      <span className="relative flex size-8 items-center justify-center overflow-hidden transition-transform group-hover:scale-105 sm:size-10">
        <img
          src={LOGO_URL}
          alt="AkbarBizvoy"
          className={cn('object-contain', small ? 'size-8 sm:size-10' : 'size-8 sm:size-10')}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </span>
      <span className="leading-tight">
        <span className={cn('block font-display text-base font-bold tracking-tight sm:text-lg', light ? 'text-white' : 'text-slate-900')}>
          AkbarBizvoy
        </span>
        <span className={cn('hidden text-[9px] font-semibold uppercase tracking-[0.22em] sm:block sm:text-[10px]', light ? 'text-slate-300' : 'text-sun-600')}>
          Corporate Travel Solutions
        </span>
      </span>
    </Link>
  )
}
