import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayout'

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Portfolio', path: '/portfolio' })

export default async function PortfolioPage(props: { searchParams: Promise<{ page: string }> }) {
  const portfolioPosts = allBlogs.filter((post) =>
    post._raw.flattenedPath.startsWith('blog/portfolio')
  )
  const posts = allCoreContent(sortPosts(portfolioPosts))
  const pageNumber = 1
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = posts.slice(0, POSTS_PER_PAGE * pageNumber)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Portfolio"
      showSearchBar={false}
    />
  )
}
