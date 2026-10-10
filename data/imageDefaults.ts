export const FALLBACK_IMAGE = '/images/fallback.webp'

export function imageOrFallback(src?: string | null) {
  return src || FALLBACK_IMAGE
}
