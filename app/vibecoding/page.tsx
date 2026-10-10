import { allVibecodings } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { components as mdxComponents } from '@/components/MDXComponents'
import Image from '@/components/Image'
import SimpleLayout from '@/layouts/SimpleLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'

const vibecoding = allVibecodings.find((item) => item.slug === 'default')

export const metadata = genPageMetadata({
  title: vibecoding?.title || 'バイブコーディング',
  description: vibecoding?.summary,
  image: Array.isArray(vibecoding?.images) ? vibecoding.images[0] : vibecoding?.images,
  path: '/vibecoding',
  locale: 'ja_JP',
})

export default function Page() {
  if (!vibecoding) {
    return notFound()
  }

  const mainContent = coreContent(vibecoding)
  const components = {
    ...mdxComponents,
    Image,
  }

  return (
    <SimpleLayout content={mainContent} pagePath="/vibecoding" titleAlign="left">
      <MDXLayoutRenderer code={vibecoding.body.code} components={components} />
    </SimpleLayout>
  )
}
