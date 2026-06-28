import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Testimonial } from '@/types'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/helpers/cn'

interface TestimonialCardProps {
  testimonial: Testimonial
  className?: string
}

export const TestimonialCard = ({ testimonial, className }: TestimonialCardProps) => {
  const initials =
    testimonial.clientName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'

  // Ensure the rating is a number and > 0 for the star display
  const displayRating: number | undefined =
    testimonial.rating != null && testimonial.rating > 0 ? testimonial.rating : undefined

  return (
    <motion.blockquote
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-card hover:border-gold-500/40',
        className
      )}
      itemScope
      itemType="https://schema.org/Review"
    >
      {/* Decorative quote icon */}
      <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-600 dark:text-gold-400">
        <Quote className="h-5 w-5" />
      </div>

      {/* Rating stars */}
      {displayRating !== undefined && (
        <div
          className="mb-4 flex items-center gap-0.5"
          aria-label={`${displayRating} out of 5 stars`}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                'h-5 w-5',
                i < displayRating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-transparent text-muted-foreground/40'
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      )}

      {/* Testimonial content */}
      <p className="flex-1 text-base leading-relaxed text-card-foreground/80 italic mb-6">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Client info */}
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border">
        <Avatar className="h-11 w-11 border-2 border-border ring-2 ring-transparent group-hover:ring-gold-500/30 transition-all duration-300">
          {testimonial.clientImage ? (
            <AvatarImage src={testimonial.clientImage} alt={testimonial.clientName} />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-card-foreground text-sm" itemProp="author">
            {testimonial.clientName}
          </div>
          {testimonial.propertyType && (
            <div className="text-xs text-muted-foreground">{testimonial.propertyType}</div>
          )}
        </div>
      </div>

      {/* Hidden structured data for review */}
      <meta itemProp="reviewBody" content={testimonial.content} />
      <meta itemProp="reviewRating" content={displayRating?.toString()} />
    </motion.blockquote>
  )
}

export default TestimonialCard
