import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { auth } from '@/config/firebase'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut,
  onIdTokenChanged,
  getRedirectResult,
} from 'firebase/auth'
import { useDispatch } from 'react-redux'
import { setUser, clearUser } from '@/store/slices/authSlice'
import { useToast } from '@/hooks/use-toast'
import { userService } from '@/services/userService'
import type { UserRole } from '@/types/auth'

interface AuthContextType {
  user: FirebaseUser | null
  loading: boolean
  initializing: boolean
  logout: () => Promise<void>
  refreshAuthState: () => void
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  initializing: true,
  logout: async () => {},
  refreshAuthState: () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(true)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const authReadyRef = useRef(false)

  // Create Firestore user document if it doesn't exist (non‑blocking)
  const ensureUserDocument = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      await userService.createUser(firebaseUser.uid, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        role: 'buyer',
        isActive: true,
      })
    } catch (error) {
      console.error('[Auth] ensureUserDocument failed, but continuing:', error)
    }
  }, [])

  // Resolve user data for Redux
  const resolveAuthUser = useCallback(
    async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await ensureUserDocument(firebaseUser)
        let role: UserRole = 'buyer'
        let phoneNumber: string | null = null
        try {
          const firestoreUser = await userService.getUser(firebaseUser.uid)
          if (firestoreUser) {
            role = firestoreUser.role ?? 'buyer'
            phoneNumber = firestoreUser.phoneNumber ?? null
          }
        } catch (error) {
          console.error('[Auth] Failed to fetch user role:', error)
        }

        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            role,
            phoneNumber,
          })
        )
      } else {
        dispatch(clearUser())
      }
    },
    [dispatch, ensureUserDocument]
  )

  const handleAuthStateChange = useCallback(
    async (firebaseUser: FirebaseUser | null) => {
      setUserState(firebaseUser)
      await resolveAuthUser(firebaseUser)
      setLoading(false)
      if (!authReadyRef.current) {
        setInitializing(false)
        authReadyRef.current = true
      }
    },
    [resolveAuthUser]
  )

  useEffect(() => {
    const init = async () => {
      // Process any pending redirect result BEFORE listening for auth state changes
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          console.log('[Auth] Redirect result processed for:', result.user.email)
        }
      } catch (error) {
        console.error('[Auth] getRedirectResult error:', error)
      }

      const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange, (error) => {
        console.error('[Auth] onAuthStateChanged error:', error)
        setLoading(false)
        setInitializing(false)
        toast({
          title: 'Authentication error',
          description: 'There was a problem checking your login status.',
          variant: 'destructive',
        })
      })
      return unsubscribe
    }

    init()
  }, [handleAuthStateChange, toast])

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await resolveAuthUser(firebaseUser)
      }
    })
    return unsubscribe
  }, [resolveAuthUser])

  const logout = useCallback(async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('[Auth] Logout failed:', error)
      toast({
        title: 'Logout failed',
        description: 'Unable to log out. Please try again.',
        variant: 'destructive',
      })
    }
  }, [toast])

  const refreshAuthState = useCallback(async () => {
    if (auth.currentUser) {
      await resolveAuthUser(auth.currentUser)
    }
  }, [resolveAuthUser])

  const value = {
    user,
    loading,
    initializing,
    logout,
    refreshAuthState,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider