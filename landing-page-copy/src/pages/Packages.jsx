import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import PackageCard from '../components/cards/PackageCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Button } from '../components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { packageApi } from '../services/packageApi.js'
import { PACKAGE_CATEGORIES } from '../data/packages.js'
import { cn } from '../lib/utils.js'

const SORTS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
]

export default function Packages() {
  const [params] = useSearchParams()
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('recommended')
  const [query, setQuery] = useState('')

  const { data: packages, isLoading, isError, refetch } = useQuery({
    queryKey: ['packages'],
    queryFn: packageApi.getPackages,
  })

  const filtered = useMemo(() => {
    let list = (packages || []).filter((p) => {
      if (category !== 'All' && !p.categories.includes(category)) return false
      if (query && !`${p.name} ${p.destination} ${p.country}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break
      default: list = [...list].sort((a, b) => b.reviews - a.reviews); break
    }
    return list
  }, [packages, category, query, sort])

  return (
    <div>
      <PageHero
        image="bali"
        title="Holiday Packages"
        subtitle="Curated itineraries with flights, hotels and experiences bundled in"
        crumb={[{ label: 'Packages' }]}
      />

      <div className="container-x mt-8">
        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {PACKAGE_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                category === c
                  ? 'border-brand-600 bg-brand-600 text-white shadow-glow'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300',
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mb-6 mt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages, destinations…"
              className="h-11 w-72 max-w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm shadow-soft focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-48">
              <SlidersHorizontal className="size-4 text-slate-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                <Skeleton className="h-52 w-full" />
                <div className="space-y-3 p-4">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState message="We couldn't load packages." onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No packages found" text="Try a different category or search term." action={<Button variant="secondary" onClick={() => { setCategory('All'); setQuery('') }}>Clear search</Button>} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
