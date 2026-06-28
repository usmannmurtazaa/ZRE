/**
 * Area Service
 *
 * Provides CRUD operations for area documents in Firestore.
 * Areas represent geographical locations / schemes served by Zain Real Estate.
 *
 * All timestamps are normalised to native `Date` objects for client consumption.
 *
 * @module areaService
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Area } from '@/types'
import { generateSlug } from '@/lib/helpers/string'

// ── Constants ──────────────────────────────────────────────────────────

const AREAS_COLLECTION = 'areas'

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Converts a Firestore document snapshot into a typed `Area` object.
 * Normalises Firestore Timestamps to native JS Dates.
 */
function docToArea(snapshot: DocumentSnapshot<DocumentData>): Area {
  const data = snapshot.data() ?? {}
  return {
    areaId: snapshot.id,
    name: data.name ?? '',
    slug: data.slug ?? '',
    description: data.description ?? '',
    imageURL: data.imageURL ?? null,
    mapCoordinates: data.mapCoordinates ?? null,
    propertyTypes: data.propertyTypes ?? [],
    priceRange: data.priceRange ?? null,
    isActive: data.isActive ?? true,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    propertyCount: data.propertyCount ?? 0,
    popularity: data.popularity ?? 0,
  }
}

// ── Service Implementation ────────────────────────────────────────────

export const areaService = {
  /**
   * Fetch all active areas, sorted alphabetically by name.
   * Used on the Areas listing page and for dropdowns.
   */
  async getAll(): Promise<Area[]> {
    try {
      const q = query(
        collection(db, AREAS_COLLECTION),
        where('isActive', '==', true),
        orderBy('name', 'asc')
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(docToArea)
    } catch (error) {
      console.error('[AreaService] getAll error:', error)
      throw new Error('Failed to fetch areas. Please try again.')
    }
  },

  /**
   * Fetch a single area by its Firestore document ID.
   * Returns `null` if the document does not exist.
   */
  async getById(id: string): Promise<Area | null> {
    try {
      const docRef = doc(db, AREAS_COLLECTION, id)
      const snapshot = await getDoc(docRef)
      return snapshot.exists() ? docToArea(snapshot) : null
    } catch (error) {
      console.error(`[AreaService] getById(${id}) error:`, error)
      throw new Error('Failed to fetch area details.')
    }
  },

  /**
   * Fetch a single area by its URL slug.
   * Used on the Area Detail page.
   */
  async getBySlug(slug: string): Promise<Area | null> {
    try {
      const q = query(collection(db, AREAS_COLLECTION), where('slug', '==', slug), limit(1))
      const snapshot = await getDocs(q)
      return snapshot.empty ? null : docToArea(snapshot.docs[0]!)
    } catch (error) {
      console.error(`[AreaService] getBySlug(${slug}) error:`, error)
      throw new Error('Failed to fetch area by slug.')
    }
  },

  /**
   * Create a new area document.
   * Generates a slug from the name if one is not provided.
   *
   * @param data - Area data without auto‑generated fields.
   */
  async create(data: Omit<Area, 'areaId' | 'createdAt' | 'updatedAt'>): Promise<Area> {
    try {
      const slug = data.slug || generateSlug(data.name)
      const now = Timestamp.fromDate(new Date())

      const newArea = {
        ...data,
        slug,
        isActive: data.isActive ?? true,
        propertyCount: 0,
        popularity: 0,
        createdAt: now,
        updatedAt: now,
      }

      const docRef = await addDoc(collection(db, AREAS_COLLECTION), newArea)
      const created = await getDoc(docRef)
      return docToArea(created)
    } catch (error) {
      console.error('[AreaService] create error:', error)
      throw new Error('Failed to create area.')
    }
  },

  /**
   * Update an existing area document.
   * Regenerates the slug if the name changes and no new slug is provided.
   *
   * @param id - Firestore document ID.
   * @param data - Partial area fields to update.
   */
  async update(id: string, data: Partial<Area>): Promise<Area> {
    try {
      const docRef = doc(db, AREAS_COLLECTION, id)
      const updatePayload: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.fromDate(new Date()),
      }

      // Remove the ID field if it was accidentally included
      delete (updatePayload as any).areaId

      // Regenerate slug when name changes and slug not explicitly provided
      if (data.name && !data.slug) {
        updatePayload.slug = generateSlug(data.name)
      }

      await updateDoc(docRef, updatePayload)

      const updated = await getDoc(docRef)
      if (!updated.exists()) {
        throw new Error(`Area not found with ID: ${id}`)
      }
      return docToArea(updated)
    } catch (error) {
      console.error(`[AreaService] update(${id}) error:`, error)
      throw new Error('Failed to update area.')
    }
  },

  /**
   * Permanently delete an area document.
   * Consider soft‑deleting with `isActive = false` instead.
   */
  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, AREAS_COLLECTION, id))
    } catch (error) {
      console.error(`[AreaService] delete(${id}) error:`, error)
      throw new Error('Failed to delete area.')
    }
  },

  /**
   * Atomically increment or decrement the property count for an area.
   *
   * @param id - Area document ID.
   * @param delta - `1` to add a property, `-1` to remove.
   */
  async incrementPropertyCount(id: string, delta: 1 | -1): Promise<void> {
    try {
      const docRef = doc(db, AREAS_COLLECTION, id)
      await updateDoc(docRef, {
        propertyCount: increment(delta),
      })
    } catch (error) {
      console.error(`[AreaService] incrementPropertyCount(${id}) error:`, error)
      // Silently fail – this is a non‑critical operation
    }
  },

  /**
   * Increment the popularity score for an area.
   * This can be used to sort areas by demand / activity.
   */
  async incrementPopularity(id: string, delta: number = 1): Promise<void> {
    try {
      const docRef = doc(db, AREAS_COLLECTION, id)
      await updateDoc(docRef, {
        popularity: increment(delta),
      })
    } catch (error) {
      console.error(`[AreaService] incrementPopularity(${id}) error:`, error)
    }
  },
}

export default areaService
