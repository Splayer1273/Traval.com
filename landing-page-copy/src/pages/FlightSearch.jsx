import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Filter, SlidersHorizontal, ArrowLeftRight, Search, Plane, CalendarDays, Users, Sparkles, Briefcase,
} from 'lucide-react'
import FlightCard from '../components/cards/FlightCard.jsx'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Checkbox } from '../components/ui/checkbox.jsx'
import { Slider } from '../components/ui/slider.jsx'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../components/ui/sheet.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { AIRPORTS, getAirport } from '../data/airports.js'
import { POPULAR_ROUTES } from '../data/flights.js'
import { formatDate, formatDay, todayISO } from '../utils/format.js'
import { flightApi } from '../services/flightApi.js'
import { useTravel } from '../context/TravelContext.jsx'
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
  const { draft: travelDraft } = useTravel()
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

  const resetFilters = () => {
    setPriceRange([0, 200000]); setAirlines([]); setStops([])
    setDepart([0, 1439]); setArrival([0, 1439]); setDuration([0, 1400])
    setRefundableOnly(false)
  }

  const activeFilterCount = [
    priceRange[0] > 0 || priceRange[1] < 200000,
    airlines.length > 0,
    stops.length > 0,
    depart[0] > 0 || depart[1] < 1439,
    arrival[0] > 0 || arrival[1] < 1439,
    duration[1] < 1400,
    refundableOnly,
  ].filter(Boolean).length

  const topLabel =
    sort === 'cheapest' ? 'Cheapest'
      : sort === 'fastest' ? 'Fastest'
        : sort === 'best' ? 'Best value'
          : sort === 'earliest' ? 'Earliest' : null

  // Deterministic per-date fares (demo) so the fare calendar feels real.
  // The window is anchored to the FIRST searched date so tapping a tile moves
  // the highlight without re-centering the strip under the user's finger.
  const anchorRef = useRef(null)
  if (hasSearched && !anchorRef.current) anchorRef.current = q.date
  const anchorDate = anchorRef.current || q.date || todayISO()

  const fareDates = useMemo(() => {
    if (!hasSearched || !data?.outbound?.length) return []
    const start = anchorDate
    const minPrice = Math.min(...data.outbound.map((f) => f.price))
    const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 997; return h }
    const days = Array.from({ length: 10 }, (_, i) => {
      const d = new Date(`${start}T00:00:00`)
      d.setDate(d.getDate() + i)
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const variance = (hash(iso) % 25) - 12 // -12% … +12%
      const price = Math.round((minPrice * (1 + variance / 100)) / 100) * 100
      return { iso, weekday: formatDay(iso), day: d.getDate(), price }
    })
    let cheapestIdx = 0
    days.forEach((d, i) => { if (d.price < days[cheapestIdx].price) cheapestIdx = i })
    return { days, cheapestIdx }
  }, [hasSearched, data, anchorDate])

  // Quick airline chips (from the current result set).
  const quickAirlines = useMemo(() => {
    if (!data?.outbound?.length) return []
    const map = new Map()
    data.outbound.forEach((f) => {
      const cur = map.get(f.airlineId) || { id: f.airlineId, name: f.airline, count: 0 }
      cur.count += 1
      map.set(f.airlineId, cur)
    })
    return [...map.values()]
  }, [data])

  // Simple fare insight vs the route average.
  const fareInsight = useMemo(() => {
    if (!data?.outbound?.length) return null
    const prices = data.outbound.map((f) => f.price)
    const min = Math.min(...prices)
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    return { min, belowPct: Math.max(0, Math.round(((avg - min) / avg) * 100)) }
  }, [data])

  const toggleAirline = (id) => setAirlines((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))

  const FilterHeader = (
    <div className="flex items-center justify-between gap-3">
      <h3 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
        <SlidersHorizontal className="size-4 text-brand-600" /> Filters
      </h3>
      <button type="button" className="shrink-0 text-xs font-semibold text-brand-600 hover:underline" onClick={resetFilters}>
        Reset all
      </button>
    </div>
  )

  const FilterBody = (
    <div className="space-y-6">

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

  const fromCity = getAirport(q.from)?.city || q.from
  const toCity = getAirport(q.to)?.city || q.to
  const travellers = Number(q.adults || 1)

  return (
    <div>
      {/* Light, airy header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="h-1 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-sun-500" />
        <div className="container-x py-6 sm:py-8">
          <Breadcrumb crumb={[{ label: 'Flights' }]} />
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-3">
            <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
              {hasSearched ? `${fromCity} → ${toCity}` : 'Find your next flight'}
            </h1>
            {hasSearched && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  <CalendarDays className="size-3.5 text-brand-600" /> {formatDate(q.date)}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                  {travellers} {travellers > 1 ? 'travellers' : 'traveller'} · {q.cabin}
                </span>
              </div>
            )}
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            {hasSearched
              ? 'Compare fares across 500+ airlines and book with confidence.'
              : 'Find the best fares across 500+ airlines and 2,000+ destinations.'}
          </p>
        </div>
      </section>

      {/* Search summary / form */}
      <div className="container-x mt-6">
        <div className="rounded-2xl bg-gradient-to-r from-brand-200 via-sun-200 to-brand-200 p-px shadow-lift">
          <div className="rounded-[15px] bg-white p-4 sm:p-5">
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
              <div className="hidden h-9 w-px bg-slate-200 sm:block" />
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <CalendarDays className="size-3.5 text-brand-600" /> {q.date ? formatDate(q.date) : 'Select date'}
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Users className="size-3.5 text-brand-600" /> {travellers} {travellers > 1 ? 'travellers' : 'traveller'}
                </span>
                <Badge variant="secondary" className="px-3 py-1.5">{q.cabin}</Badge>
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
      </div>

      {/* Fare calendar — cheapest nearby days */}
      {hasSearched && fareDates.days?.length > 0 && (
        <div className="container-x mt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
                  <CalendarDays className="size-4 text-brand-600" /> Fare calendar
                </p>
                <p className="text-xs text-slate-500">Lowest one-way fare for {toCity || q.to} — tap a date to view it.</p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {fareDates.days.map((d, i) => {
                const selected = d.iso === q.date
                const isCheapest = i === fareDates.cheapestIdx
                return (
                  <button
                    key={d.iso}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => { params.set('date', d.iso); setParams(params) }}
                    className={cn(
                      'flex min-w-16 shrink-0 flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-center transition-all',
                      selected
                        ? 'border-brand-600 bg-brand-600 text-white shadow-glow'
                        : isCheapest
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:border-emerald-400'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300',
                    )}
                  >
                    <span className={cn('text-[10px] font-bold uppercase tracking-wide', selected ? 'text-white/80' : 'opacity-70')}>{d.weekday}</span>
                    <span className="text-sm font-bold">{d.day}</span>
                    <span className={cn('text-[11px] font-semibold', selected ? 'text-white' : 'text-slate-500')}>
                      ₹{d.price.toLocaleString('en-IN')}
                    </span>
                    {isCheapest && !selected && (
                      <span className="rounded-full bg-emerald-500 px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-white">Cheapest</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Corporate trip context banner */}
      {params.get('corp') === '1' && travelDraft?.trip && (
        <div className="container-x mt-6">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white"><Briefcase className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800">Booking for business trip: {travelDraft.trip.title}</p>
              <p className="text-xs text-slate-500">{travelDraft.trip.from} → {travelDraft.trip.destination} · {formatDate(travelDraft.trip.startDate)} – {formatDate(travelDraft.trip.endDate)} · {travelDraft.trip.travellers || 1} traveller — every option is checked against your corporate policy.</p>
            </div>
            <Link to="/trips/review" className="text-xs font-bold text-brand-700 hover:underline">Review request →</Link>
          </div>
        </div>
      )}

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
                  <div className="min-w-40 flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="ml-auto h-8 w-28" />
                  </div>
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
            action={<Button variant="secondary" onClick={resetFilters}>Clear all filters</Button>}
          />
        ) : (
          <>
            {fareInsight && (
              <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-brand-600" />
                <p className="text-sm text-slate-600">
                  <span className="font-bold text-slate-800">Fare insight:</span> the cheapest option today is{' '}
                  <span className="font-bold text-brand-700">₹{fareInsight.min.toLocaleString('en-IN')}</span> — about{' '}
                  <span className="font-bold text-emerald-600">{fareInsight.belowPct}% below</span> the average fare on this route.
                  Fares typically rise in the final two weeks before departure.
                </p>
              </div>
            )}
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Desktop filters */}
            <aside className="sticky top-24 hidden h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:block">
              <div className="mb-6">{FilterHeader}</div>
              {FilterBody}
            </aside>

            <div>
              {/* Toolbar */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">
                    {filtered.length} flight{filtered.length > 1 ? 's' : ''} found
                  </h2>
                  <p className="text-xs text-slate-500">
                    {q.from} → {q.to} · {formatDate(q.date)}{q.trip === 'roundtrip' && q.returnDate ? ` · return ${formatDate(q.returnDate)}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile filters — full-screen sheet */}
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="secondary" className="lg:hidden">
                        <Filter className="size-4" /> Filters
                        {activeFilterCount > 0 && (
                          <span className="flex size-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="inset-0 max-h-none rounded-none! border-0! p-0">
                      <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 pr-14">
                          <SheetTitle className="flex items-center gap-2 font-display text-lg">
                            <SlidersHorizontal className="size-5 text-brand-600" /> Filter flights
                          </SheetTitle>
                          <button type="button" className="shrink-0 text-xs font-bold text-brand-600 hover:underline" onClick={resetFilters}>
                            Reset all
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-5 py-5">
                          {FilterBody}
                        </div>
                        <div className="border-t border-slate-100 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">
                          <Button size="lg" className="w-full" onClick={() => setFiltersOpen(false)}>
                            Show {filtered.length} flight{filtered.length !== 1 ? 's' : ''}
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort pills (sm+) */}
                  <div className="hidden items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-soft sm:flex">
                    {SORTS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSort(s.id)}
                        className={cn(
                          'rounded-lg px-3 py-1.5 text-xs font-semibold transition-all',
                          sort === s.id ? 'bg-brand-600 text-white shadow-soft' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                        )}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* Sort select (mobile) */}
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-40 sm:hidden">
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

              {/* Airline quick filters */}
              {quickAirlines.length > 1 && (
                <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button
                    type="button"
                    onClick={() => setAirlines([])}
                    className={cn(
                      'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
                      airlines.length === 0 ? 'border-brand-600 bg-brand-600 text-white shadow-soft' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300',
                    )}
                  >
                    All airlines
                  </button>
                  {quickAirlines.map((a) => {
                    const active = airlines.includes(a.id)
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAirline(a.id)}
                        className={cn(
                          'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
                          active ? 'border-brand-600 bg-brand-600 text-white shadow-soft' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300',
                        )}
                      >
                        {a.name}
                        <span className={cn('rounded-full px-1.5 text-[10px] font-bold', active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500')}>{a.count}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              <div className="space-y-4">
                {filtered.map((f, i) => (
                  <FlightCard key={f.id} flight={f} highlight={i === 0 ? topLabel : null} />
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
          </>
        )}
      </div>
    </div>
  )
}
