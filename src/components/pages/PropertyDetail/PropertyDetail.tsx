/// <reference types="vite/client" />

import { useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { usePropertyBySlug, useIncrementPropertyViews } from '@/hooks/useProperties'
import { useAreas } from '@/hooks/useAreas'
import { PropertyGallery } from '@/components/organisms/PropertyGallery'
import { ContactForm } from '@/components/organisms/ContactForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { useToggleFavorite, useFavorites } from '@/hooks/useFavorites'
import { useDispatch } from 'react-redux'
import { showToast } from '@/store/slices/uiSlice'
import { Seo } from '@/components/atoms/Seo'
import { StructuredData } from '@/components/atoms/StructuredData'
import { generatePropertySchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'
import { formatPrice } from '@/lib/helpers/currency'
import { cn } from '@/lib/helpers/cn'
import { SITE_CONFIG } from '@/lib/constants'
import {
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Heart,
  Share2,
  Eye,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Check,
  Building2,
  Clock,
  ShieldCheck,
} from 'lucide-react'

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
}

function DetailSkeleton() {
  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: property, isLoading } = usePropertyBySlug(slug)
  const { data: areas } = useAreas()
  const { user } = useAuth()
  const { data: favorites } = useFavorites()
  const toggleFavorite = useToggleFavorite()
  const incrementViews = useIncrementPropertyViews()
  const dispatch = useDispatch()

  useEffect(() => {
    if (property) {
      incrementViews.mutate(property.propertyId)
    }
  }, [property, incrementViews])

  const isSaved = useMemo(
    () => (user ? favorites?.some((fav) => fav.propertyId === property?.propertyId) : false),
    [user, favorites, property]
  )

  const handleSave = () => {
    if (!user) {
      dispatch(showToast({ message: 'Please log in to save properties.', type: 'error' }))
      return
    }
    if (!property) return
    toggleFavorite.mutate({
      propertyId: property.propertyId,
      propertyTitle: property.title,
    })
  }

  const handleShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: property?.title || 'Zain Real Estate Property',
          url: window.location.href,
        })
      } catch {
        // user cancelled – do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
        dispatch(showToast({ message: 'Link copied to clipboard', type: 'success' }))
      } catch {
        dispatch(showToast({ message: 'Failed to copy link', type: 'error' }))
      }
    }
  }

  if (isLoading || !property) {
    return <DetailSkeleton />
  }

  const areaData = areas?.find((a) => a.areaId === property.areaId)
  const mainImage =
    property.images?.find((img) => img.isMain)?.url ||
    property.images?.[0]?.url ||
    '/images/default-property.jpg'

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Properties', item: '/properties' },
    { name: property.title, item: `/properties/${property.slug}` },
  ]

  const statusLabel =
    property.status === 'for_sale'
      ? 'For Sale'
      : property.status === 'for_rent'
        ? 'For Rent'
        : property.status?.replace('_', ' ')

  return (
    <>
      <Seo
        title={property.title}
        description={property.description?.slice(0, 160)}
        image={mainImage}
        url={`${import.meta.env.VITE_APP_URL || 'https://zainrealestate.netlify.app'}/properties/${property.slug}`}
        type="product"
        keywords={[property.area, property.type, 'property', 'Karachi', 'real estate']}
        publishedTime={property.publishedAt?.toISOString()}
        modifiedTime={property.updatedAt?.toISOString()}
      />
      <StructuredData schema={generatePropertySchema(property)} />
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
              to="/properties"
              className="hover:text-primary dark:hover:text-gold-500 transition-colors font-medium"
            >
              Properties
            </Link>
            <span className="opacity-50">/</span>
            <span className="text-foreground truncate max-w-[200px]">{property.title}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column – Gallery & Details */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInSection}
              className="lg:col-span-2 space-y-8"
            >
              {/* Gallery */}
              <motion.div variants={itemFadeUp}>
                <PropertyGallery images={property.images || []} />
              </motion.div>

              {/* Title row */}
              <motion.div
                variants={itemFadeUp}
                className="flex flex-wrap items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {property.isFeatured && (
                      <Badge className="bg-gold-50 text-gold-700 border-gold-200 dark:bg-gold-500/10 dark:text-gold-400 dark:border-gold-500/30 text-xs">
                        Featured
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs font-medium capitalize',
                        property.status === 'for_sale'
                          ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                          : property.status === 'for_rent'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800'
                            : 'bg-muted text-muted-foreground border-border'
                      )}
                    >
                      {statusLabel}
                    </Badge>
                  </div>
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
                    <MapPin className="h-4 w-4 text-gold-500" />
                    <span className="text-sm">{property.area}</span>
                    {property.address && (
                      <>
                        <span className="opacity-40">·</span>
                        <span className="text-sm">{property.address}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleSave}
                      className={cn(
                        'h-10 w-10 rounded-xl border-border transition-colors',
                        isSaved
                          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                          : 'hover:bg-muted'
                      )}
                      aria-label={isSaved ? 'Remove from favorites' : 'Save to favorites'}
                    >
                      <Heart
                        className={cn(
                          'h-5 w-5 transition-colors',
                          isSaved ? 'fill-red-500 text-red-500' : ''
                        )}
                      />
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl border-border hover:bg-muted transition-colors"
                      onClick={handleShare}
                      aria-label="Share property"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Price & Quick Stats */}
              <motion.div
                variants={itemFadeUp}
                className="flex flex-wrap items-end gap-4 sm:gap-6 p-5 rounded-2xl bg-primary/10 border border-primary/20"
              >
                <div>
                  <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                    Price
                  </p>
                  <div className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                    {formatPrice(property.price)}
                  </div>
                </div>
                <Separator orientation="vertical" className="hidden sm:block h-10" />
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{property.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>{property.inquiries || 0} inquiries</span>
                </div>
              </motion.div>

              {/* Property details grid */}
              <motion.div variants={itemFadeUp}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border p-4 transition-all hover:shadow-sm hover:border-gold-500/30">
                    <Maximize2 className="h-5 w-5 mb-2 text-gold-500" />
                    <span className="text-lg font-bold text-foreground">{property.sizeSqYds}</span>
                    <span className="text-xs text-muted-foreground">Sq Yds</span>
                  </div>
                  {property.bedrooms && property.bedrooms > 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border p-4 transition-all hover:shadow-sm hover:border-gold-500/30">
                      <Bed className="h-5 w-5 mb-2 text-gold-500" />
                      <span className="text-lg font-bold text-foreground">{property.bedrooms}</span>
                      <span className="text-xs text-muted-foreground">Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms && property.bathrooms > 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border p-4 transition-all hover:shadow-sm hover:border-gold-500/30">
                      <Bath className="h-5 w-5 mb-2 text-gold-500" />
                      <span className="text-lg font-bold text-foreground">
                        {property.bathrooms}
                      </span>
                      <span className="text-xs text-muted-foreground">Bathrooms</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-card border border-border p-4 transition-all hover:shadow-sm hover:border-gold-500/30">
                    <Building2 className="h-5 w-5 mb-2 text-gold-500" />
                    <span className="text-sm font-bold text-foreground capitalize">
                      {property.subtype || property.type}
                    </span>
                    <span className="text-xs text-muted-foreground">Type</span>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              {property.description && (
                <motion.div variants={itemFadeUp}>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-3">
                    Description
                  </h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </div>
                </motion.div>
              )}

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <motion.div variants={itemFadeUp}>
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                    Features &amp; Amenities
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((feature, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-muted border border-border text-sm text-foreground font-medium"
                      >
                        <Check className="h-4 w-4 text-emerald-500" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Area information */}
              {areaData && (
                <motion.div
                  variants={itemFadeUp}
                  className="rounded-2xl bg-card border border-border p-6"
                >
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gold-500" />
                    Area Information — {areaData.name}
                  </h2>
                  {areaData.description ? (
                    <p className="text-muted-foreground leading-relaxed">{areaData.description}</p>
                  ) : (
                    <p className="text-muted-foreground">
                      {areaData.name} is one of Karachi&apos;s prominent areas for property
                      investment.
                    </p>
                  )}
                  {areaData.propertyCount !== undefined && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      <Building2 className="h-3.5 w-3.5 inline mr-1" />
                      {areaData.propertyCount}{' '}
                      {areaData.propertyCount === 1 ? 'property' : 'properties'} available in this
                      area
                    </p>
                  )}
                </motion.div>
              )}

              {/* Trust note */}
              <motion.div
                variants={itemFadeUp}
                className="flex items-start gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 p-4"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  This property is 100% legally approved with complete documentation. All titles are
                  verified by Zain Real Estate&apos;s legal team.
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column – Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* ── Contact Info Card (replaces AgentCard) ─────────── */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">
                      Contact Zain Real Estate
                    </h4>
                    <p className="text-xs text-muted-foreground">Call or message us directly</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4 text-gold-500" />
                    {SITE_CONFIG.phone}
                  </a>
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-4 w-4 text-gold-500" />
                    {SITE_CONFIG.email}
                  </a>
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MessageCircle className="h-4 w-4 text-gold-500" />
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Quick contact CTA */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl gap-2 border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/40 transition-colors"
                  asChild
                >
                  <a href={`tel:${SITE_CONFIG.phone}`}>
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                </Button>
                <Button
                  className="flex-1 rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors"
                  asChild
                >
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>

              {/* Contact Form */}
              <div className="rounded-2xl border border-border bg-card shadow-sm p-5 sm:p-6">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                  Send an Inquiry
                </h3>
                <p className="text-xs text-muted-foreground mb-5">
                  Our agent will respond within 24 hours.
                </p>
                <ContactForm
                  propertyId={property.propertyId}
                  propertyTitle={property.title}
                  agentId={property.agentId}
                  agentName={property.agentName}
                />
              </div>

              {/* Listing metadata */}
              <div className="rounded-2xl border border-border bg-card shadow-sm p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Listed on{' '}
                    {property.publishedAt
                      ? new Date(property.publishedAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Last updated{' '}
                    {property.updatedAt
                      ? new Date(property.updatedAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  <span>{property.views || 0} total views</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PropertyDetail
