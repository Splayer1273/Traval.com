import { Link } from 'react-router-dom'
import { Heart, Trash2, ArrowRight } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Price } from '../components/Price.jsx'
import { Button } from '../components/ui/button.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx'
import { useWishlist } from '../context/WishlistContext.jsx'

const TYPE_LABEL = { hotel: 'Hotels', destination: 'Destinations', package: 'Packages', flight: 'Flights' }
const URLS = {
  hotel: (i) => `/hotels/${i.id}`,
  destination: (i) => `/destinations/${i.id}`,
  package: (i) => `/packages/${i.id}`,
  flight: () => `/flights`,
}

export default function Wishlist() {
  const { items, remove, hotels, destinations, packages, flights } = useWishlist()

  const grouped = [
    { type: 'hotel', list: hotels },
    { type: 'destination', list: destinations },
    { type: 'package', list: packages },
    { type: 'flight', list: flights },
  ].filter((g) => g.list.length > 0)

  return (
    <div>
      <PageHero image="honeymoon" title="Your Wishlist" subtitle="Hotels, destinations and packages you've saved for later" crumb={[{ label: 'Wishlist' }]} />

      <div className="container-x mt-8">
        {items.length === 0 ? (
          <div className="mx-auto max-w-md">
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <span className="rounded-2xl bg-rose-50 p-5 text-rose-400"><Heart className="size-10" /></span>
              <h2 className="font-display text-xl font-semibold text-slate-900">Your wishlist is empty</h2>
              <p className="text-sm text-slate-500">
                Tap the heart icon on any hotel, destination or package to save it here for quick access later.
              </p>
              <Button asChild><Link to="/destinations">Start exploring</Link></Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="overflow-x-auto">
              <TabsTrigger value="all">All ({items.length})</TabsTrigger>
              {grouped.map((g) => (
                <TabsTrigger key={g.type} value={g.type}>{TYPE_LABEL[g.type]} ({g.list.length})</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((i) => <SavedCard key={`${i.type}-${i.id}`} item={i} onRemove={remove} />)}
              </div>
            </TabsContent>
            {grouped.map((g) => (
              <TabsContent key={g.type} value={g.type} className="mt-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {g.list.map((i) => <SavedCard key={`${i.type}-${i.id}`} item={i} onRemove={remove} />)}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  )
}

function SavedCard({ item, onRemove }) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
      <Link to={URLS[item.type](item)} className="relative block h-44 overflow-hidden">
        <Img src={item.image} alt={item.name} className="absolute inset-0" imgClassName="transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
        <div className="absolute left-3 top-3">
          <Badge className="bg-white/90 text-slate-800 backdrop-blur">{TYPE_LABEL[item.type]}</Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="font-display text-lg font-semibold">{item.name}</p>
          {item.location && <p className="text-xs text-slate-200">{item.location}</p>}
        </div>
      </Link>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {item.rating && <span className="rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white">{item.rating}</span>}
          {item.price ? (
            <div>
              <Price amount={item.price} className="text-sm font-bold text-slate-900" />
              {item.type === 'hotel' && <span className="ml-0.5 text-[11px] text-slate-400">/ night</span>}
            </div>
          ) : (
            <span className="text-xs text-slate-400">Check availability</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button size="icon" variant="ghost" className="size-9 text-rose-500 hover:bg-rose-50" onClick={() => onRemove(item.id, item.type)} aria-label="Remove from wishlist">
            <Trash2 className="size-4" />
          </Button>
          <Button size="sm" variant="secondary" asChild>
            <Link to={URLS[item.type](item)}><ArrowRight className="size-3.5" /> View</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
