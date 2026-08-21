import { useRef, useState } from 'react'
import { cn } from '../lib/utils.js'

/**
 * Cinematic video background with image fallback.
 * Shows a subtle, looped video behind content with overlay support.
 * Automatically falls back to a static image if the video fails to load.
 */
export default function VideoBackground({ src, poster, alt = '', className, overlayClassName, children }) {
  const videoRef = useRef(null)
  const [videoFailed, setVideoFailed] = useState(false)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Video layer */}
      {!videoFailed && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={poster}
          onError={() => setVideoFailed(true)}
          className="pointer-events-none absolute inset-0 size-full object-cover"
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Fallback image when video fails */}
      {videoFailed && poster && (
        <img
          src={poster}
          alt={alt}
          className="pointer-events-none absolute inset-0 size-full object-cover"
          loading="eager"
        />
      )}

      {/* Default gradient overlay */}
      <div className={cn('absolute inset-0', overlayClassName)} />

      {/* Content */}
      {children && <div className="relative">{children}</div>}
    </div>
  )
}
