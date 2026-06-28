import { useState, useEffect, useRef } from 'react'

/**
 * A performant hook that tracks whether a CSS media query matches.
 * Uses the native `change` event on the `MediaQueryList` for
 * instant updates without polling or unnecessary re-renders.
 *
 * @param query - A valid CSS media query (e.g. `'(min-width: 768px)'`).
 * @param serverFallback - Value used during server‑side rendering (default `false`).
 */
export const useMediaQuery = (query: string, serverFallback = false): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return serverFallback
    return window.matchMedia(query).matches
  })

  // Keep track of the current query string to handle changes
  const queryRef = useRef(query)
  queryRef.current = query

  useEffect(() => {
    const media = window.matchMedia(queryRef.current)

    // Sync state immediately (handles cases where `matches` changed between renders)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Use the modern, performant `change` event
    media.addEventListener('change', handleChange)

    return () => {
      media.removeEventListener('change', handleChange)
    }
  }, [query]) // Re-run if the query string changes

  return matches
}

// Re‑export for consistency
const hooks = { useMediaQuery }
export default hooks
