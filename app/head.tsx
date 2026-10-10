import siteMetadata from '@/data/siteMetadata'
import { serializeJsonLd } from '@/lib/jsonLd'

const basePath = process.env.BASE_PATH || ''

const sameAs = [
  siteMetadata.twitter,
  siteMetadata.x,
  siteMetadata.facebook,
  siteMetadata.youtube,
  siteMetadata.linkedin,
  siteMetadata.instagram,
  siteMetadata.bluesky,
  siteMetadata.nostr,
  siteMetadata.mastodon,
  siteMetadata.medium,
  siteMetadata.github,
].filter(Boolean)

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteMetadata.title,
  url: siteMetadata.siteUrl,
  logo: new URL(siteMetadata.siteLogo, siteMetadata.siteUrl).toString(),
  sameAs,
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteMetadata.title,
  url: siteMetadata.siteUrl,
  inLanguage: siteMetadata.locale || 'ja-JP',
}

export default function Head() {
  return (
    <>
      <link rel="shortcut icon" href={`${basePath}/static/favicons/favicon.ico`} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <meta name="msapplication-config" content={`${basePath}/static/favicons/browserconfig.xml`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#FFD700"
      />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
      />
    </>
  )
}
