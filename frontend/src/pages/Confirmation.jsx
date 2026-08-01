import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  CheckCircle2, Download, Luggage, Home, Plane, CreditCard, UserRound, MapPin, Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { bookingApi } from '../services/bookingApi.js'
import { useToast } from '../context/ToastContext.jsx'
import { formatDate, formatTime, fullName } from '../utils/format.js'

export default function Confirmation() {
  const { id } = useParams()
  const { toast } = useToast()
  const { data: b, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => bookingApi.getBooking(id),
  })

  const download = (what) => toast(`${what} for ${b?.pnr} downloaded. A copy is also in your inbox.`, 'Download')

  if (isLoading) return <div className="container-x py-10"><Skeleton className="h-96 w-full rounded-2xl" /></div>
  if (!b) {
    return (
      <div className="container-x py-16 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">Booking not found</p>
        <Button className="mt-4" asChild><a href="/">Return home</a></Button>
      </div>
    )
  }

  const isFlight = b.type === 'flight'

  return (
    <div className="bg-slate-50">
      <div className="container-x py-10">
        {/* Success banner */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex animate-scale-in items-center justify-center rounded-full bg-emerald-100 p-4 text-emerald-600">
            <CheckCircle2 className="size-12" />
          </span>
          <h1 className="mt-4 animate-fade-up font-display text-3xl font-semibold text-slate-900 sm:text-4xl">Booking confirmed! 🎉</h1>
          <p className="mt-2 animate-fade-up text-sm text-slate-500" style={{ animationDelay: '80ms' }}>
            A confirmation email with your e-ticket has been sent to your inbox.
          </p>
          <div className="mt-6 flex animate-fade-up flex-wrap items-center justify-center gap-3" style={{ animationDelay: '160ms' }}>
            <Button variant="secondary" onClick={() => download('E-ticket')}><Download className="size-4" /> Download Ticket</Button>
            <Button variant="secondary" onClick={() => download('Invoice')}><Download className="size-4" /> Download Invoice</Button>
            <Button asChild><a href="/my-trips"><Luggage className="size-4" /> View My Trips</a></Button>
            <Button variant="ghost" asChild><a href="/"><Home className="size-4" /> Return Home</a></Button>
          </div>
        </div>

        {/* Reference card */}
        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 shadow-lift">
          <div className="grid gap-6 p-6 text-white sm:grid-cols-3 sm:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Booking ID</p>
              <p className="mt-1 font-mono text-lg font-bold">{b.ref}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">PNR</p>
              <p className="mt-1 font-mono text-lg font-bold">{b.pnr}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Status</p>
              <Badge className="mt-1 bg-white/20 text-white"><span className="mr-1 size-1.5 rounded-full bg-emerald-400" /> Confirmed</Badge>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-6">
          {/* Trip details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isFlight ? <Plane className="size-5 text-brand-600" /> : <MapPin className="size-5 text-brand-600" />} Trip details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="font-display text-lg font-semibold text-slate-900">{b.title}</p>
                  <p className="text-xs text-slate-500">{b.destination}</p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p className="flex items-center justify-end gap-1"><Calendar className="size-3.5" /> Travel {formatDate(b.travelDate)}</p>
                  <p>Booked {formatDate(b.bookingDate)}</p>
                </div>
              </div>
              {isFlight && (
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="sm:w-28">
                    <p className="text-lg font-bold text-slate-900">{formatTime(b.summary.dep)}</p>
                    <p className="text-sm font-bold text-slate-700">{b.summary.from.code} · {b.summary.from.city}</p>
                    <p className="text-xs text-slate-400">{formatDate(b.summary.dep)}</p>
                  </div>
                  <div className="flex flex-1 flex-col items-center">
                    <div className="relative h-px w-full bg-slate-200">
                      <Plane className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-90 text-brand-500" />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{b.summary.airline}</p>
                  </div>
                  <div className="sm:w-28 sm:text-right">
                    <p className="text-lg font-bold text-slate-900">{formatTime(b.summary.arr)}</p>
                    <p className="text-sm font-bold text-slate-700">{b.summary.to.code} · {b.summary.to.city}</p>
                    <p className="text-xs text-slate-400">{formatDate(b.summary.arr)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Passenger details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserRound className="size-5 text-brand-600" /> Passenger details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100">
                {b.passengers?.map((p, i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sun-500 text-sm font-bold text-white">
                        {fullName(p)[0] || 'T'}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{fullName(p)}</p>
                        <p className="text-xs text-slate-500">{p.gender || p.type || 'Guest'}{p.seat ? ` · Seat ${p.seat}` : ''}</p>
                      </div>
                    </div>
                    {p.seat && <Badge variant="secondary">Seat {p.seat}</Badge>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CreditCard className="size-5 text-brand-600" /> Payment details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Base fare</span><span className="font-semibold text-slate-800">₹{b.payment.base.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Taxes & fees</span><span className="font-semibold text-slate-800">₹{b.payment.taxes.toLocaleString('en-IN')}</span></div>
              {b.addons?.map((a) => (
                <div key={a.name} className="flex justify-between"><span className="text-slate-500">{a.name}</span><span className="font-semibold text-slate-800">₹{a.price.toLocaleString('en-IN')}</span></div>
              ))}
              <div className="flex justify-between border-t border-slate-100 pt-2.5">
                <span className="font-bold text-slate-800">Total paid</span>
                <span className="text-lg font-bold text-slate-900">₹{b.payment.paid.toLocaleString('en-IN')}</span>
              </div>
              <p className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">Paid via {b.payment.method} · {b.payment.transactionId ? `Ref ${b.payment.transactionId}` : ''}</p>
            </CardContent>
          </Card>

          <div className="flex flex-wrap justify-center gap-3 pb-8">
            <Button variant="secondary" onClick={() => download('E-ticket')}><Download className="size-4" /> Download Ticket</Button>
            <Button variant="secondary" onClick={() => download('Invoice')}><Download className="size-4" /> Download Invoice</Button>
            <Button asChild><a href="/my-trips"><Luggage className="size-4" /> View My Trips</a></Button>
          </div>
        </div>
      </div>
    </div>
  )
}
