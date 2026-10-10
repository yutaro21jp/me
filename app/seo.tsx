import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'

interface PageSEOProps extends Metadata {
  title: string
  description?: string
  image?: string
  path?: string
  locale?: string
}

export function genPageMetadata({
  title,
  description,
  image,
  path = '/',
  locale = siteMetadata.locale?.replace('-', '_') || 'ja_JP',
  ...rest
}: PageSEOProps): Metadata {
  const canonicalPath = path.startsWith('/') ? path : `/${path}`
  const ogImages = image ? [image] : [siteMetadata.socialBanner]
  const { openGraph, twitter, alternates, ...metadataRest } = rest

  return {
    ...metadataRest,
    title,
    description: description || siteMetadata.description,
    alternates: {
      canonical: canonicalPath,
      ...alternates,
    },
    openGraph: {
      title: `${title} | ${siteMetadata.title}`,
      description: description || siteMetadata.description,
      url: canonicalPath,
      siteName: siteMetadata.title,
      images: ogImages,
      locale,
      type: 'website',
      ...openGraph,
    },
    twitter: {
      title: `${title} | ${siteMetadata.title}`,
      card: 'summary',
      images: ogImages,
      ...twitter,
    },
  }
}
