import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [count, setCount] = useState(0)
  const numericTarget = parseInt(target.replace(/[^0-9]/g, ''), 10)

  useEffect(() => {
    if (!isInView || isNaN(numericTarget)) return
    let start = 0
    const increment = numericTarget / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= numericTarget) {
        setCount(numericTarget)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, numericTarget, duration])

  if (isNaN(numericTarget)) {
    return <span className={className}>{prefix}{target}{suffix}</span>
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  )
}
