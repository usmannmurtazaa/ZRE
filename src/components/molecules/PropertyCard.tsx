import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Property } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MapPin, Maximize2, Bed, Bath } from 'lucide-react'
import { formatPrice } from '@/lib/helpers/currency'
import { cn } from '@/lib/helpers/cn'
import { OptimizedImage } from '@/components/atoms/OptimizedImage'

interface PropertyCardProps {
  property: Property
  variant?: 'grid' | 'list'
  onSave?: (id: string) => void
  isSaved?: boolean
  className?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export const PropertyCard = ({
  property,
  variant = 'grid',
  onSave,
  isSaved = false,
  className,
}: PropertyCardProps) => {
  const mainImage =
    property.images?.find((img) => img.isMain)?.url ||
    property.images?.[0]?.url ||
    '/images/default-property.jpg'

  const statusLabel =
    property.status === 'for_sale'
      ? 'For Sale'
      : property.status === 'for_rent'
        ? 'For Rent'
        : property.status === 'sold'
          ? 'Sold'
          : property.status

  const statusVariant =
    property.status === 'for_sale'
      ? 'default'
      : property.status === 'for_rent'
        ? 'secondary'
        : property.status === 'sold'
          ? 'outline'
          : 'secondary'

  const featuredBadge = property.isFeatured ? (
    <Badge
      variant="outline"
      className="backdrop-blur-md bg-card/80 border-gold-500/40 text-gold-600 dark:text-gold-400 font-medium"
    >
      Featured
    </Badge>
  ) : null

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSave?.(property.propertyId)
  }

  const statusAndFeatured = (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge variant={statusVariant} className="bg-opacity-90">
        {statusLabel}
      </Badge>
      {featuredBadge}
    </div>
  )

  const priceDisplay = (
    <div className="text-xl lg:text-2xl font-bold text-primary leading-tight tracking-tight">
      {formatPrice(property.price)}
    </div>
  )

  const location = (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <MapPin className="w-4 h-4 shrink-0" />
      <span className="truncate">{property.area}</span>
    </div>
  )

  const sizeAndRooms = (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span className="flex items-center gap-1">
        <Maximize2 className="w-4 h-4" /> {property.sizeSqYds} sq yd
      </span>
      {property.bedrooms && (
        <span className="flex items-center gap-1">
          <Bed className="w-4 h-4" /> {property.bedrooms}
        </span>
      )}
      {property.bathrooms && (
        <span className="flex items-center gap-1">
          <Bath className="w-4 h-4" /> {property.bathrooms}
        </span>
      )}
    </div>
  )

  if (variant === 'list') {
    return (
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className={cn(
          'group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-card hover:border-gold-500/30 transition-all duration-300',
          className
        )}
        role="article"
        aria-label={`Property: ${property.title}`}
      >
        <Link
          to={`/properties/${property.slug}`}
          className="sm:w-48 sm:h-full h-48 rounded-lg overflow-hidden shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2"
          tabIndex={0}
        >
          <OptimizedImage
            src={mainImage}
            alt={property.title}
            className="w-full h-full"
            objectFit="cover"
          />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              {statusAndFeatured}
              <Link to={`/properties/${property.slug}`} tabIndex={-1}>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-card-foreground hover:text-primary transition-colors line-clamp-1">
                  {property.title}
                </h3>
              </Link>
            </div>
            <div className="text-right shrink-0">{priceDisplay}</div>
          </div>
          <div className="mt-1">{location}</div>
          <div className="mt-2">{sizeAndRooms}</div>
          <div className="mt-auto pt-3 flex items-center gap-2">
            <Button size="sm" asChild>
              <Link to={`/properties/${property.slug}`}>View Details</Link>
            </Button>
            {onSave && (
              <motion.button
                onClick={handleSaveClick}
                whileTap={{ scale: 0.9 }}
                className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:text-red-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2"
                aria-label={isSaved ? 'Remove from saved' : 'Save property'}
                title={isSaved ? 'Saved' : 'Save'}
              >
                <Heart
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isSaved ? 'fill-red-500 text-red-500' : ''
                  )}
                />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    )
  }

  // Grid variant (default)
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        'group relative flex flex-col rounded-2xl border border-border bg-card shadow-sm hover:shadow-card hover:border-gold-500/30 transition-all duration-300 overflow-hidden',
        className
      )}
      role="article"
      aria-label={`Property: ${property.title}`}
    >
      <Link
        to={`/properties/${property.slug}`}
        className="relative aspect-[4/3] overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2"
      >
        <OptimizedImage
          src={mainImage}
          alt={property.title}
          className="w-full h-full"
          objectFit="cover"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          {statusAndFeatured}
        </div>
        {onSave && (
          <motion.button
            onClick={handleSaveClick}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm rounded-full p-2 text-muted-foreground hover:text-red-500 transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-2"
            aria-label={isSaved ? 'Remove from saved' : 'Save property'}
            title={isSaved ? 'Saved' : 'Save'}
          >
            <Heart
              className={cn(
                'w-5 h-5 transition-colors',
                isSaved ? 'fill-red-500 text-red-500' : ''
              )}
            />
          </motion.button>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <Link to={`/properties/${property.slug}`} tabIndex={-1}>
          <h3 className="font-semibold text-lg leading-tight text-card-foreground hover:text-primary transition-colors line-clamp-2">
            {property.title}
          </h3>
        </Link>
        <div className="mt-1">{location}</div>
        <div className="mt-2 flex items-center justify-between">
          {priceDisplay}
          <div className="text-xs text-muted-foreground">{sizeAndRooms}</div>
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-3">
          {property.sizeSqYds && <span>{property.sizeSqYds} sq yd</span>}
          {property.bedrooms && <span>• {property.bedrooms} beds</span>}
          {property.bathrooms && <span>• {property.bathrooms} baths</span>}
          {property.status === 'sold' && (
            <Badge variant="outline" className="ml-auto text-xs">
              Sold
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default PropertyCard
