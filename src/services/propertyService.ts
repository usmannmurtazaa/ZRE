/**
 * Property Service
 *
 * Provides full CRUD operations for properties in Firestore, including
 * advanced filtering, cursor‑based pagination, and atomic counters.
 *
 * All returned `Property` objects have Firestore Timestamps converted to
 * native `Date` for seamless integration with the React layer.
 *
 * @module propertyService
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
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
  type QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type {
  Property,
  PropertyFilters,
  CreatePropertyInput,
  UpdatePropertyInput,
  PaginatedResponse,
  PropertyImage,
} from '@/types'
import { generateSlug } from '@/lib/helpers/string'

// ── Constants ──────────────────────────────────────────────────────────
const PROPERTIES_COLLECTION = 'properties'

// ── Helper: Firestore snapshot → Property ──────────────────────────────

/**
 * Converts a Firestore document snapshot into a `Property` object.
 * Handles missing fields gracefully and normalises timestamps.
 */
function docToProperty(snapshot: DocumentSnapshot<DocumentData>): Property {
  const data = snapshot.data() ?? {}
  return {
    propertyId: snapshot.id,
    title: data.title ?? '',
    slug: data.slug ?? '',
    description: data.description ?? '',
    type: data.type ?? 'residential',
    subtype: data.subtype ?? 'plot',
    status: data.status ?? 'for_sale',
    price: data.price ?? 0,
    sizeSqYds: data.sizeSqYds ?? 0,
    sizeSqFt: data.sizeSqFt ?? null,
    bedrooms: data.bedrooms ?? null,
    bathrooms: data.bathrooms ?? null,
    features: data.features ?? [],
    address: data.address ?? '',
    area: data.area ?? '',
    areaId: data.areaId ?? '',
    agentId: data.agentId ?? '',
    agentName: data.agentName ?? '',
    contactPhone: data.contactPhone ?? '',
    contactEmail: data.contactEmail ?? '',
    images: (data.images ?? []) as PropertyImage[],
    isFeatured: data.isFeatured ?? false,
    isActive: data.isActive ?? true,
    views: data.views ?? 0,
    inquiries: data.inquiries ?? 0,
    favorites: data.favorites ?? 0,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    publishedAt: data.publishedAt?.toDate?.() ?? new Date(),
    expiresAt: data.expiresAt?.toDate?.() ?? undefined,
    agentPhoto: data.agentPhoto ?? null,
  }
}

// ── Query Builder ─────────────────────────────────────────────────────

function buildConstraints(filters: PropertyFilters): QueryConstraint[] {
  const constraints: QueryConstraint[] = []

  constraints.push(where('isActive', '==', true))

  if (filters.search) {
    const searchTerm = filters.search.trim().toLowerCase()
    constraints.push(where('title', '>=', searchTerm))
    constraints.push(where('title', '<=', searchTerm + '\uf8ff'))
  }

  if (filters.type && filters.type.length > 0) {
    constraints.push(where('type', 'in', filters.type))
  }

  if (filters.area && filters.area.length > 0) {
    constraints.push(where('area', 'in', filters.area))
  }

  if (filters.status && filters.status.length > 0) {
    constraints.push(where('status', 'in', filters.status))
  }

  if (filters.minPrice !== undefined) {
    constraints.push(where('price', '>=', filters.minPrice))
  }
  if (filters.maxPrice !== undefined) {
    constraints.push(where('price', '<=', filters.maxPrice))
  }

  if (filters.minSize !== undefined) {
    constraints.push(where('sizeSqYds', '>=', filters.minSize))
  }
  if (filters.maxSize !== undefined) {
    constraints.push(where('sizeSqYds', '<=', filters.maxSize))
  }

  if (filters.features && filters.features.length === 1) {
    constraints.push(where('features', 'array-contains', filters.features[0]))
  }

  if (filters.agentId) {
    constraints.push(where('agentId', '==', filters.agentId))
  }

  return constraints
}

// ── Sorting ───────────────────────────────────────────────────────────

function getOrderClause(sortBy?: string): QueryConstraint {
  let field = 'createdAt'
  let direction: 'asc' | 'desc' = 'desc'

  switch (sortBy) {
    case 'price-asc':
      field = 'price'
      direction = 'asc'
      break
    case 'price-desc':
      field = 'price'
      direction = 'desc'
      break
    case 'size-asc':
      field = 'sizeSqYds'
      direction = 'asc'
      break
    case 'size-desc':
      field = 'sizeSqYds'
      direction = 'desc'
      break
    case 'newest':
    default:
      field = 'createdAt'
      direction = 'desc'
      break
  }

  return orderBy(field, direction)
}

// ── Image type guard ──────────────────────────────────────────────────

/** Returns true if an image entry is a PropertyImage (has a `url` string). */
function isPropertyImage(img: unknown): img is PropertyImage {
  return (
    typeof img === 'object' &&
    img !== null &&
    'url' in img &&
    typeof (img as PropertyImage).url === 'string'
  )
}

// ── Service Implementation ────────────────────────────────────────────

export const propertyService = {
  async getAll(filters: PropertyFilters = {}): Promise<PaginatedResponse<Property>> {
    try {
      const baseConstraints = buildConstraints(filters)
      const orderClause = getOrderClause(filters.sortBy)

      // Total count (simple approach compatible with Spark plan)
      const countQuery = query(
        collection(db, PROPERTIES_COLLECTION),
        ...baseConstraints,
        orderClause
      )
      const countDocs = await getDocs(countQuery)
      const total = countDocs.size

      const mainConstraints: QueryConstraint[] = [...baseConstraints, orderClause]

      if (filters.lastDoc) {
        mainConstraints.push(startAfter(filters.lastDoc))
      }

      const limitValue = filters.limit || 20
      const finalQuery = query(
        collection(db, PROPERTIES_COLLECTION),
        ...mainConstraints,
        limit(limitValue)
      )

      const snapshot = await getDocs(finalQuery)
      const items = snapshot.docs.map(docToProperty)

      const nextCursor = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null

      return {
        items,
        total,
        page: filters.page || 1,
        limit: limitValue,
        totalPages: Math.ceil(total / limitValue),
        nextCursor: nextCursor ? { id: nextCursor.id, ref: nextCursor.ref } : null,
      }
    } catch (error) {
      console.error('[PropertyService] getAll error:', error)
      throw new Error('Failed to fetch properties. Please try again.')
    }
  },

  async getById(id: string): Promise<Property | null> {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id)
      const snapshot = await getDoc(docRef)
      return snapshot.exists() ? docToProperty(snapshot) : null
    } catch (error) {
      console.error(`[PropertyService] getById(${id}) error:`, error)
      throw new Error('Failed to fetch property details.')
    }
  },

  async getBySlug(slug: string): Promise<Property | null> {
    try {
      const q = query(collection(db, PROPERTIES_COLLECTION), where('slug', '==', slug), limit(1))
      const snapshot = await getDocs(q)
      return snapshot.empty ? null : docToProperty(snapshot.docs[0]!)
    } catch (error) {
      console.error(`[PropertyService] getBySlug(${slug}) error:`, error)
      throw new Error('Failed to fetch property by slug.')
    }
  },

  async create(data: CreatePropertyInput): Promise<Property> {
    try {
      const slug = generateSlug(data.title)
      const now = Timestamp.fromDate(new Date())

      // Accept either PropertyImage objects or raw File references (FormData)
      const rawImages = data.images ?? []
      const sanitizedImages: PropertyImage[] = rawImages
        .filter(isPropertyImage)
        .map((img, index) => ({
          url: img.url,
          alt: img.alt ?? '',
          isMain: img.isMain ?? false,
          order: index, // ← required by PropertyImage
        }))

      const newProperty = {
        ...data,
        slug,
        views: 0,
        inquiries: 0,
        favorites: 0,
        isActive: true,
        isFeatured: data.isFeatured ?? false,
        createdAt: now,
        updatedAt: now,
        publishedAt: data.publishedAt ? Timestamp.fromDate(data.publishedAt) : now,
        images: sanitizedImages,
        agentPhoto: data.agentPhoto ?? null,
      }

      const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), newProperty)
      const created = await getDoc(docRef)
      return docToProperty(created)
    } catch (error) {
      console.error('[PropertyService] create error:', error)
      throw new Error('Failed to create property.')
    }
  },

  async update(id: string, data: UpdatePropertyInput): Promise<Property> {
    try {
      const docRef = doc(db, PROPERTIES_COLLECTION, id)

      const updatePayload: Record<string, unknown> = {
        ...data,
        updatedAt: Timestamp.fromDate(new Date()),
      }

      if (data.title) {
        updatePayload.slug = generateSlug(data.title)
      }

      delete (updatePayload as any).propertyId

      if (updatePayload.images) {
        const rawImages = (updatePayload.images as any[]) ?? []
        updatePayload.images = rawImages.filter(isPropertyImage).map((img, index) => ({
          url: img.url,
          alt: img.alt ?? '',
          isMain: img.isMain ?? false,
          order: index, // ← required by PropertyImage
        }))
      }

      await updateDoc(docRef, updatePayload)
      const updated = await getDoc(docRef)
      return docToProperty(updated)
    } catch (error) {
      console.error(`[PropertyService] update(${id}) error:`, error)
      throw new Error('Failed to update property.')
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, PROPERTIES_COLLECTION, id))
    } catch (error) {
      console.error(`[PropertyService] delete(${id}) error:`, error)
      throw new Error('Failed to delete property.')
    }
  },

  async incrementViews(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, PROPERTIES_COLLECTION, id), { views: increment(1) })
    } catch (error) {
      console.error(`[PropertyService] incrementViews(${id}) error:`, error)
    }
  },

  async incrementInquiries(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, PROPERTIES_COLLECTION, id), { inquiries: increment(1) })
    } catch (error) {
      console.error(`[PropertyService] incrementInquiries(${id}) error:`, error)
    }
  },

  async incrementFavorites(id: string, delta: 1 | -1): Promise<void> {
    try {
      await updateDoc(doc(db, PROPERTIES_COLLECTION, id), { favorites: increment(delta) })
    } catch (error) {
      console.error(`[PropertyService] incrementFavorites(${id}) error:`, error)
    }
  },

  async getFeatured(limitCount = 6): Promise<Property[]> {
    try {
      const q = query(
        collection(db, PROPERTIES_COLLECTION),
        where('isFeatured', '==', true),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
      const snapshot = await getDocs(q)
      return snapshot.docs.map(docToProperty)
    } catch (error) {
      console.error('[PropertyService] getFeatured error:', error)
      throw new Error('Failed to load featured properties.')
    }
  },
}

export default propertyService
