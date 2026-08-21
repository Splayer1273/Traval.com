import { motion } from 'framer-motion'

/**
 * Premium, travel-inspired section backgrounds using CSS gradients,
 * SVG shapes, and subtle animations. No photographs — pure design.
 *
 * Each variant creates a unique, elegant background that keeps text readable
 * while adding depth, color, and visual sophistication.
 */

/* ── Reusable animated orb ── */
function Orb({ className, animate, transition }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-[80px] ${className}`}
      animate={animate}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', ...transition }}
    />
  )
}

/* ── Flowing SVG wave shape ── */
function Wave({ className, color = 'currentColor', opacity = 0.06, d, ...props }) {
  return (
    <svg className={`pointer-events-none absolute ${className}`} viewBox="0 0 1440 200" fill="none" preserveAspectRatio="none" {...props}>
      <path d={d} fill={color} fillOpacity={opacity} />
    </svg>
  )
}

/* ── Dot grid pattern ── */
function DotGrid({ className, spacing = 40, color = '#3b5bff', opacity = 0.04 }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: `${spacing}px ${spacing}px`,
        opacity,
      }}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  HERO — Dark cinematic with flowing light rays and floating elements   */
/* ═══════════════════════════════════════════════════════════════════════ */
export function HeroBg() {
  return (
    <div className="absolute inset-0 bg-slate-950">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-slate-950 to-brand-900/40" />

      {/* Large flowing gradient orbs */}
      <Orb className="-left-40 -top-40 size-[600px] bg-brand-500/20" animate={{ x: [0, 40, 0], y: [0, -30, 0] }} transition={{ duration: 12 }} />
      <Orb className="-right-20 top-1/3 size-[500px] bg-sun-500/12" animate={{ x: [0, -30, 0], y: [0, 25, 0] }} transition={{ duration: 14, delay: 1 }} />
      <Orb className="bottom-0 left-1/3 size-[400px] bg-brand-400/10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, delay: 2 }} />
      <Orb className="right-1/4 top-1/4 size-[300px] bg-violet-500/8" animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 16, delay: 3 }} />

      {/* Flowing wave shapes */}
      <Wave className="bottom-0 left-0 h-48 w-full" d="M0,120 C240,180 480,60 720,120 C960,180 1200,80 1440,140 L1440,200 L0,200 Z" color="#3b5bff" opacity={0.04} />
      <Wave className="bottom-0 left-0 h-32 w-full" d="M0,160 C360,100 720,180 1080,120 C1260,90 1380,140 1440,160 L1440,200 L0,200 Z" color="#f97316" opacity={0.03} />

      {/* Subtle dot grid */}
      <DotGrid spacing={60} color="#ffffff" opacity={0.025} />

      {/* Light ray streaks */}
      <motion.div
        className="pointer-events-none absolute -right-20 top-0 h-[600px] w-[2px] origin-top rotate-[25deg] bg-gradient-to-b from-brand-400/0 via-brand-400/20 to-brand-400/0"
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="pointer-events-none absolute right-1/4 top-0 h-[500px] w-[1px] origin-top rotate-[15deg] bg-gradient-to-b from-sun-400/0 via-sun-400/15 to-sun-400/0"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 3 }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/3 top-0 h-[400px] w-[1px] origin-top rotate-[-10deg] bg-gradient-to-b from-violet-400/0 via-violet-400/10 to-violet-400/0"
        animate={{ opacity: [0, 0.25, 0] }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      />

      {/* Floating abstract shapes */}
      <motion.div
        className="pointer-events-none absolute right-20 top-20 size-20 rounded-full border border-white/5"
        animate={{ y: [0, -15, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="pointer-events-none absolute left-1/4 top-1/3 size-12 rounded-lg border border-brand-400/10 rotate-45"
        animate={{ y: [0, 10, 0], rotate: [45, 90, 45] }}
        transition={{ duration: 15, repeat: Infinity }}
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/30" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  CHALLENGE — Clean white with subtle brand accent orbs                 */
/* ═══════════════════════════════════════════════════════════════════════ */
export function ChallengeBg() {
  return (
    <div className="absolute inset-0 bg-white">
      <Orb className="-right-40 -top-20 size-[500px] bg-brand-100/40" animate={{ x: [0, 20, 0] }} transition={{ duration: 12 }} />
      <Orb className="-left-20 bottom-0 size-[400px] bg-sun-100/30" animate={{ y: [0, -15, 0] }} transition={{ duration: 10, delay: 2 }} />
      <Wave className="top-0 left-0 h-24 w-full" d="M0,0 L1440,0 L1440,40 C1200,80 960,20 720,60 C480,100 240,30 0,70 Z" color="#3b5bff" opacity={0.02} />
      <DotGrid spacing={48} color="#3b5bff" opacity={0.02} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SOLUTION — Soft slate-50 with warm gradient accents                  */
/* ═══════════════════════════════════════════════════════════════════════ */
export function SolutionBg() {
  return (
    <div className="absolute inset-0 bg-slate-50">
      <Orb className="-right-40 top-0 size-[500px] bg-brand-100/50" animate={{ x: [0, 25, 0] }} transition={{ duration: 14 }} />
      <Orb className="left-1/4 -bottom-20 size-[350px] bg-sun-100/40" animate={{ x: [0, -20, 0] }} transition={{ duration: 12, delay: 1 }} />
      <Orb className="right-1/3 top-1/3 size-[250px] bg-violet-100/20" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 10, delay: 2 }} />
      <Wave className="bottom-0 left-0 h-20 w-full" d="M0,60 C360,20 720,80 1080,40 C1260,25 1380,55 1440,60 L1440,120 L0,120 Z" color="#3b5bff" opacity={0.015} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  TRUST STATS — White with gradient mesh and flowing curves            */
/* ═══════════════════════════════════════════════════════════════════════ */
export function TrustBg() {
  return (
    <div className="absolute inset-0 bg-white">
      <Orb className="left-1/4 -top-20 size-[400px] bg-brand-50/60" animate={{ y: [0, 20, 0] }} transition={{ duration: 10 }} />
      <Orb className="-right-20 bottom-0 size-[350px] bg-sun-50/50" animate={{ x: [0, -15, 0] }} transition={{ duration: 12, delay: 1 }} />
      <DotGrid spacing={60} color="#3b5bff" opacity={0.015} />
      <Wave className="top-0 right-0 h-32 w-1/2" d="M0,0 L600,0 L600,120 C500,80 300,100 200,60 C100,20 50,80 0,40 Z" color="#3b5bff" opacity={0.015} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SERVICES — Light with flowing wave and warm accents                  */
/* ═══════════════════════════════════════════════════════════════════════ */
export function ServicesBg() {
  return (
    <div className="absolute inset-0 bg-slate-50">
      <Orb className="-left-32 bottom-0 size-[400px] bg-sun-100/50" animate={{ x: [0, 20, 0] }} transition={{ duration: 14 }} />
      <Orb className="right-1/4 -top-20 size-[350px] bg-brand-100/40" animate={{ y: [0, 15, 0] }} transition={{ duration: 12, delay: 1 }} />
      <Wave className="top-0 left-0 h-24 w-full" d="M0,0 L1440,0 L1440,60 C1200,100 960,30 720,70 C480,110 240,40 0,80 Z" color="#f97316" opacity={0.02} />
      <DotGrid spacing={48} color="#f97316" opacity={0.015} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PLATFORM — White with tech-inspired subtle grid                      */
/* ═══════════════════════════════════════════════════════════════════════ */
export function PlatformBg() {
  return (
    <div className="absolute inset-0 bg-white">
      <Orb className="right-1/3 -top-20 size-[400px] bg-brand-50/50" animate={{ x: [0, -20, 0] }} transition={{ duration: 12 }} />
      <Orb className="-left-20 bottom-1/4 size-[300px] bg-violet-100/30" animate={{ y: [0, 15, 0] }} transition={{ duration: 10, delay: 2 }} />
      <DotGrid spacing={32} color="#3b5bff" opacity={0.02} />
      <Wave className="bottom-0 left-0 h-20 w-full" d="M0,80 C360,40 720,100 1080,60 C1260,45 1380,75 1440,80 L1440,120 L0,120 Z" color="#3b5bff" opacity={0.015} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  HOW IT WORKS — Light slate with flowing timeline accent               */
/* ═══════════════════════════════════════════════════════════════════════ */
export function HowItWorksBg() {
  return (
    <div className="absolute inset-0 bg-slate-50">
      <Orb className="right-0 top-1/4 size-[350px] bg-brand-100/40" animate={{ x: [0, -15, 0] }} transition={{ duration: 12 }} />
      <Orb className="-left-20 bottom-1/3 size-[300px] bg-sun-100/30" animate={{ y: [0, 10, 0] }} transition={{ duration: 10, delay: 1 }} />
      <DotGrid spacing={48} color="#3b5bff" opacity={0.015} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  SOLUTIONS — White with team-themed gradient orbs                     */
/* ═══════════════════════════════════════════════════════════════════════ */
export function SolutionsBg() {
  return (
    <div className="absolute inset-0 bg-white">
      <Orb className="left-1/3 -top-20 size-[400px] bg-brand-50/50" animate={{ x: [0, 15, 0] }} transition={{ duration: 14 }} />
      <Orb className="-right-20 bottom-0 size-[350px] bg-sun-50/40" animate={{ y: [0, -15, 0] }} transition={{ duration: 12, delay: 1 }} />
      <Wave className="bottom-0 left-0 h-20 w-full" d="M0,60 C480,20 960,80 1440,40 L1440,120 L0,120 Z" color="#3b5bff" opacity={0.015} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  GLOBAL NETWORK — Premium dark with animated orbs and grid            */
/* ═══════════════════════════════════════════════════════════════════════ */
export function GlobalNetworkBg() {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600">
      {/* Animated orbs */}
      <Orb className="-right-16 -top-16 size-64 bg-white/10" animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 6 }} />
      <Orb className="-bottom-12 -left-12 size-48 bg-sun-500/20" animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }} transition={{ duration: 8, delay: 1 }} />
      <Orb className="right-1/3 top-1/3 size-[300px] bg-violet-400/8" animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 14, delay: 2 }} />

      {/* Dot grid */}
      <DotGrid spacing={40} color="#ffffff" opacity={0.04} />

      {/* Flowing wave */}
      <Wave className="bottom-0 left-0 h-24 w-full" d="M0,60 C360,20 720,80 1080,40 C1260,25 1380,55 1440,60 L1440,120 L0,120 Z" color="#ffffff" opacity={0.03} />

      {/* Light rays */}
      <motion.div
        className="pointer-events-none absolute right-1/4 top-0 h-[400px] w-[1px] origin-top rotate-[20deg] bg-gradient-to-b from-white/0 via-white/15 to-white/0"
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  WHY CHOOSE — White with warm premium accents                         */
/* ═══════════════════════════════════════════════════════════════════════ */
export function WhyChooseBg() {
  return (
    <div className="absolute inset-0 bg-white">
      <Orb className="-right-20 -top-20 size-[400px] bg-sun-100/40" animate={{ x: [0, -20, 0] }} transition={{ duration: 14 }} />
      <Orb className="left-1/4 bottom-0 size-[350px] bg-brand-100/30" animate={{ y: [0, -10, 0] }} transition={{ duration: 12, delay: 1 }} />
      <Wave className="top-0 left-0 h-20 w-full" d="M0,0 L1440,0 L1440,50 C1200,90 960,30 720,60 C480,90 240,40 0,70 Z" color="#f97316" opacity={0.015} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  TESTIMONIALS — Light with subtle orbs                                */
/* ═══════════════════════════════════════════════════════════════════════ */
export function TestimonialsBg() {
  return (
    <div className="absolute inset-0 bg-slate-50">
      <Orb className="-left-20 top-1/3 size-[400px] bg-brand-100/40" animate={{ x: [0, 15, 0] }} transition={{ duration: 12 }} />
      <Orb className="right-1/4 -bottom-20 size-[300px] bg-sun-100/30" animate={{ y: [0, -10, 0] }} transition={{ duration: 10, delay: 2 }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  MOBILE — Clean white with tech gradients                             */
/* ═══════════════════════════════════════════════════════════════════════ */
export function MobileBg() {
  return (
    <div className="absolute inset-0 bg-white">
      <Orb className="right-1/4 -top-20 size-[350px] bg-brand-50/50" animate={{ x: [0, -15, 0] }} transition={{ duration: 12 }} />
      <Orb className="-left-20 bottom-0 size-[300px] bg-violet-100/30" animate={{ y: [0, 10, 0] }} transition={{ duration: 10, delay: 1 }} />
      <DotGrid spacing={48} color="#3b5bff" opacity={0.015} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  FAQ — Light slate with subtle orbs                                   */
/* ═══════════════════════════════════════════════════════════════════════ */
export function FaqBg() {
  return (
    <div className="absolute inset-0 bg-slate-50">
      <Orb className="-right-20 bottom-0 size-[350px] bg-brand-50/50" animate={{ x: [0, -15, 0] }} transition={{ duration: 12 }} />
      <Orb className="left-1/4 -top-20 size-[300px] bg-sun-50/40" animate={{ y: [0, 10, 0] }} transition={{ duration: 10, delay: 1 }} />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════ */
/*  FINAL CTA — Premium dark with animated orbs and patterns             */
/* ═══════════════════════════════════════════════════════════════════════ */
export function FinalCtaBg() {
  return (
    <div className="absolute inset-0 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-800 via-brand-700 to-brand-600" />
      <Orb className="-right-16 -top-16 size-64 bg-white/10" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6 }} />
      <Orb className="-bottom-12 -left-12 size-48 bg-sun-500/20" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, delay: 1 }} />
      <DotGrid spacing={32} color="#ffffff" opacity={0.04} />
    </div>
  )
}
