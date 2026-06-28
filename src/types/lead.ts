/**
 * Lead & Inquiry Type Definitions
 *
 * Central type definitions for leads (inquiries) in the Zain Real Estate platform.
 * Leads are captured from contact forms and managed by agents / admins.
 *
 * All dates are native JS `Date` objects (converted from Firestore Timestamps
 * at the service layer).
 *
 * @module types/lead
 */

// ── Lead Source Enum ──────────────────────────────────────────────────────

/**
 * Origin of the lead – helps with analytics and attribution.
 *
 * - `listing`: From a property detail page.
 * - `contact`: From the general contact page.
 * - `whatsapp`: Initiated via WhatsApp link.
 * - `phone`: Initiated via phone call link.
 * - `search`: Originated from a search or filtering interaction.
 */
export type LeadSource = 'listing' | 'contact' | 'whatsapp' | 'phone' | 'search'

// ── Lead Status Enum ──────────────────────────────────────────────────────

/**
 * Current stage of the lead in the sales pipeline.
 *
 * - `new`: Just received, not yet reviewed.
 * - `contacted`: Agent has reached out to the prospect.
 * - `qualified`: Prospect has expressed genuine interest / budget confirmed.
 * - `converted`: Deal successfully closed.
 * - `lost`: Opportunity lost (e.g., prospect chose another option).
 */
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

// ── Lead Note ─────────────────────────────────────────────────────────────

/**
 * Represents a single note added to a lead by an agent or admin.
 */
export interface LeadNote {
  /** The note content. */
  text: string
  /** When the note was created. */
  createdAt: Date
  /** UID of the agent/admin who created the note. */
  agentId: string
  /** Optional display name of the note author (for UI convenience). */
  agentName?: string
}

// ── Core Lead Interface ───────────────────────────────────────────────────

/**
 * Represents a lead document in Firestore.
 * All dates are native JS `Date` objects.
 */
export interface Lead {
  /** Unique Firestore document ID. */
  leadId: string

  /** The property ID this lead is related to. */
  propertyId: string

  /** Human‑readable property title (denormalised for display). */
  propertyTitle: string

  /** UID of the assigned agent. */
  agentId: string

  /** Display name of the assigned agent (denormalised). */
  agentName: string

  /** Prospect's full name. */
  name: string

  /** Prospect's email address. */
  email: string

  /** Prospect's phone number. */
  phone: string

  /** Optional message / enquiry text. */
  message?: string | null

  /** How the lead was captured. */
  source: LeadSource

  /** Current pipeline status. */
  status: LeadStatus

  /** Array of internal notes added by agents/admin. */
  notes: LeadNote[]

  /** Timestamp when the lead was created. */
  createdAt: Date

  /** Timestamp of last update (status change, note added, etc.). */
  updatedAt: Date

  /**
   * Timestamp when the agent first contacted the prospect.
   * Automatically set when status moves to `contacted`.
   */
  respondedAt?: Date | null

  /**
   * Timestamp when the lead was converted (deal closed).
   * Automatically set when status moves to `converted`.
   */
  convertedAt?: Date | null

  /** Original UTM / referrer information (optional). */
  utm?: {
    source?: string
    medium?: string
    campaign?: string
  } | null
}

// ── Input Types (DTOs) ────────────────────────────────────────────────────

/**
 * Data required to create a new lead.
 * All date / auto‑generated fields are omitted.
 */
export interface CreateLeadInput {
  propertyId: string
  propertyTitle: string
  agentId: string
  agentName: string
  name: string
  email: string
  phone: string
  message?: string
  source: LeadSource
  /** Optional UTM parameters for marketing attribution. */
  utm?: Lead['utm']
}

/**
 * Data for updating an existing lead.
 * All fields are optional to allow PATCH‑style updates.
 */
export interface UpdateLeadInput {
  status?: LeadStatus
  notes?: LeadNote[]
  /** Optionally override the respondedAt timestamp. */
  respondedAt?: Date | null
  /** Optionally override the convertedAt timestamp. */
  convertedAt?: Date | null
  /** Update the assigned agent. */
  agentId?: string
  agentName?: string
}

/**
 * Convenience type for partial updates that also includes the lead ID.
 */
export interface LeadUpdatePayload {
  id: string
  data: UpdateLeadInput
}

// ── Helper Types ──────────────────────────────────────────────────────────

/**
 * Maps each lead status to a user‑friendly label and colour class.
 * Used for consistent badge / chip rendering across the UI.
 */
export const leadStatusMap: Record<LeadStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacted: { label: 'Contacted', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  qualified: { label: 'Qualified', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  converted: { label: 'Converted', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  lost: { label: 'Lost', color: 'bg-red-50 text-red-700 border-red-200' },
}

/**
 * Returns the display label for a given lead status.
 */
export function getLeadStatusLabel(status: LeadStatus): string {
  return leadStatusMap[status]?.label ?? status
}
