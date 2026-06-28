/**
 * Validators barrel export – central re‑export for all validation schemas.
 *
 * Import any schema directly from `@/lib/validators`.
 *
 * @example
 * import { loginSchema, propertySchema, createLeadSchema } from '@/lib/validators'
 */

// ── Auth schemas ──────────────────────────────────────────────────────────
export { loginSchema, registerSchema, forgotPasswordSchema, profileSchema } from './authSchemas'

// ── Property schemas ─────────────────────────────────────────────────────
export { propertySchema, propertyFiltersSchema } from './propertySchema'

// ── Lead schemas ─────────────────────────────────────────────────────────
export { createLeadSchema, leadNoteSchema, leadUpdateSchema } from './leadSchema'

// ── Re‑export default objects for backward compatibility ──────────────────
import authSchemas from './authSchemas'
import propertySchemas from './propertySchema'
import leadSchemas from './leadSchema'

export { authSchemas, propertySchemas, leadSchemas }

// ── Combined default export ──────────────────────────────────────────────
const validators = {
  ...authSchemas,
  ...propertySchemas,
  ...leadSchemas,
}

export default validators
