import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Briefcase, CalendarDays, CheckCircle2, ClipboardList, Clock, Hotel, MapPin,
  Plane, Ticket, XCircle, ArrowRight,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Price } from '../components/Price.jsx'
import { PolicyBadge } from '../components/PolicyBadge.jsx'
import { corporateApi } from '../services/corporateApi.js'
import { requestStatusMeta } from '../data/corporate.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate, formatTime } from '../utils/format.js'
import { cn } from '../lib/utils.js'

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'all', label: 'All' },
]

function TripCard({ req }) {
  const meta = requestStatusMeta(req.status)
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift">
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">{req.ref}</span>
              <Badge variant={meta.variant}>{meta.label}</Badge>
              {req.policy?.violation && <Badge variant="danger">Policy exception</Badge>}
            </div>
            <h3 className="mt-1 truncate font-display text-lg font-semibold text-slate-900">
              <Link to={`/trips/${req.id}`} className="hover:text-brand-700">{req.title}</Link>
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="size-4 text-brand-600" /> {req.from} → {req.destination}
              <span className="text-slate-300">·</span>
              <CalendarDays className="size-4 text-brand-600" /> {formatDate(req.startDate)} – {formatDate(req.endDate)}
            </p>
          </div>
          <div className="text-right">
            <Price amount={req.estimatedCost} className="text-xl font-bold text-slate-900" />
            <p className="text-[11px] text-slate-400">estimated · billed to company</p>
          </div>
        </div>

        <p className="mt-3 line-clamp-1 text-xs text-slate-500"><span className="font-semibold text-slate-700">Purpose:</span> {req.purpose}</p>

        {/* Segments */}
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {req.flight ? (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-soft"><Plane className="size-4" /></span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">{req.flight.airline} {req.flight.flightNumber}</p>
                <p className="truncate text-[11px] text-slate-500">{req.flight.from.code} → {req.flight.to.code} · {formatTime(req.flight.dep)} · {req.flight.cabin}</p>
              </div>
              <PolicyBadge employee={{ designation: req.employee?.designation, grade: req.employee?.grade }} flight={{ cabin: req.flight.cabin }} showLabel={false} className="ml-auto" />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 px-3.5 py-2.5 text-xs text-slate-400">
              <Plane className="size-4" /> No flight booked
            </div>
          )}
          {req.hotel ? (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-soft"><Hotel className="size-4" /></span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-slate-800">{req.hotel.name}</p>
                <p className="truncate text-[11px] text-slate-500">{req.hotel.city} · {req.hotel.nights} nights · {req.hotel.room}</p>
              </div>
              <PolicyBadge employee={{ designation: req.employee?.designation, grade: req.employee?.grade }} hotel={{ star: req.hotel.star }} room={{ price: req.hotel.pricePerNight }} showLabel={false} className="ml-auto" />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-slate-200 px-3.5 py-2.5 text-xs text-slate-400">
              <Hotel className="size-4" /> No hotel booked
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
            <span>Approver: <span className="font-semibold text-slate-700">{req.approver?.name || '—'}</span></span>
            {req.approval?.comment && <span className="line-clamp-1 max-w-60">{req.approval.comment}</span>}
          </div>
          <Button size="sm" variant="secondary" asChild><Link to={`/trips/${req.id}`}>View details <ArrowRight className="size-3.5" /></Link></Button>
        </div>
      </div>
    </div>
  )
}

export default function MyTrips() {
  const { user, isAuthenticated } = useAuth()
  const [params, setParams] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') || 'upcoming')

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests', 'mine', user?.id],
    queryFn: () => corporateApi.getRequests({ employeeId: user?.id }),
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={ClipboardList}
          title="Sign in to view your travel requests"
          text="Business trips, approvals and tickets appear here once you log in."
          action={<Button asChild><Link to="/login">Sign in</Link></Button>}
        />
      </div>
    )
  }

  const all = requests || []
  const upcoming = all.filter((r) => ['pending', 'approved', 'ticketed'].includes(r.status) && new Date(r.startDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
  const filtered = tab === 'all' ? all : tab === 'upcoming' ? upcoming : all.filter((r) => r.status === tab)
  const countFor = (t) => (t === 'all' ? all.length : t === 'upcoming' ? upcoming.length : all.filter((r) => r.status === t).length)

  const StatusSummary = () => {
    const items = [
      { icon: Clock, label: 'Pending', count: all.filter((r) => r.status === 'pending').length, tone: 'text-amber-600' },
      { icon: CheckCircle2, label: 'Approved', count: all.filter((r) => r.status === 'approved').length, tone: 'text-brand-600' },
      { icon: Ticket, label: 'Ticketed', count: all.filter((r) => r.status === 'ticketed').length, tone: 'text-emerald-600' },
      { icon: XCircle, label: 'Cancelled', count: all.filter((r) => r.status === 'cancelled').length, tone: 'text-rose-500' },
    ]
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((s) => (
          <button key={s.label} type="button" onClick={() => { setTab(s.label.toLowerCase()); params.set('tab', s.label.toLowerCase()); setParams(params, { replace: true }) }} className={cn('flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-brand-300 hover:shadow-soft', s.tone)}>
            <s.icon className="size-5 shrink-0" />
            <div>
              <p className="font-display text-xl font-bold text-slate-900">{s.count}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Briefcase className="size-4 text-brand-600" /> Corporate travel
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">My trips & requests</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Track business trips from request to ticketed — approval status, itinerary and estimated company cost.
          </p>
        </div>
      </div>

      <div className="container-x py-8">
        <StatusSummary />

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => { setTab(t.id); params.set('tab', t.id); setParams(params, { replace: true }) }}
              className={cn(
                'shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all',
                tab === t.id ? 'bg-brand-600 text-white shadow-soft' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300',
              )}
            >
              {t.label}
              <span className={cn('ml-1.5 rounded-full px-1.5 text-[11px] font-bold', tab === t.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500')}>{countFor(t.id)}</span>
            </button>
          ))}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {[0, 1].map((i) => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={tab === 'pending' ? ClipboardList : Plane}
              title={tab === 'all' ? 'No trips yet' : `No ${tab} trips`}
              text="Create a business trip to start — flights and hotels are checked against company policy before you submit."
              action={<Button asChild><Link to="/trips/new"><Briefcase className="size-4" /> Create business trip</Link></Button>}
            />
          ) : (
            <div className="space-y-4">
              {filtered.map((req) => <TripCard key={req.id} req={req} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
