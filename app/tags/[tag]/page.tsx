import { slug } from 'github-slugger'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COLUMN_TAG, getTagDisplayName } from '@/lib/tags'
import { COLUMN_COVER_IMAGE } from '@/data/imageDefaults'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const tagPath = `/tags/${encodeURI(tag)}`
  return genPageMetadata({
    title: getTagDisplayName(tag),
    description: `${siteMetadata.title}の「${getTagDisplayName(tag)}」タグの記事一覧`,
    path: tagPath,
    ...(tag === COLUMN_TAG && {
      image: COLUMN_COVER_IMAGE,
      twitter: { card: 'summary_large_image' },
    }),
    alternates: {
      canonical: tagPath,
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${tag}/feed.xml`,
      },
    },
  })
}

export const generateStaticParams = async () => {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  return tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }))
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)

  if (!(tag in tagData)) {
    return notFound()
  }

  const title = getTagDisplayName(tag)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)))
  )
  const isColumn = tag === COLUMN_TAG
  const initialDisplayPosts = isColumn ? filteredPosts : filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = isColumn
    ? undefined
    : {
        currentPage: 1,
        totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
      }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title={title}
      listStyle={isColumn ? 'compact' : 'default'}
    />
  )
}
