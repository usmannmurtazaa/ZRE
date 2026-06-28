/**
 * API & Common Type Definitions
 *
 * Reusable types for API responses, pagination, errors, and query parameters.
 * These types are used across the entire platform to ensure consistent
 * data shapes and reduce duplication.
 *
 * @module types/api
 */

// ── Pagination ─────────────────────────────────────────────────────────

/**
 * Generic paginated response returned by all list endpoints.
 *
 * @template T - The type of items in the list.
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page. */
  items: T[]
  /** Total number of items across all pages. */
  total: number
  /** Current page number (1‑based). */
  page: number
  /** Number of items per page. */
  limit: number
  /** Total number of pages. */
  totalPages: number
  /**
   * Optional cursor for Firestore‑style pagination.
   * Contains the last document snapshot reference to fetch the next batch.
   */
  nextCursor?: {
    id: string
    ref: unknown // Firestore DocumentReference (opaque)
  } | null
}

// ── Sorting & Filtering ────────────────────────────────────────────────

/** Supported sort directions. */
export type SortDirection = 'asc' | 'desc'

/**
 * Common query parameters accepted by list endpoints.
 * Can be extended by domain‑specific filters.
 */
export interface BaseQueryParams {
  /** Page number (1‑based). */
  page?: number
  /** Number of items per page (max 50). */
  limit?: number
  /** Field to sort by. */
  sortBy?: string
  /** Sort direction. */
  sortDirection?: SortDirection
  /** Free‑text search query. */
  search?: string
}

// ── API Error ──────────────────────────────────────────────────────────

/**
 * Standardised error structure returned by the API or thrown by services.
 */
export interface ApiError {
  /** Machine‑readable error code (e.g. 'NOT_FOUND', 'VALIDATION_ERROR'). */
  code: string
  /** Human‑readable error message. */
  message: string
  /** Optional additional details (field errors, stack traces in dev). */
  details?: unknown
  /** HTTP status code equivalent. */
  status?: number
}

// ── Mutation Responses ─────────────────────────────────────────────────

/**
 * Generic response wrapper for mutation (create / update / delete) operations.
 */
export interface MutationResponse<T = unknown> {
  /** Indicates whether the operation was successful. */
  success: boolean
  /** Optional success message. */
  message?: string
  /** The resulting data (e.g., the created object). */
  data?: T
  /** If unsuccessful, contains error information. */
  error?: ApiError
}

/**
 * Convenience type for a mutation that only returns a success indicator.
 */
export type EmptyMutationResponse = MutationResponse<undefined>

// ── Timestamps ─────────────────────────────────────────────────────────

/**
 * Represents a Firestore Timestamp that has been converted to a native Date.
 * All services return this shape; the API layer always converts Firestore
 * Timestamps to Dates for easier client consumption.
 */
export interface FirestoreDate {
  /** The native JavaScript Date object. */
  toDate(): Date
}

// ── File Upload ────────────────────────────────────────────────────────

/**
 * Metadata returned after a successful file upload to Cloud Storage.
 */
export interface UploadResult {
  /** The download URL of the uploaded file. */
  url: string
  /** The original file name. */
  fileName: string
  /** The file size in bytes. */
  size: number
  /** MIME type of the uploaded file. */
  contentType: string
}

// ── Status Enums (Shared) ──────────────────────────────────────────────

/** Common status values used across multiple domains. */
export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ARCHIVED = 'archived',
}

/**
 * Generic key‑value pair used for dropdowns and filters.
 */
export interface SelectOption {
  label: string
  value: string
}
