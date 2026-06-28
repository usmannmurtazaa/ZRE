import { useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Property } from '@/types'
import { PropertyCard } from '@/components/molecules/PropertyCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Search, Building2 } from 'lucide-react'
import { cn } from '@/lib/helpers/cn'

interface PropertyGridProps {
  properties: Property[]
  loading?: boolean
  variant?: 'grid' | 'list'
  columns?: 2 | 3 | 4
  onSave?: (id: string) => void
  savedIds?: string[]
  className?: string
  /** Custom empty state message */
  emptyMessage?: string
  /** Optional action for empty state (e.g., link to clear filters) */
  emptyAction?: {
    label: string
    onClick: () => void
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

export const PropertyGrid = ({
  properties,
  loading = false,
  variant = 'grid',
  columns = 3,
  onSave,
  savedIds = [],
  className,
  emptyMessage = 'No properties found',
  emptyAction,
}: PropertyGridProps) => {
  const gridColumnsClass = useMemo(
    () => ({
      2: 'sm:grid-cols-2',
      3: 'sm:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    }),
    []
  )

  // Loading state
  if (loading) {
    const skeletonCount = variant === 'grid' ? (columns === 2 ? 4 : columns === 3 ? 6 : 8) : 4

    return (
      <div
        className={cn(
          variant === 'grid'
            ? `grid grid-cols-1 ${gridColumnsClass[columns]} gap-6`
            : 'flex flex-col gap-4',
          className
        )}
        aria-busy="true"
        aria-label="Loading properties"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-2xl border border-border bg-card overflow-hidden',
              variant === 'list' && 'flex flex-col sm:flex-row'
            )}
          >
            <Skeleton
              className={cn(
                'w-full bg-muted',
                variant === 'list'
                  ? 'sm:w-48 h-48 sm:h-full aspect-[4/3] sm:aspect-auto'
                  : 'aspect-[4/3]'
              )}
            />
            <div className="p-4 space-y-3 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between items-end">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Empty state
  if (properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'flex flex-col items-center justify-center py-20 px-4 text-center',
          className
        )}
      >
        <div className="rounded-2xl bg-muted p-6 mb-6">
          <Building2 className="h-12 w-12 text-muted-foreground/60" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-card-foreground mb-2">
          {emptyMessage}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Try adjusting your filters or search criteria to discover more properties.
        </p>
        {emptyAction && (
          <Button onClick={emptyAction.onClick} variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            {emptyAction.label}
          </Button>
        )}
      </motion.div>
    )
  }

  // Data grid
  return (
    <div
      className={cn(
        variant === 'grid'
          ? `grid grid-cols-1 ${gridColumnsClass[columns]} gap-6`
          : 'flex flex-col gap-4',
        className
      )}
      role="list"
      aria-label="Property listings"
    >
      <AnimatePresence mode="popLayout">
        {properties.map((property, index) => (
          <motion.div
            key={property.propertyId}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            custom={index}
            layout
          >
            <PropertyCard
              property={property}
              variant={variant}
              onSave={onSave}
              isSaved={savedIds.includes(property.propertyId)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export default PropertyGrid
