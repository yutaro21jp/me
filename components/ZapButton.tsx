'use client'

import { proxyZapClick } from '@/lib/proxyZap'
import { Zap } from '@/components/social-icons/icons' // アイコンを再利用

type Props = {
  npub: string
  noteId?: string
  relays?: string
}

export default function ZapButton({ npub, noteId, relays }: Props) {
  const defaultRelays =
    'wss://nostr.mutinywallet.com,wss://relay.nostr.band,wss://relayable.org,wss://nos.lol,wss://nostr.bitcoiner.social,wss://yabu.me,wss://nostr-relay.nokotaro.com,wss://relay.nostr.wirednet.jp,wss://relay.damus.io,wss://relay.snort.social,wss://nostr.wine,wss://relay.nostr.band'

  return (
    <button
      onClick={proxyZapClick}
      data-npub={npub}
      {...(noteId && { 'data-note-id': noteId })}
      data-relays={relays || defaultRelays}
      className="border-primary-500/50 bg-primary-500/10 text-primary-500 hover:bg-primary-500/20 dark:border-primary-400/50 dark:bg-primary-400/10 dark:text-primary-400 dark:hover:bg-primary-400/20 inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm font-medium transition"
    >
      <Zap className="h-5 w-5 fill-current" />
      <span>Zap</span>
    </button>
  )
}
