/**
 * Auth Slice – Redux Toolkit
 *
 * Manages the serialised Firebase user object and authentication state.
 * This slice is synced with Firebase Auth via the AuthContext provider.
 *
 * For heavy user data (preferences, extended profile), we rely on
 * TanStack Query; this slice only stores the minimal necessary for
 * immediate role checks and UI changes.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { UserRole } from '@/types/auth'

// ── Types ────────────────────────────────────────────────────────────────

/** Essential, serialisable user fields stored in Redux. */
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  role?: UserRole
  phoneNumber?: string | null
}

/** Shape of the auth slice state. */
interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// ── Initial State ─────────────────────────────────────────────────────────

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// ── Slice ─────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets the authenticated user.
     * Called by AuthProvider when Firebase Auth state changes.
     */
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.error = null
      state.loading = false
    },

    /** Clears the user (e.g., on logout). */
    clearUser: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.error = null
    },

    /** Tracks loading state (e.g., during initial auth check). */
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },

    /** Sets an authentication error (e.g., login failure). */
    setAuthError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },

    /**
     * Updates only the user's role.
     * Useful after an admin changes the role in Firestore.
     */
    setUserRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload
      }
    },

    /**
     * Partially updates the user profile with new values.
     * For changes like displayName, photoURL, phoneNumber, etc.
     */
    updateUserProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        Object.assign(state.user, action.payload)
      }
    },
  },
})

// ── Actions ───────────────────────────────────────────────────────────────

export const { setUser, clearUser, setAuthLoading, setAuthError, setUserRole, updateUserProfile } =
  authSlice.actions

// ── Selectors ─────────────────────────────────────────────────────────────

import type { RootState } from '@/store/store'

/** Full auth state. */
export const selectAuth = (state: RootState) => state.auth

/** The current user object (or null). */
export const selectAuthUser = (state: RootState) => state.auth.user

/** Is a user authenticated? */
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated

/** The current user's role (defaults to 'buyer'). */
export const selectUserRole = (state: RootState): UserRole => state.auth.user?.role ?? 'buyer'

/** Is the auth state still loading? */
export const selectAuthLoading = (state: RootState) => state.auth.loading

/** Any auth error message. */
export const selectAuthError = (state: RootState) => state.auth.error

// ── Reducer ───────────────────────────────────────────────────────────────

export default authSlice.reducer
