import { ARCHIVE_POSTS_PER_PAGE, getArchivePage } from './pagination'

const RSS_FETCH_LIMIT = 100
const BUTTONDOWN_RSS_URL = `https://buttondown.com/yutaro/rss?count=${RSS_FETCH_LIMIT}`
const RSS_REVALIDATE_SECONDS = 60 * 60
const MAX_DESCRIPTION_LENGTH = 220
export const NEWSLETTER_POSTS_PER_PAGE = ARCHIVE_POSTS_PER_PAGE
export const NEWSLETTER_FIXED_ITEMS_ON_FIRST_PAGE = 2

export type ButtondownPost = {
  date: string
  title: string
  summary: string
  url: string
  image?: string
}

function extractTagValue(block: string, tagName: string) {
  const pattern = new RegExp(`<${tagName}>([\\s\\S]*?)</${tagName}>`, 'i')
  const match = block.match(pattern)
  return match ? match[1].trim() : ''
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
}

function stripHtml(value: string) {
  return decodeXmlEntities(value)
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value
  }

  return `${value.slice(0, maxLength - 1).trimEnd()}…`
}

function extractFirstImageSrc(value: string) {
  const decoded = decodeXmlEntities(value)
  const match = decoded.match(/<img[^>]+src=["']([^"'<>]+)["']/i)
  return match ? match[1] : undefined
}

function parseRssItems(xml: string): ButtondownPost[] {
  const itemMatches = xml.match(/<item\b[\s\S]*?<\/item>/gi) || []

  return itemMatches.slice(0, RSS_FETCH_LIMIT).flatMap((item) => {
    const title = stripHtml(extractTagValue(item, 'title'))
    const url = stripHtml(extractTagValue(item, 'link'))
    const date = stripHtml(extractTagValue(item, 'pubDate'))
    const summarySource =
      extractTagValue(item, 'description') || extractTagValue(item, 'content:encoded')
    const summary = truncate(stripHtml(summarySource), MAX_DESCRIPTION_LENGTH)
    const image = extractFirstImageSrc(summarySource)

    if (!title || !url || !date) {
      return []
    }

    const parsedDate = new Date(date)
    if (Number.isNaN(parsedDate.getTime())) {
      return []
    }

    return [
      {
        date: parsedDate.toISOString(),
        title,
        summary,
        url,
        image,
      },
    ]
  })
}

export async function getLatestButtondownPosts(): Promise<ButtondownPost[]> {
  try {
    const response = await fetch(BUTTONDOWN_RSS_URL, {
      next: { revalidate: RSS_REVALIDATE_SECONDS },
    })

    if (!response.ok) {
      return []
    }

    const xml = await response.text()
    return parseRssItems(xml)
  } catch {
    return []
  }
}

export function getPaginatedButtondownPosts(posts: ButtondownPost[], pageNumber: number) {
  const { startIndex, endIndex } = getArchivePage(
    posts.length,
    pageNumber,
    NEWSLETTER_FIXED_ITEMS_ON_FIRST_PAGE
  )
  return posts.slice(startIndex, endIndex)
}

export function getNewsletterTotalPages(totalRssPosts: number) {
  return getArchivePage(totalRssPosts, 1, NEWSLETTER_FIXED_ITEMS_ON_FIRST_PAGE).totalPages
}
