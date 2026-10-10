'use client'

import { FormEvent, useRef, useState } from 'react'

export default function NewsletterSidebarForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const websiteRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const email = inputRef.current?.value?.trim()
    if (!email) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, website: websiteRef.current?.value || '' }),
      })
      const data = await response.json()

      if (data.error) {
        setError(true)
        setMessage('Your e-mail address is invalid or you are already subscribed.')
        return
      }

      if (inputRef.current) {
        inputRef.current.value = ''
      }
      setError(false)
      setMessage('')
      setSubscribed(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-primary-500 text-sm font-bold uppercase">Subscribe to my newsletter</h2>
      <div className="my-3">
        <form className="space-y-3" onSubmit={subscribe}>
          <label className="absolute top-auto -left-[10000px] h-px w-px overflow-hidden">
            Leave this field empty
            <input ref={websiteRef} name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="block" htmlFor="newsletter-email-input">
            <span className="sr-only">Email address</span>
            <input
              ref={inputRef}
              id="newsletter-email-input"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={subscribed || isSubmitting}
              placeholder={subscribed ? "You're subscribed! 🎉" : 'Email address'}
              className="focus:ring-primary-600 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-default disabled:opacity-70 dark:border-gray-700 dark:bg-black dark:text-gray-100"
            />
          </label>
          <button
            type="submit"
            disabled={subscribed || isSubmitting}
            className="bg-primary-500 focus:ring-primary-600 w-full rounded-md px-4 py-2.5 font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-default disabled:opacity-70 dark:focus:ring-offset-gray-900"
          >
            {subscribed ? 'Thank you!' : isSubmitting ? 'Submitting...' : 'Sign up'}
          </button>
        </form>
      </div>
      {error && <p className="text-sm text-red-500 dark:text-red-400">{message}</p>}
    </div>
  )
}
