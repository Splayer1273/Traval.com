import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '../lib/utils.js'

export default function SectionHeader({ eyebrow, title, subtitle, link, linkLabel = 'View all', align = 'left', className }) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
        {eyebrow && (
          <p className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sun-600">
            <span className="h-px w-6 bg-sun-500" /> {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-slate-500 sm:text-base">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link}
          className="group inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 shadow-soft transition-all hover:border-brand-300 hover:bg-brand-50"
        >
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}
