/**
 * Settings Type Definitions
 *
 * Defines the shape of site‑wide configuration documents stored in the
 * `settings` Firestore collection. Each setting is a key‑value pair with
 * type metadata and audit information.
 *
 * All dates are native JS `Date` objects (converted from Firestore Timestamps).
 *
 * @module types/settings
 */

// ── Setting Value ─────────────────────────────────────────────────────────

/**
 * Allowed value types for a setting.
 * The union is intentionally broad because settings can be simple strings,
 * numbers, booleans, JSON‑serialisable objects, or arrays.
 */
export type SettingValue = string | number | boolean | Record<string, unknown> | unknown[]

/**
 * The primitive type label for the setting value.
 * Used by the admin panel to render the correct input control.
 */
export type SettingValueType = 'string' | 'number' | 'boolean' | 'object' | 'array'

// ── Core Setting Interface ────────────────────────────────────────────────

/**
 * Represents a single site setting document in Firestore.
 * The document ID is the `key` (e.g. `siteName`, `contactEmail`).
 */
export interface Setting {
  /** Firestore document ID (also used as the unique key). */
  settingId: string

  /** Unique key for the setting (mirrors `settingId` for clarity). */
  key: string

  /** The current value of the setting. */
  value: SettingValue

  /** The type of the value (used by the admin panel to render the correct input). */
  type: SettingValueType

  /** Optional human‑readable description shown in the admin panel. */
  description?: string

  /** Optional display label (falls back to `key` if not set). */
  label?: string

  /** Optional grouping key for organising settings in the admin panel. */
  group?: string

  /** ISO date of the last update. */
  updatedAt: Date

  /** UID or name of the user who last updated the setting. */
  updatedBy: string
}

// ── Input / Update Types ──────────────────────────────────────────────────

/**
 * Data required to create or update a single setting.
 * The `key` is required; all other fields are optional for partial updates.
 */
export interface UpdateSettingInput {
  /** The unique setting key. */
  key: string
  /** New value. */
  value?: SettingValue
  /** Type override (auto‑detected if not provided). */
  type?: SettingValueType
  /** Optional description. */
  description?: string
  /** Optional label. */
  label?: string
  /** Optional group. */
  group?: string
  /** Who performed the update. */
  updatedBy?: string
}

// ── Default Settings Configuration ────────────────────────────────────────

/**
 * Pre‑defined default settings that should be seeded into Firestore
 * when the application is first deployed.
 *
 * These defaults ensure that the site works out‑of‑the‑box and can be
 * customised later via the admin panel.
 */
export const DEFAULT_SETTINGS: Setting[] = [
  {
    settingId: 'siteName',
    key: 'siteName',
    value: 'Zain Real Estate',
    type: 'string',
    label: 'Site Name',
    group: 'branding',
    description: 'The name of the real estate agency displayed in headers and SEO.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'tagline',
    key: 'tagline',
    value: 'Trusted Real Estate Solutions Since 2000',
    type: 'string',
    label: 'Tagline',
    group: 'branding',
    description: 'Short tagline used on the homepage and SEO descriptions.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'contactPhone',
    key: 'contactPhone',
    value: '+92-339-0052004',
    type: 'string',
    label: 'Phone Number',
    group: 'contact',
    description: 'Primary contact phone number displayed site‑wide.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'contactEmail',
    key: 'contactEmail',
    value: 'zainrealestateagency@gmail.com',
    type: 'string',
    label: 'Email Address',
    group: 'contact',
    description: 'Primary contact email address.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'officeAddress',
    key: 'officeAddress',
    value: 'Karachi, Pakistan',
    type: 'string',
    label: 'Office Address',
    group: 'contact',
    description: 'Full office address shown in the footer and contact page.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'whatsappNumber',
    key: 'whatsappNumber',
    value: '+923390052004',
    type: 'string',
    label: 'WhatsApp Number',
    group: 'contact',
    description: 'WhatsApp business number (without +).',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'socialLinks',
    key: 'socialLinks',
    value: {
      facebook: 'https://facebook.com/zainrealestate',
      instagram: 'https://instagram.com/zainrealestate',
      linkedin: '',
      youtube: '',
    },
    type: 'object',
    label: 'Social Media Links',
    group: 'social',
    description: 'Social media URLs used in the footer.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'maxPropertyImages',
    key: 'maxPropertyImages',
    value: 10,
    type: 'number',
    label: 'Max Property Images',
    group: 'listings',
    description: 'Maximum number of images allowed per property listing.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'featuredPropertiesLimit',
    key: 'featuredPropertiesLimit',
    value: 6,
    type: 'number',
    label: 'Featured Properties Limit',
    group: 'listings',
    description: 'Number of featured properties shown on the homepage.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
  {
    settingId: 'maintenanceMode',
    key: 'maintenanceMode',
    value: false,
    type: 'boolean',
    label: 'Maintenance Mode',
    group: 'advanced',
    description: 'When enabled, only admins can view the site.',
    updatedAt: new Date(),
    updatedBy: 'system',
  },
]

// ── Groups ────────────────────────────────────────────────────────────────

/**
 * Pre‑defined groups for organising settings in the admin panel.
 * Can be extended as new settings are added.
 */
export const SETTING_GROUPS = {
  branding: 'Branding',
  contact: 'Contact Details',
  social: 'Social Media',
  listings: 'Listings',
  advanced: 'Advanced',
} as const

export type SettingGroup = keyof typeof SETTING_GROUPS

// ── Helper Types ──────────────────────────────────────────────────────────

/**
 * Flattens the `Setting` array into a plain record keyed by setting key.
 * Useful for quick lookups in components.
 */
export type SettingsRecord = Record<string, SettingValue>
