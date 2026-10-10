export const ARCHIVE_POSTS_PER_PAGE = 10

export function getArchivePage(
  totalPosts: number,
  pageNumber: number,
  featuredItemsOnFirstPage = 0
) {
  const firstPageSize = Math.max(0, ARCHIVE_POSTS_PER_PAGE - featuredItemsOnFirstPage)
  const remainingPosts = Math.max(0, totalPosts - firstPageSize)
  const totalPages = 1 + Math.ceil(remainingPosts / ARCHIVE_POSTS_PER_PAGE)
  const startIndex = pageNumber <= 1 ? 0 : firstPageSize + ARCHIVE_POSTS_PER_PAGE * (pageNumber - 2)
  const pageSize = pageNumber <= 1 ? firstPageSize : ARCHIVE_POSTS_PER_PAGE

  return { totalPages, startIndex, endIndex: startIndex + pageSize }
}
