import { z } from 'zod'

/**
 * Authentication validation schemas for Zain Real Estate.
 *
 * All schemas are designed to provide clear, user‑friendly error messages
 * and ensure strong data integrity.
 */

// ── Shared patterns ───────────────────────────────────────────────────────

/** Minimum password length (aligned with Firebase Auth defaults). */
const MIN_PASSWORD_LENGTH = 6

/** Pakistani mobile number pattern (e.g., +923001234567 or 03001234567). */
const PHONE_REGEX = /^(\+92|0)\d{10}$/

// ── Login Schema ──────────────────────────────────────────────────────────

/**
 * Validates login credentials.
 *
 * - Email: must be a valid email address.
 * - Password: required, minimum length enforced.
 */
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`),
})

// ── Register Schema ───────────────────────────────────────────────────────

/**
 * Validates registration data.
 *
 * - name: 2‑100 characters.
 * - email: valid email.
 * - password: min 6 chars, strong recommendation.
 * - phone (optional): Pakistani mobile format.
 * - confirmPassword: must match password.
 * - acceptTerms: must be true (optional for MVP, can be enforced server‑side).
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .trim(),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
        'Password must contain at least one letter and one number'
      )
      .optional(),
    phone: z
      .string()
      .regex(PHONE_REGEX, 'Please enter a valid Pakistani phone number (e.g., +923001234567)')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

// ── Forgot Password Schema ────────────────────────────────────────────────

/**
 * Validates the email used for password reset.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

// ── Profile Update Schema ─────────────────────────────────────────────────

/**
 * Used on the profile page (optional extension).
 */
export const profileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phoneNumber: z
    .string()
    .regex(PHONE_REGEX, 'Please enter a valid Pakistani phone number')
    .optional()
    .or(z.literal('')),
})

// ── Export a combined object for convenience ──────────────────────────────
const authSchemas = {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  profileSchema,
}

export default authSchemas
