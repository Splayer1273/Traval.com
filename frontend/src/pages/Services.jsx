import { Link, useNavigate } from 'react-router-dom'
import { Plane, Hotel, Car, Shield, FileCheck, Users, Handshake, Crown, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'
import { AnimateOnScroll, StaggerContainer, StaggerItem, TiltCard } from '../components/animations/index.js'
import {
  SERVICES_HERO, SERVICES_OVERVIEW, SERVICE_SECTIONS, HOW_IT_WORKS_STEPS,
} from '../data/servicesPage.js'
import { SERVICES_FAQS } from '../data/pageFaqs.js'
import { cn } from '../lib/utils.js'

function OverviewGrid() {
  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
      {SERVICES_OVERVIEW.items.map((item) => (
        <StaggerItem key={item.label}>
          <TiltCard maxTilt={4} scale={1.02}>
            <div className="rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-center text-white shadow-lift transition-all hover:-translate-y-1">
              <motion.span
                className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/15"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <item.icon className="size-6" />
              </motion.span>
              <h3 className="mt-3 font-display text-lg font-semibold">{item.label}</h3>
              <p className="mt-1 text-sm text-brand-100">{item.text}</p>
            </div>
          </TiltCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}

function ServiceDetail({ service, index }) {
  const isEven = index % 2 === 0
  return (
    <AnimateOnScroll preset={isEven ? 'fadeLeft' : 'fadeRight'} delay={index * 0.05}>
      <div id={service.id} className="grid items-center gap-8 lg:grid-cols-2">
        <div className={cn(!isEven && 'lg:order-2')}>
          <Badge className="mb-3 bg-sun-100 text-sun-700 ring-0">{service.badge}</Badge>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{service.title}</h2>
          <p className="mt-4 leading-relaxed text-slate-600">{service.description}</p>

          {service.benefits && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.benefits.map((b) => (
                <div key={b.title || b} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <div>
                    {b.title ? (
                      <>
                        <p className="text-sm font-semibold text-slate-800">{b.title}</p>
                        <p className="text-xs text-slate-500">{b.text}</p>
                      </>
                    ) : (
                      <p className="text-sm text-slate-600">{b}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {service.assistance && (
            <div className="mt-5 space-y-2">
              {service.assistance.map((a) => (
                <div key={a.title} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500">{a.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {service.categories && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.categories.map((c) => (
                <div key={c.title} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">{c.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{c.text}</p>
                </div>
              ))}
            </div>
          )}

          {service.options && (
            <div className="mt-4 flex flex-wrap gap-2">
              {service.options.map((o) => (
                <motion.span
                  key={o}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  whileHover={{ scale: 1.05 }}
                >
                  {o}
                </motion.span>
              ))}
            </div>
          )}

          {service.destinations && (
            <div className="mt-4 flex flex-wrap gap-2">
              {service.destinations.map((d) => (
                <motion.span
                  key={d}
                  className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                  whileHover={{ scale: 1.05 }}
                >
                  {d}
                </motion.span>
              ))}
            </div>
          )}

          {service.idealFor && (
            <div className="mt-4 flex flex-wrap gap-2">
              {service.idealFor.map((i) => (
                <motion.span
                  key={i}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
                  whileHover={{ scale: 1.05 }}
                >
                  {i}
                </motion.span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700">Explore {service.badge}</Link>
            <Link to="/contact" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-brand-300">Talk to an expert</Link>
          </div>
        </div>

        <div className={cn(!isEven && 'lg:order-1')}>
          {service.image && (
            <div className="relative mb-6">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Img src={service.image} alt={service.title} className="h-64 rounded-3xl shadow-lift sm:h-72" />
              </motion.div>
            </div>
          )}
          {service.capabilities && (
            <Card className="h-full">
              <CardContent className="p-6">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">
                  {service.categories ? 'MICE Support' : service.assistance ? 'Services Include' : service.options ? 'Coverage Areas' : 'What You Can Manage'}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {service.capabilities.map((c) => (
                    <div key={typeof c === 'string' ? c : c.title} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      {typeof c === 'string' ? c : (
                        <span><span className="font-semibold text-slate-800">{c.title}:</span> {c.text}</span>
                      )}
                    </div>
                  ))}
                </div>
                {service.workflow && (
                  <div className="mt-6 rounded-xl bg-gradient-to-r from-brand-50 to-sun-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-500">Designed Around Business Schedules</p>
                    <p className="mt-2 text-sm font-semibold text-slate-800">{service.workflow}</p>
                    <p className="mt-1 text-xs text-slate-500">{service.workflowText}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AnimateOnScroll>
  )
}

function HowItWorksSection() {
  return (
    <div>
      <AnimateOnScroll preset="fadeUp">
        <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Process</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
          How Corporate Travel Works
        </h2>
      </AnimateOnScroll>
      <StaggerContainer className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
        {HOW_IT_WORKS_STEPS.map((step) => (
          <StaggerItem key={step.step}>
            <TiltCard maxTilt={4} scale={1.02}>
              <div className="rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-center text-white shadow-lift transition-all hover:-translate-y-1">
                <motion.span
                  className="mx-auto flex size-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {step.step}
                </motion.span>
                <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-brand-100">{step.text}</p>
              </div>
            </TiltCard>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  )
}

export default function Services() {
  return (
    <div>
      <PageHero image="businessFlight" title={SERVICES_HERO.title} subtitle={SERVICES_HERO.subtitle} crumb={[{ label: 'Services' }]} />

      <div className="container-x mt-10 space-y-14">
        {/* Intro */}
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <AnimateOnScroll preset="fadeLeft">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Our services</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
                {SERVICES_OVERVIEW.title}
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">{SERVICES_OVERVIEW.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700">Request a Demo</Link>
                <Link to="/contact" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-brand-300">Talk to a Travel Expert</Link>
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll preset="fadeRight">
            <div className="relative">
              <Img src="airportLounge" alt="Corporate travel services" className="h-80 rounded-3xl shadow-lift" />
              <Card className="absolute -bottom-6 -left-6 hidden max-w-56 shadow-lift sm:block">
                <CardContent className="p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Plane className="size-4 text-brand-600" /> 8 Core Services</p>
                  <p className="mt-1 text-xs text-slate-500">Flights, hotels, transfers, insurance, visa, MICE, meet & greet, VIP charter.</p>
                </CardContent>
              </Card>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Service overview grid */}
        <OverviewGrid />

        {/* Each service detail */}
        {SERVICE_SECTIONS.map((svc, i) => (
          <ServiceDetail key={svc.id} service={svc} index={i} />
        ))}

        {/* How it works */}
        <HowItWorksSection />

        {/* FAQs */}
        <div>
          <AnimateOnScroll preset="fadeUp">
            <p className="text-xs font-bold uppercase tracking-widest text-sun-600">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          </AnimateOnScroll>
          <div className="mx-auto mt-6 max-w-2xl">
            <Accordion type="single" collapsible className="space-y-3">
              {SERVICES_FAQS.map((faq, i) => (
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
                <h2 className="font-display text-2xl font-semibold">Ready to Simplify Business Travel?</h2>
                <p className="mt-1 text-sm text-brand-100">From the first booking to the final expense report, we help businesses manage travel with greater visibility and control.</p>
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
