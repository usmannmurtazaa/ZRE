import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PropertyImage } from '@/types'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'
import { OptimizedImage } from '@/components/atoms/OptimizedImage'

interface PropertyGalleryProps {
  images: PropertyImage[]
  className?: string
}

export const PropertyGallery = ({ images, className }: PropertyGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setSelectedIndex(0)
  }, [images])

  const totalImages = images.length

  const goTo = useCallback(
    (index: number) => {
      setSelectedIndex(((index % totalImages) + totalImages) % totalImages)
    },
    [totalImages]
  )

  const nextImage = useCallback(() => {
    goTo(selectedIndex + 1)
  }, [selectedIndex, goTo])

  const prevImage = useCallback(() => {
    goTo(selectedIndex - 1)
  }, [selectedIndex, goTo])

  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false)
      } else if (e.key === 'ArrowRight') {
        nextImage()
      } else if (e.key === 'ArrowLeft') {
        prevImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, nextImage, prevImage])

  if (!images.length) {
    return (
      <div
        className={cn(
          'aspect-[16/9] rounded-2xl bg-muted flex items-center justify-center text-muted-foreground',
          className
        )}
        role="img"
        aria-label="No images available"
      >
        <p className="text-sm">No images</p>
      </div>
    )
  }

  const currentImage = images[selectedIndex] ?? images[0]

  return (
    <div className={cn('space-y-5', className)}>
      {/* Main image container */}
      <div className="relative overflow-hidden rounded-2xl bg-muted group/main">
        <AnimatePresence mode="sync">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="aspect-[16/9] w-full cursor-pointer"
            onClick={() => setLightboxOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setLightboxOpen(true)
              }
            }}
            aria-label={`Open gallery image ${selectedIndex + 1} of ${totalImages}`}
          >
            <OptimizedImage
              src={currentImage!.url}
              alt={currentImage!.alt || `Property image ${selectedIndex + 1}`}
              objectFit="cover"
              className="h-full w-full"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {totalImages > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 z-10',
                'h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:bg-white transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 z-10',
                'h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:bg-white transition-all',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
              )}
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Image counter */}
            <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-medium tracking-wide">
              {selectedIndex + 1} / {totalImages}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails – border uses the gold token (now metallic blue / green) */}
      {totalImages > 1 && (
        <div
          className="grid grid-cols-4 sm:grid-cols-6 gap-2"
          role="list"
          aria-label="Image thumbnails"
        >
          {images.map((img, idx) => {
            const isActive = idx === selectedIndex
            return (
              <motion.button
                key={img.url + idx}
                onClick={() => goTo(idx)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive
                    ? 'border-gold-500 shadow-md shadow-gold-500/20 dark:border-gold-400'
                    : 'border-transparent hover:border-muted-foreground/30'
                )}
                aria-label={`View image ${idx + 1}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <img
                  src={img.url}
                  alt={img.alt || `Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {isActive && (
                  <motion.div
                    layoutId="thumbnail-active"
                    className="absolute inset-0 rounded-xl ring-2 ring-gold-500/30 dark:ring-gold-400/40"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      )}

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none backdrop-blur-lg"
          onPointerDownOutside={() => setLightboxOpen(false)}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            <AnimatePresence mode="sync">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center w-full h-full p-8"
              >
                <img
                  src={images[selectedIndex]?.url}
                  alt={images[selectedIndex]?.alt || `Image ${selectedIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </Button>

            {totalImages > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}

            {totalImages > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium">
                {selectedIndex + 1} of {totalImages}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PropertyGallery
