import { useContext } from 'react'
import { AuthContext } from '@/contexts/AuthContext'

/**
 * Hook to access the current authentication state.
 * Must be used within an `<AuthProvider>` component.
 * Returns `{ user, loading, initializing, logout, refreshAuthState }`
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  // The AuthProvider always provides a valid context object (even the default),
  // so context will never be undefined.
  return context
}

// Keep the previous default export for backward compatibility
const authHooks = { useAuth }
export default authHooks
