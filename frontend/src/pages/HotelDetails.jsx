import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  MapPin, Heart, Users, Clock, Wifi, Coffee, Dumbbell, Sparkles,
  ShieldCheck, Check, ChevronLeft, ChevronRight, Utensils, Car, Waves, BedDouble, ArrowRight,
} from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Price } from '../components/Price.jsx'
import { StarRating, GuestRating } from '../components/Rating.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Separator } from '../components/ui/separator.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { hotelApi } from '../services/hotelApi.js'
import { getReviews } from '../data/reviews.js'
import { useWishlist } from '../context/WishlistContext.jsx'
import { useBooking } from '../context/BookingContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { cn } from '../lib/utils.js'

const AMENITY_ICONS = {
  'Free WiFi': Wifi,
  'Swimming Pool': Waves,
  'Breakfast': Coffee,
  'Gym': Dumbbell,
  'Restaurant': Utensils,
  'Airport Shuttle': Car,
  'Spa': Sparkles,
}

export default function HotelDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { has, toggle } = useWishlist()
  const { setKind } = useBooking()
  const { toast } = useToast()
  const [activeImg, setActiveImg] = useState(0)
  const [selectedRoom, setSelectedRoom] = useState(null)

  const { data: hotel, isLoading } = useQuery({
    queryKey: ['hotel', id],
    queryFn: () => hotelApi.getHotel(id),
  })

  if (isLoading) {
    return <div className="container-x py-10"><Skeleton className="h-96 w-full rounded-2xl" /></div>
  }
  if (!hotel) {
    return (
      <div className="container-x py-16 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">Hotel not found</p>
        <Button className="mt-4" onClick={() => navigate('/hotels')}>Browse hotels</Button>
      </div>
    )
  }

  const saved = has('hotel', hotel.id)
  const reviews = getReviews(hotel.id)
  const room = selectedRoom || hotel.rooms[0]
  const taxPct = hotel.taxPct

  const reserve = () => {
    if (!room) return toast('Please select a room to continue.', 'Room required')
    setKind('hotel', { hotel, room, nights: 2, checkIn: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), checkOut: new Date(Date.now() + 16 * 864e5).toISOString().slice(0, 10) })
    toast(`Room selected — ${room.name}`, 'Great choice')
    navigate('/checkout')
  }

  return (
    <div>
      {/* Gallery */}
      <section className="relative">
        <div className="relative h-72 sm:h-96 lg:h-[480px]">
          <Img src={hotel.images[activeImg]} alt={hotel.name} className="absolute inset-0" eager />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="container-x pb-6 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/90 text-slate-800">{hotel.city}, {hotel.country}</Badge>
                <StarRating value={hotel.star} size="size-4" />
              </div>
              <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{hotel.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-200"><MapPin className="size-4" /> {hotel.address}</p>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="container-x -mt-8 relative z-10">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {hotel.images.map((img, i) => (
              <button
                key={img + i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={cn('h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all', activeImg === i ? 'border-sun-500 shadow-card' : 'border-white/80 opacity-80 hover:opacity-100')}
              >
                <Img src={img} alt={`${hotel.name} view ${i + 1}`} className="size-full" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container-x mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <GuestRating value={hotel.guestRating} reviewCount={hotel.reviewCount} className="!gap-2" />
                </div>
                <button
                  type="button"
                  onClick={() => toggle({ type: 'hotel', id: hotel.id, name: hotel.name, image: hotel.images[0], price: hotel.pricePerNight, location: `${hotel.city}, ${hotel.country}`, rating: hotel.guestRating })}
                  className={cn('flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors', saved ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-600')}
                >
                  <Heart className={cn('size-4', saved && 'fill-current')} /> {saved ? 'Saved' : 'Save'}
                </button>
              </div>
              <h2 className="mt-4 font-display text-2xl font-semibold text-slate-900">About this property</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{hotel.description}</p>

              <Separator className="my-6" />
              <h3 className="font-display text-lg font-semibold text-slate-900">Popular amenities</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {hotel.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a]
                  return (
                    <div key={a} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-700">
                      {Icon ? <Icon className="size-4 text-brand-600" /> : <Check className="size-4 text-brand-600" />}
                      {a}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Rooms */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-slate-900">
                <BedDouble className="size-6 text-brand-600" /> Choose your room
              </h2>
              <div className="mt-5 space-y-4">
                {hotel.rooms.map((r) => {
                  const tax = Math.round((r.price * taxPct) / 100)
                  const total = (r.price + tax) * 2
                  return (
                    <div
                      key={r.id}
                      className={cn(
                        'grid gap-4 rounded-2xl border p-4 transition-all md:grid-cols-[220px_1fr]',
                        selectedRoom?.id === r.id ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-500/30' : 'border-slate-200 hover:border-slate-300',
                      )}
                    >
                      <Img src={r.image} alt={r.name} className="h-40 rounded-xl md:h-auto" />
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-lg font-semibold text-slate-900">{r.name}</h3>
                            <p className="mt-1 text-sm text-slate-500">
                              {r.bed} · {r.area} · <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {r.guests} guests</span>
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Price amount={r.price} className="text-2xl font-bold text-slate-900" />
                            <span className="text-xs text-slate-400">/ night · incl. taxes</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {r.breakfast && <Badge variant="success"><Coffee className="size-3" /> Breakfast included</Badge>}
                          {r.refundable && <Badge variant="outline"><ShieldCheck className="size-3 text-emerald-500" /> Free cancellation</Badge>}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {r.amenities.map((a) => (
                            <span key={a} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">{a}</span>
                          ))}
                        </div>
                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                          <p className="text-sm text-slate-500">
                            <Price amount={total} className="font-semibold text-slate-800" /> total for 2 nights
                          </p>
                          <Button
                            variant={selectedRoom?.id === r.id ? 'default' : 'secondary'}
                            size="sm"
                            onClick={() => setSelectedRoom(r)}
                          >
                            {selectedRoom?.id === r.id ? '✓ Selected' : 'Select Room'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-slate-900">Guest reviews</h2>
              <div className="mt-4 flex items-center gap-3 rounded-2xl bg-emerald-50 p-4">
                <span className="text-3xl font-bold text-emerald-700">{hotel.guestRating}</span>
                <div>
                  <p className="text-sm font-bold text-emerald-800">Excellent</p>
                  <p className="text-xs text-emerald-700">Based on {hotel.reviewCount} verified guest reviews</p>
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-sun-500 text-sm font-bold text-white">
                          {r.author[0]}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{r.author}</p>
                          <p className="text-[11px] text-slate-400">{r.date}</p>
                        </div>
                      </div>
                      <StarRating value={r.rating} size="size-3" />
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{r.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{r.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Policies */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-slate-900">House rules & policies</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-800"><Clock className="size-4 text-brand-600" /> Check-in / Check-out</p>
                  <p className="mt-2 text-sm text-slate-600">Check-in from {hotel.checkIn} · Check-out until {hotel.checkOut}</p>
                  <p className="mt-1 text-xs text-slate-400">Early check-in and late check-out are subject to availability.</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-800"><ShieldCheck className="size-4 text-emerald-600" /> Cancellation</p>
                  <p className="mt-2 text-sm text-slate-600">Free cancellation up to 48 hours before check-in on most rates.</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {hotel.policies.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-slate-600"><Check className="mt-0.5 size-4 shrink-0 text-emerald-500" /> {p}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Map & nearby */}
          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-display text-2xl font-semibold text-slate-900">Location & nearby attractions</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                <iframe
                  title={`Map of ${hotel.name}`}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${hotel.map.lng - 0.02}%2C${hotel.map.lat - 0.015}%2C${hotel.map.lng + 0.02}%2C${hotel.map.lat + 0.015}&layer=mapnik&marker=${hotel.map.lat}%2C${hotel.map.lng}`}
                  className="h-64 w-full"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {hotel.nearby.map((n) => (
                  <div key={n} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-medium text-slate-700">
                    <MapPin className="size-4 text-sun-600" /> {n}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking card */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">Your stay</p>
              <p className="mt-1 font-display text-lg font-semibold">{hotel.name}</p>
              <p className="text-xs text-brand-100">{hotel.city}, {hotel.country}</p>
            </div>
            <div className="space-y-3 p-5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Check-in</span><span className="font-semibold text-slate-800">{hotel.checkIn}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Check-out</span><span className="font-semibold text-slate-800">{hotel.checkOut}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Nights</span><span className="font-semibold text-slate-800">2</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-slate-500">{room.name}</span>
                <Price amount={room.price} className="font-semibold text-slate-800" />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Taxes ({taxPct}%)</span>
                <Price amount={Math.round((room.price * taxPct) / 100)} className="font-semibold text-slate-800" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">Total for 2 nights</span>
                <Price amount={(room.price + Math.round((room.price * taxPct) / 100)) * 2} className="text-2xl font-bold text-slate-900" />
              </div>
              <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">✓ Free cancellation up to 48h before check-in</div>
              <Button size="lg" className="w-full" onClick={reserve}>
                Reserve Now <ArrowRight className="size-4" />
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
