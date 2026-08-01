import { Link } from 'react-router-dom'
import { ArrowRight, Luggage, Plane, ShieldCheck } from 'lucide-react'
import { Badge } from '../ui/badge.jsx'
import { Price } from '../Price.jsx'
import { formatTime, formatDay, formatDateShort, minutesToLabel } from '../../utils/format.js'
import { cn } from '../../lib/utils.js'

export function AirlineLogo({ code, color, size = 'size-10' }) {
  return (
    <div
      className={cn('flex items-center justify-center rounded-xl font-bold text-white shadow-soft', size)}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      aria-hidden
    >
      {code}
    </div>
  )
}

export default function FlightCard({ flight, showReturn = false }) {
  const overnight = new Date(flight.arrival).getDate() !== new Date(flight.departure).getDate()
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition-all duration-300 hover:border-brand-300 hover:shadow-lift sm:p-5">
      <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <AirlineLogo code={flight.airlineCode} color={flight.airlineColor} />
            <div>
              <p className="text-sm font-bold text-slate-900">{flight.airline}</p>
              <p className="text-xs text-slate-500">{flight.flightNumber} · {flight.aircraft}</p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-4 sm:gap-6">
            <div className="text-center sm:text-left">
              <p className="text-lg font-bold text-slate-900">{formatTime(flight.departure)}</p>
              <p className="text-xs font-semibold text-slate-600">{flight.origin.code}</p>
              <p className="text-[11px] text-slate-400">{formatDateShort(flight.departure)}</p>
            </div>

            <div className="flex flex-1 flex-col items-center px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">{minutesToLabel(flight.durationMin)}</span>
                {overnight && <Badge variant="secondary">+1</Badge>}
              </div>
              <div className="relative my-1 h-px w-full min-w-20 bg-slate-200">
                <div className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-slate-300 bg-white" />
                <Plane className="absolute -right-2 top-1/2 size-3.5 -translate-y-1/2 rotate-90 text-brand-500" />
                <div className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-brand-400 bg-white" />
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}${flight.stopCity ? ` · ${flight.stopCity}` : ''}`}
              </p>
            </div>

            <div className="text-center sm:text-right">
              <p className="text-lg font-bold text-slate-900">{formatTime(flight.arrival)}</p>
              <p className="text-xs font-semibold text-slate-600">{flight.destination.code}</p>
              <p className="text-[11px] text-slate-400">{formatDateShort(flight.arrival)}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 lg:flex-col lg:items-end lg:gap-2">
            <Price amount={flight.price} className="text-2xl font-bold text-slate-900" />
            <p className="text-[11px] text-slate-400">per person</p>
            <div className="flex gap-1.5">
              <Badge variant={flight.refundable ? 'success' : 'secondary'}>
                <ShieldCheck className="size-3" /> {flight.refundable ? 'Refundable' : 'Non-refundable'}
              </Badge>
              <Badge variant="outline">
                <Luggage className="size-3" /> {flight.baggage.checkin}
              </Badge>
            </div>
          </div>
        </div>

        <div className="lg:pl-4">
          <Link
            to={`/flights/${flight.id}${showReturn ? '?leg=return' : ''}`}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 text-sm font-bold text-white shadow-glow transition-all hover:from-brand-700 hover:to-brand-800 active:scale-[0.98]"
          >
            Select <ArrowRight className="size-4" />
          </Link>
          <p className="mt-2 text-center text-[11px] text-slate-400">{flight.seatsLeft} seats left at this price</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        <span className="font-semibold text-slate-700">{formatDay(flight.departure)}</span> departure · {flight.cabin} class
      </p>
    </div>
  )
}
