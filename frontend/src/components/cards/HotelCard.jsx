import { Link } from 'react-router-dom'
import { Coffee, Heart, MapPin, ShieldCheck, Wifi } from 'lucide-react'
import Img from '../Img.jsx'
import { Price } from '../Price.jsx'
import { StarRating, GuestRating } from '../Rating.jsx'
import { Badge } from '../ui/badge.jsx'
import { PolicyBadge } from '../PolicyBadge.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { cn } from '../../lib/utils.js'

export default function HotelCard({ hotel }) {
  const { has, toggle } = useWishlist()
  const saved = has('hotel', hotel.id)
  const taxes = Math.round((hotel.pricePerNight * hotel.taxPct) / 100)
  const total = (hotel.pricePerNight + taxes) * 2

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift">
      <div className="grid sm:grid-cols-[240px_1fr] md:grid-cols-[280px_1fr]">
        <Link to={`/hotels/${hotel.id}`} className="relative block h-48 overflow-hidden sm:h-auto">
          <Img
            src={hotel.images[0]}
            alt={hotel.name}
            className="absolute inset-0"
            imgClassName="transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex gap-1.5">
            {hotel.rooms.some((r) => r.refundable) && (
              <Badge className="bg-white/90 text-emerald-700 backdrop-blur">
                <ShieldCheck className="size-3" /> Free cancellation
              </Badge>
            )}
          </div>
        </Link>

        <div className="flex flex-col p-3 sm:p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 sm:gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold text-slate-900 transition-colors hover:text-brand-700 sm:text-lg">
                  <Link to={`/hotels/${hotel.id}`}>{hotel.name}</Link>
                </h3>
                <button
                  type="button"
                  onClick={() => toggle({ type: 'hotel', id: hotel.id, name: hotel.name, image: hotel.images[0], price: hotel.pricePerNight, location: `${hotel.city}, ${hotel.country}`, rating: hotel.guestRating })}
                  className={cn('shrink-0 rounded-full p-1.5 transition-all hover:scale-110', saved ? 'text-rose-500' : 'text-slate-300 hover:text-rose-500')}
                  aria-label="Save to wishlist"
                >
                  <Heart className={cn('size-4 sm:size-5', saved && 'fill-current')} />
                </button>
              </div>
              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500 sm:text-xs">
                <MapPin className="size-3" /> {hotel.address}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <StarRating value={hotel.star} size="size-3" />
                <GuestRating value={hotel.guestRating} reviewCount={hotel.reviewCount} />
              </div>
            </div>
          </div>

          <p className="mt-2.5 line-clamp-2 text-xs text-slate-500 sm:mt-3 sm:text-sm">{hotel.description}</p>

          <div className="mt-2.5 flex flex-wrap gap-1 sm:mt-3 sm:gap-1.5">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 sm:px-2.5 sm:py-1 sm:text-[11px]">
                {a === 'Free WiFi' ? <Wifi className="size-3" /> : null}
                {a}
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 sm:px-2.5 sm:py-1 sm:text-[11px]">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-end justify-between gap-2 border-t border-slate-100 pt-3 sm:mt-4 sm:gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="success"><Coffee className="size-3" /> Breakfast</Badge>
                <PolicyBadge hotel={hotel} room={{ price: hotel.pricePerNight, nights: 2 }} />
              </div>
              <p className="text-[11px] text-slate-400 sm:text-xs">2 nights · incl. taxes</p>
            </div>
            <div className="text-right">
              <p className="flex items-baseline gap-1">
                <Price amount={hotel.pricePerNight} className="text-lg font-bold text-slate-900 sm:text-xl" />
                <span className="text-[11px] text-slate-400 sm:text-xs">/ night</span>
              </p>
              <p className="text-[11px] text-slate-500 sm:text-xs">
                <Price amount={total} /> total
              </p>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              to={`/hotels/${hotel.id}`}
              className="flex-1 rounded-xl border border-brand-200 py-2 text-center text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50 sm:py-2.5 sm:text-sm"
            >
              View Details
            </Link>
            <Link
              to={`/hotels/${hotel.id}`}
              className="flex-1 rounded-xl bg-brand-600 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-brand-700 sm:py-2.5 sm:text-sm"
            >
              Select Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
