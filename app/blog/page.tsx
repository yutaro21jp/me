import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { isBlogListPost, isColumnPost } from '@/lib/blog'
import { getArchivePage } from '@/lib/pagination'

const FEATURED_BLOG_PATH = 'blog/bitcoin-resistance-1st'
const PROJECT_BLOG_PATH = 'blog/blogstr'

export const metadata = genPageMetadata({ title: 'Blog', path: '/blog' })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const sortedPosts = allCoreContent(sortPosts(allBlogs.filter((post) => !isColumnPost(post))))
  const posts = sortedPosts.filter(isBlogListPost)
  const featuredPost = sortedPosts.find((post) => post.path === FEATURED_BLOG_PATH)
  const projectPost = sortedPosts.find((post) => post.path === PROJECT_BLOG_PATH)
  const pageNumber = 1
  const featuredPosts = [
    ...(projectPost
      ? [
          {
            title: projectPost.title,
            summary: projectPost.summary,
            image: projectPost.images?.[0],
            href: `/${projectPost.path}`,
            eyebrow: 'Project',
          },
        ]
      : []),
    ...(featuredPost
      ? [
          {
            title: featuredPost.title,
            summary: featuredPost.summary,
            image: featuredPost.images?.[0],
            href: `/${featuredPost.path}`,
            eyebrow: 'Book',
          },
        ]
      : []),
  ]
  const { totalPages, startIndex, endIndex } = getArchivePage(
    posts.length,
    pageNumber,
    featuredPosts.length
  )
  const initialDisplayPosts = posts.slice(startIndex, endIndex)
  const pagination = { currentPage: pageNumber, totalPages }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Blog"
      featuredPosts={featuredPosts}
    />
  )
}
