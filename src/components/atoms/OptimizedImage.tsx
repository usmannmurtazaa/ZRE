import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/helpers/cn'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  aspectRatio?: string
  className?: string
  loading?: 'lazy' | 'eager'
  sizes?: string
  srcSet?: string
  placeholder?: 'blur' | 'none'
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  decoding?: 'async' | 'sync' | 'auto'
}

/**
 * OptimizedImage – a performant, accessible image component with:
 * - Lazy / eager loading
 * - Aspect ratio placeholder
 * - Smooth blur-in transition
 * - Native srcset support
 * - Optional intersection observer based loading
 */
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  aspectRatio = 'auto',
  className,
  loading = 'lazy',
  sizes = '100vw',
  srcSet,
  placeholder = 'blur',
  objectFit = 'cover',
  decoding = 'async',
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Check if image is already cached (e.g., from browser cache)
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true)
    }
  }, [])

  const handleLoad = () => setIsLoaded(true)
  const handleError = () => setIsError(true)

  // Aspect ratio calculation for the placeholder container
  const aspectRatioStyle =
    aspectRatio && aspectRatio !== 'auto'
      ? { aspectRatio }
      : width && height
        ? { aspectRatio: `${width} / ${height}` }
        : undefined

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800',
        className
      )}
      style={aspectRatioStyle || { width: width, height: height }}
    >
      {/* Blur / skeleton placeholder */}
      <AnimatePresence>
        {(!isLoaded || isError) && placeholder === 'blur' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800"
          >
            <div className="h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {isError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-neutral-400">Unable to load image</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      {!isError && (
        <motion.img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          sizes={sizes}
          srcSet={srcSet}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'h-full w-full transition-opacity duration-500 ease-out',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'fill' && 'object-fill',
            objectFit === 'none' && 'object-none',
            objectFit === 'scale-down' && 'object-scale-down',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          draggable={false}
        />
      )}

      {/* Hidden semantic fallback for screen readers when image errors */}
      {isError && (
        <div
          className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-neutral-500"
          role="img"
          aria-label={alt}
        >
          <span>{alt}</span>
        </div>
      )}
    </div>
  )
}

export default OptimizedImage
