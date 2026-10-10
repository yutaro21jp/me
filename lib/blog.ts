import { slug } from 'github-slugger'
import { COLUMN_TAG } from './tags'
import { COLUMN_COVER_IMAGE } from '../data/imageDefaults'

const FEATURED_BLOG_PATHS = new Set(['blog/bitcoin-resistance-1st', 'blog/blogstr'])

export function isColumnPost(post: { tags?: string[] }) {
  return post.tags?.some((tag) => slug(tag) === COLUMN_TAG) ?? false
}

export function isBlogListPost(post: { path: string; tags?: string[] }) {
  return !isColumnPost(post) && !FEATURED_BLOG_PATHS.has(post.path)
}

export function getPostImages(post: { tags?: string[]; images?: string | string[] }) {
  if (isColumnPost(post)) return [COLUMN_COVER_IMAGE]
  if (typeof post.images === 'string') return [post.images]
  return post.images || []
}
