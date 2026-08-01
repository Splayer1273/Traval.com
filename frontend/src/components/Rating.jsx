import { Star, StarHalf } from 'lucide-react'
import { cn } from '../lib/utils.js'

export function StarRating({ value = 0, size = 'size-4', className }) {
  const full = Math.floor(value)
  const half = value - full >= 0.4
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) return <Star key={i} className={cn(size, 'fill-amber-400 text-amber-400')} />
        if (i === full && half) return <StarHalf key={i} className={cn(size, 'fill-amber-400 text-amber-400')} />
        return <Star key={i} className={cn(size, 'text-slate-300')} />
      })}
    </span>
  )
}

export function GuestRating({ value, reviewCount, className }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white">
        {typeof value === 'number' ? value.toFixed(1) : value}
      </span>
      <span className="text-xs text-slate-500">{reviewCount ? `${reviewCount} reviews` : 'Excellent'}</span>
    </span>
  )
}
