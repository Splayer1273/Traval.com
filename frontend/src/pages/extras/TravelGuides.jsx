import { useState } from 'react'
import { BookOpen, Clock3, ArrowUpRight } from 'lucide-react'
import PageHero from '../../components/PageHero.jsx'
import Img from '../../components/Img.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog.jsx'
import { GUIDES, GUIDE_CATEGORIES } from '../../data/guides.js'
import { cn } from '../../lib/utils.js'

export default function TravelGuides() {
  const [category, setCategory] = useState('All')
  const [reading, setReading] = useState(null)

  const filtered = GUIDES.filter((g) => category === 'All' || g.category === category)

  return (
    <div>
      <PageHero image="roadtrip" title="Travel Guides" subtitle="Destination intel, local tips and itinerary hacks from our travel editors" crumb={[{ label: 'Travel Guides' }]} />

      <div className="container-x mt-8">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {['All', ...GUIDE_CATEGORIES].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                category === c ? 'border-brand-600 bg-brand-600 text-white shadow-glow' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setReading(g)}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative h-44 overflow-hidden">
                <Img src={g.image} alt={g.title} className="absolute inset-0" imgClassName="transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                <div className="absolute left-3 top-3">
                  <Badge className="bg-white/90 text-slate-800 backdrop-blur">{g.category}</Badge>
                </div>
                <span className="absolute bottom-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/90 text-brand-600 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-display text-base font-semibold text-slate-900 transition-colors group-hover:text-brand-700">{g.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-slate-500">{g.excerpt}</p>
                <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <Clock3 className="size-3.5" /> {g.readTime} min read
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!reading} onOpenChange={(o) => !o && setReading(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          {reading && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-8 font-display text-xl">{reading.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <Badge variant="secondary">{reading.category}</Badge>
                  <span className="flex items-center gap-1 text-xs"><Clock3 className="size-3.5" /> {reading.readTime} min read</span>
                </DialogDescription>
              </DialogHeader>
              <Img src={reading.image} alt={reading.title} className="h-52 rounded-xl" />
              <div className="space-y-4">
                {reading.content.map((s) => (
                  <div key={s.h}>
                    <h4 className="flex items-center gap-2 font-display text-base font-semibold text-slate-900">
                      <BookOpen className="size-4 text-brand-600" /> {s.h}
                    </h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.p}</p>
                  </div>
                ))}
              </div>
              <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                Pro tip: save this guide to your wishlist or share it with your travel buddy before you go.
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
