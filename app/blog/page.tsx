import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'

const POSTS_PER_PAGE = 5
const FEATURED_BLOG_PATH = 'blog/portfolio/bitcoin-resistance-1st'
const PROJECT_BLOG_PATH = 'blog/portfolio/blogstr'
const HIDDEN_BLOG_PATHS = new Set([FEATURED_BLOG_PATH, PROJECT_BLOG_PATH])

export const metadata = genPageMetadata({ title: 'Blog', path: '/blog' })

export default async function BlogPage(props: { searchParams: Promise<{ page: string }> }) {
  const sortedPosts = allCoreContent(sortPosts(allBlogs))
  const posts = sortedPosts.filter((post) => !HIDDEN_BLOG_PATHS.has(post.path))
  const featuredPost = sortedPosts.find((post) => post.path === FEATURED_BLOG_PATH)
  const projectPost = sortedPosts.find((post) => post.path === PROJECT_BLOG_PATH)
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }
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
