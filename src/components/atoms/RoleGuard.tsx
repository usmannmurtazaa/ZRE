import { Navigate, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppSelector } from '@/store/store'
import { selectAuthUser, selectAuthLoading } from '@/store/slices/authSlice'
import type { UserRole } from '@/types/auth'

interface RoleGuardProps {
  allowedRoles: UserRole[]
}

/**
 * RoleGuard – protects routes based on the user's role stored in Redux.
 * If the user is not authenticated or doesn't have the required role,
 * they are redirected to the homepage.
 */
export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const user = useAppSelector(selectAuthUser)
  const loading = useAppSelector(selectAuthLoading)

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
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
        <span className="sr-only">Checking permissions…</span>
      </motion.div>
    )
  }

  // No user in Redux → not authenticated (shouldn't reach here if AuthGuard is used)
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default RoleGuard
