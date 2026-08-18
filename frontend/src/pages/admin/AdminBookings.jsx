import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Hotel, Search } from 'lucide-react'
import { Badge } from '../../components/ui/badge.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Skeleton } from '../../components/ui/skeleton.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { Price } from '../../components/Price.jsx'
import AdminNav from '../../components/layout/AdminNav.jsx'
import { corporateApi } from '../../services/corporateApi.js'
import { requestStatusMeta } from '../../data/corporate.js'
import { formatDate } from '../../utils/format.js'
import { cn } from '../../lib/utils.js'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'ticketed', label: 'Ticketed' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'cancelled', label: 'Cancelled' },
]

export default function AdminBookings() {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests', 'admin'],
    queryFn: () => corporateApi.getRequests({}),
  })

  const all = requests || []
  const filtered = all.filter((r) => {
    if (filter !== 'all' && r.status !== filter) return false
    if (!query) return true
    const q = query.toLowerCase()
    return `${r.title} ${r.destination} ${r.employee?.name} ${r.ref} ${r.employee?.department}`.toLowerCase().includes(q)
  })
  const countFor = (f) => (f === 'all' ? all.length : all.filter((r) => r.status === f).length)

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Hotel className="size-4 text-brand-600" /> Booking management
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">All bookings</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Every travel request across the company — from pending to ticketed.</p>
          <div className="mt-5"><AdminNav /></div>
        </div>
      </div>

      <div className="container-x py-8">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-52 flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-10" placeholder="Search by employee, trip or ref…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all',
                  filter === f.id ? 'bg-brand-600 text-white shadow-soft' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300',
                )}
              >
                {f.label}
                <span className={cn('ml-1.5 rounded-full px-1.5 text-[11px] font-bold', filter === f.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500')}>{countFor(f.id)}</span>
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-96 w-full rounded-2xl" />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Search} title="No bookings found" text="Try a different status or search term." />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3">Reference</th>
                    <th className="px-3 py-3">Employee</th>
                    <th className="px-3 py-3">Trip</th>
                    <th className="px-3 py-3">Route</th>
                    <th className="px-3 py-3">Dates</th>
                    <th className="px-3 py-3">Est. cost</th>
                    <th className="px-3 py-3">Policy</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-slate-50">
                      <td className="px-5 py-3">
                        <Link to={`/trips/${r.id}`} className="font-mono text-xs font-bold text-brand-700 hover:underline">{r.ref}</Link>
                      </td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-slate-800">{r.employee?.name}</p>
                        <p className="text-[11px] text-slate-400">{r.employee?.department}</p>
                      </td>
                      <td className="px-3 py-3">
                        <Link to={`/trips/${r.id}`} className="font-semibold text-slate-700 hover:text-brand-700">{r.title}</Link>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">{r.from} → {r.destination}</td>
                      <td className="px-3 py-3 text-xs text-slate-500">{formatDate(r.startDate)} – {formatDate(r.endDate)}</td>
                      <td className="px-3 py-3 font-semibold text-slate-800"><Price amount={r.estimatedCost} /></td>
                      <td className="px-3 py-3">
                        {r.policy?.violation ? <Badge variant="danger">Exception</Badge> : <Badge variant="success">Compliant</Badge>}
                      </td>
                      <td className="px-3 py-3"><Badge variant={requestStatusMeta(r.status).variant}>{requestStatusMeta(r.status).label}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
