import { z } from 'zod'

/**
 * Lead validation schemas for Zain Real Estate.
 *
 * These schemas ensure all lead data (inquiries) is clean, consistent,
 * and protected against invalid inputs before being saved to Firestore.
 */

// ── Shared Patterns ───────────────────────────────────────────────────────

/** Pakistani phone number pattern (e.g., +923001234567 or 03001234567). */
const PHONE_REGEX = /^(\+92|0)\d{10}$/

/** Maximum message length for lead inquiries. */
const MAX_MESSAGE_LENGTH = 500

/** Valid lead sources. */
const LEAD_SOURCES = ['listing', 'contact', 'whatsapp', 'phone', 'search'] as const

/** Valid lead statuses for updates. */
const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'converted', 'lost'] as const

// ── Create Lead Schema ────────────────────────────────────────────────────

/**
 * Schema for creating a new lead (from contact form or direct API).
 * Validates the minimum required fields with clear error messages.
 */
export const createLeadSchema = z.object({
  propertyId: z.string().min(1, 'Property reference is required'),
  propertyTitle: z.string().min(1, 'Property title is required'),
  agentId: z.string().min(1, 'Agent assignment is required'),
  agentName: z.string().min(1, 'Agent name is required'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(PHONE_REGEX, 'Please enter a valid Pakistani phone number (e.g., 03001234567)'),
  message: z
    .string()
    .max(MAX_MESSAGE_LENGTH, `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`)
    .optional()
    .or(z.literal('')),
  source: z.enum(LEAD_SOURCES, {
    errorMap: () => ({ message: 'Invalid lead source' }),
  }),
})

// ── Lead Note Schema (reusable) ───────────────────────────────────────────

/**
 * Schema for a single note within a lead.
 */
export const leadNoteSchema = z.object({
  text: z.string().min(1, 'Note cannot be empty').max(500, 'Note cannot exceed 500 characters'),
  createdAt: z.date().or(z.string()), // Accepts both Date and ISO strings
  agentId: z.string().min(1, 'Agent reference is required'),
})

// ── Update Lead Schema ────────────────────────────────────────────────────

/**
 * Schema for updating lead fields (status, notes, timestamps).
 * All fields are optional so PATCH‑style updates are supported.
 */
export const leadUpdateSchema = z.object({
  status: z
    .enum(LEAD_STATUSES, {
      errorMap: () => ({ message: 'Invalid lead status' }),
    })
    .optional(),
  notes: z.array(leadNoteSchema).optional(),
  respondedAt: z.date().optional(),
  convertedAt: z.date().optional(),
})

// ── Type Exports (useful for TypeScript consumers) ────────────────────────
export type CreateLeadInput = z.infer<typeof createLeadSchema>
export type LeadNoteInput = z.infer<typeof leadNoteSchema>
export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>

// ── Re‑export object for convenience ──────────────────────────────────────
const leadSchemas = {
  createLeadSchema,
  leadNoteSchema,
  leadUpdateSchema,
}

export default leadSchemas
