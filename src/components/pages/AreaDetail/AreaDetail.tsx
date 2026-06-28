import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Seo } from '@/components/atoms/Seo'
import { StructuredData } from '@/components/atoms/StructuredData'
import { generateAreaSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'
import { useAreaBySlug } from '@/hooks/useAreas'
import { useProperties } from '@/hooks/useProperties'
import { PropertyGrid } from '@/components/organisms/PropertyGrid'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building2, TrendingUp } from 'lucide-react'

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

function LoadingSkeleton() {
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-4 mb-8">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
      </div>
      <Skeleton className="aspect-[16/9] w-full rounded-2xl mb-8" />
      <Skeleton className="h-32 w-full mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export const AreaDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: area, isLoading: areaLoading } = useAreaBySlug(slug)
  const { data: properties, isLoading: propertiesLoading } = useProperties({
    area: area ? [area.name] : [],
    limit: 20,
  })

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Areas', item: '/areas' },
    ...(area ? [{ name: area.name, item: `/areas/${area.slug}` }] : []),
  ]

  if (areaLoading || !area) {
    return <LoadingSkeleton />
  }

  const pageTitle = `${area.name} Property Guide | Zain Real Estate`
  const pageDescription =
    area.description?.slice(0, 160) ||
    `Explore ${area.name} properties in Karachi. Find residential, commercial & industrial options in ${area.name} with Zain Real Estate.`
  const pageKeywords = [
    area.name,
    `${area.name} properties`,
    `${area.name} real estate`,
    'Karachi real estate',
    'property investment',
    'approved plots',
    ...(area.propertyTypes || []),
  ]

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        image={area.imageURL ?? undefined}
        type="website"
        keywords={pageKeywords}
        url={`${(import.meta as any).env.VITE_APP_URL || 'https://zainrealestate.netlify.app'}/areas/${area.slug}`}
      />
      <StructuredData schema={generateAreaSchema(area)} />
      <StructuredData schema={generateBreadcrumbSchema(breadcrumbItems)} />

      <div className="bg-background min-h-screen">
        <div className="container px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-primary dark:hover:text-gold-500 transition-colors font-medium"
            >
              Home
            </Link>
            <span className="opacity-50">/</span>
            <Link
              to="/areas"
              className="hover:text-primary dark:hover:text-gold-500 transition-colors font-medium"
            >
              Areas
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-foreground truncate max-w-[200px]">{area.name}</span>
          </motion.nav>

          {/* Hero image / header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative aspect-[21/9] md:aspect-[3/1] rounded-2xl overflow-hidden mb-8 shadow-lg"
          >
            {area.imageURL ? (
              <img
                src={area.imageURL}
                alt={`${area.name} in Karachi`}
                className="w-full h-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-primary-foreground/80">
                <Building2 className="h-16 w-16 opacity-30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {area.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm sm:text-base text-white/80">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  {area.propertyCount ?? 0}{' '}
                  {(area.propertyCount ?? 0) === 1 ? 'property' : 'properties'}
                </span>
                {area.propertyTypes && area.propertyTypes.length > 0 && (
                  <span className="hidden sm:flex items-center gap-1.5">
                    <span className="opacity-50">·</span>
                    {area.propertyTypes.slice(0, 3).join(', ')}
                  </span>
                )}
                {area.mapCoordinates && (
                  <span className="flex items-center gap-1.5">
                    <span className="opacity-50">·</span>
                    <MapPin className="h-3.5 w-3.5" />
                    View on map
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Description section */}
          {area.description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-10 bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8"
            >
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                About {area.name}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">{area.description}</p>
              {area.propertyTypes && area.propertyTypes.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {area.propertyTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className="capitalize bg-primary/10 text-primary border-primary/20 text-xs dark:bg-primary/5 dark:text-gold-500 dark:border-gold-500/30"
                    >
                      {type.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              )}
              {area.priceRange && (
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    Price range: PKR {area.priceRange.min.toLocaleString()} –{' '}
                    {area.priceRange.max.toLocaleString()}
                  </span>
                </div>
              )}
            </motion.div>
          )}

          {/* Properties heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 flex items-end justify-between"
          >
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Properties in {area.name}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {propertiesLoading ? 'Loading...' : `${properties?.total ?? 0} listings`}
              </p>
            </div>
            {!propertiesLoading && (properties?.items?.length ?? 0) > 0 && (
              <Link
                to="/properties"
                className="text-sm font-medium text-primary hover:text-primary/80 dark:hover:text-gold-500 transition-colors"
              >
                View all listings
              </Link>
            )}
          </motion.div>

          {/* Property Grid */}
          <motion.div initial="hidden" animate="visible" variants={fadeInSection} className="mb-12">
            <PropertyGrid
              properties={properties?.items || []}
              loading={propertiesLoading}
              columns={3}
              emptyMessage={`No properties available in ${area.name} right now.`}
              emptyAction={{
                label: 'Browse all areas',
                onClick: () => (window.location.href = '/areas'),
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default AreaDetail
