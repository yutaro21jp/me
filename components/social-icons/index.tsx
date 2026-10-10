'use client'

import { proxyZapClick } from '@/lib/proxyZap'
import {
  Zap,
  Mail,
  Github,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  X,
  Mastodon,
  Threads,
  Instagram,
  Medium,
  Bluesky,
  Nostr,
} from './icons'

const components = {
  zap: Zap,
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  x: X,
  mastodon: Mastodon,
  threads: Threads,
  instagram: Instagram,
  medium: Medium,
  bluesky: Bluesky,
  nostr: Nostr,
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: number
  noteId?: string
}

const SocialIcon = ({ kind, href, size = 8, noteId }: SocialIconProps) => {
  const SocialSvg = components[kind]

  if (kind === 'zap') {
    return (
      <button
        className="text-sm text-gray-500 transition hover:text-gray-600"
        data-npub={href} // Use href for npub
        {...(noteId && { 'data-note-id': noteId })}
        data-relays="wss://nostr.mutinywallet.com,wss://relay.nostr.band,wss://relayable.org,wss://nos.lol,wss://nostr.bitcoiner.social,wss://yabu.me,wss://nostr-relay.nokotaro.com,wss://relay.nostr.wirednet.jp,wss://relay.damus.io,wss://relay.snort.social,wss://nostr.wine,wss://relay.nostr.band"
        onClick={proxyZapClick}
      >
        <span className="sr-only">{kind}</span>
        <SocialSvg
          className={`hover:text-primary-500 dark:hover:text-primary-400 fill-current text-gray-700 dark:text-gray-200 h-${size} w-${size}`}
        />
      </button>
    )
  }

  if (
    !href ||
    (kind === 'mail' && !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))
  )
    return null

  return (
    <a
      className="text-sm text-gray-500 transition hover:text-gray-600"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
    >
      <span className="sr-only">{kind}</span>
      <SocialSvg
        className={`hover:text-primary-500 dark:hover:text-primary-400 fill-current text-gray-700 dark:text-gray-200 h-${size} w-${size}`}
      />
    </a>
  )
}

export default SocialIcon
