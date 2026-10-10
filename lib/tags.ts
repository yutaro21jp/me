export const COLUMN_TAG = 'column'

const tagDisplayNames: Record<string, string> = {
  bitcoin: 'ビットコイン',
  nostr: 'Nostr',
  [COLUMN_TAG]: 'コラム',
}

export function getTagDisplayName(tag: string) {
  return tagDisplayNames[tag.toLowerCase()] || tag.split(' ').join('-')
}
