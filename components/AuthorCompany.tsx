import Link from '@/components/Link'

type Props = {
  company?: string
  companyUrl?: string
}

export default function AuthorCompany({ company, companyUrl }: Props) {
  if (!company) return null

  if (!companyUrl) {
    return <div className="text-gray-500 dark:text-gray-400">{company}</div>
  }

  const linkLabel = 'Blogstr'
  const [before, after] = company.split(linkLabel)

  if (after === undefined) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        <Link href={companyUrl} className="hover:text-primary-500 dark:hover:text-primary-400">
          {company}
        </Link>
      </div>
    )
  }

  return (
    <div className="text-gray-500 dark:text-gray-400">
      {before}
      <Link href={companyUrl} className="hover:text-primary-500 dark:hover:text-primary-400">
        {linkLabel}
      </Link>
      {after}
    </div>
  )
}
