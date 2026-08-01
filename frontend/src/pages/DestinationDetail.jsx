import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin, Heart, Sun, CloudSun, Snowflake, Calendar, Plane, Hotel, Compass,
  Lightbulb, Sparkles, ArrowRight,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Price } from '../components/Price.jsx'
import { StarRating } from '../components/Rating.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { packageApi } from '../services/packageApi.js'
import { getHotel } from '../data/hotels.js'
import { getPackage } from '../data/packages.js'
import { getAirport } from '../data/airports.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import { cn } from '../lib/utils.js'

const WEATHER_ICONS = { sun: Sun, cloud: CloudSun, snow: Snowflake }

export default function DestinationDetail() {
  const { slug } = useParams()
  const { has, toggle } = useWishlist()

  const { data: d, isLoading } = useQuery({
    queryKey: ['destination', slug],
    queryFn: () => packageApi.getDestination(slug),
  })

  if (isLoading) return <div className="container-x py-10"><Skeleton className="h-96 w-full rounded-2xl" /></div>
  if (!d) {
    return (
      <div className="container-x py-16 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">Destination not found</p>
        <Button className="mt-4" asChild><a href="/destinations">Browse destinations</a></Button>
      </div>
    )
  }

  const saved = has('destination', d.slug)
  const hotels = d.hotelIds.map(getHotel).filter(Boolean)
  const pkgs = d.packageIds.map(getPackage).filter(Boolean)
  const WeatherIcon = WEATHER_ICONS[d.weather.icon] || Sun

  return (
    <div>
      {/* Hero */}
      <section className="relative h-80 sm:h-[420px]">
        <Img src={d.image} alt={`${d.city}, ${d.country}`} className="absolute inset-0" eager />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container-x pb-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/90 text-slate-800"><MapPin className="size-3" /> {d.country}</Badge>
              {d.categories.slice(0, 3).map((c) => (
                <Badge key={c} className="bg-white/20 text-white backdrop-blur">{c}</Badge>
              ))}
            </div>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{d.city}</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-200 sm:text-base">{d.tagline}</p>
          </div>
        </div>
      </section>

      <div className="container-x mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* About + weather */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-slate-900">About {d.city}</h2>
                <button
                  type="button"
                  onClick={() => toggle({ type: 'destination', id: d.slug, name: `${d.city}, ${d.country}`, image: d.image, price: d.startingPrice, location: d.country, rating: d.rating })}
                  className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors', saved ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600')}
                >
                  <Heart className={cn('size-4', saved && 'fill-current')} /> {saved ? 'Saved' : 'Save destination'}
                </button>
              </div>
              <p className="mt-3 leading-relaxed text-slate-600">{d.description}</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-brand-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <WeatherIcon className="size-4 text-brand-600" /> Weather & best time
                  </p>
                  <p className="mt-2 text-sm text-slate-600">{d.weather.summary}</p>
                  <div className="mt-3 flex gap-3 text-xs text-slate-500">
                    <span>High {d.weather.avgHigh}°C</span>
                    <span>Low {d.weather.avgLow}°C</span>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    <Calendar className="size-3.5" /> Best time: {d.bestTime}
                  </p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-sun-50 to-amber-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-800"><Compass className="size-4 text-sun-600" /> Top attractions</p>
                  <ul className="mt-2 space-y-1.5">
                    {d.attractions.slice(0, 6).map((a) => (
                      <li key={a} className="flex items-center gap-2 text-sm text-slate-600">
                        <span className="size-1.5 rounded-full bg-sun-500" /> {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Things to do */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
                <Sparkles className="size-6 text-brand-600" /> Things to do
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {d.thingsToDo.map((t, i) => (
                  <div key={t} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{i + 1}</span>
                    <p className="text-sm font-medium text-slate-700">{t}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Hotels */}
          {hotels.length > 0 && (
            <Card>
              <CardContent className="p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
                  <Hotel className="size-6 text-brand-600" /> Popular hotels
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {hotels.map((h) => (
                    <a key={h.id} href={`/hotels/${h.id}`} className="group overflow-hidden rounded-2xl border border-slate-200 transition-all hover:border-brand-300 hover:shadow-card">
                      <Img src={h.images[0]} alt={h.name} className="h-36" imgClassName="transition-transform duration-500 group-hover:scale-105" />
                      <div className="p-4">
                        <p className="font-display text-base font-semibold text-slate-900">{h.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <StarRating value={h.star} size="size-3" />
                          <span className="text-xs text-slate-400">{h.guestRating} · {h.reviewCount} reviews</span>
                        </div>
                        <p className="mt-2 text-sm"><Price amount={h.pricePerNight} className="font-bold text-slate-900" /> <span className="text-xs text-slate-400">/ night</span></p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Flights */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
                <Plane className="size-6 text-brand-600" /> Flights to {d.city}
              </h2>
              <div className="mt-4 space-y-3">
                {d.flightRoutes.map((r) => {
                  const [f, t] = r.split('-')
                  const from = getAirport(f)
                  const to = getAirport(t)
                  if (!from || !to) return null
                  return (
                    <a key={r} href={`/flights?trip=oneway&from=${f}&to=${t}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-brand-300 hover:bg-brand-50/40">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-bold text-slate-900">{from.code} → {to.code}</span>
                        <span className="hidden text-slate-500 sm:inline">{from.city} → {to.city}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-semibold text-brand-600">
                        Check fares <ArrowRight className="size-3.5" />
                      </span>
                    </a>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="border-sun-200 bg-sun-50/40">
            <CardContent className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
                <Lightbulb className="size-6 text-sun-600" /> Travel tips
              </h2>
              <ul className="mt-4 space-y-2.5">
                {d.tips.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-sun-500" /> {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">Trips start from</p>
              <p className="mt-1 flex items-baseline gap-1"><Price amount={d.startingPrice} className="text-3xl font-bold" /><span className="text-sm text-brand-100">/ person</span></p>
              <p className="mt-1 flex items-center gap-1 text-xs text-brand-100"><Calendar className="size-3" /> Best time: {d.bestTime}</p>
            </div>
            <div className="space-y-3 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-800"><Plane className="size-4 text-brand-600" /> Recommended packages</p>
              {pkgs.map((p) => (
                <a key={p.id} href={`/packages/${p.id}`} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-brand-300 hover:bg-brand-50/40">
                  <Img src={p.image} alt={p.name} className="size-14 shrink-0 rounded-lg" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.duration}</p>
                    <p className="mt-0.5 text-xs font-bold text-brand-700"><Price amount={p.price} /></p>
                  </div>
                </a>
              ))}
              <Button className="w-full" asChild>
                <a href={`/packages`}>View all packages <ArrowRight className="size-4" /></a>
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
