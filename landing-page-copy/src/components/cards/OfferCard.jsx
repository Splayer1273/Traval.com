import { BadgePercent, CalendarClock, Ticket } from 'lucide-react'
import Img from '../Img.jsx'
import { Badge } from '../ui/badge.jsx'
import { formatDate } from '../../utils/format.js'

export default function OfferCard({ offer, onBook }) {
  const isFlat = offer.discount > 90
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-40 overflow-hidden">
        <Img
          src={offer.image}
          alt={offer.title}
          className="absolute inset-0"
          imgClassName="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge className="bg-sun-500 text-white">
            {isFlat ? `Save ${offer.discount.toLocaleString('en-IN')}` : `Up to ${offer.discount}% OFF`}
          </Badge>
        </div>
        {offer.badge && (
          <div className="absolute right-3 top-3">
            <Badge className="bg-white/90 text-slate-800 backdrop-blur">{offer.badge}</Badge>
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <CalendarClock className="size-3.5" />
          <span className="text-xs font-medium">Valid till {formatDate(offer.expiry)}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-sun-600">{offer.type}</p>
        <h3 className="mt-1 font-display text-base font-semibold text-slate-900">{offer.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{offer.description}</p>
        <div className="mt-3 flex items-center gap-1.5 rounded-lg border border-dashed border-brand-200 bg-brand-50/60 px-3 py-2">
          <Ticket className="size-4 text-brand-600" />
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">Promo: {offer.promoCode}</span>
        </div>
        <div className="mt-3 flex-1 space-y-1">
          {offer.terms.slice(0, 2).map((t) => (
            <p key={t} className="flex items-start gap-1.5 text-xs text-slate-400">
              <BadgePercent className="mt-0.5 size-3 shrink-0" /> {t}
            </p>
          ))}
        </div>
        <button
          type="button"
          onClick={onBook}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 py-2.5 text-sm font-bold text-white shadow-soft transition-all hover:from-sun-600 hover:to-sun-700 active:scale-[0.98]"
        >
          Book Now
        </button>
      </div>
    </div>
  )
}
