import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

/**
 * AuthGuard protects routes that require authentication.
 * Displays a polished loading state while Firebase Auth initialises,
 * then redirects unauthenticated users to /auth/login preserving the
 * intended destination for a seamless post‑login redirect.
 */
export const AuthGuard = () => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex min-h-screen flex-col items-center justify-center bg-background"
        role="status"
        aria-label="Authenticating"
      >
        <div className="relative">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
          <span className="sr-only">Loading authentication…</span>
        </div>
        <p className="mt-5 text-sm font-medium text-muted-foreground">Verifying your session</p>
      </motion.div>
    )
  }

  if (!user) {
    // Redirect to login, passing the intended path for post‑login redirect
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export default AuthGuard
