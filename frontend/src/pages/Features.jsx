import { Link } from 'react-router-dom'
import { Search, Shield, CheckCircle2, Receipt, BarChart3, Clock, Users, FileText, Headphones } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'
import { AnimateOnScroll, StaggerContainer, StaggerItem, TiltCard } from '../components/animations/index.js'
import { FEATURES_HERO, FEATURE_SECTIONS } from '../data/featuresPage.js'
import { FEATURES_FAQS } from '../data/pageFaqs.js'
import { cn } from '../lib/utils.js'

function FeatureDetail({ feature, index }) {
  const isEven = index % 2 === 0
  return (
    <AnimateOnScroll preset={isEven ? 'fadeLeft' : 'fadeRight'} delay={index * 0.05}>
      <div id={feature.id} className="grid items-center gap-8 lg:grid-cols-2">
        <div className={cn(!isEven && 'lg:order-2')}>
          <h2 className="font-display text-3xl font-semibold text-slate-900">{feature.title}</h2>
          <p className="mt-1 text-sm font-semibold text-sun-600">{feature.subtitle}</p>
          <p className="mt-4 leading-relaxed text-slate-600">{feature.description}</p>

          {feature.benefit && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-brand-50 to-sun-50 p-4">
              <p className="text-sm font-semibold text-brand-700">{feature.benefit}</p>
            </div>
          )}
          {feature.result && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 p-4">
              <p className="text-sm font-semibold text-emerald-700">{feature.result}</p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700">Explore Platform</Link>
            <Link to="/contact" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-brand-300">Request a Demo</Link>
          </div>
        </div>

        <div className={cn(!isEven && 'lg:order-1')}>
          {feature.image && (
            <div className="relative mb-6">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Img src={feature.image} alt={feature.title} className="h-64 rounded-3xl shadow-lift sm:h-72" />
              </motion.div>
            </div>
          )}
          <Card className="h-full">
            <CardContent className="p-6">
              {feature.workflow ? (
                <>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">Workflow</p>
                  <div className="space-y-2">
                    {(feature.workflow || []).map((step, i) => (
                      <motion.div
                        key={step}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, duration: 0.4 }}
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
                        <p className="text-sm text-slate-600">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">Capabilities</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(feature.capabilities || []).map((c) => (
                      <div key={c} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                        {c}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimateOnScroll>
  )
}

export default function Features() {
  return (
    <div>
      <PageHero image="analyticsDash" title={FEATURES_HERO.title} subtitle={FEATURES_HERO.subtitle} crumb={[{ label: 'Features' }]} />

      <div className="container-x mt-10 space-y-14">
        {/* Intro */}
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <AnimateOnScroll preset="fadeLeft">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Platform</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
                Technology That Makes Corporate Travel Easier
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">{FEATURES_HERO.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700">Explore Platform</Link>
                <Link to="/contact" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-brand-300">Request a Demo</Link>
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll preset="fadeRight">
            <div className="relative">
              <Img src="businessLaptop" alt="Corporate travel platform" className="h-80 rounded-3xl shadow-lift" />
              <Card className="absolute -bottom-6 -right-6 hidden max-w-56 shadow-lift sm:block">
                <CardContent className="p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Search className="size-4 text-brand-600" /> 10 Features</p>
                  <p className="mt-1 text-xs text-slate-500">Booking, approvals, policies, expenses, analytics, support and more.</p>
                </CardContent>
              </Card>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Feature sections */}
        {FEATURE_SECTIONS.map((feature, i) => (
          <FeatureDetail key={feature.id} feature={feature} index={i} />
        ))}

        {/* FAQs */}
        <div>
          <AnimateOnScroll preset="fadeUp">
            <p className="text-xs font-bold uppercase tracking-widest text-sun-600">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          </AnimateOnScroll>
          <div className="mx-auto mt-6 max-w-2xl">
            <Accordion type="single" collapsible className="space-y-3">
              {FEATURES_FAQS.map((faq, i) => (
                <AnimateOnScroll key={i} preset="fadeUp" delay={i * 0.05}>
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
          </div>
        </div>

        {/* CTA */}
        <AnimateOnScroll preset="scaleUp">
          <div className="rounded-2xl bg-gradient-to-r from-brand-700 to-brand-600 p-6 text-white shadow-lift">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold">Ready to Modernize Your Travel Platform?</h2>
                <p className="mt-1 text-sm text-brand-100">Akbar Bizvoy combines travel services with technology to simplify the complete corporate travel lifecycle.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-all hover:bg-brand-50">Request a Demo</Link>
                <Link to="/contact" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20">Talk to Our Team</Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
