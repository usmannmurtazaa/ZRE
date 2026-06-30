import { motion } from 'framer-motion'
import { cn } from '@/lib/helpers/cn'

interface TrustItem {
  label: string
  value: string | number
  icon?: React.ReactNode
}

interface TrustBannerProps {
  items: TrustItem[]
  className?: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
}

export const TrustBanner = ({ items, className }: TrustBannerProps) => {
  if (!items || items.length === 0) return null

  return (
    <section
      aria-label="Trust indicators"
      className={cn(
        'relative py-16 md:py-20 overflow-hidden',
        'bg-card border-y border-border',
        className
      )}
    >
      {/* Subtle background decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="container px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {items.map((item, i) => (
            <motion.div key={i} variants={itemVariants}>
              {/* Glassmorphism card */}
              <div className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/30 backdrop-blur-md p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                {item.icon && (
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                )}
                <div className="font-newsreader text-4xl font-semibold tracking-tight text-foreground">
                  {item.value}
                </div>
                <div className="mt-1 text-sm font-medium text-muted-foreground">{item.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TrustBanner
