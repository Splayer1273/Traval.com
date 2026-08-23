import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Luggage, Plane, ShieldCheck, Users } from 'lucide-react'
import { Badge } from '../ui/badge.jsx'
import { Price } from '../Price.jsx'
import { PolicyBadge } from '../PolicyBadge.jsx'
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

export default function FlightCard({ flight, showReturn = false, highlight = null }) {
  const overnight = new Date(flight.arrival).getDate() !== new Date(flight.departure).getDate()
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift">
      {/* Highlight ribbon (e.g. "Cheapest", "Best value") */}
      {highlight && (
        <div className="absolute left-0 top-0 z-10 rounded-br-2xl bg-gradient-to-r from-sun-500 to-sun-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-soft sm:px-3">
          {highlight}
        </div>
      )}

      {/* Mobile: vertical stack layout */}
      <div className={cn('flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-6 lg:p-5', highlight && 'pt-3 sm:pt-4')}>
        
        {/* Row 1: Airline info + Price on mobile (side by side) */}
        <div className="flex items-center justify-between gap-3 lg:contents">
          {/* Airline */}
          <div className="flex items-center gap-2.5 sm:gap-3 lg:flex lg:items-center lg:gap-3">
            <AirlineLogo code={flight.airlineCode} color={flight.airlineColor} />
            <div className="min-w-0 flex-1 lg:flex-none">
              <p className="truncate text-xs font-bold text-slate-900 sm:text-sm">{flight.airline}</p>
              <p className="text-[11px] text-slate-500 sm:text-xs">{flight.flightNumber} · {flight.aircraft}</p>
            </div>
          </div>

          {/* Price + CTA (mobile: inline with airline; desktop: separate column) */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="text-right">
              <p className="text-base font-bold text-slate-900 sm:text-lg">
                <Price amount={flight.price} />
              </p>
              <p className="text-[10px] text-slate-400">per person</p>
            </div>
            <Link
              to={`/flights/${flight.id}${showReturn ? '?leg=return' : ''}`}
              className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-4 text-xs font-bold text-white shadow-glow transition-all hover:from-brand-700 hover:to-brand-800 active:scale-[0.98]"
            >
              Select <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Row 2: Route timeline */}
        <div className="flex items-center gap-2 sm:gap-3 lg:flex lg:items-center lg:gap-5">
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">{formatTime(flight.departure)}</p>
            <p className="text-xs font-bold text-slate-700 sm:text-sm">
              {flight.origin.code}
              <span className="hidden font-medium text-slate-400 sm:inline"> · {flight.origin.city}</span>
            </p>
            <p className="text-[10px] text-slate-400 sm:text-[11px]">{formatDay(flight.departure)}, {formatDateShort(flight.departure)}</p>
          </div>

          <div className="flex flex-1 flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 sm:gap-1.5 sm:text-[11px]">
              <span>{minutesToLabel(flight.durationMin)}</span>
              {overnight && <Badge variant="secondary">+1</Badge>}
            </div>
            <div className="relative my-1 h-0.5 w-full min-w-12 rounded-full bg-slate-200 sm:my-1.5 sm:min-w-16">
              <div className="absolute -left-1 top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-slate-300 bg-white sm:size-2.5" />
              <Plane className="absolute left-1/2 top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rotate-90 text-brand-500 transition-transform duration-300 group-hover:translate-x-0.5 sm:size-4" />
              <div className="absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full border-2 border-brand-400 bg-white sm:size-2.5" />
            </div>
            <p className="text-[10px] font-medium text-slate-500 sm:text-[11px]">
              {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}${flight.stopCity ? ` · ${flight.stopCity}` : ''}`}
            </p>
          </div>

          <div className="min-w-0 text-center sm:text-right">
            <p className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">{formatTime(flight.arrival)}</p>
            <p className="text-xs font-bold text-slate-700 sm:text-sm">
              {flight.destination.code}
              <span className="hidden font-medium text-slate-400 sm:inline"> · {flight.destination.city}</span>
            </p>
            <p className="text-[10px] text-slate-400 sm:text-[11px]">{formatDay(flight.arrival)}, {formatDateShort(flight.arrival)}</p>
          </div>
        </div>

        {/* Row 3: Desktop-only Price + CTA */}
        <div className="hidden lg:flex lg:flex-col lg:items-end lg:gap-1">
          <p className="text-xl font-bold text-slate-900">
            <Price amount={flight.price} />
          </p>
          <p className="text-[11px] text-slate-400">per person · taxes incl.</p>
          <Link
            to={`/flights/${flight.id}${showReturn ? '?leg=return' : ''}`}
            className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-6 text-sm font-bold text-white shadow-glow transition-all hover:from-brand-700 hover:to-brand-800 active:scale-[0.98]"
          >
            Select <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 bg-slate-50/60 px-3 py-2 text-[10px] text-slate-500 sm:gap-x-4 sm:px-4 sm:py-2.5 sm:text-xs lg:px-5">
        <span className="flex items-center gap-1 sm:gap-1.5"><Clock className="size-3 text-slate-400 sm:size-3.5" /> {minutesToLabel(flight.durationMin)}</span>
        <span className="flex items-center gap-1 sm:gap-1.5"><Luggage className="size-3 text-slate-400 sm:size-3.5" /> {flight.baggage.checkin}</span>
        <span className="flex items-center gap-1 sm:gap-1.5"><Plane className="size-3 text-slate-400 sm:size-3.5" /> {flight.cabin}</span>
        <Badge variant={flight.refundable ? 'success' : 'secondary'} className="hidden sm:flex">
          <ShieldCheck className="size-3" /> {flight.refundable ? 'Refundable' : 'Non-refundable'}
        </Badge>
        <PolicyBadge flight={flight} />
        <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-400 sm:gap-1.5 sm:text-[11px]">
          <Users className="size-3 sm:size-3.5" /> {flight.seatsLeft} seats left
        </span>
      </div>
    </div>
  )
}
