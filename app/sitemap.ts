import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { getLatestButtondownPosts, getNewsletterTotalPages } from '@/lib/buttondown'
import { isBlogListPost, isColumnPost } from '@/lib/blog'
import { getArchivePage } from '@/lib/pagination'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = siteMetadata.siteUrl

  const publishedPosts = allBlogs.filter((post) => !post.draft)
  const blogRoutes = publishedPosts.map((post) => ({
    url: `${siteUrl}/${post.path}`,
    lastModified: post.lastmod || post.date,
  }))

  const routes = [
    '',
    'blog',
    'column',
    'newsletter',
    'projects',
    'tags',
    'about',
    'translations',
    'vibecoding',
  ].map((route) => ({
    url: `${siteUrl}/${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const blogPosts = publishedPosts.filter((post) => !isColumnPost(post))
  const regularBlogPosts = blogPosts.filter(isBlogListPost)
  const { totalPages: totalBlogPages } = getArchivePage(
    regularBlogPosts.length,
    1,
    blogPosts.length - regularBlogPosts.length
  )
  const blogPaginationRoutes =
    totalBlogPages > 1
      ? Array.from({ length: totalBlogPages - 1 }, (_, i) => {
          const page = i + 2
          return {
            url: `${siteUrl}/blog/page/${page}`,
            lastModified: new Date().toISOString().split('T')[0],
          }
        })
      : []

  const newsletterPosts = await getLatestButtondownPosts()
  const totalNewsletterPages = getNewsletterTotalPages(newsletterPosts.length)
  const newsletterPaginationRoutes =
    totalNewsletterPages > 1
      ? Array.from({ length: totalNewsletterPages - 1 }, (_, i) => {
          const page = i + 2
          return {
            url: `${siteUrl}/newsletter/page/${page}`,
            lastModified: new Date().toISOString().split('T')[0],
          }
        })
      : []

  return [...routes, ...blogRoutes, ...blogPaginationRoutes, ...newsletterPaginationRoutes]
}
