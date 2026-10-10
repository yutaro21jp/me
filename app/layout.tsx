import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import { allAuthors } from 'contentlayer/generated'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import GlobalZapProxy from '@/components/GlobalZapProxy'

const ogLocale = siteMetadata.locale?.replace('-', '_') || 'ja_JP'
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

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  manifest: '/static/favicons/site.webmanifest',
  icons: {
    icon: [
      { url: '/static/favicons/favicon.ico', sizes: 'any' },
      { url: '/static/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/static/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/static/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: '/',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: ogLocale,
    type: 'website',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''
  const author = allAuthors.find((p) => p.slug === 'default')
  const npub = author?.zap

  return (
    <html lang={siteMetadata.language} className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mb-auto">{children}</main>
            </SearchProvider>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
        <GlobalZapProxy npub={npub} />
      </body>
    </html>
  )
}
