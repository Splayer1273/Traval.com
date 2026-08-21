import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils.js'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 p-1 text-slate-600',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-brand-700 data-[state=active]:shadow-soft',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500', className)}
    {...props}
  />
))
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
