import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound, permanentRedirect } from 'next/navigation'
import { genPageMetadata } from 'app/seo'
import { isBlogListPost, isColumnPost } from '@/lib/blog'
import { getArchivePage } from '@/lib/pagination'

function getVisiblePosts() {
  const visiblePosts = allCoreContent(sortPosts(allBlogs.filter((post) => !isColumnPost(post))))
  const posts = visiblePosts.filter(isBlogListPost)
  return { posts, featuredCount: visiblePosts.length - posts.length }
}

export const generateStaticParams = async () => {
  const { posts, featuredCount } = getVisiblePosts()
  const { totalPages } = getArchivePage(posts.length, 1, featuredCount)
  const paths = Array.from({ length: totalPages - 1 }, (_, i) => ({ page: (i + 2).toString() }))

  return paths
}

export async function generateMetadata(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)

  if (isNaN(pageNumber) || pageNumber < 1) {
    return {}
  }

  return genPageMetadata({
    title: pageNumber === 1 ? 'Blog' : `Blog - Page ${pageNumber}`,
    path: pageNumber === 1 ? '/blog' : `/blog/page/${pageNumber}`,
  })
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const pageNumber = parseInt(params.page as string)
  if (pageNumber === 1) permanentRedirect('/blog')
  const { posts, featuredCount } = getVisiblePosts()
  const { totalPages, startIndex, endIndex } = getArchivePage(
    posts.length,
    pageNumber,
    featuredCount
  )

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(startIndex, endIndex)
  const pagination = {
    currentPage: pageNumber,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="Blog"
    />
  )
}
