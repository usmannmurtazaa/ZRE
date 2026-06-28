/**
 * Services barrel export – single entry point for all Firebase service modules.
 *
 * Import any service directly from `@/services`.
 *
 * @example
 * import { propertyService, leadService, userService } from '@/services'
 */

// ── Re‑export every named export from each service ─────────────────────
export * from './propertyService'
export * from './leadService'
export * from './userService'
export * from './areaService'
export * from './storageService'
export * from './analyticsService'

// ── Also export the default objects for consumers who prefer them ─────
export { default as propertyService } from './propertyService'
export { default as leadService } from './leadService'
export { default as userService } from './userService'
export { default as areaService } from './areaService'
export { default as storageService } from './storageService'
export { default as analyticsService } from './analyticsService'
