import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Seo } from '@/components/atoms/Seo'
import { StructuredData } from '@/components/atoms/StructuredData'
import { generateBreadcrumbSchema } from '@/lib/seo/schemas'
import { useProperties } from '@/hooks/useProperties'
import { FilterPanel } from '@/components/organisms/FilterPanel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SlidersHorizontal, X, MapPin, Building2, ArrowRight } from 'lucide-react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { formatPrice } from '@/lib/helpers/currency'
import type { Property } from '@/types/property'

// ── Helper: group properties by area → category ─────────────────────
interface CategoryGroup {
  category: string
  sizes: number[]
  minPrice: number
  maxPrice: number
}

interface AreaGroup {
  area: string
  areaId: string
  categories: Record<string, CategoryGroup>
}

function groupPropertiesByAreaAndCategory(properties: Property[]): AreaGroup[] {
  const map = new Map<string, AreaGroup>()
  for (const prop of properties) {
    if (!map.has(prop.area)) {
      map.set(prop.area, {
        area: prop.area,
        areaId: prop.areaId,
        categories: {},
      })
    }
    const group = map.get(prop.area)!
    const cat = prop.subtype || prop.type
    if (!group.categories[cat]) {
      group.categories[cat] = {
        category: cat,
        sizes: [],
        minPrice: Infinity,
        maxPrice: -Infinity,
      }
    }
    const catGroup = group.categories[cat]
    catGroup.sizes.push(prop.sizeSqYds)
    if (prop.price < catGroup.minPrice) catGroup.minPrice = prop.price
    if (prop.price > catGroup.maxPrice) catGroup.maxPrice = prop.price
  }
  for (const [, group] of map) {
    for (const cat of Object.values(group.categories)) {
      cat.sizes = [...new Set(cat.sizes)].sort((a, b) => a - b)
      if (cat.minPrice === Infinity) cat.minPrice = 0
      if (cat.maxPrice === -Infinity) cat.maxPrice = 0
    }
  }
  return Array.from(map.values())
}

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showMobileFilter, setShowMobileFilter] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (!isMobile && showMobileFilter) setShowMobileFilter(false)
  }, [isMobile, showMobileFilter])

  useEffect(() => {
    document.body.style.overflow = showMobileFilter ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [showMobileFilter])

  const searchQuery = searchParams.get('search') || undefined
  const type = searchParams.get('type') ? searchParams.get('type')?.split(',') : undefined
  const area = searchParams.get('area') ? searchParams.get('area')?.split(',') : undefined
  const minPrice = searchParams.get('minPrice')
    ? parseInt(searchParams.get('minPrice')!)
    : undefined
  const maxPrice = searchParams.get('maxPrice')
    ? parseInt(searchParams.get('maxPrice')!)
    : undefined
  const sortBy = (searchParams.get('sortBy') as any) || undefined

  const { data, isLoading } = useProperties({
    page: 1,
    limit: 500,
    search: searchQuery,
    type: type as any,
    area,
    minPrice,
    maxPrice,
  })

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const currentFilters: any = {
    type: type || [],
    area: area || [],
    minPrice: minPrice || 0,
    maxPrice: maxPrice || 1000000000,
    sortBy: sortBy || 'newest',
  }

  const handleFilterChange = useCallback(
    (filters: any) => {
      const newParams = new URLSearchParams(searchParams)
      if (filters.type?.length) newParams.set('type', filters.type.join(','))
      else newParams.delete('type')
      if (filters.area?.length) newParams.set('area', filters.area.join(','))
      else newParams.delete('area')
      if (filters.minPrice !== undefined && filters.minPrice > 0)
        newParams.set('minPrice', String(filters.minPrice))
      else newParams.delete('minPrice')
      if (filters.maxPrice !== undefined && filters.maxPrice < 1000000000)
        newParams.set('maxPrice', String(filters.maxPrice))
      else newParams.delete('maxPrice')
      newParams.delete('sortBy')
      newParams.set('page', '1')
      setSearchParams(newParams)
      if (showMobileFilter) setShowMobileFilter(false)
    },
    [searchParams, setSearchParams, showMobileFilter]
  )

  const handleClearFilters = useCallback(() => {
    setSearchParams({})
    if (showMobileFilter) setShowMobileFilter(false)
  }, [setSearchParams, showMobileFilter])

  const areaGroups = useMemo(() => groupPropertiesByAreaAndCategory(items), [items])

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Properties', item: '/properties' },
  ]

  const pageTitle = useMemo(() => {
    if (area?.length) return `Properties in ${area.join(', ')} – Zain Real Estate`
    if (type?.length)
      return `${type.map((t) => t.replace('_', ' ')).join(', ')} Properties in Karachi`
    return 'Properties for Sale & Rent in Karachi'
  }, [type, area])

  const pageDescription = useMemo(() => {
    let desc =
      'Browse residential, commercial, and industrial properties in Karachi. Find your ideal property with Zain Real Estate.'
    if (type?.length)
      desc = `Discover ${type.join(', ')} properties in Karachi. Verified listings with full legal documentation.`
    if (area?.length)
      desc = `Explore properties in ${area.join(', ')}. Find your dream property with Zain Real Estate.`
    if (minPrice && maxPrice)
      desc += ` Price range: PKR ${minPrice.toLocaleString()} – ${maxPrice.toLocaleString()}.`
    return desc
  }, [type, area, minPrice, maxPrice])

  const isFilterActive =
    (type && type.length > 0) ||
    (area && area.length > 0) ||
    (minPrice && minPrice > 0) ||
    (maxPrice && maxPrice < 1000000000)
  const activeFilterCount =
    (type?.length ?? 0) +
    (area?.length ?? 0) +
    (minPrice && minPrice > 0 ? 1 : 0) +
    (maxPrice && maxPrice < 1000000000 ? 1 : 0)

  return (
    <>
      <Seo
        title={pageTitle}
        description={pageDescription}
        type="website"
        keywords={[
          'properties Karachi',
          'buy property',
          'real estate Karachi',
          ...(type || []),
          ...(area || []),
        ]}
      />
      <StructuredData schema={generateBreadcrumbSchema(breadcrumbItems)} />

      <div className="bg-muted/30 min-h-screen">
        <div className="bg-card border-b border-border">
          <div className="container px-4 sm:px-6 lg:px-8 py-4 md:py-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {isLoading ? (
                  <span className="inline-block w-20 h-4 bg-muted rounded animate-pulse" />
                ) : (
                  `${total} ${total === 1 ? 'property' : 'properties'} found`
                )}
                {isFilterActive && (
                  <span className="text-xs text-primary font-medium">
                    · {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                  </span>
                )}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="md:hidden rounded-xl gap-2 font-medium relative"
              onClick={() => setShowMobileFilter(true)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="container px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="hidden md:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <FilterPanel
                  filters={currentFilters}
                  onApply={handleFilterChange}
                  onClear={handleClearFilters}
                />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {isFilterActive && (
                <div className="hidden md:flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-muted-foreground mr-1">
                    Active filters:
                  </span>
                  {type?.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                    >
                      {t.replace('_', ' ')}
                      <button
                        onClick={() => {
                          const newTypes = type.filter((x) => x !== t)
                          handleFilterChange({ ...currentFilters, type: newTypes })
                        }}
                        className="ml-0.5 hover:text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {area?.map((a) => (
                    <span
                      key={a}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20"
                    >
                      {a}
                      <button
                        onClick={() => {
                          const newAreas = area.filter((x) => x !== a)
                          handleFilterChange({ ...currentFilters, area: newAreas })
                        }}
                        className="ml-0.5 hover:text-primary"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground underline"
                  >
                    Clear all
                  </button>
                </div>
              )}

              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader className="p-5 pb-0">
                          <Skeleton className="h-6 w-2/3" />
                          <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent className="p-5 space-y-3">
                          {[1, 2].map((j) => (
                            <div
                              key={j}
                              className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                            >
                              <Skeleton className="h-4 w-1/4" />
                              <Skeleton className="h-4 w-1/5" />
                              <Skeleton className="h-4 w-1/5" />
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>
                ) : areaGroups.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <Building2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      No properties found
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mb-6">
                      Try adjusting your filters or search criteria to discover more properties.
                    </p>
                    {isFilterActive && (
                      <Button variant="outline" size="sm" onClick={handleClearFilters}>
                        Clear Filters
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {areaGroups.map((group) => (
                      <motion.div
                        key={group.area}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow">
                          <CardHeader className="p-5 sm:p-6 pb-3">
                            <CardTitle className="font-serif text-2xl font-semibold text-foreground flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-gold-500" />
                              {group.area}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Available categories and price ranges
                            </p>
                          </CardHeader>
                          <CardContent className="p-5 sm:p-6 pt-0">
                            <div className="divide-y divide-border">
                              {Object.entries(group.categories).map(([cat, catGroup]) => (
                                <div key={cat} className="py-4 first:pt-0 last:pb-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                    <h4 className="font-semibold text-foreground capitalize">
                                      {cat.replace('_', ' ')}
                                    </h4>
                                    <Badge
                                      variant="outline"
                                      className="w-fit text-xs bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-500/10 dark:text-gold-400 dark:border-gold-500/30"
                                    >
                                      {catGroup.sizes.length}{' '}
                                      {catGroup.sizes.length === 1 ? 'option' : 'options'}
                                    </Badge>
                                  </div>
                                  {catGroup.sizes.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-2">
                                      {catGroup.sizes.slice(0, 4).map((size) => (
                                        <span
                                          key={size}
                                          className="inline-flex items-center px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                                        >
                                          {size} sq yd
                                        </span>
                                      ))}
                                      {catGroup.sizes.length > 4 && (
                                        <span className="text-xs text-muted-foreground self-center">
                                          +{catGroup.sizes.length - 4} more
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {catGroup.minPrice > 0 && (
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium text-foreground">
                                        {formatPrice(catGroup.minPrice)}
                                      </span>
                                      {catGroup.maxPrice !== catGroup.minPrice && (
                                        <>
                                          {' '}
                                          –{' '}
                                          <span className="font-medium text-foreground">
                                            {formatPrice(catGroup.maxPrice)}
                                          </span>
                                        </>
                                      )}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Button variant="outline" size="sm" asChild>
                                <Link
                                  to={`/areas/${group.area.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="gap-2"
                                >
                                  View Properties in {group.area} <ArrowRight className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>

        <AnimatePresence>
          {showMobileFilter && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setShowMobileFilter(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-card shadow-2xl md:hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h2 className="font-serif text-lg font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-gold-500" />
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setShowMobileFilter(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <FilterPanel
                    filters={currentFilters}
                    onApply={handleFilterChange}
                    onClear={handleClearFilters}
                  />
                </div>
                <div className="border-t border-border px-4 py-4 flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                  <Button className="flex-1" onClick={() => setShowMobileFilter(false)}>
                    Show Results
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default Properties
