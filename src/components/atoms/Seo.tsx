import { Helmet } from 'react-helmet-async'
import { SITE_CONFIG } from '@/lib/constants'

interface SeoProps {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'place'
  noindex?: boolean
  nofollow?: boolean
  publishedTime?: string
  modifiedTime?: string
  author?: string
  keywords?: string[]
  locale?: string
  twitterHandle?: string
}

const DEFAULT_OG_IMAGE_WIDTH = 1200
const DEFAULT_OG_IMAGE_HEIGHT = 630

export const Seo = ({
  title,
  description,
  image,
  imageAlt,
  url,
  type = 'website',
  noindex = false,
  nofollow = false,
  publishedTime,
  modifiedTime,
  author,
  keywords,
  locale = 'en_PK',
  twitterHandle,
}: SeoProps) => {
  const siteTitle = SITE_CONFIG.name
  const siteUrl = import.meta.env.VITE_APP_URL || 'https://zainrealestate.netlify.app'
  const defaultImage = `${siteUrl}/images/og-image.jpg`

  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const pageDescription = description || SITE_CONFIG.tagline
  const pageImage = image || defaultImage
  const pageUrl = url || siteUrl
  const robots = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`
  const imgAlt = imageAlt || pageTitle

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:locale" content={locale} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:alt" content={imgAlt} />
      <meta property="og:image:width" content={String(DEFAULT_OG_IMAGE_WIDTH)} />
      <meta property="og:image:height" content={String(DEFAULT_OG_IMAGE_HEIGHT)} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {twitterHandle && (
        <>
          <meta name="twitter:site" content={twitterHandle} />
          <meta name="twitter:creator" content={twitterHandle} />
        </>
      )}
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:image:alt" content={imgAlt} />

      {/* Article / Blog specific (if applicable) */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* PWA / Mobile */}
      <meta name="theme-color" content="#162660" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  )
}

export default Seo
