'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'

type TweetProps = {
  id: string
}

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement | null) => void
      }
    }
  }
}

export default function ClientTweet({ id }: TweetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const href = `https://twitter.com/i/status/${id}`

  const loadTweet = () => {
    window.twttr?.widgets?.load(containerRef.current)
  }

  useEffect(() => {
    loadTweet()
  }, [id])

  return (
    <div ref={containerRef} className="my-6 flex justify-center">
      <Script
        id="x-widgets"
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={loadTweet}
      />
      <blockquote className="twitter-tweet" data-dnt="true">
        <a href={href}>View post on X</a>
      </blockquote>
    </div>
  )
}
