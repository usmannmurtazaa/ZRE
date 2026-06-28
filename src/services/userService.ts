/**
 * User Service
 *
 * Provides CRUD operations for user documents in Firestore.
 * All methods return typed `User` objects and convert Firestore
 * Timestamps to native JavaScript Dates for easier consumption.
 *
 * @module userService
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { User, UserRole } from '@/types'

// ── Constants ────────────────────────────────────────────────────────
const USERS_COLLECTION = 'users'

// ── Helpers ──────────────────────────────────────────────────────────

/**
 * Converts a Firestore document snapshot into a `User` object.
 * Handles missing fields gracefully and converts Timestamps.
 */
function docToUser(snapshot: DocumentSnapshot<DocumentData>): User {
  const data = snapshot.data() ?? {}
  return {
    uid: snapshot.id,
    email: data.email ?? '',
    displayName: data.displayName ?? '',
    phoneNumber: data.phoneNumber ?? null,
    photoURL: data.photoURL ?? null,
    emailVerified: data.emailVerified ?? false, // <-- added missing field
    role: (data.role as UserRole) ?? 'buyer',
    isActive: data.isActive ?? true,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
    updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
    lastLoginAt: data.lastLoginAt?.toDate?.() ?? null,
    preferences: data.preferences ?? {},
  }
}

// ── Service Implementation ──────────────────────────────────────────

export const userService = {
  /**
   * Fetch a single user by Firebase Auth UID.
   * Returns `null` if the document does not exist.
   */
  async getUser(uid: string): Promise<User | null> {
    const docRef = doc(db, USERS_COLLECTION, uid)
    const snapshot = await getDoc(docRef)
    return snapshot.exists() ? docToUser(snapshot) : null
  },

  /**
   * Create a new user document in Firestore.
   * Should be called immediately after Firebase Auth account creation.
   */
  async createUser(uid: string, data: Partial<User>): Promise<User> {
    const now = Timestamp.fromDate(new Date())
    const userData = {
      ...data,
      uid,
      isActive: data.isActive ?? true,
      role: data.role ?? 'buyer',
      createdAt: now,
      updatedAt: now,
    }

    await setDoc(doc(db, USERS_COLLECTION, uid), userData)

    const created = await this.getUser(uid)
    if (!created) {
      throw new Error(`Failed to create user document for UID: ${uid}`)
    }
    return created
  },

  /**
   * Update an existing user document.
   * Supports partial updates – only the provided fields will be modified.
   */
  async updateUser(uid: string, data: Partial<User>): Promise<User> {
    const docRef = doc(db, USERS_COLLECTION, uid)

    // Remove undefined values to avoid overwriting existing data
    const sanitized: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        sanitized[key] = value
      }
    }

    await updateDoc(docRef, {
      ...sanitized,
      updatedAt: Timestamp.fromDate(new Date()),
    })

    const updated = await this.getUser(uid)
    if (!updated) {
      throw new Error(`User not found after update: ${uid}`)
    }
    return updated
  },

  /**
   * Updates only the `lastLoginAt` timestamp.
   * Optimised to avoid a full document read.
   */
  async updateLastLogin(uid: string): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      lastLoginAt: Timestamp.fromDate(new Date()),
    })
  },

  /**
   * Soft-delete a user by setting `isActive` to false.
   * Prefer this over `deleteUser` to preserve audit trails.
   */
  async deactivateUser(uid: string): Promise<void> {
    await updateDoc(doc(db, USERS_COLLECTION, uid), {
      isActive: false,
      updatedAt: Timestamp.fromDate(new Date()),
    })
  },

  /**
   * Permanently delete a user document.
   * Use with caution – this cannot be undone.
   */
  async deleteUser(uid: string): Promise<void> {
    await deleteDoc(doc(db, USERS_COLLECTION, uid))
  },

  /**
   * Get all users with a specific role.
   *
   * @param role - The role to filter by (e.g., 'agent', 'admin').
   */
  async getUsersByRole(role: UserRole): Promise<User[]> {
    const q = query(collection(db, USERS_COLLECTION), where('role', '==', role))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(docToUser)
  },

  /**
   * Fetch all users in the system (admin only).
   * For large datasets, consider adding pagination in the future.
   */
  async getAllUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, USERS_COLLECTION))
    return snapshot.docs.map(docToUser)
  },
}

export default userService
