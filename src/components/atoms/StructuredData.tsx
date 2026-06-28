import { Helmet } from 'react-helmet-async'

interface StructuredDataProps {
  /** The full JSON-LD schema object (must include `@context` and `@type`). */
  schema: Record<string, unknown>
}

/**
 * StructuredData – renders a JSON-LD script tag in the document head
 * via react-helmet-async. Always use inside a HelmetProvider.
 *
 * Example:
 * ```tsx
 * <StructuredData
 *   schema={{
 *     "@context": "https://schema.org",
 *     "@type": "RealEstateAgent",
 *     "name": "Zain Real Estate"
 *   }}
 * />
 * ```
 */
export const StructuredData = ({ schema }: StructuredDataProps) => (
  <Helmet>
    <script type="application/ld+json">{JSON.stringify(schema)}</script>
  </Helmet>
)

export default StructuredData
