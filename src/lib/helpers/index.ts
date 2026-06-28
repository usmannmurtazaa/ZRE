/**
 * Helpers barrel export – re‑exports every utility function from the helpers directory.
 *
 * Import from this file to keep your imports clean:
 * @example
 * import { formatPrice, formatDate, cn, generateSlug } from '@/lib/helpers'
 */

// ── Class name merging ────────────────────────────────────────────────────
export { cn } from './cn'

// ── Currency formatting ──────────────────────────────────────────────────
export { formatPrice, formatCompactPrice } from './currency'

// ── Date / time formatting ────────────────────────────────────────────────
export {
  formatDate,
  formatShortDate,
  formatDateTime,
  timeAgo,
  formatRelative,
  isToday,
} from './date'

// ── Image utilities ───────────────────────────────────────────────────────
export {
  getImageUrl,
  getThumbnailUrl,
  getImageSrcSet,
  getImageSizes,
  getImagePlaceholderStyle,
  getImageSize,
} from './image'

// ── String helpers ────────────────────────────────────────────────────────
export { generateSlug, truncate, capitalize, titleCase, humanize, stripHtml } from './string'
