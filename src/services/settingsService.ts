/**
 * Settings Service
 *
 * Manages site‑wide configuration stored in a Firestore `settings` collection.
 * Each document represents a key/value pair with metadata.
 *
 * All methods are typed and include basic error handling so the UI can
 * react gracefully.
 *
 * @module settingsService
 */

import { collection, doc, getDoc, getDocs, setDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Setting } from '@/types/settings'

// ── Constants ──────────────────────────────────────────────────────────

const SETTINGS_COLLECTION = 'settings'

// ── Service Implementation ────────────────────────────────────────────

export const settingsService = {
  /**
   * Fetch all settings documents.
   * Returns an array of `Setting` objects, sorted by key for predictability.
   */
  async getAll(): Promise<Setting[]> {
    try {
      const snapshot = await getDocs(collection(db, SETTINGS_COLLECTION))
      const settings = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          settingId: docSnap.id,
          key: data.key ?? docSnap.id,
          value: data.value ?? '',
          type: data.type ?? typeof data.value,
          description: data.description ?? '',
          updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
          updatedBy: data.updatedBy ?? 'system',
        } as Setting
      })
      // Sort alphabetically by key for consistent display
      settings.sort((a, b) => a.key.localeCompare(b.key))
      return settings
    } catch (error) {
      console.error('[SettingsService] getAll error:', error)
      throw new Error('Failed to load settings.')
    }
  },

  /**
   * Fetch a single setting by its key (document ID).
   */
  async getByKey(key: string): Promise<Setting | null> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, key)
      const snapshot = await getDoc(docRef)
      if (!snapshot.exists()) return null
      const data = snapshot.data()
      return {
        settingId: snapshot.id,
        key: data.key ?? snapshot.id,
        value: data.value ?? '',
        type: data.type ?? typeof data.value,
        description: data.description ?? '',
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(),
        updatedBy: data.updatedBy ?? 'system',
      } as Setting
    } catch (error) {
      console.error(`[SettingsService] getByKey(${key}) error:`, error)
      throw new Error('Failed to load setting.')
    }
  },

  /**
   * Update or create multiple settings at once (batch).
   *
   * @param settings - Array of partial Setting objects. Each must have a `key`.
   *                   If `value` is undefined, the setting is skipped.
   */
  async updateMany(settings: Partial<Setting>[]): Promise<void> {
    try {
      const promises = settings.map(async (setting) => {
        if (!setting.key || setting.value === undefined) return

        const docRef = doc(db, SETTINGS_COLLECTION, setting.key)
        const payload = {
          key: setting.key,
          value: setting.value,
          type: setting.type ?? typeof setting.value,
          description: setting.description ?? '',
          updatedAt: Timestamp.fromDate(new Date()),
          updatedBy: setting.updatedBy || 'admin',
        }

        // Use merge: true to create the doc if it doesn't exist
        await setDoc(docRef, payload, { merge: true })
      })

      await Promise.all(promises)
    } catch (error) {
      console.error('[SettingsService] updateMany error:', error)
      throw new Error('Failed to save settings.')
    }
  },

  /**
   * Update a single setting by key.
   *
   * @param key - The document ID (setting key).
   * @param value - The new value.
   * @param type - Optional type override.
   * @param updatedBy - Identifier of who made the change.
   */
  async updateSingle(
    key: string,
    value: unknown,
    type?: string,
    updatedBy?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, SETTINGS_COLLECTION, key)
      await setDoc(
        docRef,
        {
          key,
          value,
          type: type ?? typeof value,
          updatedAt: Timestamp.fromDate(new Date()),
          updatedBy: updatedBy || 'admin',
        },
        { merge: true }
      )
    } catch (error) {
      console.error(`[SettingsService] updateSingle(${key}) error:`, error)
      throw new Error('Failed to save setting.')
    }
  },
}

export default settingsService
