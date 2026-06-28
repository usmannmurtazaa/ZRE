import { z } from 'zod'

/**
 * Property validation schemas for Zain Real Estate.
 *
 * All schemas are designed to enforce data integrity at the API boundary
 * and provide clear, user‑friendly error messages.
 *
 * @module propertySchema
 */

// ── Shared patterns & constants ───────────────────────────────────────────

/** Minimum description length (character count). */
const MIN_DESC_LENGTH = 20

/** Maximum description length to avoid abuse. */
const MAX_DESC_LENGTH = 5000

/** Minimum address length. */
const MIN_ADDRESS_LENGTH = 5

/** Minimum title length. */
const MIN_TITLE_LENGTH = 5

/** Maximum title length (prevent overly long titles in UI). */
const MAX_TITLE_LENGTH = 120

// ── Property Sub‑types by category ────────────────────────────────────────

export const PROPERTY_SUBTYPE_MAP = {
  residential: ['plot', 'house', 'apartment'],
  commercial: ['shop', 'office'],
  industrial: ['factory', 'warehouse'],
} as const

/** Union of all valid sub‑types. */
export type PropertySubtype =
  (typeof PROPERTY_SUBTYPE_MAP)[keyof typeof PROPERTY_SUBTYPE_MAP][number]

/** Union of all valid sub‑types flattened. */
const ALL_SUBTYPES = Object.values(PROPERTY_SUBTYPE_MAP).flat() as PropertySubtype[]

// ── Image schema (reusable) ───────────────────────────────────────────────

/** Schema for a single property image. */
const propertyImageSchema = z.object({
  url: z.string().url('Image URL must be valid'),
  alt: z.string().max(150, 'Alt text must be under 150 characters').optional(),
  isMain: z.boolean().optional(),
})

// ── Property Schema (Create / Update) ─────────────────────────────────────

/**
 * Core property schema used for both creating and updating a property.
 *
 * Note: Several fields are required for creation; for updates they can be
 * partial. Use `propertySchema.partial()` when building an update form if needed.
 */
export const propertySchema = z.object({
  // ── Title & description ─────────────────────────────────────────────
  title: z
    .string()
    .min(MIN_TITLE_LENGTH, `Title must be at least ${MIN_TITLE_LENGTH} characters`)
    .max(MAX_TITLE_LENGTH, `Title cannot exceed ${MAX_TITLE_LENGTH} characters`)
    .trim(),

  description: z
    .string()
    .min(MIN_DESC_LENGTH, `Description must be at least ${MIN_DESC_LENGTH} characters`)
    .max(MAX_DESC_LENGTH, `Description cannot exceed ${MAX_DESC_LENGTH} characters`)
    .trim(),

  // ── Classification ──────────────────────────────────────────────────
  type: z.enum(['residential', 'commercial', 'industrial'], {
    errorMap: () => ({ message: 'Select a valid property type' }),
  }),

  subtype: z.enum(ALL_SUBTYPES as [string, ...string[]], {
    errorMap: () => ({ message: 'Select a valid subtype' }),
  }),

  status: z.enum(['for_sale', 'for_rent', 'sold', 'rented'], {
    errorMap: () => ({ message: 'Select a valid status' }),
  }),

  // ── Pricing ─────────────────────────────────────────────────────────
  price: z
    .number({
      required_error: 'Price is required',
      invalid_type_error: 'Price must be a number',
    })
    .positive('Price must be a positive number')
    .finite('Price must be a finite number'),

  // ── Size ────────────────────────────────────────────────────────────
  sizeSqYds: z
    .number({
      required_error: 'Size (sq yds) is required',
      invalid_type_error: 'Size must be a number',
    })
    .positive('Size must be a positive number')
    .finite(),

  sizeSqFt: z.number().positive('Size in sq ft must be positive').optional().nullable(),

  bedrooms: z
    .number()
    .int('Bedrooms must be a whole number')
    .min(0, 'Bedrooms cannot be negative')
    .max(100, 'Please check the number of bedrooms')
    .optional()
    .nullable(),

  bathrooms: z
    .number()
    .int('Bathrooms must be a whole number')
    .min(0, 'Bathrooms cannot be negative')
    .max(100, 'Please check the number of bathrooms')
    .optional()
    .nullable(),

  // ── Features ────────────────────────────────────────────────────────
  features: z
    .array(z.string().min(1))
    .default([])
    .transform((arr) => arr.filter((v, i) => arr.indexOf(v) === i)), // deduplicate

  // ── Location ────────────────────────────────────────────────────────
  address: z
    .string()
    .min(MIN_ADDRESS_LENGTH, `Address must be at least ${MIN_ADDRESS_LENGTH} characters`)
    .max(300, 'Address too long')
    .trim(),

  area: z.string().min(2, 'Area is required').max(100, 'Area name too long').trim(),

  areaId: z.string().min(1, 'Area ID is required'),

  // ── Agent / contact ─────────────────────────────────────────────────
  agentId: z.string().min(1, 'Agent ID is required'),
  agentName: z.string().min(1, 'Agent name is required').optional(), // auto-filled on create
  contactPhone: z
    .string()
    .regex(/^(\+92|0)\d{10}$/, 'Phone must be a valid Pakistani number (e.g., 03001234567)')
    .min(1, 'Contact phone is required'),
  contactEmail: z.string().email('Must be a valid email').min(1, 'Contact email is required'),

  // ── Images (optional, but strongly recommended) ──────────────────────
  images: z.array(propertyImageSchema).max(20, 'Maximum 20 images allowed').optional(),

  // ── Meta / flags ────────────────────────────────────────────────────
  isFeatured: z.boolean().optional().default(false),
  publishedAt: z.date().optional().nullable(),
})

// ── Property Filters Schema (for search / listing) ────────────────────────

/**
 * Schema for property search / filter query parameters.
 * All fields are optional; defaults are applied at the service layer.
 */
export const propertyFiltersSchema = z.object({
  type: z.array(z.enum(['residential', 'commercial', 'industrial'])).optional(),
  area: z.array(z.string().min(1)).optional(),
  minPrice: z.number().nonnegative().optional(),
  maxPrice: z.number().nonnegative().optional(),
  minSize: z.number().nonnegative().optional(),
  maxSize: z.number().nonnegative().optional(),
  features: z.array(z.string()).optional(),
  status: z.array(z.enum(['for_sale', 'for_rent', 'sold', 'rented'])).optional(),
  sortBy: z
    .enum(['price-asc', 'price-desc', 'size-asc', 'size-desc', 'newest'])
    .optional()
    .default('newest'),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(50, 'Maximum limit is 50').optional().default(12),
  search: z.string().optional(), // keyword search
})

// ── Type exports (useful for consumers) ───────────────────────────────────

/** Inferred type for the full property schema (without transforms). */
export type PropertyInput = z.input<typeof propertySchema>

/** Final output type after Zod transformations (e.g., deduplicated features). */
export type PropertyOutput = z.output<typeof propertySchema>

/** Inferred filters type. */
export type PropertyFiltersInput = z.input<typeof propertyFiltersSchema>

// ── Default export ────────────────────────────────────────────────────────

const schemas = {
  propertySchema,
  propertyFiltersSchema,
}

export default schemas
