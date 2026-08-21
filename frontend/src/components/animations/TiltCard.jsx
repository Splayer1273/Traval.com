import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function TiltCard({ children, className = '', maxTilt = 8, scale = 1.02 }) {
  const ref = useRef(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)')

  const handleMouse = (e) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (clientX - left - width / 2) / (width / 2)
    const y = (clientY - top - height / 2) / (height / 2)
    setTransform(
      `perspective(1000px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) scale(${scale})`,
    )
  }

  const reset = () => setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)')

  return (
    <div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ transform, transition: 'transform 0.15s ease-out', transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </div>
  )
}
