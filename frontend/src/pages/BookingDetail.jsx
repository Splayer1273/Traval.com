import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Download, UserRound, CreditCard, MapPin, Calendar, Clock, Check, Plane, ArrowRight,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Separator } from '../components/ui/separator.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Price } from '../components/Price.jsx'
import { bookingApi } from '../services/bookingApi.js'
import { useToast } from '../context/ToastContext.jsx'
import { formatDate, formatTime, fullName } from '../utils/format.js'

const STATUS_BADGE = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  upcoming: { label: 'Upcoming', variant: 'default' },
  completed: { label: 'Completed', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
}

export default function BookingDetail() {
  const { id } = useParams()
  const { toast } = useToast()
  const { data: b, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getBooking(id),
  })

  if (isLoading) return <div className="container-x py-10"><Skeleton className="h-96 w-full rounded-2xl" /></div>
  if (!b) {
    return (
      <div className="container-x py-16 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">Booking not found</p>
        <Button className="mt-4" asChild><a href="/my-trips">Back to My Trips</a></Button>
      </div>
    )
  }

  const badge = STATUS_BADGE[b.status] || STATUS_BADGE.confirmed
  const isFlight = b.type === 'flight'
  const isHotel = b.type === 'hotel'

  const download = (what) => toast(`${what} for ${b.pnr} downloaded successfully.`, 'Download')

  return (
    <div className="bg-slate-50">
      <div className="container-x py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-500">{b.pnr}</span>
              <Badge variant={badge.variant}>{badge.label}</Badge>
            </div>
            <h1 className="mt-1 font-display text-2xl font-semibold text-slate-900 sm:text-3xl">{b.title}</h1>
            <p className="mt-1 text-sm text-slate-500">{b.destination}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => download('E-ticket')}><Download className="size-4" /> Ticket</Button>
            <Button variant="secondary" onClick={() => download('Invoice')}><Download className="size-4" /> Invoice</Button>
            <Button asChild><a href="/my-trips"><ArrowRight className="size-4" /> My Trips</a></Button>
          </div>
        </div>

        {/* Trip summary */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 shadow-lift">
          <div className="grid gap-6 p-6 text-white sm:grid-cols-3 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Booking reference</p>
              <p className="mt-1 font-mono text-lg font-bold">{b.ref}</p>
            </div>
            {isFlight ? (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Route</p>
                  <p className="mt-1 text-lg font-bold">{b.summary.from.code} → {b.summary.to.code}</p>
                  <p className="text-xs text-brand-100">{b.summary.from.city} → {b.summary.to.city}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Flight</p>
                  <p className="mt-1 text-lg font-bold">{b.summary.airline}</p>
                  <p className="text-xs text-brand-100">{b.summary.cabin} · {b.summary.baggage}</p>
                </div>
              </>
            ) : isHotel ? (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Stay</p>
                  <p className="mt-1 text-lg font-bold">{b.summary.nights} nights</p>
                  <p className="text-xs text-brand-100">{b.summary.room}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Board</p>
                  <p className="mt-1 text-lg font-bold">{b.summary.board}</p>
                  <p className="text-xs text-brand-100">{b.summary.hotel}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Package</p>
                  <p className="mt-1 text-lg font-bold">{b.summary.package}</p>
                  <p className="text-xs text-brand-100">{b.summary.hotel}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Flights</p>
                  <p className="mt-1 text-lg font-bold">{b.summary.flights}</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Passenger details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-brand-600" /> Traveller details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-slate-100">
                  {b.passengers?.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sun-500 text-sm font-bold text-white">
                          {fullName(p)[0] || 'T'}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{fullName(p)}</p>
                          <p className="text-xs text-slate-500">{p.gender || p.type || 'Guest'}{p.seat ? ` · Seat ${p.seat}` : ''}{p.room ? ` · ${p.room}` : ''}</p>
                        </div>
                      </div>
                      {p.seat && <Badge variant="secondary">Seat {p.seat}</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><MapPin className="size-5 text-brand-600" /> Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                {isFlight && (
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <div className="sm:w-32">
                      <p className="text-xl font-bold text-slate-900">{formatTime(b.summary.dep)}</p>
                      <p className="text-sm font-bold text-slate-700">{b.summary.from.code} · {b.summary.from.city}</p>
                      <p className="text-xs text-slate-400">{formatDate(b.summary.dep)}</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center">
                      <div className="h-px w-full bg-slate-200 relative">
                        <Plane className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-90 text-brand-500" />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">Direct flight</p>
                    </div>
                    <div className="sm:w-32 sm:text-right">
                      <p className="text-xl font-bold text-slate-900">{formatTime(b.summary.arr)}</p>
                      <p className="text-sm font-bold text-slate-700">{b.summary.to.code} · {b.summary.to.city}</p>
                      <p className="text-xs text-slate-400">{formatDate(b.summary.arr)}</p>
                    </div>
                  </div>
                )}
                {isHotel && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Calendar className="size-3.5" /> Check-in</p>
                      <p className="mt-1 font-bold text-slate-900">{formatDate(b.summary.checkIn)}</p>
                      <p className="text-xs text-slate-500">{formatTime(b.summary.checkIn)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Calendar className="size-3.5" /> Check-out</p>
                      <p className="mt-1 font-bold text-slate-900">{formatDate(b.summary.checkOut)}</p>
                      <p className="text-xs text-slate-500">{formatTime(b.summary.checkOut)}</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Clock className="size-3.5" /> Duration</p>
                      <p className="mt-1 font-bold text-slate-900">{b.summary.nights} nights</p>
                      <p className="text-xs text-slate-500">{b.summary.room}</p>
                    </div>
                  </div>
                )}
                {b.addons?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-bold text-slate-800">Add-ons</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {b.addons.map((a) => (
                        <Badge key={a.name} variant="secondary">{a.name}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Journey timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="size-5 text-brand-600" /> Booking timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative space-y-5 border-l-2 border-slate-200 pl-5">
                  {b.timeline?.map((t) => (
                    <li key={t.label} className="relative">
                      <span className={`absolute -left-[27px] top-0.5 flex size-4 items-center justify-center rounded-full border-2 ${t.done ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'}`}>
                        {t.done && <Check className="size-2.5 text-white" />}
                      </span>
                      <p className={`text-sm font-semibold ${t.done ? 'text-slate-800' : 'text-slate-400'}`}>{t.label}</p>
                      <p className="text-xs text-slate-400">{t.time}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Payment summary */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="size-5 text-brand-600" /> Payment details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Base fare</span><span className="font-semibold text-slate-800"><Price amount={b.payment.base} /></span></div>
                <div className="flex justify-between"><span className="text-slate-500">Taxes & fees</span><span className="font-semibold text-slate-800"><Price amount={b.payment.taxes} /></span></div>
                {b.addons?.map((a) => (
                  <div key={a.name} className="flex justify-between"><span className="text-slate-500">{a.name}</span><span className="font-semibold text-slate-800"><Price amount={a.price} /></span></div>
                ))}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Amount paid</span>
                  <Price amount={b.payment.paid} className="text-xl font-bold text-slate-900" />
                </div>
                <div className="rounded-xl bg-slate-50 p-3.5 text-xs">
                  <p className="flex items-center justify-between"><span className="text-slate-500">Paid via</span><span className="font-semibold text-slate-700">{b.payment.method}</span></p>
                  {b.payment.refunded && <p className="mt-1.5 flex items-center justify-between"><span className="text-slate-500">Refunded</span><span className="font-semibold text-emerald-600"><Price amount={b.payment.refunded} /></span></p>}
                </div>
                <Button variant="secondary" className="w-full" onClick={() => download('Invoice')}><Download className="size-4" /> Download invoice</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 text-xs leading-relaxed text-slate-500">
                <p className="mb-2 text-sm font-bold text-slate-800">Cancellation policy</p>
                {b.status === 'cancelled' ? (
                  <p>This booking was cancelled. Refund of <Price amount={b.payment.refunded || 0} /> was processed to your original payment method.</p>
                ) : (
                  <p>Free cancellation up to 24 hours before departure for this fare. After that, cancellation charges of ₹2,500 per traveller apply. Government taxes are refunded as per airline policy.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
