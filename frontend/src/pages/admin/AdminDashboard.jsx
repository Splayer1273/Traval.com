import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight, Building2, Clock, Hotel, MapPin, Plane, ShieldCheck, TrendingUp, Users, Wallet,
} from 'lucide-react'
import { Badge } from '../../components/ui/badge.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Skeleton } from '../../components/ui/skeleton.jsx'
import { Price } from '../../components/Price.jsx'
import AdminNav from '../../components/layout/AdminNav.jsx'
import { corporateApi, computeStats } from '../../services/corporateApi.js'
import { requestStatusMeta } from '../../data/corporate.js'
import { formatDate } from '../../utils/format.js'
import { cn } from '../../lib/utils.js'

function Kpi({ icon: Icon, label, value, sub, tone = 'text-brand-600' }) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <span className={cn('flex size-9 items-center justify-center rounded-xl bg-slate-50 sm:size-10', tone)}><Icon className="size-4 sm:size-5" /></span>
          {sub && <Badge variant="secondary" className="hidden sm:inline-flex">{sub}</Badge>}
        </div>
        <p className="mt-3 font-display text-xl font-bold text-slate-900 sm:mt-4 sm:text-2xl sm:text-3xl">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{label}</p>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests', 'admin'],
    queryFn: () => corporateApi.getRequests({}),
  })

  if (isLoading) {
    return (
      <div className="container-x space-y-4 py-8">
        <Skeleton className="h-14 w-64 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    )
  }

  const list = requests || []
  const stats = computeStats(list)
  const maxBar = Math.max(...stats.byMonth.map((m) => m.value), 1)
  const topCity = stats.topCities[0]

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-6 sm:py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Building2 className="size-4 text-brand-600" /> Acme Technologies · Travel Admin
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">Company travel dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">Monitor spend, approvals, policy compliance and the most travelled destinations.</p>
          <div className="mt-4 sm:mt-5"><AdminNav /></div>
        </div>
      </div>

      <div className="container-x py-6 sm:py-8">
        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <Kpi icon={Wallet} label="Total travel spend" value={<Price amount={stats.totalSpend} />} sub="estimated" tone="text-brand-600" />
          <Kpi icon={Plane} label="Total trips" value={stats.totalTrips} sub={`avg ${formatPrice(stats.avgBookingCost)}/trip`} tone="text-slate-600" />
          <Kpi icon={Clock} label="Pending approvals" value={stats.pending} tone="text-amber-600" />
          <Kpi icon={ShieldCheck} label="Policy violations" value={stats.violations} tone="text-rose-600" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Spend by month */}
          <Card className="lg:col-span-2">
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900 sm:mb-5">
                <TrendingUp className="size-4 text-brand-600" /> Estimated spend by month
              </p>
              {stats.byMonth.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-6 text-sm text-slate-500">No spend data yet.</p>
              ) : (
                <div className="flex h-40 items-end gap-2 sm:h-48 sm:gap-3">
                  {stats.byMonth.map((m) => (
                    <div key={m.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1 sm:gap-1.5">
                      <span className="text-[9px] font-bold text-slate-600 opacity-0 transition-opacity group-hover:opacity-100 sm:text-[11px]"><Price amount={m.value} /></span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-brand-700 to-brand-400 transition-all group-hover:from-brand-800 group-hover:to-brand-500 sm:rounded-t-xl"
                        style={{ height: `${Math.max(6, Math.round((m.value / maxBar) * 100))}%` }}
                      />
                      <span className="text-[9px] font-semibold text-slate-500 sm:text-[11px]">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Most travelled */}
          <Card>
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 sm:mb-4">
                <MapPin className="size-4 text-brand-600" /> Most travelled cities
              </p>
              <div className="space-y-3">
                {stats.topCities.slice(0, 5).map((c, i) => {
                  const max = stats.topCities[0]?.count || 1
                  return (
                    <div key={c.city}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{i + 1}. {c.city}</span>
                        <span className="text-xs text-slate-500">{c.count} trip{c.count > 1 ? 's' : ''}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-sun-500 to-sun-600" style={{ width: `${Math.round((c.count / max) * 100)}%` }} />
                      </div>
                    </div>
                  )
                })}
                {!topCity && <p className="text-sm text-slate-500">No trips yet.</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Status breakdown */}
          <Card>
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 sm:mb-4"><Users className="size-4 text-brand-600" /> Trips by status</p>
              <div className="space-y-3">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <Badge variant={requestStatusMeta(status).variant} className="w-20 justify-center capitalize sm:w-24">{status}</Badge>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={cn('h-full rounded-full', status === 'pending' ? 'bg-amber-400' : ['rejected', 'cancelled'].includes(status) ? 'bg-rose-400' : status === 'completed' ? 'bg-slate-400' : 'bg-brand-500')}
                        style={{ width: `${stats.totalTrips ? Math.round((count / stats.totalTrips) * 100) : 0}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-sm font-bold text-slate-700">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent requests */}
          <Card className="lg:col-span-2">
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Hotel className="size-4 text-brand-600" /> Recent travel requests</p>
                <Button variant="ghost" size="sm" asChild><Link to="/admin/bookings">View all <ArrowRight className="size-3.5" /></Link></Button>
              </div>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 table-scroll-wrapper">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      <th className="pb-2.5 pr-4">Employee</th>
                      <th className="pb-2.5 pr-4">Trip</th>
                      <th className="pb-2.5 pr-4">Dates</th>
                      <th className="pb-2.5 pr-4">Est. cost</th>
                      <th className="pb-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {list.slice(0, 6).map((r) => (
                      <tr key={r.id} className="transition-colors hover:bg-slate-50">
                        <td className="py-3 pr-4">
                          <p className="font-bold text-slate-800">{r.employee?.name}</p>
                          <p className="text-xs text-slate-400">{r.employee?.department}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <Link to={`/trips/${r.id}`} className="font-semibold text-brand-700 hover:underline">{r.title}</Link>
                          <p className="text-xs text-slate-400">{r.from} → {r.destination}</p>
                        </td>
                        <td className="py-3 pr-4 text-xs text-slate-500">{formatDate(r.startDate)}</td>
                        <td className="py-3 pr-4 font-semibold text-slate-800"><Price amount={r.estimatedCost} /></td>
                        <td className="py-3"><Badge variant={requestStatusMeta(r.status).variant}>{requestStatusMeta(r.status).label}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function formatPrice(n) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0)
}
