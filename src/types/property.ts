/**
 * Property Type Definitions
 *
 * Central type definitions for properties in the Zain Real Estate platform.
 * These types are shared across components, hooks, services, and validation.
 *
 * All date fields represent native JS `Date` objects (converted from Firestore
 * Timestamps at the service layer). For file uploads, `File` objects are only
 * used in the UI layer; the service layer expects URL strings.
 *
 * @module types/property
 */

// ── Property Classification ──────────────────────────────────────────────

/** Primary property categories. */
export type PropertyType = 'residential' | 'commercial' | 'industrial'

/** Detailed sub‑types within each category. */
export type PropertySubtype =
  | 'plot'
  | 'house'
  | 'apartment'
  | 'shop'
  | 'office'
  | 'factory'
  | 'warehouse'

/** Current listing status. */
export type PropertyStatus = 'for_sale' | 'for_rent' | 'sold' | 'rented'

// ── Enums & Display Maps ──────────────────────────────────────────────────

/** Display labels for property types. */
export const PropertyTypeLabels: Record<PropertyType, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  industrial: 'Industrial',
}

/** Display labels for property subtypes. */
export const PropertySubtypeLabels: Record<PropertySubtype, string> = {
  plot: 'Plot',
  house: 'House',
  apartment: 'Apartment',
  shop: 'Shop',
  office: 'Office',
  factory: 'Factory',
  warehouse: 'Warehouse',
}

/** Display labels and colour hints for property statuses. */
export const PropertyStatusMap: Record<PropertyStatus, { label: string; color: string }> = {
  for_sale: {
    label: 'For Sale',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  for_rent: {
    label: 'For Rent',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  sold: {
    label: 'Sold',
    color: 'bg-red-50 text-red-700 border-red-200',
  },
  rented: {
    label: 'Rented',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
  },
}

// ── Core Property Interface ───────────────────────────────────────────────

/** Represents a single property listing document in Firestore. */
export interface Property {
  /** Unique Firestore document ID. */
  propertyId: string

  /** Title / headline of the listing. */
  title: string

  /** URL‑friendly slug generated from title. */
  slug: string

  /** Long‑form description. */
  description: string

  /** Primary category. */
  type: PropertyType

  /** Detailed sub‑type. */
  subtype: PropertySubtype

  /** Listing status. */
  status: PropertyStatus

  /** Asking price in PKR. */
  price: number

  /** Plot / floor area in square yards (main unit in Karachi). */
  sizeSqYds: number

  /** Area in square feet (optional). */
  sizeSqFt?: number | null

  /** Number of bedrooms (if applicable). */
  bedrooms?: number | null

  /** Number of bathrooms (if applicable). */
  bathrooms?: number | null

  /** Array of tags / features (e.g., 'corner', 'park-facing'). */
  features: string[]

  /** Full street address. */
  address: string

  /** Display name of the area (e.g., 'Mehran Town'). */
  area: string

  /** Reference to the Area document ID. */
  areaId: string

  /** Firebase Auth UID of the assigned agent. */
  agentId: string

  /** Display name of the agent (denormalised). */
  agentName: string

  /** Contact phone number for the listing. */
  contactPhone: string

  /** Contact email for the listing. */
  contactEmail: string

  /** Array of images attached to the listing. */
  images: PropertyImage[]

  /** Whether the property is featured on the homepage. */
  isFeatured: boolean

  /** Soft‑delete flag. Inactive properties are hidden from public. */
  isActive: boolean

  /** Total number of detail page views. */
  views: number

  /** Total number of inquiries received. */
  inquiries: number

  /** Number of users who saved this property to favorites. */
  favorites: number

  /** Document creation timestamp. */
  createdAt: Date

  /** Last update timestamp. */
  updatedAt: Date

  /** Date when the property was published (may differ from creation). */
  publishedAt: Date

  /** Optional expiry date for the listing. */
  expiresAt?: Date | null

  /** Optional URL of the agent's profile photo (denormalised). */
  agentPhoto?: string | null

  /** Virtual tour / 360° URL (future use). */
  virtualTourUrl?: string | null
}

// ── Image Type ────────────────────────────────────────────────────────────

/** Represents a single image attached to a property. */
export interface PropertyImage {
  /** Public URL of the image (Firebase Storage). */
  url: string
  /** Alt text for accessibility & SEO. */
  alt: string
  /** Whether this image is the primary / hero image. */
  isMain: boolean
  /** Display order (0‑based). */
  order: number
}

// ── Filter & Query Types ─────────────────────────────────────────────────

/** Supported sort options for property listing pages. */
export type PropertySortOption = 'newest' | 'price-asc' | 'price-desc' | 'size-asc' | 'size-desc'

/**
 * Filters used in the property listing (search) page.
 * All fields are optional; defaults are applied at the service/hook level.
 */
export interface PropertyFilters {
  /** Filter by property type(s). */
  type?: PropertyType[]
  /** Filter by area name(s). */
  area?: string[]
  /** Minimum price (inclusive). */
  minPrice?: number
  /** Maximum price (inclusive). */
  maxPrice?: number
  /** Minimum size in sq yds (inclusive). */
  minSize?: number
  /** Maximum size in sq yds (inclusive). */
  maxSize?: number
  /** Filter by specific features (must match all if multiple, Firestore limitations apply). */
  features?: string[]
  /** Filter by listing status(es). */
  status?: PropertyStatus[]
  /** Sort order. */
  sortBy?: PropertySortOption
  /** Page number (1‑based). */
  page?: number
  /** Number of items per page (max 50). */
  limit?: number
  /** Free‑text keyword search (prefix match on title). */
  search?: string
  /** Filter by assigned agent ID (used in "My Properties"). */
  agentId?: string
  /**
   * Cursor for Firestore‑based pagination.
   * Provide the last document's ID and ref from the previous page.
   */
  lastDoc?: {
    id: string
    ref: unknown // Firestore DocumentReference (opaque)
  }
}

// ── CRUD Input Types ─────────────────────────────────────────────────────

/**
 * Data required to create a new property.
 * The `images` field can accept `File` objects during form handling,
 * but they should be uploaded separately and replaced with URLs before
 * reaching the service layer.
 */
export interface CreatePropertyInput {
  title: string
  description: string
  type: PropertyType
  subtype: PropertySubtype
  status: PropertyStatus
  price: number
  sizeSqYds: number
  sizeSqFt?: number
  bedrooms?: number
  bathrooms?: number
  features: string[]
  address: string
  area: string
  areaId: string
  agentId: string
  agentName?: string // often auto‑filled
  contactPhone: string
  contactEmail: string
  images?: PropertyImage[] | File[]
  isFeatured?: boolean
  publishedAt?: Date
  agentPhoto?: string | null
}

/**
 * Data for updating an existing property.
 * All fields are optional; only the provided fields are modified.
 * The `propertyId` is required to identify the document.
 */
export interface UpdatePropertyInput extends Partial<Omit<CreatePropertyInput, 'images'>> {
  propertyId: string
  images?: PropertyImage[] // only URL‑based images (files not accepted in updates directly)
}

// ── Utility Types ─────────────────────────────────────────────────────────

/** Property with a resolved Area object for convenience. */
export interface PropertyWithArea extends Property {
  areaData?: import('./area').Area
}

/** Paginated response containing properties. */
export interface PropertyPaginatedResponse {
  items: Property[]
  total: number
  page: number
  limit: number
  totalPages: number
  nextCursor?: { id: string; ref: unknown } | null
}
