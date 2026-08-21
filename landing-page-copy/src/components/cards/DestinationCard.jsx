import { Link } from 'react-router-dom'
import { MapPin, Star } from 'lucide-react'
import Img from '../Img.jsx'
import { Price } from '../Price.jsx'
import { Badge } from '../ui/badge.jsx'

export default function DestinationCard({ d }) {
  return (
    <Link
      to={`/destinations/${d.slug}`}
      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative h-48 overflow-hidden">
        <Img
          src={d.image}
          alt={`${d.city}, ${d.country}`}
          className="absolute inset-0"
          imgClassName="transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge className="bg-white/90 text-slate-800 backdrop-blur">{d.categories[0]}</Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="flex items-center gap-1 text-xs font-medium text-slate-200">
            <MapPin className="size-3" /> {d.country}
          </p>
          <h3 className="font-display text-xl font-semibold">{d.city}</h3>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white">
            <Star className="size-3 fill-current" /> {d.rating}
          </span>
          <span className="text-xs text-slate-500">from</span>
          <Price amount={d.startingPrice} className="text-sm font-bold text-slate-900" />
        </div>
        <span className="text-xs font-semibold text-brand-600 opacity-0 transition-opacity group-hover:opacity-100">
          Explore →
        </span>
      </div>
    </Link>
  )
}
