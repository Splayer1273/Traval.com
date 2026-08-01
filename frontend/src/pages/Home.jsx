import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Sparkles, ArrowRight, BadgePercent, ShieldCheck, Headphones, Plane } from 'lucide-react'
import SearchWidget from '../components/search/SearchWidget.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import DestinationCard from '../components/cards/DestinationCard.jsx'
import HotelCard from '../components/cards/HotelCard.jsx'
import PackageCard from '../components/cards/PackageCard.jsx'
import OfferCard from '../components/cards/OfferCard.jsx'
import Img from '../components/Img.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { packageApi } from '../services/packageApi.js'
import { hotelApi } from '../services/hotelApi.js'
import { PACKAGES } from '../data/packages.js'
import { DESTINATIONS } from '../data/destinations.js'
import { HOTELS } from '../data/hotels.js'
import { OFFERS } from '../data/offers.js'
import { IMAGES } from '../data/images.js'

const PERKS = [
  { icon: BadgePercent, title: 'Best price guarantee', text: 'We match or refund the difference' },
  { icon: ShieldCheck, title: 'Safe & secure booking', text: '256-bit encrypted payments' },
  { icon: Headphones, title: '24×7 human support', text: 'Real people, real fast' },
]

const CATEGORY_CHIPS = [
  { label: 'Beaches', image: 'beach' },
  { label: 'Mountains', image: 'himalayas' },
  { label: 'Honeymoon', image: 'honeymoon' },
  { label: 'Adventure', image: 'adventure' },
  { label: 'Luxury', image: 'luxury' },
  { label: 'Weekend', image: 'roadtrip' },
]

export default function Home() {
  const navigate = useNavigate()
  // TanStack Query usage — services are API-ready, data is mocked for now.
  const { data: hotels, isLoading: hotelsLoading } = useQuery({
    queryKey: ['hotels', 'featured'],
    queryFn: () => hotelApi.searchHotels({ destination: '' }),
  })
  const { data: packages, isLoading: packagesLoading } = useQuery({
    queryKey: ['packages', 'featured'],
    queryFn: packageApi.getPackages,
  })

  const featuredHotels = (hotels || HOTELS).slice(0, 4)
  const featuredPackages = (packages || PACKAGES).slice(0, 4)
  const featuredDestinations = DESTINATIONS.slice(0, 8)
  const deals = OFFERS.slice(0, 4)

  return (
    <div>
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <Img src="hero" alt="Tropical travel destination at sunset" className="absolute inset-0" eager />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/40 to-slate-950/80" />
        </div>
        <div className="container-x relative flex min-h-[560px] flex-col justify-center py-20 sm:min-h-[600px]">
          <div className="mx-auto max-w-3xl text-center text-white">
            <p className="mb-4 inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest backdrop-blur">
              <Sparkles className="size-3.5 text-sun-400" /> 2,000+ destinations · 500+ airlines · 80k+ hotels
            </p>
            <h1 className="animate-fade-up font-display text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl" style={{ animationDelay: '80ms' }}>
              Explore the World.
              <br />
              <span className="text-gradient-sun">Your Journey Starts Here.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl animate-fade-up text-base text-slate-200 sm:text-lg" style={{ animationDelay: '160ms' }}>
              Search flights, discover hotels, and plan unforgettable trips with Project Sunrise.
            </p>
          </div>

          <div className="mx-auto mt-10 w-full max-w-5xl animate-fade-up" style={{ animationDelay: '240ms' }}>
            <SearchWidget />
          </div>

          {/* Quick destinations */}
          <div className="mx-auto mt-8 flex w-full max-w-5xl flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-widest text-slate-400">Popular:</span>
            {[
              { label: 'Mumbai → Delhi', to: '/flights?trip=oneway&from=BOM&to=DEL' },
              { label: 'Dubai', to: '/destinations/dubai' },
              { label: 'Bali', to: '/destinations/bali' },
              { label: 'Goa', to: '/destinations/goa' },
              { label: 'Singapore', to: '/destinations/singapore' },
              { label: 'Kashmir', to: '/destinations/kashmir' },
            ].map((d) => (
              <Link
                key={d.label}
                to={d.to}
                className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur transition-all hover:bg-white hover:text-slate-900"
              >
                {d.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRUST BAR ===================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="container-x grid gap-6 py-8 sm:grid-cols-3">
          {PERKS.map((p) => (
            <div key={p.title} className="flex items-center gap-3">
              <span className="rounded-2xl bg-gradient-to-br from-brand-50 to-sun-50 p-3 text-brand-600">
                <p.icon className="size-6" />
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{p.title}</p>
                <p className="text-xs text-slate-500">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== DESTINATIONS ===================== */}
      <section className="container-x py-14">
        <SectionHeader
          eyebrow="Wanderlust"
          title="Featured destinations"
          subtitle="Handpicked escapes loved by our travellers this season."
          link="/destinations"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDestinations.map((d) => (
            <DestinationCard key={d.slug} d={d} />
          ))}
        </div>
      </section>

      {/* ===================== CATEGORY CHIPS ===================== */}
      <section className="container-x pb-14">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_CHIPS.map((c) => (
            <Link
              key={c.label}
              to="/destinations"
              className="group relative h-32 overflow-hidden rounded-2xl shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <Img src={c.image} alt={c.label} className="absolute inset-0" imgClassName="transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-slate-950/10" />
              <span className="absolute bottom-3 left-3 text-sm font-bold text-white">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ===================== FLIGHTS PROMO ===================== */}
      <section className="container-x pb-14">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-8 shadow-lift sm:p-12">
          <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 right-32 size-52 rounded-full bg-sun-500/20" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div className="text-white">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sun-300">
                <Plane className="size-4" /> Flight deals
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">
                Fly smarter with live price alerts & best-fare calendar
              </h2>
              <p className="mt-3 max-w-md text-sm text-brand-100">
                Compare 500+ airlines, track fare drops with personalised alerts, and book with free cancellation on flexible fares.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/flights"
                  className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-card transition-transform hover:scale-[1.03]"
                >
                  Search Flights
                </Link>
                <Link
                  to="/price-alerts"
                  className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
                >
                  Set a Price Alert
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: 'International fares', value: 'up to 25% off', code: 'SUNRISE25' },
                { label: 'Domestic fares', value: 'extra 10% off', code: 'EARLY10' },
                { label: 'Last-minute Goa', value: 'up to 40% off', code: 'GOA40' },
                { label: 'Weekend getaways', value: 'from ₹9,999', code: 'WEEKEND30' },
              ].map((f) => (
                <div key={f.code} className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                  <p className="text-xs font-medium text-brand-100">{f.label}</p>
                  <p className="mt-1 font-display text-xl font-semibold text-white">{f.value}</p>
                  <p className="mt-2 inline-block rounded-md border border-dashed border-white/40 px-2 py-0.5 text-[11px] font-bold uppercase tracking-widest text-sun-300">
                    {f.code}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== HOTELS ===================== */}
      <section className="bg-white py-14">
        <div className="container-x">
          <SectionHeader
            eyebrow="Stay"
            title="Trending hotels & resorts"
            subtitle="From Marine Drive heritage icons to alpine chalets — book with free cancellation."
            link="/hotels"
          />
          {hotelsLoading ? (
            <div className="grid gap-5">
              {[0, 1].map((i) => (
                <div key={i} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[280px_1fr]">
                  <Skeleton className="h-48 md:h-auto" />
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-8 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              {featuredHotels.map((h) => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <Link to="/hotels" className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-soft transition-all hover:bg-brand-50">
              Browse all hotels <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== PACKAGES ===================== */}
      <section className="container-x py-14">
        <SectionHeader
          eyebrow="Holidays"
          title="Curated holiday packages"
          subtitle="Flights, hotels & experiences bundled into unforgettable itineraries."
          link="/packages"
        />
        {packagesLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
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
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPackages.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        )}
      </section>

      {/* ===================== OFFERS ===================== */}
      <section className="bg-gradient-to-b from-sun-50/60 to-transparent py-14">
        <div className="container-x">
          <SectionHeader
            eyebrow="Deals"
            title="Offers & last-minute deals"
            subtitle="Flash sales, promo codes and member perks — grab them before they expire."
            link="/offers"
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((o) => (
              <OfferCard key={o.id} offer={o} onBook={() => navigate('/offers')} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== APP BANNER ===================== */}
      <section className="container-x pb-4 pt-14">
        <div className="relative overflow-hidden rounded-3xl shadow-lift">
          <Img src="cta" alt="Person planning a trip" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-950/90 via-brand-900/70 to-transparent" />
          <div className="relative flex flex-col items-start gap-6 p-10 sm:p-14 lg:max-w-xl">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Plan your next trip in minutes
            </h2>
            <p className="text-sm text-slate-200">
              Download the Project Sunrise app or head to your account to manage bookings, track price drops and get personalised recommendations on the go.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-card transition-transform hover:scale-[1.03]">
                Create free account
              </Link>
              <Link to="/destinations" className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10">
                Explore destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reference the image config so imports stay tree-shaken */}
      <span className="hidden">{IMAGES.hero2}</span>
    </div>
  )
}
