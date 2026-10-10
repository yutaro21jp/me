import Link from '@/components/Link'
import { formatDate } from 'pliny/utils/formatDate'
import { allAuthors } from 'contentlayer/generated'
import Image from '@/components/Image'
import SocialIcon from '@/components/social-icons'
import { imageOrFallback } from '@/data/imageDefaults'
import AuthorCompany from '@/components/AuthorCompany'
import ProfileQrButton from '@/components/ProfileQrButton'

type FeaturedPost = {
  slug: string
  date: string
  title: string
  summary?: string
  images?: string[]
}

export default function Home({ featuredPosts = [] }: { featuredPosts?: FeaturedPost[] }) {
  const author = allAuthors.find((p) => p.slug === 'default')
  if (!author) {
    return <p>Author not found</p>
  }

  return (
    <>
      <div>
        <div className="flex flex-col items-center space-y-2 border-b border-gray-200 pt-2 pb-8 md:space-y-5 dark:border-gray-700">
          <div className="flex flex-col items-center space-x-2">
            {author.avatar && (
              <div className="relative">
                <Image
                  src={author.avatar}
                  alt="avatar"
                  width={288}
                  height={288}
                  className="h-72 w-72 rounded-full"
                />
                <ProfileQrButton />
              </div>
            )}
            <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">{author.name}</h3>
            <div className="text-gray-500 dark:text-gray-400">{author.occupation}</div>
            <AuthorCompany company={author.company} companyUrl={author.companyUrl} />
            <div className="flex space-x-3 pt-6">
              {author.email && <SocialIcon kind="mail" href={`mailto:${author.email}`} />}
              {author.zap && <SocialIcon kind="zap" href={author.zap} noteId={author.noteId} />}
              {author.github && <SocialIcon kind="github" href={author.github} />}
              {author.nostr && <SocialIcon kind="nostr" href={author.nostr} />}
              {author.twitter && <SocialIcon kind="x" href={author.twitter} />}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              <Link
                href="/newsletter"
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium tracking-wide text-gray-700 transition hover:border-gray-400 hover:text-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:text-white"
              >
                English
              </Link>
              <Link
                href="/blog"
                className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium tracking-wide text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >
                日本語
              </Link>
            </div>
          </div>
        </div>
        {featuredPosts.length > 0 && (
          <section>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {featuredPosts.map((post) => (
                <li key={post.slug} className="py-12">
                  <article>
                    <div className="space-y-2 lg:grid lg:grid-cols-4 lg:items-baseline lg:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                          <time dateTime={post.date}>{formatDate(post.date, 'en-US')}</time>
                        </dd>
                      </dl>
                      <div className="space-y-5 lg:col-span-3">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl leading-8 font-bold tracking-tight">
                              <Link
                                href={`/blog/${post.slug}`}
                                className="text-gray-900 dark:text-gray-100"
                              >
                                {post.title}
                              </Link>
                            </h2>
                          </div>
                          <Link
                            href={`/blog/${post.slug}`}
                            aria-label={`Read ${post.title}`}
                            className="block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
                          >
                            <div className="relative aspect-video w-full">
                              <Image
                                src={imageOrFallback(post.images?.[0])}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>
                          {post.summary && (
                            <Link
                              href={`/blog/${post.slug}`}
                              aria-label={`Read ${post.title}`}
                              className="block"
                            >
                              <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                                {post.summary}
                              </div>
                            </Link>
                          )}
                        </div>
                        <div className="text-base leading-6 font-medium">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                            aria-label={`もっと読む: "${post.title}"`}
                          >
                            もっと読む &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            <div className="flex justify-end pt-2 pb-8 text-base leading-6 font-medium">
              <Link
                href="/blog"
                className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                aria-label="ブログ記事をもっと見る"
              >
                ブログ記事をもっと見る &rarr;
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
