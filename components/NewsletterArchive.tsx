import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import NewsletterPosts from '@/components/NewsletterPosts'
import NewsletterSidebarForm from '@/components/NewsletterSidebarForm'

type NewsletterArchiveProps = {
  posts: Parameters<typeof NewsletterPosts>[0]['posts']
  currentPage: number
  totalPages: number
}

export default function NewsletterArchive({
  posts,
  currentPage,
  totalPages,
}: NewsletterArchiveProps) {
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-4 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          Newsletter
        </h1>
      </div>
      <div className="pb-6 sm:flex sm:space-x-24">
        {siteMetadata.newsletter?.provider && (
          <div className="mb-8 sm:mb-0 sm:w-[280px] sm:min-w-[280px]">
            <div className="rounded-sm bg-gray-50 pt-5 shadow-md sm:sticky sm:top-6 dark:bg-gray-900/70 dark:shadow-gray-800/40">
              <div className="px-6 py-4 sm:max-h-[calc(100vh-3rem)] sm:overflow-auto">
                <NewsletterSidebarForm />
              </div>
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <NewsletterPosts posts={posts} />
          {totalPages > 1 && (
            <div className="space-y-2 pt-6 pb-8 md:space-y-5">
              <nav className="flex justify-between">
                {!prevPage && (
                  <button className="cursor-auto disabled:opacity-50" disabled>
                    Previous
                  </button>
                )}
                {prevPage && (
                  <Link
                    href={
                      currentPage - 1 === 1 ? '/newsletter' : `/newsletter/page/${currentPage - 1}`
                    }
                    rel="prev"
                  >
                    Previous
                  </Link>
                )}
                <span>
                  {currentPage} of {totalPages}
                </span>
                {!nextPage && (
                  <button className="cursor-auto disabled:opacity-50" disabled>
                    Next
                  </button>
                )}
                {nextPage && (
                  <Link href={`/newsletter/page/${currentPage + 1}`} rel="next">
                    Next
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
