import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'

/**
 * Redux store configuration for Zain Real Estate.
 *
 * The store is intentionally kept lean at the MVP stage. Only global UI state
 * and authentication are stored here. Domain data (properties, leads, areas)
 * is managed by TanStack Query for server‑state caching.
 *
 * To add a new slice:
 * 1. Import the reducer.
 * 2. Add it to the `reducer` object below.
 * 3. (Optional) Update the RootState type automatically.
 */

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    // Future slices go here – e.g.:
    // properties: propertyReducer,
    // leads: leadReducer,
    // filters: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Firebase Auth user objects contain non‑serializable values.
        // The authSlice stores the essential serialisable fields, but we
        // ignore the action and the state path to suppress warnings.
        ignoredActions: ['auth/setUser'],
        ignoredPaths: ['auth.user'],
      },
    }),
  devTools: (import.meta as any).env?.DEV ?? false, // Enable Redux DevTools only in development
})

// ── Type exports ───────────────────────────────────────────────────────

/** The complete Redux state shape. */
export type RootState = ReturnType<typeof store.getState>

/** The store's dispatch function type. */
export type AppDispatch = typeof store.dispatch

// ── Typed hooks (optional, but useful if used directly) ────────────────
// These are typically placed in a separate hooks file, but we export them
// here for convenience so consumers can import from '@/store/store'.
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

/** Typed `useDispatch` hook. */
export const useAppDispatch: () => AppDispatch = useDispatch

/** Typed `useSelector` hook. */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
