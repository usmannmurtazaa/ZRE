/**
 * Testimonial Type Definitions
 *
 * Defines the structure of client testimonials used for social proof across
 * the Zain Real Estate platform. Testimonials may be static or loaded from
 * Firestore. All dates are native JS `Date` objects.
 *
 * @module types/testimonial
 */

// ── Core Testimonial Interface ────────────────────────────────────────────

/**
 * Represents a single client testimonial.
 */
export interface Testimonial {
  /** Unique identifier for the testimonial (Firestore document ID). */
  testimonialId: string

  /** Full name of the client. */
  clientName: string

  /** Optional avatar / profile picture URL of the client. */
  clientImage?: string

  /** The actual testimonial text. */
  content: string

  /**
   * Star rating (1–5). Optional – not all testimonials need a rating.
   * Stored as an integer.
   */
  rating?: number

  /** The type of property the client dealt with (e.g. 'Residential Plot'). */
  propertyType?: string

  /** Whether this testimonial should appear on the homepage / featured section. */
  isFeatured: boolean

  /** Soft‑publish flag. Only published testimonials are visible to the public. */
  isPublished: boolean

  /** When the testimonial was created. */
  createdAt: Date

  /** When the testimonial was last updated. */
  updatedAt: Date

  /** Optional source of the testimonial (e.g. 'google', 'direct', 'facebook'). */
  source?: string

  /** Optional position / company of the client (for authority). */
  clientRole?: string

  /** Optional URL to the original review (e.g. Google review link). */
  originalReviewUrl?: string
}

// ── Input Types ───────────────────────────────────────────────────────────

/**
 * Data required to create a new testimonial.
 * Auto‑generated fields like `testimonialId`, `createdAt`, `updatedAt` are omitted.
 */
export type CreateTestimonialInput = Omit<Testimonial, 'testimonialId' | 'createdAt' | 'updatedAt'>

/**
 * Data for updating an existing testimonial.
 * All fields are optional to allow partial updates.
 */
export type UpdateTestimonialInput = Partial<Omit<Testimonial, 'testimonialId' | 'createdAt'>> & {
  /** The ID of the testimonial to update. */
  testimonialId: string
}
