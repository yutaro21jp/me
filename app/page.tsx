import { allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const featuredSlugs = [
    'blogstr',
    'bitcoin-resistance-1st',
    'bitcoin-raabbit-hole-original-items',
    'anap-brand-channel',
    'bitcoin-tokyo-2024',
  ]
  const featuredPosts = featuredSlugs
    .map((slug) => allBlogs.find((post) => post.slug === slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))
  const featuredCorePosts = allCoreContent(featuredPosts)

  return <Main featuredPosts={featuredCorePosts} />
}
