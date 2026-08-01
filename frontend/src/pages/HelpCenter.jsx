import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MessageCircle, Phone, Mail, HelpCircle, BookOpen, FileText, LifeBuoy } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Input } from '../components/ui/input.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'
import { FAQS } from '../data/faqs.js'
import { useToast } from '../context/ToastContext.jsx'

const CATEGORIES = [...new Set(FAQS.map((f) => f.category))]
const TOPICS = [
  { icon: BookOpen, title: 'Booking guides', text: 'How to book flights, hotels & packages', to: '/guides' },
  { icon: FileText, title: 'Cancellation & refunds', text: 'Understand our policies', to: '/cancellation' },
  { icon: LifeBuoy, title: 'Visa assistance', text: 'Visa requirements & help', to: '/visa' },
  { icon: HelpCircle, title: 'Travel insurance', text: 'Protect every trip', to: '/insurance' },
]

export default function HelpCenter() {
  const { toast } = useToast()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = FAQS.filter((f) => {
    if (category !== 'All' && f.category !== category) return false
    const q = query.toLowerCase()
    return !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHero image="city" title="Help Center" subtitle="Answers to the questions travellers ask most — 24×7" crumb={[{ label: 'Help' }]} />

      <div className="container-x mt-8">
        {/* Topic cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t) => (
            <Link key={t.title} to={t.to} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <t.icon className="size-5" />
              </span>
              <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{t.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{t.text}</p>
            </Link>
          ))}
        </div>

        {/* Search + categories */}
        <div className="mt-10">
          <div className="mx-auto max-w-md">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search help articles…" className="pl-10" />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['All', ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all ${category === c ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <Card className="mx-auto mt-8 max-w-3xl">
          <CardContent className="p-6">
            {filtered.length === 0 ? (
              <div className="py-10 text-center">
                <p className="font-display text-lg font-semibold text-slate-800">No results for "{query}"</p>
                <p className="mt-1 text-sm text-slate-500">Try a different search, or reach out to our 24×7 team below.</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filtered.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Contact CTAs */}
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { icon: MessageCircle, label: 'Live chat', text: 'Under 1 min' },
            { icon: Phone, label: '+91 1800 419 4200', text: '24×7 toll-free' },
            { icon: Mail, label: 'support@sunrise.travel', text: 'Replies in 4 hrs' },
          ].map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => toast(`Connecting you to ${c.label}…`, 'Support')}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-sun-500 text-white"><c.icon className="size-5" /></span>
              <span>
                <span className="block text-sm font-bold text-slate-800">{c.label}</span>
                <span className="block text-xs text-slate-500">{c.text}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
