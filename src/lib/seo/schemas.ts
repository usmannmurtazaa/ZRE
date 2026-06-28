/**
 * Structured Data (JSON‑LD) generators for Zain Real Estate.
 *
 * These helpers create schema.org‑compliant objects that can be injected
 * into the `<head>` via the `<StructuredData>` component. All URLs use the
 * configured `VITE_APP_URL` with a fallback to the official domain.
 *
 * @module schemas
 */

import type { Property, Area } from '@/types'
import { SITE_CONFIG } from '@/lib/constants'

/** Canonical base URL for the site (with trailing slash removed). */
const BASE_URL = (
  (import.meta as unknown as ImportMeta).env.VITE_APP_URL || 'https://zainrealestate.netlify.app'
).replace(/\/$/, '')

// ── Organization ────────────────────────────────────────────────────────

/**
 * Generates an `RealEstateAgent` (Organization) schema for the whole site.
 */
export const generateOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: SITE_CONFIG.name,
  url: BASE_URL,
  logo: `${BASE_URL}/images/logo.png`,
  telephone: SITE_CONFIG.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONFIG.address,
    addressLocality: 'Karachi',
    addressRegion: 'Sindh',
    addressCountry: 'PK',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 24.8607,
    longitude: 67.0011,
  },
  openingHours: 'Mo-Sa 09:00-19:00',
  foundingDate: '2000',
  priceRange: '$$',
  areaServed: [
    'Mehran Town',
    'Korangi',
    'Hawksbay Scheme 42',
    'MDA Scheme 1',
    'PNT Society',
    'Lucknow Society',
  ],
})

// ── Property (Product) ──────────────────────────────────────────────────

/**
 * Generates a `Product` schema for a single property listing.
 *
 * @param property - The property object (must include at least `title`, `price`, `slug`, `images`).
 */
export const generatePropertySchema = (property: Property) => {
  const mainImage =
    property.images?.find((img) => img.isMain)?.url ??
    property.images?.[0]?.url ??
    `${BASE_URL}/images/default-property.jpg`

  const additionalProperties = [
    { '@type': 'PropertyValue', name: 'Size', value: `${property.sizeSqYds} sq yd` },
    { '@type': 'PropertyValue', name: 'Type', value: property.type },
    { '@type': 'PropertyValue', name: 'Subtype', value: property.subtype },
  ]
  if (property.bedrooms !== undefined && property.bedrooms !== null) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'Bedrooms',
      value: String(property.bedrooms),
    })
  }
  if (property.bathrooms !== undefined && property.bathrooms !== null) {
    additionalProperties.push({
      '@type': 'PropertyValue',
      name: 'Bathrooms',
      value: String(property.bathrooms),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: property.title,
    description: property.description?.slice(0, 5000), // long descriptions safe
    image: mainImage,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'PKR',
      availability:
        property.status === 'for_sale'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${BASE_URL}/properties/${property.slug}`,
      seller: {
        '@type': 'RealEstateAgent',
        name: property.agentName || SITE_CONFIG.name,
      },
    },
    additionalProperty: additionalProperties,
  }
}

// ── Area (Place) ────────────────────────────────────────────────────────

/**
 * Generates a `Place` schema for an area page.
 *
 * @param area - The area object.
 */
export const generateAreaSchema = (area: Area) => ({
  '@context': 'https://schema.org',
  '@type': 'Place',
  name: area.name,
  description: area.description || `${area.name} — a prime location in Karachi.`,
  geo: area.mapCoordinates
    ? {
        '@type': 'GeoCoordinates',
        latitude: area.mapCoordinates.latitude,
        longitude: area.mapCoordinates.longitude,
      }
    : undefined,
})

// ── BreadcrumbList ─────────────────────────────────────────────────────

/**
 * Generates a `BreadcrumbList` schema from an array of breadcrumb items.
 *
 * @param items - Array of `{ name, item }` representing the trail.
 */
export const generateBreadcrumbSchema = (items: { name: string; item: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: `${BASE_URL}${item.item}`,
  })),
})

// ── FAQPage ─────────────────────────────────────────────────────────────

/**
 * Generates an `FAQPage` schema for any page that contains FAQs.
 *
 * @param faqs - Array of question/answer pairs.
 */
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
})

// ── Backward compatibility default export ──────────────────────────────

const schemaGenerators = {
  generateOrganizationSchema,
  generatePropertySchema,
  generateAreaSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
}

export default schemaGenerators
