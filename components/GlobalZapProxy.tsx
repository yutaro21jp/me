'use client'

import { useEffect } from 'react'

type Props = {
  npub?: string
}

// 画面には出さない、初期化用の永続ボタン
export default function GlobalZapProxy({ npub }: Props) {
  useEffect(() => {
    // CDN の @latest を実行せず、lockfile で固定したコードをクライアントでだけ読み込む。
    void import('nostr-zap').catch(() => {
      console.error('Zapを初期化できませんでした。')
    })
  }, [])

  return (
    <button
      id="zap-proxy"
      // 初期値は渡されたnpub、なければダミー
      data-npub={npub || 'npub1dummy'}
      style={{ position: 'fixed', left: -9999, top: -9999, opacity: 0 }}
      aria-hidden="true"
      tabIndex={-1}
    >
      proxy
    </button>
  )
}
