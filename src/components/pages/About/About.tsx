import { Seo } from '@/components/atoms/Seo'
import { StructuredData } from '@/components/atoms/StructuredData'
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'
import { TrustBanner } from '@/components/organisms/TrustBanner'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Clock, Users, Target, Heart, Scale, Star, ArrowRight } from 'lucide-react'
import { OptimizedImage } from '@/components/atoms/OptimizedImage'
import { AgentCard } from '@/components/molecules/AgentCard'

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

export const About = () => {
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
      icon: <Target className="h-6 w-6" />,
    },
    {
      label: 'Team Members',
      value: '10+',
      icon: <Star className="h-6 w-6" />,
    },
  ]

  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'About', item: '/about' },
  ]

  const teamMembers = [
    {
      name: 'Ghulam Murtaza',
      role: 'Founder & CEO',
      experience: '25+ years',
      sameAs: 'https://linkedin.com/in/ghulammurtaza',
    },
    {
      name: 'M. Faryad',
      role: 'Senior Agent',
      experience: '15+ years',
    },
    {
      name: 'Usman Murtaza',
      role: 'Property Consultant',
      experience: '2+ years',
    },
  ]

  const teamMemberSchemas = teamMembers.map((member) => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role,
    worksFor: {
      '@type': 'Organization',
      name: 'Zain Real Estate',
    },
    ...(member.sameAs && { sameAs: member.sameAs }),
  }))

  // Agent card data for CEO
  const ceoAgent = {
    uid: 'ceo-1',
    displayName: 'Ghulam Murtaza',
    email: 'murtaza43185@gmail.com',
    emailVerified: true,
    phoneNumber: '+92-321-2820973',
    photoURL: '/images/team/ghulam-murtaza.png',
    role: 'admin' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: true,
    experienceYears: 25,
    bio: 'Founder & CEO with over 25 years of experience in Karachi real estate.',
  }

  // Agent card data for Property Consultant (Usman Murtaza)
  const consultantAgent = {
    uid: 'consultant-1',
    displayName: 'Usman Murtaza',
    email: 'usmanmurtaza2004@gmail.com',
    emailVerified: true,
    phoneNumber: '+92-339-0052004',
    photoURL: '/images/team/usman-murtaza.png',
    role: 'agent' as const,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isFeatured: false,
    experienceYears: 2,
    bio: 'Property Consultant helping clients find their dream properties.',
  }

  return (
    <>
      <Seo
        title="About Zain Real Estate | 25+ Years of Trusted Service"
        description="Learn about Zain Real Estate's 25-year history, team, and commitment to legal, transparent property transactions in Karachi."
        type="website"
        keywords={[
          'about',
          'real estate team',
          'Karachi property experts',
          'Zain Real Estate history',
        ]}
      />

      {/* Structured Data */}
      <StructuredData schema={generateOrganizationSchema()} />
      <StructuredData schema={generateBreadcrumbSchema(breadcrumbItems)} />
      {teamMemberSchemas.map((schema, index) => (
        <StructuredData key={index} schema={schema} />
      ))}

      <div className="overflow-x-hidden">
        {/* Hero section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground py-20 md:py-28 overflow-hidden">
          {/* Subtle pattern overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="container relative z-10 px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4"
            >
              About Zain Real Estate
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed"
            >
              Trusted real estate expertise in Karachi since 2000, providing 100% legal and approved
              properties with complete documentation.
            </motion.p>
          </div>
        </section>

        {/* Trust Banner */}
        <TrustBanner items={trustItems} className="py-16 md:py-20" />

        {/* Our Story */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeInSection}
              >
                <motion.h2
                  variants={itemFadeUp}
                  className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-6"
                >
                  Our Story
                </motion.h2>
                <motion.p
                  variants={itemFadeUp}
                  className="text-base leading-relaxed text-muted-foreground"
                >
                  Zain Real Estate was established in the year 2000 under the leadership of Ghulam
                  Murtaza, bringing more than 25 years of practical experience in Karachi&apos;s
                  real estate industry. Our dedicated team includes M. Faryad and Usman Murtaza,
                  ensuring professional service and deep market knowledge.
                </motion.p>
                <motion.p
                  variants={itemFadeUp}
                  className="mt-4 text-base leading-relaxed text-muted-foreground"
                >
                  We specialize exclusively in 100% legal, approved, and transferable properties
                  with complete documentation, providing absolute peace of mind for all our clients.
                  Our commitment to transparency and ethical practices has made us a trusted name in
                  Karachi&apos;s property market.
                </motion.p>
                <motion.div variants={itemFadeUp} className="mt-8">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full px-8 text-sm font-semibold shadow-md hover:shadow-xl transition-shadow"
                  >
                    <Link to="/contact">
                      Get in Touch
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-2xl overflow-hidden shadow-card border border-border"
              >
                <OptimizedImage
                  src="/images/about-team.png"
                  alt="Zain Real Estate team - Ghulam Murtaza, M. Faryad, and Usman Murtaza"
                  className="w-full h-auto aspect-[4/3]"
                  objectFit="cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Team */}
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
                Meet Our Team
              </motion.h2>
              <motion.p
                variants={itemFadeUp}
                className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                The dedicated professionals behind Zain Real Estate.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInSection}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
              <motion.div variants={itemFadeUp}>
                <AgentCard agent={ceoAgent as any} />
              </motion.div>
              <motion.div variants={itemFadeUp}>
                <AgentCard agent={consultantAgent as any} />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Our Values */}
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
                Our Values
              </motion.h2>
              <motion.p
                variants={itemFadeUp}
                className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                The principles that have guided us for over two decades.
              </motion.p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInSection}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: <Heart className="h-8 w-8 text-gold-500" />,
                  title: 'Trust & Transparency',
                  description: 'We believe in honest, transparent dealings with every client.',
                },
                {
                  icon: <Scale className="h-8 w-8 text-gold-500" />,
                  title: 'Legal Compliance',
                  description: 'All properties are 100% legal with complete documentation.',
                },
                {
                  icon: <Star className="h-8 w-8 text-gold-500" />,
                  title: 'Customer First',
                  description: 'We prioritize our clients’ needs and satisfaction above all.',
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemFadeUp}
                  className="bg-card rounded-2xl border border-border shadow-sm p-8 text-center transition-all hover:shadow-card hover:-translate-y-1 duration-300"
                >
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-500/10">
                    {item.icon}
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
