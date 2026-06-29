import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Seo } from '@/components/atoms/Seo'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowRight } from 'lucide-react'

export const NotFound = () => {
  return (
    <>
      <Seo
        title="Page Not Found"
        description="The page you are looking for does not exist."
        noindex
        nofollow
      />

      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Decorative floating elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.08, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-primary blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.06, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
            className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-primary blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-lg mx-auto"
        >
          {/* Brand mark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-card shadow-card border border-border"
          >
            <span className="font-serif text-4xl font-bold text-primary">Z</span>
          </motion.div>

          {/* 404 heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="font-serif text-7xl sm:text-8xl lg:text-9xl font-bold text-primary leading-none tracking-tight">
              404
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 space-y-3"
          >
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
              Page not found
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you
              find your way back.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/">
              <Button
                size="lg"
                className="gap-2 rounded-full px-8 shadow-sm hover:shadow-md transition-shadow font-semibold"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/properties">
              <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 font-semibold">
                <Search className="h-4 w-4" />
                Browse Properties
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

export default NotFound
