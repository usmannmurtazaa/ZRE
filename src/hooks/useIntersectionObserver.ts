import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Fire only once when element enters the viewport. Default `false`. */
  triggerOnce?: boolean
  /** Callback fired when intersection state changes. */
  onChange?: (isIntersecting: boolean) => void
}

interface UseIntersectionObserverReturn {
  ref: React.RefCallback<Element>
  isIntersecting: boolean
  /** Manually unobserve the element (useful for clean-up). */
  unobserve: () => void
}

/**
 * A performant, reusable hook that uses the Intersection Observer API
 * to track whether an element is visible within the viewport.
 *
 * Optimized for:
 * - Entrance animations (`triggerOnce` mode)
 * - Lazy-loading components
 * - Scroll-based analytics
 *
 * Returns a `ref` callback to attach to your element, a boolean
 * `isIntersecting`, and an `unobserve` function for manual clean-up.
 */
export const useIntersectionObserver = (
  options?: UseIntersectionObserverOptions
): UseIntersectionObserverReturn => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const elementRef = useRef<Element | null>(null)
  const triggeredOnce = useRef(false)

  const { triggerOnce = false, onChange, root, rootMargin = '0px', threshold = 0 } = options || {}

  // Stable onChange callback
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  // Clean up current observer
  const unobserve = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }
  }, [])

  // Callback ref that React will attach to the element
  const ref = useCallback(
    (node: Element | null) => {
      // Unobserve previous element
      unobserve()

      if (node) {
        elementRef.current = node
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            const isVisible = entry?.isIntersecting ?? false

            if (triggerOnce && isVisible && !triggeredOnce.current) {
              triggeredOnce.current = true
              setIsIntersecting(true)
              onChangeRef.current?.(true)
              unobserve() // Stop observing after first intersection
              return
            }

            if (!triggerOnce) {
              setIsIntersecting(isVisible)
              onChangeRef.current?.(isVisible)
            }
          },
          { root, rootMargin, threshold }
        )

        observerRef.current.observe(node)
      }
    },
    [root, rootMargin, threshold, triggerOnce, unobserve]
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      unobserve()
    }
  }, [unobserve])

  return { ref, isIntersecting, unobserve }
}

const hooks = { useIntersectionObserver }
export default hooks
