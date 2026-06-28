import { motion } from 'framer-motion'
import { Seo } from '@/components/atoms/Seo'
import { StructuredData } from '@/components/atoms/StructuredData'
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'

const fadeInSection = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const itemFadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export const Terms = () => {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Terms of Service', item: '/terms' },
  ]

  return (
    <>
      <Seo
        title="Terms of Service"
        description="Zain Real Estate terms of service – rules and guidelines for using our website and services."
        noindex={false}
        nofollow={false}
      />
      <StructuredData schema={generateOrganizationSchema()} />
      <StructuredData schema={generateBreadcrumbSchema(breadcrumbItems)} />

      <div className="bg-background min-h-screen">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            >
              Terms of Service
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              Rules and guidelines for using our website and services.
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInSection}
              className="space-y-8"
            >
              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing or using Zain Real Estate’s website, you agree to be bound by these
                  Terms of Service. If you do not agree with any part of these terms, you must not
                  use our services.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  2. Use of the Website
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree to use the website only for lawful purposes and in a manner that does
                  not infringe the rights of others. You may not attempt to gain unauthorized access
                  to any part of the website, its servers, or databases.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  3. Property Listings
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  While we strive to keep property information accurate and up‑to‑date, all listings
                  are provided for general informational purposes. Prices, availability, and legal
                  status may change without notice. We recommend independent verification before
                  making any financial decisions.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  4. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on this website – including text, images, logos, and software – is the
                  property of Zain Real Estate or its licensors and is protected by copyright and
                  other intellectual property laws.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  5. Limitation of Liability
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Zain Real Estate shall not be liable for any direct, indirect, incidental, or
                  consequential damages arising from your use of the website or reliance on its
                  content.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  6. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. Changes will be effective
                  immediately upon posting. Your continued use of the website constitutes acceptance
                  of the revised terms.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp} className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Last updated: January 1, 2026. For questions, please{' '}
                  <a href="/contact" className="text-gold-500 hover:underline">
                    contact us
                  </a>
                  .
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Terms
