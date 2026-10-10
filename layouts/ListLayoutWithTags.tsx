'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import Image from '@/components/Image'
import siteMetadata from '@/data/siteMetadata'
import { imageOrFallback } from '@/data/imageDefaults'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  featuredPosts?: {
    title: string
    summary?: string
    image?: string
    href: string
    eyebrow?: string
  }[]
}

const tagDisplayNameMap = {
  bitcoin: 'ビットコイン',
  nostr: 'Nostr',
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const segments = pathname.split('/')
  const lastSegment = segments[segments.length - 1]
  const basePath = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/page\/\d+\/?$/, '') // Remove any trailing /page
    .replace(/\/$/, '') // Remove trailing slash
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!prevPage}>
            前
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
          >
            前
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button className="cursor-auto disabled:opacity-50" disabled={!nextPage}>
            次
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next">
            次
          </Link>
        )}
      </nav>
    </div>
  )
}

function CategorySidebarContent({
  pathname,
  sortedTags,
  tagCounts,
}: {
  pathname: string
  sortedTags: string[]
  tagCounts: Record<string, number>
}) {
  return (
    <>
      {pathname.startsWith('/blog') ? (
        <h3 className="text-primary-500 font-bold uppercase">Category</h3>
      ) : (
        <Link
          href={`/blog`}
          className="hover:text-primary-500 dark:hover:text-primary-500 font-bold text-gray-700 uppercase dark:text-gray-300"
        >
          All posts
        </Link>
      )}
      <ul>
        {sortedTags.map((t) => {
          const displayText = tagDisplayNameMap[t] || t
          const isNostr = t.toLowerCase() === 'nostr'
          return (
            <li key={t} className="my-3">
              {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                <h3
                  className={`text-primary-500 inline px-3 py-2 text-sm font-bold ${isNostr ? '' : 'uppercase'}`.trim()}
                >
                  {`${displayText} (${tagCounts[t]})`}
                </h3>
              ) : (
                <Link
                  href={`/tags/${slug(t)}`}
                  className={`hover:text-primary-500 dark:hover:text-primary-500 px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-300 ${isNostr ? '' : 'uppercase'}`.trim()}
                  aria-label={`View posts tagged ${t}`}
                >
                  {`${displayText} (${tagCounts[t]})`}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  featuredPosts = [],
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="pt-6 pb-6">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-24">
          <div className="hidden max-w-[280px] min-w-[280px] sm:block">
            <div className="sticky top-6 rounded-sm bg-gray-50 pt-5 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40">
              <div className="max-h-[calc(100vh-3rem)] overflow-auto px-6 py-4">
                <CategorySidebarContent
                  pathname={pathname}
                  sortedTags={sortedTags}
                  tagCounts={tagCounts}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="pb-6 sm:hidden">
              <div className="rounded-sm bg-gray-50 shadow-md dark:bg-gray-900/70 dark:shadow-gray-800/40">
                <div className="px-6 py-4">
                  <CategorySidebarContent
                    pathname={pathname}
                    sortedTags={sortedTags}
                    tagCounts={tagCounts}
                  />
                </div>
              </div>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {featuredPosts.map((post) => (
                <li key={post.href} className="py-5">
                  <article className="flex flex-col gap-4 xl:gap-5">
                    {post.eyebrow && (
                      <dl>
                        <dt className="sr-only">Type</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          {post.eyebrow}
                        </dd>
                      </dl>
                    )}
                    <div className="space-y-4 md:space-y-4">
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl leading-8 font-bold tracking-tight">
                            <Link href={post.href} className="text-gray-900 dark:text-gray-100">
                              {post.title}
                            </Link>
                          </h2>
                        </div>
                        <Link
                          href={post.href}
                          aria-label={`Link to ${post.title}`}
                          className="block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                        >
                          <div className="relative aspect-video w-full">
                            <Image
                              alt={post.title}
                              src={imageOrFallback(post.image)}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </Link>
                        {post.summary && (
                          <Link
                            href={post.href}
                            aria-label={`Read ${post.title}`}
                            className="block"
                          >
                            <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                              {post.summary}
                            </div>
                          </Link>
                        )}
                        <div className="text-base leading-6 font-medium">
                          <Link
                            href={post.href}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`Read more: "${post.title}"`}
                          >
                            続きを読む &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags, images } = post
                const coverImage = imageOrFallback(Array.isArray(images) ? images[0] : undefined)
                return (
                  <li key={path} className="py-5">
                    <article className="flex flex-col gap-4 xl:gap-5">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-4 md:space-y-4">
                        <div className="space-y-3">
                          <div>
                            <h2 className="text-2xl leading-8 font-bold tracking-tight">
                              <Link href={`/${path}`} className="text-gray-900 dark:text-gray-100">
                                {title}
                              </Link>
                            </h2>
                            <div className="flex flex-wrap">
                              {tags?.map((tag) => (
                                <Tag key={tag} text={tag} />
                              ))}
                            </div>
                          </div>
                          <Link
                            href={`/${path}`}
                            aria-label={`Link to ${title}`}
                            className="block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                          >
                            <div className="relative aspect-video w-full">
                              <Image alt={title} src={coverImage} fill className="object-cover" />
                            </div>
                          </Link>
                          <Link href={`/${path}`} aria-label={`Read ${title}`} className="block">
                            <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                              {summary}
                            </div>
                          </Link>
                          <div className="text-base leading-6 font-medium">
                            <Link
                              href={`/${path}`}
                              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                              aria-label={`Read more: "${title}"`}
                            >
                              続きを読む &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
