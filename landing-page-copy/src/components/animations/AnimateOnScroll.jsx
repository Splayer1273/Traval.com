import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const presets = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
}

export default function AnimateOnScroll({
  children,
  preset = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className = '',
  once = true,
  amount = 0.3,
  staggerChildren = false,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  const variant = presets[preset] || presets.fadeUp

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: variant.hidden,
        visible: {
          ...variant.visible,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.46, 0.45, 0.94],
            ...(staggerChildren && { staggerChildren: 0.1 }),
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className = '', staggerDelay = 0.1, ...props }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
