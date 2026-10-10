import { allTranslations } from 'contentlayer/generated'
import { allCoreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import NewsletterArchive from '@/components/NewsletterArchive'
import type { NewsletterListItem } from '@/components/NewsletterPosts'
import { getLatestButtondownPosts } from '@/lib/buttondown'
import { getNewsletterTotalPages, getPaginatedButtondownPosts } from '@/lib/buttondown'

export const metadata = genPageMetadata({ title: 'Newsletter', path: '/newsletter' })

const BOOK_ITEM: NewsletterListItem = {
  eyebrow: 'Book',
  title: 'Take Back Your Freedom from Dr. Fiat! The Silent Struggle of “Bitcoin” Resistance',
  summary:
    'Dr. Fiat has monopolized the global economy, creating a future society where people are bound by credit scores. Yūki and his allies unravel the history of money and rise up, using Bitcoin to take back their freedom.',
  url: 'https://blogstr.net/read/?naddr=naddr1qvzqqqr4gupzqa052atf6up8lqvaayhghvfhjhq0a05h2rwrlvd4cs4wk5pdppqaqq8ryvpjxccrsv3cxycnxvesxsnfcs46',
  image: '/images/blog/portfolio/20250131/bitcoin-resistance-1st.webp',
}

export default async function NewsletterPage() {
  const newsletterPosts = await getLatestButtondownPosts()
  const totalPages = getNewsletterTotalPages(newsletterPosts.length)
  const paginatedPosts = getPaginatedButtondownPosts(newsletterPosts, 1)
  const translation = allTranslations.find((item) => item.slug === 'default')
  const featuredItems: NewsletterListItem[] = []

  if (translation) {
    const translationContent = allCoreContent([translation])[0]
    featuredItems.push({
      eyebrow: 'Project',
      title: translationContent.title,
      summary: translationContent.summary,
      url: '/translations',
      image: translationContent.images?.[0],
    })
  }

  featuredItems.push(BOOK_ITEM)

  const pagePosts = [...featuredItems, ...paginatedPosts]

  return <NewsletterArchive posts={pagePosts} currentPage={1} totalPages={totalPages} />
}
