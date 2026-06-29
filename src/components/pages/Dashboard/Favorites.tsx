import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites'
import { useProperties } from '@/hooks/useProperties'
import { PropertyGrid } from '@/components/organisms/PropertyGrid'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight, Home } from 'lucide-react'
import { Seo } from '@/components/atoms/Seo'

export const Favorites = () => {
  const { data: favorites, isLoading: favLoading } = useFavorites()
  const toggleFavorite = useToggleFavorite()

  const favoriteIds = useMemo(() => favorites?.map((f) => f.propertyId) || [], [favorites])

  const { data: propertiesData, isLoading: propsLoading } = useProperties({
    limit: 100,
    status: ['for_sale', 'for_rent', 'sold'],
  })

  const favoriteProperties = useMemo(
    () => propertiesData?.items?.filter((p) => favoriteIds.includes(p.propertyId)) || [],
    [propertiesData, favoriteIds]
  )

  const isLoading = favLoading || propsLoading

  return (
    <>
      <Seo title="Favorites" description="Your saved properties" noindex nofollow />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500" />
              My Favorites
            </h1>
            <p className="mt-2 text-muted-foreground">
              Properties you’ve saved for later. We’ll keep them right here.
            </p>
          </div>
          {!isLoading && favoriteProperties.length > 0 && (
            <p className="text-sm text-muted-foreground font-medium">
              {favoriteProperties.length} saved{' '}
              {favoriteProperties.length === 1 ? 'property' : 'properties'}
            </p>
          )}
        </div>

        {isLoading ? (
          <PropertyGrid properties={[]} loading columns={3} />
        ) : favoriteProperties.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <PropertyGrid
              properties={favoriteProperties}
              variant="grid"
              columns={3}
              onSave={(id) => toggleFavorite.mutate({ propertyId: id, propertyTitle: '' })}
              savedIds={favoriteIds}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-card rounded-2xl border border-dashed border-border shadow-sm"
          >
            <div className="rounded-full bg-muted p-4 mb-6">
              <Heart className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              No favorites yet
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Tap the heart icon on any property to save it here for quick access later.
            </p>
            <Link to="/properties">
              <Button
                variant="outline"
                size="lg"
                className="rounded-full gap-2 shadow-sm hover:shadow-md transition-shadow"
              >
                <Home className="h-4 w-4" />
                Browse Properties
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}

export default Favorites
