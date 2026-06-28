/**
 * Date & time formatting utilities for the Zain Real Estate platform.
 *
 * All formatters use the `en-PK` locale and Pakistani timezone (Asia/Karachi)
 * for consistency. They gracefully handle `null`, `undefined`, Firestore
 * Timestamps, and raw ISO strings.
 */

import { Timestamp } from 'firebase/firestore'

// ── Normalisation ──────────────────────────────────────────────────────────

/**
 * Normalises a variety of date inputs into a native `Date` object.
 * Accepts `Date`, Firestore `Timestamp`, ISO string, or number (milliseconds).
 * Returns `undefined` for invalid or missing inputs.
 */
function toDate(input: Date | Timestamp | string | number | null | undefined): Date | undefined {
  if (!input) return undefined

  // Firestore Timestamp
  if (typeof input === 'object' && 'toDate' in input && typeof input.toDate === 'function') {
    return (input as Timestamp).toDate()
  }

  // Native Date
  if (input instanceof Timestamp) return input.toDate()

  // Number (unix milliseconds)
  if (typeof input === 'number') {
    const d = new Date(input)
    return isNaN(d.getTime()) ? undefined : d
  }

  // ISO string etc.
  const d = new Date(input)
  return isNaN(d.getTime()) ? undefined : d
}

// ── Primary Formatters ─────────────────────────────────────────────────────

/**
 * Formats a date into a long, readable string (e.g. "15 July 2025").
 *
 * @param date - Date, Firestore Timestamp, ISO string, or number.
 * @returns Formatted date string, or "—" if invalid.
 */
export function formatDate(date: Date | Timestamp | string | number | null | undefined): string {
  const d = toDate(date)
  if (!d) return '—'
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Karachi',
  }).format(d)
}

/**
 * Formats a date into a short numeric string (e.g. "15/07/2025").
 *
 * @param date - Date, Firestore Timestamp, ISO string, or number.
 * @returns Formatted short date, or "—" if invalid.
 */
export function formatShortDate(
  date: Date | Timestamp | string | number | null | undefined
): string {
  const d = toDate(date)
  if (!d) return '—'
  return new Intl.DateTimeFormat('en-PK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Asia/Karachi',
  }).format(d)
}

/**
 * Formats a date into a date‑time string (e.g. "15 July 2025, 2:30 PM").
 *
 * @param date - Date, Firestore Timestamp, ISO string, or number.
 * @returns Formatted datetime, or "—" if invalid.
 */
export function formatDateTime(
  date: Date | Timestamp | string | number | null | undefined
): string {
  const d = toDate(date)
  if (!d) return '—'
  return new Intl.DateTimeFormat('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Karachi',
  }).format(d)
}

// ── Relative Time ──────────────────────────────────────────────────────────

/**
 * Returns a human‑readable relative time string (e.g. "3h ago", "just now").
 *
 * @param date - The date to compare against now.
 * @returns Relative time string, or `formatDate(date)` if older than 30 days.
 */
export function timeAgo(date: Date | Timestamp | string | number | null | undefined): string {
  const d = toDate(date)
  if (!d) return '—'

  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 0) return formatDate(d) // future date
  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`

  // Fall back to full date for older entries
  return formatDate(d)
}

/**
 * Returns a relative time string suitable for conversational UI
 * (e.g. "Today at 2:30 PM", "Yesterday", "15 July 2025").
 *
 * @param date - The date to format.
 */
export function formatRelative(
  date: Date | Timestamp | string | number | null | undefined
): string {
  const d = toDate(date)
  if (!d) return '—'

  const now = new Date()
  const isToday =
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()

  if (isToday) {
    return `Today at ${new Intl.DateTimeFormat('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Karachi',
    }).format(d)}`
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()

  if (isYesterday) {
    return 'Yesterday'
  }

  // Same year? omit year
  if (d.getFullYear() === now.getFullYear()) {
    return new Intl.DateTimeFormat('en-PK', {
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Karachi',
    }).format(d)
  }

  return formatDate(d)
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Checks if a given date is today (based on Asia/Karachi timezone).
 */
export function isToday(date: Date | Timestamp | string | number | null | undefined): boolean {
  const d = toDate(date)
  if (!d) return false
  const now = new Date()
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  )
}

// ── Re‑export object ───────────────────────────────────────────────────────
const dateHelpers = {
  formatDate,
  formatShortDate,
  formatDateTime,
  timeAgo,
  formatRelative,
  isToday,
}
export default dateHelpers
