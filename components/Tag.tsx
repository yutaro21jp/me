import Link from 'next/link'
import { slug } from 'github-slugger'
interface Props {
  text: string
}

const tagDisplayNameMap = {
  bitcoin: 'ビットコイン',
  nostr: 'Nostr',
}

const Tag = ({ text }: Props) => {
  const displayText = tagDisplayNameMap[text.toLowerCase()] || text
  const isNostr = text.toLowerCase() === 'nostr'
  const baseClass =
    'text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 mr-3 text-sm font-medium'

  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={`${baseClass} ${isNostr ? '' : 'uppercase'}`.trim()}
    >
      {displayText.split(' ').join('-')}
    </Link>
  )
}

export default Tag
