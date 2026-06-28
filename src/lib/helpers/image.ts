/**
 * Image helper utilities for responsive, optimized images.
 *
 * This module provides functions to generate optimized image URLs and
 * `srcset` attributes. It currently works with Firebase Storage URLs
 * and is designed to be easily adapted to a CDN / image transformation
 * service (Cloudinary, Imgix, etc.) in the future.
 *
 * @module image
 */

// ── Configuration ─────────────────────────────────────────────────────────

/**
 * Base CDN URL if you use a transformation service.
 * Set to `undefined` to fall back to the original URL with no transformations.
 */
const CDN_BASE_URL: string | undefined = undefined // e.g. 'https://ik.imagekit.io/...'

// Common widths for responsive images.
const DEFAULT_WIDTHS = [320, 640, 768, 1024, 1280, 1920] as const

// ── Internal Helpers ──────────────────────────────────────────────────────

/**
 * Checks if a URL is absolute (starts with http:// or https://).
 */
const isAbsoluteUrl = (url: string): boolean =>
  url.startsWith('http://') || url.startsWith('https://')

/**
 * Ensures a relative URL starts with a leading slash.
 */
const ensureLeadingSlash = (path: string): string => (path.startsWith('/') ? path : `/${path}`)

/**
 * Simple placeholder image as a data URI for missing images.
 */
const PLACEHOLDER_DATA_URI =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480"%3E%3Crect width="100%25" height="100%25" fill="%23E5E7EB"/%3E%3Ctext x="320" y="260" text-anchor="middle" fill="%239CA3AF" font-family="sans-serif" font-size="32"%3ENo Image%3C/text%3E%3C/svg%3E'

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Returns a full URL for an image. If the URL is already absolute it is
 * returned as is. Otherwise it is prefixed with the CDN base or returned as a
 * relative URL.
 *
 * @param url - The image path (relative or absolute).
 * @returns The full image URL, or a placeholder data URI if no URL is provided.
 */
export function getImageUrl(url?: string | null): string {
  if (!url) return PLACEHOLDER_DATA_URI
  if (isAbsoluteUrl(url)) return url
  if (CDN_BASE_URL) return `${CDN_BASE_URL}${ensureLeadingSlash(url)}`
  return ensureLeadingSlash(url)
}

/**
 * Returns the URL for a thumbnail of the given width.
 *
 * Currently returns the original URL. When a CDN with image transformation
 * capabilities (e.g. Cloudinary) is integrated, this function can be updated
 * to append width parameters.
 *
 * @param url - The original image URL.
 * @param width - Desired width in pixels.
 * @returns The thumbnail URL (currently same as input).
 */
export function getThumbnailUrl(url: string, _width: number): string {
  if (!url) return PLACEHOLDER_DATA_URI
  // Integration point: if using Cloudinary, you could do:
  // return url.replace('/upload/', `/upload/w_${width}/`);
  return url
}

/**
 * Generates a `srcset` attribute string for use in `<img>` or `<source>` elements.
 *
 * @param url - The original image URL.
 * @param widths - Array of desired widths (defaults to common breakpoints).
 * @returns A string like `"/img-320w.jpg 320w, /img-640w.jpg 640w, ..."`.
 */
export function getImageSrcSet(url: string, widths: readonly number[] = DEFAULT_WIDTHS): string {
  if (!url) return ''
  return widths.map((width) => `${getThumbnailUrl(url, width)} ${width}w`).join(', ')
}

/**
 * Returns a suitable `sizes` attribute for a common responsive grid layout.
 *
 * @param options - Optional overrides for column counts at different breakpoints.
 * @returns A `sizes` string ready to use.
 */
export function getImageSizes(
  options: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    default?: string
  } = {}
): string {
  const {
    xs = '100vw',
    sm = '50vw',
    md = '33vw',
    lg = '25vw',
    xl = '20vw',
    default: def = '100vw',
  } = options
  return `(max-width: 479px) ${xs}, (max-width: 639px) ${sm}, (max-width: 1023px) ${md}, (max-width: 1279px) ${lg}, (max-width: 1535px) ${xl}, ${def}`
}

/**
 * Returns a simple blurry placeholder background (CSS) while an image loads.
 * Can be used as an inline style or CSS variable.
 */
export function getImagePlaceholderStyle(): string {
  return 'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%)'
}

// ── Backward compatibility (original exports) ────────────────────────────
/**
 * @deprecated Use `getThumbnailUrl` instead.
 */
export const getImageSize = getThumbnailUrl

// ── Re‑export object ─────────────────────────────────────────────────────
const imageHelpers = {
  getImageUrl,
  getThumbnailUrl,
  getImageSrcSet,
  getImageSizes,
  getImagePlaceholderStyle,
  getImageSize,
}

export default imageHelpers
