import { useState } from 'react'
import { Search, Plane, Terminal, Clock, Coffee, Wifi, Car, ShoppingBag } from 'lucide-react'
import PageHero from '../../components/PageHero.jsx'
import { Input } from '../../components/ui/input.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { AIRPORTS } from '../../data/airports.js'

const AMENITY_META = {
  'Free WiFi': { icon: Wifi, label: 'WiFi' },
  'Lounges': { icon: Coffee, label: 'Lounges' },
  'Duty Free': { icon: ShoppingBag, label: 'Duty Free' },
  'Car Parking': { icon: Car, label: 'Parking' },
  'Currency Exchange': { icon: Clock, label: 'Forex' },
}

const AIRPORT_FACILITIES = {
  BOM: ['Free WiFi', 'Lounges', 'Duty Free', 'Car Parking', 'Currency Exchange'],
  DEL: ['Free WiFi', 'Lounges', 'Duty Free', 'Car Parking', 'Currency Exchange'],
  BLR: ['Free WiFi', 'Lounges', 'Duty Free', 'Car Parking'],
  DXB: ['Free WiFi', 'Lounges', 'Duty Free', 'Car Parking', 'Currency Exchange'],
  SIN: ['Free WiFi', 'Lounges', 'Duty Free', 'Car Parking', 'Currency Exchange'],
  LHR: ['Free WiFi', 'Lounges', 'Duty Free', 'Car Parking'],
}

export default function AirportInfo() {
  const [query, setQuery] = useState('')

  const filtered = AIRPORTS.filter((a) => {
    const q = query.toLowerCase()
    return !q || a.code.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHero image="airport" title="Airport Information" subtitle="Terminals, facilities and travel times for airports we fly to" crumb={[{ label: 'Airport Information' }]} />

      <div className="container-x mt-8">
        <div className="mx-auto mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by code, city or name…" className="pl-10" />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => {
            const facilities = AIRPORT_FACILITIES[a.code] || ['Free WiFi', 'Lounges', 'Duty Free']
            return (
              <div key={a.code} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 text-lg font-bold text-white shadow-glow">
                    {a.code}
                  </span>
                  <Badge variant="secondary"><Terminal className="size-3" /> {a.terminal}</Badge>
                </div>
                <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{a.name}</h3>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Plane className="size-3" /> {a.city}, {a.country}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-1.5">
                  {facilities.map((f) => {
                    const meta = AMENITY_META[f] || { icon: Coffee, label: f }
                    return (
                      <span key={f} className="flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-600">
                        <meta.icon className="size-3.5 text-brand-600" /> {meta.label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
