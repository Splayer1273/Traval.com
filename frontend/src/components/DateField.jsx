import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate, todayISO } from '../utils/format.js'
import { cn } from '../lib/utils.js'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const startDay = first.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

export default function DateField({ value, onChange, min = todayISO(), placeholder = 'Select date', className, label }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState(() => {
    const d = value ? new Date(value) : new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const minDate = new Date(min)
  const selected = value ? new Date(value) : null

  const move = (delta) => {
    const d = new Date(view.year, view.month + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  const pick = (day) => {
    const iso = `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(iso)
    setOpen(false)
  }

  return (
    <div className={cn('w-full', className)}>
      {label && <span className="mb-1.5 block text-xs font-medium text-slate-500">{label}</span>}
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-soft transition-colors hover:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-slate-400" />
              <span className={value ? 'font-medium' : 'text-slate-400'}>{value ? formatDate(value) : placeholder}</span>
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={6}
            className="z-50 rounded-2xl border border-slate-200 bg-white p-4 shadow-lift animate-scale-in"
          >
            <div className="mb-3 flex items-center justify-between">
              <button type="button" onClick={() => move(-1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Previous month">
                <ChevronLeft className="size-4" />
              </button>
              <div className="text-sm font-semibold text-slate-800">
                {MONTHS[view.month]} {view.year}
              </div>
              <button type="button" onClick={() => move(1)} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label="Next month">
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((w) => (
                <div key={w} className="flex size-9 items-center justify-center text-[11px] font-semibold text-slate-400">
                  {w}
                </div>
              ))}
              {buildMonthGrid(view.year, view.month).map((day, i) => {
                if (day === null) return <div key={`e${i}`} className="size-9" />
                const iso = `${view.year}-${String(view.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isMin = new Date(iso) < minDate
                const isSelected = selected && selected.toDateString() === new Date(iso).toDateString()
                const isToday = iso === todayISO()
                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={isMin}
                    onClick={() => pick(day)}
                    className={cn(
                      'flex size-9 items-center justify-center rounded-lg text-sm transition-colors disabled:cursor-not-allowed disabled:text-slate-300',
                      isSelected
                        ? 'bg-brand-600 font-semibold text-white'
                        : isToday
                          ? 'bg-brand-50 font-semibold text-brand-700'
                          : 'text-slate-700 hover:bg-slate-100',
                    )}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
