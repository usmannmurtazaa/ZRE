/**
 * Area Type Definitions
 *
 * Defines the structure of an Area document in Firestore. Areas represent
 * geographical locations (schemes, towns, sectors) where Zain Real Estate
 * operates. Each area carries metadata used for SEO, filtering, and display.
 *
 * All dates are native JS `Date` objects (converted from Firestore Timestamps
 * at the service layer).
 *
 * @module types/area
 */

import type { PropertyType } from './property'

// ── Area Type ──────────────────────────────────────────────────────────

/**
 * Represents a geographical area or scheme served by the agency.
 *
 * Areas are displayed on the Areas listing page (`/areas`) and each has its
 * own detail page (`/areas/:slug`) that shows properties in that area.
 */
export interface Area {
  /** Unique Firestore document ID. */
  areaId: string

  /** Display name (e.g. "Mehran Town", "Hawksbay Scheme 42"). */
  name: string

  /** URL‑friendly slug generated from `name`. */
  slug: string

  /**
   * A detailed description of the area.
   * Used on the Area Detail page for SEO and user information.
   */
  description?: string

  /** Hero image displayed on the Area Detail page and in cards. */
  imageURL?: string | null

  /**
   * Optional geographic coordinates for map display.
   * When present, enables rich snippets and map embedding.
   */
  mapCoordinates?: {
    latitude: number
    longitude: number
    zoom?: number
  } | null

  /**
   * Types of properties available in this area.
   * Used to pre‑filter on the area page and for SEO keywords.
   */
  propertyTypes: PropertyType[]

  /**
   * Typical price range for properties in the area.
   * Displayed as a quick reference on cards and detail pages.
   */
  priceRange?: {
    min: number
    max: number
    currency?: string // defaults to 'PKR'
  } | null

  /** Soft‑delete flag. Inactive areas are hidden from public views. */
  isActive: boolean

  /** Timestamp when the area document was created. */
  createdAt: Date

  /** Timestamp of last update. */
  updatedAt: Date

  /**
   * Current number of active properties listed in this area.
   * Updated atomically when properties are added/removed.
   */
  propertyCount: number

  /**
   * Popularity score (views, inquiries, etc.).
   * Used for sorting on the Areas listing page.
   */
  popularity: number

  /**
   * Optional short tagline or subtitle (e.g. "Premier residential area").
   * Used on area cards.
   */
  tagline?: string

  /**
   * Icons or badges to display (e.g. "🏠 Residential Hub").
   * Reserved for future UI enhancements.
   */
  badges?: string[]
}

// ── DTOs & Partial Types ───────────────────────────────────────────────

/**
 * Input type for creating a new area.
 * Excludes fields that are auto‑generated or managed by the backend.
 */
export type CreateAreaInput = Omit<
  Area,
  'areaId' | 'createdAt' | 'updatedAt' | 'propertyCount' | 'popularity' | 'slug'
> & {
  /** Slug can be manually provided; otherwise auto‑generated. */
  slug?: string
}

/**
 * Input type for updating an area.
 * All fields are optional to support partial updates.
 */
export type UpdateAreaInput = Partial<Omit<Area, 'areaId' | 'createdAt' | 'updatedAt'>>

// ── Normalised Coordinates (compatibility alias) ───────────────────────

/**
 * Re‑export `mapCoordinates` as a flat lat/lng pair for legacy code.
 * @deprecated Use `mapCoordinates` directly.
 */
export type AreaCoordinates = NonNullable<Area['mapCoordinates']>
