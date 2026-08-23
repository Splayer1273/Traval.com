import { Link } from 'react-router-dom'
import { TrendingUp, ClipboardList, Wallet, Users, CheckCircle2, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Badge } from '../components/ui/badge.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'
import { AnimateOnScroll, StaggerContainer, StaggerItem, TiltCard } from '../components/animations/index.js'
import { SOLUTIONS_HERO, ROLE_SOLUTIONS, ENTERPRISE_FLOW } from '../data/solutionsPage.js'
import { SOLUTIONS_FAQS } from '../data/pageFaqs.js'
import { cn } from '../lib/utils.js'

function RoleSection({ role, index }) {
  const isEven = index % 2 === 0
  return (
    <AnimateOnScroll preset={isEven ? 'fadeLeft' : 'fadeRight'} delay={index * 0.05}>
      <div id={role.id} className="grid items-center gap-8 lg:grid-cols-2">
        <div className={cn(!isEven && 'lg:order-2')}>
          <Badge className="mb-3 bg-sun-100 text-sun-700 ring-0">{role.badge}</Badge>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{role.title}</h2>
          <p className="mt-4 leading-relaxed text-slate-600">{role.description}</p>

          {role.highlight && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-brand-50 to-sun-50 p-4">
              <p className="text-sm font-semibold text-brand-700">{role.highlight}</p>
            </div>
          )}

          {role.workflow && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {role.workflow.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-bold text-brand-700">{step}</span>
                  {i < role.workflow.length - 1 && <ChevronRight className="size-3 text-slate-400" />}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700">Request a Demo</Link>
            <Link to="/contact" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-brand-300">Talk to Our Team</Link>
          </div>
        </div>

        <div className={cn(!isEven && 'lg:order-1')}>
          {role.image && (
            <div className="relative mb-6">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Img src={role.image} alt={role.title} className="h-64 rounded-3xl shadow-lift sm:h-72" />
              </motion.div>
            </div>
          )}
          <Card className="h-full">
            <CardContent className="p-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">
                {role.dashboard ? 'Leadership Dashboard' : role.workflow ? 'Employee Journey' : 'Key Benefits'}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {(role.dashboard || role.benefits).map((b) => (
                  <div key={b} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    {b}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimateOnScroll>
  )
}

function EnterpriseFlowSection() {
  return (
    <div>
      <AnimateOnScroll preset="fadeUp">
        <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Enterprise</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{ENTERPRISE_FLOW.title}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-600">{ENTERPRISE_FLOW.description}</p>
      </AnimateOnScroll>
      <AnimateOnScroll preset="fadeUp" delay={0.2}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {ENTERPRISE_FLOW.steps.map((step, i) => (
            <motion.span
              key={step}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <span className="rounded-xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-lift">{step}</span>
              {i < ENTERPRISE_FLOW.steps.length - 1 && <ChevronRight className="size-5 text-brand-400" />}
            </motion.span>
          ))}
        </div>
      </AnimateOnScroll>
    </div>
  )
}

export default function Solutions() {
  return (
    <div>
      <PageHero image="corporateTeam" title={SOLUTIONS_HERO.title} subtitle={SOLUTIONS_HERO.subtitle} crumb={[{ label: 'Solutions' }]} />

      <div className="container-x mt-10 space-y-14">
        {/* Intro */}
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <AnimateOnScroll preset="fadeLeft">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Role-based</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
                Travel Solutions for Every Role
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">{SOLUTIONS_HERO.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700">Request a Demo</Link>
                <Link to="/contact" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-brand-300">Talk to Our Team</Link>
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll preset="fadeRight">
            <div className="relative">
              <Img src="businessMeeting" alt="Corporate travel solutions" className="h-80 rounded-3xl shadow-lift" />
              <Card className="absolute -bottom-6 -left-6 hidden max-w-56 shadow-lift sm:block">
                <CardContent className="p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Users className="size-4 text-brand-600" /> 4 Role Solutions</p>
                  <p className="mt-1 text-xs text-slate-500">Leaders, coordinators, finance teams and employees.</p>
                </CardContent>
              </Card>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Role sections */}
        {ROLE_SOLUTIONS.map((role, i) => (
          <RoleSection key={role.id} role={role} index={i} />
        ))}

        {/* Enterprise flow */}
        <EnterpriseFlowSection />

        {/* FAQs */}
        <div>
          <AnimateOnScroll preset="fadeUp">
            <p className="text-xs font-bold uppercase tracking-widest text-sun-600">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          </AnimateOnScroll>
          <div className="mx-auto mt-6 max-w-2xl">
            <Accordion type="single" collapsible className="space-y-3">
              {SOLUTIONS_FAQS.map((faq, i) => (
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
                <h2 className="font-display text-2xl font-semibold">Ready to Simplify Corporate Travel?</h2>
                <p className="mt-1 text-sm text-brand-100">Your business moves. We make the journey easier.</p>
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
