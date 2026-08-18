import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, ArrowRight, UserRound, Plane, Contact, PhoneCall } from 'lucide-react'
import MobileActionBar from '../components/layout/MobileActionBar.jsx'
import { Button } from '../components/ui/button.jsx'
import { Input } from '../components/ui/input.jsx'
import { Label } from '../components/ui/label.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { useBooking } from '../context/BookingContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { convert, formatMoney } from '../utils/format.js'
import { useAuth } from '../context/AuthContext.jsx'

const GENDERS = ['Male', 'Female', 'Other']
const NATIONALITIES = ['Indian', 'American', 'British', 'UAE', 'Singaporean', 'Thai', 'French', 'German', 'Japanese', 'Other']

const emptyPassenger = () => ({
  firstName: '', lastName: '', gender: '', dob: '', nationality: 'Indian',
  passportNumber: '', passportExpiry: '', seat: '',
})

const pCountLabel = (n) => `${n} passenger${n > 1 ? 's' : ''}`

export default function PassengerDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { draft, setPassengers, setContact, setEmergency } = useBooking()
  const { user } = useAuth()
  const { toast, error: toastError } = useToast()
  const { currency } = useCurrency()
  const flight = draft.kind === 'flight' ? draft.item : null

  const [passengers, setLocal] = useState(() =>
    draft.passengers.length ? draft.passengers : [emptyPassenger()],
  )
  const [contact, setContactLocal] = useState(
    draft.contact || { email: user?.email || '', phone: user?.phone || '', countryCode: '+91' },
  )
  const [emergency, setEmergencyLocal] = useState(
    draft.emergency || { name: '', relation: '', phone: '' },
  )
  const [assistance, setAssistance] = useState('none')

  const update = (i, patch) => setLocal((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x)))
  const addPassenger = () => setLocal((p) => [...p, emptyPassenger()])
  const removePassenger = (i) => setLocal((p) => p.filter((_, idx) => idx !== i))

  const validate = () => {
    for (const p of passengers) {
      if (!p.firstName || !p.lastName) return 'Please fill the passenger name.'
      if (!p.gender) return 'Please select the gender for each passenger.'
      if (!p.dob) return 'Please enter the date of birth.'
      if (!p.passportNumber || !p.passportExpiry) return 'Passport number and expiry are required for international travel.'
    }
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) return 'Please enter a valid contact email.'
    if (!contact.phone) return 'Please enter a contact phone number.'
    return null
  }

  const continueCheckout = () => {
    const err = validate()
    if (err) return toastError(err, 'Passenger details')
    setPassengers(passengers)
    setContact(contact)
    setEmergency(emergency)
    toast('Passenger details saved. Choose your add-ons next.', 'Almost there')
    navigate('/checkout')
  }

  const price = flight?.price ?? 0
  const total = price * passengers.length

  if (!flight) {
    return (
      <div className="container-x py-16 text-center">
        <p className="font-display text-xl font-semibold text-slate-800">No flight selected</p>
        <Button className="mt-4" onClick={() => navigate('/flights')}>Search flights</Button>
      </div>
    )
  }

  return (
    <div className="bg-slate-50 pb-14 lg:pb-0">
      <div className="container-x py-8">
        {/* Stepper hint */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
          {['Search', 'Select', 'Passenger Details', 'Add-ons', 'Payment', 'Confirmation'].map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span className={`flex size-6 items-center justify-center rounded-full ${i === 2 ? 'bg-brand-600 text-white' : i < 2 ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {i < 2 ? '✓' : i + 1}
              </span>
              <span className={i === 2 ? 'text-slate-900' : 'text-slate-400'}>{s}</span>
              {i < 5 && <span className="h-px w-4 bg-slate-200 sm:w-6" />}
            </span>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex-row items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserRound className="size-5 text-brand-600" /> Traveller details
                </CardTitle>
                <Badge variant="secondary">{pCountLabel(passengers.length)}</Badge>
              </CardHeader>
              <CardContent className="space-y-6">
                {passengers.map((p, i) => (
                  <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800">Traveller {i + 1}</p>
                      {passengers.length > 1 && (
                        <button type="button" onClick={() => removePassenger(i)} className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:underline">
                          <Trash2 className="size-3.5" /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <Label>First name <span className="text-rose-500">*</span></Label>
                        <Input className="mt-1.5" value={p.firstName} onChange={(e) => update(i, { firstName: e.target.value })} placeholder="As on passport" />
                      </div>
                      <div>
                        <Label>Last name <span className="text-rose-500">*</span></Label>
                        <Input className="mt-1.5" value={p.lastName} onChange={(e) => update(i, { lastName: e.target.value })} placeholder="As on passport" />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <Select value={p.gender || undefined} onValueChange={(v) => update(i, { gender: v })}>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            {GENDERS.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Date of birth</Label>
                        <Input type="date" className="mt-1.5" value={p.dob} onChange={(e) => update(i, { dob: e.target.value })} />
                      </div>
                      <div>
                        <Label>Nationality</Label>
                        <Select value={p.nationality} onValueChange={(v) => update(i, { nationality: v })}>
                          <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {NATIONALITIES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Seat preference</Label>
                        <Select value={p.seat || undefined} onValueChange={(v) => update(i, { seat: v })}>
                          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Auto-assign" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Window">Window</SelectItem>
                            <SelectItem value="Aisle">Aisle</SelectItem>
                            <SelectItem value="Middle">Middle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Passport number</Label>
                        <Input className="mt-1.5 uppercase" value={p.passportNumber} onChange={(e) => update(i, { passportNumber: e.target.value })} placeholder="e.g. P1234567" />
                      </div>
                      <div>
                        <Label>Passport expiry</Label>
                        <Input type="date" className="mt-1.5" value={p.passportExpiry} onChange={(e) => update(i, { passportExpiry: e.target.value })} />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed" onClick={addPassenger}>
                  <Plus className="size-4" /> Add Passenger
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Contact className="size-5 text-brand-600" /> Contact information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Email <span className="text-rose-500">*</span></Label>
                  <Input type="email" className="mt-1.5" value={contact.email} onChange={(e) => setContactLocal({ ...contact, email: e.target.value })} placeholder="you@example.com" />
                </div>
                <div>
                  <Label>Phone <span className="text-rose-500">*</span></Label>
                  <div className="mt-1.5 flex gap-2">
                    <Select value={contact.countryCode} onValueChange={(v) => setContactLocal({ ...contact, countryCode: v })}>
                      <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+91">+91</SelectItem>
                        <SelectItem value="+971">+971</SelectItem>
                        <SelectItem value="+65">+65</SelectItem>
                        <SelectItem value="+44">+44</SelectItem>
                        <SelectItem value="+1">+1</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input value={contact.phone} onChange={(e) => setContactLocal({ ...contact, phone: e.target.value })} placeholder="98765 43210" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PhoneCall className="size-5 text-brand-600" /> Emergency contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label>Name</Label>
                  <Input className="mt-1.5" value={emergency.name} onChange={(e) => setEmergencyLocal({ ...emergency, name: e.target.value })} placeholder="Emergency contact" />
                </div>
                <div>
                  <Label>Relation</Label>
                  <Input className="mt-1.5" value={emergency.relation} onChange={(e) => setEmergencyLocal({ ...emergency, relation: e.target.value })} placeholder="e.g. Spouse" />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input className="mt-1.5" value={emergency.phone} onChange={(e) => setEmergencyLocal({ ...emergency, phone: e.target.value })} placeholder="+91 ..." />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plane className="size-5 text-brand-600" /> Special assistance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {[
                    ['none', 'No assistance needed'],
                    ['wheelchair', 'Wheelchair assistance'],
                    ['visual', 'Visual impairment assistance'],
                    ['dietary', 'Dietary meal request'],
                    ['medical', 'Medical assistance (oxygen)'],
                    ['unaccompanied', 'Unaccompanied minor'],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAssistance(val)}
                      className={`flex items-center gap-2.5 rounded-xl border p-3 text-left text-sm font-medium transition-colors ${assistance === val ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}
                    >
                      <span className={`flex size-4 items-center justify-center rounded-full border-2 ${assistance === val ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                        {assistance === val && <span className="size-1.5 rounded-full bg-white" />}
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={continueCheckout}>
              Continue to Add-ons <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <Card>
              <div className="bg-gradient-to-r from-brand-600 to-brand-500 p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">Booking summary</p>
                <p className="mt-1 font-display text-lg font-semibold">{flight.airline} {flight.flightNumber}</p>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">{flight.origin.code} → {flight.destination.code}</span>
                  <Badge variant="secondary">{flight.cabin}</Badge>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Departure</span><span className="font-semibold text-slate-800">{new Date(flight.departure).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Travellers</span><span className="font-semibold text-slate-800">{passengers.length} × <span className="inline-block">{formatMoney(convert(price, currency), currency)}</span></span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Baggage</span><span className="font-semibold text-slate-800">{flight.baggage.checkin}</span>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Total</span>
                  <span className="text-2xl font-bold text-slate-900">{formatMoney(convert(total, currency), currency)}</span>
                </div>
                <p className="text-xs text-slate-400">Taxes included · Free cancellation on this fare</p>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Mobile sticky booking bar */}
      <MobileActionBar
        sub={`${flight.origin.code} → ${flight.destination.code} · ${pCountLabel(passengers.length)}`}
        price={
          <p className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900">{formatMoney(convert(total, currency), currency)}</span>
            <span className="text-[11px] font-semibold text-slate-400">total</span>
          </p>
        }
        buttonText="Continue"
        icon={<ArrowRight className="size-4" />}
        onClick={continueCheckout}
      />
    </div>
  )
}
