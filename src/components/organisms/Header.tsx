import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import { cn } from '@/lib/helpers/cn'
import { Menu, X } from 'lucide-react'
import { useAppSelector } from '@/store/store'
import { selectAuthUser } from '@/store/slices/authSlice'

const navLinks = [
  { to: '/properties', label: 'Properties' },
  { to: '/areas', label: 'Areas' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const Header = () => {
  const { user, logout } = useAuth()
  const reduxUser = useAppSelector(selectAuthUser)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setMobileMenuOpen(false), [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      /* silent */
    }
  }

  const isAdmin = reduxUser?.role === 'admin'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        'border-b border-border',
        'bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo – favicon + Cinzel Decorative text in fixed Metallic accent */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Zain Real Estate – Home"
        >
          <img
            src="/favicon.png"
            alt="Zain Real Estate"
            className="h-9 w-9 rounded-lg object-contain shadow-sm"
          />
          <span
            className="text-xl sm:text-2xl font-regular tracking-tight text-[#e5b252]"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Zain Real Estate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'relative px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                'text-muted-foreground hover:text-foreground hover:bg-muted',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                location.pathname.startsWith(link.to) &&
                  'text-foreground bg-primary/10 font-semibold'
              )}
            >
              {link.label}
              {location.pathname.startsWith(link.to) && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 bg-primary dark:bg-green-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
              )}
            </Link>
          ))}

          <div className="ml-2 flex items-center gap-2 pl-2 border-l border-border">
            <ThemeToggle />
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="font-semibold">
                      Admin
                    </Button>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    'text-muted-foreground hover:text-foreground hover:bg-muted',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                  )}
                >
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="relative h-10 w-10 rounded-xl text-foreground"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="sync" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-16 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-16 right-0 z-50 h-[calc(100vh-4rem)] w-full max-w-sm bg-card shadow-2xl overflow-y-auto md:hidden border-l border-border"
            aria-label="Mobile navigation"
          >
            <div className="px-6 py-8 flex flex-col h-full">
              <div className="space-y-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={link.to}
                      className={cn(
                        'flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors',
                        'text-muted-foreground hover:text-foreground hover:bg-muted',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        location.pathname.startsWith(link.to) &&
                          'bg-primary/10 text-foreground font-semibold'
                      )}
                      onClick={toggleMobileMenu}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="my-4 border-t border-border" />

                {user ? (
                  <>
                    {isAdmin && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                      >
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-foreground bg-primary/10 font-semibold"
                          onClick={toggleMobileMenu}
                        >
                          Admin Panel
                        </Link>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      <Link
                        to="/dashboard"
                        className="flex items-center px-4 py-3 rounded-xl text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={toggleMobileMenu}
                      >
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                      className="px-4 pt-2"
                    >
                      <Button variant="outline" className="w-full" onClick={handleLogout}>
                        Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                    className="flex flex-col gap-2 px-4"
                  >
                    <Link to="/auth/login" onClick={toggleMobileMenu}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth/register" onClick={toggleMobileMenu}>
                      <Button className="w-full">Register</Button>
                    </Link>
                  </motion.div>
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  &copy; {new Date().getFullYear()} Zain Real Estate
                </p>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
