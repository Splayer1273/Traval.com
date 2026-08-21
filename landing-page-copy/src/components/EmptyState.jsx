import { PackageSearch } from 'lucide-react'

export default function EmptyState({ icon: Icon = PackageSearch, title, text, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-16 text-center">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">
        <Icon className="size-10" />
      </div>
      <h3 className="font-display text-lg font-semibold text-slate-800">{title}</h3>
      {text && <p className="max-w-sm text-sm text-slate-500">{text}</p>}
      {action}
    </div>
  )
}
