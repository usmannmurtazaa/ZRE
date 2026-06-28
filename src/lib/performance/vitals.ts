import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals'
import type { Metric } from 'web-vitals'

/**
 * Web Vitals reporting module for Zain Real Estate.
 *
 * Captures Core Web Vitals (LCP, FID, CLS, FCP, TTFB) and sends them
 * to Google Analytics 4 for performance monitoring.
 *
 * Usage:
 * ```ts
 * import { reportWebVitals, sendToAnalytics } from './vitals'
 * reportWebVitals(sendToAnalytics)
 * ```
 */

// ── Core Reporting Function ────────────────────────────────────────────

/**
 * Starts observing all Core Web Vitals metrics and invokes the
 * supplied callback for each report.
 *
 * @param onPerfEntry - Callback to handle each metric (e.g., send to analytics).
 */
export const reportWebVitals = (onPerfEntry?: (metric: Metric) => void) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Register all metrics – web-vitals will only call if the browser supports them
    onCLS(onPerfEntry)
    onFID(onPerfEntry)
    onLCP(onPerfEntry)
    onFCP(onPerfEntry)
    onTTFB(onPerfEntry)
  }
}

// ── Analytics Sender ───────────────────────────────────────────────────

/**
 * Sends the metric to Google Analytics 4 (gtag) or a custom endpoint.
 *
 * In production, metrics are silently dropped if `gtag` is unavailable.
 * In development, they are logged to the console for debugging.
 *
 * @param metric - A Web Vitals Metric object.
 */
export const sendToAnalytics = (metric: Metric) => {
  const { name, value, id, delta, rating } = metric

  // Always log to console in development for debugging
  if ((import.meta as any).env?.DEV) {
    console.log(
      `[Web Vitals] ${name}: ${Math.round(name === 'CLS' ? value * 1000 : value)}` +
        ` (delta: ${Math.round(name === 'CLS' ? delta * 1000 : delta)}, rating: ${rating})`
    )
  }

  // Send to GA4 if available (must be loaded)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(name === 'CLS' ? value * 1000 : value), // CLS is unitless, scale for readability
      event_label: id,
      metric_delta: Math.round(name === 'CLS' ? delta * 1000 : delta),
      metric_rating: rating,
      non_interaction: true, // don't affect bounce rate
    })
  }
}

// ── Default Export ─────────────────────────────────────────────────────

const vitals = {
  reportWebVitals,
  sendToAnalytics,
}

export default vitals
