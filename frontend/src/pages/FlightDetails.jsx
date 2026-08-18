import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Plane, Luggage, ShieldCheck, Clock, AlertTriangle, Check, Info, ArrowRight,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import MobileActionBar from '../components/layout/MobileActionBar.jsx'
import { AirlineLogo } from '../components/cards/FlightCard.jsx'
import { Price } from '../components/Price.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Separator } from '../components/ui/separator.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { flightApi } from '../services/flightApi.js'
import { useBooking } from '../context/BookingContext.jsx'
import { useTravel } from '../context/TravelContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { PolicyNotice } from '../components/PolicyBadge.jsx'
import { formatTime, formatDate, formatDay, minutesToLabel, todayISO } from '../utils/format.js'

const FARE_RULES = [
  'Free date change up to 24 hours before departure (fare difference applies)',
  'Refundable fares: full refund minus ₹2,500 processing fee before departure',
  'Non-refundable fares: government taxes refunded on cancellation',
  'No-show results in 100% cancellation of the fare',
  'Name changes are not permitted after booking confirmation',
]

const LAYOVER_NOTE = 'Airlines manage connections automatically; your baggage is transferred to the final destination on through-ticketed journeys.'

export default function FlightDetails() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const leg = params.get('leg') === 'return' ? 'Return' : 'Outbound'
  const navigate = useNavigate()
  const { setKind } = useBooking()
  const { draft: travelDraft, setTrip, setFlight } = useTravel()
  const { user, isAuthenticated } = useAuth()

  const { data: flight, isLoading } = useQuery({
    queryKey: ['flight', id],
    queryFn: () => flightApi.getFlight(id),
  })

  const addDaysToISO = (iso, days) => {
    const d = new Date(`${iso}T00:00:00`)
    d.setDate(d.getDate() + days)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const continueBooking = () => {
    if (!isAuthenticated) {
      setKind('flight', { ...flight, leg })
      navigate(`/flights/${id}/passengers`)
      return
    }
    // Corporate flow — use the draft trip if one exists, otherwise create one
    // from this flight so the journey never dead-ends.
    const depDate = (flight.departure || '').slice(0, 10) || todayISO()
    const trip = travelDraft?.trip || {
      title: `${flight.origin.city} → ${flight.destination.city} business trip`,
      from: flight.origin.city,
      fromCode: flight.origin.code,
      destination: flight.destination.city,
      destinationCode: flight.destination.code,
      startDate: depDate,
      endDate: addDaysToISO(depDate, 2),
      purpose: 'Official business travel',
      client: '',
      department: user?.department || 'Technology',
      project: user?.projectCode || '',
      costCenter: user?.costCenter || '',
      travellers: 1,
    }
    setTrip(trip)
    setFlight({ ...flight, leg })
    navigate(`/hotels?destination=${trip.destination}&checkIn=${trip.startDate}&checkOut=${trip.endDate}&corp=1`)
  }

  if (isLoading) {
    return (
      <div className="container-x py-10">
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    )
  }

  if (!flight) {
    return (
      <div className="container-x py-16 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">Flight not found</p>
        <Button className="mt-4" onClick={() => navigate('/flights')}>Back to search</Button>
      </div>
    )
  }

  const overnight = new Date(flight.arrival).getDate() !== new Date(flight.departure).getDate()
  const layoverMinutes = Math.max(0, Math.round((new Date(flight.arrival) - new Date(flight.departure)) / 60000) - flight.durationMin)

  return (
    <div className="pb-14 lg:pb-0">
      <PageHero image="planeWing" title={`${flight.airline} ${flight.flightNumber}`} crumb={[{ label: 'Flights', to: '/flights' }, { label: flight.flightNumber }]} />

      <div className="container-x mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Flight summary */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AirlineLogo code={flight.airlineCode} color={flight.airlineColor} size="size-12" />
                  <div>
                    <p className="font-display text-lg font-semibold text-slate-900">{flight.airline}</p>
                    <p className="text-sm text-slate-500">{flight.flightNumber} · {flight.aircraft} · {leg}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={flight.refundable ? 'success' : 'secondary'}>
                    <ShieldCheck className="size-3" /> {flight.refundable ? 'Refundable' : 'Non-refundable'}
                  </Badge>
                  <Badge variant="outline"><Clock className="size-3" /> {minutesToLabel(flight.durationMin)}</Badge>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Itinerary timeline */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="sm:w-36">
                  <p className="text-2xl font-bold text-slate-900">{formatTime(flight.departure)}</p>
                  <p className="text-sm font-bold text-slate-700">{flight.origin.code}</p>
                  <p className="text-xs text-slate-500">{flight.origin.city}</p>
                  <p className="text-xs text-slate-400">{formatDay(flight.departure)}, {formatDate(flight.departure)}</p>
                  <p className="mt-1 text-[11px] text-slate-400">Terminal {flight.origin.terminal}</p>
                </div>

                <div className="flex flex-1 flex-col items-center">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>{minutesToLabel(flight.durationMin)}</span>
                    {overnight && <Badge variant="secondary">+1 day</Badge>}
                  </div>
                  <div className="relative my-2 h-0.5 w-full bg-slate-200">
                    <div className="absolute left-0 top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-brand-500 bg-white" />
                    <Plane className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rotate-90 text-brand-500" />
                    <div className="absolute right-0 top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-sun-500 bg-white" />
                  </div>
                  <p className="text-[11px] font-medium text-slate-500">
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}${flight.stopCity ? ` · ${flight.stopCity}` : ''}`}
                  </p>
                </div>

                <div className="sm:w-36 sm:text-right">
                  <p className="text-2xl font-bold text-slate-900">{formatTime(flight.arrival)}</p>
                  <p className="text-sm font-bold text-slate-700">{flight.destination.code}</p>
                  <p className="text-xs text-slate-500">{flight.destination.city}</p>
                  <p className="text-xs text-slate-400">{formatDay(flight.arrival)}, {formatDate(flight.arrival)}</p>
                  <p className="mt-1 text-[11px] text-slate-400">Terminal {flight.destination.terminal}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Layover info */}
          {flight.stops > 0 && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="flex items-start gap-3 p-5">
                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-500" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Layover in {flight.stopCity}</p>
                  <p className="mt-1 text-sm text-amber-700">{LAYOVER_NOTE} Expected connection time: ~{Math.max(60, layoverMinutes)} minutes.</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Baggage */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <Luggage className="size-5 text-brand-600" /> Baggage allowance
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {[
                  { label: 'Cabin baggage', value: `${flight.baggage.cabin} per passenger`, note: 'One cabin bag + personal item' },
                  { label: 'Check-in baggage', value: `${flight.baggage.checkin} per passenger`, note: 'Included in fare' },
                ].map((b) => (
                  <div key={b.label} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{b.label}</p>
                    <p className="mt-1 text-lg font-bold text-slate-900">{b.value}</p>
                    <p className="text-xs text-slate-500">{b.note}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-400">Extra baggage can be purchased as an add-on during checkout. Infants get 10 kg check-in baggage on most carriers.</p>
            </CardContent>
          </Card>

          {/* Cancellation & refund */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <ShieldCheck className="size-5 text-emerald-600" /> Cancellation & refund policy
              </h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <p className="text-sm font-bold text-emerald-800">{flight.refundable ? 'Refundable fare' : 'Non-refundable fare'}</p>
                  <p className="mt-1 text-xs text-emerald-700">
                    {flight.refundable
                      ? 'Cancel up to 24h before departure for a full refund (₹2,500 fee applies). Date changes free with fare difference.'
                      : 'Cancellation attracts a 100% fare loss. Government taxes are refundable as per airline policy.'}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-bold text-slate-800">Free date change window</p>
                  <p className="mt-1 text-xs text-slate-500">Up to 24 hours before scheduled departure, subject to seat availability.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fare rules */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                <Info className="size-5 text-sky-600" /> Fare rules
              </h3>
              <ul className="mt-4 space-y-2.5">
                {FARE_RULES.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" /> {r}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                Prices are per person and include all taxes and fuel surcharges. Fares are subject to availability and may change without notice.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Booking sidebar */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">Your fare summary</p>
              <p className="mt-1 font-display text-lg font-semibold">{flight.airline} {flight.flightNumber}</p>
              <p className="text-xs text-brand-100">{flight.origin.code} → {flight.destination.code} · {leg} · {flight.cabin}</p>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Base fare</span><span className="font-semibold text-slate-800"><Price amount={Math.round(flight.price * 0.85)} /></span></div>
              <div className="flex justify-between"><span className="text-slate-500">Taxes & surcharges</span><span className="font-semibold text-slate-800"><Price amount={flight.price - Math.round(flight.price * 0.85)} /></span></div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Total per traveller</span>
                <Price amount={flight.price} className="text-2xl font-bold text-slate-900" />
              </div>
              <p className="text-xs text-slate-400">Includes baggage, taxes & all fees</p>
              <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
                ✓ Free cancellation up to 24h before departure{flight.refundable ? ' (refundable fare)' : ' available on flexible upgrade'}
              </div>
              <PolicyNotice flight={flight} className="mb-3" compact />
              <Button className="w-full" size="lg" onClick={continueBooking}>
                {isAuthenticated ? 'Select this flight' : 'Continue to Passenger Details'} <ArrowRight className="size-4" />
              </Button>
              {isAuthenticated
                ? <p className="text-center text-[11px] text-slate-400">No payment now — this selection is reviewed by your manager.</p>
                : <p className="text-center text-[11px] text-slate-400">You can continue as a guest or <span className="font-semibold text-brand-600">sign in</span> for corporate booking.</p>}
            </div>
          </Card>
        </aside>
      </div>

      {/* Mobile sticky booking bar */}
      <MobileActionBar
        sub={`${flight.origin.code} → ${flight.destination.code} · ${leg} · ${flight.cabin}`}
        price={<Price amount={flight.price} className="text-xl font-bold text-slate-900" />}
        buttonText={isAuthenticated ? 'Select flight' : 'Continue'}
        icon={<ArrowRight className="size-4" />}
        onClick={continueBooking}
      />
    </div>
  )
}
