/**
 * Color Tokens – Metallic Chic (Light) / Gorgeous Contrast (Dark)
 *
 * Central source of truth for all colours used in Zain Real Estate.
 * These tokens feed into both Tailwind and inline styles, ensuring
 * visual consistency across the entire platform.
 *
 * @module tokens/colors
 */

// ── Brand Palette (Metallic Blue) ──────────────────────────────────
export const brand = {
  '50': '#F0F2FA', // very light blue tint
  '100': '#E1E6F5', // light periwinkle
  '200': '#C3CEF0', // soft blue
  '300': '#ADBBDA', // light blue (accent)
  '400': '#8697C4', // muted blue
  '500': '#3D52A0', // primary blue (metallic chic)
  '600': '#33478A',
  '700': '#2A3B74',
  '800': '#202F5E',
  '900': '#162348',
  '950': '#0C1732',
} as const

// ── Metallic Accent Palette (replaces gold in light mode) ──────────
export const accent = {
  '50': '#F0F4FD',
  '100': '#E1E9FB',
  '200': '#C3D3F7',
  '300': '#A5BDF3',
  '400': '#87A7EF',
  '500': '#7091E6', // signature metallic accent (secondary blue)
  '600': '#5E7DD4',
  '700': '#4C69C0',
  '800': '#3A55AC',
  '900': '#284198',
  '950': '#162D84',
} as const

// ── Gold / Warm Accent (kept for compatibility, maps to green in dark) ─
export const gold = {
  '50': '#F2F7ED',
  '100': '#E1EFD2',
  '200': '#C4E0A8',
  '300': '#A6D07E',
  '400': '#89C054',
  '500': '#86C232', // accent green (used in dark mode)
  '600': '#72A82A',
  '700': '#5E8E22',
  '800': '#4A741A',
  '900': '#365A12',
  '950': '#22400A',
} as const

// ── Lavender / Soft Accent Palette ─────────────────────────────────
export const lavender = {
  '50': '#F8F6FD',
  '100': '#EDE8F5', // very light background
  '200': '#DCD0EC',
  '300': '#C2B0E0',
  '400': '#A890D4',
  '500': '#8697C4', // muted blue (soft metallic)
  '600': '#7280B0',
  '700': '#5E699C',
  '800': '#4A5288',
  '900': '#363B74',
  '950': '#222460',
} as const

// ── Fresh Green Palette (used for success states) ─────────────────
export const green = {
  '50': '#F0F9F1',
  '100': '#D9F0DC',
  '200': '#B3E0B8',
  '300': '#8CD195',
  '400': '#66C172',
  '500': '#61892F', // primary green (dark mode primary)
  '600': '#527528',
  '700': '#436121',
  '800': '#344D1A',
  '900': '#253913',
  '950': '#16250C',
} as const

// ── Neutral Palette (adapted for metallic chic / gorgeous contrast) ─
export const neutral = {
  '50': '#F8F9FB',
  '100': '#EFF1F5',
  '200': '#E1E4EB',
  '300': '#CDD2DC',
  '400': '#A0A7B8',
  '500': '#6B6E70', // neutral gray
  '600': '#55585A',
  '700': '#3F4244',
  '800': '#474B4F', // dark surface
  '900': '#222629', // dark background
  '950': '#16181A',
} as const

// ── Semantic Colours ───────────────────────────────────────────────
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

// ── Semantic Colour Map (CSS Variable aliases) ─────────────────────
export const semantic = {
  background: '#FFFFFF',
  foreground: neutral['900'],
  card: '#FFFFFF',
  'card-foreground': neutral['900'],
  popover: '#FFFFFF',
  'popover-foreground': neutral['900'],
  primary: brand['500'], // #3D52A0 (metallic blue)
  'primary-foreground': '#FFFFFF',
  secondary: lavender['100'], // #EDE8F5 (very light background)
  'secondary-foreground': brand['500'],
  muted: lavender['50'],
  'muted-foreground': neutral['600'],
  accent: accent['500'], // #7091E6 (metallic accent)
  'accent-foreground': brand['500'],
  destructive: error.DEFAULT,
  'destructive-foreground': '#FFFFFF',
  border: neutral['200'],
  input: neutral['200'],
  ring: accent['500'], // metallic accent focus ring
  surface: lavender['50'],
  'surface-foreground': neutral['900'],
  success: success.DEFAULT,
  warning: warning.DEFAULT,
  error: error.DEFAULT,
  info: info.DEFAULT,
  // additional tokens
  gold: accent['500'],
  lavender: lavender['500'],
  green: green['500'],
} as const

// ── Type Exports ───────────────────────────────────────────────────
export type BrandShade = keyof typeof brand
export type AccentShade = keyof typeof accent
export type GoldShade = keyof typeof gold
export type LavenderShade = keyof typeof lavender
export type GreenShade = keyof typeof green
export type NeutralShade = keyof typeof neutral
export type SemanticColor = keyof typeof semantic

// ── Backward Compatibility ─────────────────────────────────────────
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
