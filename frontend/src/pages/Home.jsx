import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
  ArrowRight, Banknote, Briefcase, Building2, CalendarDays, CheckCircle2, ClipboardList,
  Clock, Hotel, MapPin, Plane, Receipt, ShieldCheck, Sparkles, Users, Wallet, XCircle,
  Star, Globe, Zap, TrendingUp, Award, Headphones, Smartphone, CreditCard, PieChart,
  Route, Luggage, Search, Settings, Target, BadgeCheck, ThumbsUp, Handshake, Crown,
  FileCheck, Car, Map, BarChart3, ChevronRight,
} from 'lucide-react'
import { Badge } from '../components/ui/badge.jsx'
import { Button } from '../components/ui/button.jsx'
import { Card, CardContent } from '../components/ui/card.jsx'
import { Skeleton } from '../components/ui/skeleton.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select.jsx'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion.jsx'
import { Price } from '../components/Price.jsx'
import { corporateApi, computeStats } from '../services/corporateApi.js'
import { AIRPORTS } from '../data/airports.js'
import { requestStatusMeta, claimStatusMeta } from '../data/corporate.js'
import {
  CHALLENGES, SOLUTION_STEPS, TRUST_STATS, SERVICES, PLATFORM_FEATURES,
  HOW_IT_WORKS, TEAM_SOLUTIONS, GLOBAL_STATS, WHY_CHOOSE, TESTIMONIALS,
  LANDING_FAQS,
} from '../data/landingPage.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate, todayISO } from '../utils/format.js'
import { cn } from '../lib/utils.js'
import { AnimateOnScroll, StaggerContainer, StaggerItem, AnimatedCounter, ParallaxBackground, TiltCard, MagneticButton } from '../components/animations/index.js'
import Img from '../components/Img.jsx'
import {
  CinematicBreak, DualPanelBreak, TrioBreak, QuadStripBreak,
  AsymmetricGridBreak, ParallaxBreak, EditorialBreak, BREAK_IMAGES,
} from '../components/ContentImageBreak.jsx'
import {
  HeroBg, ChallengeBg, SolutionBg, TrustBg, ServicesBg,
  PlatformBg, HowItWorksBg, SolutionsBg, GlobalNetworkBg,
  WhyChooseBg, TestimonialsBg, MobileBg, FaqBg, FinalCtaBg,
} from '../components/LandingBackground.jsx'
import {
  HeroCinematicBg, GlobalCinematicBg, CtaCinematicBg,
  ServicesCinematicBg, TrustCinematicBg, PlatformCinematicBg,
  SolutionsCinematicBg, HowItWorksCinematicBg,
} from '../components/CinematicBackground.jsx'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ── Floating animated particles for hero ── */
function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute size-1 rounded-full bg-white/20"
          initial={{ x: Math.random() * 1200, y: Math.random() * 600, opacity: 0 }}
          animate={{
            y: [Math.random() * 600, Math.random() * 600],
            opacity: [0, 0.6, 0],
          }}
          transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

/* ── Animated route lines for hero globe feel ── */
function AnimatedRoutes() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1200 600" fill="none">
      <motion.path
        d="M100,400 Q300,100 600,300 T1100,200"
        stroke="url(#route-gradient)"
        strokeWidth="1.5"
        strokeDasharray="8 6"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.4 }}
        transition={{ duration: 3, delay: 1, ease: 'easeInOut' }}
      />
      <motion.path
        d="M200,500 Q500,150 800,350 T1150,350"
        stroke="url(#route-gradient)"
        strokeWidth="1"
        strokeDasharray="4 8"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.25 }}
        transition={{ duration: 3.5, delay: 1.5, ease: 'easeInOut' }}
      />
      {/* Glowing dots at key points */}
      {[
        { cx: 600, cy: 300 },
        { cx: 300, cy: 200 },
        { cx: 900, cy: 250 },
      ].map((pt, i) => (
        <motion.circle
          key={i}
          cx={pt.cx}
          cy={pt.cy}
          r="4"
          fill="#3b5bff"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
          transition={{ duration: 2, delay: 2 + i * 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      ))}
      <defs>
        <linearGradient id="route-gradient" x1="0" y1="0" x2="1200" y2="0">
          <stop offset="0%" stopColor="#3b5bff" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3b5bff" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ── Animated stat number ── */
function AnimatedStatNumber({ value, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const numericPart = value.replace(/[^0-9]/g, '')
  const suffix = value.replace(/[0-9]/g, '')
  const [displayed, setDisplayed] = useState('0')

  useEffect(() => {
    if (!isInView || !numericPart) return
    const target = parseInt(numericPart, 10)
    if (isNaN(target)) { setDisplayed(value); return }
    let current = 0
    const step = Math.max(1, Math.floor(target / 40))
    const timer = setInterval(() => {
      current = Math.min(current + step, target)
      setDisplayed(String(current))
      if (current >= target) clearInterval(timer)
    }, 35)
    return () => clearInterval(timer)
  }, [isInView, numericPart, value])

  return <span ref={ref} className={className}>{displayed}{suffix}</span>
}

/* ======================================== Guest Landing ======================================== */

function GuestLanding() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  return (
    <div>
      {/* ════════════════════════════════ HERO ════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[680px] overflow-hidden bg-slate-950">
        <HeroCinematicBg />

        {/* Animated route lines */}
        <AnimatedRoutes />

        {/* Floating particles */}
        <FloatingParticles />

        {/* Hero content with parallax */}
        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="container-x relative flex min-h-[680px] flex-col justify-center py-20">
          <div className="mx-auto w-full max-w-4xl text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-200 backdrop-blur-sm">
                <Globe className="size-3.5" /> Premium Corporate Travel Platform
              </span>
            </motion.div>

            <motion.h1
              className="font-display text-4xl font-semibold leading-[1.15] sm:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              Business Travel,<br />
              <span className="bg-gradient-to-r from-brand-400 via-brand-300 to-sun-400 bg-clip-text text-transparent">Managed Smarter.</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            >
              One connected platform for booking, approvals, expenses and end-to-end corporate travel management.
            </motion.p>

            <motion.p
              className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
            >
              Akbar Bizvoy helps businesses simplify the way they plan, manage and control corporate travel. From flights and accommodation to visas, transportation, MICE and travel expenses, we bring essential business travel services together with technology and professional support.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease: 'easeOut' }}
            >
              <MagneticButton
                onClick={() => navigate('/register')}
                className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-7 text-sm font-bold text-white shadow-glow transition-all hover:from-brand-600 hover:to-brand-700"
              >
                Request a Demo
              </MagneticButton>
              <MagneticButton
                onClick={() => navigate('/about')}
                className="flex h-12 items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/10"
              >
                Explore Solutions <ArrowRight className="size-4" />
              </MagneticButton>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-400" /> 45+ years of travel experience</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-400" /> 300+ offices worldwide</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-3.5 text-emerald-400" /> 100+ countries</span>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Scroll to explore</span>
              <div className="flex h-8 w-5 items-start justify-center rounded-full border border-slate-600 p-1">
                <motion.div
                  className="size-1.5 rounded-full bg-brand-400"
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Image Break: Cinematic airport panorama ─── */}
      <CinematicBreak
        images={BREAK_IMAGES.heroBreak}
        caption="Akbar Bizvoy — Where Business Meets the World"
        captionSub="Premium corporate travel, powered by 45+ years of expertise"
      />

      {/* ════════════════════════════ CHALLENGE ════════════════════════════ */}
      <section className="relative overflow-hidden py-20">
        <ChallengeBg />
        <div className="container-x relative">
        <AnimateOnScroll preset="fadeUp">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">The Problem</span>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Corporate Travel Shouldn't Be Complicated
            </h2>
            <p className="mt-4 text-base text-slate-500">
              Managing business travel across employees, departments and destinations can involve multiple bookings, approval processes, travel policies, expenses and service providers. Akbar Bizvoy brings these activities together.
            </p>
          </div>
        </AnimateOnScroll>
        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {CHALLENGES.map((c) => (
            <StaggerItem key={c.title}>
              <TiltCard maxTilt={4} scale={1.015}>
                <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                  <CardContent className="p-6">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-sun-50 text-brand-600">
                      <c.icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-display text-base font-semibold text-slate-900">{c.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{c.text}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
        </div>
      </section>

      {/* ─── Image Break: Corporate workspace duality ─── */}
      <DualPanelBreak
        images={BREAK_IMAGES.challengeBreak}
        captions={['Modern business workspace', 'Strategic planning & coordination']}
      />

      {/* ════════════════════════════ SOLUTION ════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 py-20">
        <SolutionBg />
        <div className="container-x relative">
          <AnimateOnScroll preset="fadeUp">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">The Solution</span>
              <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                One Travel Ecosystem. From Planning to Expense.
              </h2>
              <p className="mt-4 text-base text-slate-500">
                Akbar Bizvoy combines corporate travel services, technology and professional travel support into one connected solution.
              </p>
            </div>
          </AnimateOnScroll>
          <StaggerContainer className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" staggerDelay={0.1}>
            {SOLUTION_STEPS.map((s, i) => (
              <StaggerItem key={s.label}>
                <div className="relative">
                  <TiltCard maxTilt={5} scale={1.02}>
                    <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                      <CardContent className="flex flex-col items-center p-6 text-center">
                        <motion.span
                          className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <s.icon className="size-6" />
                        </motion.span>
                        <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-brand-400">Step {i + 1}</p>
                        <h3 className="mt-1 font-display text-lg font-semibold text-slate-900">{s.label}</h3>
                        <p className="mt-2 text-sm text-slate-500">{s.description}</p>
                      </CardContent>
                    </Card>
                  </TiltCard>
                  {i < SOLUTION_STEPS.length - 1 && (
                    <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 text-slate-300 lg:block">
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                        <ArrowRight className="size-5" />
                      </motion.div>
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <div className="mt-12 text-center">
            <MagneticButton
              onClick={() => document.getElementById('platform')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-sm font-bold text-slate-700 shadow-soft transition-all hover:border-brand-300 hover:shadow-lift"
            >
              See How It Works <ArrowRight className="size-4" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ─── Image Break: Tech platform editorial ─── */}
      <EditorialBreak
        src={BREAK_IMAGES.solutionBreak}
        alt="Data analytics dashboard"
        caption="Technology that transforms how your business travels"
        captionDetail="From smart booking to real-time analytics, our platform gives finance leaders, travel coordinators and employees the visibility and control they need — all in one place."
      />

      {/* ════════════════════════════ TRUST STATS ════════════════════════════ */}
      <section className="relative overflow-hidden py-20">
        <TrustCinematicBg />
        <div className="container-x relative">
        <AnimateOnScroll preset="fadeUp">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">Our Track Record</span>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Built on Experience. Designed for Modern Business.
            </h2>
          </div>
        </AnimateOnScroll>
        <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4" staggerDelay={0.12}>
          {TRUST_STATS.map((s) => (
            <StaggerItem key={s.label}>
              <TiltCard maxTilt={3} scale={1.02}>
                <Card className="text-center transition-all hover:-translate-y-1 hover:shadow-lift">
                  <CardContent className="p-7">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
                      <AnimatedStatNumber value={s.value} className="font-display text-2xl font-bold" />
                    </div>
                    <p className="mt-4 text-sm font-medium text-slate-600">{s.label}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <AnimateOnScroll preset="fadeUp" delay={0.3}>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-slate-500">
            Akbar Bizvoy combines decades of travel expertise with modern technology to help businesses manage corporate travel more efficiently.
          </p>
        </AnimateOnScroll>
        </div>
      </section>

      {/* ─── Image Break: Airport terminal panorama ─── */}
      <CinematicBreak
        images={BREAK_IMAGES.trustBreak}
        height='h-[250px] sm:h-[320px] lg:h-[380px]'
        caption="Trusted by businesses across 100+ countries"
      />

      {/* ════════════════════════════ SERVICES ════════════════════════════ */}
      <section id="services" className="relative overflow-hidden bg-slate-50 py-20">
        <ServicesCinematicBg />
        <div className="container-x relative">
          <AnimateOnScroll preset="fadeUp">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">Complete Solutions</span>
              <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Everything Your Business Needs to Travel
              </h2>
              <p className="mt-4 text-base text-slate-500">
                From routine employee travel to executive journeys, international meetings and corporate events.
              </p>
            </div>
          </AnimateOnScroll>
          <div className="mt-12 space-y-5">
            {SERVICES.map((svc, i) => (
              <AnimateOnScroll key={svc.id} preset="fadeUp" delay={i * 0.06}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-lift">
                    <CardContent className="p-0">
                      <div className="flex flex-col lg:flex-row">
                        <div className="flex items-center gap-4 border-b border-slate-100 bg-gradient-to-r from-brand-50/80 to-transparent p-6 lg:w-80 lg:border-b-0 lg:border-r lg:shrink-0">
                          <motion.span
                            className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow"
                            whileHover={{ scale: 1.1, rotate: -5 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                          >
                            <svc.icon className="size-6" />
                          </motion.span>
                          <div>
                            <h3 className="font-display text-lg font-semibold text-slate-900">{svc.title}</h3>
                            {svc.badge && <Badge className="mt-1 bg-sun-100 text-sun-700 ring-0">{svc.badge}</Badge>}
                          </div>
                        </div>
                        <div className="flex-1 p-6">
                          <p className="text-sm text-slate-500">{svc.description}</p>
                          {svc.items.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {svc.items.map((item) => (
                                <motion.span
                                  key={item}
                                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {item}
                                </motion.span>
                              ))}
                            </div>
                          )}
                          {svc.extra && (
                            <p className="mt-3 text-xs text-slate-400">
                              <span className="font-semibold text-slate-500">{svc.extra.label}:</span> {svc.extra.value}
                            </p>
                          )}
                          <div className="mt-4">
                            <Button variant="secondary" size="sm" asChild>
                              <Link to={svc.link}>{svc.cta} <ArrowRight className="size-3.5" /></Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Image Break: Luxury hotel parallax ─── */}
      <ParallaxBreak
        src={BREAK_IMAGES.servicesBreak}
        alt="Luxury hotel infinity pool at sunset"
        quote="Travel is the only thing you buy that makes you richer."
        author="— Corporate Travel Philosophy"
      />

      {/* ════════════════════════════ PLATFORM ════════════════════════════ */}
      <section id="platform" className="relative overflow-hidden py-20">
        <PlatformCinematicBg />
        <div className="container-x relative">
        <AnimateOnScroll preset="fadeUp">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">Technology</span>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Technology That Puts Your Business in Control
            </h2>
            <p className="mt-4 text-base text-slate-500">
              Akbar Bizvoy combines travel services with technology to simplify the complete corporate travel lifecycle.
            </p>
          </div>
        </AnimateOnScroll>
        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.08}>
          {PLATFORM_FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <TiltCard maxTilt={5} scale={1.02}>
                <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                  <CardContent className="p-6">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-sun-50 text-brand-600">
                      <f.icon className="size-5" />
                    </span>
                    <h3 className="mt-3 font-display text-base font-semibold text-slate-900">{f.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{f.text}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
        </div>
      </section>

      {/* ─── Image Break: Tech & analytics trio ─── */}
      <AsymmetricGridBreak images={BREAK_IMAGES.platformBreak} />

      {/* ════════════════════════════ HOW IT WORKS ════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 py-20">
        <HowItWorksCinematicBg />
        <div className="container-x relative">
          <AnimateOnScroll preset="fadeUp">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">Process</span>
              <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                From Trip Request to Final Expense
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="relative mx-auto mt-12 max-w-3xl">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-300 via-brand-400 to-brand-300 lg:left-1/2" />
            <div className="space-y-8">
              {HOW_IT_WORKS.map((step, i) => {
                const isLeft = i % 2 === 0
                return (
                  <AnimateOnScroll key={step.step} preset={isLeft ? 'fadeLeft' : 'fadeRight'} delay={i * 0.1}>
                    <div className={cn('relative flex items-start gap-6', isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse')}>
                      <motion.div
                        className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-glow lg:absolute lg:left-1/2 lg:-translate-x-1/2"
                        whileHover={{ scale: 1.2 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        {step.step}
                      </motion.div>
                      <div className={cn('ml-4 flex-1 lg:ml-0', isLeft ? 'lg:pr-12 lg:text-right' : 'lg:pl-12')}>
                        <Card className={cn('inline-block transition-all hover:-translate-y-1 hover:shadow-lift', isLeft ? 'lg:ml-auto' : '')}>
                          <CardContent className="p-5">
                            <h3 className="font-display text-lg font-semibold text-slate-900">{step.title}</h3>
                            <p className="mt-1.5 text-sm text-slate-500">{step.text}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </AnimateOnScroll>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Image Break: Travel journey editorial ─── */}
      <EditorialBreak
        src={BREAK_IMAGES.howItWorksBreak}
        alt="Scenic travel journey"
        caption="From trip request to final expense — one connected flow"
        captionDetail="Every step of the corporate travel process is simplified. Search, select, approve, travel, submit and analyze — all from a single platform designed for how modern businesses work."
        reverse
      />

      {/* ════════════════════════════ SOLUTIONS ════════════════════════════ */}
      <section id="solutions" className="relative overflow-hidden py-20">
        <SolutionsCinematicBg />
        <div className="container-x relative">
        <AnimateOnScroll preset="fadeUp">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">For Every Role</span>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              One Platform. Different Needs.
            </h2>
          </div>
        </AnimateOnScroll>
        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
          {TEAM_SOLUTIONS.map((t) => (
            <StaggerItem key={t.title}>
              <TiltCard maxTilt={4} scale={1.02}>
                <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                  <CardContent className="p-6">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-sun-50 text-brand-600">
                      <t.icon className="size-5" />
                    </span>
                    <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-brand-400">{t.title}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-slate-900">{t.heading}</h3>
                    <ul className="mt-3 space-y-1.5">
                      {t.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" /> {b}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
        </div>
      </section>

      {/* ─── Image Break: Team collaboration quad ─── */}
      <QuadStripBreak images={BREAK_IMAGES.solutionsBreak} />

      {/* ════════════════════════════ GLOBAL NETWORK ════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 py-20">
        <GlobalCinematicBg />
        <div className="container-x relative">
          <AnimateOnScroll preset="fadeUp">
            <h2 className="text-center font-display text-3xl font-semibold text-white sm:text-4xl">
              Wherever Business Takes You, We're Ready.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-brand-100">
              With more than 300 Akbar Travels offices worldwide, Akbar Bizvoy combines a global travel network with centralized corporate travel management.
            </p>
          </AnimateOnScroll>
          <StaggerContainer className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4" staggerDelay={0.12}>
            {GLOBAL_STATS.map((s) => (
              <StaggerItem key={s.label}>
                <motion.div
                  className="rounded-2xl bg-white/10 p-7 text-center backdrop-blur-sm"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <AnimatedStatNumber value={s.value} className="font-display text-4xl font-bold text-white" />
                  <p className="mt-2 text-sm font-medium text-brand-200">{s.label}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Image Break: Paris cityscape parallax ─── */}
      <ParallaxBreak
        src={BREAK_IMAGES.globalBreak}
        alt="Paris Eiffel Tower cityscape at dusk"
        quote="Wherever business takes you, we're already there."
        height='h-[300px] sm:h-[380px] lg:h-[440px]'
      />

      {/* ════════════════════════════ WHY CHOOSE ════════════════════════════ */}
      <section id="why-us" className="relative overflow-hidden py-20">
        <WhyChooseBg />
        <div className="container-x relative">
        <AnimateOnScroll preset="fadeUp">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">Why Us</span>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              More Than a Travel Provider. A Corporate Travel Partner.
            </h2>
          </div>
        </AnimateOnScroll>
        <StaggerContainer className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {WHY_CHOOSE.map((w) => (
            <StaggerItem key={w.title}>
              <TiltCard maxTilt={4} scale={1.015}>
                <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                  <CardContent className="flex items-start gap-4 p-5">
                    <motion.span
                      className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-sun-50 text-brand-600"
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <w.icon className="size-5" />
                    </motion.span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-slate-900">{w.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{w.text}</p>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
        </div>
      </section>

      {/* ─── Image Break: Premium travel detail strip ─── */}
      <QuadStripBreak images={BREAK_IMAGES.whyUsBreak} />

      {/* ════════════════════════════ TESTIMONIALS ════════════════════════════ */}
      <section className="relative overflow-hidden bg-slate-50 py-20">
        <TestimonialsBg />
        <div className="container-x relative">
          <AnimateOnScroll preset="fadeUp">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">Testimonials</span>
              <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Trusted by Business Travelers
              </h2>
            </div>
          </AnimateOnScroll>
          <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2" staggerDelay={0.12}>
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.name}>
                <TiltCard maxTilt={3} scale={1.01}>
                  <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-lift">
                    <CardContent className="p-6">
                      <div className="mb-3 flex gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * i }}>
                            <Star className="size-4 fill-sun-400 text-sun-400" />
                          </motion.div>
                        ))}
                      </div>
                      <blockquote className="text-sm leading-relaxed text-slate-600 italic">
                        "{t.quote}"
                      </blockquote>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                          {t.name[0]}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{t.name}</p>
                          <p className="text-xs text-slate-500">{t.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Image Break: Hotel lobby parallax ─── */}
      <CinematicBreak
        images={BREAK_IMAGES.testimonialsBreak}
        height='h-[250px] sm:h-[300px] lg:h-[360px]'
        caption="Premium hotel partnerships for discerning business travelers"
      />

      {/* ════════════════════════════ MOBILE ════════════════════════════ */}
      <section className="relative overflow-hidden py-20">
        <MobileBg />
        <div className="container-x relative">
        <AnimateOnScroll preset="scaleUp">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">Mobile</span>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Your Business Travel, Always Within Reach
            </h2>
            <p className="mt-4 text-base text-slate-500">
              Stay connected with your corporate travel wherever you are. Access travel information, manage bookings on the go.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" variant="secondary" onClick={() => window.open('#', '_blank')}>
                <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302a1 1 0 010 1.38l-2.302 2.302L15.394 13l2.304-3.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" /></svg>
                Download on Google Play
              </Button>
              <Button size="lg" variant="secondary" onClick={() => window.open('#', '_blank')}>
                <svg className="mr-2 size-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" /></svg>
                Download on the App Store
              </Button>
            </div>
          </div>
        </AnimateOnScroll>
        </div>
      </section>

      {/* ════════════════════════════ FAQ ════════════════════════════ */}
      <section id="faq" className="relative overflow-hidden bg-slate-50 py-20">
        <FaqBg />
        <div className="container-x relative">
          <AnimateOnScroll preset="fadeUp">
            <div className="mx-auto max-w-3xl text-center">
              <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-600">FAQ</span>
              <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
          </AnimateOnScroll>
          <div className="mx-auto mt-12 max-w-2xl">
            <Accordion type="single" collapsible className="space-y-3">
              {LANDING_FAQS.map((faq, i) => (
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
            <div className="mt-8 text-center">
              <Link to="/faq" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-soft transition-all hover:border-brand-300 hover:shadow-lift">
                View All FAQs <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Image Break: Dubai skyline parallax before CTA ─── */}
      <ParallaxBreak
        src={BREAK_IMAGES.finalCtaBreak}
        alt="Dubai skyline at golden hour"
        quote="Your business deserves smarter travel management."
        author="— AkbarBizvoy"
        height='h-[300px] sm:h-[380px] lg:h-[440px]'
      />

      {/* ════════════════════════════ FINAL CTA ════════════════════════════ */}
      <section className="container-x py-20">
        <AnimateOnScroll preset="scaleUp">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600 p-8 shadow-lift sm:p-14">
            <CtaCinematicBg />

            <div className="relative mx-auto max-w-2xl text-center text-white">
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                Ready to Simplify Business Travel?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-100">
                Give your employees an easier way to travel while giving your business greater control over bookings, policies, expenses and travel spending.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <MagneticButton
                  onClick={() => navigate('/register')}
                  className="flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-bold text-brand-700 shadow-lg transition-all hover:bg-brand-50"
                >
                  Request a Demo
                </MagneticButton>
                <MagneticButton
                  onClick={() => navigate('/contact')}
                  className="flex h-12 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  Talk to Our Travel Team <ArrowRight className="size-4" />
                </MagneticButton>
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-sun-300">
                Travel smarter. Manage better. Move your business forward.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  )
}

/* ======================================== Dashboard Shell ======================================== */

function StatCard({ icon: Icon, label, value, sub, tone = 'text-brand-600' }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4 sm:p-5">
        <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50', tone)}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-900">{value}</p>
          <p className="truncate text-xs text-slate-500">{label}{sub ? ` · ${sub}` : ''}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function UpcomingTripCard({ req }) {
  if (!req) return null
  const meta = requestStatusMeta(req.status)
  return (
    <Link to={`/trips/${req.id}`} className="block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift">
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-brand-500 p-5 text-white">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-brand-200">Upcoming trip</p>
          <Badge className="bg-white/15 text-white ring-0">{meta.label}</Badge>
        </div>
        <p className="mt-2 flex items-center gap-2 font-display text-xl font-semibold">
          <MapPin className="size-4.5 text-sun-300" /> {req.from} → {req.destination}
        </p>
        <p className="mt-1 text-sm text-brand-100">{req.title}</p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 p-5 text-sm text-slate-500">
        <span className="flex items-center gap-1.5"><CalendarDays className="size-4 text-brand-600" /> {formatDate(req.startDate)} – {formatDate(req.endDate)}</span>
        <span className="flex items-center gap-1.5"><Briefcase className="size-4 text-brand-600" /> {req.purpose}</span>
        <span className="ml-auto flex items-center gap-1.5 font-semibold text-slate-800"><Price amount={req.estimatedCost} /></span>
      </div>
    </Link>
  )
}

function QuickActions() {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-900">
          <Sparkles className="size-4 text-brand-600" /> Quick actions
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link to="/flights" className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50/60">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft transition-transform group-hover:scale-105"><Plane className="size-5" /></span>
            <span className="text-xs font-bold text-slate-700">Book Flight</span>
          </Link>
          <Link to="/hotels" className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50/60">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft transition-transform group-hover:scale-105"><Hotel className="size-5" /></span>
            <span className="text-xs font-bold text-slate-700">Book Hotel</span>
          </Link>
          <Link to="/trips/new" className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50/60">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft transition-transform group-hover:scale-105"><Briefcase className="size-5" /></span>
            <span className="text-xs font-bold text-slate-700">Create Trip</span>
          </Link>
          <Link to="/claims" className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 text-center transition-all hover:border-brand-300 hover:bg-brand-50/60">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft transition-transform group-hover:scale-105"><Receipt className="size-5" /></span>
            <span className="text-xs font-bold text-slate-700">File Expense</span>
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" asChild><Link to="/my-trips">My Trips</Link></Button>
          <Button variant="secondary" size="sm" asChild><Link to="/my-trips?tab=pending">My Requests</Link></Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MyPolicyCard() {
  const { user, isAuthenticated, sessionChecked } = useAuth()
  const { data: policies } = useQuery({
    queryKey: ['corporate-policies'],
    queryFn: () => corporateApi.getPolicies(),
    staleTime: 60_000,
    enabled: isAuthenticated && sessionChecked,
  })
  const policy = policies?.find((p) => p.designation === user?.designation) || policies?.find((p) => p.grade === user?.grade)
  return (
    <Card>
      <CardContent className="p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900">
          <ShieldCheck className="size-4 text-emerald-600" /> My travel policy
        </p>
        <div className="space-y-2 rounded-2xl bg-slate-50 p-4 text-sm">
          <div className="flex justify-between"><span className="text-slate-500">Designation</span><span className="font-semibold text-slate-800">{user?.designation}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Travel grade</span><span className="font-semibold text-slate-800">Grade {user?.grade}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Flight class</span><span className="font-semibold text-slate-800">{policy?.flightClass || 'Economy'}</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Hotel</span><span className="font-semibold text-slate-800">Up to ₹{(policy?.hotelLimit || 5000).toLocaleString('en-IN')}/night · {policy?.hotelStars || 3}★</span></div>
          <div className="flex justify-between"><span className="text-slate-500">Daily allowance</span><span className="font-semibold text-slate-800">₹{(policy?.dailyAllowance || 1500).toLocaleString('en-IN')}/day</span></div>
        </div>
        <p className="mt-3 text-xs text-slate-400">Admin can update these limits in Travel Policies.</p>
      </CardContent>
    </Card>
  )
}

function RequestRow({ req }) {
  const meta = requestStatusMeta(req.status)
  return (
    <Link to={`/trips/${req.id}`} className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {req.status === 'pending' ? <Clock className="size-4" /> : req.status === 'approved' ? <CheckCircle2 className="size-4" /> : <Plane className="size-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-800">{req.title}</p>
        <p className="truncate text-xs text-slate-500">{req.from} → {req.destination} · {formatDate(req.startDate)}</p>
      </div>
      <Badge variant={meta.variant}>{meta.label}</Badge>
    </Link>
  )
}

function BusinessTripSearch() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ from: 'BOM', to: 'BLR', date: todayISO(14), returnDate: todayISO(17) })
  const toCity = AIRPORTS.find((a) => a.code === form.to)?.city || form.to
  return (
    <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-200 via-sun-200 to-brand-200 p-px shadow-lift">
      <div className="rounded-[15px] bg-white p-4 sm:p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800">
          <Briefcase className="size-4 text-brand-600" /> What are you travelling for?
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Select value={form.from} onValueChange={(v) => setForm({ ...form, from: v })}>
            <SelectTrigger className="bg-slate-50"><SelectValue placeholder="From" /></SelectTrigger>
            <SelectContent>{AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={form.to} onValueChange={(v) => setForm({ ...form, to: v })}>
            <SelectTrigger className="bg-slate-50"><SelectValue placeholder="To" /></SelectTrigger>
            <SelectContent>{AIRPORTS.map((a) => <SelectItem key={a.code} value={a.code}>{a.code} — {a.city}</SelectItem>)}</SelectContent>
          </Select>
          <input type="date" value={form.date} min={todayISO()} onChange={(e) => setForm({ ...form, date: e.target.value })} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800" />
          <input type="date" value={form.returnDate} min={form.date || todayISO()} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800" />
          <Button className="h-11" onClick={() => navigate(`/flights?trip=roundtrip&from=${form.from}&to=${form.to}&date=${form.date}&return=${form.returnDate}&cabin=Economy&corp=1`)}><Plane className="size-4" /> Flights</Button>
          <Button variant="secondary" className="h-11" onClick={() => navigate(`/hotels?destination=${toCity}&checkIn=${form.date}&checkOut=${form.returnDate}&corp=1`)}><Hotel className="size-4" /> Hotel</Button>
        </div>
      </div>
    </div>
  )
}

/* ======================================== Employee Dashboard ======================================== */

function EmployeeDashboard({ requests }) {
  const { user } = useAuth()
  const upcoming = requests
    .filter((r) => ['pending', 'approved', 'ticketed'].includes(r.status) && new Date(r.startDate) >= new Date(new Date().setHours(0, 0, 0, 0)))
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
  const pending = requests.filter((r) => r.status === 'pending')
  const recent = requests.filter((r) => ['completed', 'cancelled'].includes(r.status)).slice(0, 3)
  const stats = computeStats(requests)
  const approvedUpcoming = requests.filter((r) => ['approved', 'ticketed'].includes(r.status) && new Date(r.startDate) >= new Date())

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                <Building2 className="size-4 text-brand-600" /> AkbarBizvoy · {user?.department}
              </p>
              <h1 className="mt-1.5 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
                {greeting()}, {user?.firstName} 👋
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                What are you travelling for? Search flights, pick a policy-compliant hotel and submit your request for approval.
              </p>
            </div>
            <Button asChild><Link to="/trips/new"><Briefcase className="size-4" /> Create Business Trip</Link></Button>
          </div>
        </div>
      </div>
      <div className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Clock} label="Pending requests" value={pending.length} tone="text-amber-600" />
          <StatCard icon={CheckCircle2} label="Approved upcoming" value={approvedUpcoming.length} tone="text-emerald-600" />
          <StatCard icon={Wallet} label="My estimated spend" value={<Price amount={stats.totalSpend} />} tone="text-brand-600" />
          <StatCard icon={ShieldCheck} label="Policy compliance" value={`${stats.violations ? '⚠' : '100%'}`} sub={stats.violations ? `${stats.violations} exception${stats.violations > 1 ? 's' : ''}` : 'all compliant'} tone="text-slate-600" />
        </div>
        <BusinessTripSearch />
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <UpcomingTripCard req={upcoming[0]} />
            {pending.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Clock className="size-4 text-amber-600" /> Pending approval</p>
                    <Link to="/my-trips?tab=pending" className="text-xs font-semibold text-brand-700 hover:underline">View all</Link>
                  </div>
                  <div className="space-y-2">{pending.slice(0, 3).map((r) => <RequestRow key={r.id} req={r} />)}</div>
                </CardContent>
              </Card>
            )}
            {recent.length > 0 && (
              <Card>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Plane className="size-4 text-brand-600" /> Recent trips</p>
                    <Link to="/my-trips" className="text-xs font-semibold text-brand-700 hover:underline">View all</Link>
                  </div>
                  <div className="space-y-2">{recent.map((r) => <RequestRow key={r.id} req={r} />)}</div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="space-y-6"><QuickActions /><MyPolicyCard /></div>
        </div>
      </div>
    </div>
  )
}

/* ======================================== Approver Overview ======================================== */

function ApproverOverview({ requests }) {
  const pending = requests.filter((r) => r.status === 'pending')
  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <h1 className="font-display text-3xl font-semibold text-slate-900">Approver overview</h1>
          <p className="mt-2 text-sm text-slate-500">Review travel requests from your team, check policy compliance and approve or reject with context.</p>
        </div>
      </div>
      <div className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Clock} label="Awaiting review" value={pending.length} tone="text-amber-600" />
          <StatCard icon={CheckCircle2} label="Approved (all time)" value={requests.filter((r) => r.status === 'approved').length} tone="text-emerald-600" />
          <StatCard icon={XCircle} label="Rejected" value={requests.filter((r) => r.status === 'rejected').length} tone="text-rose-600" />
          <StatCard icon={Wallet} label="Pipeline value" value={<Price amount={requests.filter((r) => r.status === 'pending').reduce((s, r) => s + (r.estimatedCost || 0), 0)} />} tone="text-brand-600" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><ClipboardList className="size-4 text-brand-600" /> Requests awaiting your approval</p>
                <Link to="/approvals" className="text-xs font-semibold text-brand-700 hover:underline">Open approvals</Link>
              </div>
              <div className="space-y-2">
                {pending.length === 0 ? (
                  <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">All caught up — no pending requests.</p>
                ) : pending.map((r) => <RequestRow key={r.id} req={r} />)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Users className="size-4 text-brand-600" /> Team travel activity</p>
              <div className="space-y-2.5 text-sm">
                {requests.slice(0, 4).map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">{r.employee.name}</p>
                      <p className="truncate text-[11px] text-slate-500">{r.destination} · {formatDate(r.startDate)}</p>
                    </div>
                    <Badge variant={requestStatusMeta(r.status).variant}>{requestStatusMeta(r.status).label}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ======================================== Finance Overview ======================================== */

function FinanceOverview({ requests, claims }) {
  const list = claims || []
  const pending = list.filter((c) => c.status === 'pending')
  const pendingValue = pending.reduce((s, c) => s + c.amount, 0)
  const reimbursed = list.filter((c) => c.status === 'reimbursed')
  const approved = list.filter((c) => c.status === 'approved')
  const totalClaimed = list.filter((c) => c.status !== 'rejected').reduce((s, c) => s + c.amount, 0)
  const recentDecisions = [...list].filter((c) => c.status !== 'pending').slice(0, 5)

  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-semibold text-slate-900">Finance overview</h1>
              <p className="mt-2 text-sm text-slate-500">Employee expense claims across the company — review, approve and reimburse in one place.</p>
            </div>
            <Button asChild><Link to="/claims"><Receipt className="size-4" /> Open claims queue</Link></Button>
          </div>
        </div>
      </div>
      <div className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Clock} label="Pending claims" value={pending.length} tone="text-amber-600" />
          <StatCard icon={Banknote} label="Pending value" value={<Price amount={pendingValue} />} tone="text-brand-600" />
          <StatCard icon={CheckCircle2} label="Approved" value={approved.length + reimbursed.length} tone="text-emerald-600" />
          <StatCard icon={Wallet} label="Total claimed" value={<Price amount={totalClaimed} />} tone="text-slate-600" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Receipt className="size-4 text-brand-600" /> Claims awaiting review</p>
                <Link to="/claims" className="text-xs font-semibold text-brand-700 hover:underline">Open queue</Link>
              </div>
              {pending.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">All caught up — no pending claims.</p>
              ) : (
                <div className="space-y-2">
                  {pending.map((c) => (
                    <Link key={c.id} to="/claims" className="flex items-center gap-3 rounded-xl border border-slate-100 px-3.5 py-3 transition-colors hover:border-brand-200 hover:bg-brand-50/40">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><Receipt className="size-4" /></span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{c.employee?.name} · <Price amount={c.amount} /></p>
                        <p className="truncate text-xs text-slate-500">{c.category} · {c.tripTitle || c.destination || c.tripRef}</p>
                      </div>
                      <Badge variant="warning">Pending</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Banknote className="size-4 text-brand-600" /> Recent decisions</p>
              {recentDecisions.length === 0 ? (
                <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No decisions yet.</p>
              ) : (
                <div className="space-y-2.5 text-sm">
                  {recentDecisions.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-800">{c.employee?.name} · <Price amount={c.amount} /></p>
                        <p className="truncate text-[11px] text-slate-500">{c.category} · {c.tripRef || c.tripTitle}</p>
                      </div>
                      <Badge variant={claimStatusMeta(c.status).variant}>{claimStatusMeta(c.status).label}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ======================================== Admin Overview ======================================== */

function AdminOverview({ requests }) {
  const stats = computeStats(requests)
  const maxCity = stats.topCities[0]
  return (
    <div className="bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container-x py-8">
          <h1 className="font-display text-3xl font-semibold text-slate-900">Travel administration</h1>
          <p className="mt-2 text-sm text-slate-500">Company-wide travel spend, approvals and policy control.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild><Link to="/admin"><ClipboardList className="size-4" /> Open admin console</Link></Button>
            <Button variant="secondary" asChild><Link to="/admin/policies"><ShieldCheck className="size-4" /> Travel policies</Link></Button>
          </div>
        </div>
      </div>
      <div className="container-x py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={Wallet} label="Estimated travel spend" value={<Price amount={stats.totalSpend} />} tone="text-brand-600" />
          <StatCard icon={Plane} label="Total trips" value={stats.totalTrips} tone="text-slate-600" />
          <StatCard icon={Clock} label="Pending approvals" value={stats.pending} tone="text-amber-600" />
          <StatCard icon={ShieldCheck} label="Policy exceptions" value={stats.violations} tone="text-rose-600" />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><MapPin className="size-4 text-brand-600" /> Most travelled city</p>
              {maxCity ? (
                <>
                  <p className="font-display text-3xl font-bold text-slate-900">{maxCity.city}</p>
                  <p className="mt-1 text-xs text-slate-500">{maxCity.count} trip{maxCity.count > 1 ? 's' : ''} booked</p>
                </>
              ) : <p className="text-sm text-slate-500">No trips yet</p>}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Plane className="size-4 text-brand-600" /> Trips by status</p>
              <div className="space-y-2.5">
                {Object.entries(stats.byStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-3">
                    <span className="w-24 text-xs font-semibold capitalize text-slate-600">{status}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={cn('h-full rounded-full', status === 'pending' ? 'bg-amber-400' : status === 'rejected' || status === 'cancelled' ? 'bg-rose-400' : status === 'completed' ? 'bg-slate-400' : 'bg-brand-500')} style={{ width: `${stats.totalTrips ? Math.round((count / stats.totalTrips) * 100) : 0}%` }} />
                    </div>
                    <span className="w-6 text-right text-xs font-bold text-slate-700">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Wallet className="size-4 text-brand-600" /> Spend by month</p>
              <div className="flex h-32 items-end gap-2">
                {stats.byMonth.map((m) => (
                  <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-600">₹{(m.value / 1000).toFixed(0)}k</span>
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400" style={{ height: `${Math.max(6, Math.round((m.value / Math.max(...stats.byMonth.map((x) => x.value), 1)) * 100))}%`, maxHeight: '100px' }} />
                    <span className="text-[10px] text-slate-400">{m.label.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ======================================== Entry ======================================== */

export default function Home() {
  const { user, isAuthenticated, role, sessionChecked } = useAuth()

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests', 'dashboard', user?.id],
    queryFn: () => corporateApi.getRequests({ role, scope: user?.id }),
    enabled: isAuthenticated && sessionChecked,
  })
  const { data: claims } = useQuery({
    queryKey: ['claims', 'dashboard', user?.id],
    queryFn: () => corporateApi.getClaims(),
    enabled: isAuthenticated && sessionChecked,
  })

  if (!isAuthenticated) return <GuestLanding />

  if (isLoading) {
    return (
      <div className="container-x py-10 space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    )
  }

  const list = requests || []
  if (role === 'admin') return <AdminOverview requests={list} />
  if (role === 'approver') return <ApproverOverview requests={list} />
  if (role === 'finance') return <FinanceOverview requests={list} claims={claims} />
  return <EmployeeDashboard requests={list} />
}
