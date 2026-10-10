import { notFound } from 'next/navigation'
import { genPageMetadata } from 'app/seo'
import NewsletterArchive from '@/components/NewsletterArchive'
import {
  getLatestButtondownPosts,
  getNewsletterTotalPages,
  getPaginatedButtondownPosts,
} from '@/lib/buttondown'

export const generateStaticParams = async () => {
  const posts = await getLatestButtondownPosts()
  const totalPages = getNewsletterTotalPages(posts.length)

  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))
}

export async function generateMetadata(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page, 10)

  if (Number.isNaN(pageNumber) || pageNumber < 1) {
    return {}
  }

  return genPageMetadata({
    title: pageNumber === 1 ? 'Newsletter' : `Newsletter - Page ${pageNumber}`,
    path: `/newsletter/page/${pageNumber}`,
  })
}

export default async function NewsletterPaginationPage(props: {
  params: Promise<{ page: string }>
}) {
  const params = await props.params
  const pageNumber = parseInt(params.page, 10)
  const posts = await getLatestButtondownPosts()
  const totalPages = getNewsletterTotalPages(posts.length)

  if (Number.isNaN(pageNumber) || pageNumber < 1 || pageNumber > totalPages) {
    return notFound()
  }

  const paginatedPosts = getPaginatedButtondownPosts(posts, pageNumber)

  return (
    <NewsletterArchive posts={paginatedPosts} currentPage={pageNumber} totalPages={totalPages} />
  )
}
