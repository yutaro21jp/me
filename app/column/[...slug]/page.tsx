import ArticlePage, { getArticleMetadata, getArticleStaticParams } from '@/layouts/ArticlePage'

type Props = { params: Promise<{ slug: string[] }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return getArticleMetadata(`column/${decodeURI(slug.join('/'))}`)
}

export function generateStaticParams() {
  return getArticleStaticParams('column')
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <ArticlePage path={`column/${decodeURI(slug.join('/'))}`} />
}
