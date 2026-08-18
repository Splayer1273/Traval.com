import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowRight, Briefcase, CalendarDays, CheckCircle2, ClipboardList, Hotel,
  Loader2, MapPin, Plane, Send, ShieldCheck, Users, Wallet,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Separator } from '../components/ui/separator.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Price } from '../components/Price.jsx'
import { PolicyNotice } from '../components/PolicyBadge.jsx'
import { corporateApi } from '../services/corporateApi.js'
import { checkTravelPlan } from '../lib/policy.js'
import { useTravel } from '../context/TravelContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { formatDate, formatTime, formatDay, daysBetween } from '../utils/format.js'

export default function TripReview() {
  const navigate = useNavigate()
  const { draft, clear } = useTravel()
  const { user } = useAuth()
  const { toast, error } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const { data: policies } = useQuery({
    queryKey: ['corporate-policies'],
    queryFn: () => corporateApi.getPolicies(),
    staleTime: 60_000,
  })

  if (!draft?.trip) {
    return (
      <div className="container-x py-16">
        <EmptyState
          icon={Briefcase}
          title="No trip in progress"
          text="Create a business trip first, then attach a flight and hotel."
          action={<Button asChild><Link to="/trips/new">Create business trip</Link></Button>}
        />
      </div>
    )
  }

  const trip = draft.trip
  const flight = draft.flight
  const hotel = draft.hotel
  const room = draft.room
  const nights = daysBetween(trip.startDate, trip.endDate) || 1
  const flightTotal = flight ? flight.price * (trip.travellers || 1) : 0
  const hotelTax = hotel && room ? Math.round((room.price * (hotel.taxPct || 0)) / 100) : 0
  const hotelTotal = hotel && room ? (room.price + hotelTax) * nights : 0
  const estimatedCost = flightTotal + hotelTotal

  const plan = checkTravelPlan(user, { flight, hotel, room }, policies)

  const submit = async () => {
    setSubmitting(true)
    try {
      const request = await corporateApi.createRequest({
        title: trip.title,
        destination: trip.destination,
        from: trip.from,
        purpose: trip.purpose,
        client: trip.client,
        project: trip.project,
        costCenter: trip.costCenter,
        travellers: trip.travellers || 1,
        startDate: trip.startDate,
        endDate: trip.endDate,
        estimatedCost,
        flight: flight ? {
          airline: flight.airline, flightNumber: flight.flightNumber, cabin: flight.cabin,
          from: { code: flight.origin.code, city: flight.origin.city },
          to: { code: flight.destination.code, city: flight.destination.city },
          dep: flight.departure, arr: flight.arrival, durationMin: flight.durationMin,
          stops: flight.stops, price: flight.price, baggage: flight.baggage.checkin,
          refundable: flight.refundable,
        } : null,
        hotel: hotel && room ? {
          name: hotel.name, city: hotel.city, star: hotel.star, room: room.name,
          pricePerNight: room.price, nights, total: hotelTotal, taxPct: hotel.taxPct,
        } : null,
        policy: { flight: plan.flight.status, hotel: plan.hotel.status, violation: plan.violation },
        approverEmail: 'amit@acme.com',
      })
      clear()
      toast(`Request ${request.ref} submitted — your manager has been notified.`, 'Submitted for approval')
      navigate(`/trips/${request.id}`)
    } catch (e) {
      error(e.message, 'Could not submit')
    } finally {
      setSubmitting(false)
    }
  }

  const SectionLabel = ({ icon: Icon, children }) => (
    <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Icon className="size-4 text-brand-600" /> {children}</p>
  )

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <ClipboardList className="size-4 text-brand-600" /> Review & submit
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Review your travel request</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Confirm the itinerary, policy status and estimated cost — then submit for {user?.manager || 'your manager'}'s approval.
          </p>
        </div>
      </div>

      <div className="container-x grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Trip summary */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <SectionLabel icon={Briefcase}>Trip</SectionLabel>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">{trip.title}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="size-4 text-brand-600" /> {trip.from} → {trip.destination}
                  </p>
                </div>
                <Badge variant="warning">Pending approval</Badge>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><CalendarDays className="size-3.5" /> Dates</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{formatDate(trip.startDate)} – {formatDate(trip.endDate)}</p>
                  <p className="text-[11px] text-slate-400">{nights} night{nights > 1 ? 's' : ''}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Users className="size-3.5" /> Travellers</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">{trip.travellers || 1}</p>
                  <p className="text-[11px] text-slate-400">{trip.department}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Briefcase className="size-3.5" /> Purpose</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 line-clamp-2">{trip.purpose}</p>
                  {trip.client && <p className="text-[11px] text-slate-400">Client: {trip.client}</p>}
                </div>
              </div>
              {(trip.project || trip.costCenter) && (
                <p className="mt-3 text-xs text-slate-500">
                  {trip.project && <span className="mr-4">Project: <span className="font-semibold text-slate-700">{trip.project}</span></span>}
                  {trip.costCenter && <span>Cost centre: <span className="font-semibold text-slate-700">{trip.costCenter}</span></span>}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Flight */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <SectionLabel icon={Plane}>Flight</SectionLabel>
                <Button variant="ghost" size="sm" asChild><Link to={`/flights?trip=roundtrip&from=${trip.fromCode}&to=${trip.destinationCode}&date=${trip.startDate}&return=${trip.endDate}&corp=1`}>Change</Link></Button>
              </div>
              {flight ? (
                <>
                  <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 p-4">
                    <div className="min-w-28">
                      <p className="text-xl font-bold text-slate-900">{formatTime(flight.departure)}</p>
                      <p className="text-sm font-bold text-slate-700">{flight.origin.code}</p>
                      <p className="text-xs text-slate-400">{formatDay(flight.departure)}, {formatDate(flight.departure)}</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center">
                      <div className="relative my-1.5 h-0.5 w-full min-w-16 bg-slate-200">
                        <Plane className="absolute left-1/2 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rotate-90 text-brand-500" />
                      </div>
                      <p className="text-[11px] text-slate-400">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`} · {flight.cabin}</p>
                    </div>
                    <div className="min-w-28 text-right">
                      <p className="text-xl font-bold text-slate-900">{formatTime(flight.arrival)}</p>
                      <p className="text-sm font-bold text-slate-700">{flight.destination.code}</p>
                      <p className="text-xs text-slate-400">{flight.airline} {flight.flightNumber}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    <Price amount={flight.price} /> per person × {trip.travellers || 1} = <span className="font-bold text-slate-800"><Price amount={flightTotal} /></span> · {typeof flight.baggage === 'string' ? flight.baggage : flight.baggage?.checkin} baggage · {flight.refundable ? 'refundable' : 'non-refundable'}
                  </p>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-600">No flight selected yet</p>
                  <Button className="mt-3" variant="secondary" size="sm" asChild><Link to={`/flights?trip=roundtrip&from=${trip.fromCode}&to=${trip.destinationCode}&date=${trip.startDate}&return=${trip.endDate}&corp=1`}><Plane className="size-4" /> Search flights</Link></Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hotel */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <SectionLabel icon={Hotel}>Hotel</SectionLabel>
                <Button variant="ghost" size="sm" asChild><Link to={`/hotels?destination=${trip.destination}&checkIn=${trip.startDate}&checkOut=${trip.endDate}&corp=1`}>Change</Link></Button>
              </div>
              {hotel && room ? (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Hotel className="size-5" /></span>
                    <div>
                      <p className="font-display text-base font-semibold text-slate-900">{hotel.name}</p>
                      <p className="text-xs text-slate-500">{hotel.city} · {'★'.repeat(hotel.star)} · {room.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800"><Price amount={room.price} /> <span className="text-xs font-medium text-slate-400">/night</span></p>
                    <p className="text-xs text-slate-500">{nights} nights · <Price amount={hotelTotal} /> incl. taxes</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                  <p className="text-sm font-semibold text-slate-600">No hotel selected — optional, you can book one later.</p>
                  <Button className="mt-3" variant="secondary" size="sm" asChild><Link to={`/hotels?destination=${trip.destination}&checkIn=${trip.startDate}&checkOut=${trip.endDate}&corp=1`}><Hotel className="size-4" /> Search hotels</Link></Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Policy */}
          <PolicyNotice flight={flight} hotel={hotel} room={room} />
        </div>

        {/* Summary sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-5 text-white">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-200">
                <Wallet className="size-4" /> Estimated company cost
              </p>
              <p className="mt-2 font-display text-3xl font-bold"><Price amount={estimatedCost} /></p>
              <p className="text-xs text-brand-100">for {trip.travellers || 1} traveller · {nights} night{nights > 1 ? 's' : ''}</p>
            </div>
            <CardContent className="space-y-3 p-5 text-sm">
              {flight && (
                <div className="flex justify-between"><span className="text-slate-500">Flight ({flight.airline})</span><span className="font-semibold text-slate-800"><Price amount={flightTotal} /></span></div>
              )}
              {hotel && room && (
                <div className="flex justify-between"><span className="text-slate-500">Hotel · {nights} nights</span><span className="font-semibold text-slate-800"><Price amount={hotelTotal} /></span></div>
              )}
              {!flight && !hotel && <p className="text-xs text-slate-400">Add a flight or hotel to see the estimate.</p>}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Requested amount</span>
                <span className="text-xl font-bold text-slate-900"><Price amount={estimatedCost} /></span>
              </div>

              <div className="rounded-xl bg-slate-50 p-3.5 text-xs text-slate-500">
                <p className="flex items-center gap-1.5 font-semibold text-slate-700"><ShieldCheck className="size-3.5 text-emerald-600" /> Policy: {plan.worst === 'within' ? 'within limits' : plan.worst === 'outside' ? 'exception flagged' : 'violation flagged'}</p>
                <p className="mt-1.5">Approver: <span className="font-semibold text-slate-700">{user?.manager || 'Amit Sharma'}</span> · Approval typically within 24h.</p>
              </div>

              <Button size="lg" className="w-full" disabled={submitting} onClick={submit}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                {submitting ? 'Submitting…' : 'Submit for approval'}
              </Button>
              {plan.violation && (
                <p className="flex items-start gap-1.5 rounded-lg bg-amber-50 p-2.5 text-[11px] leading-relaxed text-amber-700">
                  <ShieldCheck className="mt-0.5 size-3.5 shrink-0" />
                  Your selection is outside policy. You can still submit — the approver will review the exception before approving.
                </p>
              )}
              <p className="text-center text-[11px] text-slate-400">
                No payment is made now. Booking & ticketing happen after approval.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><CheckCircle2 className="size-4 text-emerald-600" /> What happens next</p>
              <ol className="space-y-2.5 text-sm text-slate-600">
                <li className="flex gap-2.5"><span className="font-bold text-brand-700">1.</span> Manager reviews purpose, itinerary & policy</li>
                <li className="flex gap-2.5"><span className="font-bold text-brand-700">2.</span> Approval → booking confirmed</li>
                <li className="flex gap-2.5"><span className="font-bold text-brand-700">3.</span> E-ticket generated & you're notified</li>
              </ol>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
