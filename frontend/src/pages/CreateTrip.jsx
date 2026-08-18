import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, Building2, CalendarDays, Info, MapPin, Plane, ShieldCheck, Users } from 'lucide-react'
import { corporateApi } from '../services/corporateApi.js'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'
import { Textarea } from '../components/ui/textarea.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { AIRPORTS, getAirport } from '../data/airports.js'
import { DEPARTMENTS } from '../data/corporate.js'
import { useTravel } from '../context/TravelContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { todayISO } from '../utils/format.js'

export default function CreateTrip() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { setTrip } = useTravel()
  const { toast, error } = useToast()

  const [form, setForm] = useState({
    title: '',
    from: user?.location === 'Mumbai' ? 'BOM' : 'BOM',
    destination: 'BLR',
    startDate: todayISO(14),
    endDate: todayISO(17),
    purpose: '',
    client: '',
    department: user?.department || 'Technology',
    project: user?.projectCode || '',
    costCenter: user?.costCenter || '',
    travellers: 1,
  })

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const submit = (e) => {
    e.preventDefault()
    const dest = getAirport(form.destination)
    const from = getAirport(form.from)
    if (!form.title.trim()) return error('Give this trip a short title, e.g. "Client Meeting — Bengaluru".', 'Trip title required')
    if (!form.purpose.trim()) return error('Add the business purpose of the trip — it is shown to your approver.', 'Purpose required')
    if (form.endDate < form.startDate) return error('End date must be on or after the start date.', 'Invalid dates')
    if (form.travellers < 1 || form.travellers > 10) return error('Traveller count must be between 1 and 10.', 'Travellers')

    const trip = {
      title: form.title.trim(),
      from: from ? from.city : form.from,
      fromCode: form.from,
      destination: dest ? dest.city : form.destination,
      destinationCode: form.destination,
      startDate: form.startDate,
      endDate: form.endDate,
      purpose: form.purpose.trim(),
      client: form.client.trim(),
      department: form.department,
      project: form.project.trim(),
      costCenter: form.costCenter.trim(),
      travellers: Number(form.travellers),
    }
    setTrip(trip)
    toast(`Trip "${trip.title}" created — now pick a flight.`, 'Business trip created')
    navigate(`/flights?trip=roundtrip&from=${trip.fromCode}&to=${trip.destinationCode}&date=${trip.startDate}&return=${trip.endDate}&cabin=Economy&corp=1`)
  }

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Briefcase className="size-4 text-brand-600" /> New business trip
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Create a business trip</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Define the purpose and dates first — then attach a policy-checked flight and hotel before submitting for approval.
          </p>
        </div>
      </div>

      <div className="container-x grid gap-6 py-8 lg:grid-cols-[1fr_340px]">
        <form onSubmit={submit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="size-5 text-brand-600" /> Trip details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="title">Trip title</Label>
                <Input id="title" className="mt-1.5" placeholder="e.g. Client Meeting — Bengaluru" value={form.title} onChange={(e) => set({ title: e.target.value })} />
                <p className="mt-1 text-xs text-slate-400">A short, descriptive name your approver will recognise.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label>Departure city</Label>
                  <Select value={form.from} onValueChange={(v) => set({ from: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Destination</Label>
                  <Select value={form.destination} onValueChange={(v) => set({ destination: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label className="flex items-center gap-1.5"><CalendarDays className="size-3.5" /> Travel start date</Label>
                  <Input type="date" className="mt-1.5" min={todayISO()} value={form.startDate} onChange={(e) => set({ startDate: e.target.value })} />
                </div>
                <div>
                  <Label className="flex items-center gap-1.5"><CalendarDays className="size-3.5" /> Travel end date</Label>
                  <Input type="date" className="mt-1.5" min={form.startDate || todayISO()} value={form.endDate} onChange={(e) => set({ endDate: e.target.value })} />
                </div>
              </div>

              <div>
                <Label htmlFor="purpose">Travel purpose</Label>
                <Textarea id="purpose" className="mt-1.5" rows={3} placeholder="e.g. Product demo & sprint planning with ABC Technologies" value={form.purpose} onChange={(e) => set({ purpose: e.target.value })} />
                <p className="mt-1 text-xs text-slate-400">Your approver sees this — be specific about the business outcome.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="client">Client / company being visited</Label>
                  <Input id="client" className="mt-1.5" placeholder="Optional — e.g. ABC Technologies" value={form.client} onChange={(e) => set({ client: e.target.value })} />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select value={form.department} onValueChange={(v) => set({ department: v })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((d) => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <Label htmlFor="project">Project code</Label>
                  <Input id="project" className="mt-1.5" placeholder="Optional" value={form.project} onChange={(e) => set({ project: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="costCenter">Cost centre</Label>
                  <Input id="costCenter" className="mt-1.5" placeholder="Optional" value={form.costCenter} onChange={(e) => set({ costCenter: e.target.value })} />
                </div>
                <div>
                  <Label>Number of travellers</Label>
                  <Select value={String(form.travellers)} onValueChange={(v) => set({ travellers: Number(v) })}>
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => <SelectItem key={n} value={String(n)}>{n} {n > 1 ? 'travellers' : 'traveller'}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" asChild><Link to="/"><Plane className="size-4" /> Back to dashboard</Link></Button>
            <Button type="submit" size="lg"><Plane className="size-4" /> Create trip & search flights</Button>
          </div>
        </form>

        {/* Policy sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <LivePolicyCard />
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-700 to-brand-600 p-5 text-white">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-200">
                <ShieldCheck className="size-4" /> Your travel entitlement
              </p>
              <p className="mt-2 font-display text-lg font-semibold">{user?.designation} · Grade {user?.grade}</p>
            </div>
            <CardContent className="space-y-2.5 p-5 text-sm">
              {[
                { label: 'Flight class', value: 'Economy' },
                { label: 'Hotel limit', value: 'Up to ₹5,000/night' },
                { label: 'Hotel category', value: 'Up to 3★' },
                { label: 'Daily allowance', value: '₹1,500/day' },
                { label: 'Advance booking', value: '≥ 7 days' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="font-semibold text-slate-800">{row.value}</span>
                </div>
              ))}
              <p className="pt-1 text-xs leading-relaxed text-slate-400">
                Options above your limit are still shown while searching — they are flagged as <span className="font-semibold text-amber-600">outside policy</span> and will need justification.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Building2 className="size-4 text-brand-600" /> How it works</p>
              <ol className="space-y-3 text-sm text-slate-600">
                {[
                  ['Create trip', 'Purpose, dates and destination.'],
                  ['Select flight & hotel', 'Every option is checked against policy.'],
                  ['Submit request', 'Goes to your manager for approval.'],
                  ['Approved → ticketed', 'You are notified at every step.'],
                ].map(([title, text], i) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-slate-800">{title}</p>
                      <p className="text-xs text-slate-500">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function LivePolicyCard() {
  const { user } = useAuth()
  const { data: policies } = useQuery({
    queryKey: ['corporate-policies'],
    queryFn: () => corporateApi.getPolicies(),
    staleTime: 60_000,
  })
  const policy = policies?.find((p) => p.designation === user?.designation) || policies?.find((p) => p.grade === user?.grade)
  const rows = policy
    ? [
        { label: 'Flight class', value: policy.flightClass || 'Economy' },
        { label: 'Hotel limit', value: `Up to ₹${(policy.hotelLimit || 0).toLocaleString('en-IN')}/night` },
        { label: 'Hotel category', value: `Up to ${policy.hotelStars || 3}★` },
        { label: 'Daily allowance', value: `₹${(policy.dailyAllowance || 0).toLocaleString('en-IN')}/day` },
        { label: 'Advance booking', value: `≥ ${policy.advanceDays || 0} days` },
      ]
    : []
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-brand-700 to-brand-600 p-5 text-white">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-200">
          <ShieldCheck className="size-4" /> Your travel entitlement
        </p>
        <p className="mt-2 font-display text-lg font-semibold">{user?.designation} · Grade {user?.grade}</p>
      </div>
      <CardContent className="space-y-2.5 p-5 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
            <span className="text-slate-500">{row.label}</span>
            <span className="font-semibold text-slate-800">{row.value}</span>
          </div>
        ))}
        <p className="pt-1 text-xs leading-relaxed text-slate-400">
          Options above your limit are still shown while searching — they are flagged as <span className="font-semibold text-amber-600">outside policy</span> and will need justification.
        </p>
      </CardContent>
    </Card>
  )
}
