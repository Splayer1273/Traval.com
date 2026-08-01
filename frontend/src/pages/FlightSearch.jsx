import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Filter, SlidersHorizontal, ArrowLeftRight, Search, Plane,
} from 'lucide-react'
import FlightCard from '../components/cards/FlightCard.jsx'
import PageHero from '../components/PageHero.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Checkbox } from '../components/ui/checkbox.jsx'
import { Slider } from '../components/ui/slider.jsx'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { AIRPORTS } from '../data/airports.js'
import { POPULAR_ROUTES } from '../data/flights.js'
import { flightApi } from '../services/flightApi.js'
import { cn } from '../lib/utils.js'

const SORTS = [
  { id: 'cheapest', label: 'Cheapest' },
  { id: 'fastest', label: 'Fastest' },
  { id: 'best', label: 'Best' },
  { id: 'earliest', label: 'Earliest Departure' },
  { id: 'latest', label: 'Latest Departure' },
]

function TimeRangeFilter({ label, value, onChange, from = 0, to = 1439 }) {
  const fmt = (min) => {
    let h = Math.floor(min / 60)
    const m = min % 60
    const ap = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${h}:${String(m).padStart(2, '0')} ${ap}`
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>{label}</span>
        <span className="text-brand-700">{fmt(value[0])} – {fmt(value[1])}</span>
      </div>
      <Slider
        min={from} max={to} step={30}
        value={value}
        onValueChange={onChange}
      />
    </div>
  )
}

export default function FlightSearch() {
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState('cheapest')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const q = {
    trip: params.get('trip') || 'roundtrip',
    from: params.get('from') || '',
    to: params.get('to') || '',
    date: params.get('date') || '',
    returnDate: params.get('return') || '',
    cabin: params.get('cabin') || 'Economy',
    adults: Number(params.get('adults') || 1),
  }

  const hasSearched = !!(q.from && q.to && q.date)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['flights', q.from, q.to, q.date, q.returnDate, q.cabin],
    queryFn: () => flightApi.searchFlights(q),
    enabled: hasSearched,
  })

  // Client-side filters
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [airlines, setAirlines] = useState([])
  const [stops, setStops] = useState([])
  const [depart, setDepart] = useState([0, 1439])
  const [arrival, setArrival] = useState([0, 1439])
  const [duration, setDuration] = useState([0, 1400])
  const [refundableOnly, setRefundableOnly] = useState(false)

  const airlinesList = useMemo(() => {
    const set = new Set()
    data?.outbound?.forEach((f) => set.add(f.airlineId))
    return [...set]
  }, [data])

  const filtered = useMemo(() => {
    if (!data?.outbound) return []
    const depTime = (f) => new Date(f.departure).getHours() * 60 + new Date(f.departure).getMinutes()
    const arrTime = (f) => new Date(f.arrival).getHours() * 60 + new Date(f.arrival).getMinutes()
    let list = data.outbound.filter((f) => {
      const inRange = (v, [lo, hi]) => v >= lo && v <= hi
      if (!inRange(f.price, priceRange)) return false
      if (airlines.length && !airlines.includes(f.airlineId)) return false
      if (stops.length && !stops.includes(f.stops)) return false
      if (!inRange(depTime(f), depart)) return false
      if (!inRange(arrTime(f), arrival)) return false
      if (!inRange(f.durationMin, duration)) return false
      if (refundableOnly && !f.refundable) return false
      return true
    })
    const score = (f) => {
      const priceScore = 100 - Math.min(100, (f.price / 50000) * 100)
      const speedScore = 100 - Math.min(100, (f.durationMin / 600) * 100)
      const stopScore = f.stops === 0 ? 25 : f.stops === 1 ? 10 : 0
      return priceScore * 0.5 + speedScore * 0.3 + stopScore
    }
    switch (sort) {
      case 'cheapest': list = [...list].sort((a, b) => a.price - b.price); break
      case 'fastest': list = [...list].sort((a, b) => a.durationMin - b.durationMin); break
      case 'best': list = [...list].sort((a, b) => score(b) - score(a)); break
      case 'earliest': list = [...list].sort((a, b) => new Date(a.departure) - new Date(b.departure)); break
      case 'latest': list = [...list].sort((a, b) => new Date(b.departure) - new Date(a.departure)); break
      default: break
    }
    return list
  }, [data, priceRange, airlines, stops, depart, arrival, duration, refundableOnly, sort])

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
          <SlidersHorizontal className="size-4 text-brand-600" /> Filters
        </h3>
        <button
          type="button"
          className="text-xs font-semibold text-brand-600 hover:underline"
          onClick={() => {
            setPriceRange([0, 200000]); setAirlines([]); setStops([])
            setDepart([0, 1439]); setArrival([0, 1439]); setDuration([0, 1400])
            setRefundableOnly(false); setBaggageOnly(false)
          }}
        >
          Reset all
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700">Price range</p>
        <Slider min={0} max={200000} step={1000} value={priceRange} onValueChange={setPriceRange} />
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
          <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-slate-700">Airlines</p>
        {airlinesList.map((id) => {
          const name = data.outbound.find((f) => f.airlineId === id)?.airline
          return (
            <label key={id} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <Checkbox checked={airlines.includes(id)} onCheckedChange={(v) => setAirlines(v ? [...airlines, id] : airlines.filter((a) => a !== id))} />
              {name}
            </label>
          )
        })}
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-slate-700">Stops</p>
        {[0, 1].map((s) => (
          <label key={s} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
            <Checkbox checked={stops.includes(s)} onCheckedChange={(v) => setStops(v ? [...stops, s] : stops.filter((x) => x !== s))} />
            {s === 0 ? 'Non-stop' : '1 stop'}
          </label>
        ))}
      </div>

      <TimeRangeFilter label="Departure time" value={depart} onChange={setDepart} />
      <TimeRangeFilter label="Arrival time" value={arrival} onChange={setArrival} />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Max duration</span>
          <span className="text-brand-700">{Math.round(duration[1] / 60)}h</span>
        </div>
        <Slider min={0} max={1400} step={30} value={duration} onValueChange={setDuration} />
      </div>

      <div className="space-y-2.5">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <Checkbox checked={refundableOnly} onCheckedChange={setRefundableOnly} /> Refundable fares only
        </label>
        <p className="text-xs text-slate-400">All fares include {''}cabin + check-in baggage.</p>
      </div>
    </div>
  )

  return (
    <div>
      <PageHero
        image="planeWing"
        title="Search Flights"
        subtitle={hasSearched ? `Flights from ${q.from} to ${q.to}` : 'Find the best fares across 500+ airlines'}
        crumb={[{ label: 'Flights' }]}
      />

      {/* Search summary / form */}
      <div className="container-x -mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <Select value={q.from || undefined} onValueChange={(v) => { params.set('from', v); setParams(params) }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="From" /></SelectTrigger>
              <SelectContent>
                {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => {
              params.set('from', q.to); params.set('to', q.from); setParams(params)
            }} aria-label="Swap">
              <ArrowLeftRight className="size-4" />
            </Button>
            <Select value={q.to || undefined} onValueChange={(v) => { params.set('to', v); setParams(params) }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="To" /></SelectTrigger>
              <SelectContent>
                {AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary" className="px-3 py-1.5">{q.cabin}</Badge>
              <Badge variant="secondary" className="px-3 py-1.5">{q.adults} adult{q.adults > 1 ? 's' : ''}</Badge>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Tip: try one of these popular routes —{' '}
            {POPULAR_ROUTES.slice(0, 4).map((r, i) => (
              <span key={r.label}>
                <Link
                  to={`/flights?trip=oneway&from=${r.from}&to=${r.to}&date=${q.date || ''}`}
                  className="font-semibold text-brand-600 hover:underline"
                >
                  {r.label}
                </Link>
                {i < 3 ? ' · ' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="container-x mt-8">
        {!hasSearched ? (
          <div className="mx-auto max-w-2xl">
            <EmptyState
              icon={Search}
              title="Search for flights"
              text="Choose your origin, destination and travel date to see live fares from 500+ airlines."
              action={
                <Button onClick={() => { params.set('from', 'BOM'); params.set('to', 'DEL'); params.set('date', new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10)); setParams(params) }}>
                  Try Mumbai → Delhi
                </Button>
              }
            />
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-center gap-4">
                  <Skeleton className="size-10 rounded-xl" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-8 w-28" />
                </div>
                <Skeleton className="mt-4 h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState message="We couldn't fetch flights right now." onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No flights match your filters"
            text="Try widening the price range or clearing some filters."
            action={<Button variant="secondary" onClick={() => { setPriceRange([0, 200000]); setAirlines([]); setStops([]); setDepart([0, 1439]); setArrival([0, 1439]); setDuration([0, 1400]); setRefundableOnly(false) }}>Clear all filters</Button>}
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Desktop filters */}
            <aside className="sticky top-24 hidden h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:block">
              {FilterPanel}
            </aside>

            <div>
              {/* Toolbar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    {filtered.length} flight{filtered.length > 1 ? 's' : ''} found
                  </h2>
                  <p className="text-xs text-slate-500">
                    {q.from} → {q.to} · {q.date}{q.trip === 'roundtrip' && q.returnDate ? ` · return ${q.returnDate}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile filters */}
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="secondary" className="lg:hidden">
                        <Filter className="size-4" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl">
                      <SheetHeader>
                        <SheetTitle>Filter flights</SheetTitle>
                      </SheetHeader>
                      {FilterPanel}
                      <Button className="mt-4 w-full" onClick={() => setFiltersOpen(false)}>Show {filtered.length} flights</Button>
                    </SheetContent>
                  </Sheet>

                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SORTS.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filtered.map((f) => (
                  <FlightCard key={f.id} flight={f} />
                ))}
              </div>

              {q.trip === 'roundtrip' && data?.returnFlights?.length > 0 && (
                <div className="mt-10">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                    <Plane className="size-5 text-brand-600" /> Return flights ({q.returnDate})
                  </h3>
                  <div className="space-y-4">
                    {data.returnFlights.slice(0, 3).map((f) => (
                      <FlightCard key={f.id} flight={f} showReturn />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
