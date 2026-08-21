import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { cn } from '../lib/utils.js'
import { ArrowRight, Quote } from 'lucide-react'

/**
 * Premium content-image break components.
 * Each variant creates a different visual rhythm between text sections.
 * All images lazy-load, use object-fit: cover, and animate on scroll.
 */

const U = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

/* ── Image sets for each break ─────────────────────────────────────────── */

const BREAK_IMAGES = {
  // After Hero — wide cinematic airport panorama
  heroBreak: [
    { src: U('1540962351504-03099e0a754b', 1600), alt: 'Business jet on tarmac at sunset' },
    { src: U('1436491865332-7a61a109cc05', 1600), alt: 'Commercial aircraft in flight' },
  ],
  // After Challenge — corporate travel chaos vs control
  challengeBreak: [
    { src: U('1517245386807-bb43f82c33c4', 800), alt: 'Modern business workspace' },
    { src: U('1552664730-d307ca884978', 800), alt: 'Corporate boardroom meeting' },
  ],
  // After Solution — tech platform visualization
  solutionBreak: U('1551288049-bebda4e38f71', 1600),
  // After Trust Stats — airport terminal
  trustBreak: U('1480497490787-505ec076689f', 1600),
  // After Services — luxury hotel
  servicesBreak: U('1566073771259-6a8506099945', 1600),
  // After Platform — tech dashboard
  platformBreak: [
    { src: U('1517694712202-14dd9538aa97', 600), alt: 'Developer workspace' },
    { src: U('1460925895917-afdab827c52f', 600), alt: 'Data analytics on screen' },
    { src: U('1519389950473-47ba0277781c', 600), alt: 'Team collaboration' },
  ],
  // After How It Works — travel journey
  howItWorksBreak: U('1476514525535-07fb3b4ae5f1', 1600),
  // After Solutions — team/role visuals
  solutionsBreak: [
    { src: U('1522071820081-009f0129c71c', 800), alt: 'Team working together' },
    { src: U('1554224155-6726b3ff858f', 800), alt: 'Financial planning' },
  ],
  // After Global Network — world landmarks
  globalBreak: U('1502602898657-3e91760cbb34', 1600),
  // After Why Choose — premium travel details
  whyUsBreak: [
    { src: U('1449965408869-eaa3f722e40d', 400), alt: 'Luxury car transfer' },
    { src: U('1542314831-068cd1dbfeeb', 400), alt: 'Premium hotel interior' },
    { src: U('1556909114-f6e7ad7d3136', 400), alt: 'Business traveler at airport' },
    { src: U('1519389950473-47ba0277781c', 400), alt: 'Corporate team meeting' },
  ],
  // After Testimonials — executive lounge
  testimonialsBreak: U('1551882547-ff40c63fe5fa', 1600),
  // Before Final CTA — Dubai skyline
  finalCtaBreak: U('1512453979798-5ea266f8880c', 1920),
}

/* ── Base wrapper with scroll animation ─────────────────────────────────── */

function ImageBreakWrapper({ children, className = '', fade = true }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      className={cn('relative', className)}
      initial={fade ? { opacity: 0, y: 30 } : undefined}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

/* ── Lazy image with hover effect ───────────────────────────────────────── */

function LazyImage({ src, alt, className = '', imgClassName = '', hoverScale = true }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
      )}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn(
          'size-full object-cover transition-transform duration-700',
          hoverScale && 'hover:scale-105',
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName
        )}
      />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  VARIANT 1 — Wide Cinematic Banner                                       */
/*  Full-bleed wide image between sections                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function CinematicBreak({ images, height = 'h-[300px] sm:h-[400px] lg:h-[480px]', overlay = true, caption, captionSub }) {
  const src = Array.isArray(images) ? images[0] : images
  const alt = typeof src === 'object' ? src.alt : ''
  const url = typeof src === 'object' ? src.src : src

  return (
    <ImageBreakWrapper className="my-8 sm:my-12 lg:my-16">
      <div className="container-x">
        <div className={cn('relative rounded-3xl overflow-hidden shadow-lift', height)}>
          <LazyImage src={url} alt={alt} className="absolute inset-0" hoverScale />
          {overlay && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
            </>
          )}
          {caption && (
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-sm font-semibold text-white/90">{caption}</p>
              {captionSub && <p className="mt-1 text-xs text-white/60">{captionSub}</p>}
            </div>
          )}
          {/* Subtle corner accent */}
          <div className="absolute right-4 top-4 size-1.5 rounded-full bg-white/40" />
        </div>
      </div>
    </ImageBreakWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  VARIANT 2 — Dual Panel (Side by Side)                                   */
/*  Two images side by side with a gap                                       */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function DualPanelBreak({ images, captions }) {
  return (
    <ImageBreakWrapper className="my-8 sm:my-12 lg:my-16">
      <div className="container-x">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {(Array.isArray(images) ? images : [images, images]).slice(0, 2).map((img, i) => {
            const url = typeof img === 'object' ? img.src : img
            const alt = typeof img === 'object' ? img.alt : ''
            return (
              <div key={i} className="relative">
                <LazyImage
                  src={url}
                  alt={alt}
                  className="h-[220px] sm:h-[280px] lg:h-[340px] rounded-2xl shadow-soft"
                />
                {captions?.[i] && (
                  <div className="absolute bottom-0 left-0 right-0 rounded-b-2xl bg-gradient-to-t from-black/50 to-transparent p-5">
                    <p className="text-sm font-semibold text-white">{captions[i]}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </ImageBreakWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  VARIANT 3 — Image Trio (3 across)                                       */
/*  Three images in a horizontal row                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function TrioBreak({ images }) {
  return (
    <ImageBreakWrapper className="my-8 sm:my-12 lg:my-16">
      <div className="container-x">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(Array.isArray(images) ? images : [images, images, images]).slice(0, 3).map((img, i) => {
            const url = typeof img === 'object' ? img.src : img
            const alt = typeof img === 'object' ? img.alt : ''
            return (
              <LazyImage
                key={i}
                src={url}
                alt={alt}
                className="h-[200px] sm:h-[240px] lg:h-[280px] rounded-2xl shadow-soft"
              />
            )
          })}
        </div>
      </div>
    </ImageBreakWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  VARIANT 4 — Quad Strip (4 images in a row)                             */
/*  Four images in a horizontal strip, good for variety                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function QuadStripBreak({ images }) {
  return (
    <ImageBreakWrapper className="my-8 sm:my-12 lg:my-16">
      <div className="container-x">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {(Array.isArray(images) ? images : [images, images, images, images]).slice(0, 4).map((img, i) => {
            const url = typeof img === 'object' ? img.src : img
            const alt = typeof img === 'object' ? img.alt : ''
            return (
              <LazyImage
                key={i}
                src={url}
                alt={alt}
                className="aspect-square rounded-2xl shadow-soft"
              />
            )
          })}
        </div>
      </div>
    </ImageBreakWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  VARIANT 5 — Asymmetric Grid (large + 2 stacked)                         */
/*  One large image on left, two stacked on right                            */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function AsymmetricGridBreak({ images }) {
  const imgs = Array.isArray(images) ? images : [images, images, images]
  return (
    <ImageBreakWrapper className="my-8 sm:my-12 lg:my-16">
      <div className="container-x">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="sm:col-span-3">
            <LazyImage
              src={typeof imgs[0] === 'object' ? imgs[0].src : imgs[0]}
              alt={typeof imgs[0] === 'object' ? imgs[0].alt : ''}
              className="h-[260px] sm:h-[320px] lg:h-[380px] rounded-2xl shadow-soft"
            />
          </div>
          <div className="sm:col-span-2 grid grid-rows-2 gap-4">
            <LazyImage
              src={typeof imgs[1] === 'object' ? imgs[1].src : imgs[1]}
              alt={typeof imgs[1] === 'object' ? imgs[1].alt : ''}
              className="rounded-2xl shadow-soft"
            />
            <LazyImage
              src={typeof imgs[2] === 'object' ? imgs[2].src : imgs[2]}
              alt={typeof imgs[2] === 'object' ? imgs[2].alt : ''}
              className="rounded-2xl shadow-soft"
            />
          </div>
        </div>
      </div>
    </ImageBreakWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  VARIANT 6 — Parallax Cinematic (with text overlay)                       */
/*  Full-width parallax image with centered quote or text                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function ParallaxBreak({ src, alt, quote, author, height = 'h-[350px] sm:h-[450px] lg:h-[520px]' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <ImageBreakWrapper className="my-8 sm:my-12 lg:my-16">
      <div ref={ref} className={cn('relative overflow-hidden', height)}>
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          initial={{ scale: 1.1 }}
          animate={isInView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
        {quote && (
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <motion.div
              className="max-w-xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Quote className="mx-auto mb-4 size-8 text-white/40" />
              <p className="text-lg sm:text-xl font-display font-semibold leading-relaxed text-white drop-shadow-lg">
                {quote}
              </p>
              {author && (
                <p className="mt-3 text-sm text-white/70">{author}</p>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </ImageBreakWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  VARIANT 7 — Editorial Caption (image with text sidebar)                  */
/*  Image on one side, small caption text on the other                       */
/* ═══════════════════════════════════════════════════════════════════════════ */

export function EditorialBreak({ src, alt, caption, captionDetail, reverse = false }) {
  return (
    <ImageBreakWrapper className="my-8 sm:my-12 lg:my-16">
      <div className="container-x">
        <div className={cn(
          'grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-5',
          reverse && 'lg:[direction:rtl]'
        )}>
          <div className="lg:col-span-3 lg:[direction:ltr]">
            <LazyImage
              src={src}
              alt={alt}
              className="h-[280px] sm:h-[340px] lg:h-[400px] rounded-2xl shadow-lift"
            />
          </div>
          <div className="lg:col-span-2 lg:[direction:ltr]">
            <div className="rounded-2xl bg-slate-50 p-6 sm:p-8">
              {caption && (
                <p className="font-display text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed">
                  {caption}
                </p>
              )}
              {captionDetail && (
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {captionDetail}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ImageBreakWrapper>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  Exported image data for use in Home.jsx                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

export { BREAK_IMAGES }
