import * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { cva } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils.js'

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close
const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-[2px] data-[state=open]:animate-fade-in', className)}
    {...props}
  />
))
SheetOverlay.displayName = 'SheetOverlay'

const sheetVariants = cva(
  'fixed z-50 flex flex-col gap-4 bg-white p-5 shadow-lift transition-transform duration-300 ease-out',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 rounded-b-2xl border-b data-[state=open]:animate-slide-down',
        bottom: 'inset-x-0 bottom-0 rounded-t-2xl border-t data-[state=open]:animate-slide-up',
        left: 'inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[state=open]:animate-slide-in-left',
        right: 'inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[state=open]:animate-slide-in-right',
      },
    },
    defaultVariants: { side: 'right' },
  },
)

const SheetContent = React.forwardRef(({ side = 'right', className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none">
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = 'SheetContent'

const SheetHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 text-left', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Title ref={ref} className={cn('font-display text-lg font-semibold text-slate-900', className)} {...props} />
))
SheetTitle.displayName = 'SheetTitle'

const SheetDescription = React.forwardRef(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('text-sm text-slate-500', className)} {...props} />
))
SheetDescription.displayName = 'SheetDescription'

export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetDescription }
