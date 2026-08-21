import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-soft transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 text-slate-400" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

const SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = 'SelectScrollUpButton'

const SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = 'SelectScrollDownButton'

const SelectContent = React.forwardRef(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-700 shadow-lift data-[state=open]:animate-scale-in',
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1.5',
          position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn('py-1.5 pl-3 pr-2 text-xs font-semibold text-slate-400', className)} {...props} />
))
SelectLabel.displayName = 'SelectLabel'

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-slate-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4 text-brand-600" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn('-mx-1 my-1 h-px bg-slate-100', className)} {...props} />
))
SelectSeparator.displayName = 'SelectSeparator'

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
