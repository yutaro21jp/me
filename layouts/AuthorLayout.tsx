import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import AuthorCompany from '@/components/AuthorCompany'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const {
    name,
    avatar,
    occupation,
    company,
    companyUrl,
    email,
    twitter,
    github,
    zap,
    nostr,
    noteId,
  } = content

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 lg:grid lg:grid-cols-3 lg:space-y-0 lg:gap-x-8">
          <div className="pt-8 lg:sticky lg:top-6">
            <div className="flex flex-col items-center space-x-2">
              {avatar && (
                <Image
                  src={avatar}
                  alt="avatar"
                  width={288}
                  height={288}
                  className="h-72 w-72 rounded-full"
                />
              )}
              <h3 className="pt-4 pb-2 text-2xl leading-8 font-bold tracking-tight">{name}</h3>
              <div className="text-gray-500 dark:text-gray-400">{occupation}</div>
              <AuthorCompany company={company} companyUrl={companyUrl} />
              <div className="flex space-x-3 pt-6">
                <SocialIcon kind="mail" href={`mailto:${email}`} />
                {zap && <SocialIcon kind="zap" href={zap} noteId={noteId} />}
                <SocialIcon kind="github" href={github} />
                <SocialIcon kind="nostr" href={nostr} />
                <SocialIcon kind="x" href={twitter} />
              </div>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none pt-8 pb-8 lg:col-span-2">
            {children}
          </div>
        </div>
      </div>
    </>
  )
}
