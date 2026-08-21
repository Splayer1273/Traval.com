import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils.js'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
        sun: 'bg-sun-50 text-sun-700 ring-1 ring-sun-100',
        success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
        warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
        danger: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
        secondary: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
        outline: 'text-slate-600 ring-1 ring-slate-300',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
))
Badge.displayName = 'Badge'

export { Badge, badgeVariants }
