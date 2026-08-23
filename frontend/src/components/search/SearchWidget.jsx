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
    <div className={cn('relative z-10 w-full rounded-2xl shadow-lift sm:rounded-3xl', compact ? 'bg-white' : 'bg-gradient-to-r from-brand-200 via-sun-200 to-brand-200 p-px')}>
      <div className={cn('rounded-[15px] p-3 sm:rounded-[23px] sm:p-4', compact ? 'bg-white' : 'bg-white/95 backdrop-blur')}>
      <Tabs defaultValue="flights" onValueChange={(v) => {}}>
        <TabsList className="mb-3 w-full justify-start gap-1 overflow-x-auto bg-transparent p-0 sm:gap-2">
          <TabsTrigger value="flights" className="px-2.5 text-xs sm:px-3 sm:text-sm data-[state=active]:bg-brand-600 data-[state=active]:text-white sm:px-4">
            <Plane className="size-3.5 sm:size-4" /> <span className="hidden sm:inline">Flights</span><span className="sm:hidden">Fly</span>
          </TabsTrigger>
          <TabsTrigger value="hotels" className="px-2.5 text-xs sm:px-3 sm:text-sm data-[state=active]:bg-brand-600 data-[state=active]:text-white sm:px-4">
            <Hotel className="size-3.5 sm:size-4" /> <span className="hidden sm:inline">Hotels</span><span className="sm:hidden">Stay</span>
          </TabsTrigger>
          <TabsTrigger value="packages" className="px-2.5 text-xs sm:px-3 sm:text-sm data-[state=active]:bg-brand-600 data-[state=active]:text-white sm:px-4">
            <Briefcase className="size-3.5 sm:size-4" /> <span className="hidden sm:inline">Holiday Packages</span><span className="sm:hidden">Packages</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flights" className="mt-0">
          {/* Trip type */}
          <div className="mb-3 flex flex-wrap items-center gap-1 sm:gap-1.5">
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
                  'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all sm:px-3.5 sm:py-1.5 sm:text-xs',
                  trip === val ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid gap-2.5 sm:gap-3 lg:grid-cols-12">
            <div className="relative grid gap-2.5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-2">
              <AirportSelect label="From" value={from} onChange={setFrom} exclude={to} />
              <AirportSelect label="To" value={to} onChange={setTo} exclude={from} />
              <button
                type="button"
                onClick={() => { setFrom(to); setTo(from) }}
                className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-600 p-1.5 text-white shadow-card transition-transform hover:rotate-180 sm:block"
                aria-label="Swap destinations"
              >
                <ArrowLeftRight className="size-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:col-span-2 sm:gap-3 lg:col-span-3">
              <DateField label="Departure" value={depart} onChange={setDepart} />
              {trip === 'roundtrip' && (
                <DateField label="Return" value={returnDate} onChange={setReturnDate} min={depart} />
              )}
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:col-span-2 sm:gap-3 lg:col-span-2">
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
          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-12">
            <div className="w-full sm:col-span-2 lg:col-span-4">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Destination</span>
              <input
                value={hotelDest}
                onChange={(e) => setHotelDest(e.target.value)}
                placeholder="City, hotel or area"
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:col-span-3">
              <DateField label="Check-in" value={checkIn} onChange={setCheckIn} />
              <DateField label="Check-out" value={checkOut} onChange={setCheckOut} min={checkIn} />
            </div>
            <div className="lg:col-span-3">
              <span className="mb-1.5 block text-xs font-medium text-slate-500">Guests & rooms</span>
              <GuestPicker {...hotelGuests} onChange={setHotelGuests} showRooms />
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
          <div className="flex flex-col items-center gap-4 py-4 text-center sm:flex-row sm:justify-between sm:py-0">
            <div className="text-center sm:text-left">
              <p className="font-display text-lg font-semibold text-slate-900">Explore holiday packages</p>
              <p className="text-sm text-slate-500">Curated packages with flights, hotels and experiences.</p>
            </div>
            <button
              type="button"
              onClick={searchPackages}
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-6 text-sm font-bold text-white shadow-glow transition-all hover:from-sun-600 hover:to-sun-700 active:scale-[0.98]"
            >
              <Search className="size-4" /> Browse Packages
            </button>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
