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

export const Privacy = () => {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Privacy Policy', item: '/privacy' },
  ]

  return (
    <>
      <Seo
        title="Privacy Policy"
        description="Zain Real Estate privacy policy – how we collect, use, and protect your personal information."
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
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto"
            >
              How we collect, use, and protect your information.
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
                  1. Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you use our website, register an account, or submit an inquiry, we may
                  collect personal information such as your name, email address, phone number, and
                  any other details you provide. We also automatically collect certain technical
                  data (e.g., IP address, browser type) for security and analytics purposes.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  2. How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">Your data is used to:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                  <li>Respond to your property inquiries and connect you with our agents.</li>
                  <li>
                    Send you updates about properties, market insights, and promotional offers (only
                    if you opt in).
                  </li>
                  <li>Improve our website and services through analytics.</li>
                  <li>Comply with legal obligations.</li>
                </ul>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  3. Sharing Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may
                  share your data with trusted service providers (e.g., hosting, email delivery)
                  only to the extent necessary to operate our business. All such providers are bound
                  by confidentiality agreements.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  4. Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry‑standard security measures to protect your personal
                  information. However, no method of transmission over the Internet or electronic
                  storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  5. Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  You may access, update, or request deletion of your personal information at any
                  time by contacting us at{' '}
                  <a
                    href="mailto:zainrealestateagency@gmail.com"
                    className="text-gold-500 hover:underline"
                  >
                    zainrealestateagency@gmail.com
                  </a>
                  . You also have the right to withdraw consent for marketing communications.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp}>
                <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">
                  6. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. Any changes will be posted on
                  this page, and we encourage you to review it periodically.
                </p>
              </motion.div>

              <motion.div variants={itemFadeUp} className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Last updated: January 1, 2026. If you have any questions, please{' '}
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

export default Privacy
