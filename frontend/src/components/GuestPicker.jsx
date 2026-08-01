import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Minus, Plus, Users } from 'lucide-react'
import { plural } from '../utils/format.js'

function Stepper({ label, sub, value, onChange, min = 0, max = 9 }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {sub && <p className="text-xs text-slate-400">{sub}</p>}
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-40"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-5 text-center text-sm font-bold text-slate-800">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex size-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:opacity-40"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}

export default function GuestPicker({ adults = 1, children = 0, infants = 0, rooms = 1, onChange, showRooms = true }) {
  const [open, setOpen] = useState(false)
  const total = adults + children + infants
  const summary = `${total} ${plural(total, 'traveller')}${showRooms ? ` · ${rooms} ${plural(rooms, 'room')}` : ''}`

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-soft transition-colors hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <span className="flex items-center gap-2">
            <Users className="size-4 text-slate-400" />
            <span className="font-medium">{summary}</span>
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content align="start" sideOffset={6} className="z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-lift animate-scale-in">
          <Stepper label="Adults" sub="12+ years" value={adults} onChange={(v) => onChange({ ...{ adults: v, children, infants, rooms } })} />
          <div className="h-px bg-slate-100" />
          <Stepper label="Children" sub="2–11 years" value={children} onChange={(v) => onChange({ ...{ adults, children: v, infants, rooms } })} />
          <div className="h-px bg-slate-100" />
          <Stepper label="Infants" sub="Under 2, on lap" value={infants} onChange={(v) => onChange({ ...{ adults, children, infants: v, rooms } })} />
          {showRooms && (
            <>
              <div className="h-px bg-slate-100" />
              <Stepper label="Rooms" value={rooms} onChange={(v) => onChange({ ...{ adults, children, infants, rooms: v } })} />
            </>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
