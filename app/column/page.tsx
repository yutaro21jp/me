import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { isColumnPost } from '@/lib/blog'
import { COLUMN_COVER_IMAGE } from '@/data/imageDefaults'
import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: 'コラム',
  description: 'これから世界はどう変わっていくのか。その中で、ビットコインはどんな意味を持つのか。',
  path: '/column',
  image: COLUMN_COVER_IMAGE,
  twitter: { card: 'summary_large_image' },
  alternates: {
    canonical: '/column',
    types: { 'application/rss+xml': `${siteMetadata.siteUrl}/column/feed.xml` },
  },
})

export default function ColumnPage() {
  const posts = allCoreContent(sortPosts(allBlogs.filter(isColumnPost)))
  return <ListLayout posts={posts} initialDisplayPosts={posts} title="コラム" listStyle="compact" />
}
