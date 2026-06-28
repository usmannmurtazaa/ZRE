/**
 * Color Tokens – Navy / Gold / Lavender Blue Luxury Edition
 *
 * Central source of truth for all colours used in Zain Real Estate.
 * These tokens feed into both Tailwind and inline styles, ensuring
 * visual consistency across the entire platform.
 *
 * @module tokens/colors
 */

// ── Brand Palette (Deep Navy Blue) ─────────────────────────────────────
export const brand = {
  '50': '#EDF1F9', // lavender tint – subtle backgrounds
  '100': '#D4DFF2', // light lavender
  '200': '#A8BFE6', // soft periwinkle
  '300': '#7B9AD6', // lavender blue
  '400': '#4A73C4', // medium blue
  '500': '#0B1D3A', // deep navy (primary)
  '600': '#091830', // darker navy
  '700': '#071325', // very dark navy
  '800': '#040D1A', // near‑black navy
  '900': '#020810', // almost black
  '950': '#01040A', // absolute navy black
} as const

// ── Gold Accent Palette ────────────────────────────────────────────────
export const gold = {
  '50': '#FDFBF7',
  '100': '#F9F2E2',
  '200': '#F3E4C5',
  '300': '#ECD2A1',
  '400': '#E1BC7A',
  '500': '#C6A972', // signature gold
  '600': '#B08D4F',
  '700': '#8F713A',
  '800': '#6E5629',
  '900': '#4D3B1A',
  '950': '#2E220C',
} as const

// ── Lavender Blue Accent Palette ───────────────────────────────────────
export const lavender = {
  '50': '#F5F7FC',
  '100': '#E8ECF7',
  '200': '#D1D9F0',
  '300': '#B0BDE5',
  '400': '#8A9CD8',
  '500': '#7B8EB2', // signature lavender blue
  '600': '#6478A0',
  '700': '#4E628A',
  '800': '#3A4C6E',
  '900': '#263652',
  '950': '#182138',
} as const

// ── Fresh Green Palette ────────────────────────────────────────────────
export const green = {
  '50': '#F0F9F1',
  '100': '#D9F0DC',
  '200': '#B3E0B8',
  '300': '#8CD195',
  '400': '#66C172',
  '500': '#2E7D32', // deep forest green
  '600': '#266B2A',
  '700': '#1E5922',
  '800': '#15471A',
  '900': '#0D3512',
  '950': '#05230A',
} as const

// ── Neutral Palette (adapted for navy theme) ───────────────────────────
export const neutral = {
  '50': '#F8F9FB',
  '100': '#EFF1F5',
  '200': '#E1E4EB',
  '300': '#CDD2DC',
  '400': '#A0A7B8',
  '500': '#6E758A',
  '600': '#4F5668',
  '700': '#3A4050',
  '800': '#242A38',
  '900': '#1A2332',
  '950': '#0F1620',
} as const

// ── Semantic Colours ───────────────────────────────────────────────────
export const success = {
  '50': green['50'],
  '100': green['100'],
  '200': green['200'],
  '300': green['300'],
  '400': green['400'],
  '500': green['500'],
  '600': green['600'],
  '700': green['700'],
  '800': green['800'],
  '900': green['900'],
  light: green['100'],
  DEFAULT: green['500'],
  dark: green['800'],
} as const

export const warning = {
  '50': '#FFF8EB',
  '100': '#FEEBC6',
  '200': '#FDD88C',
  '300': '#FDC552',
  '400': '#FCB218',
  '500': '#D97706',
  '600': '#B45309',
  '700': '#92400E',
  '800': '#78350F',
  '900': '#451A03',
  light: '#FEEBC6',
  DEFAULT: '#D97706',
  dark: '#78350F',
} as const

export const error = {
  '50': '#FEF2F2',
  '100': '#FEE2E2',
  '200': '#FECACA',
  '300': '#FCA5A5',
  '400': '#F87171',
  '500': '#DC2626',
  '600': '#B91C1C',
  '700': '#991B1B',
  '800': '#7F1D1D',
  '900': '#450A0A',
  light: '#FEE2E2',
  DEFAULT: '#DC2626',
  dark: '#7F1D1D',
} as const

export const info = {
  '50': '#EFF6FF',
  '100': '#DBEAFE',
  '200': '#BFDBFE',
  '300': '#93C5FD',
  '400': '#60A5FA',
  '500': '#2563EB',
  '600': '#1D4ED8',
  '700': '#1E40AF',
  '800': '#1E3A8A',
  '900': '#172554',
  light: '#DBEAFE',
  DEFAULT: '#2563EB',
  dark: '#1E3A8A',
} as const

// ── Semantic Colour Map (CSS Variable aliases) ─────────────────────────
export const semantic = {
  background: '#FFFFFF',
  foreground: neutral['900'],
  card: '#FFFFFF',
  'card-foreground': neutral['900'],
  popover: '#FFFFFF',
  'popover-foreground': neutral['900'],
  primary: brand['500'], // deep navy
  'primary-foreground': '#FFFFFF',
  secondary: lavender['50'], // light lavender tint
  'secondary-foreground': brand['500'],
  muted: neutral['100'],
  'muted-foreground': neutral['600'],
  accent: gold['500'], // gold accent
  'accent-foreground': brand['500'],
  destructive: error.DEFAULT,
  'destructive-foreground': '#FFFFFF',
  border: neutral['200'],
  input: neutral['200'],
  ring: gold['500'], // gold focus ring
  surface: neutral['50'],
  'surface-foreground': neutral['900'],
  success: success.DEFAULT,
  warning: warning.DEFAULT,
  error: error.DEFAULT,
  info: info.DEFAULT,
  // additional luxury tokens
  gold: gold['500'],
  lavender: lavender['500'],
  green: green['500'],
} as const

// ── Type Exports ───────────────────────────────────────────────────────
export type BrandShade = keyof typeof brand
export type GoldShade = keyof typeof gold
export type LavenderShade = keyof typeof lavender
export type GreenShade = keyof typeof green
export type NeutralShade = keyof typeof neutral
export type SemanticColor = keyof typeof semantic

// ── Backward Compatibility ─────────────────────────────────────────────
export const colors = {
  brand: {
    '50': brand['50'],
    '100': brand['100'],
    '200': brand['200'],
    '300': brand['300'],
    '400': brand['400'],
    '500': brand['500'],
    '600': brand['600'],
    '700': brand['700'],
    '800': brand['800'],
    '900': brand['900'],
  },
  gray: {
    '50': neutral['50'],
    '100': neutral['100'],
    '200': neutral['200'],
    '300': neutral['300'],
    '400': neutral['400'],
    '500': neutral['500'],
    '600': neutral['600'],
    '700': neutral['700'],
    '800': neutral['800'],
    '900': neutral['900'],
  },
  success: success.DEFAULT,
  warning: warning.DEFAULT,
  error: error.DEFAULT,
  info: info.DEFAULT,
} as const

export default colors
