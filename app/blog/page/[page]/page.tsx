import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { genPageMetadata } from 'app/seo'
import { isBlogListPost } from '@/lib/blog'

const POSTS_PER_PAGE = 5
function getVisiblePosts() {
  return allCoreContent(sortPosts(allBlogs)).filter(isBlogListPost)
}

export const generateStaticParams = async () => {
  const totalPages = Math.ceil(getVisiblePosts().length / POSTS_PER_PAGE)
  const paths = Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }))

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
    path: `/blog/page/${pageNumber}`,
  })
}

export default async function Page(props: { params: Promise<{ page: string }> }) {
  const params = await props.params
  const posts = getVisiblePosts()
  const pageNumber = parseInt(params.page as string)
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)

  // Return 404 for invalid page numbers or empty pages
  if (pageNumber <= 0 || pageNumber > totalPages || isNaN(pageNumber)) {
    return notFound()
  }
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
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
