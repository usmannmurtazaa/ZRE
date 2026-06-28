/**
 * Central application constants for Zain Real Estate.
 *
 * This file contains site-wide configuration, enumerations, and default values.
 * All data is carefully crafted to reflect the brand's identity and ensure consistency
 * across the entire platform.
 *
 * @module constants
 */

// ── Site Configuration ───────────────────────────────────────────────────

/** Core site metadata used across the application. */
export const SITE_CONFIG = {
  name: 'Zain Real Estate',
  tagline: 'Trusted Real Estate Solutions Since 2000',
  phone: '+92-339-0052004',
  email: 'zainrealestateagency@gmail.com',
  address: 'Karachi, Pakistan',
  whatsappNumber: '+923390052004',
  socialLinks: {
    facebook: 'https://facebook.com/zainrealestate',
    instagram: 'https://instagram.com/zainrealestate',
    youtube: '',
    linkedin: '',
  },
  /** Default canonical URL used for SEO */
  url: 'https://zainrealestate.netlify.app',
  /** Default Open Graph image */
  ogImage: '/images/og-image.jpg',
} as const

/** Type representing the exact shape of SITE_CONFIG. */
export type SiteConfig = typeof SITE_CONFIG

// ── Business Information ─────────────────────────────────────────────────

/** Standard operating hours displayed on contact pages etc. */
export const BUSINESS_HOURS = {
  weekdays: 'Monday – Saturday: 9 AM – 7 PM',
  sunday: 'Sunday: By Appointment',
} as const

// ── Property Enumerations ────────────────────────────────────────────────

/** Valid property types with display labels. */
export const PROPERTY_TYPES = [
  { label: 'Residential', value: 'residential' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Industrial', value: 'industrial' },
] as const

/** Valid property statuses. */
export const PROPERTY_STATUSES = [
  { label: 'For Sale', value: 'for_sale' },
  { label: 'For Rent', value: 'for_rent' },
  { label: 'Sold', value: 'sold' },
  { label: 'Rented', value: 'rented' },
] as const

/** Valid property sub-types. */
export const PROPERTY_SUBTYPES = [
  { label: 'Plot', value: 'plot' },
  { label: 'House', value: 'house' },
  { label: 'Apartment', value: 'apartment' },
  { label: 'Shop', value: 'shop' },
  { label: 'Office', value: 'office' },
  { label: 'Factory', value: 'factory' },
  { label: 'Warehouse', value: 'warehouse' },
] as const

// ── Area & Location ─────────────────────────────────────────────────────

/** List of Karachi areas served by Zain Real Estate (for filters etc.) */
export const AREAS = [
  'Mehran Town',
  'Korangi 7A',
  'Hawksbay Scheme 42',
  'MDA Scheme 1',
  'PNT Society',
  'Lucknow Society',
  'Darul Ul Islam Society',
] as const

// ── Property Features ───────────────────────────────────────────────────

/** Available property features for filtering and display. */
export const FEATURES = [
  'corner',
  'park-facing',
  'road-facing',
  'near-school',
  'near-hospital',
  'developed-infrastructure',
  'utilities-connected',
] as const

// ── Sort Options ────────────────────────────────────────────────────────

/** Valid sort options for the property listing page. */
export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Size: Small → Large', value: 'size-asc' },
  { label: 'Size: Large → Small', value: 'size-desc' },
] as const

// ── SEO Defaults ────────────────────────────────────────────────────────

/** Fallback values for SEO meta tags when none are provided by a page. */
export const SEO_DEFAULTS = {
  title: 'Zain Real Estate — Premium Properties in Karachi',
  description:
    'Zain Real Estate offers 100% legally approved residential, commercial, and industrial properties in Karachi. Trusted since 2000.',
  keywords: [
    'Karachi real estate',
    'property in Karachi',
    'buy plot Karachi',
    'real estate agent Karachi',
    'Zain Real Estate',
  ],
  ogImage: '/images/og-image.jpg',
  canonical: 'https://zainrealestate.netlify.app',
} as const

// ── Lead / Contact ──────────────────────────────────────────────────────

/** Possible lead statuses used throughout the CRM. */
export const LEAD_STATUSES = {
  new: 'new',
  contacted: 'contacted',
  qualified: 'qualified',
  converted: 'converted',
  lost: 'lost',
} as const

// ── Default Exports (backward compatibility) ───────────────────────────

/** Default export object containing all primary constants. */
const constants = {
  SITE_CONFIG,
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_SUBTYPES,
  AREAS,
  FEATURES,
  SORT_OPTIONS,
  SEO_DEFAULTS,
  BUSINESS_HOURS,
  LEAD_STATUSES,
} as const

export default constants
