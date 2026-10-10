import ArticlePage, { getArticleMetadata, getArticleStaticParams } from '@/layouts/ArticlePage'

type Props = { params: Promise<{ slug: string[] }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return getArticleMetadata(`blog/${decodeURI(slug.join('/'))}`)
}

export function generateStaticParams() {
  return getArticleStaticParams('blog')
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <ArticlePage path={`blog/${decodeURI(slug.join('/'))}`} />
}
