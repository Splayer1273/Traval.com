import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tag, Zap } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import OfferCard from '../components/cards/OfferCard.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { OFFERS, OFFER_TYPES } from '../data/offers.js'
import { cn } from '../lib/utils.js'

const TYPE_META = {
  'Flight Deals': { icon: Zap, gradient: 'from-brand-600 to-brand-500' },
  'Hotel Deals': { icon: Tag, gradient: 'from-emerald-600 to-emerald-500' },
  'Package Deals': { icon: Tag, gradient: 'from-sun-500 to-sun-600' },
  'Last Minute Deals': { icon: Zap, gradient: 'from-rose-600 to-rose-500' },
  'Weekend Deals': { icon: Tag, gradient: 'from-violet-600 to-violet-500' },
}

export default function Offers() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [active, setActive] = useState('All')

  const sections = active === 'All' ? OFFER_TYPES : [active]

  const handleBook = (o) => {
    toast(`Promo code ${o.promoCode} applied at checkout`, 'Deal unlocked')
    navigate(`/flights`)
  }

  return (
    <div>
      <PageHero
        image="offers"
        title="Offers & Deals"
        subtitle="Flash sales, promo codes and member perks — grab them before they expire"
        crumb={[{ label: 'Offers' }]}
      />

      <div className="container-x mt-8">
        {/* Section pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
          {['All', ...OFFER_TYPES].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              className={cn(
                'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                active === t
                  ? 'border-brand-600 bg-brand-600 text-white shadow-glow'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300',
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-12">
          {sections.map((section) => {
            const meta = TYPE_META[section] || TYPE_META['Flight Deals']
            const list = OFFERS.filter((o) => o.type === section)
            if (active !== 'All' && list.length === 0) return null
            return (
              <section key={section}>
                <div className="mb-5 flex items-center gap-3">
                  <span className={cn('flex size-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-soft', meta.gradient)}>
                    <meta.icon className="size-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-slate-900">{section}</h2>
                    <p className="text-xs text-slate-500">{list.length} active {section.toLowerCase()}</p>
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {list.map((o) => <OfferCard key={o.id} offer={o} onBook={() => handleBook(o)} />)}
                </div>
              </section>
            )
          })}
        </div>

        {/* Promo banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 p-8 text-center text-white shadow-lift sm:p-12">
          <p className="text-xs font-bold uppercase tracking-widest text-sun-400">Refer & earn</p>
          <h2 className="mx-auto mt-2 max-w-md font-display text-2xl font-semibold sm:text-3xl">
            Share Akbar Bizvoy with friends & get ₹500 each
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
            Your friend gets ₹500 off their first booking, and you get ₹500 credit the moment they travel.
          </p>
          <button
            type="button"
            onClick={() => toast('Referral link copied to clipboard!', 'Refer & earn')}
            className="mt-6 rounded-xl bg-gradient-to-r from-sun-500 to-sun-600 px-8 py-3 text-sm font-bold text-white shadow-glow transition-transform hover:scale-[1.03]"
          >
            Copy referral link
          </button>
        </div>
      </div>
    </div>
  )
}
