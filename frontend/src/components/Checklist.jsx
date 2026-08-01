import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '../lib/utils.js'

export default function Checklist({ title, items, checked, onToggle }) {
  const done = checked.filter(Boolean).length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-slate-900">{title}</h3>
        <span className="text-xs font-bold text-brand-700">{done}/{items.length}</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sun-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={item}>
            <button
              type="button"
              onClick={() => onToggle(i)}
              className={cn(
                'flex w-full items-start gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm transition-colors hover:bg-slate-50',
                checked[i] ? 'text-slate-400 line-through' : 'text-slate-700',
              )}
            >
              {checked[i] ? (
                <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-emerald-500" />
              ) : (
                <Circle className="mt-0.5 size-4.5 shrink-0 text-slate-300" />
              )}
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
