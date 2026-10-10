export async function proxyZapClick(e: React.MouseEvent<HTMLElement>) {
  e.preventDefault()
  // Capture the clicked target before awaiting the client-side library.
  const target = e.currentTarget
  const npub = target.getAttribute('data-npub')
  if (!npub) return

  const relays = target.getAttribute('data-relays') || ''
  const noteId = target.getAttribute('data-note-id') || target.getAttribute('data-naddr') || ''

  try {
    // A click can arrive before GlobalZapProxy's preload has finished.
    await import('nostr-zap')
  } catch {
    window.alert('Unable to load Zap. Please check your connection and try again.')
    return
  }

  const proxy = document.getElementById('zap-proxy') as HTMLButtonElement | null
  if (!proxy) return

  proxy.setAttribute('data-npub', npub)
  if (relays) proxy.setAttribute('data-relays', relays)
  else proxy.removeAttribute('data-relays')
  if (noteId) proxy.setAttribute('data-note-id', noteId)
  else proxy.removeAttribute('data-note-id')

  proxy.click()
}
