import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  CalendarDays, Heart, MapPin, Star, Check, Plane, Hotel, Utensils, FileCheck,
  ArrowRight, Sparkles, UserRound,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Price } from '../components/Price.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { packageApi } from '../services/packageApi.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useBooking } from '../context/BookingContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { cn } from '../lib/utils.js'

export default function PackageDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { has, toggle } = useWishlist()
  const { setKind } = useBooking()
  const { toast } = useToast()

  const { data: pkg, isLoading } = useQuery({
    queryKey: ['package', id],
    queryFn: () => packageApi.getPackage(id),
  })

  if (isLoading) return <div className="container-x py-10"><Skeleton className="h-96 w-full rounded-2xl" /></div>
  if (!pkg) {
    return (
      <div className="container-x py-16 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">Package not found</p>
        <Button className="mt-4" onClick={() => navigate('/packages')}>Browse packages</Button>
      </div>
    )
  }

  const saved = has('package', pkg.id)

  const book = () => {
    setKind('package', { ...pkg })
    toast('Package selected! Complete passenger details to continue.', 'Almost there')
    navigate('/checkout')
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 sm:h-96">
        <Img src={pkg.image} alt={pkg.name} className="absolute inset-0" eager />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-x pb-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              {pkg.categories.map((c) => <Badge key={c} className="bg-white/20 text-white backdrop-blur">{c}</Badge>)}
            </div>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{pkg.name}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-200">
              <span className="flex items-center gap-1"><MapPin className="size-4" /> {pkg.destination}, {pkg.country}</span>
              <span className="flex items-center gap-1"><CalendarDays className="size-4" /> {pkg.duration}</span>
              <span className="flex items-center gap-1"><Star className="size-4 fill-amber-400 text-amber-400" /> {pkg.rating} ({pkg.reviews} reviews)</span>
            </p>
          </div>
        </div>
      </section>

      <div className="container-x mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Inclusions */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-slate-900">What's included</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { on: pkg.includes.flight, icon: Plane, label: 'Flights' },
                  { on: pkg.includes.hotel, icon: Hotel, label: 'Hotels' },
                  { on: pkg.includes.meals, icon: Utensils, label: pkg.includes.meals },
                  { on: pkg.includes.visa, icon: FileCheck, label: 'Visa assistance' },
                  { on: pkg.includes.transfer, icon: UserRound, label: 'Airport transfers' },
                  { on: pkg.includes.sightseeing, icon: Sparkles, label: 'Sightseeing' },
                ].map((inc) => (
                  <div key={inc.label} className={cn('rounded-xl border p-3.5 text-sm font-semibold', inc.on ? 'border-emerald-200 bg-emerald-50/60 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-400 line-through')}>
                    <span className="flex items-center gap-2"><inc.icon className="size-4" /> {inc.label}</span>
                  </div>
                ))}
              </div>

              <h3 className="mt-6 font-display text-lg font-semibold text-slate-900">Highlights</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {pkg.highlights.map((h) => (
                  <span key={h} className="rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-100">{h}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-slate-900">Day-by-day itinerary</h2>
              <div className="mt-5 space-y-0">
                {pkg.itinerary.map((d, i) => (
                  <div key={d.day} className="relative flex gap-4 pb-6">
                    {i < pkg.itinerary.length - 1 && <span className="absolute left-[21px] top-12 h-full w-0.5 bg-slate-200" />}
                    <span className="z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-500 text-xs font-bold text-white shadow-glow">
                      D{d.day}
                    </span>
                    <div className="flex-1">
                      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                        <Img src={d.image} alt={d.title} className="h-24 rounded-xl" />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Day {d.day}</p>
                          <h3 className="font-display text-base font-semibold text-slate-900">{d.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-slate-500">{d.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking card */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Package price</p>
              <p className="mt-1 flex items-baseline gap-1">
                <Price amount={pkg.price} className="text-3xl font-bold" />
                <span className="text-sm text-brand-100">/ person</span>
              </p>
              <p className="mt-1 text-xs text-brand-100">Twin sharing · {pkg.duration}</p>
            </div>
            <div className="space-y-3 p-5 text-sm">
              {[
                `${pkg.duration} of ${pkg.destination}`,
                `${pkg.activities} experiences included`,
                'Free cancellation up to 15 days before departure',
                'Flexible date change — no fee on base plan',
              ].map((t) => (
                <p key={t} className="flex items-start gap-2 text-slate-600">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" /> {t}
                </p>
              ))}
              <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                EMI from ₹{(pkg.price / 12).toLocaleString('en-IN')}/month on eligible cards
              </div>
              <Button size="lg" className="w-full" onClick={book}>
                Book this package <ArrowRight className="size-4" />
              </Button>
              <button
                type="button"
                onClick={() => toggle({ type: 'package', id: pkg.id, name: pkg.name, image: pkg.image, price: pkg.price, location: `${pkg.destination}, ${pkg.country}`, rating: pkg.rating })}
                className={cn('flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold transition-colors', saved ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600')}
              >
                <Heart className={cn('size-4', saved && 'fill-current')} /> {saved ? 'Saved to wishlist' : 'Save to wishlist'}
              </button>
              <p className="text-center text-[11px] text-slate-400">Prices are per person and may change with season & availability.</p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
