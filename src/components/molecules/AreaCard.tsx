import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, MapPin } from 'lucide-react'
import { Area } from '@/types'
import { cn } from '@/lib/helpers/cn'
import { OptimizedImage } from '@/components/atoms/OptimizedImage'

interface AreaCardProps {
  area: Area
  className?: string
}

export const AreaCard = ({ area, className }: AreaCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link
        to={`/areas/${area.slug}`}
        className={cn(
          'group relative block overflow-hidden rounded-2xl border border-transparent bg-card shadow-sm transition-all duration-300 hover:shadow-card hover:border-gold-500/30 hover:-translate-y-1',
          className
        )}
        aria-label={`Explore properties in ${area.name}`}
      >
        <div className="relative aspect-[4/3] w-full">
          {area.imageURL ? (
            <OptimizedImage
              src={area.imageURL}
              alt={area.name}
              className="absolute inset-0 h-full w-full"
              objectFit="cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20 text-primary">
              <Building2 className="h-10 w-10 mb-2 opacity-50" />
              <span className="text-xs font-medium uppercase tracking-wider opacity-60">
                Coming Soon
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <h3 className="font-serif text-xl font-semibold leading-tight drop-shadow-md">
              {area.name}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-white/85">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {area.propertyCount} {area.propertyCount === 1 ? 'property' : 'properties'}
              </span>
            </div>
          </div>

          {/* Subtle accent border on hover */}
          <div className="absolute inset-x-4 bottom-4 h-0.5 bg-white/0 group-hover:bg-white/30 transition-colors duration-300 rounded-full" />
        </div>
      </Link>
    </motion.article>
  )
}

export default AreaCard
