import { Seo } from '@/components/atoms/Seo'
import { StructuredData } from '@/components/atoms/StructuredData'
import { generateBreadcrumbSchema, generateOrganizationSchema } from '@/lib/seo/schemas'
import { useAreas } from '@/hooks/useAreas'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { MapPin, Building2, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice } from '@/lib/helpers/currency'

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export const Areas = () => {
  const { data: areas, isLoading } = useAreas()

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Areas', item: '/areas' },
  ]

  const pageTitle = 'Prime Locations in Karachi | Zain Real Estate'
  const pageDescription =
    'Explore prime real estate areas in Karachi including Mehran Town, Korangi, Hawksbay Scheme 42, and MDA Scheme 1. Find your ideal property location.'

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        type="website"
        keywords={[
          'Karachi areas',
          'real estate locations',
          'Mehran Town',
          'Korangi',
          'Hawksbay 42',
          'MDA Scheme 1',
        ]}
        url={`${import.meta.env.VITE_APP_URL || 'https://zainrealestate.netlify.app'}/areas`}
      />
      <StructuredData schema={generateOrganizationSchema()} />
      <StructuredData schema={generateBreadcrumbSchema(breadcrumbItems)} />

      <div className="bg-background min-h-screen">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            >
              Areas We Cover
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              Discover prime residential and commercial locations across Karachi. Each area is
              handpicked for its investment potential and legal clarity.
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 md:py-20">
          <div className="container px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInSection}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} variants={itemFadeUp}>
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="h-6 w-2/3 mt-3" />
                    <Skeleton className="h-4 w-1/3 mt-1" />
                  </motion.div>
                ))}
              </motion.div>
            ) : areas && areas.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInSection}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              >
                {areas.map((area) => (
                  <motion.div key={area.areaId} variants={itemFadeUp}>
                    <Link
                      to={`/areas/${area.slug}`}
                      className="group block rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                      aria-label={`Explore ${area.name}`}
                    >
                      {/* Area Image */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        {area.imageURL ? (
                          <img
                            src={area.imageURL}
                            alt={area.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                            <Building2 className="h-12 w-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="font-serif text-xl font-semibold">{area.name}</h3>
                          <p className="text-sm text-white/80">Karachi</p>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5 space-y-3">
                        {area.description ? (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {area.description}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            No description available.
                          </p>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {area.propertyCount}{' '}
                            {area.propertyCount === 1 ? 'property' : 'properties'}
                          </span>
                          {area.priceRange?.min ? (
                            <span className="font-semibold text-foreground">
                              From {formatPrice(area.priceRange.min)}
                            </span>
                          ) : (
                            <span className="font-medium text-muted-foreground">
                              Price on request
                            </span>
                          )}
                        </div>

                        <div className="pt-2 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full group/btn transition-all"
                          >
                            Explore Area
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <MapPin className="h-12 w-12 text-muted-foreground/40 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No areas found</h2>
                <p className="text-muted-foreground">
                  Please check back later. We are adding new areas regularly.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}

export default Areas
