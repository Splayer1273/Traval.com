import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../lib/utils.js'

export default function Breadcrumb({ crumb, light }) {
  const items = [{ label: 'Home', to: '/' }, ...(crumb || [])]
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs">
      {items.map((item, i) => {
        const last = i === items.length - 1
        if (item.to && !last) {
          return (
            <span key={item.label} className="flex items-center gap-1">
              <Link
                to={item.to}
                className={cn(
                  'flex items-center gap-1 transition-colors',
                  light ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-brand-700',
                )}
              >
                {i === 0 && <Home className="size-3.5" />}
                {item.label}
              </Link>
              <ChevronRight className={cn('size-3.5', light ? 'text-slate-400' : 'text-slate-300')} />
            </span>
          )
        }
        return (
          <span key={item.label} className={cn('font-medium', light ? 'text-white' : 'text-slate-800')}>
            {item.label}
          </span>
        )
      })}
    </nav>
  )
}
