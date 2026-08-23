import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Globe, Shield, Headphones, TrendingUp, Users, Zap, Target, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHero from '../components/PageHero.jsx'
import Img from '../components/Img.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'
import { AnimateOnScroll, StaggerContainer, StaggerItem, TiltCard } from '../components/animations/index.js'
import { WHY_US_HERO, VALUE_PROPOSITIONS, WHY_CHOOSE_LIST, LEADERSHIP } from '../data/whyUsPage.js'
import { WHY_US_FAQS } from '../data/pageFaqs.js'

function ValuePropsGrid() {
  return (
    <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
      {VALUE_PROPOSITIONS.map((vp) => (
        <StaggerItem key={vp.title}>
          <TiltCard maxTilt={5} scale={1.02}>
            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
              <CardContent className="p-5">
                <motion.span
                  className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <vp.icon className="size-5" />
                </motion.span>
                <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{vp.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{vp.description}</p>
                {vp.capabilities && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {vp.capabilities.map((c) => (
                      <motion.span
                        key={c}
                        className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                        whileHover={{ scale: 1.05 }}
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TiltCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}

function WhyChooseGrid() {
  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
      {WHY_CHOOSE_LIST.map((item) => (
        <StaggerItem key={item.number}>
          <TiltCard maxTilt={4} scale={1.02}>
            <div className="rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-center text-white shadow-lift transition-all hover:-translate-y-1">
              <motion.span
                className="mx-auto flex size-10 items-center justify-center rounded-full bg-white/20 font-display text-lg font-bold"
                whileHover={{ scale: 1.2 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {item.number}
              </motion.span>
              <p className="mt-3 text-sm font-semibold">{item.title}</p>
            </div>
          </TiltCard>
        </StaggerItem>
      ))}
    </StaggerContainer>
  )
}

const FOUNDER_IMAGE = 'https://akbarbizvoy.com/image/new-images/founder.webp'
const CEO_IMAGE = 'https://akbarbizvoy.com/image/new-images/chairman.webp'

function LeaderImage({ src, alt, ringColor }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`mx-auto size-32 overflow-hidden rounded-full ring-4 ${ringColor} shadow-lg`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          className="size-full object-cover object-top"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white">
          {alt.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
      )}
    </div>
  )
}

function LeadershipSection() {
  return (
    <div>
      <AnimateOnScroll preset="fadeUp">
        <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Leadership</p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">{LEADERSHIP.title}</h2>
      </AnimateOnScroll>
      <StaggerContainer className="mt-6 grid gap-6 sm:grid-cols-2" staggerDelay={0.15}>
        <StaggerItem>
          <TiltCard maxTilt={3} scale={1.01}>
            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
              <CardContent className="p-6 text-center">
                <LeaderImage
                  src={FOUNDER_IMAGE}
                  alt={LEADERSHIP.founder.name}
                  ringColor="ring-brand-500"
                />
                <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-brand-400">{LEADERSHIP.founder.role}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-slate-900">{LEADERSHIP.founder.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{LEADERSHIP.founder.organization}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{LEADERSHIP.founder.description}</p>
              </CardContent>
            </Card>
          </TiltCard>
        </StaggerItem>
        <StaggerItem>
          <TiltCard maxTilt={3} scale={1.01}>
            <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
              <CardContent className="p-6 text-center">
                <LeaderImage
                  src={CEO_IMAGE}
                  alt={LEADERSHIP.ceo.name}
                  ringColor="ring-sun-500"
                />
                <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-sun-400">{LEADERSHIP.ceo.role}</p>
                <h3 className="mt-1 font-display text-xl font-semibold text-slate-900">{LEADERSHIP.ceo.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{LEADERSHIP.ceo.organization}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{LEADERSHIP.ceo.description}</p>
              </CardContent>
            </Card>
          </TiltCard>
        </StaggerItem>
      </StaggerContainer>
    </div>
  )
}

export default function WhyUs() {
  return (
    <div>
      <PageHero image="globeNetwork" title={WHY_US_HERO.title} subtitle={WHY_US_HERO.subtitle} crumb={[{ label: 'Why Us' }]} />

      <div className="container-x mt-10 space-y-14">
        {/* Intro */}
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <AnimateOnScroll preset="fadeLeft">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sun-600">Why Akbar Bizvoy</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">
                Why Businesses Choose Akbar Bizvoy
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">{WHY_US_HERO.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {WHY_US_HERO.impacts.map((item) => (
                  <motion.span
                    key={item}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/register" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:bg-brand-700">Request a Demo</Link>
                <Link to="/contact" className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:border-brand-300">Talk to Our Team</Link>
              </div>
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll preset="fadeRight">
            <div className="relative">
              <Img src="corporateTeam" alt="Corporate travel partner" className="h-80 rounded-3xl shadow-lift" />
              <Card className="absolute -bottom-6 -left-6 hidden max-w-56 shadow-lift sm:block">
                <CardContent className="p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Award className="size-4 text-brand-600" /> 45+ Years</p>
                  <p className="mt-1 text-xs text-slate-500">Decades of travel industry experience and global reach.</p>
                </CardContent>
              </Card>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Value propositions */}
        <ValuePropsGrid />

        {/* Why choose grid */}
        <WhyChooseGrid />

        {/* Leadership */}
        <LeadershipSection />

        {/* FAQs */}
        <div>
          <AnimateOnScroll preset="fadeUp">
            <p className="text-xs font-bold uppercase tracking-widest text-sun-600">FAQ</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900">Frequently Asked Questions</h2>
          </AnimateOnScroll>
          <div className="mx-auto mt-6 max-w-2xl">
            <Accordion type="single" collapsible className="space-y-3">
              {WHY_US_FAQS.map((faq, i) => (
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
                <h2 className="font-display text-2xl font-semibold">Ready to Simplify Your Corporate Travel?</h2>
                <p className="mt-1 text-sm text-brand-100">Your business moves. We make the journey easier.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 transition-all hover:bg-brand-50">Request a Corporate Demo</Link>
                <Link to="/contact" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-white/20">Talk to a Travel Expert</Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  )
}
