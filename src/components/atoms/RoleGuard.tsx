import { Navigate, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types/auth'

interface RoleGuardProps {
  allowedRoles: UserRole[]
}

/**
 * RoleGuard protects routes that require a specific role.
 * After authentication is confirmed, it checks the user's role
 * and redirects unauthorized access to the home page.
 * Displays a polished loading state while auth is initialised.
 */
export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex min-h-screen flex-col items-center justify-center bg-background"
        role="status"
        aria-label="Verifying permissions"
      >
        <div className="relative">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
          <span className="sr-only">Loading permissions…</span>
        </div>
        <p className="mt-5 text-sm font-medium text-muted-foreground">Checking authorisation</p>
      </motion.div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes((user as any).role as UserRole)) {
    // Not authorised – redirect to homepage silently
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RoleGuard
