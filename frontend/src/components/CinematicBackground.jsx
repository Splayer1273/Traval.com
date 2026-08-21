import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Premium cinematic background using real corporate travel photography.
 * Features slow crossfade transitions, subtle zoom, and floating movement.
 * Each section gets a unique set of contextually relevant photos.
 */

const U = (id, w = 1920) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

/* ── Photo sets for each section ── */
// All IDs verified HTTP 200 as of August 2025

const HERO_PHOTOS = [
  U('1556909114-f6e7ad7d3136'),  // Business traveler with luggage at airport
  U('1497366216548-37526070297c'), // Modern glass corporate office building
  U('1480497490787-505ec076689f'), // Bright airport terminal interior
  U('1436491865332-7a61a109cc05'), // Airplane in flight against sky
]

const GLOBAL_PHOTOS = [
  U('1502602898657-3e91760cbb34'), // Eiffel Tower Paris cityscape
  U('1519501025264-65ba15a82390'), // Modern city skyline at dusk
  U('1500835556837-99ac94a94552'), // Airplane wing above clouds
  U('1496442226666-8d4d0e62e6e9'), // New York City skyline
]

const CTA_PHOTOS = [
  U('1552664730-d307ca884978'),  // Corporate boardroom meeting
  U('1517245386807-bb43f82c33c4'), // Modern business workspace
  U('1486299267070-83823f5448dd'), // Professional travel coordination
]

const SERVICES_PHOTOS = [
  U('1480497490787-505ec076689f'), // Airport terminal departure hall
  U('1566073771259-6a8506099945'), // Luxury hotel infinity pool
  U('1449965408869-eaa3f722e40d'), // Premium black car transfer
  U('1505373877841-8d25f7d46678'), // Corporate conference room
  U('1540962351504-03099e0a754b'), // Private jet on tarmac
]

const TRUST_PHOTOS = [
  U('1497366216548-37526070297c'), // Modern glass office tower
  U('1486299267070-83823f5448dd'), // Business travel coordination
  U('1552664730-d307ca884978'),  // Executive boardroom
  U('1519389950473-47ba0277781c'), // Team collaboration workspace
]

const PLATFORM_PHOTOS = [
  U('1517694712202-14dd9538aa97'), // Developer coding workspace
  U('1551288049-bebda4e38f71'),  // Data analytics dashboard
  U('1517245386807-bb43f82c33c4'), // Modern business desk setup
  U('1519389950473-47ba0277781c'), // Tech team collaboration
]

const SOLUTIONS_PHOTOS = [
  U('1522071820081-009f0129c71c'), // Diverse team collaboration
  U('1552664730-d307ca884978'),  // Corporate boardroom discussion
  U('1497366216548-37526070297c'), // Executive corner office
  U('1519389950473-47ba0277781c'), // Team working on project
]

const HOW_IT_WORKS_PHOTOS = [
  U('1486299267070-83823f5448dd'), // Travel desk coordination
  U('1552664730-d307ca884978'),  // Meeting room planning
  U('1519389950473-47ba0277781c'), // Team reviewing documents
  U('1497366216548-37526070297c'), // Modern corporate office
]

/* ── Ken Burns directions: each photo pans differently ── */
const KB_DIRECTIONS = [
  { from: 'scale(1.0) translate(0%, 0%)',   to: 'scale(1.12) translate(-2%, -1%)' },   // zoom in + pan left-up
  { from: 'scale(1.0) translate(0%, 0%)',   to: 'scale(1.10) translate(2%, 1%)' },     // zoom in + pan right-down
  { from: 'scale(1.0) translate(-1%, 0%)',  to: 'scale(1.12) translate(1%, -1%)' },    // pan right + zoom in
  { from: 'scale(1.05) translate(1%, -1%)', to: 'scale(1.0) translate(-1%, 1%)' },     // zoom out + pan left-down
  { from: 'scale(1.0) translate(0%, -1%)',  to: 'scale(1.10) translate(0%, 1%)' },     // pan down + zoom in
  { from: 'scale(1.0) translate(-1%, 1%)',  to: 'scale(1.12) translate(1%, 0%)' },     // pan right + zoom in
]

/* ── Single crossfading image layer with Ken Burns ── */
function CrossfadeLayer({ photos, interval = 8, className = '' }) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current)
      setCurrent((c) => (c + 1) % photos.length)
    }, interval * 1000)
    return () => clearInterval(timer)
  }, [current, interval, photos.length])

  const kbDuration = `${interval}s`

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Previous (fading out) with Ken Burns continuing */}
      {prev !== null && (
        <motion.img
          key={`prev-${prev}`}
          src={photos[prev]}
          alt=""
          className="absolute inset-0 size-full object-cover"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          loading="eager"
          style={{
            transform: KB_DIRECTIONS[prev % KB_DIRECTIONS.length].to,
            transition: `transform ${kbDuration} linear`,
          }}
        />
      )}
      {/* Current (fading in) with Ken Burns */}
      <motion.img
        key={`curr-${current}`}
        src={photos[current]}
        alt=""
        className="absolute inset-0 size-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        loading="eager"
        style={{
          transform: KB_DIRECTIONS[current % KB_DIRECTIONS.length].from,
          animation: `kenburns-${current % KB_DIRECTIONS.length} ${kbDuration} linear forwards`,
        }}
      />
    </div>
  )
}

/* ── Floating subtle movement layer ── */
function FloatingOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-40 -top-40 size-[600px] rounded-full bg-brand-500/15 blur-[120px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-20 top-1/3 size-[500px] rounded-full bg-sun-500/10 blur-[100px]"
        animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 size-[400px] -translate-x-1/2 rounded-full bg-brand-400/8 blur-[80px]"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  HERO BACKGROUND — Dark cinematic with crossfading travel photos      */
/* ═══════════════════════════════════════════════════════════════════════ */
export function HeroCinematicBg() {
  return (
    <div className="absolute inset-0">
      {/* Crossfading real photos */}
      <CrossfadeLayer photos={HERO_PHOTOS} interval={8} zoom={true} />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/60 to-slate-950/80" />

      {/* Side gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/40" />

      {/* Floating glow orbs */}
      <FloatingOverlay />

      {/* Subtle vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(15,23,42,0.4) 100%)'
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  GLOBAL NETWORK — Crossfading world city photos                       */
/* ═══════════════════════════════════════════════════════════════════════ */
export function GlobalCinematicBg() {
  return (
    <div className="absolute inset-0">
      {/* Crossfading real photos */}
      <CrossfadeLayer photos={GLOBAL_PHOTOS} interval={7} zoom={true} />

      {/* Brand gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 via-brand-800/70 to-brand-700/80" />

      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-16 -top-16 size-64 rounded-full bg-white/8 blur-[60px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-12 -left-12 size-48 rounded-full bg-sun-500/15 blur-[50px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Dot grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  FINAL CTA — Crossfading corporate meeting photos                    */
/* ═══════════════════════════════════════════════════════════════════════ */
export function CtaCinematicBg() {
  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden">
      <CrossfadeLayer photos={CTA_PHOTOS} interval={6} />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-800/85 via-brand-700/75 to-brand-600/85" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/8 blur-[60px]" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
        <motion.div className="absolute -bottom-12 -left-12 size-48 rounded-full bg-sun-500/15 blur-[50px]" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SERVICES — Crossfading travel service photos (light overlay)         */
/* ═══════════════════════════════════════════════════════════════════════ */
export function ServicesCinematicBg() {
  return (
    <div className="absolute inset-0">
      <CrossfadeLayer photos={SERVICES_PHOTOS} interval={9} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/92 via-white/88 to-white/92" />
      <div className="pointer-events-none absolute -left-32 bottom-0 size-[400px] rounded-full bg-sun-200/30 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 -top-20 size-[350px] rounded-full bg-brand-200/25 blur-[80px]" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  TRUST STATS — Crossfading office/meeting photos (light overlay)     */
/* ═══════════════════════════════════════════════════════════════════════ */
export function TrustCinematicBg() {
  return (
    <div className="absolute inset-0">
      <CrossfadeLayer photos={TRUST_PHOTOS} interval={8} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/90" />
      <div className="pointer-events-none absolute left-1/4 -top-20 size-[400px] rounded-full bg-brand-100/40 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-[350px] rounded-full bg-sun-100/35 blur-[70px]" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PLATFORM — Crossfading tech/workspace photos (light overlay)         */
/* ═══════════════════════════════════════════════════════════════════════ */
export function PlatformCinematicBg() {
  return (
    <div className="absolute inset-0">
      <CrossfadeLayer photos={PLATFORM_PHOTOS} interval={8} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/91 via-white/87 to-white/91" />
      <div className="pointer-events-none absolute right-1/3 -top-20 size-[400px] rounded-full bg-brand-100/35 blur-[80px]" />
      <div className="pointer-events-none absolute -left-20 bottom-1/4 size-[300px] rounded-full bg-violet-200/20 blur-[70px]" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SOLUTIONS — Crossfading team/role photos (light overlay)             */
/* ═══════════════════════════════════════════════════════════════════════ */
export function SolutionsCinematicBg() {
  return (
    <div className="absolute inset-0">
      <CrossfadeLayer photos={SOLUTIONS_PHOTOS} interval={8} />
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/86 to-white/90" />
      <div className="pointer-events-none absolute left-1/3 -top-20 size-[400px] rounded-full bg-brand-100/35 blur-[80px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 size-[350px] rounded-full bg-sun-100/30 blur-[70px]" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  HOW IT WORKS — Crossfading process/workspace photos (light overlay)  */
/* ═══════════════════════════════════════════════════════════════════════ */
export function HowItWorksCinematicBg() {
  return (
    <div className="absolute inset-0">
      <CrossfadeLayer photos={HOW_IT_WORKS_PHOTOS} interval={8} />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/85 to-slate-50/90" />
      <div className="pointer-events-none absolute -right-20 top-1/4 size-[350px] rounded-full bg-brand-100/35 blur-[80px]" />
      <div className="pointer-events-none absolute -left-20 bottom-1/3 size-[300px] rounded-full bg-sun-100/30 blur-[70px]" />
    </div>
  )
}
