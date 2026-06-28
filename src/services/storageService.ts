/**
 * Storage Service
 *
 * Handles file uploads and deletions on Firebase Cloud Storage.
 * All operations are typed and include progress tracking where applicable.
 *
 * @module storageService
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type UploadTaskSnapshot,
} from 'firebase/storage'
import { storage } from '@/config/firebase'

// ── Constants ──────────────────────────────────────────────────────────

const PROPERTY_IMAGES_PATH = 'properties'
const AGENT_AVATARS_PATH = 'agents'
const AREA_COVERS_PATH = 'areas'

/** Allowed MIME types for images. */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

/** Maximum file size: 10 MB. */
const MAX_FILE_SIZE = 10 * 1024 * 1024

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Validates a file before upload.
 * Throws a descriptive error if validation fails.
 */
function validateImageFile(file: File): void {
  if (!file) {
    throw new Error('No file provided.')
  }
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF.`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds the maximum of ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)} MB.`
    )
  }
}

/**
 * Generates a unique file name to avoid collisions.
 * Appends a timestamp and random string before the extension.
 */
function generateUniqueFileName(originalName: string): string {
  const ext = originalName.substring(originalName.lastIndexOf('.'))
  const base = originalName
    .substring(0, originalName.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
  const unique = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  return `${base}_${unique}${ext}`
}

/**
 * Extracts the Cloud Storage path from a download URL.
 * This is necessary to delete a file when only the URL is known.
 */
function getPathFromUrl(url: string): string {
  try {
    const decoded = decodeURIComponent(url)
    const baseUrl = `https://firebasestorage.googleapis.com/v0/b/${storage.app.options.storageBucket}/o/`
    if (decoded.startsWith(baseUrl)) {
      return decoded.substring(baseUrl.length).split('?')[0] ?? ''
    }
    // Fallback: try to parse the path after '/o/'
    const match = decoded.match(/\/o\/(.+?)(\?|$)/)
    if (match?.[1]) {
      return match[1]
    }
  } catch {
    // If parsing fails, we'll just use the URL as path (Firebase can handle absolute URLs)
  }
  return url
}

// ── Service Implementation ────────────────────────────────────────────

export const storageService = {
  /**
   * Uploads a property image and returns its download URL.
   * Provides progress updates via the optional callback.
   *
   * @param propertyId - The property's Firestore document ID.
   * @param file - The image file to upload.
   * @param onProgress - Callback that receives progress percentage (0-100).
   * @returns The download URL of the uploaded image.
   */
  async uploadPropertyImage(
    propertyId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    validateImageFile(file)

    const uniqueName = generateUniqueFileName(file.name)
    const path = `${PROPERTY_IMAGES_PATH}/${propertyId}/${uniqueName}`
    const storageRef = ref(storage, path)

    return new Promise<string>((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          onProgress?.(progress)
        },
        (error) => {
          console.error(`[Storage] Upload error for property ${propertyId}:`, error)
          reject(new Error('Failed to upload property image.'))
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(url)
          } catch (error) {
            console.error('[Storage] getDownloadURL error:', error)
            reject(new Error('Failed to get download URL.'))
          }
        }
      )
    })
  },

  /**
   * Deletes a property image from Cloud Storage using its URL.
   *
   * @param url - The full download URL of the image to delete.
   */
  async deletePropertyImage(url: string): Promise<void> {
    try {
      const path = getPathFromUrl(url)
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
    } catch (error) {
      console.error('[Storage] deletePropertyImage error:', error)
      throw new Error('Failed to delete property image.')
    }
  },

  /**
   * Uploads an agent's avatar image and returns its download URL.
   *
   * @param agentId - The agent's Firestore UID.
   * @param file - The image file.
   */
  async uploadAgentAvatar(agentId: string, file: File): Promise<string> {
    validateImageFile(file)
    const uniqueName = generateUniqueFileName(file.name)
    const path = `${AGENT_AVATARS_PATH}/${agentId}/avatar_${uniqueName}`
    const storageRef = ref(storage, path)

    try {
      const snapshot = await uploadBytesResumable(storageRef, file)
      return await getDownloadURL(snapshot.ref)
    } catch (error) {
      console.error(`[Storage] Upload error for agent ${agentId}:`, error)
      throw new Error('Failed to upload agent avatar.')
    }
  },

  /**
   * Uploads an area cover image and returns its download URL.
   *
   * @param areaId - The area's Firestore document ID.
   * @param file - The image file.
   */
  async uploadAreaCover(areaId: string, file: File): Promise<string> {
    validateImageFile(file)
    const uniqueName = generateUniqueFileName(file.name)
    const path = `${AREA_COVERS_PATH}/${areaId}/cover_${uniqueName}`
    const storageRef = ref(storage, path)

    try {
      const snapshot = await uploadBytesResumable(storageRef, file)
      return await getDownloadURL(snapshot.ref)
    } catch (error) {
      console.error(`[Storage] Upload error for area ${areaId}:`, error)
      throw new Error('Failed to upload area cover.')
    }
  },

  /**
   * Deletes any file from Cloud Storage given its download URL.
   * This is a convenience wrapper around `deleteObject`.
   *
   * @param url - The full download URL.
   */
  async deleteFileByUrl(url: string): Promise<void> {
    try {
      const path = getPathFromUrl(url)
      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
    } catch (error) {
      console.error('[Storage] deleteFileByUrl error:', error)
      throw new Error('Failed to delete file.')
    }
  },
}

export default storageService
