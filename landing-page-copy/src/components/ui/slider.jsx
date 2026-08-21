import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../../lib/utils.js'

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-slate-200">
      <SliderPrimitive.Range className="absolute h-full bg-brand-600" />
    </SliderPrimitive.Track>
    {Array.from({ length: props.value?.length ?? 1 }, (_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block size-5 rounded-full border-2 border-brand-600 bg-white shadow-md transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50"
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = 'Slider'

export { Slider }
