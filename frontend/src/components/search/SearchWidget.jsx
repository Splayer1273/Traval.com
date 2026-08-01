import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftRight, Plane, Hotel, Search, PlaneTakeoff, Briefcase } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs.jsx'
import DateField from '../DateField.jsx'
import GuestPicker from '../GuestPicker.jsx'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select.jsx'
import { AIRPORTS } from '../../data/airports.js'
import { todayISO, addDays } from '../../utils/format.js'
import { cn } from '../../lib/utils.js'

function AirportSelect({ value, onChange, label, exclude }) {
  return (
    <div className="w-full">
      <span className="mb-1.5 block text-xs font-medium text-slate-500">{label}</span>
      <Select value={value || undefined} onValueChange={onChange}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Choose city or airport" />
        </SelectTrigger>
        <SelectContent>
          {AIRPORTS.filter((a) => a.code !== exclude).map((a) => (
            <SelectItem key={a.code} value={a.code}>
              <span className="font-semibold">{a.code}</span> — {a.city}, {a.country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default function SearchWidget({ compact = false }) {
  const navigate = useNavigate()
  const [trip, setTrip] = useState('roundtrip')
  const [from, setFrom] = useState('BOM')
  const [to, setTo] = useState('DEL')
  const [depart, setDepart] = useState(todayISO(14))
  const [returnDate, setReturnDate] = useState(todayISO(18))
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, rooms: 1 })
  const [cabin, setCabin] = useState('Economy')
  const [hotelDest, setHotelDest] = useState('Mumbai')
  const [checkIn, setCheckIn] = useState(todayISO(14))
  const [checkOut, setCheckOut] = useState(todayISO(16))
  const [hotelGuests, setHotelGuests] = useState({ adults: 2, children: 0, infants: 0, rooms: 1 })

  const searchFlights = () => {
    const params = new URLSearchParams({
      trip,
      from,
      to,
      date: depart,
      cabin,
      adults: guests.adults,
      children: guests.children,
      infants: guests.infants,
    })
    if (trip === 'roundtrip' && returnDate) params.set('return', returnDate)
    navigate(`/flights?${params.toString()}`)
  }

  const searchHotels = () => {
    const params = new URLSearchParams({
      destination: hotelDest,
      checkIn,
      checkOut,
      guests: hotelGuests.adults + hotelGuests.children,
      rooms: hotelGuests.rooms,
    })
    navigate(`/hotels?${params.toString()}`)
  }

  const searchPackages = () => navigate('/packages')

  return (
    <div className={cn('relative z-10 w-full rounded-3xl bg-white/95 p-3 shadow-lift backdrop-blur sm:p-4', compact && 'bg-white')}>
      <Tabs defaultValue="flights" onValueChange={(v) => {}}>
        <TabsList className="mb-3 w-full justify-start gap-1 overflow-x-auto bg-transparent p-0 sm:gap-2">
          <TabsTrigger value="flights" className="data-[state=active]:bg-brand-600 data-[state=active]:text-white">
            <Plane className="size-4" /> Flights
          </TabsTrigger>
          <TabsTrigger value="hotels" className="data-[state=active]:bg-brand-600 data-[state=active]:text-white">
            <Hotel className="size-4" /> Hotels
          </TabsTrigger>
          <TabsTrigger value="packages" className="data-[state=active]:bg-brand-600 data-[state=active]:text-white">
            <Briefcase className="size-4" /> Holiday Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="mt-0">
          {/* Trip type */}
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {[
              ['oneway', 'One Way'],
              ['roundtrip', 'Round Trip'],
              ['multicity', 'Multi City'],
            ].map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setTrip(val)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all',
                  trip === val ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-12">
            <div className="relative grid gap-3 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
              <AirportSelect label="From" value={from} onChange={setFrom} exclude={to} />
              <AirportSelect label="To" value={to} onChange={setTo} exclude={from} />
              <button
                type="button"
                onClick={() => { setFrom(to); setTo(from) }}
                className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-600 p-1.5 text-white shadow-card transition-transform hover:rotate-180 lg:block"
                aria-label="Swap destinations"
              >
                <ArrowLeftRight className="size-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-3">
              <DateField label="Departure" value={depart} onChange={setDepart} />
              {trip === 'roundtrip' && (
                <DateField label="Return" value={returnDate} onChange={setReturnDate} min={depart} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-2">
              <div>
                <span className="mb-1.5 block text-xs font-medium text-slate-500">Travellers</span>
                <GuestPicker {...guests} onChange={setGuests} showRooms={false} />
              </div>
              <div className="w-full">
                <span className="mb-1.5 block text-xs font-medium text-slate-500">Class</span>
                <Select value={cabin} onValueChange={setCabin}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Economy">Economy</SelectItem>
                    <SelectItem value="Premium Economy">Premium Economy</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="First Class">First Class</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-end lg:col-span-2">
              <button
                type="button"
                onClick={searchFlights}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-5 text-sm font-bold text-white shadow-glow transition-all hover:from-sun-600 hover:to-sun-700 active:scale-[0.98]"
              >
                <Search className="size-4" /> Search Flights
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hotels" className="mt-0">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
            <div className="w-full lg:col-span-4">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Destination</span>
              <input
                value={hotelDest}
                onChange={(e) => setHotelDest(e.target.value)}
                placeholder="City, hotel or area"
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 lg:col-span-4">
              <DateField label="Check-in" value={checkIn} onChange={setCheckIn} />
              <DateField label="Check-out" value={checkOut} onChange={setCheckOut} min={checkIn} />
            </div>
            <div className="w-full lg:col-span-2">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Guests & Rooms</span>
              <GuestPicker {...hotelGuests} onChange={setHotelGuests} />
            </div>
            <div className="flex items-end lg:col-span-2">
              <button
                type="button"
                onClick={searchHotels}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-5 text-sm font-bold text-white shadow-glow transition-all hover:from-sun-600 hover:to-sun-700 active:scale-[0.98]"
              >
                <Search className="size-4" /> Search Hotels
              </button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="packages" className="mt-0">
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-gradient-to-r from-brand-50 to-sun-50 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <PlaneTakeoff className="size-5 text-brand-600" /> Curated holiday packages
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Bali honeymoons, Dubai escapes, Kashmir paradise & the Europe Grand Tour — flights, hotels & experiences included.
              </p>
            </div>
            <button
              type="button"
              onClick={searchPackages}
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 text-sm font-bold text-white shadow-glow transition-all hover:from-brand-700 hover:to-brand-800 active:scale-[0.98]"
            >
              <Search className="size-4" /> Explore Packages
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
