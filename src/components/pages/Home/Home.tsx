import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Seo } from '@/components/atoms/Seo'
import { StructuredData } from '@/components/atoms/StructuredData'
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'
import { HeroSection } from '@/components/organisms/HeroSection'
import { TrustBanner } from '@/components/organisms/TrustBanner'
import { PropertyGrid } from '@/components/organisms/PropertyGrid'
import { useFeaturedProperties } from '@/hooks/useProperties'
import { useAreas } from '@/hooks/useAreas'
import { AreaCard } from '@/components/molecules/AreaCard'
import { TestimonialCard } from '@/components/molecules/TestimonialCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { SITE_CONFIG } from '@/lib/constants'
import { Shield, TrendingUp, Users, Clock, ArrowRight, Phone, Star } from 'lucide-react'

const APP_URL = 'https://zainrealestate.netlify.app'

const trustItems = [
  {
    label: 'Years of Trust',
    value: '25+',
    icon: <Clock className="h-6 w-6" />,
  },
  {
    label: 'Clients Served',
    value: '500+',
    icon: <Users className="h-6 w-6" />,
  },
  {
    label: 'Properties Sold',
    value: '300+',
    icon: <TrendingUp className="h-6 w-6" />,
  },
  {
    label: 'Years Experience',
    value: '25',
    icon: <Star className="h-6 w-6" />,
  },
]

// Static testimonials as fallback
const staticTestimonials = [
  {
    testimonialId: '1',
    clientName: 'Ahmed Khan',
    content:
      'Zain Real Estate provided excellent service. Found us the perfect plot in Mehran Town with full legal documentation.',
    rating: 5,
    propertyType: 'Residential Plot',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    testimonialId: '2',
    clientName: 'Sana Ali',
    content:
      'Professional team, transparent process, and great follow-up. Highly recommended for any real estate needs in Karachi.',
    rating: 5,
    propertyType: 'Commercial Property',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    testimonialId: '3',
    clientName: 'Usman Farooq',
    content:
      'I invested in Hawksbay Scheme 42 through them. The team handled everything seamlessly. 100% satisfied.',
    rating: 5,
    propertyType: 'Investment',
    isFeatured: true,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
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

export const Home = () => {
  const navigate = useNavigate()
  const { data: featured, isLoading: featuredLoading } = useFeaturedProperties(6)
  const { data: areas, isLoading: areasLoading } = useAreas()

  const breadcrumbItems = [{ name: 'Home', item: '/' }]

  return (
    <>
      {/* ===== SEO ===== */}
      <Seo
        title="Trusted Property Solutions Since 1998"
        description="Zain Real Estate offers 100% legal, approved residential, commercial, and industrial properties in Karachi. Over 25 years of trusted service in Mehran Town, Korangi, Hawksbay Scheme 42."
        type="website"
        keywords={[
          'Karachi real estate',
          'legal properties',
          'approved plots',
          'Mehran Town',
          'Korangi',
          'real estate agent Karachi',
        ]}
        image="/images/og-image.jpg"
        url={APP_URL}
      />

      {/* ===== Structured Data ===== */}
      <StructuredData schema={generateOrganizationSchema()} />
      <StructuredData schema={generateBreadcrumbSchema(breadcrumbItems)} />

      {/* ===== Main Content ===== */}
      <div className="overflow-x-hidden">
        {/* Hero Section */}
        <HeroSection
          title="Secure Your Future with Legally Approved Properties in Karachi"
          subtitle="25+ years of expertise in Karachi's real estate market. Exclusively dealing in 100% legal, approved, and transferable properties with complete documentation."
          onSearch={(query) => navigate(`/properties?search=${encodeURIComponent(query)}`)}
          ctaText="Explore Properties"
          ctaLink="/properties"
        />

        {/* Trust Banner */}
        <TrustBanner items={trustItems} className="py-16 md:py-20" />

        {/* Featured Properties */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInSection}
              className="text-center mb-12"
            >
              <motion.h2
                variants={itemFadeUp}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight"
              >
                Featured Properties
              </motion.h2>
              <motion.p
                variants={itemFadeUp}
                className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Handpicked premium listings with guaranteed legal clearance.
              </motion.p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInSection}
            >
              <PropertyGrid
                properties={featured || []}
                loading={featuredLoading}
                columns={3}
                emptyMessage="No featured properties right now"
                emptyAction={{
                  label: 'Browse All Properties',
                  onClick: () => navigate('/properties'),
                }}
              />
            </motion.div>
            {!featuredLoading && featured && featured.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-10 text-center"
              >
                <Button
                  variant="gold"
                  size="lg"
                  className="rounded-full px-8 text-sm font-semibold transition-all hover:shadow-md"
                  onClick={() => navigate('/properties')}
                >
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Areas Served */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInSection}
              className="text-center mb-12"
            >
              <motion.h2
                variants={itemFadeUp}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight"
              >
                Prime Locations in Karachi
              </motion.h2>
              <motion.p
                variants={itemFadeUp}
                className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Explore the areas where we offer exclusive property solutions.
              </motion.p>
            </motion.div>
            {areasLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 rounded-2xl" />
                ))}
              </div>
            ) : areas && areas.length > 0 ? (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInSection}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {areas.map((area) => (
                  <motion.div key={area.areaId} variants={itemFadeUp}>
                    <AreaCard area={area} />
                  </motion.div>
                ))}
              </motion.div>
            ) : null}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInSection}
              className="text-center mb-16"
            >
              <motion.h2
                variants={itemFadeUp}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight"
              >
                Why Choose Zain Real Estate?
              </motion.h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Shield className="h-10 w-10" />,
                  title: '100% Legal Properties',
                  description:
                    'Every property we deal in is fully approved and legally cleared with complete documentation.',
                },
                {
                  icon: <Clock className="h-10 w-10" />,
                  title: '25+ Years of Trust',
                  description:
                    'Decades of consistent service and a legacy of satisfied clients speak for our reputation.',
                },
                {
                  icon: <Users className="h-10 w-10" />,
                  title: 'Expert Guidance',
                  description:
                    'Our seasoned agents help you find the perfect property that matches your investment goals.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInSection}
                  className="text-center p-6"
                >
                  <motion.div
                    variants={itemFadeUp}
                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                  >
                    {item.icon}
                  </motion.div>
                  <motion.h3
                    variants={itemFadeUp}
                    className="font-semibold text-xl text-foreground mb-3"
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p variants={itemFadeUp} className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24 bg-muted">
          <div className="container px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeInSection}
              className="text-center mb-12"
            >
              <motion.h2
                variants={itemFadeUp}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight"
              >
                What Our Clients Say
              </motion.h2>
              <motion.p
                variants={itemFadeUp}
                className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Real stories from real people who trusted us with their investments.
              </motion.p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInSection}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {staticTestimonials.map((testimonial) => (
                <motion.div key={testimonial.testimonialId} variants={itemFadeUp}>
                  <TestimonialCard testimonial={testimonial} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-brand-500 text-white">
          <div className="container px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInSection}
              className="max-w-3xl mx-auto"
            >
              <motion.h2
                variants={itemFadeUp}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
              >
                Ready to Find Your Dream Property?
              </motion.h2>
              <motion.p
                variants={itemFadeUp}
                className="mt-6 text-lg text-white/80 leading-relaxed"
              >
                Our expert agents are just a call away. Schedule a free consultation and get
                personalised property recommendations.
              </motion.p>
              <motion.div
                variants={itemFadeUp}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="lg"
                  className="rounded-full px-8 text-base font-semibold bg-gold-500 text-brand-900 hover:bg-gold-600 shadow-xl hover:shadow-2xl"
                  onClick={() => navigate('/contact')}
                >
                  Contact Us Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 text-base font-semibold border-white text-white hover:bg-white/10"
                  asChild
                >
                  <a href={`tel:${SITE_CONFIG.phone}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {SITE_CONFIG.phone}
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home
