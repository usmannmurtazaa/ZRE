/**
 * String utility helpers used across the Zain Real Estate platform.
 *
 * All functions are pure, type‑safe, and designed to handle edge cases
 * gracefully (null / undefined inputs, empty strings, special characters).
 */

/**
 * Generates a URL‑friendly slug from any string.
 *
 * - Converts to lowercase
 * - Removes special characters (except hyphens & spaces)
 * - Collapses multiple hyphens / spaces into single hyphens
 * - Trims leading / trailing hyphens
 * - Limits to 100 characters
 *
 * @param text - The input string (title, name, etc.)
 * @returns A clean slug, or an empty string if input is invalid.
 */
export function generateSlug(text: string | null | undefined): string {
  if (!text) return ''

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-') // Replace spaces & underscores with hyphens
    .replace(/-{2,}/g, '-') // Collapse multiple hyphens
    .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
    .substring(0, 100) // Limit length
}

/**
 * Truncates a string to a given length and appends an optional suffix.
 *
 * @param text - The input string.
 * @param maxLength - Maximum allowed characters (default 160).
 * @param suffix - String to append when truncated (default '…').
 * @returns The truncated string.
 */
export function truncate(text: string | null | undefined, maxLength = 160, suffix = '…'): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + suffix
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param text - Input string.
 * @returns The string with first letter uppercased (or unchanged if empty).
 */
export function capitalize(text: string | null | undefined): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Converts a string to Title Case.
 *
 * @param text - Input string.
 * @returns The title‑cased string.
 */
export function titleCase(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Converts a camelCase or PascalCase string to a human‑readable form
 * (e.g. "PropertyCard" → "Property Card").
 *
 * @param text - Input string.
 * @returns Readable string.
 */
export function humanize(text: string | null | undefined): string {
  if (!text) return ''
  return text
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Strips HTML tags from a string.
 *
 * @param html - The input HTML string.
 * @returns Plain text without tags.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}

// ── Re‑export object for backwards compatibility ──────────────────────────
const stringHelpers = {
  generateSlug,
  truncate,
  capitalize,
  titleCase,
  humanize,
  stripHtml,
}

export default stringHelpers
