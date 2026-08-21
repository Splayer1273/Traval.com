import { Link } from 'react-router-dom'
import { CalendarDays, Heart, MapPin, Star } from 'lucide-react'
import Img from '../Img.jsx'
import { Price } from '../Price.jsx'
import { Badge } from '../ui/badge.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { cn } from '../../lib/utils.js'

export default function PackageCard({ pkg }) {
  const { has, toggle } = useWishlist()
  const saved = has('package', pkg.id)
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/packages/${pkg.id}`} className="relative block h-52 overflow-hidden">
        <Img
          src={pkg.image}
          alt={pkg.name}
          className="absolute inset-0"
          imgClassName="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {pkg.categories.slice(0, 2).map((c) => (
            <Badge key={c} className="bg-white/90 text-slate-800 backdrop-blur">{c}</Badge>
          ))}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
          <CalendarDays className="size-4" />
          <span className="text-sm font-semibold">{pkg.duration}</span>
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggle({ type: 'package', id: pkg.id, name: pkg.name, image: pkg.image, price: pkg.price, location: pkg.destination, rating: pkg.rating })}
        className={cn(
          'absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 shadow-soft backdrop-blur transition-all hover:scale-110',
          saved ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500',
        )}
        aria-label="Save to wishlist"
      >
        <Heart className={cn('size-4', saved && 'fill-current')} />
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/packages/${pkg.id}`}>
              <h3 className="font-display text-base font-semibold text-slate-900 transition-colors hover:text-brand-700">
                {pkg.name}
              </h3>
            </Link>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="size-3" /> {pkg.destination}, {pkg.country}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white">
            <Star className="size-3 fill-current" /> {pkg.rating}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {pkg.includes.flight && <Badge variant="sun">✈ Flights</Badge>}
          {pkg.includes.hotel && <Badge variant="default">Hotel</Badge>}
          {pkg.includes.meals && <Badge variant="success">Meals</Badge>}
          {pkg.includes.visa && <Badge variant="secondary">Visa</Badge>}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Starting from</p>
            <p className="flex items-baseline gap-1">
              <Price amount={pkg.price} className="text-xl font-bold text-slate-900" />
              <span className="text-xs text-slate-400">/ person</span>
            </p>
          </div>
          <Link
            to={`/packages/${pkg.id}`}
            className="rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}
