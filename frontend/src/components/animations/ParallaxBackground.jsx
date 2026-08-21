import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function ParallaxBackground({
  children,
  speed = 0.3,
  className = '',
  innerClassName = '',
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [-60 * speed, 60 * speed])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className={innerClassName} />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
