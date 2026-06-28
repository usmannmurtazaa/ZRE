/**
 * Authentication & User Type Definitions
 *
 * Central type definitions for authentication, user profiles, agent extensions,
 * and role‑based access control used throughout the Zain Real Estate platform.
 *
 * All types are designed to be serialisable (JSON‑safe) except for Date objects
 * which are normalised from Firestore Timestamps at the service layer.
 *
 * @module types/auth
 */

// ── Role & Permission Types ──────────────────────────────────────────────

/**
 * Allowed user roles for the platform.
 *
 * - `buyer`: Default role for new registrations; can view and save properties.
 * - `agent`: Can manage assigned properties and leads.
 * - `admin`: Full platform administration.
 * - `seller`: (Reserved for future seller dashboard).
 */
export type UserRole = 'buyer' | 'agent' | 'admin' | 'seller'

/**
 * Permission flags derived from role.
 * Used for fine‑grained UI controls without hardcoding role strings everywhere.
 */
export interface UserPermissions {
  canCreateProperty: boolean
  canEditAllProperties: boolean
  canDeleteProperty: boolean
  canManageUsers: boolean
  canViewAllLeads: boolean
  canAccessAdmin: boolean
  canAccessAgent: boolean
}

// ── Core User Types ──────────────────────────────────────────────────────

/**
 * Represents a user document in Firestore.
 * All dates are native JS `Date` objects (converted from Firestore Timestamps).
 */
export interface User {
  /** Firebase Auth UID (document ID). */
  uid: string
  /** Email address (can be null for some providers). */
  email: string | null
  /** Display name set by user. */
  displayName: string | null
  /** Avatar / photo URL. */
  photoURL: string | null
  /** Whether the email has been verified. */
  emailVerified: boolean
  /** Optional phone number. */
  phoneNumber?: string | null
  /** Role determining access level. */
  role: UserRole
  /** Whether the account is active (soft‑delete). */
  isActive: boolean
  /** Account creation date. */
  createdAt: Date
  /** Last profile update date. */
  updatedAt: Date
  /** Last login timestamp. */
  lastLoginAt?: Date | null
  /** User‑specific preferences (saved searches, notifications, theme). */
  preferences?: UserPreferences
}

/**
 * User‑specific preferences stored alongside the user document.
 */
export interface UserPreferences {
  /** Default property filters applied on the listing page. */
  defaultFilters?: {
    type?: string[]
    area?: string[]
    minPrice?: number
    maxPrice?: number
  }
  /** Notification preferences. */
  notifications?: {
    email: boolean
    sms: boolean
  }
  /** Preferred UI theme (overrides global default). */
  theme?: 'light' | 'dark'
}

// ── Agent Extension ──────────────────────────────────────────────────────

/**
 * Extends the base User type with agent‑specific fields.
 * An Agent is a User with additional profile data and counters.
 */
export interface Agent extends User {
  /** Short biography or tagline. */
  bio?: string
  /** Total years of experience in real estate. */
  experienceYears?: number
  /** Areas of specialisation. */
  specializations?: ('residential' | 'commercial' | 'industrial')[]
  /** Secondary contact number. */
  phoneSecondary?: string
  /** Whether the agent is featured on the homepage / search. */
  isFeatured?: boolean
  /** Social media links. */
  socialLinks?: {
    facebook?: string
    linkedin?: string
    instagram?: string
  }
  /** Number of properties currently assigned to the agent. */
  propertyCount: number
  /** Total leads ever assigned to the agent. */
  leadsCount: number
}

// ── Auth Slice Types (Redux) ─────────────────────────────────────────────

/**
 * Minimal, serialisable user object stored in the Redux auth slice.
 * Contains only the essential fields needed for immediate role checks and UI.
 * Extended profile data is fetched via TanStack Query.
 */
export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  role?: UserRole
  phoneNumber?: string | null
}

// ── Authentication Form Types ────────────────────────────────────────────

/**
 * Credentials used for email/password login.
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Data required for a new user registration.
 */
export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

/**
 * Response returned after a successful authentication action.
 * Contains the Firebase user and (optionally) a redirect URL.
 */
export interface AuthResponse {
  user: User
  redirectTo?: string
}

// ── Helper Types ─────────────────────────────────────────────────────────

/**
 * Converts a raw Firebase `User` (from the Auth SDK) into our `AuthUser` shape.
 * Used by the AuthProvider to populate Redux.
 */
export type FirebaseUserToAuthUser = (
  firebaseUser: import('firebase/auth').User,
  role?: UserRole,
  phoneNumber?: string | null
) => AuthUser

/**
 * Maps a `UserRole` to a set of permissions.
 * Used for access control in guards and UI.
 */
export const rolePermissions: Record<UserRole, UserPermissions> = {
  buyer: {
    canCreateProperty: false,
    canEditAllProperties: false,
    canDeleteProperty: false,
    canManageUsers: false,
    canViewAllLeads: false,
    canAccessAdmin: false,
    canAccessAgent: false,
  },
  agent: {
    canCreateProperty: true,
    canEditAllProperties: false,
    canDeleteProperty: false,
    canManageUsers: false,
    canViewAllLeads: false,
    canAccessAdmin: false,
    canAccessAgent: true,
  },
  admin: {
    canCreateProperty: true,
    canEditAllProperties: true,
    canDeleteProperty: true,
    canManageUsers: true,
    canViewAllLeads: true,
    canAccessAdmin: true,
    canAccessAgent: true,
  },
  seller: {
    canCreateProperty: false,
    canEditAllProperties: false,
    canDeleteProperty: false,
    canManageUsers: false,
    canViewAllLeads: false,
    canAccessAdmin: false,
    canAccessAgent: false,
  },
}

/**
 * Returns the permissions for a given role.
 * Falls back to `buyer` permissions for unknown roles.
 */
export function getPermissions(role?: UserRole): UserPermissions {
  return rolePermissions[role ?? 'buyer'] ?? rolePermissions.buyer
}
