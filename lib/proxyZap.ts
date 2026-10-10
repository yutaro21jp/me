export function proxyZapClick(e: React.MouseEvent<HTMLElement>) {
  const target = e.currentTarget as HTMLElement

  // 表のボタンに data-* を普通に載せておく
  const npub = target.getAttribute('data-npub')
  if (!npub) return // npubが無ければ何もしない（フォールバックは任意で）

  const relays = target.getAttribute('data-relays') || ''
  const noteId = target.getAttribute('data-note-id') || target.getAttribute('data-naddr') || ''

  const proxy = document.getElementById('zap-proxy') as HTMLElement | null
  if (!proxy) return

  // 代理ボタンに属性を移して…
  proxy.setAttribute('data-npub', npub)
  if (relays) proxy.setAttribute('data-relays', relays)
  else proxy.removeAttribute('data-relays')
  if (noteId) proxy.setAttribute('data-note-id', noteId)
  else proxy.removeAttribute('data-note-id')

  e.preventDefault() // 本来のリンク遷移を止める（後述フォールバックを使うなら外してOK）
  // …代理ボタンをプログラムクリック（初回に付いたリスナーが必ず走る）
  ;(proxy as HTMLButtonElement).click()
}
