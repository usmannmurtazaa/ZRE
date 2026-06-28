import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { showToast } from '@/store/slices/uiSlice'
import { store } from '@/store/store'

/**
 * Global QueryClient instance for TanStack Query.
 *
 * Configured with sensible defaults for production:
 * - Stale time of 5 minutes
 * - Garbage collection after 1 hour
 * - One retry on network errors
 * - Global error toasts via Redux UI slice
 */

// ── Error helpers ──────────────────────────────────────────────────────
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred. Please try again.'
}

function onQueryError(error: unknown, query: unknown) {
  const message = getErrorMessage(error)
  // Only show toast if the query is actively fetching (not a background refetch)
  if (query && typeof query === 'object' && 'state' in query) {
    const state = (query as any).state
    if (state?.fetchStatus === 'fetching') {
      store.dispatch(showToast({ message, type: 'error' }))
    }
  }
  console.error('[QueryClient] Query error:', error)
}

function onMutationError(error: unknown) {
  const message = getErrorMessage(error)
  store.dispatch(showToast({ message, type: 'error' }))
  console.error('[QueryClient] Mutation error:', error)
}

// ── Retry logic (once for network/server errors) ─────────────────────
function retry(failureCount: number, error: unknown): boolean {
  if (failureCount > 1) return false
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('network') || msg.includes('timeout')) return true
  }
  return true
}

// ── Create the client ──────────────────────────────────────────────────
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      retry,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: onQueryError,
  }),
  mutationCache: new MutationCache({
    onError: onMutationError,
  }),
})

export default queryClient
