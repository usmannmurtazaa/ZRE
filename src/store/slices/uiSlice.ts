/**
 * UI Slice – Redux Toolkit
 *
 * Manages ephemeral global UI state: theme, sidebar, modals, toast notifications,
 * and a global loading indicator. For heavy domain data, we rely on TanStack Query;
 * this slice is intentionally kept lightweight and synchronous.
 *
 * Toast notifications are automatically dismissed by the `<Toaster>` component.
 * The slice itself only manages the current toast's visibility and content.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// ── Types ──────────────────────────────────────────────────────────────

/** Allowed toast variants. */
export type ToastType = 'success' | 'error' | 'warning' | 'info'

/** Shape of a single toast notification stored in state. */
interface ToastState {
  message: string
  type: ToastType
  open: boolean
}

/** Full shape of the UI slice. */
export interface UIState {
  /** Current visual theme (synchronised with ThemeContext). */
  theme: 'light' | 'dark'
  /** Whether the sidebar is expanded (used on mobile). */
  sidebarOpen: boolean
  /** Whether a modal (dialog) is currently open. */
  modalOpen: boolean
  /** The current toast notification, or null if none is active. */
  toast: ToastState | null
  /** Global loading overlay (e.g., during full‑page actions). */
  isLoading: boolean
}

// ── Initial State ──────────────────────────────────────────────────────

const initialState: UIState = {
  theme: 'light',
  sidebarOpen: false,
  modalOpen: false,
  toast: null,
  isLoading: false,
}

// ── Slice ──────────────────────────────────────────────────────────────

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Toggles between light and dark theme.
     * Note: The actual theme application is handled by `ThemeContext`;
     * this reducer exists for potential Redux‑based observers.
     */
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },

    /** Opens or closes the mobile sidebar. */
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },

    /** Opens or closes a generic modal. */
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.modalOpen = action.payload
    },

    /**
     * Displays a toast notification.
     * The `<Toaster>` component will listen for this state and render
     * the toast with an auto‑dismiss timer.
     */
    showToast: (state, action: PayloadAction<{ message: string; type: ToastType }>) => {
      state.toast = {
        message: action.payload.message,
        type: action.payload.type,
        open: true,
      }
    },

    /**
     * Hides the current toast (sets `open = false`).
     * The toast component will then play its exit animation and call
     * `dismissToast` to remove it from the state entirely.
     */
    hideToast: (state) => {
      if (state.toast) {
        state.toast.open = false
      }
    },

    /**
     * Completely removes the toast from the state.
     * Should be called after the exit animation of the toast component.
     */
    dismissToast: (state) => {
      state.toast = null
    },

    /** Enables or disables a global loading overlay. */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

// ── Actions ────────────────────────────────────────────────────────────

export const {
  toggleTheme,
  setSidebarOpen,
  setModalOpen,
  showToast,
  hideToast,
  dismissToast,
  setLoading,
} = uiSlice.actions

// ── Selectors ──────────────────────────────────────────────────────────

import type { RootState } from '@/store/store'

export const selectUI = (state: RootState) => state.ui
export const selectTheme = (state: RootState) => state.ui.theme
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectModalOpen = (state: RootState) => state.ui.modalOpen
export const selectToast = (state: RootState) => state.ui.toast
export const selectIsLoading = (state: RootState) => state.ui.isLoading

// ── Reducer ────────────────────────────────────────────────────────────

export default uiSlice.reducer
