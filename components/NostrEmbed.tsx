'use client'

type NostrEmbedProps = {
  noteId: string
  className?: string
}

export default function NostrEmbed({ noteId, className }: NostrEmbedProps) {
  return (
    <div
      className={`mb-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 ${className || ''}`}
    >
      <iframe
        src={`https://njump.me/${noteId}`}
        title={`Nostr review ${noteId}`}
        loading="lazy"
        className="block min-h-[520px] w-full bg-white"
        referrerPolicy="no-referrer"
      />
    </div>
  )
}
