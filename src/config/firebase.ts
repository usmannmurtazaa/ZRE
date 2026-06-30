/// <reference types="vite/client" />

import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from 'firebase/auth'
import { initializeFirestore, memoryLocalCache, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string | undefined,
}

function validateConfig(config: typeof firebaseConfig): boolean {
  const required: string[] = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'appId']
  const missing: string[] = []
  for (const key of required) {
    if (!config[key as keyof typeof config]) {
      missing.push(key)
    }
  }
  if (missing.length > 0) {
    console.error(
      `[Firebase] Missing required config fields: ${missing.join(', ')}. ` +
        'Check your .env file. The app may not function correctly.'
    )
    return false
  }
  if (!config.measurementId) {
    console.warn('[Firebase] No Measurement ID provided. Analytics will not be initialised.')
  }
  return true
}

validateConfig(firebaseConfig)

/** The main Firebase application instance. */
export const app: FirebaseApp = initializeApp(firebaseConfig)

/** Firebase Auth instance. */
export const auth: Auth = getAuth(app)

/** Pre‑configured Google provider with account selection prompt. */
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

// Enable session persistence across browser tabs (local).
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('[Firebase] Failed to set auth persistence:', error)
})

// ── Firestore with in‑memory cache (avoids IndexedDB issues) ─────────────
export const db: Firestore = initializeFirestore(app, {
  localCache: memoryLocalCache(),
})

/** Firebase Cloud Storage instance for property / agent images. */
export const storage: FirebaseStorage = getStorage(app)

/** Analytics instance (Google Analytics 4). Loaded asynchronously. */
export const analytics: Promise<Analytics | null> = (async () => {
  if (!firebaseConfig.measurementId) {
    return null
  }
  try {
    const supported = await isSupported()
    if (supported) {
      return getAnalytics(app)
    }
  } catch (error) {
    console.warn('[Firebase] Analytics initialisation failed:', error)
  }
  return null
})()

const firebase = {
  app,
  auth,
  googleProvider,
  db,
  storage,
  analytics,
}

export default firebase
