import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SearchBar } from '@/components/molecules/SearchBar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/helpers/cn'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroSlide {
  title: string
  subtitle: string
  backgroundImage?: string
  ctaText?: string
  ctaLink?: string
  searchPlaceholder?: string
}

interface HeroSectionProps {
  slides?: HeroSlide[]
  /** Kept for backward compatibility – used when `slides` is not provided */
  title?: string
  subtitle?: string
  backgroundImage?: string
  onSearch?: (query: string) => void
  ctaText?: string
  ctaLink?: string
  className?: string
}

const AUTO_PLAY_DELAY = 6000 // 6 seconds

export const HeroSection = ({
  slides,
  title,
  subtitle,
  backgroundImage,
  onSearch,
  ctaText,
  ctaLink,
  className,
}: HeroSectionProps) => {
  // Normalize: either use the slides array or create a single slide from legacy props
  const allSlides: HeroSlide[] =
    slides && slides.length > 0
      ? slides
      : [{ title: title || '', subtitle: subtitle || '', backgroundImage, ctaText, ctaLink }]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % allSlides.length) + allSlides.length) % allSlides.length)
    },
    [allSlides.length]
  )

  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo])
  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo])

  // Autoplay
  useEffect(() => {
    if (isHovered || allSlides.length <= 1) return
    timerRef.current = setInterval(next, AUTO_PLAY_DELAY)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isHovered, next, allSlides.length])

  const currentSlide = allSlides[currentIndex]
  if (!currentSlide) return null // shouldn't happen

  return (
    <section
      className={cn(
        'relative flex items-center justify-center overflow-hidden',
        'min-h-[80vh] md:min-h-[90vh]',
        'text-white',
        className
      )}
      aria-label="Property showcase"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background image transitions */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
        >
          {currentSlide.backgroundImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${currentSlide.backgroundImage})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </motion.div>
      </AnimatePresence>

      {/* Grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Navigation arrows */}
      {allSlides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl"
          >
            {/* Title */}
            <h1
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-balance"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              {currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p
              className="mt-6 text-lg md:text-xl lg:text-2xl leading-relaxed text-white/90 max-w-3xl mx-auto text-balance"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
            >
              {currentSlide.subtitle}
            </p>

            {/* Search Bar (if onSearch is provided globally) */}
            {onSearch && (
              <div className="mt-10 max-w-2xl mx-auto">
                <SearchBar
                  onSearch={onSearch}
                  placeholder={
                    currentSlide.searchPlaceholder ||
                    'Search properties by location, type, or keyword...'
                  }
                />
              </div>
            )}

            {/* CTA Button */}
            {currentSlide.ctaText && currentSlide.ctaLink && (
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 bg-gold-500 text-brand-900 hover:bg-gold-600"
                >
                  <a href={currentSlide.ctaLink}>
                    {currentSlide.ctaText}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      {allSlides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist">
          {allSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Slide ${index + 1}`}
              className={cn(
                'h-3 w-3 rounded-full transition-all duration-300',
                index === currentIndex
                  ? 'bg-gold-500 scale-110 shadow-md'
                  : 'bg-white/50 hover:bg-white/70'
              )}
            />
          ))}
        </div>
      )}

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 z-[2] h-16 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
    </section>
  )
}

export default HeroSection
