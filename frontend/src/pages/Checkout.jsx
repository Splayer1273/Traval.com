import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check, CreditCard, Smartphone, Landmark, Wallet, ShieldCheck, Loader2,
  Luggage, Armchair, Utensils, Plane, Ticket, ChevronLeft, PartyPopper, ArrowRight,
} from 'lucide-react'
import MobileActionBar from '../components/layout/MobileActionBar.jsx'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Separator } from '../components/ui/separator.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { useBooking } from '../context/BookingContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { bookingApi } from '../services/bookingApi.js'
import { paymentApi } from '../services/paymentApi.js'
import { convert, formatMoney, fullName, formatDate } from '../utils/format.js'
import { cn } from '../lib/utils.js'

const STEPS = ['Search', 'Select', 'Passenger Details', 'Add-ons', 'Payment', 'Confirmation']

const BANKS = ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'Punjab National Bank', 'Bank of Baroda']
const WALLETS = ['Paytm Wallet', 'PhonePe Wallet', 'Amazon Pay', 'Mobikwik', 'Freecharge']

const ADDONS = {
  insurance: { id: 'insurance', name: 'Travel insurance', price: 349, icon: ShieldCheck, desc: 'Trip cancellation, medical & baggage cover' },
  seat: { id: 'seat', name: 'Seat selection', price: 299, icon: Armchair, desc: 'Pick your preferred seat on board' },
  meal: { id: 'meal', name: 'Meal upgrade', price: 450, icon: Utensils, desc: 'Gourmet meal served on board' },
  extraBag: { id: 'extraBag', name: 'Extra baggage (+10kg)', price: 1200, icon: Luggage, desc: 'Additional 10 kg check-in baggage' },
  lounge: { id: 'lounge', name: 'Airport lounge access', price: 1499, icon: Plane, desc: 'Priority entry to partner lounges' },
}

export default function Checkout() {
  const navigate = useNavigate()
  const { draft, setPromo, clear } = useBooking()
  const { currency } = useCurrency()
  const { isAuthenticated } = useAuth()
  const { toast, error } = useToast()

  const [step, setStep] = useState(3) // 0-indexed into STEPS; 3 = Add-ons
  const [selected, setSelected] = useState({ insurance: true })
  const [promoInput, setPromoInput] = useState('')
  const [promo, setPromoState] = useState(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const [method, setMethod] = useState('card')
  const [paying, setPaying] = useState(false)
  const [payDetails, setPayDetails] = useState({
    number: '4242 4242 4242 4242', expiry: '08/28', cvv: '', name: '',
    upiId: '', bank: '', wallet: '',
  })

  const item = draft?.item
  const kind = draft?.kind
  const passengers = draft?.passengers || []

  const fares = useMemo(() => {
    if (!item) return { base: 0, taxes: 0, addons: 0, discount: 0, total: 0 }
    const base =
      kind === 'flight' ? item.price * Math.max(1, passengers.length)
        : kind === 'hotel' ? (item.room.price + Math.round((item.room.price * (item.hotel.taxPct || 0)) / 100)) * 2
          : item.price
    const taxes = kind === 'flight' ? Math.round(base * 0.17) : kind === 'hotel' ? 0 : Math.round(base * 0.05)
    const addonTotal = Object.entries(selected)
      .filter(([, on]) => on)
      .reduce((sum, [key]) => sum + (ADDONS[key]?.price || 0), 0)
    let discount = 0
    if (promo) discount = promo.type === 'percent' ? Math.round(base * (promo.value / 100)) : Math.min(promo.value, base)
    const total = Math.max(0, base + taxes + addonTotal - discount)
    return { base, taxes, addons: addonTotal, discount, total }
  }, [item, passengers, selected, promo])

  if (!item) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">Your booking draft is empty</p>
        <p className="max-w-sm text-sm text-slate-500">Pick a flight or hotel to begin the checkout flow.</p>
        <Button asChild><a href="/flights">Search flights</a></Button>
      </div>
    )
  }

  const applyPromo = async () => {
    setPromoLoading(true)
    try {
      const p = await paymentApi.validatePromo(promoInput)
      setPromoState(p)
      setPromo({ code: promoInput.toUpperCase(), ...p })
      toast(`Promo ${p.label} applied!`, 'Discount applied')
    } catch (e) {
      error(e.message, 'Promo code')
    } finally {
      setPromoLoading(false)
    }
  }

  const confirmPayment = async () => {
    setPaying(true)
    try {
      const payment = await paymentApi.processPayment({ method, amount: fares.total, details: payDetails })
      const summary = buildSummary()
      const booking = await bookingApi.createBooking({
        type: kind === 'hotel' ? 'hotel' : kind === 'package' ? 'package' : 'flight',
        status: 'confirmed',
        title: kind === 'hotel' ? `${item.hotel.name} · ${item.room.name}` : kind === 'package' ? item.name : `${item.airline} ${item.flightNumber}`,
        destination: kind === 'hotel' ? `${item.hotel.city}, ${item.hotel.country}` : kind === 'package' ? `${item.destination}` : `${item.destination.city}, ${item.destination.country}`,
        image: kind === 'hotel' ? item.hotel.images[0] : kind === 'package' ? item.image : 'plane',
        travelDate: kind === 'hotel' ? item.checkIn : kind === 'flight' ? item.departure.slice(0, 10) : new Date().toISOString().slice(0, 10),
        amount: fares.total,
        currency,
        passengers,
        summary,
        payment: { method: methodLabel(), paid: fares.total, base: fares.base, taxes: fares.taxes, transactionId: payment.transactionId },
        addons: Object.entries(selected).filter(([, on]) => on).map(([key]) => ({ name: ADDONS[key].name, price: ADDONS[key].price })),
        timeline: [
          { label: 'Booking confirmed', time: new Date().toLocaleString('en-IN'), done: true },
          { label: 'E-ticket issued', time: new Date().toLocaleString('en-IN'), done: true },
          ...(kind === 'flight' ? [{ label: 'Web check-in opens', time: '', done: false }, { label: 'Departure', time: item.departure, done: false }] : kind === 'hotel' ? [{ label: 'Check-in opens', time: item.checkIn, done: false }, { label: 'Check-out', time: item.checkOut, done: false }] : []),
        ],
      })
      const id = booking.id
      clear()
      toast('Payment successful — your booking is confirmed!', 'Booking confirmed 🎉')
      navigate(`/confirmation/${id}`)
    } catch (e) {
      error(e.message, 'Payment failed')
    } finally {
      setPaying(false)
    }
  }

  const methodLabel = () => {
    if (method === 'card') return `Card •• ${payDetails.number.replace(/\s/g, '').slice(-4)}`
    if (method === 'upi') return `UPI · ${payDetails.upiId}`
    if (method === 'netbanking') return `Net Banking · ${payDetails.bank}`
    return `Wallet · ${payDetails.wallet}`
  }

  const buildSummary = () => {
    if (kind === 'flight') {
      return {
        airline: `${item.airline} ${item.flightNumber}`, cabin: item.cabin, baggage: `${item.baggage.checkin}`,
        from: { code: item.origin.code, city: item.origin.city }, to: { code: item.destination.code, city: item.destination.city },
        dep: item.departure, arr: item.arrival, leg: item.leg,
      }
    }
    if (kind === 'hotel') {
      return {
        hotel: item.hotel.name, room: item.room.name, board: item.room.breakfast ? 'Breakfast included' : 'Room only',
        checkIn: `${item.checkIn}T14:00:00`, checkOut: `${item.checkOut}T12:00:00`, nights: 2,
      }
    }
    return { package: item.name, hotel: item.hotelIncluded ? 'Hotels included' : 'Hotels at extra cost', flights: item.flightIncluded ? 'Flights included' : 'Flights at extra cost' }
  }

  const fmt = (n) => formatMoney(convert(n, currency), currency)

  return (
    <div className="bg-slate-50 pb-28 lg:pb-0">
      <div className="container-x py-6 sm:py-8">
        {/* Stepper - desktop */}
        <div className="mb-6 hidden items-center justify-center gap-2 sm:flex sm:mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={cn(
                'flex size-7 items-center justify-center rounded-full text-xs font-bold',
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500',
              )}>
                {i < step ? <Check className="size-3.5" /> : i + 1}
              </span>
              <span className={cn('text-xs font-semibold', i === step ? 'text-slate-900' : i < step ? 'text-slate-500' : 'text-slate-400')}>{s}</span>
              {i < STEPS.length - 1 && <span className="h-px w-5 bg-slate-200 sm:w-8" />}
            </div>
          ))}
        </div>
        {/* Stepper - mobile */}
        <p className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 sm:hidden">
          Step {step + 1} of 6 · <span className="text-brand-700">{STEPS[step]}</span>
        </p>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* STEP: Add-ons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PartyPopper className="size-5 text-brand-600" /> Make your trip extra special
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.values(ADDONS).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelected((s) => ({ ...s, [a.id]: !s[a.id] }))}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all sm:gap-4 sm:p-4',
                        selected[a.id] ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-slate-300',
                      )}
                    >
                      <span className={cn('flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-10', selected[a.id] ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500')}>
                        <a.icon className="size-4 sm:size-5" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-slate-800 sm:text-sm">{a.name}</span>
                        <span className="block text-[11px] text-slate-500 sm:text-xs">{a.desc}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 sm:text-sm">{fmt(a.price)}</span>
                        <span className={cn('flex size-5 items-center justify-center rounded-full border-2', selected[a.id] ? 'border-brand-600 bg-brand-600' : 'border-slate-300')}>
                          {selected[a.id] && <Check className="size-3 text-white" />}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <Button onClick={() => setStep(4)}>Continue to Payment</Button>
                </div>
              </CardContent>
            </Card>

            {/* STEP: Payment */}
            {step >= 4 && (
              <Card className="animate-fade-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CreditCard className="size-5 text-brand-600" /> Payment method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                    {[
                      { id: 'card', label: 'Card', icon: CreditCard },
                      { id: 'upi', label: 'UPI', icon: Smartphone },
                      { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                      { id: 'wallet', label: 'Wallet', icon: Wallet },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={cn(
                          'flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold transition-all sm:gap-2 sm:p-4 sm:text-sm',
                          method === m.id ? 'border-brand-500 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20' : 'border-slate-200 text-slate-600 hover:border-slate-300',
                        )}
                      >
                        <m.icon className="size-4 sm:size-5" /> {m.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 space-y-4">
                    {method === 'card' && (
                      <div className="animate-fade-in space-y-4">
                        <div>
                          <Label>Card number</Label>
                          <Input className="mt-1.5 font-mono" value={payDetails.number} onChange={(e) => setPayDetails({ ...payDetails, number: e.target.value })} placeholder="4242 4242 4242 4242" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><Label>Expiry</Label><Input className="mt-1.5" value={payDetails.expiry} onChange={(e) => setPayDetails({ ...payDetails, expiry: e.target.value })} placeholder="MM/YY" /></div>
                          <div><Label>CVV</Label><Input type="password" className="mt-1.5" value={payDetails.cvv} onChange={(e) => setPayDetails({ ...payDetails, cvv: e.target.value })} placeholder="•••" /></div>
                        </div>
                        <div><Label>Name on card</Label><Input className="mt-1.5" value={payDetails.name} onChange={(e) => setPayDetails({ ...payDetails, name: e.target.value })} placeholder="Name as printed" /></div>
                        <p className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700">
                          Demo checkout — use the pre-filled test number or any 16-digit value. Real cards are never stored.
                        </p>
                      </div>
                    )}
                    {method === 'upi' && (
                      <div className="animate-fade-in">
                        <Label>UPI ID</Label>
                        <Input className="mt-1.5 font-mono" value={payDetails.upiId} onChange={(e) => setPayDetails({ ...payDetails, upiId: e.target.value })} placeholder="yourname@okhdfc" />
                        <p className="mt-2 text-xs text-slate-500">You'll receive a collect request on your UPI app to approve this payment.</p>
                      </div>
                    )}
                    {method === 'netbanking' && (
                      <div className="animate-fade-in">
                        <Label>Select your bank</Label>
                        <Select value={payDetails.bank || undefined} onValueChange={(v) => setPayDetails({ ...payDetails, bank: v })}>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose bank" /></SelectTrigger>
                          <SelectContent>
                            {BANKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    {method === 'wallet' && (
                      <div className="animate-fade-in">
                        <Label>Choose wallet</Label>
                        <Select value={payDetails.wallet || undefined} onValueChange={(v) => setPayDetails({ ...payDetails, wallet: v })}>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose wallet" /></SelectTrigger>
                          <SelectContent>
                            {WALLETS.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button size="lg" className="w-full" disabled={paying} onClick={confirmPayment}>
                      {paying ? <Loader2 className="size-4 animate-spin" /> : <ShieldCheck className="size-4" />}
                      {paying ? 'Processing securely…' : `Pay ${fmt(fares.total)} securely`}
                    </Button>
                    <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                      <ShieldCheck className="size-3.5 text-emerald-500" /> 256-bit SSL encrypted · PCI-DSS compliant gateway
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step < 4 && (
              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)}><ChevronLeft className="size-4" /> Back</Button>
              </div>
            )}
          </div>

          {/* Fare summary */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-4 text-white sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-200">Fare summary</p>
                <p className="mt-1 font-display text-base font-semibold sm:text-lg">{kind === 'hotel' ? item.hotel.name : kind === 'package' ? item.name : `${item.airline} ${item.flightNumber}`}</p>
                {kind === 'flight' && <p className="text-xs text-brand-100">{item.origin.code} → {item.destination.code} · {item.cabin} · {item.leg}</p>}
                {kind === 'hotel' && <p className="text-xs text-brand-100">{item.room.name} · 2 nights</p>}
              </div>
              <div className="space-y-3 p-4 text-sm sm:p-5">
                <div className="flex justify-between"><span className="text-slate-500">Base fare</span><span className="font-semibold text-slate-800">{fmt(fares.base)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Taxes & fees</span><span className="font-semibold text-slate-800">{fmt(fares.taxes)}</span></div>
                {fares.addons > 0 && (
                  <div className="flex justify-between"><span className="text-slate-500">Add-ons ({Object.values(selected).filter(Boolean).length})</span><span className="font-semibold text-slate-800">{fmt(fares.addons)}</span></div>
                )}
                {fares.discount > 0 && (
                  <div className="flex justify-between text-emerald-600"><span>Discount{promo ? ` (${promo.label})` : ''}</span><span className="font-bold">−{fmt(fares.discount)}</span></div>
                )}
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Total payable</span>
                  <span className="text-xl font-bold text-slate-900 sm:text-2xl">{fmt(fares.total)}</span>
                </div>
                {passengers.length > 0 && (
                  <p className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-500">
                    {passengers.map((p) => fullName(p)).join(', ')}
                  </p>
                )}

                {/* Promo */}
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-slate-600">Have a promo code?</p>
                  <div className="flex gap-2">
                    <Input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="e.g. SUNRISE25" className="h-10 uppercase" />
                    <Button variant="secondary" size="sm" className="h-10 shrink-0" onClick={applyPromo} disabled={promoLoading}>
                      {promoLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Ticket className="size-3.5" />} <span className="hidden sm:inline">Apply</span>
                    </Button>
                  </div>
                  {promo && <p className="mt-1.5 text-xs font-semibold text-emerald-600">✓ {promo.label} applied to your booking</p>}
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-700">
                  ✓ Free cancellation up to 24h before departure · ✓ Instant e-ticket · ✓ Price lock for 48h
                </div>
                {!isAuthenticated && (
                  <p className="text-center text-[11px] text-slate-400">Checking out as guest — <a href="/login" className="font-semibold text-brand-600 hover:underline">sign in</a> for member prices.</p>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <MobileActionBar
        sub={kind === 'hotel' ? 'Your stay · 2 nights' : kind === 'package' ? 'Holiday package' : `${item.origin.code} → ${item.destination.code} · ${item.cabin}`}
        price={<span className="text-xl font-bold text-slate-900">{fmt(fares.total)}</span>}
        buttonText={step >= 4 ? 'Pay securely' : 'Continue to Payment'}
        icon={step >= 4 ? <ShieldCheck className="size-4" /> : <ArrowRight className="size-4" />}
        disabled={step >= 4 && paying}
        onClick={() => {
          if (step >= 4) {
            if (!paying) confirmPayment()
          } else {
            setStep(4)
          }
        }}
      />
    </div>
  )
}
