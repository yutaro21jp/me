import { allTranslations } from 'contentlayer/generated'
import type { Translation } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { components as mdxComponents } from '@/components/MDXComponents'
import Image from '@/components/Image'
import SimpleLayout from '@/layouts/SimpleLayout'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'
import { notFound } from 'next/navigation'

export const metadata = genPageMetadata({
  title: 'Translations',
  path: '/translations',
  locale: 'en_US',
})

export default function Page() {
  const translation = allTranslations.find((p) => p.slug === 'default')

  if (!translation) {
    return notFound()
  }

  const mainContent = coreContent(translation)

  const components = {
    ...mdxComponents,
    Image,
  }

  return (
    <SimpleLayout content={mainContent} pagePath="/translations" titleAlign="left">
      <MDXLayoutRenderer code={translation.body.code} components={components} />
    </SimpleLayout>
  )
}
