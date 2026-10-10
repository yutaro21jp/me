import Link from 'next/link'
import { getTagDisplayName, getTagHref } from '@/lib/tags'
interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  const displayText = getTagDisplayName(text)
  const isNostr = text.toLowerCase() === 'nostr'
  const baseClass =
    'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium'

  return (
    <Link href={getTagHref(text)} className={`${baseClass} ${isNostr ? '' : 'uppercase'}`.trim()}>
      {displayText}
    </Link>
  )
}

export default Tag
