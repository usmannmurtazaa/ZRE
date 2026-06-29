import { motion } from 'framer-motion'
import { Seo } from '@/components/atoms/Seo'
import { StructuredData } from '@/components/atoms/StructuredData'
import { generateOrganizationSchema, generateBreadcrumbSchema } from '@/lib/seo/schemas'
import { ContactForm } from '@/components/organisms/ContactForm'
import { SITE_CONFIG } from '@/lib/constants'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  Building2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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

const ContactInfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) => (
  <motion.div
    variants={itemFadeUp}
    className="flex items-start gap-4 p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border hover:shadow-md hover:border-gold-500/30 transition-all duration-300"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
      <div className="text-sm text-muted-foreground space-y-0.5">{children}</div>
    </div>
  </motion.div>
)

export const Contact = () => {
  const breadcrumbItems = [
    { name: 'Home', item: '/' },
    { name: 'Contact', item: '/contact' },
  ]

  const googleMapsEmbedUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28962.825616415626!2d67.07528829574584!3d24.85178359219301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33b4edf0d3425%3A0x95fe61b2b27b6ed2!2sZain%20Real%20Estate!5e0!3m2!1sen!2s!4v1782695873011!5m2!1sen!2s'

  const googleBusinessProfileUrl = 'https://www.google.com/maps/search/Zain+Real+Estate,+Karachi/'

  return (
    <>
      <Seo
        title="Contact Zain Real Estate | Karachi Real Estate Experts"
        description="Contact us for property inquiries, valuations, and expert real estate advice in Karachi. Call, email, or visit our office."
        type="website"
        keywords={[
          'contact',
          'real estate Karachi',
          'property inquiry',
          'Zain Real Estate contact',
        ]}
      />

      <StructuredData schema={generateOrganizationSchema()} />
      <StructuredData schema={generateBreadcrumbSchema(breadcrumbItems)} />

      <div className="overflow-x-hidden">
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary text-primary-foreground py-20 md:py-28 overflow-hidden">
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
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed"
            >
              Have questions or need assistance? Reach out to us through any of the channels below
              and our expert team will respond within 24 hours.
            </motion.p>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeInSection}
                className="lg:col-span-2 space-y-4"
              >
                <motion.div variants={itemFadeUp} className="mb-6">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    Contact Information
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    We are here to help you find your dream property.
                  </p>
                </motion.div>

                <ContactInfoCard icon={<Phone className="h-5 w-5" />} title="Phone">
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="hover:text-primary transition-colors"
                  >
                    {SITE_CONFIG.phone}
                  </a>
                </ContactInfoCard>

                <ContactInfoCard icon={<MessageCircle className="h-5 w-5" />} title="WhatsApp">
                  <a
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Chat with us
                  </a>
                </ContactInfoCard>

                <ContactInfoCard icon={<Mail className="h-5 w-5" />} title="Email">
                  <a
                    href={`mailto:${SITE_CONFIG.email}`}
                    className="hover:text-primary transition-colors break-all"
                  >
                    {SITE_CONFIG.email}
                  </a>
                </ContactInfoCard>

                <ContactInfoCard icon={<MapPin className="h-5 w-5" />} title="Office Address">
                  <p>{SITE_CONFIG.address}</p>
                </ContactInfoCard>

                <ContactInfoCard icon={<Clock className="h-5 w-5" />} title="Business Hours">
                  <p>Monday – Saturday: 9 AM – 7 PM</p>
                  <p>Sunday: By Appointment</p>
                </ContactInfoCard>

                <motion.div
                  variants={itemFadeUp}
                  className="bg-primary/5 rounded-2xl border border-primary/10 p-5 text-center"
                >
                  <Building2 className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    Looking for property valuation?
                  </p>
                  <a
                    href={`tel:${SITE_CONFIG.phone}`}
                    className="text-primary hover:underline text-sm font-semibold inline-flex items-center gap-1 mt-1"
                  >
                    Call our experts <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </motion.div>

                <motion.div variants={itemFadeUp}>
                  <Button variant="outline" className="w-full gap-2 rounded-xl" asChild>
                    <a href={googleBusinessProfileUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      View on Google
                    </a>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={fadeInSection}
                className="lg:col-span-3 space-y-8"
              >
                <motion.div variants={itemFadeUp}>
                  <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
                    <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      Send Us a Message
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Fill out the form below and we'll get back to you promptly.
                    </p>
                    <ContactForm />
                  </div>
                </motion.div>

                <motion.div variants={itemFadeUp}>
                  <div className="rounded-2xl overflow-hidden border border-border shadow-sm">
                    <iframe
                      src={googleMapsEmbedUrl}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      title="Zain Real Estate Office Location"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Contact
