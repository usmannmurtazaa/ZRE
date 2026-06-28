/**
 * Typography Tokens – Navy / Gold Luxury Edition
 *
 * Refined typographic system for Zain Real Estate.
 * Clean, modern sans‑serif for body text, elegant serif for headings,
 * and a versatile scale that breathes luxury and readability.
 *
 * @module tokens/typography
 */

// ── Font Families ──────────────────────────────────────────────────
export const fontFamily = {
  /** Primary body font – modern, highly legible. */
  sans: "'DM Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  /** Display / heading font – timeless serif for a luxurious feel. */
  serif: "'Forum', Georgia, 'Times New Roman', serif",
  /** Monospace for numbers, code, and technical data. */
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
} as const

// ── Font Weights ───────────────────────────────────────────────────
export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const

// ── Modular Type Scale ─────────────────────────────────────────────
/**
 * A refined 1.125 (major third) modular scale.
 * All sizes are in `rem` for accessibility and responsiveness.
 */
export const fontSize = {
  /** 10px – tiny badges, overlines */
  '4xs': { size: '0.625rem', lineHeight: 1.4, letterSpacing: '0.04em' },
  /** 12px – labels, captions, small metadata */
  '3xs': { size: '0.75rem', lineHeight: 1.5, letterSpacing: '0.02em' },
  /** 14px – compact body, table cells */
  '2xs': { size: '0.875rem', lineHeight: 1.5, letterSpacing: '0.01em' },
  /** 16px – standard body, inputs, buttons */
  xs: { size: '1rem', lineHeight: 1.625, letterSpacing: '0' },
  /** 18px – large body, intro paragraphs */
  sm: { size: '1.125rem', lineHeight: 1.625, letterSpacing: '-0.005em' },
  /** 20px – subheadings, card titles */
  base: { size: '1.25rem', lineHeight: 1.5, letterSpacing: '-0.01em' },
  /** 24px – section subheadings, quotes */
  lg: { size: '1.5rem', lineHeight: 1.375, letterSpacing: '-0.015em' },
  /** 30px – major sections, smaller headings */
  xl: { size: '1.875rem', lineHeight: 1.25, letterSpacing: '-0.02em' },
  /** 36px – page titles */
  '2xl': { size: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.025em' },
  /** 48px – hero subheadings, large titles */
  '3xl': { size: '3rem', lineHeight: 1.15, letterSpacing: '-0.03em' },
  /** 60px – main hero headlines */
  '4xl': { size: '3.75rem', lineHeight: 1.1, letterSpacing: '-0.035em' },
  /** 72px – super display */
  '5xl': { size: '4.5rem', lineHeight: 1.05, letterSpacing: '-0.04em' },
  /** 96px – massive display (rarely used) */
  '6xl': { size: '6rem', lineHeight: 1, letterSpacing: '-0.05em' },
} as const

// ── Line Heights ───────────────────────────────────────────────────
export const lineHeight = {
  none: 1,
  tight: 1.1,
  snug: 1.25,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const

// ── Letter Spacing ─────────────────────────────────────────────────
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const

// ── Semantic Text Styles ───────────────────────────────────────────
export const textStyle = {
  /** Main hero title */
  hero: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['4xl'].size,
    lineHeight: fontSize['4xl'].lineHeight,
    letterSpacing: fontSize['4xl'].letterSpacing,
    fontWeight: fontWeight.bold,
  },
  /** Primary page heading */
  h1: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['3xl'].size,
    lineHeight: fontSize['3xl'].lineHeight,
    letterSpacing: fontSize['3xl'].letterSpacing,
    fontWeight: fontWeight.bold,
  },
  h2: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['2xl'].size,
    lineHeight: fontSize['2xl'].lineHeight,
    letterSpacing: fontSize['2xl'].letterSpacing,
    fontWeight: fontWeight.semibold,
  },
  h3: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['xl'].size,
    lineHeight: fontSize['xl'].lineHeight,
    letterSpacing: fontSize['xl'].letterSpacing,
    fontWeight: fontWeight.semibold,
  },
  h4: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['lg'].size,
    lineHeight: fontSize['lg'].lineHeight,
    letterSpacing: fontSize['lg'].letterSpacing,
    fontWeight: fontWeight.semibold,
  },
  /** Lead / intro paragraph */
  lead: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['sm'].size,
    lineHeight: fontSize['sm'].lineHeight,
    letterSpacing: fontSize['sm'].letterSpacing,
    fontWeight: fontWeight.regular,
  },
  /** Standard body */
  body: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['xs'].size,
    lineHeight: fontSize['xs'].lineHeight,
    fontWeight: fontWeight.regular,
  },
  bodySmall: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['2xs'].size,
    lineHeight: fontSize['2xs'].lineHeight,
    fontWeight: fontWeight.regular,
  },
  /** Caption / label / small UI */
  caption: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['3xs'].size,
    lineHeight: fontSize['3xs'].lineHeight,
    fontWeight: fontWeight.medium,
    letterSpacing: '0.025em',
    textTransform: 'uppercase' as const,
  },
  overline: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['4xs'].size,
    lineHeight: fontSize['4xs'].lineHeight,
    fontWeight: fontWeight.semibold,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
  },
  /** Price display */
  price: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['lg'].size,
    lineHeight: fontSize['lg'].lineHeight,
    fontWeight: fontWeight.bold,
  },
  priceLarge: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['xl'].size,
    lineHeight: fontSize['xl'].lineHeight,
    fontWeight: fontWeight.bold,
  },
  /** Card / panel title */
  cardTitle: {
    fontFamily: fontFamily.serif,
    fontSize: fontSize['base'].size,
    lineHeight: fontSize['base'].lineHeight,
    fontWeight: fontWeight.semibold,
  },
  /** Button text */
  button: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize['2xs'].size,
    lineHeight: fontSize['2xs'].lineHeight,
    fontWeight: fontWeight.semibold,
    letterSpacing: '0.02em',
  },
} as const

// ── Responsive Font Size Helper ────────────────────────────────────
export function responsiveFontSize(
  base: keyof typeof fontSize,
  md?: keyof typeof fontSize,
  lg?: keyof typeof fontSize
): Record<'base' | 'md' | 'lg', (typeof fontSize)[keyof typeof fontSize]> {
  return {
    base: fontSize[base],
    md: fontSize[md ?? base],
    lg: fontSize[lg ?? md ?? base],
  }
}

// ── Types ──────────────────────────────────────────────────────────
export type FontFamily = keyof typeof fontFamily
export type FontSize = keyof typeof fontSize
export type FontWeight = keyof typeof fontWeight
export type LineHeight = keyof typeof lineHeight
export type LetterSpacing = keyof typeof letterSpacing
export type TextStyle = keyof typeof textStyle

// ── Default Export (backward compat) ───────────────────────────────
const typography = {
  fontFamily,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
  textStyle,
  responsiveFontSize,
}

export default typography
