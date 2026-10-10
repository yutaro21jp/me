import 'css/prism.css'
import 'katex/dist/katex.css'

import { components as mdxComponents } from '@/components/MDXComponents'
import Image from '@/components/Image'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { sortPosts, coreContent, allCoreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors } from 'contentlayer/generated'
import type { Authors, Blog } from 'contentlayer/generated'
import PostSimple from '@/layouts/PostSimple'
import PostLayout from '@/layouts/PostLayout'
import PostBanner from '@/layouts/PostBanner'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import { serializeJsonLd } from '@/lib/jsonLd'
import { notFound } from 'next/navigation'

const defaultLayout = 'PostLayout'
const layouts = {
  PostSimple,
  PostLayout,
  PostBanner,
}
const visibleBlogs =
  process.env.NODE_ENV === 'production' ? allBlogs.filter((post) => post.draft !== true) : allBlogs

function getAuthorDetails(authorList: string[]) {
  const requestedAuthors = authorList.length > 0 ? authorList : ['default']
  const details = requestedAuthors
    .map((author) => allAuthors.find((p) => p.slug === author))
    .filter((author): author is Authors => Boolean(author))

  if (details.length > 0) {
    return details.map((author) => coreContent(author))
  }

  const fallbackAuthor = allAuthors.find((p) => p.slug === 'default')
  return fallbackAuthor ? [coreContent(fallbackAuthor)] : []
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata | undefined> {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = visibleBlogs.find((p) => p.slug === slug)
  const authorList = post?.authors || ['default']
  if (!post) {
    return
  }
  const authorDetails = getAuthorDetails(authorList)

  const publishedAt = new Date(post.date).toISOString()
  const modifiedAt = new Date(post.lastmod || post.date).toISOString()
  const authors = authorDetails.map((author) => author.name)
  const ogLocale = siteMetadata.locale?.replace('-', '_') || 'ja_JP'
  let imageList = [siteMetadata.socialBanner]
  if (post.images) {
    imageList = typeof post.images === 'string' ? [post.images] : post.images
  }
  const ogImages = imageList.map((img) => {
    return {
      url: img && img.includes('http') ? img : siteMetadata.siteUrl + img,
    }
  })
  const canonical = post.canonicalUrl || `/${post.path}`

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      siteName: siteMetadata.title,
      locale: ogLocale,
      type: 'article',
      publishedTime: publishedAt,
      modifiedTime: modifiedAt,
      url: canonical,
      images: ogImages,
      authors: authors.length > 0 ? authors : [siteMetadata.author],
    },
  }
}

export const generateStaticParams = async () => {
  return visibleBlogs.map((p) => ({ slug: p.slug.split('/').map((name) => decodeURI(name)) }))
}

export default async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params
  const slug = decodeURI(params.slug.join('/'))
  const post = visibleBlogs.find((p) => p.slug === slug) as Blog

  if (!post) {
    return notFound()
  }

  const sortedCoreContents = allCoreContent(sortPosts(visibleBlogs))
  const postIndex = sortedCoreContents.findIndex((p) => p.slug === slug)
  if (postIndex === -1) {
    return notFound()
  }

  const prev = sortedCoreContents[postIndex + 1]
  const next = sortedCoreContents[postIndex - 1]
  const authorList = post?.authors || ['default']
  const authorDetails = getAuthorDetails(authorList)
  const mainContent = coreContent(post)
  const jsonLd = { ...post.structuredData }
  jsonLd['author'] = authorDetails.map((author) => {
    return {
      '@type': 'Person',
      name: author.name || siteMetadata.author,
    }
  })

  const Layout = layouts[post.layout || defaultLayout] || layouts[defaultLayout]
  const breadcrumbList = [
    {
      '@type': 'ListItem',
      position: 1,
      name: siteMetadata.title,
      item: siteMetadata.siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: `${siteMetadata.siteUrl}/blog`,
    },
  ]
  const slugParts = post.path.split('/').slice(1) // drop leading "blog"
  slugParts.forEach((part, index) => {
    const href = `${siteMetadata.siteUrl}/blog/${slugParts.slice(0, index + 1).join('/')}`
    breadcrumbList.push({
      '@type': 'ListItem',
      position: index + 3,
      name: index === slugParts.length - 1 ? post.title : decodeURIComponent(part),
      item: href,
    })
  })
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbList,
  }

  const components = {
    ...mdxComponents,
    Image,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <Layout content={mainContent} authorDetails={authorDetails} next={next} prev={prev}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </Layout>
    </>
  )
}
