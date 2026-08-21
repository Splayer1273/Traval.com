import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Filter, SlidersHorizontal, MapPin, Star, Wifi, Coffee, ShieldCheck } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import HotelCard from '../components/cards/HotelCard.jsx'
import ErrorState from '../components/ErrorState.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Button } from '../components/ui/button.jsx'
import { Checkbox } from '../components/ui/checkbox.jsx'
import { Slider } from '../components/ui/slider.jsx'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../components/ui/sheet.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { hotelApi } from '../services/hotelApi.js'
import { useTravel } from '../context/TravelContext.jsx'
import { Briefcase, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format.js'

const SORTS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Guest Rating' },
]

const PROPERTY_TYPES = ['Hotel', 'Resort', 'Heritage', 'Boutique', 'Suite']
const AMENITIES = ['Free WiFi', 'Swimming Pool', 'Spa', 'Breakfast', 'Airport Shuttle', 'Gym', 'Restaurant']

export default function HotelSearch() {
  const [params] = useSearchParams()
  const { draft: travelDraft } = useTravel()
  const [sort, setSort] = useState('recommended')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const destination = params.get('destination') || ''
  const hasSearched = !!destination

  const { data: hotels, isLoading, isError, refetch } = useQuery({
    queryKey: ['hotels', destination],
    queryFn: () => hotelApi.searchHotels({ destination, checkIn: params.get('checkIn'), checkOut: params.get('checkOut'), guests: params.get('guests'), rooms: params.get('rooms') }),
    enabled: true,
  })

  const [priceRange, setPriceRange] = useState([0, 100000])
  const [stars, setStars] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [amenities, setAmenities] = useState([])
  const [propertyTypes, setPropertyTypes] = useState([])
  const [freeCancel, setFreeCancel] = useState(false)
  const [breakfast, setBreakfast] = useState(false)
  const [locations, setLocations] = useState([])

  const matchesProperty = (h, t) => {
    const hay = `${h.name} ${h.description} ${h.city}`.toLowerCase()
    const keywords = {
      Resort: ['resort'],
      Heritage: ['heritage', 'palace', 'grand'],
      Boutique: ['boutique', 'central'],
      Suite: ['suite', 'tower'],
      // 'Hotel' is the catch-all bucket — any property that isn't a more specific type.
      Hotel: null,
    }
    if (t === 'Hotel') {
      const specific = ['Resort', 'Heritage', 'Boutique', 'Suite']
      return !specific.some((s) => (keywords[s] || []).some((k) => hay.includes(k)))
    }
    return (keywords[t] || []).some((k) => hay.includes(k))
  }

  const locationList = useMemo(() => {
    const set = new Set((hotels || []).map((h) => h.city))
    return [...set]
  }, [hotels])

  const filtered = useMemo(() => {
    if (!hotels) return []
    let list = hotels.filter((h) => {
      if (h.pricePerNight < priceRange[0] || h.pricePerNight > priceRange[1]) return false
      if (stars.length && !stars.includes(h.star)) return false
      if (minRating && h.guestRating < minRating) return false
      if (amenities.length && !amenities.every((a) => h.amenities.includes(a))) return false
      if (propertyTypes.length && !propertyTypes.some((t) => matchesProperty(h, t))) return false
      if (freeCancel && !h.rooms.some((r) => r.refundable)) return false
      if (breakfast && !h.rooms.some((r) => r.breakfast)) return false
      if (locations.length && !locations.includes(h.city)) return false
      return true
    })
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.pricePerNight - b.pricePerNight); break
      case 'price-desc': list = [...list].sort((a, b) => b.pricePerNight - a.pricePerNight); break
      case 'rating': list = [...list].sort((a, b) => b.guestRating - a.guestRating); break
      default: list = [...list].sort((a, b) => b.guestRating * 0.6 + (b.star / 5) * 0.4 - (a.guestRating * 0.6 + (a.star / 5) * 0.4)); break
    }
    return list
  }, [hotels, priceRange, stars, minRating, amenities, freeCancel, breakfast, locations, sort])

  const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  const resetFilters = () => {
    setPriceRange([0, 100000]); setStars([]); setMinRating(0); setAmenities([]); setPropertyTypes([])
    setFreeCancel(false); setBreakfast(false); setLocations([])
  }

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
        <p className="text-sm font-semibold text-slate-700">Price per night</p>
        <Slider min={0} max={100000} step={1000} value={priceRange} onValueChange={setPriceRange} />
        <div className="flex justify-between text-xs font-medium text-slate-500">
          <span>₹{(priceRange[0]).toLocaleString('en-IN')}</span>
          <span>₹{(priceRange[1]).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-slate-700">Star rating</p>
        {[5, 4, 3].map((s) => (
          <label key={s} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
            <Checkbox checked={stars.includes(s)} onCheckedChange={() => toggle(stars, setStars, s)} />
            <span className="flex">{Array.from({ length: s }).map((_, i) => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />)}</span>
            & up
          </label>
        ))}
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-slate-700">Guest rating</p>
        {[4.5, 4, 3.5].map((r) => (
          <label key={r} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
            <Checkbox checked={minRating === r} onCheckedChange={(v) => setMinRating(v ? r : 0)} />
            {r}+ Excellent
          </label>
        ))}
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-slate-700">Property type</p>
        {PROPERTY_TYPES.map((t) => (
          <label key={t} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
            <Checkbox checked={propertyTypes.includes(t)} onCheckedChange={() => toggle(propertyTypes, setPropertyTypes, t)} />
            {t}
          </label>
        ))}
      </div>

      <div className="space-y-2.5">
        <p className="text-sm font-semibold text-slate-700">Amenities</p>
        {AMENITIES.map((a) => (
          <label key={a} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
            <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggle(amenities, setAmenities, a)} />
            {a === 'Free WiFi' ? <Wifi className="size-3.5" /> : a === 'Breakfast' ? <Coffee className="size-3.5" /> : null}
            {a}
          </label>
        ))}
      </div>

      {locationList.length > 1 && (
        <div className="space-y-2.5">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700"><MapPin className="size-4" /> Location</p>
          {locationList.map((l) => (
            <label key={l} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
              <Checkbox checked={locations.includes(l)} onCheckedChange={() => toggle(locations, setLocations, l)} />
              {l}
            </label>
          ))}
        </div>
      )}

      <div className="space-y-2.5">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <Checkbox checked={freeCancel} onCheckedChange={setFreeCancel} />
          <ShieldCheck className="size-4 text-emerald-500" /> Free cancellation
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-600">
          <Checkbox checked={breakfast} onCheckedChange={setBreakfast} />
          <Coffee className="size-4 text-sun-600" /> Breakfast included
        </label>
      </div>
    </div>
  )

  return (
    <div>
      <PageHero
        image="hotelPool"
        title="Search Hotels"
        subtitle={destination ? `Stays in ${destination}` : 'Discover 80,000+ hotels, resorts and villas worldwide'}
        crumb={[{ label: 'Hotels' }]}
      />

      <div className="container-x -mt-8">
        <div className="rounded-2xl bg-gradient-to-r from-brand-200 via-sun-200 to-brand-200 p-px shadow-lift">
          <div className="rounded-[15px] bg-white p-4">
            <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-52">
              <MapPin className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={destination}
                readOnly
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-semibold text-slate-800"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              {params.get('checkIn') && <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">Check-in {params.get('checkIn')}</span>}
              {params.get('checkOut') && <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">Check-out {params.get('checkOut')}</span>}
              {params.get('guests') && <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold">{params.get('guests')} guests</span>}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Corporate trip context banner */}
      {params.get('corp') === '1' && travelDraft?.trip && (
        <div className="container-x mt-6">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white"><Briefcase className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-800">Business trip: {travelDraft.trip.title} · {travelDraft.trip.destination}</p>
              <p className="text-xs text-slate-500">{formatDate(travelDraft.trip.startDate)} – {formatDate(travelDraft.trip.endDate)} · hotels checked against your nightly limit.</p>
            </div>
            <Link to="/trips/review" className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline">Review <ArrowRight className="size-3" /></Link>
          </div>
        </div>
      )}

      <div className="container-x mt-8">
        {isLoading ? (
          <div className="space-y-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[280px_1fr]">
                <Skeleton className="h-48 md:h-auto" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-8 w-44" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState message="We couldn't load hotels right now." onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No hotels match your filters" text="Try widening your price range or clearing some filters." action={<Button variant="secondary" onClick={resetFilters}>Clear all filters</Button>} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="sticky top-24 hidden h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:block">
              <div className="mb-6">{FilterHeader}</div>
              {FilterBody}
            </aside>
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-slate-900">{filtered.length} properties found</h2>
                  <p className="text-xs text-slate-500">{destination || 'All destinations'} · prices include taxes</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="secondary" className="lg:hidden"><Filter className="size-4" /> Filters</Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="inset-0 max-h-none rounded-none! border-0! p-0">
                      <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 pr-14">
                          <SheetTitle className="flex items-center gap-2 font-display text-lg">
                            <SlidersHorizontal className="size-5 text-brand-600" /> Filter hotels
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
                            Show {filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'}
                          </Button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SORTS.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-5">
                {filtered.map((h) => <HotelCard key={h.id} hotel={h} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
