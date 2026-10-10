import { slug } from 'github-slugger'

export const COLUMN_TAG = 'column'

const tagDisplayNames: Record<string, string> = {
  bitcoin: 'ビットコイン',
  nostr: 'Nostr',
  [COLUMN_TAG]: 'コラム',
}

export function getTagDisplayName(tag: string) {
  return tagDisplayNames[tag.toLowerCase()] || tag.split(' ').join('-')
}

export function getTagHref(tag: string) {
  const tagSlug = slug(tag)
  return tagSlug === COLUMN_TAG ? '/column' : `/tags/${tagSlug}`
}
