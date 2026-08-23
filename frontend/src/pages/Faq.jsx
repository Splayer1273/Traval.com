import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'
import { AnimateOnScroll, StaggerContainer, StaggerItem } from '../components/animations/index.js'
import { FAQ_CATEGORIES, FAQ_HERO } from '../data/faqPage.js'
import { cn } from '../lib/utils.js'

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')

  const activeFaqs = FAQ_CATEGORIES.find((c) => c.id === activeCategory)?.faqs || []

  const filteredFaqs = searchQuery
    ? FAQ_CATEGORIES.flatMap((c) => c.faqs).filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : activeFaqs

  return (
    <div>
      <PageHero image="businessLaptop" title={FAQ_HERO.title} subtitle={FAQ_HERO.subtitle} crumb={[{ label: 'FAQ' }]} />

      <div className="container-x mt-10 space-y-10">
        {/* Search */}
        <AnimateOnScroll preset="fadeUp">
          <div className="mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 shadow-soft placeholder:text-slate-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200 transition-all"
              />
            </div>
          </div>
        </AnimateOnScroll>

        {/* Category tabs */}
        {!searchQuery && (
          <AnimateOnScroll preset="fadeUp" delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {FAQ_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    activeCategory === cat.id
                      ? 'bg-brand-600 text-white shadow-glow'
                      : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-slate-900',
                  )}
                >
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </AnimateOnScroll>
        )}

        {/* Search results count */}
        {searchQuery && (
          <motion.p
            className="text-center text-sm text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} found for &ldquo;{searchQuery}&rdquo;
          </motion.p>
        )}

        {/* FAQs */}
        <div className="mx-auto max-w-2xl">
          {filteredFaqs.length === 0 ? (
            <AnimateOnScroll preset="scaleUp">
              <Card>
                <CardContent className="flex flex-col items-center py-12">
                  <HelpCircle className="size-10 text-slate-300" />
                  <p className="mt-3 text-sm font-semibold text-slate-600">No matching questions found</p>
                  <p className="mt-1 text-xs text-slate-400">Try a different search term or browse categories above</p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ) : (
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFaqs.map((faq, i) => (
                <AnimateOnScroll key={`${activeCategory}-${i}`} preset="fadeUp" delay={i * 0.04}>
                  <AccordionItem value={`faq-${i}`} className="rounded-2xl border border-slate-200 bg-white px-5 shadow-soft transition-all hover:border-brand-200 hover:shadow-card">
                    <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-900 hover:no-underline hover:text-brand-700">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-sm leading-relaxed text-slate-500">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                </AnimateOnScroll>
              ))}
            </Accordion>
          )}
        </div>

        {/* Still have questions */}
        <AnimateOnScroll preset="scaleUp">
          <div className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-6 text-white shadow-lift">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold">Still have questions?</h2>
                <p className="mt-1 text-sm text-brand-100">Our corporate travel team is available 24/7 to help.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/contact" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-all hover:bg-brand-50">Contact Us</Link>
                <a href="tel:+97143561222" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20">Call +971 4356 1222</a>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
