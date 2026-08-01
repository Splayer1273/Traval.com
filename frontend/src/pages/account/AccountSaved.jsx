import { Link } from 'react-router-dom'
import { Heart, Trash2, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx'
import { Button } from '../../components/ui/button.jsx'
import Img from '../../components/Img.jsx'
import { Price } from '../../components/Price.jsx'
import { StarRating } from '../../components/Rating.jsx'
import { useWishlist } from '../../context/WishlistContext.jsx'
import { cn } from '../../lib/utils.js'

const URLS = {
  hotel: (i) => `/hotels/${i.id}`,
  destination: (i) => `/destinations/${i.id}`,
  package: (i) => `/packages/${i.id}`,
  flight: (i) => `/flights`,
}

export default function AccountSaved() {
  const { items, remove } = useWishlist()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved trips</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="rounded-2xl bg-rose-50 p-4 text-rose-400"><Heart className="size-8" /></span>
            <p className="font-display text-lg font-semibold text-slate-800">Nothing saved yet</p>
            <p className="max-w-xs text-sm text-slate-500">Tap the heart on hotels, packages and destinations to build your shortlist.</p>
            <Button asChild><Link to="/destinations">Explore destinations</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((i) => (
              <div key={`${i.type}-${i.id}`} className="group overflow-hidden rounded-2xl border border-slate-200 transition-all hover:shadow-card">
                <Link to={URLS[i.type](i)} className="relative block h-36 overflow-hidden">
                  <Img src={i.image} alt={i.name} className="absolute inset-0" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                  <div className="absolute bottom-2 left-3 text-white">
                    <p className="font-display text-base font-semibold">{i.name}</p>
                    <p className="text-xs text-slate-200">{i.location}</p>
                  </div>
                </Link>
                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    {i.rating && <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white">{i.rating}</span>}
                    {i.price && <Price amount={i.price} className="text-sm font-bold text-slate-900" />}
                  </div>
                  <div className="flex gap-1.5">
                    <Button size="icon" variant="ghost" className="size-8 text-rose-500 hover:bg-rose-50" onClick={() => remove(i.id, i.type)} aria-label="Remove">
                      <Trash2 className="size-4" />
                    </Button>
                    <Button size="sm" variant="secondary" asChild><Link to={URLS[i.type](i)}><ArrowRight className="size-3.5" /> View</Link></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
