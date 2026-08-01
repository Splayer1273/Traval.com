import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PageHero from '../components/PageHero.jsx'
import DestinationCard from '../components/cards/DestinationCard.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { packageApi } from '../services/packageApi.js'
import { DESTINATION_CATEGORIES } from '../data/destinations.js'
import { cn } from '../lib/utils.js'

export default function Destinations() {
  const [category, setCategory] = useState('All')
  const { data: destinations, isLoading } = useQuery({
    queryKey: ['destinations'],
    queryFn: packageApi.getDestinations,
  })

  const filtered = (destinations || []).filter(
    (d) => category === 'All' || d.categories.includes(category),
  )

  return (
    <div>
      <PageHero
        image="city"
        title="Discover Destinations"
        subtitle="From golden beaches to snow-capped peaks — find your next escape"
        crumb={[{ label: 'Destinations' }]}
      />

      <div className="container-x mt-8">
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {DESTINATION_CATEGORIES.map((c) => (
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

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                <Skeleton className="h-48 w-full" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((d) => <DestinationCard key={d.slug} d={d} />)}
          </div>
        )}
      </div>
    </div>
  )
}
