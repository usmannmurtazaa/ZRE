import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/organisms/Header'
import { Footer } from '@/components/organisms/Footer'

/**
 * Page transition variants – subtle fade + slight vertical movement
 * for a polished, premium feel without distracting users.
 */
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
}

function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

const BaseLayout = () => (
  <div className="flex flex-col min-h-screen bg-background">
    <Header />
    <main id="main-content" className="flex-1" role="main">
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
    <Footer />
  </div>
)

export const Layout = BaseLayout
export const PublicLayout = BaseLayout
export default Layout
