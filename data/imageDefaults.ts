export const FALLBACK_IMAGE = '/images/fallback.webp'
export const COLUMN_COVER_IMAGE = '/images/column-cover.webp'

export function imageOrFallback(src?: string | null) {
  return src || FALLBACK_IMAGE
}
