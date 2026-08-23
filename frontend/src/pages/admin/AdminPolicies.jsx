import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, RotateCcw, Save, ShieldCheck } from 'lucide-react'
import { Badge } from '../../components/ui/badge.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Skeleton } from '../../components/ui/skeleton.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx'
import AdminNav from '../../components/layout/AdminNav.jsx'
import { corporateApi } from '../../services/corporateApi.js'
import { DEFAULT_POLICIES } from '../../data/corporate.js'
import { useToast } from '../../context/ToastContext.jsx'

const CABINS = ['Economy', 'Premium Economy', 'Business', 'First Class']
const STARS = [2, 3, 4, 5]

export default function AdminPolicies() {
  const qc = useQueryClient()
  const { toast, error } = useToast()
  const [draft, setDraft] = useState(null)
  const [dirty, setDirty] = useState(false)

  const { data: policies, isLoading } = useQuery({
    queryKey: ['corporate-policies'],
    queryFn: async () => {
      const list = await corporateApi.getPolicies()
      setDraft(list.map((p) => ({ ...p })))
      return list
    },
    staleTime: 0,
  })

  const saveMutation = useMutation({
    mutationFn: corporateApi.savePolicies,
    onSuccess: (saved) => {
      qc.setQueryData(['corporate-policies'], saved)
      qc.invalidateQueries({ queryKey: ['corporate-policies'] })
      setDirty(false)
      toast('Travel policies updated — all new requests use these rules.', 'Policies saved')
    },
    onError: (e) => error(e.message, 'Save failed'),
  })

  const update = (id, patch) => {
    setDraft((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)))
    setDirty(true)
  }

  const reset = () => {
    setDraft(DEFAULT_POLICIES.map((p) => ({ ...p })))
    setDirty(true)
  }

  if (isLoading || !draft) {
    return (
      <div className="container-x space-y-4 py-8">
        <Skeleton className="h-14 w-64 rounded-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    )
  }

  const num = (v) => Math.max(0, Number(v) || 0)

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-6 sm:py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <ShieldCheck className="size-4 text-brand-600" /> Policy configuration
          </p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold text-slate-900 sm:text-3xl lg:text-4xl">Travel policies</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Entitlements per designation. The policy engine checks every flight and hotel selection against these rules — changes apply immediately.
          </p>
          <div className="mt-4 sm:mt-5"><AdminNav /></div>
        </div>
      </div>

      <div className="container-x py-6 sm:py-8">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-3 sm:p-4 sm:px-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Badge variant={dirty ? 'warning' : 'success'}>{dirty ? 'Unsaved changes' : 'Live'}</Badge>
              <span className="hidden text-slate-400 sm:inline">Designation-based entitlements</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={reset}><RotateCcw className="size-3.5" /> <span className="hidden sm:inline">Reset defaults</span><span className="sm:hidden">Reset</span></Button>
              <Button size="sm" disabled={!dirty || saveMutation.isPending} onClick={() => saveMutation.mutate(draft)}>
                {saveMutation.isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />} <span className="hidden sm:inline">Save policies</span><span className="sm:hidden">Save</span>
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 table-scroll-wrapper">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Designation</th>
                  <th className="px-3 py-3">Grade</th>
                  <th className="px-3 py-3">Flight class</th>
                  <th className="px-3 py-3">Hotel category</th>
                  <th className="px-3 py-3">Hotel limit / night</th>
                  <th className="px-3 py-3">Daily allowance</th>
                  <th className="px-3 py-3">Advance booking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {draft.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="px-5 py-3">
                      <p className="font-bold text-slate-800">{p.designation}</p>
                      <p className="text-[11px] text-slate-400">{p.salaryBand || '—'}</p>
                    </td>
                    <td className="px-3 py-3"><Badge variant="secondary">Grade {p.grade}</Badge></td>
                    <td className="px-3 py-3">
                      <Select value={p.flightClass} onValueChange={(v) => update(p.id, { flightClass: v, premiumEconomy: v !== 'Economy', business: v === 'Business' || v === 'First Class' })}>
                        <SelectTrigger className="h-9 w-32 bg-white text-xs shadow-none sm:w-40"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CABINS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-3">
                      <Select value={String(p.hotelStars)} onValueChange={(v) => update(p.id, { hotelStars: Number(v) })}>
                        <SelectTrigger className="h-9 w-24 bg-white text-xs shadow-none"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {STARS.map((s) => <SelectItem key={s} value={String(s)}>{s} ★</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-3 py-3">
                      <div className="relative w-28 sm:w-32">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                        <input
                          type="number"
                          min={0}
                          step={500}
                          value={p.hotelLimit}
                          onChange={(e) => update(p.id, { hotelLimit: num(e.target.value) })}
                          className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-7 pr-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="relative w-24 sm:w-28">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                        <input
                          type="number"
                          min={0}
                          step={100}
                          value={p.dailyAllowance}
                          onChange={(e) => update(p.id, { dailyAllowance: num(e.target.value) })}
                          className="h-9 w-full rounded-xl border border-slate-200 bg-white pl-7 pr-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min={0}
                        value={p.advanceDays}
                        onChange={(e) => update(p.id, { advanceDays: num(e.target.value) })}
                        className="h-9 w-20 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <span className="ml-1 text-[11px] text-slate-400">days</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 bg-slate-50/60 px-4 py-3 text-xs text-slate-500 sm:px-5">
            Employees see their own entitlement when searching. Options above the limit remain visible but are flagged <span className="font-semibold text-amber-600">outside policy</span> and require approver justification.
          </div>
        </Card>
      </div>
    </div>
  )
}
