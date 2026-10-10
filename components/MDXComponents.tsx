import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import MDXImage from './MDXImage'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Tweet from './ClientTweet'
import YouTube from './YouTube'
import NostrEmbed from './NostrEmbed'

export const components: MDXComponents = {
  img: MDXImage,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  Tweet,
  YouTube,
  NostrEmbed,
}
