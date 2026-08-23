import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils.js'

export default function SectionHeader({ eyebrow, title, subtitle, link, linkLabel = 'View all', align = 'left', light = false, className }) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <p className={cn('mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest', light ? 'text-sun-400' : 'text-sun-600')}>
            <span className={cn('h-px w-6', light ? 'bg-sun-400' : 'bg-sun-500')} /> {eyebrow}
          </p>
        )}
        <h2 className={cn('font-display text-xl font-semibold sm:text-2xl lg:text-3xl', light ? 'text-white' : 'text-slate-900')}>{title}</h2>
        {subtitle && <p className={cn('mt-2 text-sm sm:text-base', light ? 'text-slate-300' : 'text-slate-500')}>{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link}
          className={cn(
            'group inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold shadow-soft transition-all',
            light
              ? 'border-white/30 bg-white/10 text-white hover:border-white/50 hover:bg-white/20'
              : 'border-slate-200 bg-white text-brand-700 hover:border-brand-300 hover:bg-brand-50',
          )}
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
