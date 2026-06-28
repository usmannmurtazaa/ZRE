/**
 * Type Definitions – Barrel Export
 *
 * Central re‑export point for all TypeScript type definitions used across
 * the Zain Real Estate platform.
 *
 * Import types directly from `@/types`:
 * @example
 * import type { Property, Lead, User } from '@/types'
 */

// ── Domain Models ─────────────────────────────────────────────────────
export type { User, Agent, UserRole, AuthUser, UserPreferences, UserPermissions } from './auth'
export type {
  Property,
  PropertyImage,
  PropertyType,
  PropertySubtype,
  PropertyStatus,
  PropertySortOption,
  PropertyFilters,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyWithArea,
  PropertyPaginatedResponse,
} from './property'
export type {
  Lead,
  LeadNote,
  LeadSource,
  LeadStatus,
  CreateLeadInput,
  UpdateLeadInput,
  LeadUpdatePayload,
} from './lead'
export type { Area, CreateAreaInput, UpdateAreaInput } from './area'
export type { Testimonial, CreateTestimonialInput, UpdateTestimonialInput } from './testimonial'
export type { Setting, SettingValue, SettingValueType, UpdateSettingInput } from './settings'

// ── Utility & Common Types ─────────────────────────────────────────────
export type {
  PaginatedResponse,
  ApiError,
  MutationResponse,
  EmptyMutationResponse,
  UploadResult,
  SelectOption,
} from './api'

// ── Re‑export constants that are used as type maps ────────────────────
export { PropertyTypeLabels, PropertySubtypeLabels, PropertyStatusMap } from './property'
export { rolePermissions, getPermissions } from './auth'
export { leadStatusMap, getLeadStatusLabel } from './lead'
export { DEFAULT_SETTINGS, SETTING_GROUPS } from './settings'
