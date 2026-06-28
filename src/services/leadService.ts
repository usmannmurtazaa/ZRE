/**
 * Lead Service
 *
 * Handles all lead (inquiry) CRUD operations in Firestore.
 * Leads are created from contact forms and managed by agents/admins.
 *
 * All timestamps are normalised to native `Date` objects for consumption
 * by React components.
 *
 * @module leadService
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'
import { getCountFromServer } from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Lead, CreateLeadInput, LeadStatus } from '@/types'

// ── Constants ──────────────────────────────────────────────────────────

const LEADS_COLLECTION = 'leads'

// ── Helper: Firestore snapshot → Lead ─────────────────────────────────

/**
 * Converts a Firestore document snapshot into a fully typed `Lead` object.
 * All timestamps are converted to native JS Dates. Missing fields are
 * replaced with sensible defaults.
 */
function docToLead(snapshot: DocumentSnapshot<DocumentData>): Lead {
  const data = snapshot.data() ?? {}
  return {
    leadId: snapshot.id,
    propertyId: data.propertyId ?? '',
    propertyTitle: data.propertyTitle ?? '',
    agentId: data.agentId ?? '',
    agentName: data.agentName ?? '',
    name: data.name ?? '',
    email: data.email ?? '',
    phone: data.phone ?? '',
    message: data.message ?? null,
    source: data.source ?? 'listing',
    status: (data.status as LeadStatus) ?? 'new',
    notes: data.notes ?? [],
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    respondedAt: data.respondedAt?.toDate?.() ?? null,
    convertedAt: data.convertedAt?.toDate?.() ?? null,
  }
}

// ── Validation helpers ────────────────────────────────────────────────

/**
 * Validates lead input data before writing to Firestore.
 * Throws a descriptive error if validation fails.
 */
function validateCreateInput(data: CreateLeadInput): void {
  if (!data.name?.trim()) throw new Error('Name is required.')
  if (!data.email?.trim()) throw new Error('Email is required.')
  if (!data.phone?.trim()) throw new Error('Phone is required.')
  if (!data.propertyId) throw new Error('Property ID is required.')
  if (!data.agentId) throw new Error('Agent ID is required.')
}

// ── Service Implementation ────────────────────────────────────────────

export const leadService = {
  /**
   * Create a new lead.
   * Automatically sets the initial status to 'new' and empty notes.
   *
   * @param data - Lead creation payload.
   * @returns The newly created Lead object.
   */
  async create(data: CreateLeadInput): Promise<Lead> {
    validateCreateInput(data)

    try {
      const now = Timestamp.fromDate(new Date())
      const newLead = {
        ...data,
        message: data.message?.trim() || null,
        status: 'new' as LeadStatus,
        notes: [],
        createdAt: now,
        updatedAt: now,
        respondedAt: null,
        convertedAt: null,
      }

      const docRef = await addDoc(collection(db, LEADS_COLLECTION), newLead)
      const created = await getDoc(docRef)
      return docToLead(created)
    } catch (error) {
      console.error('[LeadService] create error:', error)
      throw new Error('Failed to submit inquiry. Please try again.')
    }
  },

  /**
   * Fetch leads assigned to a specific agent.
   * Optionally filter by status.
   *
   * @param agentId - Firestore UID of the agent.
   * @param status - Optional lead status filter.
   * @returns Array of Lead objects sorted by newest first.
   */
  async getByAgent(agentId: string, status?: LeadStatus): Promise<Lead[]> {
    if (!agentId) {
      console.warn('[LeadService] getByAgent called with empty agentId')
      return []
    }

    try {
      const constraints: QueryConstraint[] = [
        where('agentId', '==', agentId),
        orderBy('createdAt', 'desc'),
      ]

      if (status) {
        constraints.push(where('status', '==', status))
      }

      const q = query(collection(db, LEADS_COLLECTION), ...constraints)
      const snapshot = await getDocs(q)
      return snapshot.docs.map(docToLead)
    } catch (error) {
      console.error(`[LeadService] getByAgent(${agentId}) error:`, error)
      throw new Error('Failed to load leads.')
    }
  },

  /**
   * Fetch a single lead by its Firestore document ID.
   *
   * @param id - The lead document ID.
   * @returns The Lead object, or null if not found.
   */
  async getById(id: string): Promise<Lead | null> {
    if (!id) return null

    try {
      const docRef = doc(db, LEADS_COLLECTION, id)
      const snapshot = await getDoc(docRef)
      return snapshot.exists() ? docToLead(snapshot) : null
    } catch (error) {
      console.error(`[LeadService] getById(${id}) error:`, error)
      throw new Error('Failed to load lead details.')
    }
  },

  /**
   * Update the status of a lead.
   * Automatically sets `respondedAt` when status becomes 'contacted',
   * and `convertedAt` when status becomes 'converted'.
   *
   * @param id - The lead document ID.
   * @param status - The new status.
   */
  async updateStatus(id: string, status: LeadStatus): Promise<void> {
    if (!id) throw new Error('Lead ID is required')

    try {
      const docRef = doc(db, LEADS_COLLECTION, id)
      const snapshot = await getDoc(docRef)

      if (!snapshot.exists()) {
        throw new Error(`Lead not found with ID: ${id}`)
      }

      const existing = snapshot.data()
      const updateData: Record<string, unknown> = {
        status,
        updatedAt: Timestamp.fromDate(new Date()),
      }

      // Set respondedAt the first time it's contacted (and not already set)
      if (status === 'contacted' && !existing?.respondedAt) {
        updateData.respondedAt = Timestamp.fromDate(new Date())
      }

      // Set convertedAt when converted
      if (status === 'converted') {
        updateData.convertedAt = Timestamp.fromDate(new Date())
      }

      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error(`[LeadService] updateStatus(${id}) error:`, error)
      throw new Error('Failed to update lead status.')
    }
  },

  /**
   * Append a note to a lead.
   *
   * @param id - The lead document ID.
   * @param note - An object with `text`, `agentId`, and optionally `createdAt`.
   */
  async addNote(
    id: string,
    note: { text: string; agentId: string; createdAt?: Date }
  ): Promise<void> {
    if (!id) throw new Error('Lead ID is required')
    if (!note.text?.trim()) throw new Error('Note cannot be empty')

    try {
      const docRef = doc(db, LEADS_COLLECTION, id)
      const snapshot = await getDoc(docRef)

      if (!snapshot.exists()) {
        throw new Error(`Lead not found with ID: ${id}`)
      }

      const existingNotes = snapshot.data()?.notes ?? []
      const newNote = {
        text: note.text.trim(),
        agentId: note.agentId,
        createdAt: note.createdAt
          ? Timestamp.fromDate(
              note.createdAt instanceof Date ? note.createdAt : new Date(note.createdAt)
            )
          : Timestamp.fromDate(new Date()),
      }

      await updateDoc(docRef, {
        notes: [...existingNotes, newNote],
        updatedAt: Timestamp.fromDate(new Date()),
      })
    } catch (error) {
      console.error(`[LeadService] addNote(${id}) error:`, error)
      throw new Error('Failed to add note.')
    }
  },

  /**
   * Permanently delete a lead document.
   * Use with caution – consider soft-deleting instead.
   */
  async delete(id: string): Promise<void> {
    if (!id) throw new Error('Lead ID is required')

    try {
      await deleteDoc(doc(db, LEADS_COLLECTION, id))
    } catch (error) {
      console.error(`[LeadService] delete(${id}) error:`, error)
      throw new Error('Failed to delete lead.')
    }
  },

  /**
   * Admin: fetch all leads with optional filters.
   *
   * @param filters - Optional status and/or agentId filters.
   * @returns Array of Lead objects sorted by newest first.
   */
  async getAll(filters?: { status?: LeadStatus; agentId?: string }): Promise<Lead[]> {
    try {
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')]

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status))
      }
      if (filters?.agentId) {
        constraints.push(where('agentId', '==', filters.agentId))
      }

      const q = query(collection(db, LEADS_COLLECTION), ...constraints)
      const snapshot = await getDocs(q)
      return snapshot.docs.map(docToLead)
    } catch (error) {
      console.error('[LeadService] getAll error:', error)
      throw new Error('Failed to load leads.')
    }
  },

  /**
   * Admin: get total lead count (with optional status filter).
   */
  async getCount(status?: LeadStatus): Promise<number> {
    try {
      const constraints: QueryConstraint[] = []
      if (status) {
        constraints.push(where('status', '==', status))
      }
      const countQuery = query(collection(db, LEADS_COLLECTION), ...constraints)
      const snapshot = await getCountFromServer(countQuery)
      return snapshot.data().count
    } catch (error) {
      console.error('[LeadService] getCount error:', error)
      return 0
    }
  },
}

export default leadService
