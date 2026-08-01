import { useState } from 'react'
import { Bell, Plus, Trash2, TrendingDown, Plane } from 'lucide-react'
import PageHero from '../../components/PageHero.jsx'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Label } from '../../components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { AIRPORTS } from '../../data/airports.js'
import { flightApi } from '../../services/flightApi.js'
import { useQuery } from '@tanstack/react-query'

export default function PriceAlerts() {
  const { toast, error } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ from: '', to: '', target: '' })

  const { data: alerts, refetch } = useQuery({ queryKey: ['priceAlerts'], queryFn: flightApi.getPriceAlerts })

  const add = () => {
    if (!form.from || !form.to) return error('Select both origin and destination.', 'Price alert')
    if (form.from === form.to) return error('Origin and destination cannot be the same.', 'Price alert')
    if (!form.target || Number(form.target) < 1000) return error('Enter a target price above ₹1,000.', 'Price alert')
    toast(`We'll email you the moment ${form.from} → ${form.to} drops below ₹${Number(form.target).toLocaleString('en-IN')}.`, 'Price alert created')
    setForm({ from: '', to: '', target: '' })
    setOpen(false)
    refetch()
  }

  return (
    <div>
      <PageHero image="planeWing" title="Price Alerts" subtitle="Never overpay again — we track fares and notify you the moment they drop" crumb={[{ label: 'Price Alerts' }]} />

      <div className="container-x mt-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="size-5 text-brand-600" /> Track a route</CardTitle>
            <CardDescription>Set a target price and we'll watch it for you, free.</CardDescription>
          </CardHeader>
          <CardContent>
            {!open && (
              <Button onClick={() => setOpen(true)}><Plus className="size-4" /> Create new alert</Button>
            )}

            {open && (
              <div className="animate-fade-up space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>From</Label>
                    <Select value={form.from || undefined} onValueChange={(v) => setForm((f) => ({ ...f, from: v }))}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose city" /></SelectTrigger>
                      <SelectContent>
                        {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To</Label>
                    <Select value={form.to || undefined} onValueChange={(v) => setForm((f) => ({ ...f, to: v }))}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose city" /></SelectTrigger>
                      <SelectContent>
                        {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Target price (₹)</Label>
                  <Input type="number" className="mt-1.5" placeholder="e.g. 15000" value={form.target} onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={add}><Bell className="size-4" /> Start tracking</Button>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Active alerts</p>
              {(alerts || []).map((a) => (
                <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Plane className="size-4.5" /></span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{a.from} → {a.to}</p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <TrendingDown className="size-3.5 text-emerald-500" />
                        Now ₹{a.current.toLocaleString('en-IN')} · Target ₹{a.target.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                      {a.current <= a.target ? 'Target hit!' : `${Math.round((1 - a.target / a.current) * 100)}% to go`}
                    </span>
                    <button type="button" onClick={() => toast('Alert removed.', 'Price alert')} className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500" aria-label="Remove alert">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
