import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Translation, Vibecoding } from 'contentlayer/generated'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

interface LayoutProps {
  content: CoreContent<Translation> | CoreContent<Vibecoding>
  pagePath: string
  children: ReactNode
  titleAlign?: 'left' | 'center'
}

export default function SimpleLayout({
  content,
  pagePath,
  children,
  titleAlign = 'center',
}: LayoutProps) {
  const { title, filePath } = content
  const editUrl = `${siteMetadata.siteRepo}/blob/main/data/${filePath}`
  const discussUrl = `https://mobile.twitter.com/search?q=${encodeURIComponent(new URL(pagePath, siteMetadata.siteUrl).href)}`

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div
              className={`space-y-2 border-b border-gray-200 pt-6 pb-8 md:space-y-5 dark:border-gray-700 ${titleAlign === 'left' ? 'text-left' : 'text-center'}`}
            >
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 pb-8 xl:divide-y-0 dark:divide-gray-700">
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0 dark:divide-gray-700">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
              <div className="pt-6 pb-6 text-sm text-gray-700 dark:text-gray-300">
                <Link href={discussUrl} rel="nofollow">
                  Xで検索する
                </Link>
                {` • `}
                <Link href={editUrl} rel="nofollow">
                  GitHubで見る
                </Link>
              </div>
              {siteMetadata.comments?.provider && (
                <div
                  className="pt-6 pb-6 text-center text-gray-700 dark:text-gray-300"
                  id="comment"
                >
                  <Comments slug={pagePath.replace(/^\//, '')} />
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
