import { useState } from 'react'
import { ShieldCheck, Check, Loader2 } from 'lucide-react'
import PageHero from '../../components/PageHero.jsx'
import { Card, CardContent } from '../../components/ui/card.jsx'
import { Button } from '../../components/ui/button.jsx'
import { Badge } from '../../components/ui/badge.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { cn } from '../../lib/utils.js'

const PLANS = [
  {
    id: 'basic', name: 'Sunrise Basic', price: 499, popular: false, tagline: 'Essential cover for short domestic trips',
    features: ['Medical expenses up to ₹5,00,000', 'Trip cancellation (25% refund)', 'Baggage delay (₹5,000)', '24×7 assistance helpline'],
  },
  {
    id: 'standard', name: 'Sunrise Standard', price: 899, popular: true, tagline: 'Our most popular plan for international travel',
    features: ['Medical expenses up to ₹25,00,000', 'Trip cancellation (100% refund)', 'Baggage loss up to ₹50,000', 'Flight delay compensation ₹5,000', 'Personal accident ₹25,00,000', '24×7 assistance helpline'],
  },
  {
    id: 'premium', name: 'Sunrise Premium', price: 1499, popular: false, tagline: 'Complete cover for frequent & adventure travellers',
    features: ['Medical expenses up to ₹50,00,000', 'Adventure sports cover', 'Trip cancellation (100%) + trip interruption', 'Laptop & electronics cover ₹75,000', 'Passport loss assistance', 'Concierge & medical evacuation'],
  },
]

export default function TravelInsurance() {
  const { toast } = useToast()
  const [selected, setSelected] = useState('standard')
  const [loading, setLoading] = useState(false)

  const buy = (plan) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast(`${plan.name} added to your trip. It also covers your family up to 4 members.`, 'Insurance purchased')
    }, 900)
  }

  return (
    <div>
      <PageHero image="spa" title="Travel Insurance" subtitle="Trip cancellation, medical cover and baggage protection — priced per trip" crumb={[{ label: 'Travel Insurance' }]} />

      <div className="container-x mt-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <Card
              key={p.id}
              className={cn(
                'relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lift',
                selected === p.id ? 'ring-2 ring-brand-500' : '',
              )}
            >
              {p.popular && (
                <div className="bg-gradient-to-r from-sun-500 to-sun-600 py-1.5 text-center text-xs font-bold uppercase tracking-widest text-white">
                  Most popular
                </div>
              )}
              <CardContent className="flex flex-1 flex-col p-6">
                <p className="flex items-center gap-2 font-display text-lg font-semibold text-slate-900">
                  <ShieldCheck className="size-5 text-brand-600" /> {p.name}
                </p>
                <p className="mt-1 text-xs text-slate-500">{p.tagline}</p>
                <p className="mt-4">
                  <span className="text-3xl font-bold text-slate-900">₹{p.price}</span>
                  <span className="text-sm text-slate-400"> / trip</span>
                </p>
                <ul className="mt-5 flex-1 space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="size-3 text-emerald-600" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Button
                    variant={p.popular ? 'default' : 'secondary'}
                    className="w-full"
                    disabled={loading}
                    onClick={() => buy(p)}
                  >
                    {loading && selected === p.id ? <Loader2 className="size-4 animate-spin" /> : null}
                    {p.id === 'basic' ? 'Choose plan' : 'Get quote'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Zero paperwork', text: 'Claims filed in-app with photo uploads.' },
            { title: 'Cashless hospitals', text: '6,000+ network hospitals worldwide.' },
            { title: 'Instant confirmation', text: 'Policy issued in seconds, emailed to you.' },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl bg-slate-50 p-5 text-center">
              <Badge variant="success">{f.title}</Badge>
              <p className="mt-2 text-xs text-slate-500">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
