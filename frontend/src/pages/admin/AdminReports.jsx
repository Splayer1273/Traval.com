import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Banknote, Building2, Download, Loader2, MapPin, Plane, Receipt, TrendingUp, Wallet,
} from 'lucide-react'
import { Button } from '../../components/ui/button.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Skeleton } from '../../components/ui/skeleton.jsx'
import { Price } from '../../components/Price.jsx'
import AdminNav from '../../components/layout/AdminNav.jsx'
import { corporateApi } from '../../services/corporateApi.js'
import { claimCategoryMeta, claimStatusMeta, requestStatusMeta } from '../../data/corporate.js'
import { useToast } from '../../context/ToastContext.jsx'
import { todayISO } from '../../utils/format.js'
import { cn } from '../../lib/utils.js'

function Kpi({ icon: Icon, label, value, sub, tone = 'text-brand-600' }) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <span className={cn('flex size-9 items-center justify-center rounded-xl bg-slate-50 sm:size-10', tone)}><Icon className="size-4 sm:size-5" /></span>
        <p className="mt-3 font-display text-xl font-bold text-slate-900 sm:mt-4 sm:text-2xl sm:text-3xl">{value}</p>
        <p className="mt-1 text-xs text-slate-500">{label}{sub ? ` · ${sub}` : ''}</p>
      </CardContent>
    </Card>
  )
}

function BarRow({ label, value, max, tone = 'bg-brand-500', suffix }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="truncate font-semibold text-slate-700">{label}</span>
        <span className="shrink-0 pl-3 text-xs font-bold text-slate-600">{suffix}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={cn('h-full rounded-full', tone)} style={{ width: `${max ? Math.max(4, Math.round((value / max) * 100)) : 0}%` }} />
      </div>
    </div>
  )
}

export default function AdminReports() {
  const { toast, error } = useToast()
  const [exporting, setExporting] = useState('')
  const { data: report, isLoading } = useQuery({
    queryKey: ['reports', 'spend'],
    queryFn: () => corporateApi.getSpendReport(),
  })

  const downloadCsv = async (type) => {
    setExporting(type)
    try {
      const csv = await corporateApi.exportCsv(type)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sunrise-${type}-report-${todayISO()}.csv`
      a.click()
      URL.revokeObjectURL(url)
      toast(`${type === 'expenses' ? 'Expense claims' : 'Travel requests'} exported as CSV.`, 'Exported')
    } catch (e) {
      error(e.message, 'Export failed')
    } finally {
      setExporting('')
    }
  }

  if (isLoading) {
    return (
      <div className="container-x space-y-4 py-8">
        <Skeleton className="h-14 w-64 rounded-xl" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    )
  }

  const s = report?.summary || {}
  const byMonth = report?.byMonth || []
  const byDepartment = report?.byDepartment || []
  const byDestination = report?.byDestination || []
  const byCategory = report?.byCategory || []
  const tripStatus = report?.byStatus?.trips || {}
  const expenseStatus = report?.byStatus?.expenses || {}
  const maxMonth = Math.max(...byMonth.map((m) => m.total), 1)
  const maxDept = Math.max(...byDepartment.map((d) => d.total), 1)
  const maxDest = Math.max(...byDestination.map((d) => d.total), 1)
  const maxCat = Math.max(...byCategory.map((c) => c.total), 1)

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-6 sm:py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Building2 className="size-4 text-brand-600" /> Acme Technologies · Travel Admin
              </p>
              <h1 className="mt-1.5 font-display text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">Spend reports</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Company-wide spend across travel requests and expense claims, with CSV export for finance and leadership.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" disabled={!!exporting} onClick={() => downloadCsv('trips')}>
                {exporting === 'trips' ? <Loader2 className="size-4 animate-spin" /> : <Plane className="size-4" />} <span className="hidden sm:inline">Export trips CSV</span><span className="sm:hidden">Trips CSV</span>
              </Button>
              <Button variant="secondary" disabled={!!exporting} onClick={() => downloadCsv('expenses')}>
                {exporting === 'expenses' ? <Loader2 className="size-4 animate-spin" /> : <Receipt className="size-4" />} <span className="hidden sm:inline">Export expenses CSV</span><span className="sm:hidden">Expenses CSV</span>
              </Button>
            </div>
          </div>
          <div className="mt-4 sm:mt-5"><AdminNav /></div>
        </div>
      </div>

      <div className="container-x py-6 sm:py-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <Kpi icon={Wallet} label="Total spend" value={<Price amount={s.totalSpend} />} sub="trips + claims" tone="text-brand-600" />
          <Kpi icon={Plane} label="Travel spend" value={<Price amount={s.tripSpend} />} sub={`${s.spendableTripCount} trip${s.spendableTripCount === 1 ? '' : 's'}`} tone="text-slate-600" />
          <Kpi icon={Receipt} label="Claims reimbursed" value={<Price amount={s.expenseSpend} />} sub={`avg ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(s.avgTripCost || 0)}/trip`} tone="text-teal-600" />
          <Kpi icon={Banknote} label="Pending claims value" value={<Price amount={s.pendingExpenseValue} />} sub={`${s.pendingTrips} pending trip${s.pendingTrips === 1 ? '' : 's'}`} tone="text-amber-600" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Spend by month */}
          <Card className="lg:col-span-2">
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between sm:mb-5">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <TrendingUp className="size-4 text-brand-600" /> Spend by month
                </p>
                <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-brand-500" /> <span className="hidden sm:inline">Trips</span><span className="sm:hidden">T</span></span>
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-teal-400" /> <span className="hidden sm:inline">Claims</span><span className="sm:hidden">C</span></span>
                </div>
              </div>
              <div className="flex h-40 items-end gap-1.5 sm:h-48 sm:gap-2">
                {byMonth.map((m) => (
                  <div key={m.label} className="flex h-full flex-1 flex-col items-center justify-end gap-1 sm:gap-1.5">
                    <span className="text-[9px] font-bold text-slate-600 sm:text-[10px]"><Price amount={m.total} /></span>
                    <div className="flex w-full flex-col justify-end gap-px overflow-hidden rounded-t-lg" style={{ height: `${Math.max(6, Math.round((m.total / maxMonth) * 100))}%` }}>
                      <div className="w-full flex-1 rounded-t-lg bg-gradient-to-t from-brand-700 to-brand-400" style={{ flex: m.trips }} />
                      <div className="w-full rounded-b-lg bg-teal-400" style={{ flex: m.expenses || 0.001 }} />
                    </div>
                    <span className="text-[9px] font-semibold text-slate-500 sm:text-[11px]">{m.label.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* By department */}
          <Card>
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 sm:mb-4">
                <Building2 className="size-4 text-brand-600" /> Spend by department
              </p>
              <div className="space-y-3.5">
                {byDepartment.length === 0 ? <p className="text-sm text-slate-500">No spend data yet.</p> : (
                  byDepartment.map((d) => (
                    <BarRow key={d.department} label={d.department} value={d.total} max={maxDept} suffix={<Price amount={d.total} />} tone="bg-gradient-to-r from-brand-500 to-brand-400" />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* By destination */}
          <Card>
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 sm:mb-4">
                <MapPin className="size-4 text-brand-600" /> Most travelled destinations
              </p>
              <div className="space-y-3.5">
                {byDestination.length === 0 ? <p className="text-sm text-slate-500">No trips yet.</p> : (
                  byDestination.slice(0, 6).map((d) => (
                    <div key={d.destination} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 truncate text-xs font-semibold text-slate-700 sm:w-28 sm:text-sm">{d.destination}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-sun-500 to-sun-600" style={{ width: `${Math.round((d.total / maxDest) * 100)}%` }} />
                      </div>
                      <span className="w-20 shrink-0 text-right text-[11px] font-bold text-slate-600 sm:w-24 sm:text-xs"><Price amount={d.total} /></span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Claims by category */}
          <Card>
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 sm:mb-4">
                <Receipt className="size-4 text-teal-600" /> Expense claims by category
              </p>
              <div className="space-y-3.5">
                {byCategory.length === 0 ? <p className="text-sm text-slate-500">No claims yet.</p> : (
                  byCategory.map((c) => (
                    <div key={c.category} className="flex items-center gap-3">
                      <span className="w-20 shrink-0 truncate text-xs font-semibold text-slate-700 sm:w-28 sm:text-sm">
                        {claimCategoryMeta(c.category).emoji} {claimCategoryMeta(c.category).label}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400" style={{ width: `${Math.round((c.total / maxCat) * 100)}%` }} />
                      </div>
                      <span className="w-20 shrink-0 text-right text-[11px] font-bold text-slate-600 sm:w-24 sm:text-xs"><Price amount={c.total} /></span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status breakdown */}
          <Card>
            <CardContent className="p-4 sm:p-5 sm:p-6">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900 sm:mb-4">
                <Banknote className="size-4 text-brand-600" /> Requests & claims by status
              </p>
              <div className="space-y-1.5 text-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Travel requests</p>
                {Object.entries(tripStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="capitalize text-slate-600">{requestStatusMeta(status).label}</span>
                    <span className="font-bold text-slate-800">{count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">Expense claims</p>
                {Object.entries(expenseStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <span className="capitalize text-slate-600">{claimStatusMeta(status).label}</span>
                    <span className="font-bold text-slate-800">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
