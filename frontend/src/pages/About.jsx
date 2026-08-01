import { Link } from 'react-router-dom'
import { Plane, Hotel, Globe2, HeartHandshake, Target, Eye } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'

const STATS = [
  { value: '2M+', label: 'Travellers served' },
  { value: '500+', label: 'Airlines' },
  { value: '80k+', label: 'Hotels worldwide' },
  { value: '190+', label: 'Countries covered' },
]

const VALUES = [
  { icon: HeartHandshake, title: 'Traveller-first', text: "Every decision starts with what's best for the traveller — from transparent pricing to human support." },
  { icon: Target, title: 'Radical transparency', text: 'All-inclusive fares, no hidden fees, and clear cancellation policies before you pay.' },
  { icon: Globe2, title: 'Global, locally aware', text: 'We price in your currency, speak your language and understand how you travel.' },
]

export default function About() {
  return (
    <div>
      <PageHero image="roadtrip" title="About Project Sunrise" subtitle="We believe travel should be effortless, transparent and joyful" crumb={[{ label: 'About Us' }]} />

      <div className="container-x mt-10 space-y-14">
        {/* Intro */}
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Our story</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
              Born from a cancelled flight and a long night at the airport
            </h2>
            <p className="mt-4 leading-relaxed text-slate-600">
              Project Sunrise began in 2021 when our founders spent 14 hours stranded at Mumbai airport after a missed connection.
              The airline app failed, the helpline rang busy, and nobody knew who to trust. That night became the blueprint for
              everything we build: <span className="font-semibold text-slate-800">clarity, control and care</span> for every traveller.
            </p>
            <p className="mt-3 leading-relaxed text-slate-600">
              Today, millions of travellers search flights, book hotels and plan holidays through Project Sunrise — with the same
              promise we made on day one: show real prices, protect every booking, and answer when you call.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/flights" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700">Search flights</Link>
              <Link to="/packages" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-brand-300">Explore packages</Link>
            </div>
          </div>
          <div className="relative">
            <Img src="planeWing" alt="Flying at sunrise" className="h-80 rounded-3xl shadow-lift" />
            <Card className="absolute -bottom-6 -left-6 hidden max-w-56 shadow-lift sm:block">
              <CardContent className="p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Plane className="size-4 text-brand-600" /> Since 2021</p>
                <p className="mt-1 text-xs text-slate-500">Trusted by 2M+ travellers across 190+ countries.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-center text-white shadow-lift">
              <p className="font-display text-4xl font-bold">{s.value}</p>
              <p className="mt-1 text-sm text-brand-100">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            { icon: Eye, title: 'Our vision', text: 'A world where planning a trip feels as good as taking one.' },
            { icon: HeartHandshake, title: 'Our promise', text: 'Real prices, instant tickets, honest policies and humans who answer.' },
            { icon: Hotel, title: 'Our network', text: '500+ airlines and 80,000+ hotels, hand-verified for quality.' },
          ].map((v) => (
            <Card key={v.title} className="transition-all hover:-translate-y-1 hover:shadow-lift">
              <CardContent className="p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><v.icon className="size-5" /></span>
                <h3 className="mt-3 font-display text-lg font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{v.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values */}
        <div>
          <h2 className="text-center font-display text-2xl font-semibold text-slate-900">What we stand for</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-card">
                <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-sun-100 to-amber-100 text-sun-600"><v.icon className="size-6" /></span>
                <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
