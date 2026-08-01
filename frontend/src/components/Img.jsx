import { useState } from 'react'
import { IMAGES, FALLBACK_IMAGE } from '../data/images.js'
import { cn } from '../lib/utils.js'

/**
 * Smart image: resolves a key from the centralized image config (or a raw URL),
 * falls back to a branded gradient if the remote image fails to load, and lazy
 * loads by default. Every image in the app should go through this component.
 */
export default function Img({ src, alt = '', className, imgClassName, eager = false }) {
  const [failed, setFailed] = useState(false)
  const resolved = IMAGES[src] || src || FALLBACK_IMAGE
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <img
        src={failed ? FALLBACK_IMAGE : resolved}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        onError={() => setFailed(true)}
        className={cn('size-full object-cover', imgClassName)}
      />
    </div>
  )
}
