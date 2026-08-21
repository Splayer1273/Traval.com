import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer size-5 shrink-0 rounded-md border border-slate-300 bg-white shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand-600 data-[state=checked]:bg-brand-600 data-[state=checked]:text-white',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="size-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = 'Checkbox'

export { Checkbox }
