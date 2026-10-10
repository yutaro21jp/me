import Link from '@/components/Link'
import Image from '@/components/Image'
import { formatDate } from 'pliny/utils/formatDate'
import { imageOrFallback } from '@/data/imageDefaults'

export type NewsletterListItem = {
  date?: string
  eyebrow?: string
  title: string
  summary?: string
  url: string
  image?: string
}

export default function NewsletterPosts({ posts }: { posts: NewsletterListItem[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-10 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
        No newsletter posts found.
      </div>
    )
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
      {posts.map((post) => (
        <li key={post.url} className="py-5">
          <article className="flex flex-col gap-4 xl:gap-5">
            {(post.date || post.eyebrow) && (
              <dl>
                <dt className="sr-only">Published on</dt>
                <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                  {post.date ? (
                    <time dateTime={post.date}>{formatDate(post.date, 'en-US')}</time>
                  ) : (
                    post.eyebrow
                  )}
                </dd>
              </dl>
            )}
            <div className="space-y-4 md:space-y-4">
              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl leading-8 font-bold tracking-tight">
                    <Link href={post.url} className="text-gray-900 dark:text-gray-100">
                      {post.title}
                    </Link>
                  </h2>
                </div>
                <Link
                  href={post.url}
                  aria-label={`Read ${post.title}`}
                  className="block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                >
                  <div className="relative aspect-video w-full">
                    <Image
                      src={imageOrFallback(post.image)}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
                {post.summary && (
                  <Link href={post.url} aria-label={`Read ${post.title}`} className="block">
                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                      {post.summary}
                    </div>
                  </Link>
                )}
                <div className="text-base leading-6 font-medium">
                  <Link
                    href={post.url}
                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                    aria-label={`Read more: "${post.title}"`}
                  >
                    Read more &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  )
}
