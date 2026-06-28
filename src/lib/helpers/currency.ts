/**
 * Currency formatting utilities for Pakistani Rupees (PKR).
 *
 * All formatters use the `en-PK` locale for consistent number grouping
 * and respect the brand's premium presentation standards.
 */

/**
 * Format a number as a full Pakistani Rupee string with proper grouping.
 *
 * @param price - The amount in PKR (e.g. 25000000).
 * @returns A formatted string like "PKR 25,000,000".
 *
 * @example
 * formatPrice(25000000) // "PKR 25,000,000"
 * formatPrice(undefined) // "PKR —"
 * formatPrice(null) // "PKR —"
 */
export function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return 'PKR —'
  }
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(price)
}

/**
 * Format a price into a compact, human‑readable form.
 *
 * Useful for dashboard cards, badges, or places where space is limited.
 *
 * @param price - The amount in PKR (e.g. 25000000).
 * @returns A compact string like "PKR 2.5 Crore" or "PKR 25 Lac".
 *
 * @example
 * formatCompactPrice(25000000)  // "PKR 2.5 Crore"
 * formatCompactPrice(2500000)   // "PKR 25 Lac"
 * formatCompactPrice(500000)    // "PKR 5 Lac"
 * formatCompactPrice(0)         // "PKR 0"
 * formatCompactPrice(undefined) // "PKR —"
 */
export function formatCompactPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return 'PKR —'
  }
  if (price >= 10_000_000) {
    const crore = price / 10_000_000
    return `PKR ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(1)} Crore`
  }
  if (price >= 100_000) {
    const lac = price / 100_000
    return `PKR ${lac % 1 === 0 ? lac.toFixed(0) : lac.toFixed(1)} Lac`
  }
  // For smaller amounts, fall back to the full formatter
  return formatPrice(price)
}

// For backward compatibility, re-export a helper object.
const currencyHelpers = {
  formatPrice,
  formatCompactPrice,
}
export default currencyHelpers
